# Configuration

Source: https://docs.omnium.no/docs/Markets/markets-config

> Explore how to configure and manage markets in Omnium, including setting language, region, currency, tax, and shipment options. This guide helps you understand the key components and considerations for setting up markets for different customer needs and regions.

## Omnium market setup

All orders in Omnium require a market ID. The market contains lots of options, including:

*   Language and localization
*   Region and country
*   Currency
*   Tax configuration
*   Shipments
*   Number options
*   Email settings
*   Available connectors

There are no limitations on the number of markets. Based on the requirements, a market could be set up by country, state, or region, brand, or concept – or a combination of the above.

## Considerations for market setup

### Product languages and currencies

Markets are used to determine the product language and currency for placed orders. As a rule of thumb, every currency and/or product language should have its own market. Stores can be related to multiple markets, so in cases where a single store serves multiple markets (i.e., a web store that sells products in multiple countries with different currencies and/or languages), orders placed for the store in question will get its product language and price currency based on the market the order is placed in.

### B2B vs B2C

Another use case for markets is separation between B2C and B2B. In market settings, it is possible to configure whether prices and orders include or exclude tax. The `MarketType` property can be used to distinguish between B2C and B2B markets.

### Customer communication

Communication with customers is also affected by the market structure. It is possible to design custom email templates for each market to support different languages and brands/concepts. The `WebsiteUrl` and `LogoUrl` properties can be customized per market for branded communications.

* * *

## Market model

### Core properties

| Property | Type | Description |
| --- | --- | --- |
| **MarketId** \* | string | Unique market ID (e.g., "NOR", "SWE", "ENG"). Used as the primary identifier for the market. |
| **MarketName** \* | string | Display name of the market shown in the user interface. |
| IsDefaultMarket | bool | When true, this market is used as the default for new orders when no market is specified. Exactly one market must be marked as default. |
| IsActive | bool | When true, the market is active and available for use. Set to false to temporarily disable a market. |
| MarketType | string | Classification of the market (e.g., "B2C", "B2B"). Used to distinguish between consumer and business markets. |
| MarketGroupId | string | Reference to a market group. Can be used for grouping markets by region, brand, or business unit. Also used as CompanyId in Dynamics 365 integrations. |
| MarketGroupLabel | string | Display label for market groups in the UI. |
| WebsiteUrl | string | Website URL for the market. Used in customer communications such as email templates and order confirmations. |
| LogoUrl | string | URL to the market-specific logo. Used in generated documents such as PDFs, receipts, and invoices. |
| DocumentFooter | string | HTML content for document footers. Displayed at the bottom of generated PDFs, invoices, and receipts. Can include contact information, legal disclaimers, or branding elements. |
| Properties | List<PropertyItem> | Custom key-value properties for extending market configuration with tenant-specific data. |

Exactly one market must have `IsDefaultMarket` set to true. Configuration validation will fail if zero or multiple markets are marked as default.

The logo used in generated documents such as receipt and order confirmation PDFs is resolved in this order: the store's `LogoUrl` if the document is tied to a store, then the market's `LogoUrl`, then the tenant-level `LogoUrl`. A market with no `LogoUrl` set therefore falls back silently to the tenant logo, which is what causes one brand's logo to appear on another brand's documents when several brands share a tenant. To give a market its own branding, set `LogoUrl` on that market.

### Localization properties

