# Custom Reports

Source: https://docs.omnium.no/docs/configuration/custom-reports

> Configure custom data export reports with flexible column mapping, data types, and role-based access control.

## Overview

Custom Reports allow you to define tailored data export configurations for various entity types in Omnium. Each custom report specifies which data columns to include, how to format them, and where the report should be available. Reports can be exported in multiple formats including Excel, CSV, HTML, and PDF.

Custom Reports are configured under **Configuration > Settings > Platform > Custom reports** and appear in context menus throughout the application wherever data export is available.

* * *

## Configuration Model

Custom Reports are stored in the `ReportSettings.CustomReports` section of Tenant Settings. Each custom report is defined by a `CustomReport` object with the following properties:

### CustomReport Properties

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `Id` | string | Yes | Unique identifier for the report (typically a UUID) |
| `ReportName` | string | Yes | Display name shown in the UI |
| `ReportNameTranslationKey` | string | No | Translation key for localized report name |
| `Description` | string | No | Description of the report's purpose |
| `DescriptionTranslateKey` | string | No | Translation key for localized description |
| `ReportType` | string | Yes | The entity type this report exports (see Report Types below) |
| `ReportAreas` | List<string> | Yes | UI areas where this report is available (see Report Areas below) |
| `ReportProperties` | List<CustomReportProperty> | Yes | Column definitions for the report |
| `OptionalData` | List<string> | No | Additional related data to include (see Optional Data below) |
| `Roles` | List<string> | No | Role restrictions for accessing this report |

### CustomReportProperty Properties

Each column in the report is defined by a `CustomReportProperty`:

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `Property` | string | Yes | Property path to export (e.g., `Order.OrderNumber`, `Order.Properties.CustomField`) |
| `Name` | string | Yes | Column header display name |
| `TranslationKey` | string | No | Translation key for localized column header |
| `DataType` | string | No | Data type for formatting: `String`, `Number`, `Date`, or `Formula` |
| `DataFormat` | string | No | Format specification (e.g., timezone for dates) |
| `Width` | int | No | Column width in Excel export (default: 35) |
| `Prefix` | string | No | Text prefix to prepend to values |

* * *

## Report Types

The `ReportType` property determines which entity the report exports and which properties are available. Supported report types:

| Report Type | Description |
| --- | --- |
| `Order` | Order header data |
| `OrderLine` | Individual order line items |
| `OrderError` | Order error records (one row per error) |
| `Shipment` | Shipment-level data |
| `Return` | Return order data |
| `ReturnOrderLine` | Return order line items |
| `Product` | Product master data |
| `Variant` | Product variant data |
| `Price` | Price information |
| `Asset` | Digital assets |
| `Store` | Store/location data |
| `Employee` | Employee data |
| `Cart` | Shopping cart data |
| `CartShipment` | Cart shipment data |
| `CartOrderLine` | Cart line items |
| `BusinessCustomer` | B2B customer data |
| `ContactPerson` | Business customer contacts |
| `PrivateCustomer` | B2C customer data |
| `Consent` | Customer consent records |
| `Project` | Project data |
| `PurchaseOrder` | Purchase order headers |
| `PurchaseOrderLine` | Purchase order lines |
| `InventoryItem` | Inventory stock data |
| `InventoryTransaction` | Inventory movement history |
| `Delivery` | Delivery data |
| `DeliveryLine` | Delivery line items |
| `AnalyticsOrderLine` | Analytics-specific order line data |
| `ProductSales` | Product data combined with sales analytics and inventory KPIs for a date range |
| `GiftCard` | Gift card data |

* * *

## ProductSales Report Type

The `ProductSales` report type is a specialized report that combines product master data with sales analytics and inventory metrics for a selected date range. It produces one row per SKU (either a product with `IsSku = true` or individual variants of a parent product) and computes a wide range of KPIs useful for merchandising, purchasing, logistics, and finance.

### How it works

1.  When exporting, the user is prompted to select a **date range** (From / To)
2.  The report iterates all products matching the current search filters
3.  For each SKU, it queries **analytics order lines** (grouped by SkuId) and **inventory transactions** for the start and end of the selected period
4.  Calculated KPIs are derived from these data sources

