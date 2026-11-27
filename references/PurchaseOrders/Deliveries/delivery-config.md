# Configuration

Source: https://docs.omnium.no/docs/PurchaseOrders/Deliveries/delivery-config

> Configure delivery settings in Omnium — delivery numbering, goods reception behavior, shipment status updates, automatic status calculation, and delivery exports.

## Delivery settings overview

Delivery configuration is spread across two areas in Omnium:

*   **Delivery-specific settings** — Delivery numbering, status management, and export connectors (documented on this page)
*   **Purchase order settings** — Goods reception behavior, internal transfers, and ETA propagation (documented under [Purchase Order Configuration](../purchase-order-config.md#delivery-settings))

Most delivery-related settings are configured through **Configuration > Settings > Products > Purchase Order Settings** in the Omnium UI.

* * *

## Delivery numbering

Delivery IDs are generated automatically using the **Number Options** system. The number type used for deliveries is `DeliveryNumberOptions`.

When a delivery is created without an explicit ID, Omnium looks up the number options configuration:

1.  Check the selected market for a `DeliveryNumberOptions` entry
2.  If not found, check the generic number options
3.  If no configuration exists, fall back to a sequential number starting at 1

### Default behavior

If no `DeliveryNumberOptions` is configured, deliveries use the following defaults:

| Property | Default value |
| --- | --- |
| Key | `DeliveryNumber` |
| StartSequence | `1` |
| Prefix | (empty) |
| Service | `SequentialNumberService` |

### Configuration

Delivery numbering is configured as a number option entry on the market or in the generic number options. See [Number Options](../../configuration/numberoptions.md) for the full configuration model.

### Sample

```json
{
  "NumberType": "DeliveryNumberOptions",
  "Key": "DeliveryNumber",
  "StartSequence": 10000,
  "Prefix": "DEL-",
  "Service": "SequentialNumberService",
  "IsReadOnly": true
}
```

This produces delivery IDs like `DEL-10000`, `DEL-10001`, `DEL-10002`, etc.

* * *

## Goods reception settings

These settings control what happens after goods reception is processed. They are part of `PurchaseOrderSettings` and configured through **Configuration > Settings > Products > Purchase Order Settings** in the Omnium UI.

### Purchase order completion

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| `GoodsReceptionCompletedStatus` | `string` | `null` | The purchase order status to set when all line items have been fully received or canceled. If not configured, the purchase order status is not changed automatically on completion. The value must match a configured [purchase order status](../purchase-order-config.md#purchase-order-statuses) name. |

When configured, the purchase order workflow is executed for the new status, running any configured workflow steps (e.g., ATP recalculation, export).

### Shipment order status update

After goods reception, Omnium can automatically update the shipment-level order status for customer orders that were waiting for the received goods. This is useful for triggering downstream workflows (e.g., moving orders to a "Ready to ship" status).

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| `GoodsReceptionShipmentOrderStatusUpdate` | `string` | `null` | The order status to set on shipments whose reserved order lines were fulfilled by the goods reception. Leave empty to disable. |
| `GoodsReceptionRunShipmentWorkflow` | `bool` | `true` | Whether to run the order workflow after updating the shipment order status. Only applies if `GoodsReceptionShipmentOrderStatusUpdate` is configured. |

The shipment status update runs as a background task after the main goods reception processing completes. It only affects shipments that have order lines with an active purchase order reservation (`IsAwaitingPurchaseOrder`) matching the received purchase order lines.

When `GoodsReceptionRunShipmentWorkflow` is enabled (the default), setting the shipment order status also triggers the order type's workflow for that status. This allows you to chain actions — for example, automatically sending a "ready for pickup" notification when goods arrive.

When disabled, only the status value is updated without running the workflow. This is useful if you want to update the status for visibility but handle further actions separately.

### Sample

```
"PurchaseOrderSettings": {
  "GoodsReceptionCompletedStatus": "Completed",
  "GoodsReceptionShipmentOrderStatusUpdate": "ReadyToShip",
  "GoodsReceptionRunShipmentWorkflow": true
}
```

* * *

## Despatch advice reception

These settings control how the units of a [despatch advice](despatch-advice.md) (the pallets and cartons with an SSCC label) are received. They are part of `PurchaseOrderSettings` and configured in **Configuration → Settings → Products → Purchase orders**: **Require content check** on the **Settings** tab, in the **Goods reception** card, and the reason codes on the **Deviation reasons** tab.

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| `RequireContentCheck` | `string` | `No` | Whether the content of a unit must be counted before it is received. `No`: the user chooses for each unit whether to receive it as advised or to check its content. `ExternalSuppliers`: the units of a despatch advice from a supplier must be checked; the units of an internal transfer need not. `All`: every unit must be checked. An empty value counts as `No`. |
| `ReceptionDeviationReasonCodes` | `List<object>` | empty | The reasons a user picks from in the In-Store App when a counted quantity in a unit differs from the advised one. Each code has an `Id`, which is stored with the count, and a `TranslationKey`, which gives the name that is shown. With no codes, no reason is asked for. |

A despatch advice that is sent with `IsContentCheckRequired` set is always checked, whatever `RequireContentCheck` says. A delivery counts as an internal transfer when its order type is `InternalTransfer` or it has a `SupplierWarehouseCode`.

### What the settings change in the API

*   When the content must be checked, `POST /api/Deliveries/{deliveryId}/Receive` does not receive a unit as advised: a unit without counted lines is left open with the result `ContentCheckRequired`. Counted units, units marked `Missing`, `Damaged` or `Refused`, and the content of a unit received with `ProcessGoodsReception` are taken as always. See [Receive units](sscc-reception.md#receive-units).
*   A reason code in a reception request is stored on the content row as it is sent. It is not checked against `ReceptionDeviationReasonCodes`, so a code your ERP sends does not need to be in the list.
*   Saving the settings is refused when a reason code has no ID, when two codes have the same ID in any case, or when `RequireContentCheck` has another value than `No`, `ExternalSuppliers` or `All`, written exactly so. An empty value is accepted.

On the **Deviation reasons** tab, **Add suggested codes** adds five codes while the list is empty: `Short`, `Over`, `Damaged`, `WrongItem` and `Other`, with the text keys `ReceptionDeviationReason_Short`, `ReceptionDeviationReason_Over`, `ReceptionDeviationReason_Damaged`, `ReceptionDeviationReason_WrongItem` and `ReceptionDeviationReason_Other`.

### Sample

```
"PurchaseOrderSettings": {
  "RequireContentCheck": "ExternalSuppliers",
  "ReceptionDeviationReasonCodes": [
    { "Id": "Short", "TranslationKey": "ReceptionDeviationReason_Short" },
    { "Id": "Over", "TranslationKey": "ReceptionDeviationReason_Over" },
    { "Id": "Damaged", "TranslationKey": "ReceptionDeviationReason_Damaged" }
  ]
}
```

* * *

## Estimated time of arrival

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| `SetEstimatedTimeOfArrivalFromPurchaseOrder` | `bool` | `false` | When enabled, the purchase order's `RequestedDeliveryDate` is automatically used as the `EstimatedTimeOfArrival` on deliveries created from that purchase order. |

When the ETA is set on a delivery, it is used by the ATP system to calculate when inventory will become available. This affects customer-facing delivery estimates and order allocation decisions.

### Sample

```
"PurchaseOrderSettings": {
  "SetEstimatedTimeOfArrivalFromPurchaseOrder": true
}
```

* * *

## Internal transfers for pickup warehouses

When goods are received at a central warehouse but customer orders are destined for a different pickup location, Omnium can automatically create internal transfer purchase orders to move the stock.

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| `CreateInternalTransfersForPickUpWarehouses` | `bool` | `false` | When enabled, goods reception automatically creates internal transfer purchase orders for orders with a pickup warehouse different from the receiving warehouse. |
| `CreateInternalTransfersForPickUpWarehousesStatus` | `string` | `null` | The status to assign to automatically created internal transfer purchase orders. If not set, transfers are created with the default initial status. |

### How it works

During goods reception, when this setting is enabled:

1.  Omnium identifies customer orders reserved against the received purchase order lines
2.  For orders where the shipment's `PickUpWarehouseCode` differs from the delivery warehouse, a transfer is needed
3.  For each unique target warehouse, an internal transfer purchase order is created
4.  Line items are copied with the required quantities (grouped by SKU)
5.  Customer order reservations are reallocated from the original purchase order to the new internal transfer
6.  The order line keeps `IsAwaitingPurchaseOrder = true` until the internal transfer is completed

### Sample

```
"PurchaseOrderSettings": {
  "CreateInternalTransfersForPickUpWarehouses": true,
  "CreateInternalTransfersForPickUpWarehousesStatus": "New"
}
```

* * *

## Automatic order line splitting

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| `OrderTypesWithAutomaticLineSplitting` | `List<string>` | `null` | List of order types where order lines are automatically split when customer reservations exceed the available quantity on a delivery. |

When a delivery is created and the available quantity for a purchase order line is less than what is reserved by customer orders, the order lines with excess reservations are automatically split. The portion matching the available quantity can proceed to fulfillment, while the remainder stays reserved against the purchase order.

This only applies to orders with an order type included in this list. If the list is empty or not configured, automatic splitting is disabled.

### Sample

```
"PurchaseOrderSettings": {
  "OrderTypesWithAutomaticLineSplitting": ["Online", "ClickAndCollect"]
}
```

* * *

## Delivery status management

Delivery status is automatically calculated based on the quantities on the associated purchase order lines. See [Delivery Lifecycle](../Deliveries.md#delivery-lifecycle) for details on how statuses are determined.

### Disabling automatic status

Automatic status calculation can be disabled per delivery by setting `IsAutoDeliveryStatusDisabled` to `true` on the delivery. This is a per-delivery setting, not a tenant-level configuration.

When disabled:

*   The delivery status is not automatically updated during goods reception
*   The status must be managed manually via the API or UI
*   The status must be a valid delivery status (`New`, `Confirmed`, `InProgress`, `Completed`, `OnHold`, `Cancelled`)

This is useful when external systems manage the delivery lifecycle and Omnium should not override the status.

* * *

## Delivery exports

Deliveries can be exported to external systems using delivery export connectors. When a delivery is created or updated, configured exporters are triggered automatically.

Delivery export connectors are configured as part of the connector setup in Omnium. The available connectors depend on which integration modules are enabled for your tenant.

Delivery exports can also be triggered as a purchase order workflow step using the `ExportDeliveries` action. This runs all configured delivery export connectors for deliveries associated with the purchase order. See [Purchase Order Statuses](../purchase-order-config.md#purchase-order-statuses) for workflow step configuration.

* * *

## Complete configuration example

Below is a comprehensive example showing all delivery-related settings configured together:

```json
{
  "PurchaseOrderSettings": {
    "GoodsReceptionCompletedStatus": "Completed",
    "GoodsReceptionShipmentOrderStatusUpdate": "ReadyToShip",
    "GoodsReceptionRunShipmentWorkflow": true,
    "SetEstimatedTimeOfArrivalFromPurchaseOrder": true,
    "CreateInternalTransfersForPickUpWarehouses": true,
    "CreateInternalTransfersForPickUpWarehousesStatus": "New",
    "OrderTypesWithAutomaticLineSplitting": ["Online", "ClickAndCollect"],
    "RequireContentCheck": "ExternalSuppliers",
    "ReceptionDeviationReasonCodes": [
      { "Id": "Short", "TranslationKey": "ReceptionDeviationReason_Short" },
      { "Id": "Damaged", "TranslationKey": "ReceptionDeviationReason_Damaged" }
    ]
  }
}
```

Delivery numbering is configured separately as a number option:

```json
{
  "NumberOptions": [
    {
      "NumberType": "DeliveryNumberOptions",
      "Key": "DeliveryNumber",
      "StartSequence": 10000,
      "Prefix": "DEL-",
      "Service": "SequentialNumberService",
      "IsReadOnly": true
    }
  ]
}
```
