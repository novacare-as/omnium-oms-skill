# Campaign Promotions

Source: https://docs.omnium.no/docs/Prices/Campaigns/campaign-promotions

> How to link and unlink promotions to campaigns, and how the relationship between campaigns and promotions works in practice.

## Linking Promotions to a Campaign

Promotions are linked to campaigns from the campaign detail page. Linking a promotion creates a reference between the two — it does not change the promotion's behavior or configuration.

### How to Link a Promotion

1.  Open the campaign detail page
2.  Navigate to the **Promotions** section
3.  Click **Add Promotion**
4.  Select the promotion you want to link
5.  The promotion is now associated with this campaign

### Rules

*   A promotion can be linked to **at most one campaign** at a time
*   All [promotion types](../Promotions.md) can be linked: category/brand, multi-buy, kit, product search, price list, order amount, shipping, and cost price promotions
*   Linking does not modify the promotion's market, store, or date settings — these remain independent
*   Linking is an organizational action for planning and performance tracking

### Linking Through the API

Integrations link a promotion by setting `campaignId` on the promotion with `POST /api/Promotions` or `PATCH /api/Promotions`. The campaign must exist. This works as adding the promotion on the campaign page: the campaign's dates are recalculated from its promotions, and so are the dates of the campaign the promotion leaves when it moves.

| `campaignId` in the request | Result |
| --- | --- |
| Left out (`null`) | The promotion stays in the campaign it is in (none for a new promotion) |
| A campaign id | The promotion joins that campaign, or moves to it |
| Empty string (`""`) | The promotion is taken out of its campaign |

`GET /api/Promotions/{id}` returns the promotion's `campaignId`, and `GET /api/Campaigns/{id}/promotions` lists the promotions in a campaign. See the [Campaign API](campaign-api.md#build-a-campaign-with-promotions-and-price-lists) for a full example with price lists.

* * *

## Unlinking Promotions

To remove a promotion from a campaign:

1.  Open the campaign detail page
2.  Find the promotion in the list
3.  Click **Remove** or use the context menu
4.  The promotion is unlinked but not deleted

Unlinking clears the campaign reference from the promotion. The promotion continues to function independently. Through the API, send `"campaignId": ""` on the promotion.

* * *

## Promotion Details in the Campaign View

When viewing a campaign, linked promotions are displayed in a table with key information:

| Column | Description |
| --- | --- |
| **Name** | Promotion name (clickable link to the promotion detail page) |
| **Type** | Promotion type (e.g., Category/Brand, Multi-Buy, Price List) |
| **Active From / To** | The promotion's own date range |
| **Status** | Whether the promotion is currently active |
| **Performance** | Revenue and volume metrics (when available) |

* * *

## Campaign Dates and Promotion Dates

Campaign dates and promotion dates are independent:

*   The **campaign date range** defines the overall campaign period for planning and reporting
*   Each **promotion's date range** controls when the promotion is actually active and applying discounts

A campaign may contain promotions with different date ranges. For example, a month-long "Summer Sale" campaign might include:

*   A "Early Bird" promotion running the first week only
*   A "Main Sale" promotion running for the full month
*   A "Last Chance" promotion running the final three days

Campaign dates can be automatically recalculated to span the full range of its linked promotions, ensuring the campaign period covers all associated promotional activity.

* * *

## Which Promotion Types Work Best with Campaigns?

All promotion types can be linked, but some integrate more deeply with campaign planning features:

| Promotion Type | Campaign Integration |
| --- | --- |
| **Price List** (type 6) | Deepest integration. SKU-level planning data (planned volume, planned revenue) flows from price list items into campaign performance. |
| **Category/Brand** (type 1) | Linked for tracking. Planned revenue can be set at the promotion level. Performance tracked via order analytics. |
| **Product Search** (type 5) | Similar to Category/Brand — promotion-level planning and analytics tracking. |
| **Multi-Buy** (type 2) | Linked for tracking. Performance measured through order analytics at cart time. |
| **Kit** (type 4) | Linked for tracking. Performance measured through order analytics. |
| **Order Amount** (type 3) | Linked for tracking. Planned revenue can be set at the promotion level. |
| **Shipping** (type 0) | Can be linked for organizational purposes. Shipping promotions don't generate product revenue. |
| **Cost Price** | Linked for tracking. Performance tracked via order analytics. |

> For the most detailed planning and performance tracking, use **price list promotions** within campaigns. They provide SKU-level granularity for both planning targets and actual performance.

* * *

## Promotions Without Campaigns

Promotions work independently of campaigns. You don't need to create a campaign to use promotions — campaigns are an optional organizational layer. If you only need a simple discount without planning and performance tracking, you can create and manage promotions directly from the [Promotions](../Promotions.md) section.
