/**
 * Regenerate references/ from the live documentation at docs.omnium.no.
 *
 * Reads the site's sitemap, fetches every page, extracts the article body and
 * converts it to Markdown. Pages are written to references/<url path>.md,
 * mirroring the site, and references/_INDEX.md lists every page with its
 * description, grouped by topic. The routing table in SKILL.md, between its
 * marker comments, is regenerated to point at those sections.
 *
 * Output is deterministic (no timestamps), so a run against unchanged docs
 * produces no git diff.
 *
 * Usage: npm run sync:docs [-- --out references --skill SKILL.md --workers 8]
 */

import { mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { dirname, join, posix, resolve } from "node:path";
import { parseArgs } from "node:util";
import * as cheerio from "cheerio";
import TurndownService from "turndown";
import { gfm } from "turndown-plugin-gfm";
import { anchor, replaceBetweenMarkers } from "./markers.ts";

const BASE_URL = "https://docs.omnium.no";
const SITEMAP_URL = `${BASE_URL}/sitemap.xml`;
const USER_AGENT = "omnium-oms-skill-sync (+https://github.com/novacare-as/omnium-oms-skill)";

// Topics come from the site itself: every top-level section (/docs/Order,
// /docs/Inventory, ...) becomes a topic, named after its landing page's title
// and summarized by its description. New or renamed sections therefore show up
// without changes here. The settings below only adjust that result; entries for
// sections that no longer exist are reported and otherwise ignored.

/** Per-section tweaks, keyed by the section's path segment ("" is /docs itself). */
const SECTION_OVERRIDES: Record<string, { mergeInto?: string; heading?: string; summary?: string }> = {
  "": { mergeInto: "GettingStartedWithAPI" },
  Security: { mergeInto: "GettingStartedWithAPI" },
  Environments: { mergeInto: "GettingStartedWithAPI" },
  access: { mergeInto: "GettingStartedWithAPI" },
  support: { mergeInto: "GettingStartedWithAPI" },
  training: { mergeInto: "GettingStartedWithAPI" },
  Markets: { mergeInto: "Stores" },
  GettingStartedWithAPI: {
    heading: "Getting Started, API Conventions & Security",
    summary: "Authentication, API conventions, search, pagination, scroll, error handling, security, environments",
  },
  Stores: { heading: "Stores & Markets", summary: "Stores, markets, warehouses, regions" },
  Product: { heading: "Products", summary: "Product catalog, categories, assets, assortment" },
  Releasenotes: { summary: "What changed recently in Omnium" },
};

/** Topics that cut across sections. Their pages are also listed under their own section. */
const EXTRA_TOPICS: { heading: string; summary: string; rules: RegExp[] }[] = [
  {
    heading: "Tutorials",
    summary: "Step-by-step guides (ERP, POS, omnichannel e-com integration)",
    rules: [/^GettingStartedWithAPI\/Tutorials(\/|$)/],
  },
  {
    heading: "Notifications — Email & SMS",
    summary: "Email, SMS, notification templates",
    rules: [/notification/, /^plugins\/Other\/(LinkMobility|Sendgrid)$/],
  },
];

interface Topic {
  heading: string;
  summary: string;
  pages: Page[];
}

const INDEX_FILE = "_INDEX.md";
const ROUTING_MARKERS = {
  begin: "<!-- BEGIN generated routing table: see SECTION_OVERRIDES in scripts/sync-docs.ts -->",
  end: "<!-- END generated routing table -->",
};
const ROOT_PAGE = "docs";

interface Page {
  path: string; // relative to /docs, no leading/trailing slash ("" for /docs)
  url: string;
  title: string;
  description: string;
  body: string;
}

function pageFile(path: string): string {
  return `${path || ROOT_PAGE}.md`;
}

function docPath(url: string): string | null {
  const path = new URL(url).pathname.replace(/\/+$/, "");
  if (path === "/docs") return "";
  if (path.startsWith("/docs/")) return decodeURI(path.slice("/docs/".length));
  return null;
}

async function fetchText(url: string, attempts = 4): Promise<string> {
  for (let attempt = 0; ; attempt++) {
    try {
      const resp = await fetch(url, { headers: { "User-Agent": USER_AGENT }, signal: AbortSignal.timeout(30_000) });
      if (!resp.ok) throw new Error(`${resp.status} for ${url}`);
      return await resp.text();
    } catch (err) {
      if (attempt === attempts - 1) throw err;
      await new Promise((r) => setTimeout(r, 1000 * 2 ** attempt));
    }
  }
}

async function readSitemap(): Promise<string[]> {
  const $ = cheerio.load(await fetchText(SITEMAP_URL), { xml: true });
  const paths = new Set<string>();
  $("loc").each((_, el) => {
    const path = docPath($(el).text().trim());
    if (path !== null) paths.add(path);
  });
  return [...paths].sort();
}

function createTurndown(): TurndownService {
  const td = new TurndownService({ headingStyle: "atx", codeBlockStyle: "fenced" });
  td.use(gfm);
  td.addRule("codeBlock", {
    filter: "pre",
    replacement: (_content, node) => {
      const code = (node.textContent ?? "").replace(/^\n+|\n+$/g, "");
      if (!code.trim()) return "";
      const lang = /^\s*[{[]/.test(code) ? "json" : "";
      const fence = code.includes("```") ? "````" : "```";
      return `\n\n${fence}${lang}\n${code}\n${fence}\n\n`;
    },
  });
  return td;
}

const turndown = createTurndown();

function rewriteHref(page: Page, href: string, knownPaths: Set<string>): string {
  let absolute: URL;
  try {
    absolute = new URL(href, page.url);
  } catch {
    return href;
  }
  if (absolute.host !== new URL(BASE_URL).host) return href;
  const target = docPath(absolute.href);
  if (target === null || !knownPaths.has(target)) return absolute.href;
  const rel = posix.relative(posix.dirname(pageFile(page.path)), pageFile(target));
  return rel + absolute.hash;
}

function parsePage(page: Page, html: string, knownPaths: Set<string>): void {
  const $ = cheerio.load(html);
  const article = $("article").first();
  if (!article.length) throw new Error(`no <article> on ${page.url}`);

  const text = (el: cheerio.Cheerio<any>) => el.text().replace(/\s+/g, " ").trim();
  const h1 = article.find("h1").first();
  page.title = h1.length ? text(h1) : page.path.split("/").pop() ?? page.path;
  page.description = text(h1.nextAll("p").first());

  const prose = article.find("div.prose").first();
  if (!prose.length) return;
  prose.find("svg, button, style, script").remove();
  prose.find("figure.fd-codeblock").each((_, fig) => {
    const pre = $(fig).find("pre").first();
    if (pre.length) $(fig).replaceWith(pre);
  });
  prose.find("h1, h2, h3, h4, h5, h6").find('a[href^="#"]').each((_, a) => {
    $(a).replaceWith($(a).contents());
  });
  prose.find("a[href]").each((_, a) => {
    $(a).attr("href", rewriteHref(page, $(a).attr("href")!, knownPaths));
  });
  prose.find("a[href]:has(div)").each((_, a) => {
    const card = $(a);
    const title = text(card.find("div.font-medium").first()) || text(card);
    const desc = text(card.find("div.text-sm").first());
    const link = $("<a>").attr("href", card.attr("href")!).text(title);
    card.replaceWith($("<li>").append(link, desc ? ` — ${desc}` : ""));
  });
  prose.find(":has(> li)").not("ul, ol").each((_, el) => {
    el.tagName = "ul";
  });
  prose.find("img[src]").each((_, img) => {
    $(img).attr("src", new URL($(img).attr("src")!, page.url).href);
  });

  page.body = turndown
    .turndown(prose.html() ?? "")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function renderPage(page: Page): string {
  const parts = [`# ${page.title}`, "", `Source: ${page.url}`];
  if (page.description) parts.push("", `> ${page.description}`);
  if (page.body) parts.push("", page.body);
  return parts.join("\n") + "\n";
}

function buildTopics(pages: Page[]): Topic[] {
  const sectionOf = (path: string) => path.split("/")[0];
  const sections = new Set(pages.map((p) => sectionOf(p.path)));
  for (const [section, override] of Object.entries(SECTION_OVERRIDES)) {
    if (!sections.has(section)) console.warn(`SECTION_OVERRIDES: no section "${section}" on the site any more`);
    else if (override.mergeInto !== undefined && !sections.has(override.mergeInto)) {
      console.warn(`SECTION_OVERRIDES: "${section}" merges into missing section "${override.mergeInto}"`);
    }
  }
  const target = (section: string) => {
    const into = SECTION_OVERRIDES[section]?.mergeInto;
    return into !== undefined && sections.has(into) ? into : section;
  };
  const landing = new Map(pages.map((p) => [p.path, p]));

  const bySection = new Map<string, Page[]>();
  for (const page of pages) {
    const key = target(sectionOf(page.path));
    bySection.set(key, [...(bySection.get(key) ?? []), page]);
  }
  const topics: Topic[] = [...bySection].map(([section, sectionPages]) => {
    const override = SECTION_OVERRIDES[section] ?? {};
    const page = landing.get(section);
    return {
      heading: override.heading ?? page?.title ?? (section || "Overview"),
      summary: override.summary ?? page?.description ?? "",
      pages: sectionPages,
    };
  });
  topics.sort((a, b) => a.heading.localeCompare(b.heading, "en"));

  for (const extra of EXTRA_TOPICS) {
    const extraPages = pages.filter((p) => extra.rules.some((r) => r.test(p.path)));
    if (extraPages.length) topics.push({ heading: extra.heading, summary: extra.summary, pages: extraPages });
    else console.warn(`EXTRA_TOPICS: "${extra.heading}" matches no pages`);
  }

  const seen = new Set<string>();
  for (const topic of topics) {
    if (seen.has(topic.heading)) throw new Error(`Two topics are both called "${topic.heading}"; add a heading override`);
    seen.add(topic.heading);
  }
  return topics;
}

function renderIndex(topics: Topic[]): string {
  const parentOf = (p: Page) => (p.path.includes("/") ? p.path.slice(0, p.path.lastIndexOf("/")) : p.path || ROOT_PAGE);
  const key = (p: Page) => `${parentOf(p).toLowerCase()}\u0000${p.path.toLowerCase()}`;
  const lines = [
    "# Omnium documentation index",
    "",
    "Generated from https://docs.omnium.no by `scripts/sync-docs.ts` — do not edit by hand.",
    "Every page of the site is listed below by topic, with its description. Paths are relative to this file.",
    "Search this file for a keyword or jump to a topic, then read only the pages you need.",
    "",
    "## Topics",
    "",
    ...topics.map((t) => `- [${t.heading}](#${anchor(t.heading)}) (${t.pages.length} pages)`),
  ];
  for (const topic of topics) {
    lines.push("", `## ${topic.heading}`);
    if (topic.summary) lines.push("", topic.summary);
    let current: string | null = null;
    for (const page of [...topic.pages].sort((a, b) => (key(a) < key(b) ? -1 : key(a) > key(b) ? 1 : 0))) {
      const parent = parentOf(page);
      if (parent !== current) {
        lines.push("", `### ${parent}`, "");
        current = parent;
      }
      lines.push(`- [${page.title}](${pageFile(page.path)})` + (page.description ? ` — ${page.description}` : ""));
    }
  }
  return lines.join("\n") + "\n";
}

function renderRoutingTable(topics: Topic[]): string {
  const rows = topics.map((t) => `| ${t.summary} | [${t.heading}](references/${INDEX_FILE}#${anchor(t.heading)}) |`);
  return ["| Topic | Section in `references/" + INDEX_FILE + "` |", "|-------|-----------|", ...rows].join("\n");
}

async function mapPool<T, R>(items: T[], limit: number, fn: (item: T) => Promise<R>): Promise<PromiseSettledResult<R>[]> {
  const results: PromiseSettledResult<R>[] = new Array(items.length);
  let next = 0;
  const worker = async () => {
    while (next < items.length) {
      const i = next++;
      try {
        results[i] = { status: "fulfilled", value: await fn(items[i]) };
      } catch (reason) {
        results[i] = { status: "rejected", reason };
      }
    }
  };
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker));
  return results;
}

async function main(): Promise<number> {
  const { values } = parseArgs({
    options: {
      out: { type: "string", default: join(import.meta.dirname, "..", "references") },
      skill: { type: "string", default: join(import.meta.dirname, "..", "SKILL.md") },
      workers: { type: "string", default: "8" },
    },
  });
  const out = resolve(values.out);
  const skillPath = resolve(values.skill);
  replaceBetweenMarkers(await readFile(skillPath, "utf-8"), ROUTING_MARKERS, "", "SKILL.md");

  const paths = await readSitemap();
  if (paths.length < 50) {
    console.error(`Sitemap returned only ${paths.length} pages; refusing to overwrite.`);
    return 1;
  }
  const known = new Set(paths);
  let pages: Page[] = paths.map((path) => ({
    path,
    url: `${BASE_URL}/docs/${encodeURI(path)}`.replace(/\/$/, ""),
    title: "",
    description: "",
    body: "",
  }));

  const results = await mapPool(pages, Number(values.workers), async (page) => {
    parsePage(page, await fetchText(page.url), known);
  });
  const failures = pages.flatMap((page, i) => {
    const r = results[i];
    return r.status === "rejected" ? [`${page.url}: ${r.reason}`] : [];
  });
  if (failures.length) {
    console.error(`Failed to fetch/parse:\n  ${failures.join("\n  ")}`);
    if (failures.length > pages.length * 0.05) return 1;
    pages = pages.filter((_, i) => results[i].status === "fulfilled");
  }

  await mkdir(out, { recursive: true });
  for (const entry of await readdir(out)) {
    await rm(join(out, entry), { recursive: true, force: true });
  }

  for (const page of pages) {
    const dest = join(out, pageFile(page.path));
    await mkdir(dirname(dest), { recursive: true });
    await writeFile(dest, renderPage(page), "utf-8");
  }

  const topics = buildTopics(pages);
  await writeFile(join(out, INDEX_FILE), renderIndex(topics), "utf-8");
  const skill = await readFile(skillPath, "utf-8");
  await writeFile(skillPath, replaceBetweenMarkers(skill, ROUTING_MARKERS, renderRoutingTable(topics), "SKILL.md"), "utf-8");

  console.log(`Wrote ${pages.length} pages and ${INDEX_FILE} (${topics.length} topics) to ${out}`);
  return 0;
}

process.exitCode = await main();
