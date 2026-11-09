# Replacement Workflow Steps

Source: https://docs.omnium.no/docs/Order/Returns/return-workflow-steps/replacement

> Workflow steps for creating exchange and replacement orders from returns.

## Overview

Replacement workflow steps create new orders to replace or exchange returned items. They support various scenarios from simple exchanges to complex replacements with price adjustments.

## Available Steps

| Step | Key | Description |
| --- | --- | --- |
| [Create Exchange Order](replacement/create-exchange-order.md) | `CreateExchangeOrder` | Create new order for exchanged items |
| [Create Replacement Order](replacement/create-replacement-order.md) | `CreateReplacementOrder` | Create replacement order with current pricing |
| [Create Replacement Order Keeping Prices](replacement/create-replacement-order-keeping-prices.md) | `CreateReplacementOrderKeepingPrices` | Create replacement order preserving original prices |

## Exchange vs Replacement

**Exchange Orders** are used when:

*   Customer wants a different size/color
*   Items are swapped for equivalent products
*   Price differences may apply

**Replacement Orders** are used when:

*   Original item was defective or wrong
*   Customer receives replacement at no additional cost
*   `CreateReplacementOrderKeepingPrices` preserves any promotional pricing from the original order

## Configuration

Replacement order behavior is controlled by:

*   `DefaultReplacementOrderType` in Order Settings - determines the order type assigned
*   `ReplacementSettings` - controls metadata handling and restrictions
