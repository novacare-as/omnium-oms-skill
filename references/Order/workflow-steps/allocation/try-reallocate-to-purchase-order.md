# Try Reallocate to Purchase Order

Source: https://docs.omnium.no/docs/Order/workflow-steps/allocation/try-reallocate-to-purchase-order

> Allocate order lines to incoming purchase orders for future delivery dates.

## Overview

The **Try Reallocate to Purchase Order** step allocates order lines to expected inventory from incoming purchase orders. This is useful for pre-orders or orders with future requested delivery dates where current inventory is insufficient but replenishment is scheduled.

## Identifier

| Property | Value |
| --- | --- |
| **Key** | `TryReallocateToPurchaseOrder` |
| **Group** | Reallocate |
| **Applicable Statuses** | New, ReadyForPickup |

## Configuration Properties

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `SplitToSeparateShipments` | boolean | No | If true, creates separate shipments for PO-allocated lines |
| `AllowPastRequestedDeliveryDate` | boolean | No | If true, allows allocation to POs arriving after requested delivery |
| `OnlyAllocateIsAwaitingPurchaseOrder` | boolean | No | If true, only allocates lines already marked as awaiting PO |
| `EnableLineSplitting` | boolean | No | If true, enables FIFO-first greedy allocation across multiple purchase orders. Order lines are split so that the earliest-arriving POs are consumed first. Default: false — a single PO must cover the full line quantity. |

## Behavior

### What It Does

1.  Parses configuration properties
2.  Finds purchase orders with expected delivery before the order's requested date
3.  Allocates order lines to matching purchase order inventory
4.  Optionally splits allocated lines to separate shipments
5.  Returns count of allocated lines

### Prerequisites

*   Purchase orders must exist in the system with expected delivery dates
*   Order should have a requested delivery date for optimal matching
*   Products must match between order and purchase orders

### Side Effects

*   Links order lines to purchase order inventory
*   May create new shipments for PO-allocated lines
*   Updates allocation status on affected lines

### FIFO limitation

This step processes a single order in isolation and has no awareness of other open orders. It cannot enforce FIFO across orders — if two orders both need the same purchase order ATP, this step does not guarantee the older order gets priority. If cross-order FIFO is a requirement, use the [Allocate Order to Purchase Order](../../../configuration/scheduled-tasks/orders/allocate-order-to-purchase-order.md) scheduled task instead.

## Business Cases

### When to Use

*   **Pre-orders**: Accept orders before inventory arrives
*   **Future delivery**: Schedule delivery when new stock is expected
*   **Cross-docking**: Route orders to meet incoming shipments

### Example Scenarios

**Scenario 1: Pre-Order Campaign** A new product launches in 2 weeks. Orders placed now are allocated to the incoming purchase order scheduled to arrive before launch.

**Scenario 2: Split for Tracking** Configure `SplitToSeparateShipments = true` to create separate shipments for items coming from purchase orders, enabling different tracking and timing.

**Scenario 3: Awaiting PO Only** Configure `OnlyAllocateIsAwaitingPurchaseOrder = true` to only process lines that were explicitly marked as awaiting PO by a previous step.

## Error Handling

| Condition | Result | Continues Workflow? |
| --- | --- | --- |
| Lines allocated | Success with count | Yes |
| No matching POs | Success (no reallocation) | Yes |
| Exception | Error | Depends on StopOnError |

## Related Steps

*   [Set All Order Lines Not Reserved to Be Purchased](set-all-order-lines-not-reserved-to-be-purchased.md) - Marks lines for PO allocation
*   [Create Purchase Order from Order](../purchase-orders/create-purchase-order-from-order.md) - Creates new POs from demand
