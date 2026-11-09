# Assets | Images

Source: https://api.omnium.no/documentation

> Image operations.

Generated from the Omnium OpenAPI spec by `scripts/sync-api.ts` — do not edit by hand.
Common conventions and standard error responses (429, 500) are in `api/_INDEX.md`.

---

## `GET /api/ImagesDelivery/GetImageUrl`

**Based on a image url that exists in Omnium, generate a new size.If both width and height is specified, width is used**

Operation ID: `ImagesDeliveryGetImageUrl`

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `url` | query | string | No | Complete url to the image |
| `maxHeight` | query | integer (int32) | No | Max height for the generated image |
| `maxWidth` | query | integer (int32) | No | Max width for the generated image |

**Responses:**

- 200: Success
- 400: Bad Request
- 404: Not Found
