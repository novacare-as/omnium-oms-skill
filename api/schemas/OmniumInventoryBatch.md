# OmniumInventoryBatch

Represents a batch of inventory in the context of the FIFO principle,
containing specific costs and currency details that were valid at the time of purchase.

**Fields:**

- `id`: string, nullable — The unique identifier for the inventory batch.
- `transactionDate`: string (date-time) — The date of the transaction when this batch of inventory was purchased.
- `modified`: string (date-time) — The date when this batch was last modified.
- `quantity`: number (decimal) — The available quantity of items in the batch.
- `costPrice`: number (decimal) — The cost price per unit converted to default currency for items in this batch at the time of purchase.
- `costValue`: number (decimal), read-only — The current total cost value of the batch, calculated as Quantity * CostPrice.
- `billingCurrency`: string, nullable — The currency used for billing when this batch was purchased.
- `billingCostExchangeRate`: number (decimal) — The exchange rate applied to the billing costs, representing the rate between the billing currency and the default currency configured in Omnium at the time of purchase.
- `billingCost`: number (decimal) — The cost in the billing currency for this batch at the time of purchase.
- `currencyDate`: string (date-time), nullable — The date associated with the currency rate used for billing calculations.S
