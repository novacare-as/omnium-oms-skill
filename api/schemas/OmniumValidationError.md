# OmniumValidationError

**Fields:**

- `message`: string, nullable
- `translateKey`: string, nullable
- `errorCode`: string, nullable — Stable, machine-readable code identifying the validation error (e.g. "ProductNotActive", "InsufficientInventory"). Use this to branch on the error programmatically instead of parsing Omnium.Public.Validation.Models.OmniumValidationError.Message. This is the recommended field for integrations; prefer it over Omnium.Public.Validation.Models.OmniumValidationError.TranslateKey, which is a localization resource key and not a stable contract.
- `validationType`: string, nullable
- `referenceId`: string, nullable
