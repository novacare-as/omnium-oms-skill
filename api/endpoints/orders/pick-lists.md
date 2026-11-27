# Orders | Pick Lists

Source: https://api.omnium.no/documentation

> Pick lists for warehouse movements.

Generated from the Omnium OpenAPI spec by `scripts/sync-api.ts` — do not edit by hand.
Common conventions and standard error responses (429, 500) are in `api/_INDEX.md`.

---

## `POST /api/PickList/Search`

**Search all PickLists.**

Operation ID: `PickListSearch`

Search pickLists.

**Request body:** [`OmniumPickListSearchRequest`](../../schemas/OmniumPickListSearchRequest.md)

**Responses:**

- 200: [`OmniumPickListOmniumSearchResult`](../../schemas/OmniumPickListOmniumSearchResult.md) — Success
- 404: Not Found

---

## `GET /api/PickList/Get`

**Get PickList with id.**

Operation ID: `PickListGet`

Get pickList.

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `id` | query | string | No |  |

**Responses:**

- 200: [`OmniumPickList`](../../schemas/OmniumPickList.md) — Success
- 404: string — Not Found

---

## `PATCH /api/PickList/PatchPickList`

**Patch PickList - update only values in request.**

Operation ID: `PickListPatchPickList`

Patch pickLists.

**Request body:** [`OmniumPickListPatch`](../../schemas/OmniumPickListPatch.md)

**Responses:**

- 200: [`OmniumPickList`](../../schemas/OmniumPickList.md) — Success
- 400: string — Bad Request
- 404: string — Not Found
