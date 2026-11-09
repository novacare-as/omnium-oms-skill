/**
 * Regenerate api/ from Omnium's published OpenAPI spec.
 *
 * Every Swagger tag ("Orders | Get", "Customers | B2B", ...) becomes one file
 * under api/endpoints/<area>/<tag>.md, and every schema one file under
 * api/schemas/<Name>.md, with api/schemas/_INDEX.md listing them all. The
 * endpoint file and key schema tables in api/_INDEX.md and the API routing
 * table in SKILL.md are regenerated between their marker comments; everything
 * else in those files is hand-written.
 *
 * Output is deterministic (no timestamps), so a run against an unchanged spec
 * produces no git diff.
 *
 * Usage: npm run sync:api [-- --out api --skill SKILL.md]
 */

import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { dirname, join, posix, resolve } from "node:path";
import { parseArgs } from "node:util";
import { anchor, replaceBetweenMarkers } from "./markers.ts";

const SPEC_URL = "https://api.omnium.no/docs/oms/docs.json";
const SWAGGER_URL = "https://api.omnium.no/documentation";
const USER_AGENT = "omnium-oms-skill-sync (+https://github.com/novacare-as/omnium-oms-skill)";

// Documented once in api/_INDEX.md under "Standard error responses", so they are
// left out of each endpoint.
const STANDARD_RESPONSES = new Set(["429", "500"]);

// Schemas listed in api/_INDEX.md: the most used ones per area, plus a
// "Shared schemas" table for those used by endpoints in SHARED_AREAS or more
// areas. Schemas used in GENERIC_AREAS or more areas (like ProblemDetails) are
// too generic to say anything about an area and are left out of its list.
const KEY_SCHEMAS_PER_AREA = 8;
const SHARED_AREAS = 3;
const GENERIC_AREAS = 4;

const INDEX_MARKERS = {
  begin: "<!-- BEGIN generated endpoint files: see scripts/sync-api.ts -->",
  end: "<!-- END generated endpoint files -->",
};
const SKILL_MARKERS = {
  begin: "<!-- BEGIN generated API routing table: see scripts/sync-api.ts -->",
  end: "<!-- END generated API routing table -->",
};

// --- OpenAPI types (only the parts the spec uses) ---------------------------

interface Schema {
  $ref?: string;
  type?: string;
  format?: string;
  description?: string;
  nullable?: boolean;
  deprecated?: boolean;
  readOnly?: boolean;
  maxLength?: number;
  minLength?: number;
  enum?: (string | number)[];
  items?: Schema;
  properties?: Record<string, Schema>;
  additionalProperties?: Schema | boolean;
  required?: string[];
  allOf?: Schema[];
  oneOf?: Schema[];
  anyOf?: Schema[];
  example?: unknown;
}

interface Parameter {
  name: string;
  in: string;
  description?: string;
  required?: boolean;
  schema?: Schema;
}

interface Content {
  [mediaType: string]: { schema?: Schema };
}

interface Operation {
  tags?: string[];
  summary?: string;
  description?: string;
  operationId?: string;
  deprecated?: boolean;
  "x-preview"?: boolean;
  parameters?: Parameter[];
  requestBody?: { description?: string; required?: boolean; content?: Content };
  responses?: Record<string, { description?: string; content?: Content }>;
}

interface Spec {
  info: { title: string; version: string };
  paths: Record<string, Record<string, Operation>>;
  components: { schemas: Record<string, Schema> };
  tags?: { name: string; description?: string }[];
}

const METHODS = ["get", "post", "put", "patch", "delete"];

interface Endpoint {
  method: string;
  path: string;
  op: Operation;
}

interface Tag {
  name: string; // "Orders | Get"
  area: string; // "Orders"
  file: string; // "endpoints/orders/get.md", relative to the output directory
  description: string;
  endpoints: Endpoint[];
}

// --- Helpers ------------------------------------------------------------------

