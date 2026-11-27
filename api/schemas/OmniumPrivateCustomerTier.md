# OmniumPrivateCustomerTier

A tier from an external customer club system (CRM)

**Fields:**

- `program`: string, nullable — The program the tier belongs to, for a tenant with several connectors to customer club systems. Empty with a single connector
- `tierId`: string, nullable — Id for the tier
- `name`: string, nullable — Name for the tier
- `tierStart`: string (date-time), nullable — Date for when the customer entered the Tier/Level
- `tierEnd`: string (date-time), nullable — Date for when the customer will leave the Tier/Level
- `qualifyingAmount`: number (decimal), nullable — Amount that counts toward the tier
- `amountToNextTier`: number (decimal), nullable — Amount to reach next tier
