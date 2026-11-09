# OmniumShipmentOptionCost

The internal cost of using a shipping option, used to rank allocation plans by cost.

**Fields:**

- `internalCost`: number (decimal), nullable — Base cost to the business of sending one shipment with this option
- `currencyCode`: string, nullable — Currency of the internal cost
- `costPerKg`: number (decimal), nullable — Optional weight component, added on top of the base internal cost
