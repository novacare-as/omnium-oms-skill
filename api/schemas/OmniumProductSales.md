# OmniumProductSales

Class used for product sales Statistics

**Fields:**

- `costSum`: List<[`OmniumValueAggregateOmniumBucket`](OmniumValueAggregateOmniumBucket.md)>, nullable, max length 250 — Total product cost
- `extendedPriceSum`: List<[`OmniumValueAggregateOmniumBucket`](OmniumValueAggregateOmniumBucket.md)>, nullable, max length 250 — Total sales price
- `quantityStats`: List<[`OmniumStatsAggregateOmniumBucket`](OmniumStatsAggregateOmniumBucket.md)>, nullable, max length 250 — Total quantity stats
- `returnedStats`: List<[`OmniumStatsAggregateOmniumBucket`](OmniumStatsAggregateOmniumBucket.md)>, nullable, max length 250 — Total number of return items stats
- `cancelledStats`: List<[`OmniumStatsAggregateOmniumBucket`](OmniumStatsAggregateOmniumBucket.md)>, nullable, max length 250 — Total number of cancelled items stats
- `storeTerms`: List<[`OmniumTermsAggregationDataListOmniumBucket`](OmniumTermsAggregationDataListOmniumBucket.md)>, nullable, max length 250 — Store/shop stat
- `salesChannelTerms`: List<[`OmniumTermsAggregationDataListOmniumBucket`](OmniumTermsAggregationDataListOmniumBucket.md)>, nullable, max length 250 — Sales channel stats
- `statusTerms`: List<[`OmniumTermsAggregationDataListOmniumBucket`](OmniumTermsAggregationDataListOmniumBucket.md)>, nullable, max length 250 — Status stats
- `profitChartSeries`: [`OmniumChart`](OmniumChart.md)
- `quantityChartSeries`: [`OmniumChart`](OmniumChart.md)

**Used directly by endpoints in:**

- [Products](../endpoints/products.md)
