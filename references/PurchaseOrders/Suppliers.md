# Suppliers

Source: https://docs.omnium.no/docs/PurchaseOrders/Suppliers

> Learn about suppliers in Omnium — how they relate to purchase orders, products, lead times, and inventory replenishment.

## What Is a Supplier?

A **Supplier** in Omnium represents a company or entity that provides goods to your business. Suppliers are a central part of the procurement workflow and connect directly to [purchase orders](purchase-order-api.md) and [products](../Product.md).

Every purchase order in Omnium references a supplier, and products can be linked to one or more suppliers. This relationship enables Omnium to track where goods come from, manage lead times, and generate replenishment suggestions.

> A supplier can be an external vendor, a wholesaler, or even an internal store that fulfills stock transfers between locations.

* * *

## Suppliers and Purchase Orders

When a purchase order is created, it is linked to a supplier via `SupplierId`. The supplier's name, email, and phone number are stored directly on the purchase order for quick reference.

For **internal transfers** between your own warehouses or stores, the supplier can reference an Omnium store using the `OmniumStoreId` field. This makes it possible to use the purchase order workflow for internal stock movements, where one of your own stores acts as the supplier. The `SupplierWarehouseCode` on the purchase order identifies the source warehouse for the transfer.

* * *

## Suppliers and Products

Products can be associated with suppliers in two ways:

### Primary Supplier

Each product has a `SupplierId` and `SupplierName` field that identifies the product's main supplier.

### Additional Suppliers

A product can also have a list of **additional suppliers**, each with its own details:

| Property | Description |
| --- | --- |
| `SupplierId` | Unique identifier for the supplier |
| `SupplierName` | Supplier display name |
| `SupplierSkuId` | The product's SKU in the supplier's own system |

This is useful when the same product can be sourced from multiple vendors, each using their own article numbers.

* * *

## Lead Time

**Lead time** is the number of days from when a purchase order is placed until the goods are expected to arrive. In Omnium, lead time is managed at the supplier level and propagated to products:

*   **`DefaultLeadTime`** — The supplier's standard delivery time in days.
*   **`DefaultLeadTimeSafetyMarginDays`** — An additional buffer (in days) added on top of the lead time to account for delays or variability.

When a supplier's lead time is updated, Omnium automatically propagates the new value to all products linked to that supplier. This keeps product-level lead time data in sync without requiring manual updates on each product.

Lead time values are used by Omnium's inventory and replenishment features to calculate when to reorder stock and when incoming goods are expected to arrive.

* * *

## Order Interval

The **`DefaultOrderIntervalDays`** property defines the typical purchasing cycle for a supplier — how many days between each order you typically place.

This value is used together with lead time when calculating reorder suggestions. It represents how many days of demand you want each purchase order to cover.

* * *

## Logistics and Terms

Suppliers support several properties for managing commercial and shipping terms:

| Property | Description |
| --- | --- |
| `Incoterms` | The delivery terms agreement (e.g., FOB, DDP, EXW) |
| `ShippingProvider` | The supplier's standard freight carrier (e.g., PostNord, DHL) |
| `ShipmentCost` | Default shipping cost for orders from this supplier |
| `PaymentTerms` | Agreed payment terms in days (e.g., 30 = Net 30) |
| `PreferredCurrency` | Currency for transactions with this supplier (ISO code) |
| `PreferredLanguage` | Language for communication with this supplier (ISO code) |

* * *

## Reorder Suggestions

Omnium can automatically calculate **reorder suggestions** for each supplier. These suggestions are computed from analytics data and help you decide when and how much to order.

Reorder suggestions are grouped by **warehouse** and include:

| Property | Description |
| --- | --- |
| `WarehouseCode` | The warehouse the suggestion applies to |
| `Quantity` | Current quantity needing replenishment |
| `ReorderQuantity` | Quantity that should be reordered |
| `SuggestedReorderQuantity` | System-calculated recommended order quantity |
| `OrdersToPurchase` | Number of pending orders driving the demand |
| `Count` | Number of products included in the suggestion |

