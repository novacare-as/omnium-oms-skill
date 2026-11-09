# Order Lifecycle

Source: https://docs.omnium.no/docs/Order/order-lifecycle

> How orders flow through Omnium — from creation to completion, with returns, cancellations, and everything in between.

## The Big Picture

Every order in Omnium follows a lifecycle: it is created, processed through a series of statuses, and eventually completed, canceled, or returned. At each status transition, **workflow steps** execute automatically — reserving inventory, capturing payment, sending notifications, exporting to ERP, and more.

This page gives you the full picture of how orders move through the system. For API reference, see [Order API](order-api.md). For configuration details, see [Order Configuration](order-config.md).

### Key Concepts

| Concept | What It Means |
| --- | --- |
| **Order Type** | The kind of order (Online, ClickAndCollect, POS, etc.). Each type has its own set of statuses and workflows. |
| **Order Status** | Where the order is in its lifecycle (New, InProgress, Ship, Completed, etc.). |
| **Workflow Steps** | Automated actions that run when an order enters a status (e.g., reserve inventory, capture payment). |
| **Shipment** | A fulfillment unit within an order. One order can have multiple shipments going to different addresses or from different warehouses. |
| **Order Form** | The container within an order that holds line items, shipments, payments, and discounts. Visible as `orderForm` in the API response. |

* * *

## Order Types

Order types define the kind of transaction. Each type has its own status flow and workflow configuration.

| Order Type | Description | Typical Use |
| --- | --- | --- |
| **Online** | Standard e-commerce order | B2C/B2B web shop |
| **ClickAndCollect** | Reserved online, picked up in store (not prepaid) | ROPIS flow |
| **Bopis** | Buy online, pick up in store (prepaid) | BOPIS flow |
| **ShipFromStore** | Fulfilled from a physical store instead of a warehouse | Distributed fulfillment |
| **Pos** | Point-of-sale transaction | In-store purchases |
| **PreOrder** | Order for products not yet available | Pre-release, backorder |
| **Replacement** | Replacement order created from a return | Exchanges |
| **ReturnOrder** | Return of goods | Returns processing |
| **Subscription** | Recurring order | Subscription commerce |

Each order type is configured independently in **Configuration > Order Types** in the Omnium GUI. You can create custom order types, copy existing ones as templates, and configure completely different workflows for each.

* * *

## Lifecycle Stages

An order moves through these stages, regardless of order type. Not every order passes through every stage — a POS order may skip allocation entirely, while an online order goes through the full flow.

### Stage 1: Creation

An order is created either from a **cart** (checkout flow) or directly via the API.

```
Cart → CreateOrderFromCart → Order (Status: New)
```

Or directly:

```
POST /api/orders → Order (Status: New)
```

When an order is created, the system:

*   Assigns an order number (auto-generated or explicit)
*   Sets the initial status to **New** (or the first status in the order type)
*   Triggers all workflow steps configured for that status

### Stage 2: Validation and Enrichment

Workflow steps at the **New** status typically handle:

*   **Enrichment** — Populating order data from product catalog (prices, names, images, tax rates)
*   **Validation** — Checking for fraud, verifying inventory, validating serial numbers
*   **Customer** — Creating or linking the customer record
*   **Tagging** — Adding tags based on order properties (payment type, category, etc.)
*   **External IDs** — Generating or setting external reference numbers

### Stage 3: Allocation

The system decides **which warehouse** fulfills each item:

*   **AllocateToWarehouse** — Assigns items to a specific warehouse
*   **SetWarehouseBasedOnZip** — Picks the closest warehouse by postal code
*   **TryReallocateEntireOrder** — Moves items if the assigned warehouse is out of stock
*   **SplitAllLineItems** — Splits the order into multiple shipments when items come from different warehouses

After allocation, inventory is typically reserved:

*   **IncreaseReservedInventory** — Marks stock as reserved so it's not oversold

### Stage 4: Payment

Payment handling depends on the payment provider and business rules:

*   **AuthorizePayment** — Authorizes the payment (holds funds)
*   **VerifyOrderPaymentMethod** — Confirms the payment method is valid
*   **SetAuthorizationExpires** — Sets a deadline for payment capture
*   **CheckAndUpdateCouponUsage** — Tracks coupon/voucher usage