function slug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function tagFile(tag: string): { area: string; file: string } {
  const [area, ...rest] = tag.split("|").map((s) => s.trim());
  return { area, file: rest.length ? `endpoints/${slug(area)}/${slug(rest.join(" "))}.md` : `endpoints/${slug(area)}.md` };
}

function schemaFile(name: string): string {
  return `schemas/${name}.md`;
}

function refName(ref: string): string {
  return ref.slice(ref.lastIndexOf("/") + 1);
}

function cleanText(text: string | undefined): string {
  return (text ?? "")
    .replace(/\r/g, "")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/?code>/gi, "`")
    .replace(/<\/?(p|b|strong|i|em)>/gi, "")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function inline(text: string | undefined): string {
  return cleanText(text).replace(/\s*\n\s*/g, " ").replace(/\|/g, "\\|");
}

function typeOf(schema: Schema | undefined, fromFile: string): string {
  if (!schema) return "any";
  const link = (name: string) => `[\`${name}\`](${posix.relative(posix.dirname(fromFile), schemaFile(name))})`;
  if (schema.$ref) return link(refName(schema.$ref));
  const combined = schema.allOf ?? schema.oneOf ?? schema.anyOf;
  if (combined?.length) return combined.map((s) => typeOf(s, fromFile)).join(schema.allOf ? " & " : " \\| ");
  if (schema.type === "array") return `List<${typeOf(schema.items, fromFile)}>`;
  if (schema.type === "object" && schema.additionalProperties && typeof schema.additionalProperties === "object") {
    return `Dictionary<string, ${typeOf(schema.additionalProperties, fromFile)}>`;
  }
  let type = schema.type ?? "object";
  if (schema.format) type += ` (${schema.format})`;
  if (schema.enum) type += `: ${schema.enum.map((v) => `\`${v}\``).join(", ")}`;
  return type;
}

function bodyType(content: Content | undefined, fromFile: string): string | null {
  if (!content) return null;
  const json = Object.keys(content).find((t) => t.includes("json"));
  if (json) return typeOf(content[json].schema, fromFile);
  const [first] = Object.keys(content);
  return first ? `\`${first}\`` : null;
}

function referencedSchemas(op: Operation): Set<string> {
  const names = new Set<string>();
  const visit = (schema: Schema | undefined) => {
    if (!schema) return;
    if (schema.$ref) names.add(refName(schema.$ref));
    visit(schema.items);
    if (typeof schema.additionalProperties === "object") visit(schema.additionalProperties);
    for (const s of [...(schema.allOf ?? []), ...(schema.oneOf ?? []), ...(schema.anyOf ?? [])]) visit(s);
  };
  for (const p of op.parameters ?? []) visit(p.schema);
  for (const media of Object.values(op.requestBody?.content ?? {})) visit(media.schema);
  for (const resp of Object.values(op.responses ?? {})) for (const media of Object.values(resp.content ?? {})) visit(media.schema);
  return names;
}

// --- Rendering ----------------------------------------------------------------