Reorder suggestions are recalculated periodically by a scheduled task and stored on the supplier record. They can also be triggered manually from the Omnium UI.

You can filter and search suppliers by their reorder suggestions, making it easy to identify which suppliers need purchase orders placed.

* * *

## Store and Access Control

Suppliers can be linked to specific **stores** and **store groups** using the `StoreIds` and `StoreGroupIds` properties. This serves two purposes:

1.  **Organizational grouping** — Associate a supplier with the stores it serves.
2.  **Access control** — When the **Local Supplier** setting is enabled, non-admin users will only see suppliers that are linked to their assigned stores. This restricts visibility so that store-level users only work with relevant suppliers.

When local supplier mode is active and a new supplier is created by a non-admin user, Omnium automatically assigns the supplier to the user's available stores or store groups, depending on configuration.

* * *

## Contact Persons

A supplier can have multiple **contact persons**, each with their own name, email, phone number, and role. This allows you to maintain a directory of contacts for different purposes (e.g., ordering, invoicing, support).

* * *

## Addresses

Suppliers support both a **primary address** and a list of **additional addresses**. Additional addresses can represent different locations such as billing addresses, delivery addresses, or warehouse locations.

* * *

## External IDs

The `ExternalIds` list allows you to store identifiers from external systems (e.g., ERP supplier numbers, accounting system IDs). Each external ID has a `Type` and `Value`, making it easy to maintain cross-system references.

* * *

## Tags and Custom Properties

*   **Tags** — Free-text labels for categorization and filtering. Tags make it easy to group suppliers by type, region, or any other criteria relevant to your business.
*   **Properties** — Key-value pairs for storing custom data. These can be pre-configured with default properties in the supplier settings, and are fully searchable.

* * *

## Version History

Omnium maintains a version history for supplier records. Each time a supplier is updated, a new version is created. You can retrieve previous versions to audit changes over time. The current version is identified by `VersionId`, and the prior version by `PreviousVersionId`.

* * *

## Supplier Model

| Property | Type | Description |
| --- | --- | --- |
| `Id` | string | Unique supplier identifier |
| `Name` | string | Supplier display name |
| `OmniumStoreId` | string | Linked Omnium store ID (for internal transfers) |
| `TaxId` | string | Tax registration / VAT number |
| `Email` | string | Primary email address |
| `Phone` | string | Primary phone number |
| `Address` | Address | Primary address |
| `Addresses` | List<Address> | Additional addresses (billing, delivery, etc.) |
| `Contacts` | List<ContactPerson> | Contact persons at the supplier |
| `PreferredLanguage` | string | ISO language code |
| `PreferredCurrency` | string | ISO currency code |
| `DefaultLeadTime` | int? | Standard lead time in days |
| `DefaultLeadTimeSafetyMarginDays` | int? | Safety buffer in days added to lead time |
| `DefaultOrderIntervalDays` | int? | Purchasing cycle interval in days |
| `PaymentTerms` | int? | Payment terms in days |
| `Incoterms` | string | Delivery terms (FOB, DDP, EXW, etc.) |
| `ShippingProvider` | string | Standard freight carrier |
| `ShipmentCost` | decimal | Default shipping cost |
| `StoreIds` | List<string> | Linked store IDs |
| `StoreGroupIds` | List<string> | Linked store group IDs |
| `AssortmentCodes` | List<string> | Assortment code IDs defining which products this supplier can deliver. See [Supplier Assortment Codes](Suppliers/supplier-assortment-codes.md). |
| `Tags` | List<string> | Categorization tags |
| `Properties` | List<PropertyItem> | Custom key-value properties |
| `ExternalIds` | List<ExternalId> | External system identifiers |
| `VersionId` | string | Current version identifier |
| `PreviousVersionId` | string | Previous version identifier |
| `Created` | DateTime? | Record creation timestamp |
| `Modified` | DateTime? | Last modification timestamp |