Payment **authorization** happens early in the flow (to hold funds), but **capture** typically happens later — at shipment or delivery. This is configured per status via workflow steps.

### Stage 5: Fulfillment

The order moves through packing and preparation:

| Status | What Happens |
| --- | --- |
| **InProgress** | Order is being processed by warehouse staff |
| **PackingInProcess** | Items are being picked and packed |
| **PackedAndReady** | All items packed, ready for carrier pickup |
| **ReadyForShipment** | Shipping label printed, awaiting dispatch |

Workflow steps at these stages typically:

*   Print shipping labels (**PrintShippingLabel**)
*   Create shipment bookings with carriers (**CompleteShipment**)
*   Validate tracking numbers (**ValidateTrackingNumber**)
*   Export to ERP (**ExportOrder**)

### Stage 6: Shipment and Payment Capture

When the order ships:

| Status | What Happens |
| --- | --- |
| **Ship** | Order has been shipped |
| **InTransit** | Carrier has the package |
| **PartiallyShipped** | Some shipments sent, others pending |

Workflow steps at shipment typically:

*   **CapturePayments** — Captures the authorized payment (charges the customer)
*   **ReduceInventory** — Decrements physical stock levels
*   **UpdateShipmentStatus** — Syncs shipment status with carrier
*   **Notification** — Sends shipping confirmation to customer
*   **ExportOrder** — Sends shipment data to ERP

### Stage 7: Completion

| Status | What Happens |
| --- | --- |
| **Completed** | Order delivered to customer |
| **PickedUp** | Customer picked up the order (Click and Collect) |

Workflow steps:

*   **SetCompletedDate** — Records the completion timestamp
*   **AnalyticsIndexing** — Updates analytics data
*   **Customer Club Points** — Awards loyalty points (if customer club is configured)

### Stage 8: Returns (Optional)

If the customer returns items, a return order is created:

```
Order (Completed) → Create Return → Return Order (with return workflow)
```

Return workflows handle:

*   **EnsureRma** — Generates a return merchandise authorization number
*   **CreditReturn** — Processes the refund
*   **UpdateInventory** — Returns items to stock
*   **CreateCreditNote** — Generates a credit note
*   **Notification** — Sends return confirmation

See [Returns](Returns/return-api.md) for the complete returns documentation.

* * *

## Common Order Flows

### Online Order — Happy Path

```
New
 │  EnrichOrderFromProducts
 │  IncreaseReservedInventory
 │  AuthorizePayment
 │  GetOrCreateCustomerFromOrder
 │  Notification (order confirmation)
 ▼
InProgress
 │  AllocateToWarehouse
 │  ExportOrder (to ERP)
 ▼
PackedAndReady
 │  PrintShippingLabel
 │  CompleteShipment
 │  ValidateTrackingNumber
 ▼
Ship
 │  CapturePayments
 │  ReduceInventory
 │  Notification (shipping confirmation)
 │  ExportOrder (shipment update to ERP)
 ▼
Completed
    SetCompletedDate
    AnalyticsIndexing
```

### Click and Collect

```
New
 │  EnrichOrderFromProducts
 │  IncreaseReservedInventory
 │  AddClickAndCollectTags
 │  Notification (order received)
 ▼
InProgress
 │  AllocateToWarehouse (store location)
 ▼
ReadyForPickup
 │  SetReadyForPickupDate
 │  Notification (ready for pickup)
 ▼
PickedUp
 │  CapturePayments
 │  ReduceInventory
 │  SetCompletedDate
 ▼
Completed
```

If the customer doesn't collect the order within the configured deadline, the order automatically transitions to **NotCollected** (or the status the tenant configures for that deadline) and triggers cancellation workflows. See [Click and Collect](order-click-and-collect.md) for details.

### Split Shipment

When items ship from different warehouses, the order is split into multiple shipments:

```
New → InProgress
 │
 │  TryReallocateEntireOrder
 │  SplitAllLineItems (creates Shipment A + Shipment B)
 │
 ├─ Shipment A (oslo-warehouse)
 │   Ship → InTransit → Completed
 │
 └─ Shipment B (bergen-warehouse)
     Ship → InTransit → Completed
```

The main order status reflects the overall state:

*   **PartiallyShipped** — Some shipments sent, others pending
*   **Completed** — All shipments delivered

### Cancellation

An order can be canceled from most statuses:

```
Any Status → OrderCanceled / OrderCanceledByCustomer / OrderCanceledByStore
                │
                │  CancelPayments (releases authorization)
                │  TryReallocateOnCancel (frees reserved inventory)
                │  SetCanceledDate
                │  Notification (cancellation confirmation)
                │  ExportOrder (cancellation to ERP)
```

* * *

## Order Statuses Reference

These are the built-in statuses available in Omnium. Not all statuses need to be used — you configure which ones apply to each order type.

### Processing Statuses

| Status | Description | Typical Stage |
| --- | --- | --- |
| `New` | Just created, initial processing | Creation |
| `Draft` | Not yet submitted | Pre-creation |
| `Queued` | Waiting in queue for processing | Creation |
| `Pending` | Awaiting external action | Validation |
| `Confirmed` | Order confirmed | Validation |
| `PaymentReview` | Payment needs manual review | Payment |
| `OnHold` | Temporarily paused | Any |
| `InProgress` | Being processed | Fulfillment |
| `InProgressWarehouse` | Being processed at warehouse | Fulfillment |

### Fulfillment Statuses

| Status | Description | Typical Stage |
| --- | --- | --- |
| `ReadyForShipment` | Ready to be dispatched | Fulfillment |
| `PackingInProcess` | Being picked and packed | Fulfillment |
| `PackedAndReady` | Packed, awaiting carrier | Fulfillment |
| `ReadyForPickup` | Ready for customer pickup | Fulfillment (C&C) |
| `PickingPostponed` | Picking delayed | Fulfillment |

### Shipping Statuses

| Status | Description | Typical Stage |
| --- | --- | --- |
| `Ship` | Shipped to customer | Shipment |
| `VirtualShip` | Virtually shipped (digital goods) | Shipment |
| `InTransit` | In transit with carrier | Shipment |
| `PartiallyShipped` | Some shipments sent | Shipment |
| `ShippedFromWarehouse` | Left the warehouse | Shipment |
| `SplittedShippedShipment` | Part of a split shipment | Shipment |

### Completion Statuses

| Status | Description | Typical Stage |
| --- | --- | --- |
| `Completed` | Delivered to customer | Completion |
| `PickedUp` | Picked up by customer | Completion (C&C) |
| `PickedUpAndPaid` | Picked up and paid (pay-at-pickup) | Completion (C&C) |
| `Closed` | Order closed | Completion |

### Cancellation Statuses

| Status | Description |
| --- | --- |
| `OrderCanceled` | Canceled (general) |
| `OrderCanceledByCustomer` | Canceled by the customer |
| `OrderCanceledByStore` | Canceled by the store/staff |
| `Expired` | Order expired (e.g., unpaid Click and Collect) |
| `NotCollected` | Customer did not collect |
| `Deleted` | Order deleted |

### Return Statuses

| Status | Description |
| --- | --- |
| `Returned` | Fully returned |
| `PartiallyReturned` | Some items returned |

### Other

| Status | Description |
| --- | --- |
| `Faulted` | Error during processing |
| `Delayed` | Order delayed |
| `PartiallyDelivered` | Some items delivered |

* * *

## Shipment Statuses

Each shipment within an order has its own status, independent of the order status:

| Shipment Status | Description |
| --- | --- |
| `AwaitingInventory` | Waiting for stock to become available |
| `OnHold` | Shipment paused |
| `Packing` | Being packed |
| `Released` | Released for shipping |
| `Shipped` | Shipped to customer |
| `Cancelled` | Shipment canceled |
| `SplittedShippedShipment` | Part of a split order |
| `PickingPostponed` | Picking delayed |

Order statuses can be configured to automatically sync with shipment statuses. For example, when an order moves to "Ship", all its shipments can automatically update to "Shipped".

* * *

## How Workflows Work

When an order transitions to a new status, the system executes all **workflow steps** configured for that status. Steps run sequentially, and each step can modify the order, call external systems, or trigger further status changes.

### Workflow Step Properties

| Property | Description |
| --- | --- |
| **Name** | The action to execute (e.g., `CapturePayments`, `ExportOrder`) |
| **Active** | Enable or disable the step |
| **Connector** | Which integration connector to use (e.g., `"Klarna"`, `"Bring"`) |
| **StopOnError** | If true, stops remaining steps when this step fails |
| **RunAfterOrderIsSaved** | If true, runs asynchronously after the order is persisted |
| **IsInvisible** | If true, hides the step result from the UI |

