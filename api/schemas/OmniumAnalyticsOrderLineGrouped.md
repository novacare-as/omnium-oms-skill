# OmniumAnalyticsOrderLineGrouped

Quantities for order aggregations

**Fields:**

- `group`: string, nullable — Aggregation group
- `currency`: string, nullable — Currency for all quantities
- `quantity`: number (decimal) — Number of order lines
- `deliveredQuantity`: number (decimal) — Number of items delivered
- `cancelledQuantity`: number (decimal) — Number of items cancelled
- `cost`: number (decimal) — Order line cost
- `revenue`: number (decimal) — Order line revenue
- `revenueExTax`: number (decimal) — Order line revenue ex tax
- `profit`: number (decimal) — Order line profit
- `profitAsPercentageOfRevenueExTax`: number (decimal) — Profit in percent of revenue ex tax
