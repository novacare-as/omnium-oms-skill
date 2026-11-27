# Prices

Source: https://docs.omnium.no/docs/plugins/POS/Sitoo/Prices

> Price synchronization between Omnium and Sitoo including promotion prices, price lists, and tax.

# Prices

Price synchronization between Omnium and Sitoo operates in both directions. Product prices are exported from Omnium to Sitoo, while order prices are imported from Sitoo into Omnium when POS transactions are received. Both Sitoo and Omnium are designed to do their own promotion and discount calculations, this has consequences on how one should sync prices between the two.

## Price Export

### Product Prices

When products are exported to Sitoo, three prices are sent for each product:

| Price | Description |
| --- | --- |
| Selling price | The current price the product is sold for |
| Original price | The original or suggested retail price (SRP) |
| Cost price | The purchase/cost price (always excluding VAT) |

The integration determines the best valid price for each product in a given market. If a variant does not have its own price, it inherits prices from its parent product.

#### Filtering Prices During Export

Two settings control which prices are included when exporting products:

| Setting | Description |
| --- | --- |
| `IgnorePromotionPricesInProductSync` | Excludes promotion-based prices from the export. Use this when Sitoo handles its own promotions and should not receive pre-calculated promotion prices from Omnium. |
| `IgnorePriceListPricesInProductSync` | Excludes price list prices from the export. Use this when price lists are managed separately in Sitoo. |

When these settings are enabled, only the base product price is exported rather than a promotional or price-list-specific price.

### Price Lists

Omnium price lists can be exported to Sitoo, making it possible to offer segment-specific or campaign prices directly at the POS without requiring manual price configuration in Sitoo.

When a price list is exported, the integration creates two corresponding objects in Sitoo:

| Sitoo Object | Purpose |
| --- | --- |
| **Price list** | Holds the per-SKU prices with the same name, currency, and active status as the Omnium price list |
| **Voucher** | Activates the price list when applied at the POS. Named after the price list. |

The price list is updated whenever the Omnium price list or its items change. If the price list is deleted in Omnium, both the Sitoo price list and its associated voucher are removed.

#### Store-Specific Pricing

If a price list is associated with specific stores in Omnium, those store IDs are added as tags on the Sitoo price list. This allows store-level filtering and targeting in Sitoo.

#### Customer Club Price Lists

Price lists marked as customer club-specific in Omnium are exported with a restricted voucher. Omnium automatically creates both the price list and its voucher in Sitoo. The voucher is configured with the password `member`, so the price list is only activated for customers who hold that password at the POS.

#### Promotion-Linked Price Lists

A price list can be linked to a promotion in Omnium. When linked, the Sitoo voucher is driven by the promotion's configuration rather than the price list's own properties.

| Voucher field | Source |
| --- | --- |
| `VoucherName` | Promotion name (or market-specific translation if available) |
| `DateStart` / `DateEnd` | Promotion `ActiveFrom` / `ActiveTo` |
| `VoucherPassword` | Promotion coupon code |
| `Tags` | Promotion stores |
| `PriceListTags` | Derived from the price list name (sanitized to uppercase alphanumeric, max 16 characters) |
| `VoucherType` | Controlled by the price list's **Allow Promotions** setting (see below) |

The `VoucherType` determines whether the price list can be combined with other active promotions at the POS:

| Price list setting | Sitoo voucher type | Effect |
| --- | --- | --- |
| Allow promotions: **on** | `PricelistActivate` (400) | Price list activates and other promotions can still apply |
| Allow promotions: **off** | `PricelistActivateFinal` (410) | Price list activates exclusively — other vouchers are blocked |

If the price list already had a Sitoo voucher before the promotion was linked, that existing voucher is reused rather than a new one being created, avoiding duplication in Sitoo.

