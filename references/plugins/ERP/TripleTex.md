# TripleTex

Source: https://docs.omnium.no/docs/plugins/ERP/TripleTex

## Omnium Tripletex integration

Do you have multiple sales channels and manage accounting in Tripletex? Let Omnium take care of the integrations and automate the entire process from the customer finding your products to the order being shipped and the invoice being recorded.

Tripletex is a cloud-based finance and accounting system. Through Omnium's integration, we ensure the creation of products, customers, orders, payments, and invoices directly in Tripletex.

## How it works

### 1\. **Order reception**

An order will come into Omnium from one of the sales channels. It could be from:

*   Online store
*   Point-of-sale system
*   EDI
*   B2B portal
*   Other sales channels

### 2\. **Customer and order creation**

Omnium will automatically create a customer and order in Tripletex upon receipt of the order.

### 3\. **Payment method linkage**

Payment methods in Omnium are linked to payment methods in Tripletex, ensuring that the order is processed correctly in Tripletex.

### 4\. **Invoice creation**

Orders to be invoiced via Tripletex will automatically be invoiced when the order comes from Omnium.

### 5\. **Customer payment and bank reconciliation**

*   The customer pays the invoice.
*   Tripletex receives the payment information through automatic bank reconciliation.

### 6\. **Order status update**

Paid invoices in Tripletex are captured by Omnium, which in turn marks the relevant orders as paid.

### 7\. **Order visibility**

Paid orders will appear on pick lists or be available for WMS or other systems via Omnium's API.

### 8\. **Accounting integration**

Upon completion of the order, payments are automatically posted to the desired accounts in the accounting system.

## Authentication

Omnium connects to Tripletex as an integration with the application name `Omnium_OMS` in production. The connector creates and renews the session token itself from an employee token that the customer creates in Tripletex.

### Create the employee token in Tripletex

The token must be created by a user in the Tripletex company that Omnium should post to:

1.  Log in to Tripletex and activate the Integrations service if it is not already active.

2.  Open the **API access** tab for the user who should own the token, and click **New token**.

3.  Select **Adapted setup** and enter the application name for the Tripletex environment. The name is case sensitive.

    | Environment | Application name |
    | --- | --- |
    | Tripletex production (`tripletex.no`) | `Omnium_OMS` |
    | Tripletex test environment (`api-test.tripletex.tech`) | `61917593-4108-4570-9746-780ea6893a9e` |

4.  Give the token all entitlements, or the same entitlements as the owner.

5.  Copy the token. Tripletex shows it only once. If it is lost, create a new token for the same integration. This invalidates the previous token.

