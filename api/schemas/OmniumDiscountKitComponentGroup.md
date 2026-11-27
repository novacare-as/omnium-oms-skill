# OmniumDiscountKitComponentGroup

A component group of a kit discount: the products that can fill one part of the kit.

**Fields:**

- `requiredQuantity`: integer (int32), nullable — Required quantity of items from this component group in the kit (null == 1).
- `discountedQuantity`: integer (int32) — Number of items from this component group that can be discounted in the kit (0 == discount all items).
- `skuIds`: List<string>, nullable, max length 250 — SKU codes of the products in this component group. Each one should also be in the discount's SkuIds. Example: ["SKU-001", "SKU-002"]
- `required`: boolean — Is this component group required to be present in the kit?
