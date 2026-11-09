# Deliveries

Source: https://docs.omnium.no/docs/PurchaseOrders/Deliveries

> Learn about deliveries in Omnium — how they track inbound goods from suppliers and internal transfers, manage goods reception, and connect purchase orders to warehouse inventory.

## What Is a Delivery?

A **Delivery** in Omnium represents an inbound shipment of goods to a warehouse. Deliveries are created from [purchase order](purchase-order-api.md) line items and serve as the bridge between ordering goods from a supplier and receiving them into inventory.

Every delivery is associated with a receiving warehouse and contains one or more purchase order line items. The delivery tracks the shipment from creation through goods reception, updating inventory and releasing order reservations as goods arrive.

> When a supplier ships goods against a purchase order, a **delivery** is created to track the expected arrival. When the goods physically arrive at the warehouse, **goods reception** is performed against the delivery, which increases warehouse inventory and releases any customer order reservations that were waiting for those goods.

* * *

## Delivery Types

Omnium supports two types of deliveries:

### Purchase Order Deliveries

Standard deliveries from external suppliers. A purchase order delivery is created when a supplier ships goods to your warehouse. The delivery tracks the shipment and is used to record goods reception when the shipment arrives.

### Internal Transfers

Deliveries that represent stock movements between your own warehouses. When goods are transferred from one warehouse location to another, an internal transfer delivery is created. The source warehouse is identified by the `SupplierWarehouseCode` property.

For internal transfers, inventory is reduced from the source warehouse immediately when the delivery is created. The receiving warehouse's inventory is increased when goods reception is performed.

The delivery type is determined automatically based on the purchase order. If the purchase order has a `SupplierWarehouseCode`, the delivery is created as an **InternalTransfer**. Otherwise, it is created as a **PurchaseOrder** delivery.

* * *

## Delivery Lifecycle

### Statuses

A delivery progresses through the following statuses:

| Status | Description |
| --- | --- |
| `New` | The delivery has been created but no goods have been received yet |
| `Confirmed` | The supplier has confirmed the shipment |
| `InProgress` | Some goods have been received, but the delivery is not yet complete |
| `Completed` | All goods have been received or accounted for (delivered + canceled = ordered quantity) |
| `OnHold` | The delivery has been temporarily suspended |
| `Cancelled` | The delivery has been cancelled |

### Automatic Status Calculation

By default, Omnium automatically calculates the delivery status based on the quantities on the associated purchase order lines:

*   When **all** line items have their full quantity delivered or canceled, the status is set to **Completed**.
*   When **some** line items have delivered quantities but others are still pending, the status is set to **InProgress**.

This automatic calculation can be disabled per delivery by setting `IsAutoDeliveryStatusDisabled` to `true`, which allows the status to be managed manually via the API.

* * *

## Creating Deliveries

Deliveries are created from purchase order line items. When creating a delivery, you specify which purchase order lines (and quantities) to include.

### Full and Partial Quantities

*   If the full quantity of a purchase order line is included in the delivery, the line is linked directly to the delivery.
*   If only a partial quantity is included, Omnium automatically **splits** the purchase order line. The original line is assigned to the delivery with the specified quantity, and a new line is created for the remaining quantity. Any existing order reservations are split proportionally between the two lines.

### Adding to Existing Deliveries

Line items from the same or different purchase orders can be added to an existing delivery. This is useful when a supplier consolidates multiple purchase orders into a single shipment.

### Canceling Remaining Items

When creating a delivery, you can optionally cancel any remaining undelivered line items on the purchase order. This is useful when a supplier confirms they can only fulfill a partial order and the rest should not be expected.

* * *

## Goods Reception

Goods reception is the process of recording that goods from a delivery have physically arrived at the warehouse. This is one of the most important operations in the delivery workflow, as it triggers several downstream effects.

When goods reception is performed, for each line item received:

1.  **Inventory is increased** — The warehouse stock for the received products is updated with the delivered quantities.
2.  **Order reservations are released** — Customer orders that were reserved against the purchase order line are transitioned to warehouse stock reservations. The `IsAwaitingPurchaseOrder` flag is cleared, allowing the order to proceed to fulfillment. See [Reservations](purchase-order-reservations.md) for details.
3.  **Delivery status is updated** — The delivery status is recalculated based on the new delivered quantities.
4.  **ATP is recalculated** — Available-to-Promise values are updated for the affected products.
5.  **Cost prices are optionally updated** — If requested, the product's cost price can be updated based on the received goods.

