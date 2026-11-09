# OmniumCustomerSettings

**Fields:**

- `isB2BGetOrCreateFromOrderDisabled`: boolean
- `isB2CGetOrCreateFromOrderDisabled`: boolean
- `isB2BGetOrCreateDisabled`: boolean
- `isB2CGetOrCreateDisabled`: boolean
- `punchOutSettings`: [`OmniumPunchOutSettings`](OmniumPunchOutSettings.md)
- `requiredAddressProperties`: List<string>, nullable, max length 250
- `defaultProperties`: List<[`OmniumDefaultPropertyItem`](OmniumDefaultPropertyItem.md)>, nullable, max length 250
- `useExternalBonusPointsProvider`: boolean
- `useStatsCustomerQueues`: boolean — If set, private customers will be copied to statsCustomers
- `tagSettings`: List<[`OmniumTagSettings`](OmniumTagSettings.md)>, nullable, max length 250
- `b2CConsentTypes`: List<[`OmniumConsentType`](OmniumConsentType.md)>, nullable — Configured consent types for private (B2C) customers
- `b2BConsentTypes`: List<[`OmniumConsentType`](OmniumConsentType.md)>, nullable — Configured consent types for business (B2B) customers

**Used directly by endpoints in:**

- [Settings](../endpoints/settings.md)
