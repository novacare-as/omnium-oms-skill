# Shipment

Source: https://docs.omnium.no/docs/plugins/Shipments

> Learn all you need to know about configuring shipment providers in Omnium.

Omnium allows integration with multiple shipping providers, each configured with specific settings and shipment options.

## Supported shipping providers

| Provider | Gateway Key | Documentation |
| --- | --- | --- |
| [Ingrid](Shipments/ingrid-plugin.md) | `Ingrid` | Checkout widget and booking |
| [PostNord](Shipments/postnord.md) | `PostNordV2` / `Postnord` | EDI-based booking (V2 recommended) |
| [Bring](Shipments/bring.md) | `Bring` | Nordic parcel services |
| [nShift Delivery](Shipments/nshiftDelivery.md) | `Unifaun` | Formerly Unifaun - delivery checkout |
| [nShift Ship](Shipments/nshiftShip.md) | `Consignor` | Formerly Consignor - shipment booking |
| [Logistra](Shipments/logistra.md) | `Logistra` | Cargonizer integration |
| [GLS](Shipments/gls.md) | `Gls` | Parcel services (Denmark focused) |
| [Porterbuddy](Shipments/porterbuddy.md) | `Porterbuddy` | Same-day delivery |

## Shipping Providers

Each shipping provider (e.g., Bring, PostNord, GLS, Consignor, Logistra) requires a set of configurations to enable shipment booking and tracking.

### Shipping Provider Settings Model

| Property | Type | Description |
| --- | --- | --- |
| **Name** | string | Name of the shipping provider. |
| **DisplayName** | string | User-friendly name displayed in Omnium. |
| **ShippingGateway** | string | Shipping gateway (e.g., Bring, Consignor, PostNord). |
| **MerchantId** | string | ID for authentication (if required by the provider). |
| **MerchantSecret** | string | Password for authentication (if required by the provider). |
| **ApiToken** | string | API token for authentication (if required by the provider). |
| **CustomerNumber** | string | Customer number required by some providers for shipment booking. |
| **CustomerReturnNumber** | string | Customer number for return booking requests (if applicable). |
| **CustomerName** | string | Account owner name. |
| **CustomerEmail** | string | Account owner email address. |
| **BaseUrl** | string | Provider API URL (test or production). |
| **TrackingUrl** | string | URL for tracking shipments. |
| **LogoUrl** | string | URL to the provider's logo. |
| **VueTemplate** | string | Internal Omnium template. |
| **DisplayInOms** | bool | Determines if the provider is visible in the Omnium interface. |
| **IsTest** | bool | Indicates if the provider is in test mode (used by Bring and PostNord). |
| **BookTransfer** | bool | Used by Logistra for transfer booking. |
| **ProviderSendReturnLabelOnEmail** | bool | Used by Logistra to send return labels via email instead of printing. |
| **ValidOnMarkets** | List | Specifies the markets where this provider is valid. |

### Example Configurations

#### Logistra Shipping Provider

```json
{
    "Name": "Logistra",
    "DisplayName": "Logistra",
    "ShippingGateway": "Logistra",
    "MerchantId": "xxxx",
    "MerchantSecret": "xxxxxxx",
    "BaseUrl": "http://cargonizer.no",
    "BookTransfer": true
}
```

#### Bring Shipping Provider

```json
{
    "Name": "Bring",
    "DisplayName": "Bring",
    "ShippingGateway": "Bring",
    "MerchantId": "Merchant Id",
    "ApiToken": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
    "CustomerNumber": "PARCELS_SWEDEN-xxxxx",
    "BaseUrl": "https://api.bring.com/",
    "IsTest": false
}
```

#### PostNord Shipping Provider

```json
{
    "Name": "Postnord",
    "DisplayName": "Postnord",
    "ShippingGateway": "Postnord",
    "MerchantId": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    "ApiToken": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
    "BaseUrl": "https://api2.postnord.com/"
}
```

## Shipment Options

Each shipment option represents a specific shipping service provided by the carrier (e.g., home delivery, pickup point).

### Shipment Option Model