The report is available in the `ProductList` area.

### Available Properties

All properties use the prefix `ProductWithSalesDataViewModel.` in the property path configuration.

#### Product Attributes

| Property | Type | Description |
| --- | --- | --- |
| `ProductId` | String | Product identifier (falls back to parent if empty on variant) |
| `Name` | String | Product name (falls back to parent) |
| `SkuId` | String | SKU identifier |
| `Ean` | String | EAN / barcode (falls back to parent) |
| `Catalog` | String | Top-level catalog name (falls back to parent) |
| `SubCatalog` | String | Catalog nodes joined by comma (falls back to parent) |
| `MainCategoryName` | String | Primary category name (falls back to parent) |
| `Brand` | String | Brand name (falls back to parent) |
| `Supplier` | String | Supplier name (falls back to parent) |
| `SupplierId` | String | Supplier identifier (falls back to parent) |
| `SupplierSkuId` | String | Supplier's article number (falls back to parent) |
| `Color` | String | Color attribute (falls back to parent) |
| `Size` | String | Size attribute (falls back to parent) |
| `Gender` | String | Gender attribute (falls back to parent) |
| `Season` | String | Season code (falls back to parent) |
| `CountryOfOrigin` | String | Country of origin (falls back to parent) |
| `Weight` | Number | Product weight (falls back to parent) |
| `IsActive` | Boolean | Whether the product is active |
| `Cost` | Number | Unit cost price |
| `ListPrice` | Number | List price from default price or first price entry |
| `ReorderMinQuantity` | Number | Reorder point / minimum stock level |
| `LeadTime` | Number | Lead time in days (falls back to parent) |
| `SupplierLeadTime` | Number | Supplier lead time in days (falls back to parent) |
| `Created` | Date | Product creation date (falls back to parent) |
| `Published` | Date | Product publication date (falls back to parent) |
| `Discontinued` | Date | Discontinuation date (falls back to parent) |

#### Sales Metrics

These values come from analytics order lines grouped by SKU for the selected date range.

| Property | Type | Description |
| --- | --- | --- |
| `RevenueExTax` | Number | Total revenue excluding tax |
| `RevenueIncTax` | Number | Total revenue including tax |
| `TotalUnitsSold` | Number | Total units ordered |
| `TotalUnitsReturned` | Number | Total units returned |
| `TotalUnitsCancelled` | Number | Total units cancelled |
| `DeliveredQuantity` | Number | Total units delivered |
| `Cogs` | Number | Cost of goods sold (total cost from order lines) |
| `GrossProfit` | Number | Gross profit (from analytics) |
| `AverageOrderValue` | Number | Average order value for orders containing this SKU |
| `Currency` | String | Currency code from order data |

#### Inventory Metrics

Inventory data is derived from inventory transactions at the start and end of the selected period.

| Property | Type | Description |
| --- | --- | --- |
| `Inventory` | Number | Inventory quantity at end of period |
| `InventoryAtStartOfPeriod` | Number | Inventory quantity at start of period |
| `InventoryValue` | Number | End-of-period inventory value (`Inventory * Cost`) |

#### Calculated KPIs — Profitability

| Property | Type | Formula | Description |
| --- | --- | --- | --- |
| `GrossProfitPercentage` | Number | `(RevenueExTax - Cogs) / RevenueExTax * 100` | Gross margin as a percentage of revenue |
| `MarkupPercentage` | Number | `(RevenueExTax - Cogs) / Cogs * 100` | Markup over cost |
| `ContributionMarginPerUnit` | Number | `(RevenueExTax - Cogs) / TotalUnitsSold` | Profit contribution per unit sold |
| `Gmroi` | Number | `(RevenueExTax - Cogs) / (AvgInventory * Cost)` | Gross Margin Return on Inventory Investment |

#### Calculated KPIs — Sales

