# Prices

Source: https://docs.omnium.no/docs/plugins/POS/Flow/Prices

> Price synchronization from Omnium to Flow Retail including selling prices, cost prices, and SOA amounts.

## Overview

Price synchronization from Omnium to Flow Retail operates through three separate scheduled tasks, each handling a different type of pricing data, in addition to the product sync itself. All prices are converted to **cents** (integer) before being sent to Flow.

| Price Type | Scheduled Task | Description |
| --- | --- | --- |
| **Selling Prices** | `FlowPriceScheduledTask` | Regular unit prices and recommended retail prices |
| **Cost Prices** | `FlowCostPriceScheduledTask` | Purchase/cost prices |
| **SOA Prices** | `FlowSoaScheduledTask` | Stock on Account amounts per store |

The above mentioned scheduled tasks support store specific price lists in Flow and operate on the prices in Omnium's separate price lists.
