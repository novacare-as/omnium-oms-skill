# OmniumGetMultipleResponse

The response contains found orders and the IDs of orders not found (if any).

**Fields:**

- `orders`: List<[`OmniumOrder`](OmniumOrder.md)>, nullable — The orders that were found
- `missingIds`: List<string>, nullable — IDs of orders that were not found

**Used directly by endpoints in:**

- [Orders | Update](../endpoints/orders/update.md)
