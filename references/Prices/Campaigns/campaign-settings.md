# Campaign Settings

Source: https://docs.omnium.no/docs/Prices/Campaigns/campaign-settings

> How to configure campaign statuses with a locked status, campaign milestones and deadlines, planning dimensions, sales channels and the thresholds of the campaign overview.

Campaign settings decide how campaigns move through their lifecycle and how the campaign page's **Status**, **Planning** and **Follow-up** tabs read them: which status freezes the plan before a campaign goes live, which deadlines every campaign gets, how planned items are grouped, and which sales channels actual sales are split into. The settings are tenant settings under **Configuration → Settings → Orders → Promotion**, on three tabs: **Campaign Statuses**, **Campaign milestones** and **Campaign planning**.

Every setting on this page is optional. A tenant that leaves them empty keeps the default statuses (Planning, Active, Completed, Archived), gets no milestones, and sees the campaign overview with its default thresholds and channels.

* * *

## Lock the plan with a locked campaign status

A campaign status can be marked as the **locked** status: the phase between the end of planning and the campaign start date, when the package is frozen. On the campaign page's **Status** tab, a campaign's bar is split into an open phase (planning), a locked phase and a live phase, and the lock date is marked on the timeline.

While a campaign is in the locked status, an edit of an item on its price lists that changes the planned volume, the price or the cost inputs is refused in the Omnium UI, unless you are an administrator: Omnium staff or a user with the tenant's **Administrators** role. Taking an item out of the plan is still allowed, since that is the action a locked plan needs.

Each campaign status has these two fields besides its name, flags and available next steps:

| Field | Type | Description |
| --- | --- | --- |
| `Is locked status` | bool | Marks the status as the locked status. Only one status can be the locked status. |
| `Default offset days` | int | Days from the campaign start date to the default date of this status, negative for a date before the start. The date is set when a campaign gets a start date and moves with it until someone sets it by hand. Empty leaves the date open. |

Give the locked status a default offset, for example `-14` for two weeks before the start. The status's date is then filled in when a campaign gets a start date, for the statuses after the campaign's current status and unless that date has already passed, so a campaign created less than two weeks before its start gets no lock date. Without an offset, the date stays open until someone sets it on the campaign.

The campaign moves into the locked status through the automatic status transition: the `AutoTransitionCampaignsScheduledTask` scheduled task moves a campaign on its first run on or after the status's date. Set the task up under **Configuration → Settings → Integrations → Scheduled Tasks**; without it, no campaign locks by itself.

### Rules for the locked status

Saving the campaign statuses is refused when a rule is broken, with a message that names the status:

*   A status can be the active, locked, completed or archived status, but only one of them.
*   Only one status can be the locked status.
*   Every planning status (a status with none of the four flags) must have the locked status as an available next step, so a campaign can be locked on its lock date.
*   The locked status must have the active status as an available next step, so a locked campaign can go live on its start date.

A tenant that adds a locked status keeps its existing campaigns as they are: they have no lock date until someone sets one. Moving the start date of a campaign that has not reached the locked status also fills in its lock date, if that date has not passed. The **Status** tab shows them with a two-phase bar until then.

* * *

## Give every campaign milestones and deadlines

Milestones are dated deadlines every campaign gets besides its statuses, such as the store order deadline, a print deadline or the export to a replenishment system. They are listed on the campaign's timeline, and the ones marked as deadlines count for the campaign's next deadline on the **Status** tab.

Configure the milestone types on the **Campaign milestones** tab:

| Field | Type | Description |
| --- | --- | --- |
| `Key` | string | Unique key of the milestone. Required. |
| `Name` | string | The name shown on the campaign. |
| `Translate key` | string | Optional translation key for the name. |
| `Default offset days` | int | Days from the campaign start date to the default milestone date, negative for a date before the start. Empty creates the milestone without a date. |
| `Is deadline` | bool | The milestone counts as a deadline. A milestone that is not a deadline only marks the timeline. |

A campaign gets one milestone per type when it gets a start date: when it is created or copied with a start date, or when a start date is first set. A milestone type added later is added to a campaign the next time the campaign is saved with a start date. Default dates move with the campaign's start date until someone sets them by hand on the campaign.

The key `PlanningStart` is reserved for the day planning opens. A campaign whose planning start lies in the future counts as not started on the **Status** tab.

Saving is refused when a milestone has no key or two milestones share a key.

* * *

## Configure the campaign overview thresholds

The **Campaign overview** card on the **Campaign planning** tab holds the thresholds of the campaign page:

| Field | Type | Description |
| --- | --- | --- |
| `Deadline warning (days)` | int | A deadline this many days away or closer shows in amber on the **Status** tab. Empty means 14 days. |
| `Critical deadline (days)` | int | A deadline this many days away or closer shows in red. Empty means 3 days. |
| `Low store margin (%)` | decimal | A planned item whose store margin is below this percentage is flagged before the campaign locks. Empty means 20 %. |
| `Actual sales` | string | Which order lines count as a campaign's actual sales on the **Follow-up** tab. See below. |
| `Required dimensions` | array | Planning dimensions every planned item needs a value for. An item without one is flagged before the campaign locks. |

The thresholds apply when the tabs are read, so changing them needs no recalculation of the price lists.

### Choose what counts as actual sales

| Value | Shown as | Description |
| --- | --- | --- |
| `Promotion` | Order lines with the campaign's promotions | Only order lines that carry one of the campaign's promotions count. This is the default. |
| `SkuWindow` | All sales of the campaign's items during the campaign | Every sale of the campaign's items during the campaign counts, whether or not a promotion was applied. Use it when your point of sale does not report the promotions it applied. |