| Property | Type | Description |
| --- | --- | --- |
| Language | string | Market language name (e.g., "English", "Norwegian", "German"). Used for display purposes. |
| LanguageCode | string | Two-letter ISO 639-1 language code (e.g., "en", "no", "de"). |
| IsoLanguageCode | string | Full ISO language/region code (e.g., "en-US", "nb-NO", "de-DE"). Used for date/time formatting, number formatting, and currency display. |
| CountryCode | string | Two-letter ISO 3166-1 alpha-2 country code (e.g., "NO", "SE", "GB", "US"). |
| ProductContentLanguage | string | Language code for product content retrieval (e.g., "en", "no", "sv"). Determines which language version of product descriptions, names, and attributes are used for orders in this market. |
| PhoneNumberFormat | string | Regular expression pattern for validating phone numbers in this market. |
| PhoneFormatSettings | [PhoneFormatSettings](markets-config.md#phone-format-settings) | Detailed phone number formatting configuration including country code handling. |

#### Product content language fallback

When retrieving product content, the system follows this fallback order:

1.  Market's `ProductContentLanguage` if set
2.  Default market's `ProductContentLanguage` if available
3.  Tenant's `DefaultProductContentLanguageCode` from product settings
4.  English ("en") if available in tenant product settings
5.  First available language from tenant product settings

### Tax configuration

| Property | Type | Description |
| --- | --- | --- |
| IsTaxExcluded | bool | When true, tax is excluded from order calculations. Order line tax rates are set to 0, and prices use the ex-tax values. Typically used for B2B markets or tax-exempt scenarios. |
| ShowOrderLinesExTax | bool | When true, order line prices are displayed without tax in the UI and API responses. This is a display setting and does not affect calculations. Typically used for US markets where prices are shown excluding tax. |
| DefaultTaxRate | decimal? | Default tax rate percentage for the market (e.g., 25 for 25%). Applied when a product or price does not have a specific tax rate defined. |
| DefaultVatType | decimal? | Default VAT type code for accounting systems (e.g., 3, 52). Used when exporting orders to ERP systems. |

**IsTaxExcluded vs ShowOrderLinesExTax**: These settings serve different purposes. `IsTaxExcluded` affects order calculations by excluding tax entirely. `ShowOrderLinesExTax` only affects how prices are displayed while calculations remain unchanged.

#### Tax calculation behavior

When `IsTaxExcluded` is set to true:

*   Order line tax rate is set to 0
*   `PlacedPrice` uses the ex-tax value (`PlacedPriceExclTax`)
*   No tax calculations are applied to the order
*   Discounts are also adjusted to use ex-tax values

### Payment configuration

| Property | Type | Description |
| --- | --- | --- |
| DefaultPaymentType | string | Default payment type for new carts/orders in this market. Automatically applied when creating a new cart. |

* * *

## Market groups

Market groups allow you to organize multiple markets together for shared configuration and reporting. Groups can represent regions, brands, or business units.

### Market group model

| Property | Type | Description |
| --- | --- | --- |
| **GroupId** \* | string | Unique identifier for the market group. Referenced by `Market.MarketGroupId`. |
| **GroupName** \* | string | Display name for the market group shown in the UI. |
| TemplateSettings | [TemplateSettings](markets-config.md#template-settings) | Template configuration that applies to all markets in this group. |
| EmailClientSettings | [EmailClientSettings](markets-config.md#email-client-settings) | Email configuration that applies to all markets in this group. |
| Markets | List<Market> | Collection of markets belonging to this group (populated at runtime). |

### Sample

```json
{
  "MarketGroups": [
    {
      "GroupId": "nordic",
      "GroupName": "Nordic Region",
      "TemplateSettings": {
        "DefaultEmailTemplate": "nordic-template"
      }
    },
    {
      "GroupId": "central-europe",
      "GroupName": "Central Europe"
    }
  ]
}
```

### Use cases

*   **Regional grouping**: Group markets by geographic region (Nordic, Central Europe, North America)
*   **Brand separation**: Group markets by brand identity for multi-brand retailers
*   **ERP integration**: Use `MarketGroupId` as CompanyId for Dynamics 365 or other ERP systems
*   **Shared templates**: Apply email templates at the group level instead of per-market

* * *

## Return charges

Return charges define the default costs applied when processing returns. These settings can be configured per market and optionally overridden per shipment method.

### Return charges model

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| ReturnCost | decimal | 0 | Default amount to charge the customer for return shipments. Applied when creating a return order. |
| NotPickedUpCost | decimal | 0 | Default amount to charge when a customer does not pick up a shipment or return. |
| ReturnCostDefaultDisabled | bool | false | When true, return cost is NOT automatically applied to returns. Staff must manually enable the charge. When false, return cost is automatically applied. |

### Return cost behavior

The return cost application follows this logic:

1.  Check `Market.ReturnCharges.ReturnCostDefaultDisabled`
2.  If false (enabled by default), the `ReturnCost` amount is automatically added to returns
3.  If true (disabled by default), returns are created without the charge
4.  Individual shipment methods can override this behavior via `ShipmentOption.ReturnCostDefaultEnabled`

Shipment-level settings override market-level settings. If `ShipmentOption.ReturnCostDefaultEnabled` is true for a specific shipping method, return costs will be applied even if the market has `ReturnCostDefaultDisabled` set to true.

### Sample

```json
{
  "ReturnCharges": {
    "ReturnCost": 49.00,
    "NotPickedUpCost": 99.00,
    "ReturnCostDefaultDisabled": false
  }
}
```

* * *

## Number options

Number options configure how sequential identifiers are generated for orders, carts, returns, customers, and other entities. Each market can have its own numbering sequences, or share sequences across markets.

### Number options model

| Property | Type | Description |
| --- | --- | --- |
| **NumberType** \* | string | Type of number to generate. See [supported number types](markets-config.md#supported-number-types) below. |
| **Key** \* | string | Unique key for the counter. Used to track the current sequence value. |
| KeyPostfix | string | Optional postfix appended to the key for additional uniqueness. |
| Prefix | string | String prepended to generated numbers (e.g., "ORD-", "SE-"). |
| Suffix | string | String appended to generated numbers (e.g., "-2024"). |
| StartSequence | long | Starting value for the counter (e.g., 1000, 100000). |
| Service | string | Number generation service to use. See [service types](markets-config.md#number-service-types) below. |
| IsReadOnly | bool | When true, the generated number cannot be edited in the GUI. |
| IsAutoCreateDisabled | bool | When true, the number must be entered manually instead of auto-generated. |
| MarketGroupId | string | Optional reference to a market group for shared sequences across markets. |
| IncrementInterval | int? | Interval between increments. Default is 1. Use higher values to leave gaps for manual entries. |
| ValidationRegex | string | Optional regex pattern for validating manually entered numbers. |
| TranslateKey | string | Translation key for displaying the number type in the UI. |

### Number service types

| Service | Description |
| --- | --- |
| SequentialNumberService | Generates globally sequential numbers across all markets. Ensures unique numbers tenant-wide. |
| SequentialMarketNumberService | Generates sequential numbers per market. Each market maintains its own counter. |
| GuidNumberService | Generates random GUID-based identifiers. Used when sequential numbers are not required. |

### Supported number types

| NumberType | Description |
| --- | --- |
| OrderNumberOptions | Customer order numbers |
| CartNumberOptions | Shopping cart identifiers |
| ReturnNumberOptions | Return order numbers |
| RmaNumberOptions | Return Merchandise Authorization numbers |
| CustomerNumberOptions | Customer identifiers |
| SupplierNumberOptions | Supplier identifiers |
| InvoiceNumberOptions | Invoice numbers |
| SubscriptionNumberOptions | Subscription identifiers |
| ProductNumberOptions | Product/article numbers |
| OrderLineNumberOptions | Individual order line identifiers |

### Resolution order

When determining which number options to use, the system follows this priority:

1.  Market-specific `NumberOptions` for the requested `NumberType`
2.  Tenant `NumberOptions` with matching `MarketGroupId`
3.  Tenant `NumberOptions` without `MarketGroupId`
4.  Tenant `NumberOptions` with matching `NumberType`
5.  Default: `GuidNumberService` (for CustomerNumberOptions and others)

Order types can override this for order numbers by referencing a number option directly by its `Key`. See [order number generation](../Order/order-config.md#order-number-generation).

### Sample

```json
{
  "NumberOptions": [
    {
      "NumberType": "OrderNumberOptions",
      "Key": "order-counter",
      "Prefix": "ORD-",
      "StartSequence": 10000,
      "Service": "SequentialMarketNumberService",
      "IsReadOnly": true
    },
    {
      "NumberType": "ReturnNumberOptions",
      "Key": "return-counter",
      "Prefix": "RET-",
      "StartSequence": 1000,
      "Service": "SequentialNumberService"
    },
    {
      "NumberType": "CustomerNumberOptions",
      "Service": "GuidNumberService"
    }
  ]
}
```

This configuration produces:

*   Order numbers: ORD-10000, ORD-10001, ORD-10002 (per market)
*   Return numbers: RET-1000, RET-1001, RET-1002 (global)
*   Customer IDs: Random GUIDs

* * *

## Shipment options

Shipment options define the available shipping methods for a market, including provider configuration, pricing, and delivery settings.

### Core shipment properties

| Property | Type | Description |
| --- | --- | --- |
| **ShippingMethodId** \* | string | Unique identifier for the shipping method. |
| **ShippingMethodName** \* | string | Technical name used to identify the product with the shipping provider. |
| Label | string | User-friendly display name shown in the UI and to customers. |
| Description | string | Detailed description of the shipping method. |
| ShipmentDeliveryType | string | Delivery type: "Delivery" for home delivery, "PickUp" for pickup points or in-store. |
| IsDefaultShipment | bool | When true, this is the fallback shipping method if no other options match. |
| DeliveryTime | string | Expected delivery time displayed to customers (e.g., "2-4 business days"). |
| LogoUrl | string | URL to the shipping provider's logo for display in the UI. |
| CountryCode | string | Two-letter country code this shipping method is valid for. |

### Provider configuration

| Property | Type | Description |
| --- | --- | --- |
| ShippingGateway | string | Shipping provider gateway. Options: "Bring", "PostNordV2", "Consignor", "Unifaun", "Logistra", "Gls", "Porterbuddy", "Ingrid", "Empty". |
| ShipmentProduct | string | Product code to book with the provider (e.g., "PICKUP\_PARCEL", "SERVICEPAKKE"). |
| ShipmentProductName | string | Product name for providers that require it (e.g., Logistra). |
| ProviderServices | string | Provider-specific service codes. Used for additional services like signature, insurance, etc. |
| ShipmentReturnProduct | string | Product code for return labels. Leave empty if returns use the same product. |
| ShippingCompany | string | Override shipping company name if the pickup provider differs from the main provider. |

### Pricing configuration

| Property | Type | Description |
| --- | --- | --- |
| ShippingSubTotal | decimal | Shipping cost including tax (displayed to customer). |
| ShippingSubTotalExclTax | decimal | Shipping cost excluding tax. |
| TaxRate | decimal | Tax rate for shipping. If not specified, uses the market's `DefaultTaxRate`. |
| DiscountedPrice | decimal | Discounted shipping price including tax. |
| DiscountedPriceExclTax | decimal | Discounted shipping price excluding tax. |
| DiscountLabel | string | Label describing the discount (e.g., "Free shipping on orders over $50"). |
| ShippingProfitPercent | decimal? | Profit margin percentage on shipping. |
| GetPriceFromProvider | bool | When true, fetch real-time shipping prices from the provider API instead of using fixed prices. |
| AddTaxOnProviderPrice | bool | When true, add tax to prices received from the provider. |
| AdditionalCustomerPricePercentage | decimal | Surcharge percentage added to shipping costs. |
| ReturnCostDefaultEnabled | bool | When true, return costs are applied by default for this shipping method, overriding market settings. |

### Service point configuration

| Property | Type | Description |
| --- | --- | --- |
| GetServicePoints | bool | When true, search for available pickup points/service points from the provider. |
| ServicePointRequired | bool | When true, customers must select a pickup/service point. |
| ServicePointProvider | string | Alternate provider for service point lookup if different from the shipping gateway. |
| PickUpPoints | List<PickUpPoint> | Pre-configured list of pickup points (alternative to dynamic lookup). |

### Visibility and behavior

| Property | Type | Description |
| --- | --- | --- |
| HideInOms | bool | When true, this shipping method is not visible in the Omnium backoffice UI. |
| HideFromApi | bool | When true, this shipping method is not exposed in public API responses. |
| VueTemplate | string | UI template for the checkout: "Standard", "PickUp point", "PickUp in store". |
| ProviderNotification | bool | When true, the shipping provider sends SMS/email notifications to customers. |
| ValidOnMarkets | List<string> | List of market IDs where this shipment option is valid. Empty means all markets. |
| IncludeGoodsDescription | bool | When true, include product descriptions on shipping labels. |

### Default package dimensions

| Property | Type | Description |
| --- | --- | --- |
| DefaultPackage.WeightInKg | double | Default package weight in kilograms. |
| DefaultPackage.DefaultDimensions.LengthInCm | int | Default package length in centimeters. |
| DefaultPackage.DefaultDimensions.WidthInCm | int | Default package width in centimeters. |
| DefaultPackage.DefaultDimensions.HeightInCm | int | Default package height in centimeters. |
| DefaultPackage.GoodsDescription | string | Default goods description for customs/shipping. |

### Sample

```json
{
  "ShipmentOptions": [
    {
      "ShippingMethodId": "bring-servicepakke",
      "ShippingMethodName": "SERVICEPAKKE",
      "Label": "Pickup at Post Office",
      "Description": "Delivered to your nearest post office within 2-4 days",
      "ShipmentDeliveryType": "PickUp",
      "ShippingGateway": "Bring",
      "ShipmentProduct": "SERVICEPAKKE",
      "ShippingSubTotal": 79.00,
      "ShippingSubTotalExclTax": 63.20,
      "TaxRate": 25,
      "GetServicePoints": true,
      "ServicePointRequired": true,
      "DeliveryTime": "2-4 business days",
      "IsDefaultShipment": false,
      "HideInOms": false,
      "HideFromApi": false,
      "DefaultPackage": {
        "WeightInKg": 1.0,
        "DefaultDimensions": {
          "LengthInCm": 30,
          "WidthInCm": 20,
          "HeightInCm": 15
        }
      }
    },
    {
      "ShippingMethodId": "home-delivery",
      "ShippingMethodName": "HOME_DELIVERY",
      "Label": "Home Delivery",
      "Description": "Delivered to your doorstep",
      "ShipmentDeliveryType": "Delivery",
      "ShippingGateway": "Bring",
      "ShipmentProduct": "PA_DANSEN",
      "ShippingSubTotal": 149.00,
      "TaxRate": 25,
      "DeliveryTime": "1-3 business days",
      "IsDefaultShipment": true,
      "ProviderNotification": true
    }
  ]
}
```

* * *

## Email client settings

Email client settings configure how emails are sent for a market, including SMTP settings, sender addresses, and template references.

### Email client settings model

| Property | Type | Description |
| --- | --- | --- |
| Type | string | Email provider type (e.g., "SMTP", "SendGrid"). |
| Host | string | Email server hostname or URL. |
| Port | int | Email server port number (e.g., 587 for TLS, 465 for SSL). |
| UserName | string | Authentication username for the email server. |
| Password | string | Authentication password for the email server. |
| KeyName | string | API key name for email services like SendGrid. |
| StandardEmailAddress | string | Default sender email address (e.g., "[orders@company.com](mailto:orders@company.com)"). |
| InBoundEmailAddress | string | Email address for receiving inbound emails/replies. |
| InBoundEmailFromName | string | Display name for inbound email communications. |
| EmailTemplateContainer | string | Azure blob storage container name for email templates. |
| EmailTemplateContentFile | string | File path/name for email template content. |
| IsProductIdDisplayedInsteadOfSku | bool? | When true, display product ID instead of SKU in order confirmation emails. |
| LanguageCode | string | Language code for email content. Controls the language of standard text elements like "Please reply above this line". |

### Sample

```json
{
  "EmailClientSettings": {
    "Type": "SendGrid",
    "KeyName": "sendgrid-api-key",
    "StandardEmailAddress": "orders@mystore.com",
    "InBoundEmailAddress": "support@mystore.com",
    "InBoundEmailFromName": "My Store Support",
    "LanguageCode": "en"
  }
}
```

* * *

## Template settings

Template settings configure which email and document templates are used for various entities like orders, carts, and projects.

### Template settings model

| Property | Type | Description |
| --- | --- | --- |
| DefaultEmailTemplate | string | Reference to the default email template. |
| CustomerNoteTemplate | string | Template for customer notes and messages. |
| InvoiceTemplate | string | Template file for the PDF of invoices, credit notes and receipts. Empty means the standard layout. See [Invoice template](markets-config.md#invoice-template). |
| CartTemplates | List<TemplateReferenceSettings> | Available templates for shopping carts. |
| OrderTemplates | List<TemplateReferenceSettings> | Available templates for orders. |
| PurchaseOrderTemplates | List<TemplateReferenceSettings> | Available templates for purchase orders. |
| ProjectTemplates | List<TemplateReferenceSettings> | Available templates for projects. |
| ProductTemplates | List<TemplateReferenceSettings> | Available templates for products. |
| ProjectTemplateReferences | ProjectTemplateReferences | Specific template references for project comments. |

### Template reference settings

| Property | Type | Description |
| --- | --- | --- |
| TemplateReference | string | Identifier/reference for the template. |
| DisplayName | string | User-friendly name shown in the UI. |
| TranslateKey | string | Translation key for localization. |

### Project template references

| Property | Type | Description |
| --- | --- | --- |
| CustomerCommentTemplate | string | Template for customer-facing comments on projects. |
| PartnerCommentTemplate | string | Template for partner/supplier comments on projects. |
| InternalCommentTemplate | string | Template for internal staff comments on projects. |

### Sample

```json
{
  "TemplateSettings": {
    "DefaultEmailTemplate": "standard-order-confirmation",
    "OrderTemplates": [
      {
        "TemplateReference": "standard-order",
        "DisplayName": "Standard Order",
        "TranslateKey": "Template_StandardOrder"
      },
      {
        "TemplateReference": "gift-order",
        "DisplayName": "Gift Order",
        "TranslateKey": "Template_GiftOrder"
      }
    ],
    "ProjectTemplateReferences": {
      "CustomerCommentTemplate": "customer-project-comment",
      "InternalCommentTemplate": "internal-project-comment"
    }
  }
}
```

### Invoice template

`InvoiceTemplate` replaces the standard PDF layout of invoices, credit notes and receipts. It is optional: when no template is set, the PDF uses the standard layout. Set it in the notification template settings, on the tab for a market, a market group or the default for all markets.

#### Which template a document uses

Omnium uses the first template that is set, in this order:

1.  `InvoiceTemplate` on the document's market.
2.  `InvoiceTemplate` on the market group that the market belongs to (`MarketGroupId`).
3.  `InvoiceTemplate` in the default template settings for all markets.
4.  The standard layout.

A document with no market starts at step 3. The same template is used everywhere an invoice PDF is made: the order's Invoices tab, `GET api/Invoices/GetAsPdf/{id}`, the invoice notification, the **Receipts** attachment on order notifications and the **Credit notes** attachment on return notifications.

When the chosen file is missing, is not a `.json` file or has no `html` content, Omnium uses the standard layout and logs a warning that names the file and the document. A broken template never stops a PDF or an email.

#### The template file

The template is a `.json` file in the tenant's template container, made in the same email designer as the order templates. Omnium uses its `html` content.

Start from the starter invoice template rather than an empty design. It has the standard layout, every placeholder and the styles the generated parts need. Its styles apply only inside its `omnium-invoice` wrapper, so they do not change the designer's own layout. Find it in the demo content of the template file manager, copy it and change it. If your environment does not have it in the demo content yet, contact Omnium.

Omnium fills the template with the same values as the standard layout, so invoices, credit notes and receipts print the same data and only the layout changes. Margins, paper format and custom fonts come from the tenant's PDF settings.

The template must:

*   Hold `{ORDERLINES}` inside a `<table>` with a matching header row. The placeholder becomes table rows. On a receipt each row has an extra VAT rate cell, and `{TAX_RATE_HEADER_HTML}` adds the matching heading.
*   Define the CSS classes `rightUpperInfo`, `floatRight` and `taxSummary`, which the generated parts use.

A placeholder that the template leaves out is not printed. Text that the template adds is printed as written, in every language.

#### Placeholders

| Group | Placeholders |
| --- | --- |
| Document | `{COPY_OF_INVOICE}` (the title: invoice, copy of invoice, credit note or receipt), `{INVOICE_NUMBER}`, `{INVOICE_DATE}`, `{ORDER_NUMBER}`, `{ORDER_DATE}`, `{COMPLETED_DATE_HTML}`, `{IMG_SRC}` (the logo URL), `{COMPANY_NAME}` (the tenant ID, not a legal company name) |
| Seller, stored on a receipt when it is issued | `{STORE_NAME}`, `{FROM_ADDRESSLINE}`, `{FROM_POSTALCODE}`, `{FROM_CITY}`, `{INVOICE_FOOTER}` |
| Store, read when the PDF is made | `{STORE_ADDRESS}`, `{STORE_ZIP}`, `{STORE_CITY}`, `{STORE_PHONENUMBER}`, `{STORE_EMAIL}`, `{STORE_WEBADDRESS}`, `{ORGANIZATION_NUMBER}`, `{MVA_REGNR}` |
| Customer and delivery | `{CUSTOMER_NUMBER}`, `{CUSTOMER_NAME}`, `{CUSTOMER_ADDRESSLINE}`, `{CUSTOMER_POSTALCODE}`, `{CUSTOMER_CITY}`, `{CUSTOMER_ORGANIZATION_NUMBER_HTML}`, `{DELIVERY_ADDRESSLINE}`, `{DELIVERY_POSTALCODE}`, `{DELIVERY_CITY}` |
| Lines and totals | `{ORDERLINES}`, `{ORDERLINES_SUM}`, `{SHIPMENT_COST}`, `{TAX_BASE}`, `{TAX}`, `{ORDER_TOTAL}` |
| Parts that depend on the document type | `{PAYMENT_TERMS_HTML}` (due date, KID and bank account on an invoice; the paid line on a receipt), `{RECEIPT_DETAILS_HTML}`, `{PAYMENTS_HTML}`, `{TAX_RATE_HEADER_HTML}`, `{TAX_SUMMARY_HTML}`, `{CREDITED_DOCUMENTS_HTML}` |
| Labels in the market's language | `{INVOICE_NUMBER_LABEL}`, `{INVOICE_DATE_LABEL}`, `{ORDER_NUMBER_LABEL}`, `{ORDER_DATE_LABEL}`, `{FROM_LABEL}`, `{CUSTOMER_LABEL}`, `{DELIVERY_ADDRESS}`, `{ORDER_DETAILS}`, `{SKU}`, `{PRODUCT_NAME}`, `{UNIT_PRICE}`, `{DISCOUNT}`, `{QUANTITY}`, `{UNIT}`, `{TOTAL_AMOUNT}`, `{SUBTOTAL_LABEL}`, `{TAX_TOTAL_LABEL}`, `{SHIPMENT_COST_LABEL}`, `{TOTAL_LABEL}` |

On an invoice, the receipt parts print nothing. On a receipt, the payment terms become the paid line, and the payments and the VAT summary per rate appear.

#### Things to know

*   An invoice or a receipt is an accounting document. Keep the content the law requires: the number, the date, the seller with organization number and VAT registration, the lines, the VAT per rate and the totals. The starter template has all of it. Omnium does not check a custom template.
*   Put the legal seller details of a receipt in the stored seller placeholders and in the document footer, `{INVOICE_FOOTER}`. The store placeholders show the store as it is when the PDF is made, so they can differ from the store as it was when the receipt was issued.
*   A document is always rendered with the template that applies at that moment. A new template therefore also changes how documents issued earlier look when you download them again. The numbers, lines and payments on a receipt and its stored seller placeholders stay the same. The logo and the store placeholders show the current values.
*   The designer is made for email. A long list of lines breaks across pages where the browser decides, and no header repeats on each page.
*   Change the file through Omnium. A file changed directly in blob storage can stay cached for up to 24 hours.

```json
{
  "TemplateSettings": {
    "InvoiceTemplate": "faktura-nor.json"
  }
}
```

* * *

## Phone format settings

Phone format settings control how phone numbers are validated and formatted for a market.

### Phone format settings model

| Property | Type | Description |
| --- | --- | --- |
| RequireCountryCode | bool? | When true, phone numbers must include a country code. |
| RemoveCountryCode | bool? | When true, remove the country code from stored phone numbers. |
| UsePlusInCountryCode | bool? | When true, format country code with + prefix (e.g., +47). |
| UseZeroZeroInCountryCode | bool? | When true, format country code with 00 prefix (e.g., 0047). |
| DefaultCountryCode | string | Default country code to apply (e.g., "47" for Norway, "46" for Sweden). |
| ExpectedPhoneNumberFormats | List<PhoneFormat> | List of allowed phone number formats by country. |

### Phone format

| Property | Type | Description |
| --- | --- | --- |
| CountryCode | string | Country code (e.g., "47", "46"). |
| MinExpectedNumberLength | int? | Minimum number of digits excluding country code. |
| MaxExpectedNumberLength | int? | Maximum number of digits excluding country code. |

### Sample

```json
{
  "PhoneFormatSettings": {
    "RequireCountryCode": true,
    "UsePlusInCountryCode": true,
    "DefaultCountryCode": "47",
    "ExpectedPhoneNumberFormats": [
      {
        "CountryCode": "47",
        "MinExpectedNumberLength": 8,
        "MaxExpectedNumberLength": 8
      },
      {
        "CountryCode": "46",
        "MinExpectedNumberLength": 9,
        "MaxExpectedNumberLength": 10
      }
    ]
  }
}
```

* * *

## Connectors

Markets can have market-specific connector configurations for integrating with external systems. Connectors can be restricted to specific markets or market groups.

For full connector configuration details, see the [Integrations documentation](../Integrations.md).

### Market restriction properties

| Property | Type | Description |
| --- | --- | --- |
| EnabledForMarkets | List<string> | Markets where the connector is available. Empty/null means all markets. |
| DisabledForMarkets | List<string> | Markets where the connector is explicitly disabled. Overrides EnabledForMarkets. |
| EnabledForMarketGroups | List<string> | Market groups where the connector is available. |
| DisabledForMarketGroups | List<string> | Market groups where the connector is disabled. |

* * *

## Complete market configuration example

```json
{
  "Markets": [
    {
      "MarketId": "NOR",
      "MarketName": "Norway",
      "IsDefaultMarket": true,
      "IsActive": true,
      "MarketType": "B2C",
      "MarketGroupId": "nordic",

      "Language": "Norwegian",
      "LanguageCode": "no",
      "IsoLanguageCode": "nb-NO",
      "CountryCode": "NO",
      "Currency": "NOK",
      "ProductContentLanguage": "no",

      "IsTaxExcluded": false,
      "ShowOrderLinesExTax": false,
      "DefaultTaxRate": 25,
      "DefaultVatType": 3,
      "DefaultPaymentType": "Card",

      "WebsiteUrl": "https://www.mystore.no",
      "LogoUrl": "https://cdn.mystore.com/logos/norway.png",
      "DocumentFooter": "<p>My Store AS | Org.nr: 123456789 | support@mystore.no</p>",

      "ReturnCharges": {
        "ReturnCost": 49.00,
        "NotPickedUpCost": 99.00,
        "ReturnCostDefaultDisabled": false
      },

      "NumberOptions": [
        {
          "NumberType": "OrderNumberOptions",
          "Key": "nor-orders",
          "Prefix": "NO-",
          "StartSequence": 10000,
          "Service": "SequentialMarketNumberService"
        }
      ],

      "ShipmentOptions": [
        {
          "ShippingMethodId": "bring-servicepakke",
          "ShippingMethodName": "SERVICEPAKKE",
          "Label": "Hent i Posten",
          "ShipmentDeliveryType": "PickUp",
          "ShippingGateway": "Bring",
          "ShipmentProduct": "SERVICEPAKKE",
          "ShippingSubTotal": 79.00,
          "TaxRate": 25,
          "GetServicePoints": true,
          "IsDefaultShipment": true
        }
      ],

      "EmailClientSettings": {
        "StandardEmailAddress": "ordre@mystore.no",
        "LanguageCode": "no"
      },

      "PhoneFormatSettings": {
        "RequireCountryCode": true,
        "UsePlusInCountryCode": true,
        "DefaultCountryCode": "47",
        "ExpectedPhoneNumberFormats": [
          {
            "CountryCode": "47",
            "MinExpectedNumberLength": 8,
            "MaxExpectedNumberLength": 8
          }
        ]
      }
    },
    {
      "MarketId": "SWE",
      "MarketName": "Sweden",
      "IsDefaultMarket": false,
      "IsActive": true,
      "MarketType": "B2C",
      "MarketGroupId": "nordic",

      "Language": "Swedish",
      "LanguageCode": "sv",
      "IsoLanguageCode": "sv-SE",
      "CountryCode": "SE",
      "Currency": "SEK",
      "ProductContentLanguage": "sv",

      "IsTaxExcluded": false,
      "DefaultTaxRate": 25,

      "WebsiteUrl": "https://www.mystore.se",

      "ReturnCharges": {
        "ReturnCost": 49.00,
        "ReturnCostDefaultDisabled": false
      },

      "NumberOptions": [
        {
          "NumberType": "OrderNumberOptions",
          "Key": "swe-orders",
          "Prefix": "SE-",
          "StartSequence": 10000,
          "Service": "SequentialMarketNumberService"
        }
      ]
    },
    {
      "MarketId": "B2B-NOR",
      "MarketName": "Norway B2B",
      "IsDefaultMarket": false,
      "IsActive": true,
      "MarketType": "B2B",

      "Language": "Norwegian",
      "LanguageCode": "no",
      "IsoLanguageCode": "nb-NO",
      "CountryCode": "NO",
      "Currency": "NOK",

      "IsTaxExcluded": true,
      "ShowOrderLinesExTax": true,
      "DefaultTaxRate": 25
    }
  ],

  "MarketGroups": [
    {
      "GroupId": "nordic",
      "GroupName": "Nordic Region"
    }
  ]
}
```