See the [Promotions page](Promotions.md#price-list-activation) for details on how to configure the promotion side.

#### Triggering the Export

Price list export is triggered automatically by Omnium workflows whenever a price list is created, updated, or deleted. No scheduled task is required — changes are pushed in real time.

#### Configuration

Add `IPriceListExporter` to the list of implementations at the global connector settings.

### Purchase Prices (Cost Prices)

Purchase prices are exported separately from selling prices on their own schedule. Each product's best cost price is sent to a designated purchase price list in Sitoo.

**Configuration -> Settings -> Integrations -> Scheduled tasks**

```json
{
    "schedule": "0 3 * * *",
    "implementationType": "SitooCostPriceScheduledTask",
    "isDisabled": false
}
```

## Price Import

### Order Prices

When a POS order is imported from Sitoo, the integration reconstructs pricing from Sitoo's order data.

#### Order Line Prices

For each order line, the unit price is reconstructed by combining the line total (net + VAT) with any discount that was applied, then dividing by the quantity. This gives the original per-unit price before discounts.

The tax rate from Sitoo is preserved on each order line.

#### Order Totals

The order total is derived from Sitoo's final net and VAT amounts. Sitoo may apply a small rounding adjustment to make the gross total align with exact currency units — this adjustment is stored separately on the order for reconciliation purposes.

If the order includes bonus point redemptions, those are treated as order-level monetary adjustments rather than line-level discounts.

### Discount Handling

Discounts from Sitoo orders are imported into Omnium through several paths depending on how the discount was applied:

*   **Separate discount lines**: When Sitoo represents a discount as its own order line, the discount value is extracted and attached to the relevant product line in Omnium.
*   **Inline product discounts**: When a discount is applied directly to a product line in Sitoo, it is imported as a discount on that line. If the `SitooManualDiscountsAlwaysApply` setting is enabled, manual POS discounts are marked so they are preserved during any order recalculation in Omnium.
*   **Price overrides**: When a product's selling price differs from its original price, the difference is captured as a discount.

#### Discount Combinability

The `SitooDiscountsCombinable` setting controls whether all imported discounts are marked as combinable with other promotions. This should in most cases be enabled.

#### Multiple Lines with the Same SKU

When an order contains multiple lines for the same product and those lines have discounts, the discount is applied directly to the line amount rather than as a separate discount object. This avoids ambiguity about which line a discount belongs to.

## Order Export Prices

When Omnium exports orders to Sitoo (e.g., for endless aisle fulfillment), the price mapping depends on the order type:

### Paid Orders

For orders already paid at the POS, the full price and discount breakdown is sent to Sitoo, including the per-line price, discount amount, and tax rate.

### Booking Orders

For unpaid booking orders, the behavior depends on the `IgnorePromotionPricesInProductSync` setting:

*   **When promotions are NOT ignored**: The discounted price and discount amount are included, since Sitoo already has the base price and will not recalculate.
*   **When promotions ARE ignored**: Only the base price is sent without discounts, because Sitoo will apply its own promotions when the order is finalized at the POS.

### Overriding Discount Export per Order Type

If certain order types need to be exported with discounts applied regardless of the logic above, the `ExportWithDiscountsForOrderTypes` key group can be used. Each entry in the key group specifies one Omnium order type name:

| Key Group | Value |
| --- | --- |
| `ExportWithDiscountsForOrderTypes` | `InternalTransfer` |
| `ExportWithDiscountsForOrderTypes` | `WebOrder` |

When an order's type matches any entry (case-insensitive), the full discounted price and discount breakdown is sent to Sitoo — identical to how paid orders are exported.

## Promotion Prices

Omnium promotions can be exported to Sitoo as vouchers. Different promotion types are mapped accordingly — fixed-amount discounts are sent as monetary values, while percentage-based discounts are sent as percentage values.

See the [Promotions page](Promotions.md) for full details on promotion synchronization.

## Tax

Tax rates are carried along with order and product data in both directions. When orders are imported from Sitoo, the VAT percentage on each line item is preserved. When orders are exported to Sitoo, the tax rate from Omnium is included.

For product-level tax configuration and VAT group setup, see the [VAT Groups page](VatGroups.md).

## Currency

Currency is handled at the order and price list level:

*   **Orders**: The currency from the Sitoo order is stored on the Omnium order.
*   **Price lists**: Each price list is tied to a specific currency (ISO 4217). All items in the price list use that currency.

## Configuration Reference

| Setting | Description | Default |
| --- | --- | --- |
| `IgnorePromotionPricesInProductSync` | Skip promotion prices when exporting products | `false` |
| `IgnorePriceListPricesInProductSync` | Skip price list prices when exporting products | `false` |
| `SitooDiscountsCombinable` | Mark all imported discounts as combinable | `false` |
| `SitooManualDiscountsAlwaysApply` | Manual discounts from Sitoo are always applied | `false` |
| `ExportWithDiscountsForOrderTypes` | Key group — one entry per Omnium order type that should always be exported with discounts applied | Not set |
| `CustomerClubPricelistId` | Sitoo price list ID for loyalty member prices | Not set |
| `PurchasePriceListId` | Sitoo purchase price list ID for cost prices | Not set |
| `PriceListIdMapping` | Mapping between Omnium and Sitoo price list IDs | Not set |