| Property | Type | Formula | Description |
| --- | --- | --- | --- |
| `NetUnitsSold` | Number | `TotalUnitsSold - TotalUnitsReturned - TotalUnitsCancelled` | Actual net units sold |
| `AverageSellingPrice` | Number | `RevenueExTax / TotalUnitsSold` | Average selling price excluding tax |
| `AverageSellingPriceIncTax` | Number | `RevenueIncTax / TotalUnitsSold` | Average selling price including tax |

#### Calculated KPIs — Returns & Fulfillment

| Property | Type | Formula | Description |
| --- | --- | --- | --- |
| `ReturnRate` | Number | `TotalUnitsReturned / TotalUnitsSold * 100` | Return rate as percentage |
| `CancellationRate` | Number | `TotalUnitsCancelled / TotalUnitsSold * 100` | Cancellation rate as percentage |
| `FulfillmentRate` | Number | `DeliveredQuantity / TotalUnitsSold * 100` | Fulfillment rate as percentage |

#### Calculated KPIs — Inventory & Logistics

| Property | Type | Formula | Description |
| --- | --- | --- | --- |
| `TurnoverRate` | Number | `TotalUnitsSold / AvgInventory` | Inventory turnover for the period |
| `AnnualizedTurnoverRate` | Number | `TurnoverRate * 365 / DaysInPeriod` | Turnover rate projected to a full year |
| `AvarageStorageTime` | Number | `DaysInPeriod / TurnoverRate` | Average days in stock before being sold |
| `SellThroughRate` | Number | `TotalUnitsSold / (TotalUnitsSold + Inventory) * 100` | Percentage of available stock that was sold |
| `DaysOfSupply` | Number | `Inventory / (NetUnitsSold / DaysInPeriod)` | Days of stock remaining at current sales rate |
| `WeeksOfSupply` | Number | `Inventory / (NetUnitsSold / DaysInPeriod * 7)` | Weeks of stock remaining at current sales rate |

**AvgInventory** in the formulas above refers to the average of inventory at the start and end of the selected period: `(InventoryAtStartOfPeriod + Inventory) / 2`. Division-by-zero scenarios (e.g., no sales, no inventory) are handled by returning 0.

### Example Configuration

A product sales report for merchandising analysis:

```json
{
    "Id": "e5f6a7b8-c9d0-1234-efab-567890123456",
    "ReportName": "Product Sales Analysis",
    "Description": "Sales performance with profitability and inventory KPIs per SKU",
    "ReportType": "ProductSales",
    "ReportAreas": ["ProductList"],
    "ReportProperties": [
        {
            "Property": "ProductWithSalesDataViewModel.ProductId",
            "Name": "Product ID",
            "DataType": "String",
            "Width": 20
        },
        {
            "Property": "ProductWithSalesDataViewModel.Name",
            "Name": "Product Name",
            "DataType": "String",
            "Width": 40
        },
        {
            "Property": "ProductWithSalesDataViewModel.SkuId",
            "Name": "SKU",
            "DataType": "String",
            "Width": 20
        },
        {
            "Property": "ProductWithSalesDataViewModel.Brand",
            "Name": "Brand",
            "DataType": "String",
            "Width": 20
        },
        {
            "Property": "ProductWithSalesDataViewModel.MainCategoryName",
            "Name": "Category",
            "DataType": "String",
            "Width": 25
        },
        {
            "Property": "ProductWithSalesDataViewModel.TotalUnitsSold",
            "Name": "Units Sold",
            "DataType": "Number",
            "Width": 15
        },
        {
            "Property": "ProductWithSalesDataViewModel.NetUnitsSold",
            "Name": "Net Units Sold",
            "DataType": "Number",
            "Width": 15
        },
        {
            "Property": "ProductWithSalesDataViewModel.RevenueExTax",
            "Name": "Revenue (ex. tax)",
            "DataType": "Number",
            "Width": 18
        },
        {
            "Property": "ProductWithSalesDataViewModel.GrossProfitPercentage",
            "Name": "Gross Margin %",
            "DataType": "Number",
            "Width": 15
        },
        {
            "Property": "ProductWithSalesDataViewModel.ReturnRate",
            "Name": "Return Rate %",
            "DataType": "Number",
            "Width": 15
        },
        {
            "Property": "ProductWithSalesDataViewModel.SellThroughRate",
            "Name": "Sell-Through %",
            "DataType": "Number",
            "Width": 15
        },
        {
            "Property": "ProductWithSalesDataViewModel.Gmroi",
            "Name": "GMROI",
            "DataType": "Number",
            "Width": 12
        },
        {
            "Property": "ProductWithSalesDataViewModel.WeeksOfSupply",
            "Name": "Weeks of Supply",
            "DataType": "Number",
            "Width": 15
        },
        {
            "Property": "ProductWithSalesDataViewModel.Inventory",
            "Name": "Current Stock",
            "DataType": "Number",
            "Width": 15
        }
    ],
    "Roles": ["Admin", "Merchandiser", "PurchaseManager"]
}
```