* * *

## Group planned items with planning dimensions

Planning dimensions are the ways to break down and filter the planned items of a campaign, such as placement, category manager or brand. The **Planning** tab breaks revenue down by them and filters on them, and the **Follow-up** tab compares actual sales with the forecast per dimension value.

| Field | Type | Description |
| --- | --- | --- |
| `Key` | string | Unique key of the dimension. Required. |
| `Name` | string | The name shown on the campaign page. |
| `Translate key` | string | Optional translation key for the name. |
| `Source` | string | Where the value is read from. See the table below. |
| `Property key` | string | The property to read for the `ProductProperty` and `ItemProperty` sources. Required for those two, not used by the others. |
| `Breakdown` | bool | Offer the dimension in the revenue breakdown. |
| `Filter` | bool | Offer the dimension as a filter on the **Planning** tab. |

| Source | Shown as | Reads |
| --- | --- | --- |
| `Brand` | Brand | The product's brand |
| `Supplier` | Supplier | The product's supplier |
| `ProductGroup` | Product group | The product group of the variant, or of the product when the variant has none. Set through `productGroup` in the [product API](../../Product/api-reference/product-updates.md#product-group) or by an integration. |
| `MainCategory` | Main category | The product's main category |
| `ProductType` | Product type | The product type |
| `AssortmentCode` | Assortment code | The product's assortment codes |
| `ProductProperty` | Product property | A product property, named by the property key. Typical for a category manager. |
| `ItemProperty` | Price list item property | A property set on the price list item during planning, named by the property key. Typical for a placement. |

Price list items keep the product values the dimensions read, and get them when the item is calculated. Items calculated before a dimension was added get its values the next time their price list is calculated.

Saving is refused when a dimension has no key, two dimensions share a key, a property source has no property key, or a required dimension is not one of the configured dimensions.

* * *

## Split actual sales into sales channels

Sales channels split the actual sales on the **Follow-up** tab into channels such as physical store, reseller and online.

| Field | Type | Description |
| --- | --- | --- |
| `Key` | string | Unique key of the channel. Required. |
| `Name` | string | The name shown on the campaign page. |
| `Translate key` | string | Optional translation key for the name. |
| `Store Groups` | array | The store groups whose sales belong to the channel. |
| `Stores` | array | The stores whose sales belong to the channel. |
| `Order types` | array | The order types whose sales belong to the channel. |

An order line belongs to the first channel that lists its store, then the first that lists its store group, then the first that lists its order type. A line that no channel claims counts as **Other**. A reseller channel therefore needs the reseller stores in a store group of their own, or listed one by one.

Without configured channels, the **Follow-up** tab uses two: **Physical store** for the `Pos` order type, and **Online** for the `Online`, `ClickAndCollect`, `Bopis` and `ShipFromStore` order types.

Saving is refused when a channel has no key or two channels share a key.

* * *

## Permissions

Changing these settings requires administrator access to **Configuration → Settings**.

Who sees and may act in each stage and tab of the campaign feature is set per role, in **Administration → Roles → Edit role → Functions** (and per function in **Administration → Authorization → Functions**). The area rights on the campaign and price list pages come first: Create, Read, Update and Delete on **Campaigns** decide who may create, read, change and delete a campaign, and Update on **Price lists** who may change its items. The functions below refine them. Every function a tenant has not changed keeps the rights of the page it sits under, so nothing changes until a role is toggled.

| Function | What it gates |
| --- | --- |
| Campaign calendar | The **Status** tab, and the campaign lanes of the promotion calendar. |
| Campaign planning | The **Planning** tab, and taking items out of the plan or putting them back. |
| Campaign follow-up | The **Follow-up** tab. |
| Lock campaign | Moving a campaign into the locked status, which is also the approval of its plan. |
| Activate campaign, Complete campaign, Archive campaign | Moving a campaign into the active, completed and archived status by hand. A status without a flag takes only the Update right. |
| Reopen campaign plan | Moving a campaign out of a status that freezes the plan into one that does not. |
| Change a locked campaign plan | Changing a frozen plan: items, linked promotions, dates and step dates. Off for every role until granted; Omnium staff, the tenant's Administrators role and roles with Administer on the campaign page hold it. Every change takes a reason, which is logged on the campaign. |
| Edit all campaigns | With **Campaign editing** set to assigned campaigns: editing every campaign and changing who is responsible or assigned. Off until granted. |
| Global campaigns, Local campaigns | With **Store-scoped campaigns** on: creating and editing chain-wide campaigns, and campaigns for the user's own stores and markets. |
| Change costs on price list items, Change planned volumes on price list items | The cost fields and the planned volumes of a price list item, on every price list. A save that changes a field the user lacks the function for is refused, naming the fields. |

The plan of a campaign is frozen while it is in the locked status, and in every status marked **Freezes planning** on the campaign statuses card. A status marked **Manual transition only** is never entered by the scheduler; a user with the matching function moves the campaign on or after the step date.

Two settings on the **Campaign planning** card scope the campaigns themselves. **Campaign editing** limits changes to the campaigns a user is responsible for or assigned to. **Store-scoped campaigns** shows a user without access to all stores only the chain-wide campaigns and the campaigns naming one of their stores or markets. Both are off by default.

Margins, costs and the alerts that read them are shown only to users with read access to cost prices; the other figures are shown to everyone with access to the campaigns. Users who only have read access to Promotions see campaigns within the **Campaign read access months** window.

## Related documentation

*   [Campaign Overview](overview.md)
*   [Campaign Planning](campaign-planning.md)
*   [Campaign Performance](campaign-performance.md)
*   [Price Lists](../PriceLists.md)
