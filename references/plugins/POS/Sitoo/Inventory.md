# Inventory

Source: https://docs.omnium.no/docs/plugins/POS/Sitoo/Inventory

> Inventory management and synchronization between Omnium and Sitoo.

The Sitoo integration supports bidirectional inventory synchronization. Stock levels can be imported from Sitoo to Omnium or exported from Omnium to Sitoo, depending on configuration and warehouse type.

| Direction | Description | Use Case |
| --- | --- | --- |
| **Import** (Sitoo → Omnium) | Stock levels from Sitoo POS are imported into Omnium | POS is the inventory master for store stock |
| **Export** (Omnium → Sitoo) | Stock levels from Omnium are pushed to Sitoo | Omnium is the inventory master |

## Warehouse Types

Sitoo distinguishes between two warehouse types, which affects how inventory is synchronized:

### FIFO Warehouses

First-In-First-Out warehouses with physical inventory tracking. These support bin location tracking and use transactional stock updates (warehouse batches). Typically used for back-office or distribution center inventory. Export from Omnium uses stock-taking transactions.

### Virtual Warehouses

Point-of-sale virtual warehouses without physical location tracking. These use direct stock level updates without transaction history, making sync faster but with less audit trail. Typically used for store floor inventory and can sync in both directions.

We recommend using virtual warehouses and let Omnium be the master of stock levels. See [Sitoo documentation](https://developer.sitoo.com/guides/stores-and-warehouses#warehouses).

## Warehouse Setup

### Step 1: Link Warehouse to Sitoo

Each Omnium store/warehouse must have an external ID that maps to the corresponding Sitoo warehouse ID.

**Single market setup:**

*   Add external ID with key: `SitooWarehouseId`
*   Value: The warehouse ID from Sitoo

**Multi-market setup:**

*   Add external ID with key: `SitooWarehouseId-{MarketId}` (e.g., `SitooWarehouseId-NOR`)
*   Value: The warehouse ID from Sitoo for that market
*   This allows the same Omnium warehouse to map to different Sitoo warehouses per market

### Step 2: Warehouse Type Detection

The warehouse type is determined automatically on first sync:

1.  The integration queries Sitoo for the warehouse metadata
2.  Sitoo returns the warehouse type (FIFO or Virtual)
3.  The type is cached on the store record for future use

**Manual override:** If needed, set the warehouse type manually by adding a property to the store:

```json
{
    "Key": "SitooWarehouseType",
    "Value": "virtual"
}
```

Valid values: `fifo` or `virtual`

### Step 3: Market Assignment

Ensure the warehouse is configured correctly for market access:

*   The store must be included in the market's available stores
*   The market must have the Sitoo connector enabled

## Sync Triggers

### Scheduled Import

Runs at configured intervals to fetch inventory changes from Sitoo.

*   **Delta sync**: Only fetches items modified since the last run
*   **5-minute buffer**: Excludes very recent changes to avoid conflicts with real-time events
*   **Batch size**: Processes warehouses in batches of 100 items per API call

### Scheduled Export

Runs at configured intervals to push inventory changes to Sitoo.

*   **Delta sync**: Only exports items modified since the last run
*   Processes all configured warehouses per market
*   Respects warehouse type for appropriate update method

### Transaction Events

Individual warehouse transactions (manual adjustments, stock counts) can trigger inventory updates via webhooks, providing near real-time synchronization.

## Configuration

| Setting | Description | Default |
| --- | --- | --- |
| **ShouldOnlyExportVirtualWarehouses** (Configured in global Sitoo settings) | Only export to virtual warehouses, skip FIFO | `false` |
| **ExportBinLocationToFifoWarehouses** | Include bin location data when exporting to FIFO warehouses | `true` |

## Export Process

### Virtual Warehouses

Stock levels are updated directly in a single batch operation. The available quantity (total minus reserved) is sent to Sitoo, overwriting the existing stock level.

### FIFO Warehouses

Stock updates follow a transactional process:

1.  A warehouse batch is created with type "Stock-Taking"
2.  The batch is opened for editing
3.  Stock items are added to the batch
4.  The batch is closed, committing the changes

If an error occurs, the batch is canceled and can be retried.

## Import Process

1.  Inventory items are fetched from Sitoo for each configured warehouse
2.  A 5-minute buffer excludes recently modified items (allows webhook events to process first)
3.  Items are mapped to Omnium inventory format
4.  Inventory is updated in batches of up to 5000 items
5.  Unchanged items are skipped to minimize database operations

* * *

## Goods Reception

The Sitoo integration handles goods reception through a bidirectional flow connecting Omnium purchase orders with Sitoo's shipment system. Purchase orders created in Omnium are exported to Sitoo as inbound shipments. When goods are received at the store via Sitoo, the receipt information is sent back to Omnium to update the purchase order and delivery records.

### Purchase Order Export (Omnium → Sitoo)

When a purchase order is created in Omnium, its deliveries can be exported to Sitoo as inbound shipments.

#### Shipment State Progression

When a delivery is exported, the shipment is automatically advanced through these states:

1.  **New** → Shipment created in Sitoo
2.  **Packed** → Items prepared for transport
3.  **Transport Ordered** → Carrier notified
4.  **Ready for Pickup** → Awaiting collection from supplier
5.  **In Transit** → Shipment on the way to destination

Each exported delivery is tagged with an external ID linking it to the Sitoo shipment, preventing duplicate exports and enabling matching when receipt events are received.

### Goods Receipt (Sitoo → Omnium)

When goods are received at a store in Sitoo, a webhook event notifies Omnium to update the corresponding delivery and purchase order.

#### Triggering Events

Sitoo sends a `shipment-v3` webhook event when shipment state changes occur. Common receipt-related states include:

*   **Received** — Items have been received and counted
*   **Closed** — Receipt complete, all items accounted for
*   **Closed Incomplete** — Receipt complete, but with discrepancies

#### Receipt Processing

1.  **Match Shipment to Delivery**: The shipment ID is used to find the corresponding Omnium delivery via external ID lookup
2.  **Fetch Receipt Details**: Full shipment data including packages and received quantities is retrieved from Sitoo
3.  **Update Line Items**: For each item, the system matches to the original purchase order line by **SKU**, **Quantity**, and **Package Barcode**, then updates `CountedQuantity` and `DeliveredQuantity`
4.  **Handle Undeclared Items**: Items received that were not on the original order are added as new purchase order lines
5.  **Update Delivery Status**: The delivery status is updated based on the shipment state

#### Quantity Reconciliation

| Scenario | Behavior |
| --- | --- |
| **Exact receipt** | `CountedQuantity` and `DeliveredQuantity` set to received amount; delivery marked complete |
| **Partial receipt** | Only matched items updated; shortage visible for follow-up |
| **Over-receipt** | New purchase order lines created for undeclared items |

#### Batch and Expiration Tracking

For products with batch management, the following fields are available on shipment items:

| Field | Description |
| --- | --- |
| **Batch** | Lot/batch number for received goods |
| **Batch Expires** | Timestamp when the batch expires |

More information: **[ShipmentsV3](Shipments.md)** - Purchase order deliveries using shipments-v3 API

* * *

## Stock-Taking

Stock-taking (inventory counting) in the Sitoo integration supports bidirectional synchronization. Inventory counts performed in Sitoo can be imported into Omnium, and inventory adjustments in Omnium can be exported to Sitoo. The behavior differs based on warehouse type (FIFO vs Virtual).

### Real-Time Import (Webhook)

When a stock-taking transaction is completed in Sitoo, a webhook event is sent to Omnium:

1.  Sitoo sends a `warehouse-transaction` event with type `stock-taking`
2.  Omnium fetches the full transaction details from Sitoo
3.  Counted quantities are mapped to Omnium inventory items
4.  Inventory is updated with the new quantities

### Scheduled Import

A periodic scheduled task imports inventory changes from Sitoo as a delta sync, only fetching items modified since the last run. It uses a 5-minute buffer to allow webhook events to process first.

### Export to Sitoo

When inventory is adjusted in Omnium and export is enabled:

*   **FIFO Warehouses**: Creates a stock-taking batch transaction in Sitoo (with full audit trail and optional bin location tracking)
*   **Virtual Warehouses**: Updates quantities directly without transaction tracking

### Configuration Approaches

| Approach | Description | Best For |
| --- | --- | --- |
| **Sitoo as master** | Counts in Sitoo, imported to Omnium via webhook | Retail stores where staff use Sitoo POS |
| **Omnium as master** | Counts in Omnium, exported to Sitoo | Centralized inventory management |
| **Mixed mode** | Different approaches per warehouse type | Combined physical stores and fulfillment |

### Stock-Taking Troubleshooting

| Issue | Cause | Resolution |
| --- | --- | --- |
| Stock counts not importing | Webhook not configured | Verify Sitoo webhook settings for `warehouse-transaction` events |
| Counts delayed | 5-minute buffer | Wait for next scheduled sync or check webhook delivery |
| FIFO export fails | Batch stuck in open state | Check Sitoo for orphaned batches; they will be reused or cancelled automatically |
| Quantities don't match | Timing conflict | Ensure webhooks and scheduled tasks are not processing the same data simultaneously |
