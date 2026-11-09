# OmniumDiscountReason

Audit information for a manually applied discount: which configured reason
code was chosen, an optional free-text comment, and who applied it.
Applies to order line, mass order line, and order-level manual discounts.

**Fields:**

- `reasonCode`: string, nullable — Id of the selected reason code from the configured discount reason code list (TenantSettings.OrderSettings.OrderLineSettings.DiscountReasonCodes). Required when reason codes are configured for the tenant.
- `comment`: string, nullable — Optional free-text comment entered in addition to the reason code.
- `userId`: string, nullable — Id of the user who applied the discount.
- `userName`: string, nullable — Display name of the user who applied the discount.
- `created`: string (date-time), nullable — When the discount reason was registered.