Goods reception supports idempotency when a `GoodsReceptionId` is provided on each reception line. See the [Goods Reception](Deliveries/goods-reception.md#idempotency) page for details on which endpoint performs the duplicate check.

For a complete guide on performing goods reception, see [Goods Reception](Deliveries/goods-reception.md).

* * *

## Deliveries and Order Fulfillment

Deliveries play a key role in the order fulfillment chain when inventory is not immediately available:

```
1. Customer places order → no warehouse stock available
2. ATP system allocates order line to a purchase order line
   (order line marked as IsAwaitingPurchaseOrder = true)

3. Delivery is created from the purchase order
4. Goods reception is performed on the delivery

5. Inventory is added to the warehouse
6. Order reservation transfers from purchase order to warehouse stock
   (IsAwaitingPurchaseOrder cleared)

7. Order is ready for fulfillment and shipment
```

When a delivery includes line items that have customer order reservations, the goods reception process automatically handles the transition. No manual intervention is required to release the reservations — this happens as part of the goods reception workflow.

* * *

## Estimated Time of Arrival

Each delivery can have an **Estimated Time of Arrival (ETA)**, representing when the goods are expected to arrive at the warehouse.

The ETA serves two purposes:

*   **Operational planning** — Warehouse teams can plan ahead for incoming deliveries.
*   **ATP calculations** — The ETA is used by the Available-to-Promise system to determine when expected inventory will become available. This affects customer-facing delivery estimates and order allocation decisions.

When the ETA is updated on a delivery, Omnium recalculates ATP values for the affected products.

* * *

## Tracking and Logistics

Deliveries support tracking information from the supplier or freight carrier:

| Property | Description |
| --- | --- |
| `DeliveryTrackingNumber` | The tracking number provided by the supplier or carrier |
| `DeliveryTrackingLink` | A URL for tracking the shipment |
| `DeliveryProvider` | The name of the shipping provider or freight carrier |

* * *

## Notes and Comments

Deliveries support two types of notes:

*   **Delivery Notes** — Internal comments visible only to Omnium users. Use these for operational notes, warehouse instructions, or internal coordination.
*   **Public Delivery Notes** — Comments that may be shared with external systems or partners via integrations.

* * *

## Tags

Deliveries can be tagged with free-text labels for categorization and filtering. Tags are inherited from the purchase order when a delivery is created and can also be managed directly on the delivery.

Tags are useful for grouping deliveries by season, campaign, priority, or any other business-relevant criteria.

* * *

## Delivery Model

| Property | Type | Description |
| --- | --- | --- |
| `Id` | `string` | Unique delivery identifier |
| `DeliveryStatus` | `string` | Current status (`New`, `Confirmed`, `InProgress`, `Completed`, `OnHold`, `Cancelled`) |
| `OrderType` | `string` | Delivery type: `PurchaseOrder` or `InternalTransfer` |
| `WarehouseCode` | `string` | Code of the receiving warehouse |
| `SupplierWarehouseCode` | `string` | Code of the source warehouse (internal transfers only) |
| `Suppliers` | `List<string>` | Names of suppliers associated with this delivery |
| `SupplierIds` | `List<string>` | IDs of suppliers associated with this delivery |
| `EstimatedTimeOfDeparture` | `DateTime?` | Expected departure date from the supplier |
| `EstimatedTimeOfArrival` | `DateTime?` | Expected arrival date at the receiving warehouse |
| `DeliveryTrackingNumber` | `string` | Tracking number from the supplier or carrier |
| `DeliveryTrackingLink` | `string` | URL for shipment tracking |
| `DeliveryProvider` | `string` | Shipping provider or freight carrier name |
| `InvoiceNumber` | `string` | Supplier invoice number |
| `InvoiceDate` | `DateTime?` | Supplier invoice date |
| `IsCounted` | `bool` | Whether quantities have been physically verified |
| `IsAutoDeliveryStatusDisabled` | `bool` | If `true`, automatic status calculation is disabled |
| `DeliveryNotes` | `List<Comment>` | Internal comments |
| `PublicDeliveryNotes` | `List<Comment>` | Public/external comments |
| `Tags` | `List<string>` | Free-text labels for grouping and filtering |
| `Properties` | `List<PropertyItem>` | Custom key-value properties for extensibility |
| `Created` | `DateTime?` | Timestamp when the delivery was created |
| `Modified` | `DateTime?` | Timestamp when the delivery was last modified |