function renderEndpoint({ method, path, op }: Endpoint, fromFile: string): string[] {
  const lines = [`## \`${method.toUpperCase()} ${path}\``, ""];
  if (op.summary) lines.push(`**${inline(op.summary)}**`, "");
  const flags = [
    op.operationId ? `Operation ID: \`${op.operationId}\`` : "",
    op.deprecated ? "**Deprecated**" : "",
    op["x-preview"] ? "**Preview**" : "",
  ].filter(Boolean);
  if (flags.length) lines.push(flags.join(" · "), "");
  const description = cleanText(op.description);
  if (description) lines.push(description, "");

  if (op.parameters?.length) {
    lines.push("| Param | In | Type | Required | Description |", "|-------|----|------|----------|-------------|");
    for (const p of op.parameters) {
      lines.push(`| \`${p.name}\` | ${p.in} | ${typeOf(p.schema, fromFile)} | ${p.required ? "Yes" : "No"} | ${inline(p.description)} |`);
    }
    lines.push("");
  }

  const body = bodyType(op.requestBody?.content, fromFile);
  if (body) {
    const note = inline(op.requestBody?.description);
    lines.push(`**Request body:** ${body}${note ? ` — ${note}` : ""}`, "");
  }

  const responses = Object.entries(op.responses ?? {})
    .filter(([code]) => !STANDARD_RESPONSES.has(code))
    .sort(([a], [b]) => a.localeCompare(b));
  if (responses.length) {
    lines.push("**Responses:**", "");
    for (const [code, resp] of responses) {
      const type = bodyType(resp.content, fromFile);
      const parts = [type, inline(resp.description)].filter(Boolean);
      lines.push(`- ${code}${parts.length ? `: ${parts.join(" — ")}` : ""}`);
    }
    lines.push("");
  }
  return lines;
}

function renderTag(tag: Tag): string {
  const lines = [`# ${tag.name}`, "", `Source: ${SWAGGER_URL}`];
  if (tag.description) lines.push("", `> ${inline(tag.description)}`);
  lines.push(
    "",
    "Generated from the Omnium OpenAPI spec by `scripts/sync-api.ts` — do not edit by hand.",
    "Common conventions and standard error responses (429, 500) are in `api/_INDEX.md`.",
  );
  for (const endpoint of tag.endpoints) lines.push("", "---", "", ...renderEndpoint(endpoint, tag.file));
  return lines.join("\n").replace(/\n{3,}/g, "\n\n").trimEnd() + "\n";
}

function renderSchema(name: string, schema: Schema, usedBy: Tag[]): string {
  const file = schemaFile(name);
  const lines = [`# ${name}`, ""];
  const description = cleanText(schema.description);
  if (description) lines.push(description, "");
  if (schema.enum) {
    lines.push(`**Enum** (${schema.type ?? "string"}): ${schema.enum.map((v) => `\`${v}\``).join(", ")}`, "");
  }
  const props = Object.entries(schema.properties ?? {});
  if (props.length) {
    const required = new Set(schema.required ?? []);
    lines.push("**Fields:**", "");
    for (const [prop, p] of props) {
      const notes = [
        required.has(prop) ? "required" : "",
        p.nullable ? "nullable" : "",
        p.readOnly ? "read-only" : "",
        p.deprecated ? "**deprecated**" : "",
        p.maxLength !== undefined ? `max length ${p.maxLength}` : "",
      ].filter(Boolean);
      const desc = inline(p.description);
      lines.push(`- \`${prop}\`: ${typeOf(p, file)}${notes.length ? `, ${notes.join(", ")}` : ""}${desc ? ` — ${desc}` : ""}`);
    }
    lines.push("");
  } else if (!schema.enum) {
    lines.push(`Type: ${typeOf({ ...schema, description: undefined }, file)}`, "");
  }
  if (usedBy.length) {
    lines.push("**Used directly by endpoints in:**", "");
    for (const tag of usedBy) lines.push(`- [${tag.name}](${posix.relative("schemas", tag.file)})`);
    lines.push("");
  }
  return lines.join("\n").trimEnd() + "\n";
}

function renderSchemaIndex(spec: Spec): string {
  const lines = [
    "# Schema index",
    "",
    "Generated from the Omnium OpenAPI spec by `scripts/sync-api.ts` — do not edit by hand.",
    "Every schema with its description. Search this file for a name or keyword, then open the schema file.",
    "",
  ];
  for (const [name, schema] of Object.entries(spec.components.schemas).sort(([a], [b]) => a.localeCompare(b))) {
    const desc = inline(schema.description);
    lines.push(`- [${name}](${name}.md)${desc ? ` — ${desc}` : ""}`);
  }
  return lines.join("\n") + "\n";
}

