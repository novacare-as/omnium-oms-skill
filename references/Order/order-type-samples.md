# Sample Order Types

Source: https://docs.omnium.no/docs/Order/order-type-samples

> Sample order type configurations for click and collect, an online order with home delivery or pickup in store from a warehouse or a store, and endless aisle sales.

These samples show how to set up order types for three common omnichannel flows. An order type defines the statuses an order moves through and the workflow steps (order actions) that run in each status.

*   **Click and collect**: the customer reserves online and collects in a store that has the goods on its shelf. Also known as reserve online, pick up in store (ROPIS), or buy online, pick up in store (BOPIS) when the order is prepaid.
*   **Online order with delivery and pickup**: one order type for home delivery and pickup in store. It covers orders fulfilled from a central warehouse or from a store (ship from store), and goods shipped from the warehouse to a store for the customer to collect there (ship to store).
*   **Endless aisle**: a sale taken in a store for goods the store does not have, fulfilled from another warehouse or store.

Each sample is a starting point. Adjust workflow steps and payment handling to your own setup, and add the export, ERP and analytics steps you use. For the field reference of order types, statuses and workflow steps, see [Order configuration](order-config.md#order-types). You edit order types in **Configuration → Order types**.

## Building blocks used in the samples

### Delivery or pickup comes from the shipment option

Each shipment names a shipment option in `shippingMethodName`. The option's `ShipmentDeliveryType` is `Delivery` for home delivery or `PickUp` for pickup points and in-store pickup. Omnium uses it to choose the statuses a shipment can move to and to decide whether the shipment gets a store as its address. See [shipment options](../Markets/markets-config.md#shipment-options).

### Branch statuses with a condition

Give two statuses the same `Order` and set `Condition` to `Delivery` on one and `PickUp` on the other. A shipment is offered the status whose condition matches the delivery type of its shipment option. A status without a condition applies to both. The samples use this to send delivery shipments to `Ship` and pickup shipments to `ReadyForPickup`.

A status with `Order` set to `0` is outside the forward sequence. Omnium never offers it as the next status, and an order status derived from shipments skips it unless every shipment is in a cancellation status. The samples put their cancellation statuses there.

### Skipped statuses still run

When a status change jumps over one or more `Order` values, for example from `New` (1) straight to `ReadyForPickup` (3), Omnium also runs the workflow steps of the statuses in between. For each skipped `Order` it uses the status whose condition matches the shipment option of the shipment being updated, or of the order's first shipment when you update the whole order. Every status on a branch therefore runs for every shipment of that delivery type. Do not add a status to a branch that only some of its shipments should pass through.

The jump is counted from the order's current status, also when you update a single shipment. With `DeriveOrderStatusFromShipments` on an order split across several shipments, that is the status of the least advanced shipment, so a shipment can run a status it has already passed. For example, when a pickup shipment moves from `ReadyForPickup` to `PickedUp` while another shipment on the order is still `InProgress`, `ReadyForPickup` runs again for the pickup shipment. Stock is not reduced twice, but the customer pickup deadline is calculated again and the ready-for-pickup notification can be sent again.

### Pick lists move shipments by status flags

When a pick list is completed, Omnium moves each shipment on it to the status flagged `IsPicked` that matches the shipment's delivery type. Flag one status in each branch: `Ship` for delivery and `ReadyForPickup` for pickup.

### Stock is reduced for released shipments

[Reduce Inventory and Reserved Inventory](workflow-steps/inventory/reduce-inventory-and-reserved-inventory.md) only reduces stock for shipments whose shipment status is `Released`. It reduces stock at the warehouse the shipment is on when the step runs, and it reduces each shipment line once. In every status that reduces stock, the samples set `ShipmentStatusUpdate` to `Released` and run [Update Shipment Status](workflow-steps/shipments/update-shipment-status.md) first, which applies it to the shipment.

### Each shipment can follow its own status

Every shipment has its own `orderStatus`. When you update the status of one shipment, for example with [`POST /api/Orders/{orderId}/UpdateStatus`](api-reference/workflow.md#update-shipment-status) and `shipmentInfo.shipmentId`, the workflow of that status runs for that shipment only. Set `DeriveOrderStatusFromShipments` on the order type to let the order status follow the least advanced shipment.

### Sender and pickup store on the shipment

`warehouseCode` is the store or warehouse that sends the shipment. `pickUpWarehouseCode` is the store where the customer collects, and is only needed when it differs from the sender. Both are store IDs in Omnium.

* * *

## Click and collect

The store has the goods on its shelf. The customer reserves online, the store picks the order, and the customer pays and collects in the store.

Name the order type `ClickAndCollect`. The [Cancel Expired Click and Collect](../configuration/scheduled-tasks/orders/cancel-expired-click-collect.md) scheduled task only processes orders of this order type, and the [Add Click and Collect Tags](workflow-steps/enrichment/add-click-and-collect-tags.md) step only tags orders of this order type.

### Statuses for click and collect

| Order | Status | Flags | What happens |
| --- | --- | --- | --- |
| 1 | `New` | `IsMainFilter` | Customer created or linked, store address set on the shipment, stock reserved in the store, order confirmation sent |
| 2 | `InProgress` | `IsMainFilter`, `IsInProgressStatus` | The store picks the order |
| 3 | `ReadyForPickup` | `IsMainFilter`, `IsPicked` | Customer pickup deadline set, customer notified |
| 4 | `PickedUp` | `IsMainFilter`, `IsDeliveredStatus` | Stock and reservation reduced, completed date set |
| 0 | `NotCollected` | `IsCanceledStatus` | Reservation released, customer notified |
| 0 | `Expired` | `IsCanceledStatus` | Reservation released, customer notified |
| 0 | `OrderCanceled` | `IsCanceledStatus` | Reservation released, customer notified |

Keep the status names `New`, `InProgress` and `ReadyForPickup`. The cancel task looks for orders in `New` and `InProgress` when the store pick deadline passes and in `ReadyForPickup` when the customer pickup deadline passes, and a pick list only moves orders and shipments that are in `New` to the in-progress status. `NotCollected` and `Expired` are the statuses the cancel task sets by default. They must exist on the order type. See [Click and Collect](order-click-and-collect.md) for the deadline settings.

### Click and collect configuration

```json
{
  "Name": "ClickAndCollect",
  "EnableEdit": true,
  "EnableCreateFromCart": true,
  "OrderStatuses": [
    {
      "Name": "New",
      "Order": 1,
      "IsMainFilter": true,
      "WorkflowSteps": [
        { "Name": "GetOrCreateCustomerFromOrder", "Active": true },
        { "Name": "AddClickAndCollectTags", "Active": true },
        { "Name": "SetStoreAddressForPickupShipment", "Active": true },
        { "Name": "IncreaseReservedInventory", "Active": true },
        { "Name": "Notification", "Active": true }
      ]
    },
    {
      "Name": "InProgress",
      "Order": 2,
      "IsMainFilter": true,
      "IsInProgressStatus": true,
      "WorkflowSteps": []
    },
    {
      "Name": "ReadyForPickup",
      "Order": 3,
      "IsMainFilter": true,
      "IsPicked": true,
      "WorkflowSteps": [
        { "Name": "SetShipmentOrOrderReadyForPickup", "Active": true },
        { "Name": "Notification", "Active": true }
      ]
    },
    {
      "Name": "PickedUp",
      "Order": 4,
      "IsMainFilter": true,
      "IsDeliveredStatus": true,
      "ShipmentStatusUpdate": "Released",
      "WorkflowSteps": [
        { "Name": "UpdateShipmentStatus", "Active": true },
        { "Name": "ReduceInventoryAndReservedInventory", "Active": true },
        { "Name": "SetCompletedDate", "Active": true }
      ]
    },
    {
      "Name": "NotCollected",
      "Order": 0,
      "IsCanceledStatus": true,
      "WorkflowSteps": [
        { "Name": "ReduceReservedInventory", "Active": true },
        { "Name": "SetCanceledDate", "Active": true },
        { "Name": "Notification", "Active": true }
      ]
    },
    {
      "Name": "Expired",
      "Order": 0,
      "IsCanceledStatus": true,
      "WorkflowSteps": [
        { "Name": "ReduceReservedInventory", "Active": true },
        { "Name": "SetCanceledDate", "Active": true },
        { "Name": "Notification", "Active": true }
      ]
    },
    {
      "Name": "OrderCanceled",
      "Order": 0,
      "IsCanceledStatus": true,
      "WorkflowSteps": [
        { "Name": "ReduceReservedInventory", "Active": true },
        { "Name": "SetCanceledDate", "Active": true },
        { "Name": "Notification", "Active": true }
      ]
    }
  ]
}
```

What the steps do in this flow:

*   `SetStoreAddressForPickupShipment` replaces the delivery address of every pickup shipment with the store's address and keeps the recipient's name. It reads the store from `pickUpWarehouseCode`, then `warehouseCode`, then the order's `storeId`.
*   `IncreaseReservedInventory` reserves stock at the warehouse the shipment is on, here the store. See [Increase Reserved Inventory](workflow-steps/inventory/increase-reserved-inventory.md).
*   [Set Shipment or Order Ready for Pickup](workflow-steps/inventory/set-shipment-or-order-ready-for-pickup.md) sets the customer pickup deadline that the cancel task acts on.

### Prepaid click and collect

When the customer pays online, add payment steps:

*   [Authorize Payment](workflow-steps/payment/authorize-payment.md) on `New`, with `StopOnError` set to `true` so a failed authorization stops the rest of the status.
*   [Capture Payments](workflow-steps/payment/capture-payments.md) on `PickedUp`, after `UpdateShipmentStatus`.
*   [Cancel Payments](workflow-steps/payment/cancel-payments.md) on each cancellation status.

### What the channel sends for click and collect

The order needs `orderType` `ClickAndCollect`, and its `storeId` must be the store where the customer collects: Omnium calculates both the store pick deadline and the customer pickup deadline from the click and collect settings and opening hours of the order's store. Add a shipment that names a `PickUp` shipment option and the store as the sender. See the [cart API](../Carts/cart-api.md#step-3-checkout).

```json
[
  {
    "shipmentId": "1",
    "shippingMethodName": "ClickAndCollect",
    "warehouseCode": "STORE-OSLO-01"
  }
]
```

* * *

## Online order with delivery and pickup

One order type handles every way an online order is fulfilled. The allocation step decides where each shipment ships from, and the shipment option decides whether it goes to the customer's address or to a store.

| Fulfillment | `warehouseCode` | `pickUpWarehouseCode` | Shipment option | Path through the statuses |
| --- | --- | --- | --- | --- |
| Ship from warehouse | Central warehouse | Empty | `Delivery` | `New` → `InProgress` → `Ship` |
| Ship from store | Store | Empty | `Delivery` | `New` → `InProgress` → `Ship` |
| Pickup in store, from the store's shelf | Pickup store | Empty | `PickUp` | `New` → `InProgress` → `ReadyForPickup` → `PickedUp` |
| Ship to store | Central warehouse | Pickup store | `PickUp` | `New` → `InProgress` → `ReadyForPickup` → `PickedUp` |

`DeriveOrderStatusFromShipments` is enabled, so an order split across several shipments shows the status of its least advanced shipment.

### Statuses for delivery and pickup

| Order | Status | Condition | Flags | What happens |
| --- | --- | --- | --- | --- |
| 1 | `New` |  | `IsMainFilter` | Payment authorized, shipments allocated, pickup addresses set, stock reserved, order confirmation sent |
| 2 | `InProgress` |  | `IsMainFilter`, `IsInProgressStatus` | The warehouse or store picks the shipment. A shipment on its way to a pickup store stays here until it arrives. |
| 3 | `Ship` | `Delivery` | `IsMainFilter`, `IsPicked`, `IsDeliveredStatus` | Payment captured, stock reduced, carrier booked, customer notified |
| 3 | `ReadyForPickup` | `PickUp` | `IsMainFilter`, `IsPicked` | Stock reduced at the sending warehouse, shipment moved to the pickup store, customer notified |
| 4 | `PickedUp` | `PickUp` | `IsMainFilter`, `IsDeliveredStatus` | Payment captured, completed date set |
| 0 | `OrderCanceled` |  | `IsCanceledStatus` | Reservation released, payment cancelled, customer notified |

### Delivery and pickup configuration

```json
{
  "Name": "Online",
  "EnableEdit": true,
  "EnableCreateFromCart": true,
  "DefaultOrderType": true,
  "DeriveOrderStatusFromShipments": true,
  "OrderStatuses": [
    {
      "Name": "New",
      "Order": 1,
      "IsMainFilter": true,
      "WorkflowSteps": [
        { "Name": "GetOrCreateCustomerFromOrder", "Active": true },
        { "Name": "AuthorizePayment", "Active": true, "StopOnError": true },
        { "Name": "AllocateWithRules", "Active": true },
        { "Name": "SetStoreAddressForPickupShipment", "Active": true },
        { "Name": "IncreaseReservedInventory", "Active": true },
        { "Name": "Notification", "Active": true }
      ]
    },
    {
      "Name": "InProgress",
      "Order": 2,
      "IsMainFilter": true,
      "IsInProgressStatus": true,
      "WorkflowSteps": []
    },
    {
      "Name": "Ship",
      "Order": 3,
      "Condition": "Delivery",
      "IsMainFilter": true,
      "IsPicked": true,
      "IsDeliveredStatus": true,
      "ShipmentStatusUpdate": "Released",
      "WorkflowSteps": [
        { "Name": "UpdateShipmentStatus", "Active": true },
        { "Name": "CapturePayments", "Active": true },
        { "Name": "ReduceInventoryAndReservedInventory", "Active": true },
        { "Name": "CompleteShipment", "Active": true },
        { "Name": "SetCompletedDate", "Active": true },
        { "Name": "Notification", "Active": true }
      ]
    },
    {
      "Name": "ReadyForPickup",
      "Order": 3,
      "Condition": "PickUp",
      "IsMainFilter": true,
      "IsPicked": true,
      "ShipmentStatusUpdate": "Released",
      "WorkflowSteps": [
        { "Name": "UpdateShipmentStatus", "Active": true },
        { "Name": "ReduceInventoryAndReservedInventory", "Active": true },
        { "Name": "SetShipmentOrOrderReadyForPickup", "Active": true },
        { "Name": "Notification", "Active": true }
      ]
    },
    {
      "Name": "PickedUp",
      "Order": 4,
      "Condition": "PickUp",
      "IsMainFilter": true,
      "IsDeliveredStatus": true,
      "WorkflowSteps": [
        { "Name": "CapturePayments", "Active": true },
        { "Name": "SetCompletedDate", "Active": true }
      ]
    },
    {
      "Name": "OrderCanceled",
      "Order": 0,
      "IsCanceledStatus": true,
      "WorkflowSteps": [
        { "Name": "ReduceReservedInventory", "Active": true },
        { "Name": "CancelPayments", "Active": true },
        { "Name": "CreditCancelledOrderLines", "Active": true },
        { "Name": "SetCanceledDate", "Active": true },
        { "Name": "Notification", "Active": true }
      ]
    }
  ]
}
```

### How allocation chooses the sender

`AllocateWithRules` runs the allocation engine with the tenant's allocation settings, profiles and rules, and moves or splits shipments to the warehouses in the chosen plan. The allocation engine must be enabled for the tenant. When it is not, the step returns a warning and leaves the shipments where they are.

A channel can therefore send a pickup order with the pickup store as `warehouseCode`. When allocation moves a pickup shipment to another warehouse, Omnium keeps the store as the shipment's `pickUpWarehouseCode`, so the shipment still knows where the customer collects. When only some lines move, the new shipment carries the pickup store and the lines left behind are still collected where they are.

`SetStoreAddressForPickupShipment` runs after allocation, so a shipment sent to a pickup store gets the pickup store's address and not the warehouse's.

You can use the legacy allocation steps instead, such as [Allocate to Warehouse](workflow-steps/allocation/allocate-to-warehouse.md) or [Try Reallocate Entire Order](workflow-steps/allocation/try-reallocate-entire-order.md). See [allocation steps](workflow-steps/allocation.md).

### Shipping to a pickup store

1.  The central warehouse picks the shipment and sends it to the pickup store. The shipment stays in `InProgress` while it is on its way. Book the transport in your warehouse or transport system.
2.  When the parcel arrives, the store sets the shipment to `ReadyForPickup`. The steps run in this order:
    *   `UpdateShipmentStatus` releases the shipment.
    *   `ReduceInventoryAndReservedInventory` reduces stock and reservation at the central warehouse, which the shipment is still on.
    *   [Set Shipment or Order Ready for Pickup](workflow-steps/inventory/set-shipment-or-order-ready-for-pickup.md) moves the shipment's `warehouseCode` to the pickup store, clears `pickUpWarehouseCode`, marks the lines as reserved and sets the customer pickup deadline. It does not change stock at the warehouse or at the store. The pickup store must be set up as a warehouse (`IsWarehouse`). Otherwise the shipment stays on the central warehouse and only `pickUpWarehouseCode` is cleared.
3.  The customer collects, and the store sets the shipment to `PickedUp`.

A shipment picked from the store's own shelf takes the same path, and its stock is reduced at the store when it becomes `ReadyForPickup`. Stock is reduced in `ReadyForPickup` only, before the shipment moves to the pickup store, so goods shipped to a store never touch the store's stock: they pass through the store as a customer parcel.

Do not let the central warehouse finish pickup shipments with an Omnium pick list. A completed pick list moves a pickup shipment to `ReadyForPickup`, which tells the customer the order is ready while it is still at the central warehouse. Set the shipment to `ReadyForPickup` when it arrives in the store, with a shipment-level update such as the [update shipment status](api-reference/workflow.md#update-shipment-status) endpoint with `shipmentInfo.shipmentId`.

There is no separate in-transit status in this sample. A status between `InProgress` and `ReadyForPickup` on the pickup branch would also run for pickups from the store's shelf, because Omnium runs the statuses a change skips over.

### Limits of pickup in the Online order type

The customer pickup deadline is calculated from the click and collect settings and opening hours of the order's store (`storeId`), not of the pickup store. Automatic cancellation of orders that are not collected only applies to orders of the `ClickAndCollect` order type. Use that order type when you need these deadlines enforced.

### What the channel sends for delivery and pickup

Home delivery, shipped from the central warehouse:

```json
[
  {
    "shipmentId": "1",
    "shippingMethodName": "Bring_SERVICEPAKKE",
    "warehouseCode": "CENTRAL-WH-OSLO"
  }
]
```

Pickup in store, from the store's shelf:

```json
[
  {
    "shipmentId": "1",
    "shippingMethodName": "ClickAndCollect",
    "warehouseCode": "STORE-OSLO-01"
  }
]
```

Pickup in store, shipped from the central warehouse:

```json
[
  {
    "shipmentId": "1",
    "shippingMethodName": "ClickAndCollect",
    "warehouseCode": "CENTRAL-WH-OSLO",
    "pickUpWarehouseCode": "STORE-OSLO-01"
  }
]
```

* * *

## Endless aisle

A customer in the store wants goods the store does not have. Staff take the sale at the till, and the goods are sent from a central warehouse or another store, either to the customer's address or to the store for pickup.

Give the order type the POS sends to Omnium the same fulfillment statuses as the [Online order](order-type-samples.md#statuses-for-delivery-and-pickup): `New`, `InProgress`, `Ship` and `ReadyForPickup`, and `PickedUp`. Push the endless aisle sale with the POS order type and `status` set to `New`, so the fulfillment workflow starts. A sale completed at the counter is pushed straight to its final status, so only the steps of that status run. See [POS integration](../GettingStartedWithAPI/Tutorials/pos-integration.md).

Differences from the Online order type:

*   The sale is paid at the till with a payment of `transactionType` `Sale`, which has no separate authorization and capture. Leave out `AuthorizePayment` and `CapturePayments`.
*   `storeId` on the order is the store that made the sale. When the customer collects there, send that store as `pickUpWarehouseCode` on the endless aisle shipment.

### Endless aisle shipment

The endless aisle part of the sale, collected in the selling store and shipped from the central warehouse:

```json
{
  "shipmentId": "2",
  "shippingMethodName": "ClickAndCollect",
  "warehouseCode": "CENTRAL-WH-OSLO",
  "pickUpWarehouseCode": "STORE-OSLO-01",
  "orderStatus": "New"
}
```

### Counter goods and endless aisle goods on one order

When one order carries both the goods handed over at the counter and the endless aisle goods, put them on separate shipments, each with its own `orderStatus`. Set the counter shipment to the final delivered status, set `deliveredQuantity` on its lines, and enable `DeriveOrderStatusFromShipments` so the order status follows the endless aisle shipment until it is completed.

Steps that run for the order as a whole, such as the `New` steps when the order is created, see every shipment on it. `IncreaseReservedInventory` skips a shipment whose lines are all delivered, but `AllocateWithRules` includes the counter shipment's lines too. Leave allocation out of the steps that run for the whole order, or push the endless aisle goods as their own order.

* * *

## Related documentation

*   [Order configuration](order-config.md): order type, status and workflow step fields
*   [Order lifecycle](order-lifecycle.md): how statuses and workflows fit together
*   [Click and Collect](order-click-and-collect.md): deadlines, automatic cancellation and the click and collect views
*   [Workflow API](api-reference/workflow.md): update order and shipment statuses
