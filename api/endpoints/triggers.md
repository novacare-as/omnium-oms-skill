# Triggers

Source: https://api.omnium.no/documentation

> Trigger actions

Generated from the Omnium OpenAPI spec by `scripts/sync-api.ts` — do not edit by hand.
Common conventions and standard error responses (429, 500) are in `api/_INDEX.md`.

---

## `POST /api/Trigger`

**Trigger a preconfigured action**

Operation ID: `TriggersPost`

**Request body:** [`OmniumTriggerRequest`](../schemas/OmniumTriggerRequest.md)

**Responses:**

- 200: string — Action triggered successfully
- 404: string — Trigger was not found