### Scope Filters

Each step can be restricted to run only for specific contexts:

| Filter | Example Use |
| --- | --- |
| **EnabledForMarkets** / **DisabledForMarkets** | Only capture payment for Norwegian orders |
| **EnabledForStores** / **DisabledForStores** | Only export to ERP for online store |
| **EnabledForWarehouses** / **DisabledForWarehouses** | Only print labels for central warehouse |
| **EnabledForShipmentOptions** / **DisabledForShipmentOptions** | Different steps for express vs standard shipping |
| **EnabledForTags** / **DisabledForTags** | Skip payment capture for zero-amount orders |

### Conditions

Steps can have conditions based on previous step results:

| Condition | Step Runs When |
| --- | --- |
| **Success** | All previous steps succeeded |
| **Error** | A previous step had an error |
| **Warning** | A previous step had a warning |

This lets you build error-handling flows: for example, send an alert notification only when the ERP export step fails.

### Synchronous vs. Asynchronous

*   **RunAfterOrderIsSaved = false** (default): Step runs immediately during the status transition. The API call doesn't return until all synchronous steps complete.
*   **RunAfterOrderIsSaved = true**: Step runs in the background after the order is saved. Use this for operations that don't need to block the response — like ERP exports, analytics indexing, or heavy integrations.

### Workflow Groups

Multiple steps can be bundled into **reusable groups**. A group is referenced by a single workflow step using the `GroupId` property. All steps in the group execute sequentially, and the group's `StopOnError` flag controls whether a failure aborts the remaining group steps.

Groups are useful when the same set of steps (e.g., "ERP export + notification + analytics") is used across multiple statuses or order types.

For the full list of available workflow steps, see [Workflow Steps Reference](workflow-steps.md).

* * *

## Configuring Your Own Workflow

### Prerequisites

Before orders can flow through the system, you need:

1.  **Markets and Stores** configured ([Markets](../Markets.md), [Stores](../Stores.md))
2.  **Products** with inventory ([Product](../Product.md), [Inventory](../Inventory.md))
3.  **Payment provider** set up ([Payments](../plugins/Payments.md))
4.  **Shipping provider** set up ([Shipments](../plugins/Shipments.md))

### Setting Up an Order Type

1.  Navigate to **Configuration > Order Types** in the Omnium GUI
2.  Create a new order type or copy an existing one as a template
3.  Define the **statuses** your orders will use (you don't need all 30+ statuses — most workflows use 4–8)
4.  For each status, add **workflow steps** that should execute
5.  Set the **Order** value on each status to define the sequence (lower numbers run first)

### Workflow Chart

The **Workflow Chart** in the GUI provides a visual editor:

*   Statuses appear as **columns** ordered by their `Order` value
*   Workflow steps appear as **boxes** within each status column
*   **Connections** between steps and statuses show the transition flow
*   Right-click a status to edit its properties
*   Click "Edit Workflow Steps" to add, remove, or reorder steps

### Tips

*   **Start simple**: Begin with 4–5 statuses (New, InProgress, Ship, Completed, Canceled) and add more as needed
*   **Test with dry-run**: Use the workflow test mode to validate your configuration before going live
*   **Use tags for branching**: Rather than creating many order types, use order tags with `EnabledForTags`/`DisabledForTags` on workflow steps to handle variations within a single order type
*   **Mind the order**: Steps run top-to-bottom. Put validation before enrichment, enrichment before allocation, and allocation before payment
*   **Use RunAfterOrderIsSaved** for non-critical steps like analytics, notifications, and ERP exports to keep the checkout fast

* * *

## Where to Go Next

| Question | Documentation |
| --- | --- |
| How do I create orders via API? | [Order API](order-api.md) |
| How do I configure order types and statuses? | [Order Configuration](order-config.md) |
| What workflow steps are available? | [Workflow Steps Reference](workflow-steps.md) |
| How do I set up Click and Collect? | [Click and Collect](order-click-and-collect.md) |
| How do returns work? | [Returns](Returns/return-api.md) |
| How does the workflow system work? | [Workflow Architecture](workflow-steps.md) |
| Common questions? | [Order FAQ](order-faq.md) |
