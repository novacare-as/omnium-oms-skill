# InRetrn

Source: https://docs.omnium.no/docs/plugins/Other/InRetrn

> Guide for setting up the InRetrn returns integration in Omnium.

## What is InRetrn?

**InRetrn** is a returns platform that handles the consumer-facing part of a return. The customer looks up their order in the InRetrn portal, registers what they want to send back, and receives a return label. To do that, InRetrn needs the order history — which is what this integration delivers.

The integration covers three flows:

*   **Order export** — orders are pushed to InRetrn as sales orders so they can be found in the returns portal.
*   **Return export** — returns registered in Omnium are pushed to InRetrn as return orders.
*   **Returns from InRetrn** — returns and exchanges registered in the InRetrn portal are written back into Omnium through the public [Returns API](../../Order/Returns/return-api.md).

* * *

## Setup in Omnium

### Connector

Add a connector under **Configuration → Settings → Integrations → Connectors**. The connector **Name** must be `inretrn` — this is the value you reference from the workflow steps that trigger the export.

| Field | Description |
| --- | --- |
| **Name** | `inretrn` (matched case-insensitively) |
| **Host** | InRetrn API base URL. Production: `https://api.inretrn.com/`. Test: `https://uat-api.inretrn.com/` |
| **Username** | Username supplied by InRetrn |
| **Token** | API key supplied by InRetrn |

The username and token are combined and sent base64-encoded in the `Authorization` header on every request.

```json
{
    "name": "inretrn",
    "host": "https://api.inretrn.com/",
    "username": "",
    "token": "",
    "properties": [
        {
            "key": "InretrnUseShippingAddress",
            "value": "false"
        }
    ]
}
```

### Connector properties

| Property | Type | Description |
| --- | --- | --- |
| `InretrnUseShippingAddress` | bool | Send the shipment address as the buyer address instead of the billing address. Off by default, in which case the billing address is used and the shipment address is the fallback. |

### Connector selection per market

Both exports resolve the connector from the order's market, in this order:

1.  A global connector named or typed `inretrn` that lists the order's market in **Enabled for markets**.
2.  A connector named or typed `inretrn` defined directly on the market.
3.  A global connector named or typed `inretrn` with no market restriction.

This lets you run separate InRetrn accounts per market, or one account across all of them.

* * *

## Order export

### Trigger

Orders are exported by the [Export Order](../../Order/workflow-steps/export/export-order.md) workflow step with `Connector` set to `inretrn`. Add it to whichever order statuses should make the order available in the returns portal — typically the status where the order is shipped or completed.

```json
{
  "Name": "ExportOrder",
  "Connector": "inretrn"
}
```

The order must have an order number. Orders without one are rejected.

The same order is not exported twice within 10 seconds. If two status updates arrive back to back — for example from an ERP pushing two updates at once — the second export is skipped and logged rather than sent.

### Endpoint

| Method | Endpoint | Description |
| --- | --- | --- |
| **POST** | `/v2/salesorder/create` | Creates sales orders in InRetrn |

### Sales order

