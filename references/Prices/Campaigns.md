# Campaigns

Source: https://docs.omnium.no/docs/Prices/Campaigns

> Plan, execute, and measure promotional campaigns in Omnium — group promotions, set revenue targets, and track performance in real time.

## Introduction

Campaigns in Omnium let you group related promotions under a single umbrella, plan revenue targets, and track actual performance against those targets. A campaign represents a coordinated marketing effort — such as a seasonal sale, a product launch, or a clearance event — that may involve multiple promotions running across different markets and stores.

Campaigns provide structure and visibility across the full lifecycle: from initial planning, through the active sales period, to post-campaign performance analysis.

* * *

## In this section

*   [API Reference](Campaigns/campaign-api.md) — REST API reference for managing campaigns programmatically — endpoints, models, and integration patterns
*   [Campaign Overview](Campaigns/overview.md) — Core concepts, lifecycle statuses, and how campaigns relate to promotions and price lists
*   [Managing Campaigns](Campaigns/managing-campaigns.md) — Create, edit, copy, and delete campaigns through the Omnium UI
*   [Campaign Promotions](Campaigns/campaign-promotions.md) — Link promotions to campaigns and manage promotion assignments
*   [Campaign Planning](Campaigns/campaign-planning.md) — Set revenue targets and sales volume forecasts at campaign, promotion, and SKU level
*   [Campaign Performance](Campaigns/campaign-performance.md) — Track revenue, sales volume, and variance against targets with real-time analytics
*   [Campaign Settings](Campaigns/campaign-settings.md) — How to configure campaign statuses with a locked status, campaign milestones and deadlines, planning dimensions, sales channels and the thresholds of the campaign overview.

* * *

## How Campaigns Fit into Omnium

Campaigns sit above promotions in the pricing hierarchy. While [promotions](Promotions.md) define the discount rules and [price lists](PriceLists.md) define the specific prices, campaigns provide the organizational layer that ties them together for planning and measurement.

```
                         CAMPAIGN
  ┌───────────────────────────────────────────────┐
  │  "Summer Sale 2026"                           │
  │  Planning → Active → Completed → Archived     │
  │  Revenue target: 500,000 NOK                  │
  └───────────────────┬───────────────────────────┘
                      │
            ┌─────────┼─────────┐
            ▼         ▼         ▼
       Promotion  Promotion  Promotion
       "20% off   "3 for 2   "Free
        shoes"     socks"    shipping"
            │         │
            ▼         ▼
       Price List  Price List
       (SKU-level  (SKU-level
        prices)     prices)
```

Each campaign can have multiple linked promotions. Promotions that use price lists carry SKU-level planning data (planned sales volume and revenue), enabling detailed forecasting and post-campaign analysis.

* * *

## Related Documentation

| Topic | Link |
| --- | --- |
| Promotion types and rules | [Promotions](Promotions.md) |
| Pricing overview | [Pricing & Promotions Overview](pricing-and-promotions.md) |
| Price list management | [Price Lists](PriceLists.md) |
| Price selection rules | [Price Prioritization](PricePrioritization.md) |
