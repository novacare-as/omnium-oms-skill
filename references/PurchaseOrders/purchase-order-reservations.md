# Reservations

Source: https://docs.omnium.no/docs/PurchaseOrders/purchase-order-reservations

> Learn how order lines are reserved against purchase orders, how reservations transfer to warehouse stock during goods reception, and how to manage reservations via the API.

## How purchase order reservations work

When a customer places an order and the required stock is not available in a warehouse but is expected on an incoming purchase order, Omnium can allocate the order line to that purchase order. This is handled by the Available-to-Promise (ATP) system, which looks ahead at expected inventory from purchase orders and matches it to customer demand.

When an order line is allocated to a purchase order, the following properties are set on the order line:

| Property | Description |
| --- | --- |
| `IsAwaitingPurchaseOrder` | Set to `true` — indicates the line is waiting for goods from a purchase order |
| `ReservedInventoryPurchaseOrderId` | Reference to the purchase order |
| `ReservedInventoryPurchaseOrderLineId` | Reference to the specific purchase order line |
| `ReservedInventoryDeliveryId` | Reference to the expected delivery |
| `ExpectedDeliveryDate` | The date the goods are expected to arrive |
| `ReservedInventory` | Set to `true` — the line has a reservation |

At this point, the inventory is reserved against the purchase order, not against warehouse stock.

* * *

## Goods reception: reservation transfer

When goods reception is performed in Omnium, the system automatically transitions the reservation from the purchase order to the warehouse. This happens in two steps:

1.  **Inventory is increased** in the receiving warehouse based on the delivered quantity.
2.  **The purchase order reservation is released** — `IsAwaitingPurchaseOrder` and `ExpectedDeliveryDate` are cleared from the order line, and `ReservedInventory` remains `true`, now representing a reservation against warehouse stock.

After goods reception, the purchase order references (`ReservedInventoryPurchaseOrderId` and `ReservedInventoryPurchaseOrderLineId`) are kept on the order line for traceability and reporting purposes. The `IsAwaitingPurchaseOrder` flag is what differentiates an order line still waiting for purchase order goods from one that has already been received into the warehouse.

If [internal transfers for pickup warehouses](purchase-order-config.md#internal-transfers) are enabled and the order line has a pickup warehouse, the `IsAwaitingPurchaseOrder` flag is kept until the internal transfer is completed.

* * *

## Shipment and inventory reduction

When an order shipment is sent and reaches a status with the "Updating inventory" workflow step, the reserved inventory is reduced from the warehouse. At this point, the order line is already reserved against warehouse stock (not the purchase order), so the standard inventory reduction workflow applies.

The full lifecycle of a reservation is:

```
1. Order placed → ATP allocates to purchase order
   (IsAwaitingPurchaseOrder = true, reserved against PO)

2. Goods reception performed → reservation transfers
   (IsAwaitingPurchaseOrder = null, reserved against warehouse)

3. Shipment sent → inventory reduced
   (Reserved quantity reduced, warehouse stock decreased)
```

* * *

## Managing reservations via the API

If goods reception is handled in an external system (e.g., an ERP), the reservation transfer does not happen automatically in Omnium. In this scenario, you need to manage the transition yourself:

1.  **Update inventory** — ensure the warehouse inventory in Omnium is increased by the ERP integration when goods are received.
2.  **Clear the purchase order allocation** — remove the `IsAwaitingPurchaseOrder` flag from the order line via the API. This signals to Omnium that the order line should now allocate against warehouse stock.

If `IsAwaitingPurchaseOrder` is not cleared after external goods reception, the order line will remain allocated to the purchase order and will not be available for warehouse fulfillment, even if the inventory has been increased.

### Relevant order line properties

| Property | Type | API action |
| --- | --- | --- |
| `IsAwaitingPurchaseOrder` | bool? | Set to `null` or `false` to release the PO allocation |
| `ExpectedDeliveryDate` | DateTime? | Clear when the PO allocation is released |
| `ReservedInventoryPurchaseOrderId` | string | Can be kept for traceability or cleared |
| `ReservedInventoryPurchaseOrderLineId` | string | Can be kept for traceability or cleared |

* * *

## Partial deliveries

When a purchase order delivery only partially fulfills the expected quantity, Omnium handles this based on the `OrderTypesWithAutomaticLineSplitting` [configuration](purchase-order-config.md#delivery-settings). When enabled for an order type, Omnium automatically splits the order line so that the received portion can proceed to fulfillment while the remaining quantity stays allocated to the purchase order.