function groupByArea(tags: Tag[]): Map<string, Tag[]> {
  const areas = new Map<string, Tag[]>();
  for (const tag of tags) areas.set(tag.area, [...(areas.get(tag.area) ?? []), tag]);
  return areas;
}

function renderIndexTables(tags: Tag[], schemas: Record<string, Schema>): string {
  const areas = groupByArea(tags);
  // schema -> area -> number of endpoints in that area referencing it directly
  const usage = new Map<string, Map<string, number>>();
  for (const [area, areaTags] of areas) {
    const seen = new Set<Operation>();
    for (const { op } of areaTags.flatMap((t) => t.endpoints)) {
      if (seen.has(op)) continue;
      seen.add(op);
      for (const name of referencedSchemas(op)) {
        const byArea = usage.get(name) ?? new Map<string, number>();
        byArea.set(area, (byArea.get(area) ?? 0) + 1);
        usage.set(name, byArea);
      }
    }
  }
  const areaCount = (name: string) => usage.get(name)?.size ?? 0;
  const schemaLink = (name: string) => `[\`${name}\`](${schemaFile(name)})`;

  const lines: string[] = [];
  for (const [area, areaTags] of areas) {
    lines.push(`### ${area}`, "", "| File | Tag | Endpoints | Description |", "|------|-----|-----------|-------------|");
    for (const tag of areaTags) {
      lines.push(`| [\`${tag.file}\`](${tag.file}) | ${inline(tag.name)} | ${tag.endpoints.length} | ${inline(tag.description)} |`);
    }
    const key = [...usage]
      .filter(([name, byArea]) => byArea.has(area) && areaCount(name) < GENERIC_AREAS)
      .map(([name, byArea]) => [name, byArea.get(area)!] as const)
      .sort(([a, x], [b, y]) => y - x || a.localeCompare(b))
      .slice(0, KEY_SCHEMAS_PER_AREA);
    if (key.length) lines.push("", `Key schemas: ${key.map(([name]) => schemaLink(name)).join(", ")}`);
    lines.push("");
  }

  const shared = [...usage.keys()].filter((name) => areaCount(name) >= SHARED_AREAS).sort((a, b) => a.localeCompare(b));
  if (shared.length) {
    lines.push(
      "### Shared schemas",
      "",
      `Used by endpoints in ${SHARED_AREAS} or more areas. The full list of schemas is in [\`schemas/_INDEX.md\`](schemas/_INDEX.md).`,
      "",
      "| Schema | Areas | Description |",
      "|--------|-------|-------------|",
    );
    for (const name of shared) {
      lines.push(`| ${schemaLink(name)} | ${[...usage.get(name)!.keys()].join(", ")} | ${inline(schemas[name]?.description)} |`);
    }
  }
  return lines.join("\n").trimEnd();
}

function renderSkillTable(tags: Tag[]): string {
  const lines = ["| Area | Tags | Endpoint files |", "|------|------|----------------|"];
  for (const [area, areaTags] of groupByArea(tags)) {
    const names = areaTags.map((t) => t.name.split("|").slice(1).map((s) => s.trim()).join(" › ") || t.name).join(", ");
    lines.push(`| ${area} | ${inline(names)} | [api/_INDEX.md › ${area}](api/_INDEX.md#${anchor(area)}) |`);
  }
  return lines.join("\n");
}

// --- Main ---------------------------------------------------------------------

async function fetchSpec(): Promise<Spec> {
  for (let attempt = 0; ; attempt++) {
    try {
      const resp = await fetch(SPEC_URL, { headers: { "User-Agent": USER_AGENT }, signal: AbortSignal.timeout(60_000) });
      if (!resp.ok) throw new Error(`${resp.status} for ${SPEC_URL}`);
      return (await resp.json()) as Spec;
    } catch (err) {
      if (attempt === 3) throw err;
      await new Promise((r) => setTimeout(r, 1000 * 2 ** attempt));
    }
  }
}

