# Campaign Overview

Source: https://docs.omnium.no/docs/Prices/Campaigns/overview

> Core concepts behind campaigns in Omnium — lifecycle statuses, the relationship between campaigns, promotions, and price lists, and how data is structured.

## What Is a Campaign?

A campaign is a container that groups related promotions into a single, trackable unit. It represents a coordinated commercial effort — such as a seasonal sale, a product launch, or a clearance event — and provides tools for planning, executing, and measuring the results.

Campaigns do not directly affect pricing. They organize and track the promotions that do.

* * *

## Campaign Properties

| Property | Description |
| --- | --- |
| **Name** | Display name of the campaign (e.g., "Summer Sale 2026") |
| **Description** | Optional internal description for context |
| **Start Date** | When the campaign begins |
| **End Date** | When the campaign ends |
| **Status** | Current lifecycle stage (see below) |
| **Markets** | Which markets the campaign applies to |
| **Stores** | Which stores the campaign targets (empty means all stores) |
| **Tags** | Labels for categorization and filtering (e.g., "seasonal", "clearance") |
| **Planning Notes** | Internal notes for the planning phase |
| **Properties** | Custom key-value pairs for extensibility |
| **Campaign code** | Code shown next to the campaign name, such as the campaign number from an ERP system. Set in the campaign edit form. |
| **Previous campaign** | The same campaign last year, whose figures serve as last year's when the campaign is evaluated. A copy that starts more than 300 days after its source gets the source as its previous campaign. |
| **Milestones** | Dated deadlines such as the store order deadline, created from the tenant's [milestone types](campaign-settings.md#give-every-campaign-milestones-and-deadlines) when the campaign gets a start date |

* * *

## Campaign Lifecycle

Every campaign follows a linear lifecycle with four statuses:

```
  Planning  ──→  Active  ──→  Completed  ──→  Archived
                   │
                   └──→  Planning  (rollback)
```

| Status | Description | What you can do |
| --- | --- | --- |
| **Planning** | Campaign is being planned. Targets and budgets can be edited. | Edit all fields, link/unlink promotions, set revenue targets |
| **Active** | Campaign is live. Promotions may be running. | View performance, monitor KPIs. |
| **Completed** | Campaign period has ended. Performance data is final. | Review results. Campaign is read-only. |
| **Archived** | Campaign is no longer relevant. Hidden from default views. | Can still be found via search with archived filter. |

### Status Transition Rules

*   Statuses progress linearly: **Planning → Active → Completed → Archived**
*   One rollback is allowed: **Active → Planning** (for corrections before the campaign is underway)
*   Skipping stages is not allowed (e.g., Planning → Completed)
*   Backward transitions other than Active → Planning are not allowed

### Locked Status

A tenant can add a locked status between planning and active: the phase in which the campaign's plan is frozen before it goes live. When the locked status has a default offset, its date is set from the campaign start date, and the automatic status transition moves the campaign into it on that date. While a campaign is in the locked status, an edit of one of its price list items that changes the planned volume, price or costs is refused in the Omnium UI unless you are an administrator (Omnium staff or a user with the tenant's **Administrators** role). See [Campaign Settings](campaign-settings.md#lock-the-plan-with-a-locked-campaign-status) for the configuration and its rules.

* * *

## Campaign, Promotion, and Price List Relationship

Campaigns, promotions, and price lists form a three-level hierarchy:

### Campaign → Promotions

A campaign groups one or more promotions. Each promotion can belong to at most one campaign. Linking a promotion to a campaign does not change how the promotion works — it simply creates a reference for tracking purposes.

All [promotion types](../Promotions.md) can be linked to a campaign: category/brand, multi-buy, kit, product search, price list, order amount, and shipping promotions.

### Promotions → Price Lists

Promotions that use price lists (promotion type 6) have an additional layer of detail. The price list contains individual price list items — one per SKU — and each item can carry planning data such as planned sales volume and planned revenue.

This three-level structure enables performance tracking at multiple levels of granularity:

| Level | What you can track |
| --- | --- |
| **Campaign** | Total planned vs. actual revenue, total sales volume, overall variance |
| **Promotion** | Revenue and volume per promotion within the campaign |
| **SKU** | Revenue and volume per individual product/variant within a promotion's price list |

### Example Structure

A "Summer Sale 2026" campaign might look like:

| Campaign | Promotion | Type | Price List Items |
| --- | --- | --- | --- |
| Summer Sale 2026 | 20% off summer clothing | Category/Brand | — |
| Summer Sale 2026 | Clearance: shoes | Price List | 45 SKUs with individual discounted prices |
| Summer Sale 2026 | Buy 2 get 1 free socks | Multi-Buy | — |
| Summer Sale 2026 | Free shipping over 500 NOK | Shipping | — |

The category/brand and multi-buy promotions contribute to campaign performance through order analytics. The price list promotion also carries SKU-level planning data for more detailed forecasting.

* * *

## Market and Store Targeting

Campaigns can be scoped to specific markets and stores:

*   **Markets**: Specify which markets the campaign applies to. This is informational and used for filtering — the actual market restrictions are configured on each promotion individually.
*   **Stores**: Specify which stores the campaign targets. An empty list means all stores.

> The market and store settings on the campaign are primarily for organizational purposes and filtering in the campaign list. The actual market and store restrictions that affect pricing and discount application are configured on the individual promotions linked to the campaign.

* * *

## Tags

Tags allow you to categorize campaigns for easy filtering. Common examples:

*   `seasonal`, `clearance`, `product-launch`, `loyalty`
*   `black-friday`, `christmas`, `back-to-school`
*   `high-priority`, `test`

Tags are searchable in the campaign list and can be used to quickly find related campaigns.
