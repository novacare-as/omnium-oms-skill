# Orders

Source: https://docs.omnium.no/docs/plugins/POS/Sitoo/Orders

> Order flows between Omnium and Sitoo — POS sales, click and collect, online delivery.

# Orders

The Sitoo integration handles orders in both directions:

*   **Sitoo → Omnium**: POS sales and delivery events are imported via webhooks and scheduled sync.
*   **Omnium → Sitoo**: Online orders are exported to Sitoo for in-store fulfillment, and delivery/completion status is pushed back.

Orders are routed through Omnium **order types**, each with its own set of statuses and workflow steps. The `ExportOrder` workflow step with `connector: "sitoo"` is the mechanism that pushes order data to Sitoo.

> **Note:** Omnium supports fully custom order types, statuses, and workflows. When integrating with Sitoo, some of this flexibility is reduced — Sitoo operates with a fixed set of order types and statuses, so the Omnium setup needs to align with Sitoo's model. The flows described on this page reflect that structure.

## Three Order Flows

There are three main order flows in a Sitoo integration, each with its own order type:

### 1\. Online Delivery (Online-Delivery)

Orders placed online and **shipped directly to the customer** from a warehouse or store. Omnium exports the order to Sitoo and sends delivery status back when shipped. Supports **Ship From Store (BOSFS)** — see [Flow 1](Orders.md#ship-from-store-bosfs) for details.

### 2\. POS Orders (PosSitoo)

Orders originating at the **Sitoo POS in-store**. These are imported into Omnium via webhooks. Can be regular purchases (completed immediately) or include **Endless Aisle** items that need to be shipped from other warehouses.

### 3\. Click and Collect (Online-PickupInStore)

Orders placed online where the customer **picks up in-store**. Omnium exports the order to Sitoo, the store picks the items, Sitoo notifies Omnium when ready, and the customer collects at the store.

| Order Type | Flow | Direction |
| --- | --- | --- |
| **Online-Delivery** | Online Delivery | Omnium → Sitoo → Omnium |
| **PosSitoo** | POS Orders | Sitoo → Omnium |
| **Online-PickupInStore** | Click and Collect | Omnium → Sitoo → Omnium |

Other order types (e.g., Kundeordre, Online-PickupPoint, Online-Delivery-B2B) follow similar patterns and also export to Sitoo, but these three cover the primary flows.

## How ExportOrder Works

The `ExportOrder` workflow step is configured on order statuses to push data to Sitoo at the right moment. The `OrderExportType` property controls what kind of export happens:

| OrderExportType | What it does | When to use |
| --- | --- | --- |
| _(not set / default)_ | Creates or updates the full order in Sitoo | On `New` status — sends the order to Sitoo for fulfillment |
| `"OrderDelivery"` | Sends delivery/shipment info to Sitoo and updates order state | On `Sent`/`Completed` status — tells Sitoo items were shipped or picked up |
| `"ReadyForPickup"` | Marks the order as ready for pickup in Sitoo | On `ReadyForPickUp` status for BOPIS orders |

### Order vs Booking in Sitoo

When exporting an order to Sitoo, the payment status determines the Sitoo order type:

*   **Payment successful** → Sitoo `Order` (type 10) — Sitoo treats this as a paid, confirmed order
*   **Payment pending/none** → Sitoo `Booking` (type 100) — Sitoo treats this as a reservation that still needs payment

This distinction matters for discounts: paid orders include all discounts as-is (Sitoo won't recalculate), while bookings may omit discounts to avoid double-discounting when the booking is completed at POS.

### Status Mapping (Omnium → Sitoo)

When exporting orders or delivery status, Omnium statuses are mapped to Sitoo order states:

| Omnium Status | Sitoo OrderState |
| --- | --- |
| New | Open |
| OrderCanceled | Cancelled |
| Completed, Sent/Ship | Closed |

* * *

## Flow 1: Online Delivery (Online-Delivery)

Online delivery orders are placed by customers online and shipped from a warehouse or store.

### Flow

### Ship From Store (BOSFS)

From Sitoo's perspective, BOSFS is very similar to BOPIS — the main difference is that the **customer's delivery address** is included on the order so the store knows where to ship it. The store fulfills the order in Sitoo POS, and Omnium is notified during the order lifecycle via event callbacks.

When the connector property `BuyOnlineShipFromStoreEnabled` is `true`, the Sitoo export automatically detects whether the order should be shipped from a store:

*   The shipment option must have a **delivery type** that is not `PickUp` (i.e., it's a regular delivery)
*   When this condition is met, the **customer's delivery address** is written onto the Sitoo order (`delivery_address`, `delivery_city`, `delivery_zip`)
*   The **Sitoo warehouse ID** is set to whichever store the order is allocated to

No special tags are needed. Omnium's allocation workflow steps (e.g., `ReallocateEntireOrderBasedOnZipCode`) handle moving the order to the nearest store upstream — the Sitoo export just reads the resulting warehouse and maps it.

**Sitoo lifecycle for BOSFS:**

1.  Omnium creates the order in Sitoo with delivery address + store warehouse ID
2.  Store staff packs and ships the order — Sitoo closes the order with a delivery and sends a callback
3.  Omnium processes the delivery callback and completes the order

> **Note:** The shipping process (booking transportation, printing package labels, etc.) is handled outside of Sitoo.

### New Status

The order enters Omnium with status `New`. The key Sitoo-specific step is:

*   **`ExportOrder`** (connector: sitoo, `runAfterOrderIsSaved: true`) — exports the order to Sitoo. If BOSFS is enabled and the order was allocated to a store, the customer's delivery address and the store's Sitoo warehouse ID are included.

### Sent Status (`isDeliveredStatus: true`)

Terminal status for shipped orders.

Sitoo-specific: **`ExportOrder`** (connector: sitoo, `OrderExportType: OrderDelivery`) pushes delivery info to Sitoo and sets the Sitoo order state to `Closed`. The remaining steps (capture payment, reduce inventory, send notification, etc.) are standard Omnium workflow steps.

### OrderCanceled Status (`isCanceledStatus: true`)

Sitoo-specific: **`ExportOrder`** (connector: sitoo) notifies Sitoo of the cancellation. The remaining steps (cancel payments, release inventory, etc.) are standard Omnium workflow steps.

* * *

## Flow 2: POS Orders (PosSitoo)

POS orders originate at the Sitoo POS in-store and are imported into Omnium via webhooks and scheduled sync. These include regular purchases (completed immediately), purchases with **Endless Aisle** items (shipped from other warehouses), or pure Endless Aisle orders.

### Flow

### How POS Orders Are Imported

When a POS sale is completed in Sitoo, it arrives in Omnium through the order import process:

1.  The Sitoo order classifier detects it as an `AddNew` order.
2.  `OrderFromSitooMapper` maps the Sitoo order to an Omnium order with type `PosSitoo` (configured via the `SitooOrderType` connector property).
3.  If the order is already completed in Sitoo, the mapper sets the status to `CompleteFromPos` and adds a `CompleteFromPos=true` property to the order.
4.  If the order has deliveries (e.g., Endless Aisle shipments), the `OrderDeliveryFromSitooUpdater` processes them and sets shipment statuses to `CompleteFromPos`.

### New Status

The `New` status catches Endless Aisle orders — items ordered at the POS that need to be shipped from a remote warehouse or picked at another store. Workflow steps handle inventory reservation and notifications.

### ReadyForPickup Status (`isPicked: true`)

Used when Endless Aisle items that are being picked up in-store are ready for the customer. A notification step alerts the customer.

### CompleteFromPos Status

The terminal status for all POS orders. Regular in-store sales go directly here. Endless Aisle orders arrive here after the customer picks up or items are delivered.

Key configuration:

*   **`isDeliveredStatus: true`** — marks the order as fulfilled
*   **`properties: [{ "key": "OrderCondition", "value": "CompleteFromPos" }]`** — this is the **order condition** that the Sitoo import service uses to route completed POS orders directly to this status. When the mapper sees the order is completed in Sitoo, it sets the `CompleteFromPos` property on the order, and Omnium's status engine matches it to this status via the `OrderCondition`.
*   **`ExportOrder`** (connector: sitoo, `OrderExportType: OrderDelivery`) — optionally pushes delivery info back to Sitoo. Set to `active: false` by default since POS orders originate from Sitoo and typically don't need to be exported back.

* * *

## Flow 3: Click and Collect (Online-PickupInStore)

Click and Collect orders are placed online and picked up by the customer at a selected store. Omnium exports the order to Sitoo for the store to fulfill, tracks the picking process, and notifies the customer when the order is ready.

### Flow

### Pickup Sent From Main Warehouse

When the order has the tag `PickupSentFromMainWarehouse`, the main warehouse ships the items to the store for customer pickup (instead of the store fulfilling from its own stock). During export, this triggers two things:

*   **`delivery-ignore-stock = "true"`** is set in Sitoo's additionaldata — tells Sitoo not to decrement the store's inventory, since the stock is coming from the main warehouse
*   The **Sitoo warehouse ID** is set from the shipment's `PickUpWarehouseCode` (the store where the customer picks up), not the fulfilling warehouse

### New Status

The order enters Omnium with status `New`. The key Sitoo-specific step is:

*   **`ExportOrder`** (connector: sitoo, `runAfterOrderIsSaved: true`) — exports the full order to Sitoo so it appears in the store's POS/fulfillment queue.

### ReadyForPickup Status (`isPicked: true`)

When the store has picked all items, Sitoo notifies Omnium. The Sitoo integration updates the order status to `ReadyForPickup`. The key step is:

*   **`ExportOrder`** (connector: sitoo, `OrderExportType: ReadyForPickup`) — adds a "Ready for Pickup" log entry to the Sitoo order. This is idempotent — if the order is already marked ready in Sitoo, the step succeeds without duplicating the log entry.

A notification step typically runs here to alert the customer that their order is ready.

### Completed Status (`isDeliveredStatus: true`)

After the customer picks up the order at the store and the POS completes it, Sitoo notifies Omnium. The order moves to `Completed` (or `Sent`, depending on configuration). The key step is:

*   **`ExportOrder`** (connector: sitoo, `OrderExportType: OrderDelivery`) — pushes the delivery/completion info to Sitoo and sets the Sitoo order state to `Closed`.

### OrderCanceled Status (`isCanceledStatus: true`)

If the order is canceled (by customer or store), the key Sitoo step is:

*   **`ExportOrder`** (connector: sitoo) — notifies Sitoo of the cancellation, setting the Sitoo order state to `Cancelled`.

* * *

## Configuration Reference

### ExportOrder Workflow Step

```json
{
    "name": "ExportOrder",
    "active": true,
    "runAfterOrderIsSaved": true,
    "connector": "sitoo",
    "properties": [
        {
            "key": "OrderExportType",
            "value": "OrderDelivery"
        }
    ]
}
```

| Property | Values | Description |
| --- | --- | --- |
| `connector` | `"sitoo"` | Must be set to `sitoo` to route to the Sitoo exporter |
| `runAfterOrderIsSaved` | `true` / `false` | Whether to run after the order is persisted (recommended `true` for initial export) |
| `OrderExportType` | _(not set)_, `"OrderDelivery"`, `"ReadyForPickup"` | Controls what data is sent to Sitoo. Omit for full order export. |

### Key Connector Properties for Orders

| Property | Description |
| --- | --- |
| `SitooOrderType` | Omnium order type for imported POS orders (e.g., `"PosSitoo"`) |
| `SitooBookingType` | Omnium order type for imported booking events |
| `BuyOnlineShipFromStoreEnabled` | When `true`, the order export maps the customer's delivery address onto the Sitoo order for store-fulfilled deliveries. The store's Sitoo warehouse ID is set automatically from the order's allocated warehouse. |

### Order Tags

| Tag | Effect on Sitoo export |
| --- | --- |
| `PickupSentFromMainWarehouse` | Sets `delivery-ignore-stock = "true"` in Sitoo additionaldata so the store's inventory is not decremented. Uses `PickUpWarehouseCode` for the Sitoo warehouse ID instead of the fulfilling warehouse. |

## Return Workflow — Setup

The Sitoo integration supports two modes for handling returns. Which mode is active is determined automatically by whether a specific **return status** exists in the Omnium tenant configuration.

#### Mode 1 — Credits handled manually in Omnium

**Active when:** No return status named `"CompletedInSitoo"` exists in `OrderSettings.ReturnSettings.ReturnStatuses`.

**Behavior:**

*   Refund payments from Sitoo are added directly to the original order's payment list as transactions with negative amounts.
*   The return is created with the default status — Omnium's default return workflow takes over.
*   Credit is assumed to already be handled by Sitoo.

#### Mode 2 — Credits handled through the return workflow

**Active when:** A return status named `"CompletedInSitoo"` exists in `OrderSettings.ReturnSettings.ReturnStatuses`.

**Behavior:**

*   The return is created with status `"CompletedInSitoo"`, triggering Omnium's return workflow to handle crediting.
*   Handles cross-payment-method refunds (e.g., paid online with Klarna, refunded in cash at store):
    *   A credit transaction is recorded against the original payment so that available credit is calculated correctly.
    *   The workflow does not attempt to double-credit.
*   For same-payment-method returns:
    *   Whether to credit and how much is calculated based on the difference between the return line amounts and what was already refunded in Sitoo.

### Required Configuration

#### 1\. Return Status `"CompletedInSitoo"` (activates Mode 2)

In **TenantSettings → OrderSettings → ReturnSettings → ReturnStatuses**, add:

```json
{
  "name": "CompletedInSitoo",
  "workflowSteps": [] //Add any workflow steps you want to run on return completion
}
```

Without this entry, the integration falls back to Mode 1.

#### 2\. Return Types (for reason codes)

In **TenantSettings → OrderSettings → ReturnSettings → ReturnTypes**, configure entries matching the Sitoo return reason codes used at the POS. Each entry's `Id` must match the corresponding Sitoo `ReasonCodeReturn` value.
