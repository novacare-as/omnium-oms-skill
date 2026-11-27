# OmniumProductCondition

One condition of a rule-based promotion: an attribute, an operator and the values it compares with.

**Fields:**

- `attribute`: string, nullable, max length 250 — The product attribute: a product field by its search name (brand, supplierName, published, tags), a custom property as properties.<key>, a variant property as variants.properties.<key>, or one of categoryBranch, hasCampaignPrice, basePrice, priceList and inStockInWarehouse.
- `operator`: [`OmniumProductConditionOperator`](OmniumProductConditionOperator.md)
- `values`: List<string>, nullable, max length 2000 — The values, as text: numbers in invariant culture (12.5), dates as YYYY-MM-DD, booleans as true or false. Equals, NotEquals, StartsWith, EndsWith and the comparisons read the first value; In and NotIn read all of them; Exists and NotExists read none.