* * *

## Report Areas

The `ReportAreas` property controls where the custom report appears in the UI. A report can be available in multiple areas.

### List Views

| Area | Description |
| --- | --- |
| `OrderList` | Order list view |
| `ReturnList` | Return order list view |
| `ProductList` | Product list view |
| `CartList` | Cart list view |
| `StoreList` | Store list view |
| `BusinessCustomerList` | Business customer list view |
| `PrivateCustomerList` | Private customer list view |
| `ProjectList` | Project list view |
| `PurchaseOrderList` | Purchase order list view |
| `DeliveryList` | Delivery list view |
| `GiftCardList` | Gift card list view |

### Detail Views

| Area | Description |
| --- | --- |
| `PurchaseOrder` | Purchase order detail view |
| `Delivery` | Delivery detail view |

### Report Center

| Area | Description |
| --- | --- |
| `ReportOrders` | Order reports section |
| `ReportProducts` | Product reports section |
| `ReportStores` | Store reports section |
| `ReportAnalyticsOrderLine` | Analytics order line reports |
| `ReportInventory` | Inventory reports section |
| `ReportInventoryTransactions` | Inventory transaction reports |

* * *

## Data Types

The `DataType` property controls how column values are formatted in the export:

| Data Type | Description | Use Case |
| --- | --- | --- |
| `String` | Plain text (default) | Names, descriptions, IDs |
| `Number` | Numeric formatting | Quantities, prices, counts |
| `Date` | Date/time formatting with timezone support | Order dates, timestamps |
| `Formula` | Excel formula with row indexing | Calculated fields |

### Date Formatting

When using the `Date` data type, specify a timezone in the `DataFormat` property:

```json
{
    "Property": "Order.Created",
    "Name": "Order Date",
    "DataType": "Date",
    "DataFormat": "Europe/Oslo"
}
```

### Formula Support

For Excel exports, you can include formulas that reference the current row using `[i]` as a placeholder for the row index:

```json
{
    "Property": "",
    "Name": "Line Total",
    "DataType": "Formula",
    "DataFormat": "=E[i]*F[i]"
}
```

* * *

## Optional Data

The `OptionalData` property allows including related entity data in the export. This is useful when the report type doesn't include all the data you need.

| Optional Data | Available For | Description |
| --- | --- | --- |
| `Shipments` | Order reports | Include shipment data with order exports |
| `Returns` | Order reports | Include return data with order exports |
| `Products` | Order reports | Include full product data with order line exports |

* * *

## Role-Based Access Control

The `Roles` property restricts which users can access the report. When configured:

*   Only users with at least one of the specified roles can see and use the report
*   Users with the Admin role always have access regardless of restrictions
*   If `Roles` is empty or not specified, the report is available to all users

Example:

```json
{
    "Roles": ["OrderManager", "ReportViewer", "FinanceTeam"]
}
```

* * *

## UI Configuration

Custom Reports are configured in the Omnium UI under **Configuration > Settings > Platform > Custom reports**.

### Creating a New Report

1.  Navigate to **Configuration > Settings > Platform > Custom reports**
2.  Click **Add** to create a new custom report
3.  Fill in the report details:
    *   **Type**: Select the entity type (Order, Product, etc.)
    *   **Name**: Enter a display name
    *   **Description**: Optionally describe the report's purpose
    *   **Area**: Select one or more UI areas where the report should appear
    *   **Optional Data**: Select additional data to include if needed
    *   **Roles**: Optionally restrict access to specific roles
    *   **ID**: A unique identifier is auto-generated but can be customized

