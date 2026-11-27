# Price Scheduled Tasks

Source: https://docs.omnium.no/docs/configuration/scheduled-tasks/prices

> Background jobs for cleaning up expired price data

The Price scheduled tasks handle cleanup of historical price data, removing expired prices and cost prices to maintain database performance and storage efficiency.

## Available Tasks

| Task | Description | Type |
| --- | --- | --- |
| [Delete Expired Prices](prices/delete-expired-prices.md) | Remove product prices that have passed their expiration date | Delta |
| [Delete Expired Cost Prices](prices/delete-expired-cost-prices.md) | Remove product cost prices that have passed their expiration date | Delta |

* * *

## Overview

Price cleanup tasks help maintain system performance by removing historical price data:

1.  **Sales Price Cleanup** - Remove expired retail/sales prices
2.  **Cost Price Cleanup** - Remove expired supplier/cost prices

* * *

## Common Use Cases

### Historical Price Cleanup

Use Delete Expired Prices to remove old price records after promotional periods end, keeping the price index lean and queries fast.

### Cost Price Maintenance

Enable Delete Expired Cost Prices to clean up historical supplier costs that are no longer relevant for inventory valuation.

* * *

## Configuration Requirements

Both tasks require configuration of retention thresholds in tenant settings:

*   `productSettings.deleteExpiredPricesThreshold` - Days after expiration to keep prices
*   `productSettings.deleteExpiredCostPricesThreshold` - Days after expiration to keep cost prices

* * *

## Recommended Schedules

| Task Type | Recommended Schedule | Reason |
| --- | --- | --- |
| Price cleanup | `0 3 * * 0` (weekly at 3 AM Sunday) | Heavy operation, run off-peak |
| Cost price cleanup | `0 4 * * 0` (weekly at 4 AM Sunday) | Heavy operation, run off-peak |
