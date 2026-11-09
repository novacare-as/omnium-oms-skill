# Campaign Planning

Source: https://docs.omnium.no/docs/Prices/Campaigns/campaign-planning

> How to set revenue targets and sales volume forecasts at the campaign, promotion, and SKU level for accurate campaign planning.

## Planning Overview

Campaign planning in Omnium supports revenue forecasting at three levels of detail:

| Level | Where targets are set | Granularity |
| --- | --- | --- |
| **Campaign** | Aggregated from linked promotions | Total campaign revenue and volume |
| **Promotion** | On the promotion itself (manually) | Revenue per promotion |
| **SKU** | On price list items | Revenue and volume per individual product/variant |

Planning targets are set while the campaign is being planned. When the tenant has a [locked status](campaign-settings.md#lock-the-plan-with-a-locked-campaign-status), the plan freezes while the campaign is in that status: an edit of one of the campaign's price list items that changes the planned volume, price or costs is refused in the Omnium UI unless you are an administrator (Omnium staff or a user with the tenant's **Administrators** role).

* * *

## SKU-Level Planning (Price List Promotions)

The most detailed planning is available for promotions that use price lists. Each price list item (representing a single SKU) can carry:

| Field | Description |
| --- | --- |
| **Planned Sales Volume** | Expected number of units to sell during the campaign |
| **Planned Revenue** | Automatically calculated from Planned Sales Volume x Discounted Price |
| **Planning Comment** | Internal note explaining the forecast rationale |

### Setting Up SKU-Level Targets

1.  Create a [price list](../PriceLists.md) with the products included in the campaign
2.  For each price list item, set the discounted price
3.  Enter the **Planned Sales Volume** — the expected number of units to sell
4.  The **Planned Revenue** is calculated automatically
5.  Optionally add a **Planning Comment** for context
6.  Link the price list promotion to the campaign

### Example

A clearance promotion for shoes includes a price list with three SKUs:

| SKU | Original Price | Discounted Price | Planned Volume | Planned Revenue |
| --- | --- | --- | --- | --- |
| SHOE-001 | 1,200 NOK | 840 NOK | 50 units | 42,000 NOK |
| SHOE-002 | 900 NOK | 630 NOK | 80 units | 50,400 NOK |
| SHOE-003 | 1,500 NOK | 1,050 NOK | 30 units | 31,500 NOK |
| **Total** |  |  | **160 units** | **123,900 NOK** |

These targets roll up to the promotion level and then to the campaign level, giving you a full picture of the expected campaign outcome.

### Planning Figures on Each Item

Planned Revenue is in the price list's own tax basis: including VAT on a price list that includes tax. When a price list item is calculated, Omnium also works out the item's planning figures from its campaign price, its costs and its planned sales volume, and keeps them on the item:

| Figure | Calculation |
| --- | --- |
| **Planned revenue excl. VAT** | Campaign price excl. VAT × planned sales volume. The item's own tax rate wins over the price list's. |
| **Retail gross profit** | (Campaign price excl. VAT − store cost price) × volume, with the margin as a share of the price |
| **Wholesale gross profit** | (Store cost price − standard cost) × volume, with the margin as a share of the store cost price |
| **Chain gross profit** | Retail + wholesale gross profit, which is (campaign price excl. VAT − standard cost) × volume, with the margin as a share of the price |

The retail and wholesale figures need a store cost price on a price list that keeps store cost prices; without one, the item has the chain figure only. When the item has no standard cost, the purchase price converted to the price list currency is used in its place.

The figures are worked out again whenever the item is calculated, so they always follow its price, costs and volume. Items calculated before these figures existed get them the next time their price list is calculated. Until then, their campaign is left out of the forecast and listed under **Campaigns without a forecast** as **Not calculated yet**. Administrators (Omnium staff and users with the tenant's **Administrators** role) see a **Recalculate the price lists** button there, which queues the price lists of the campaigns in the period that have such items for recalculation; reload the tab when they are done. Other users don't see the button.

* * *

## Promotion-Level Planning

For promotions that don't use price lists (category/brand, multi-buy, order amount, etc.), you can set a **Planned Revenue** estimate directly on the promotion. This is a manual estimate since these promotion types apply dynamically based on cart contents.

Each promotion also supports a **Planning Notes** field for documenting assumptions, market context, or other planning considerations.

* * *

## Campaign-Level Aggregation

Campaign-level targets are automatically aggregated from the linked promotions:

*   **Total Planned Revenue** = Sum of all linked promotions' planned revenue (both SKU-level and promotion-level)
*   **Total Planned Sales Volume** = Sum of all SKU-level planned volumes from price list promotions

This aggregation provides a single view of the campaign's expected performance without manual data entry at the campaign level. SKU-level planned revenue counts excluding VAT, so it compares with actual revenue excluding VAT. Planned revenue entered on a promotion counts as entered.

* * *

## Planning Tab

The **Planning** tab on the campaign page shows the forecast of every campaign that overlaps a chosen period, using the campaign filters at the top of the page. A campaign that lies partly in the period counts with its share of days inside the period, so a period of a few weeks shows the part of each campaign's forecast that falls in those weeks.

The tab shows:

*   **Key figures** — campaigns in the period, forecast revenue excl. VAT (and incl. VAT), chain gross profit with the chain and store margin, and planned volume with the average campaign price
*   **Forecast per campaign, per week and per month**, with the campaigns in the period that have no forecast yet listed separately
*   **Revenue and gross profit per campaign** — retail, wholesale and chain gross profit with their margins. Retail and wholesale need price lists that keep store cost prices; without them the table shows one gross profit.
*   **Alerts before lock** — counts of the items that need attention before the campaign locks; click an alert to list its items
*   **Revenue breakdown** — revenue and margin per value of a [planning dimension](campaign-settings.md#group-planned-items-with-planning-dimensions), such as placement or category manager
*   **Items** — the top 10 items or all items, sortable and searchable, with their price, volume, revenue and margins. At most 500 items are listed at a time; search to narrow the list.

The alerts are:

| Alert | Flags an item when |
| --- | --- |
| **No sales forecast** | The planned volume is 0 or missing |
| **Negative chain margin** | The campaign price excl. VAT is below the standard cost |
| **Negative wholesale margin** | The store cost price is below the standard cost |
| **Store margin below 20 %** | The store margin is below the tenant's threshold, 20 % unless configured |
| **Missing standard cost** | The item has no standard cost, so the purchase price is used in its place |
| **Missing store cost price** | The price list keeps store cost prices, but the item has none |
| **Purchased in a foreign currency** | The item is bought in another currency than the price list sells in |
| **Missing required dimension** | The item has no value for a dimension every item must have |
| **Invalid item** | The item failed the price list validation |
| **Removed from the package** | The item was taken out of the plan, with a reason |

Margins, gross profit and the alerts that read costs are shown only to users with read access to cost prices.

### Remove an Item from the Plan

If you have update access to price lists, you can take an item out of the plan from the item list with **Remove from package** and a reason. The item stays on its price list with the reason and your name, counts in no planning figure, and is not activated when the price list is activated. A price it already has on the product is removed.

To undo, click **Put back in package**. The item gets no price on the product until its price list is activated again.

### Narrow the Period for Large Plans

The **Planning** tab sums at most 200 price lists at once. When the campaigns in the period use more, the tab asks you to narrow the period or the campaign filters instead of showing the figures.

* * *

## Planning Notes

Campaigns have a dedicated **Planning Notes** field for documenting:

*   Campaign goals and strategy
*   Target audience and market context
*   Key assumptions behind revenue forecasts
*   Dependencies or risks
*   Coordination notes with other teams

Planning notes are visible in the campaign detail view and are preserved throughout the campaign lifecycle.

* * *

## Planning Best Practices

### Be conservative with volume estimates

Use historical sales data from similar campaigns as a baseline. If no prior data exists, start with moderate estimates and adjust after the first campaign cycle.

### Use tags to categorize

Tag campaigns by type (e.g., `seasonal`, `clearance`, `product-launch`) to build up historical benchmarks over time. Compare campaigns with the same tags to refine future forecasts.

### Plan at the SKU level when possible

Price list promotions with SKU-level targets give you the most accurate forecasts and the most actionable post-campaign insights. Use this level of detail for your most important campaigns.

### Document assumptions

Use planning notes and planning comments to explain why specific targets were set. This context is valuable when reviewing campaign performance after the fact.