6.  Add the token to the Tripletex connector in Omnium, as described in [Add the token to the connector](TripleTex.md#add-the-token-to-the-connector).

Tripletex has a guide for end users: [Create an employee token](https://hjelp.tripletex.no/hc/no/articles/4409557117713).

### Add the token to the connector

Add the employee token as a property on the Tripletex connector:

```json
{
  "key": "EmployeeToken",
  "value": "<employee token>"
}
```

Set the host of the connector to the Tripletex environment. The host must end with `/`.

| Environment | Host |
| --- | --- |
| Tripletex production, including test companies in `tripletex.no` | `https://tripletex.no/v2/` |
| Tripletex test environment | `https://api-test.tripletex.tech/v2/` |

> A connector without `EmployeeToken` uses a session token in the password field instead. Session tokens expire, and Tripletex then rejects every request with `401 Unauthorized`. Replace the session token with an employee token.

## Connector Settings

All settings below are added to the Tripletex connector configuration in Omnium.

### Export per Shipment

Post orders to Tripletex per partial shipment instead of per order.

```json
{
  "key": "ExportPerShipment",
  "value": "true"
}
```

![Image](https://docs.omnium.no/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Ftt-exportpershipment.21eb4429.png&w=3840&q=75)

**Effect:**

*   One order is created in Tripletex per shipment.
*   Orders can be posted even if only one of the shipments has been completed.

> If your orders include split shipments (multiple shipments per order), it is recommended to enable this setting to ensure correct posting in Tripletex.

### Prioritize Amounts Including VAT

Controls whether Tripletex should prioritize amounts including VAT when creating orders and returns. This is enabled by default.

```json
{
  "key": "IsPrioritizeAmountsIncludingVat",
  "value": "true"
}
```

**Effect:**

*   When set to `true` (default), Tripletex treats the amounts including VAT as the source of truth and calculates the excluding-VAT amounts from them.
*   When set to `false`, Tripletex treats the amounts excluding VAT as the source of truth instead.

### Posting Products on Specific Accounts

Leverage the product category structure in Omnium to control which accounts in Tripletex to post certain products to.

#### Setup

1.  Add the property `"SyncProducts": "true"` to the Tripletex connector options.
2.  Set the property `"TripletexProductAccount": "<accountNumber>"` on the category you wish to book on a specific account.
3.  Set up the scheduled task **Update product categories**. This task copies the category information onto the products in Omnium, enriching them with the property from step 2.

> Changes made to categories will not take effect until the scheduled task has run. You can manually trigger it from the scheduled task list under **Configuration → Settings** in Omnium.

#### How It Works

When exporting invoices or orders to Tripletex, the connector looks up the product for each order line and checks for the `"TripletexProductAccount"` property. If present, the product in Tripletex will have its account updated to the specified account.

## VAT Handling

Every Tripletex order line must be tagged with a Tripletex **VAT type** — the numeric `id` of a row in Tripletex's `ledger/vatType` register. When Omnium exports an order, shipment, or return, the connector resolves a VAT type for each line by combining several inputs: the connector default, the market default, the tax rate on the order line itself, optional per-category overrides, and finally the destination address. This section explains the full resolution chain, when each layer kicks in, and how to extend it.

### Common Tripletex VAT type IDs

The Norwegian Tripletex VAT register includes (among many others) the following IDs that the connector treats specially:

| Id | Description |
| --- | --- |
| `3` | Outbound tax, high rate (25%) |
| `5` | Outbound tax, zero rate — goods with deduction right (e.g. books) |
| `6` | No output tax (outside the VAT Act) (0%) |
| `31` | Outbound tax, medium rate (15%) — e.g. groceries |
| `52` | Duty-free export of goods and services (0%) — used for Svalbard/Jan Mayen |

The full list of available VAT types — including any custom types — can be retrieved from Tripletex via `GET /v2/ledger/vatType`. Note that IDs can differ between tenants for custom types, so always verify against the live register.

### Resolution order

For each order line the connector applies the following layers, in this order. A later layer overrides an earlier one.

1.  **Connector default** — the connector starts from VAT type `id = 3` (high rate, 25%).
2.  **Market default** — if the order has a `MarketId` and the corresponding Omnium market has `DefaultVatType` set, that VAT type becomes the new default for the order. Use this to switch entire markets to a different VAT regime (e.g. a Swedish market with a Tripletex VAT type for Swedish sales).
3.  **Order-line tax rate heuristic** — applied per line on top of the default:
    *   If the default is `3` (high rate) and the order line has `TaxRate == 0`, the line is exported as `id = 6` (outside the VAT Act).
    *   If the order line has `TaxRate ≈ 15`, the line is exported as `id = 31` (medium rate).
    *   Otherwise, the default VAT type is used.
4.  **Per-category override** — if `UseCategoryVatTypeOverride` is enabled on the connector and the product's category tree resolves to a `TripleTexVatTypeId`, that VAT type replaces the value picked in steps 1–3 for that line. See [VAT-Type Override per Product Category](TripleTex.md#vat-type-override-per-product-category) below.
5.  **Svalbard / Jan Mayen** — if the destination address is on Svalbard or Jan Mayen, **every** order line on the export is forced to `id = 52` (duty-free export), overriding all previous layers. See [Svalbard and Jan Mayen](TripleTex.md#svalbard-and-jan-mayen) below.

The shipping order line (`"Frakt"`) always uses the resolved default VAT type for the order (steps 1–2), not the per-line or per-category logic. Svalbard still applies to the shipping line because the Svalbard override iterates over all lines.

### Prioritize Amounts Including VAT

The `IsPrioritizeAmountsIncludingVat` connector setting (see [Connector Settings](TripleTex.md#prioritize-amounts-including-vat)) controls whether Tripletex treats the **including-VAT** or **excluding-VAT** amount as the source of truth when the resolved VAT type implies a different rate than what was on the original order line. With the default `true`, the gross amount is preserved and Tripletex re-derives the net amount from it; with `false`, the net amount is preserved and Tripletex re-derives the gross. This setting matters when categories or markets remap a line to a VAT type that doesn't match the rate used at checkout.

### VAT-Type Override per Product Category

Some assortments require a specific Tripletex VAT type regardless of the rate that came in on the order line. The most common case is **books** in Norway, which must be booked on a zero-rate-with-deduction VAT type (e.g. `id = 5`) rather than the high-rate default — even though the order may have arrived from the storefront with `TaxRate = 0` and would otherwise be mapped to `id = 6`. This is what the per-category override is designed for.

The override is configured on the product **category** and applies to every order line whose product belongs to that category (or a child category).

#### Setup

1.  Enable the feature on the Tripletex connector by adding the property:

    ```json
    {
      "key": "UseCategoryVatTypeOverride",
      "value": "true"
    }
    ```

2.  On each product category that should override the VAT type, set the property:

    ```json
    {
      "key": "TripleTexVatTypeId",
      "value": "<tripletexVatTypeId>"
    }
    ```

    For example, on a "Books" category, set the value to `5` to force every order line containing a book to be exported with VAT type 5 (zero rate with deduction).

> The override is read directly from the live product category at export time and does not require the **Update product categories** scheduled task to have run.

#### How it works

When `UseCategoryVatTypeOverride` is enabled, the connector resolves a VAT-type override per order line during order, shipment, and return export:

1.  For each order line, the connector loads the matching product from Omnium (by product id or SKU).
2.  It collects all product categories the product belongs to via `CategoryIds`, filtered to the same language as the product.
3.  It walks the category tree starting from the product's `MainCategoryId` and follows `ParentId` upwards. The **first** category in that chain that has a `TripleTexVatTypeId` property wins.
4.  If no category in the main-category chain has the property set, the connector falls back to the remaining categories on the product and uses the first match found.
5.  The resolved Tripletex VAT type replaces the VAT type that would otherwise have come out of steps 1–3 in the resolution order.

If `TripleTexVatTypeId` is not set on any of the product's categories — or if the value does not match a known VAT type returned by Tripletex — the order line falls back to the standard resolution (default VAT type adjusted by the line tax rate).

> Because the lookup walks up from `MainCategoryId` first, you can set a broad default `TripleTexVatTypeId` on a parent category and override it on a more specific child category if needed. The most specific category in the chain takes precedence.

### Svalbard and Jan Mayen

Sales to Svalbard and Jan Mayen are outside the Norwegian VAT area and must be booked as duty-free in Tripletex (VAT type `id = 52`). The connector detects these destinations from the **shipping address postal code** on the order or shipment being exported:

| Postal code | Treated as |
| --- | --- |
| `917x` (prefix) | Svalbard |
| `8099` | Jan Mayen |

When the destination matches, the connector overwrites the `vatType` on **every** order line in the export to VAT type `id = 52`, including the shipping line and lines with a per-category override. This applies to both order exports and return exports.

The detection is purely postal-code based; the country code on the address is not consulted. Norwegian addresses with a postal code outside the ranges above are handled as ordinary Norwegian sales. There is no connector setting to disable this behavior. If a Svalbard address must be exported with a different VAT type, the address itself has to be changed.

#### The order must arrive without VAT

The connector only changes the VAT type. The amounts are exported as they are on the order, so the order must already be without VAT when it is created in Omnium. This is the responsibility of the webshop or the integration that creates the order:

*   Every order line has a tax rate of 0, and the price is the price without VAT.
*   The shipping cost has a tax rate of 0, and the amount is the amount without VAT.
*   The customer pays the amount without VAT, so the payment matches the order total.

If the order arrives with 25% VAT, the lines are sent to Tripletex with VAT type `52` (0%) but with different amounts including and excluding VAT, and Tripletex rejects them. The connector does not remove the VAT from the amounts, because the invoice must match the amount the customer paid.
