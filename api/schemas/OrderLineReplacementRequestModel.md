# OrderLineReplacementRequestModel

Orderline replacement request model

**Fields:**

- `lineItemId`: string, required — Orderline id to replace
- `quantity`: integer (int32), required — Quantity to replace
- `replacementType`: string, nullable — Replacement type (Should correspond to predefined list of replacement types)
- `replacementReason`: string, nullable — Replacement reason
- `skuId`: string, nullable — You can add a SkuId of a product if you want to replace the current product on the orderline with a different product in the replacementOrder