### Configuring Report Columns

After creating the report, expand it to configure columns:

1.  Click the expand arrow on the report row

2.  Click **Add** to add a new column

3.  Configure the column:

    *   **Name**: Column header text
    *   **Property**: Property path (use dot notation for nested properties)
    *   **Width**: Column width for Excel exports
    *   **Type**: Data type (String, Number, Date, Formula)
    *   **Data Format**: Format specification (timezone for dates, formula for calculated fields)
    *   **Prefix**: Optional text prefix
4.  Drag and drop columns to reorder them

5.  Click the delete icon to remove columns

### Property Path Syntax

Properties support dot notation to access nested data:

| Pattern | Example | Description |
| --- | --- | --- |
| Direct property | `OrderNumber` | Top-level entity property |
| Nested object | `Order.Customer.Email` | Property from related entity |
| Custom properties | `Order.Properties.CustomField` | Custom property value |
| External IDs | `Order.ExternalIds.ErpOrderId` | External ID by key |

### OrderError Property Paths

The `OrderError` report type generates one row per error on each order. Properties use the following prefixes:

| Prefix | Description |
| --- | --- |
| `EntityError.*` | Error properties (Key, Message, Details, Severity, Occured, Status, Comment, ReferenceId) |
| `Order.*` | Order properties (supports Properties, ExternalIds, CustomProperties) |

Example property paths for OrderError reports:

*   `EntityError.Key` - Error key/code
*   `EntityError.Message` - Error message
*   `EntityError.Severity` - Error severity level
*   `EntityError.Occured` - When the error occurred
*   `EntityError.Status` - Current error status
*   `Order.OrderNumber` - Associated order number
*   `Order.Properties.CustomField` - Custom order property

* * *

## Example Configuration

### Basic Order Report

A simple order report with core order information:

```json
{
    "Id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "ReportName": "Order Summary Report",
    "Description": "Basic order information for customer service",
    "ReportType": "Order",
    "ReportAreas": ["OrderList", "ReportOrders"],
    "ReportProperties": [
        {
            "Property": "OrderNumber",
            "Name": "Order #",
            "DataType": "String",
            "Width": 20
        },
        {
            "Property": "Created",
            "Name": "Order Date",
            "DataType": "Date",
            "DataFormat": "Europe/Oslo",
            "Width": 25
        },
        {
            "Property": "Customer.Email",
            "Name": "Customer Email",
            "DataType": "String",
            "Width": 40
        },
        {
            "Property": "GrandTotal",
            "Name": "Total",
            "DataType": "Number",
            "Width": 15,
            "Prefix": "NOK "
        },
        {
            "Property": "Status",
            "Name": "Status",
            "DataType": "String",
            "Width": 20
        }
    ],
    "Roles": []
}
```

### Order Lines Report with Products

A detailed order lines report including product information:

```json
{
    "Id": "b2c3d4e5-f6a7-8901-bcde-f23456789012",
    "ReportName": "Detailed Order Lines",
    "Description": "Order lines with full product details for inventory analysis",
    "ReportType": "OrderLine",
    "ReportAreas": ["OrderList", "ReportOrders"],
    "OptionalData": ["Products"],
    "ReportProperties": [
        {
            "Property": "Order.OrderNumber",
            "Name": "Order #",
            "DataType": "String",
            "Width": 20
        },
        {
            "Property": "ProductId",
            "Name": "SKU",
            "DataType": "String",
            "Width": 25
        },
        {
            "Property": "ProductName",
            "Name": "Product Name",
            "DataType": "String",
            "Width": 50
        },
        {
            "Property": "Quantity",
            "Name": "Qty",
            "DataType": "Number",
            "Width": 10
        },
        {
            "Property": "UnitPrice",
            "Name": "Unit Price",
            "DataType": "Number",
            "Width": 15
        },
        {
            "Property": "LineTotal",
            "Name": "Line Total",
            "DataType": "Number",
            "Width": 15
        }
    ],
    "Roles": ["OrderManager", "FinanceTeam"]
}
```