| Property | Type | Description |
| --- | --- | --- |
| **ShippingMethodName** | string | Unique name identifying the shipping product, matching the e-commerce platform. |
| **ShippingMethodId** | string | Unique ID for this option (if necessary). |
| **ShippingGateway** | string | Provider gateway (e.g., Bring, PostNord). |
| **ShippingPriceGateway** | string | If prices should be calculated by the provider but booking should not be done, set this. |
| **CountryCode** | string | Two-letter country code used by providers for pickup point retrieval. |
| **ShipmentProduct** | string | Provider’s shipment product code (e.g., "PICKUP\_PARCEL", "mypack"). |
| **ShipmentProductName** | string | Optional name for the shipment product. |
| **ProviderNotification** | bool | Whether the provider sends notifications (SMS/email). |
| **ShipmentReturnProduct** | string | Return shipment product code (if applicable). |
| **ShippingSubTotal** | decimal | Default shipping cost, if applicable. |
| **GetPriceFromProvider** | bool | If the provider should calculate shipping prices based on the order details. |
| **AddTaxOnProviderPrice** | bool | Whether tax should be added to the provider's shipping cost. |
| **AdditionalCustomerPricePercentage** | decimal | Extra surcharge percentage on provider cost. |
| **DiscountedPrice** | decimal | Discounted price for the shipment option. |
| **DiscountLabel** | string | Label for discount display. |
| **DeliveryTime** | string | Estimated delivery time. |
| **LogoUrl** | string | Provider logo URL. |
| **VueTemplate** | string | Internal Omnium template. |
| **DefaultPackage** | object | Default package dimensions for the provider. |
| **NumberOfCollisMandatory** | bool | Whether specifying the number of packages is required. |
| **ShipmentDeliveryType** | string | "Delivery" (to customer) or "PickUp" (customer collects the package). |
| **TranslateKey** | string | Internal identifier for the shipment type. |
| **Label** | string | User-friendly name for the shipment option. |
| **Description** | string | Description of the shipment option. |
| **IsDefaultShipment** | bool | Marks this as the default shipping method. |
| **ConsigneeType** | string | "CONSUMER" or "BUSINESS" (as required by providers). |
| **ConsignorType** | string | "CONSUMER" or "BUSINESS" (as required by providers). |
| **DefaultWarehouseCode** | string | Default warehouse for shipments (if applicable). |

## NVIT (Norwegian Goods in Transit)

NVIT ("Norske varer i transitt") is a Norwegian customs requirement, effective April 1, 2026, for domestic Norwegian shipments that transit through Sweden or Finland on their way to the recipient. Affected shipments must carry a customs declaration of the goods, even though both sender and recipient are in Norway.

### When NVIT data is built

Omnium builds an NVIT declaration for a shipment when both the sender's and the recipient's country are `NO`. The actual transit route is decided by the carrier and isn't known when the shipment is booked, so this applies to every eligible domestic shipment — a shipping provider that doesn't support NVIT simply ignores the data.

The order lines on the shipment are grouped by customs code (HS number). Each group becomes one customs goods line, and the package weight is split across the groups by their share of the total quantity. Net weight normally comes from the shipment packages the same way, but when the packages don't carry a net weight, it's instead computed by summing each order line's own weight — see [Enrichment](Shipments.md#enrichment) below.

If any order line on the shipment is missing a customs code, no NVIT data is sent for that shipment at all. A partial declaration would understate the total declared weight, which is worse than sending no declaration.

### Order line and package fields

| Field | Level | Description |
| --- | --- | --- |
| `customsCode` | Order line | HS customs number, 6-10 digits (formatting such as dots is stripped). Required on every order line in the shipment for NVIT data to be built. |
| `countryOfOrigin` | Order line | ISO 3166-1 alpha-2 country of origin. Optional — only included when it's the same across all lines sharing a customs code. |
| `weight` | Order line | Weight of a single unit, in kg. Optional — only used as a net weight fallback when the shipment packages don't have one, and only when every line sharing a customs code has a value. |
| `weightInKg` | Shipment package | Gross package weight in kg. Used as the basis for the declared goods weight. |
| `netWeightInKg` | Shipment package | Net weight of the goods in the package in kg, excluding packaging. Optional — only included when every package on the shipment has a net weight set. When it isn't, net weight falls back to order line `weight` instead. |

### Enrichment

| Field | Source |
| --- | --- |
| `customsCode` | Enriched automatically from the product (variant first, falling back to the product level) by the [Enrich Order from Products](../Order/workflow-steps/enrichment/enrich-order-from-products.md) step. Only overwritten when the product has a value set. |
| `countryOfOrigin` | Enriched automatically from the product the same way as `customsCode`. |
| `weight` | Enriched automatically from the product the same way as `customsCode` — but only when the order line doesn't already have a weight. Unlike `customsCode`/`countryOfOrigin`, an explicitly set value is never overwritten by enrichment. |
| `weightInKg` | Enriched automatically from product colli weight when the [Create Shipment Packages Based on Product Colli](../Order/workflow-steps/shipments/create-shipment-packages-based-on-product-colli.md) step is used. Otherwise it must be set through the API or GUI. |
| `netWeightInKg` | The package field itself is never enriched automatically — it must be set through the API or GUI. NVIT doesn't depend on that, though: when it's missing, the declared net weight is still populated automatically instead, by summing order line `weight` across the lines sharing a customs code (only when every line in that group has one). |

### Provider support

Please tell if you need support for NVIT for a provider that don't have it yet.

| Provider | NVIT support |
| --- | --- |
| [Logistra](Shipments/logistra.md) | Yes |
| [Bring](Shipments/bring.md) | No |
| [nShift Ship (Consignor)](Shipments/nshiftShip.md) | Yes |
| [PostNord](Shipments/postnord.md) | No |
| [Ingrid](Shipments/ingrid-plugin.md) | No |
| [nShift Delivery](Shipments/nshiftDelivery.md) | No |
| [GLS](Shipments/gls.md) | No |
| [Porterbuddy](Shipments/porterbuddy.md) | No |
