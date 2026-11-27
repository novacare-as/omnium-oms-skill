# Markets

Source: https://docs.omnium.no/docs/Markets

> Markets define regional context in Omnium — language, currency, tax, shipping, and more.

## What Is a Market?

Markets are a core concept in Omnium. Almost everything in the system—orders, prices, products, customers can be associated with a market. Markets are used for access control and to control availability og various functionality in Omnium, and provides contextual environment that determines:

*   Language
*   Region
*   Currency
*   Tax configuration
*   Shipment options
*   Available connectors
*   Payment settings
*   Email templates
*   Number formatting
*   Return charge policies

An instructive example:

> When an order is placed, the **market** determines the currency used, whether prices include tax, the available shipping options, and which language and templates are used for communication (e.g., confirmation emails).

* * *

## In this section

*   [Configuration](Markets/markets-config.md) — Set up language, region, currency, tax, shipment options, and more per market

* * *

## Access Control

Access to most documents in Omnium is governed by **Market ID(s)**.

Entities like orders, carts, and products are tagged with a `marketId` or `marketIds`. A user with access only to Market `US` cannot access data associated with Market `UK`.

### Feature Availability

Omnium supports market-specific feature toggles:

*   `EnabledForMarkets`
*   `DisabledForMarkets`

These properties are used in settings like payments, connectors, and workflows to control availability based on the market context.

* * *

## Setup Considerations

There are no limitations on the number of markets in Omnium.

Markets are usually configured based on:

*   Country, region, or state
*   Brand or concept
*   B2B vs. B2C use cases

### Product Language and Currency

Markets determine the product language and currency for placed orders.

*   Each **currency** and/or **product language** should have its own market (although multiple markets can share the same currency or product language).
*   Stores can be related to multiple markets. For example, if a web store serves multiple markets with different currencies or languages, the market determines the product language and price currency for the placed order.

### B2B vs. B2C

Markets help tailor experiences for B2B or B2C segments:

*   Control whether prices and orders include or exclude tax.
*   Adjust payment types, workflows, and communication accordingly.

### Customer Communication

Market definitions also influence how you communicate with customers:

*   Customize **email templates** and **languages** by market.
*   Support different brands or concepts with separate market-specific configurations.

* * *

## Market Model

| Property | Type | Description |
| --- | --- | --- |
| `MarketId` | `string` | Unique ID (e.g., ENG, NOR, SWE) |
| `MarketName` | `string` | Display name for the market |
| `IsDefaultMarket` | `bool` | Indicates if this is the default market for new orders |
| `IsActive` | `bool` | Whether the market is active |
| `IsTaxExcluded` | `bool` | Indicates if prices are shown excluding tax |
| `Language` | `string` | Market language name (e.g., English, German) |
| `LanguageCode` | `string` | ISO 639-1 code (e.g., `en`, `no`) |
| `IsoLanguageCode` | `string` | Full locale code (e.g., `en-US`, `nb-NO`) |
| `CountryCode` | `string` | Country code (e.g., `US`, `NO`) |
| `Currency` | `string` | Currency used in this market (e.g., USD, EUR, NOK) |
| `ProductContentLanguage` | `string` | Language used for product content |
| `ShipmentOptions` | `List<ShipmentOption>` | Available shipment methods |
| `NumberOptions` | `List<NumberOptions>` | Formatting preferences for numbers |
| `EmailClientSettings` | `EmailClientSettings` | Email configuration per market |
| `Connectors` | `List<ConnectorOptions>` | Integrations specific to the market |
| `ReturnCharges` | `ReturnCharges` | Return-related fees |
| `MarketGroupId` | `string` | Used for grouping (e.g., D365 Company ID) |
| `MarketGroupLabel` | `string` | Label used in the UI to identify grouped markets |
| `MarketType` | `string` | Indicates type: B2B or B2C |
| `DefaultTaxRate` | `decimal?` | Default tax rate if not overridden |
| `DefaultVatType` | `decimal?` | Default VAT code (e.g., accounting codes like 3, 52) |
| `DefaultPaymentType` | `string` | Payment type preselected for new carts |
| `Properties` | `List<PropertyItem>` | Custom properties for extensibility |

* * *

## Return Charges Model

| Property | Type | Description |
| --- | --- | --- |
| `ReturnCost` | `decimal` | Fee charged to the customer for returns |
| `NotPickedUpCost` | `decimal` | Fee for unclaimed shipments |