async function write(path: string, content: string): Promise<void> {
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, content, "utf-8");
}

async function main(): Promise<number> {
  const { values } = parseArgs({
    options: {
      out: { type: "string", default: join(import.meta.dirname, "..", "api") },
      skill: { type: "string", default: join(import.meta.dirname, "..", "SKILL.md") },
    },
  });
  const out = resolve(values.out);
  const indexPath = join(out, "_INDEX.md");
  const skillPath = resolve(values.skill);
  replaceBetweenMarkers(await readFile(indexPath, "utf-8"), INDEX_MARKERS, "", "api/_INDEX.md");
  replaceBetweenMarkers(await readFile(skillPath, "utf-8"), SKILL_MARKERS, "", "SKILL.md");

  const spec = await fetchSpec();
  const pathCount = Object.keys(spec.paths ?? {}).length;
  const schemaCount = Object.keys(spec.components?.schemas ?? {}).length;
  if (pathCount < 100 || schemaCount < 100) {
    console.error(`Spec has only ${pathCount} paths and ${schemaCount} schemas; refusing to overwrite.`);
    return 1;
  }

  const tagDescriptions = new Map((spec.tags ?? []).map((t) => [t.name, t.description ?? ""]));
  const tags = new Map<string, Tag>();
  const tagFor = (name: string): Tag => {
    let tag = tags.get(name);
    if (!tag) {
      tag = { name, ...tagFile(name), description: tagDescriptions.get(name) ?? "", endpoints: [] };
      tags.set(name, tag);
    }
    return tag;
  };
  for (const name of tagDescriptions.keys()) tagFor(name);
  for (const [path, item] of Object.entries(spec.paths)) {
    for (const method of METHODS) {
      const op = item[method];
      if (!op) continue;
      for (const name of op.tags?.length ? op.tags : ["Other"]) tagFor(name).endpoints.push({ method, path, op });
    }
  }
  const usedTags = [...tags.values()].filter((t) => t.endpoints.length);
  const sorted = usedTags.sort((a, b) => a.area.localeCompare(b.area) || a.name.localeCompare(b.name));
  const files = new Set<string>();
  for (const tag of sorted) {
    if (files.has(tag.file.toLowerCase())) throw new Error(`Two tags map to ${tag.file}`);
    files.add(tag.file.toLowerCase());
  }

  const usedBy = new Map<string, Tag[]>();
  for (const tag of sorted) {
    const names = new Set(tag.endpoints.flatMap(({ op }) => [...referencedSchemas(op)]));
    for (const name of names) usedBy.set(name, [...(usedBy.get(name) ?? []), tag]);
  }

  await rm(join(out, "endpoints"), { recursive: true, force: true });
  await rm(join(out, "schemas"), { recursive: true, force: true });
  for (const tag of sorted) await write(join(out, tag.file), renderTag(tag));
  for (const [name, schema] of Object.entries(spec.components.schemas)) {
    await write(join(out, schemaFile(name)), renderSchema(name, schema, usedBy.get(name) ?? []));
  }
  await write(join(out, "schemas", "_INDEX.md"), renderSchemaIndex(spec));

  const index = await readFile(indexPath, "utf-8");
  await writeFile(indexPath, replaceBetweenMarkers(index, INDEX_MARKERS, renderIndexTables(sorted, spec.components.schemas), "api/_INDEX.md"), "utf-8");
  const skill = await readFile(skillPath, "utf-8");
  await writeFile(skillPath, replaceBetweenMarkers(skill, SKILL_MARKERS, renderSkillTable(sorted), "SKILL.md"), "utf-8");

  const endpointCount = sorted.reduce((n, t) => n + t.endpoints.length, 0);
  console.log(`Wrote ${sorted.length} endpoint files (${endpointCount} endpoints) and ${schemaCount} schemas to ${out}`);
  return 0;
}

process.exitCode = await main();