### Order Errors Report

A report showing all order errors for troubleshooting:

```json
{
    "Id": "d4e5f6a7-b8c9-0123-defg-456789012345",
    "ReportName": "Order Errors Report",
    "Description": "Export order errors for troubleshooting and analysis",
    "ReportType": "OrderError",
    "ReportAreas": ["OrderList", "ReportOrders"],
    "ReportProperties": [
        {
            "Property": "Order.OrderNumber",
            "Name": "Order #",
            "DataType": "String",
            "Width": 20
        },
        {
            "Property": "EntityError.Key",
            "Name": "Error Code",
            "DataType": "String",
            "Width": 25
        },
        {
            "Property": "EntityError.Message",
            "Name": "Error Message",
            "DataType": "String",
            "Width": 60
        },
        {
            "Property": "EntityError.Severity",
            "Name": "Severity",
            "DataType": "String",
            "Width": 15
        },
        {
            "Property": "EntityError.Occured",
            "Name": "Occurred",
            "DataType": "Date",
            "DataFormat": "Europe/Oslo",
            "Width": 25
        },
        {
            "Property": "EntityError.Status",
            "Name": "Status",
            "DataType": "String",
            "Width": 15
        }
    ],
    "Roles": ["Admin", "OrderManager"]
}
```

### Inventory Report with Custom Properties

An inventory report with store-specific custom fields:

```json
{
    "Id": "c3d4e5f6-a7b8-9012-cdef-345678901234",
    "ReportName": "Warehouse Inventory",
    "ReportNameTranslationKey": "Reports_WarehouseInventory",
    "Description": "Current inventory levels with warehouse location data",
    "ReportType": "InventoryItem",
    "ReportAreas": ["ReportInventory"],
    "ReportProperties": [
        {
            "Property": "ProductId",
            "Name": "SKU",
            "DataType": "String",
            "Width": 25
        },
        {
            "Property": "StoreName",
            "Name": "Warehouse",
            "DataType": "String",
            "Width": 30
        },
        {
            "Property": "Available",
            "Name": "Available Qty",
            "DataType": "Number",
            "Width": 15
        },
        {
            "Property": "Reserved",
            "Name": "Reserved Qty",
            "DataType": "Number",
            "Width": 15
        },
        {
            "Property": "Properties.BinLocation",
            "Name": "Bin Location",
            "DataType": "String",
            "Width": 20
        }
    ],
    "Roles": ["WarehouseManager", "InventoryTeam"]
}
```

* * *

## How Reports Work

When a user exports a custom report, the following process occurs:

1.  **Report Selection**: User selects a custom report from the context menu in a supported UI area
2.  **Access Validation**: System verifies the user has access based on configured roles
3.  **Data Query**: The appropriate data export service queries data based on the current search/filter criteria
4.  **Report Building**: The report builder constructs the export based on configured properties:
    *   Resolves property paths to actual values
    *   Applies data type formatting
    *   Handles optional data inclusion
    *   Processes formulas and prefixes
5.  **Export Generation**: The report is generated in the requested format (Excel, CSV, HTML, or PDF)
6.  **Download**: The exported file is streamed to the user

* * *

## Best Practices

### Report Design

*   **Keep reports focused**: Create multiple smaller reports rather than one large report with many columns
*   **Use meaningful names**: Choose clear report names that describe the purpose and content
*   **Consider performance**: Reports with optional data (Shipments, Returns, Products) require additional queries
*   **Set appropriate widths**: Configure column widths for readable Excel exports

### Property Mapping

*   **Use dot notation carefully**: Ensure the property path is valid for the selected report type
*   **Test custom properties**: Verify custom property keys exist before including in reports
*   **Handle missing data**: Properties that don't exist will export as empty cells

### Access Control

*   **Apply least privilege**: Only grant report access to roles that need the data
*   **Use role groups**: Create role groups for common report access patterns
*   **Document restrictions**: Include access information in report descriptions

* * *

## Related Documentation

*   [Generic Concepts](generic.md) - External IDs and Properties used in reports