| InRetrn field | Omnium source |
| --- | --- |
| `OrderNo` | Order number |
| `OrderDate` | Order created date |
| `Currency` | Billing currency |
| `TransportService` | Shipping method name of the first shipment. Overridden by the order property `InretrnOrderPropTransportService` |
| `TrackingNo` | Comma-separated list of the distinct tracking numbers on the order's shipments and shipment packages |
| `ExternalSellerReference` | See [External seller reference](InRetrn.md#external-seller-reference) |

### Buyer

| InRetrn field | Omnium source |
| --- | --- |
| `CustomerNo` | Customer number of the customer on the order |
| `Name` | Customer name |
| `Email` | Customer email |
| `MobilePhone` | Customer phone, truncated to 15 characters |
| `Region` | Region name and region code of the source address |
| `Address.AddressLine1` / `AddressLine2` | Address lines |
| `Address.PostalCode` / `City` / `Region` | Postal code, city, region |
| `Address.Country` | ISO 3166-1 alpha-2 country code. See [Country resolution](InRetrn.md#country-resolution) |

The source address is the billing address, or the shipment address when `InretrnUseShippingAddress` is enabled. Whichever is chosen, the other one is used as fallback when it is missing.

### Payments

One entry per payment on the order.

| InRetrn field | Omnium source |
| --- | --- |
| `Amount` | Payment amount |
| `PaymentGatewayReference` | Payment transaction id |
| `PaymentGatewayType` | Payment method name |

### Order lines

Each order line is looked up as a product before it is mapped. The line's code is searched as both product id and SKU id, the results are narrowed to the order's market, and the product matching the market's content language is preferred. When the code matches a variant, the parent product supplies the item data and the variant supplies the variant data, with the parent as fallback for any empty variant field.

| InRetrn field | Omnium source |
| --- | --- |
| `ItemNo` | Product id of the parent product. Falls back to the order line's product id, then its code |
| `ItemVariantNo` | Variant id with the parent product id removed |
| `ItemDescription1` | Product name, truncated to 125 characters |
| `ItemVariantDescription` | Variant name, truncated to 125 characters |
| `ItemEan` | Variant EAN, first GTIN, or SKU id; then the parent's EAN or SKU id; then the order line's EAN or code |
| `LineNumber` | Line item id |
| `OrderedQuantity` | Quantity minus canceled quantity |
| `ShippedQuantity` | Delivered quantity |
| `UnitNetPrice` | Extended price excluding tax, divided by quantity |
| `UnitGrossPrice` | Extended price, divided by quantity |
| `UnitInPrice` | Line cost |
| `VatPercent` | Tax rate |
| `UnitOfMeasure` | Selected unit, or `stk` when the line has none |
| `LineType` | `1` for product lines. `2` for freight lines and for lines whose product carries a return or claim flag |
| `ItemImageUrl` | Line image URL |
| `UnitHeight` / `UnitWidth` / `UnitLength` | Dimensions of the shipment package the line belongs to, otherwise the product's first colli |
| `UnitNetWeight` | Product weight |
| `ItemHarmonizationCode` | Product customs code |
| `ItemCountryOfOrigin` | Product country of origin, resolved to an ISO 3166-1 alpha-2 code |
| `ItemSeasonCode` | Product season. On variant lines this currently carries the product brand |
| `BrandName` / `BrandCodeName` | Product brand, falling back to the order line's brand |
| `SupplierName` / `SupplierCodeName` | Supplier name and id. Read from the product; when the product carries supplier data, the order line's supplier is used instead |
| `ProductGroup` / `ProductGroupDescription` | Id and name of the product's main category, or its first category |
| `ModeOfTransport` | Shipping method name of the shipment the line belongs to. Overridden by the order property `InretrnModeOfTransportation` |
| `TrackingNo` | Tracking number of the shipment the line belongs to |
| `ReturnAllowed` / `ClaimAllowed` | Set from the product properties `InretrnReturnAllowed` and `InretrnClaimAllowed` |

### Freight lines

One additional order line is appended per shipment on the order:

| InRetrn field | Value |
| --- | --- |
| `ItemNo` | `Freight` |
| `LineNumber` | Shipment id |
| `LineType` | `2` |
| `ItemDescription1` | `shipment:` followed by the shipping label |
| `UnitGrossPrice` | Shipping subtotal |
| `UnitNetPrice` | Shipping subtotal excluding tax |
| `OrderedQuantity` | `1` |
| `ShippedQuantity` | `1` when the shipment is shipped, otherwise `0` |

### Backfilling order history

Orders placed before the integration went live are not in InRetrn, so customers cannot look them up in the portal. Existing order history can be loaded in bulk — contact Omnium support to arrange it. Orders without order lines or without an order number are skipped.

* * *

## Return export

### Trigger

Returns are exported by the [Export Order](../../Order/Returns/return-workflow-steps/export/export-order.md) return workflow step with `Connector` set to `inretrn`. Add it to the return status where the return should be registered in InRetrn.

```json
{
  "Name": "ExportOrder",
  "Connector": "inretrn"
}
```

After a successful export, the InRetrn return order number is stored on the return as the external id `InretrnReturnId`. Running the step again exports the return again — Omnium does not skip returns that already carry the external id.

### Endpoint

| Method | Endpoint | Description |
| --- | --- | --- |
| **POST** | `/v1/returnorder/create` | Creates return orders in InRetrn |

### Return order

| InRetrn field | Omnium source |
| --- | --- |
| `OrderNo` | Order number of the original order |
| `ReturnOrderNo` | `Omnium-{orderNumber}-{nn}`, where `nn` counts the returns on the order up to and including this one |
| `ReturnOrderDate` | Return created date |
| `SourceOfReturn` | The return's origin. Returns created without an origin are sent with a placeholder value, so set the origin when creating the return |
| `ReturnLabelUrl` | Label link of the return's first shipment, empty when there is none |

### Return lines

| InRetrn field | Omnium source |
| --- | --- |
| `ItemNo` / `ItemVariantNo` | Resolved from the product the same way as on order lines |
| `LineNumber` | Line item id of the return line |
| `ReturnedQuantity` | Return line quantity |
| `ReasonCode` | The `InretrnReturnReason` property on the return, or `Manual` when it is not set |
| `Comment` | The return comment and the return line comment, joined with a pipe character |

A return line whose code does not match any line on the original order is skipped, and an error is added to the order.

* * *

## Returns registered in InRetrn

Returns that customers register in the InRetrn portal are pushed back into Omnium over the public [Returns API](../../Order/Returns/return-api.md):

| Operation | Endpoint | Use case |
| --- | --- | --- |
| **POST** | `/api/returns/{orderId}/Return` | Registers the return, optionally with an exchange order |
| **PATCH** | `/api/returns/{orderId}/{returnId}` | Adjusts return lines, quantities and shipment charges after the parcel has been inspected |
| **POST** | `/api/returns/{orderId}/UpdateStatus` | Moves the return through its statuses, which runs the configured return workflow steps |

These are the standard Returns API endpoints — no InRetrn-specific endpoints are involved. Configure the return statuses and workflow steps that credit the payment, update inventory and notify the customer as described in [Return configuration](../../Order/Returns/return-config.md).

* * *

## Configuration reference

### Product properties

| Property | Type | Description |
| --- | --- | --- |
| `InretrnReturnAllowed` | bool | Sets `ReturnAllowed` on the exported order line |
| `InretrnClaimAllowed` | bool | Sets `ClaimAllowed` on the exported order line |

Setting either property also changes the line's `LineType` to `2`. Use them on products that should not follow the standard return rules, such as fees and gift cards.

### Store and market properties

| Property | Set on | Description |
| --- | --- | --- |
| `InretrnExternalSellerStoreProperty` | Store | Value is sent as `ExternalSellerReference` on the sales order |
| `InretrnExternalSellerProperty` | Market | Value is sent as `ExternalSellerReference` when the order's store has no seller reference |

### Order properties

| Property | Description |
| --- | --- |
| `InretrnModeOfTransportation` | Overrides `ModeOfTransport` on every order line |
| `InretrnOrderPropTransportService` | Overrides `TransportService` on the sales order |

### Return properties

| Property | Description |
| --- | --- |
| `InretrnReturnReason` | Sets `ReasonCode` on every exported return line |

* * *

## External seller reference

`ExternalSellerReference` identifies the selling entity in InRetrn. It is only resolved for orders that have a store:

1.  When the order's store has the property `InretrnExternalSellerStoreProperty`, its value is used.
2.  Otherwise the order's market is checked.

Orders without a store id are exported without a seller reference.

The market fallback currently requires **both** properties on the market: `InretrnExternalSellerStoreProperty` must be present for the fallback to trigger, and the value is read from `InretrnExternalSellerProperty`. Setting the reference on the store avoids this.

* * *

## Country resolution

InRetrn requires a country on the buyer, so the country is resolved to an ISO 3166-1 alpha-2 code from the first of these that yields one:

1.  The country code, then the country name, of the order's addresses — in the same order the buyer address is chosen.
2.  The store's address, then the store's shipping address.
3.  The market's country code.

Two-letter codes, three-letter codes and English country names all resolve. Values that are not countries — region groupings such as `EU` or `Europe` — are left unresolved rather than guessed, and the export then fails on InRetrn's own validation.

The same resolution is applied to the product's country of origin for `ItemCountryOfOrigin`.

* * *

## Errors and troubleshooting

A failed export adds an error to the order, visible on the order in the Omnium GUI. The error is removed on the next successful export of the same kind.

| Error key | Raised by |
| --- | --- |
| `InretrnError` | Order export, and return lines that cannot be matched to the original order |
| `InretrnReturnError` | Return export |

| Symptom | Cause |
| --- | --- |
| The export fails with a connector options error | No connector named or typed `inretrn` resolves for the order's market. Check the market restrictions on the connector |
| `Order was exported less than 10 seconds ago` | Duplicate protection. The order was already sent — no action needed |
| The export fails on a missing order number | Orders are only exported once they have an order number |
| Errors mentioning `ExternalSellerReference` | InRetrn rejected the seller reference. See [External seller reference](InRetrn.md#external-seller-reference) |
| Country rejected by InRetrn | The country could not be resolved to an ISO code. See [Country resolution](InRetrn.md#country-resolution) |
