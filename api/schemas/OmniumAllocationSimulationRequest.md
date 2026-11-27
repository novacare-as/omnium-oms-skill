# OmniumAllocationSimulationRequest

Asks Omnium's allocation engine where an order or basket should ship from. Nothing is written:
a simulation never changes the order, the cart or inventory.

**Fields:**

- `orderId`: string, nullable — Id of an order already in Omnium
- `cartId`: string, nullable — Id of a cart already in Omnium
- `order`: [`OmniumOrder`](OmniumOrder.md)
- `cart`: [`OmniumCart`](OmniumCart.md)
- `profileKeys`: List<string>, nullable, max length 10 — More profiles to rank the plans under, for example FewestShipments, Closest or LowestCost. Each adds a ranking after the primary profile's, which decides the selected plan: the order's or cart's requestedAllocationProfileKey, otherwise the default profile for the market and sales store, otherwise Balanced.
- `trigger`: string, nullable — The trigger the simulation stands in for: InitialAllocation (the default) or Reallocation. Allocation rules scoped to a trigger only take part when it matches.
- `inventoryOverrides`: List<[`OmniumAllocationInventoryOverride`](OmniumAllocationInventoryOverride.md)>, nullable, max length 2000 — What-if availability, for a checkout that already holds its own stock matrix, or to try a scenario. Given values replace what Omnium holds for that SKU and warehouse.
- `replaceInventoryWithOverrides`: boolean — Use only the supplied availability and ignore Omnium's own inventory entirely. Off by default.
- `includeTrace`: boolean — Include the full reason trace. Off by default, since it is large

**Used directly by endpoints in:**

- [Allocation](../endpoints/allocation.md)
