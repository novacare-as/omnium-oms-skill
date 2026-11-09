# Workflow Steps

Source: https://docs.omnium.no/docs/Order/workflow-steps

> Complete reference for all workflow steps (OrderActions) in Omnium OMS - the building blocks of order processing workflows.

Workflow steps are the core building blocks of order processing in Omnium. Each step performs a specific action on an order or shipment, such as allocating inventory, capturing payments, sending notifications, or exporting to external systems.

## How Workflow Steps Work

Workflow steps are configured in **Workflows** and execute automatically as orders move through different statuses. Each step:

*   Receives the current **Order**, optional **Shipment**, and **WorkflowStep configuration**
*   Performs its action and returns a result (Success, Warning, or Error)
*   Can optionally trigger a status change or cancel the workflow on failure

## Configuration

Each workflow step can be configured with:

| Setting | Description |
| --- | --- |
| **Properties** | Key-value pairs that control step behavior |
| **Market restrictions** | Limit execution to specific markets |
| **Store/Warehouse restrictions** | Limit execution to specific locations |
| **Shipment options** | Filter by shipping method |
| **Tags** | Filter by order tags |
| **StopOnError** | Whether to halt the workflow if this step fails |

## Step Categories

Workflow steps are organized into functional categories:

| Category | Description | Steps |
| --- | --- | --- |
| [**Allocation**](workflow-steps/allocation.md) | Warehouse assignment, order splitting, reallocation | 26 |
| [**Payment**](workflow-steps/payment.md) | Payment capture, authorization, refunds, invoicing | 18 |
| [**Inventory**](workflow-steps/inventory.md) | Stock reservation, reduction, ATP calculation | 14 |
| [**Shipments**](workflow-steps/shipments.md) | Shipment creation, label printing, status updates | 14 |
| [**Enrichment**](workflow-steps/enrichment.md) | Order data enrichment, tagging, barcode generation | 22 |
| [**Validation**](workflow-steps/validation.md) | Order validation, fraud checks, payment verification | 7 |
| [**Export**](workflow-steps/export.md) | ERP export, webhooks, external system integration | 5 |
| [**Notifications**](workflow-steps/notifications.md) | Email and SMS notifications | 1 |
| [**Customers**](workflow-steps/customers.md) | Customer creation, loyalty points | 6 |
| [**Workflow**](workflow-steps/workflow.md) | Status changes, workflow control | 5 |
| [**Analytics**](workflow-steps/analytics.md) | Analytics indexing | 1 |
| [**Subscriptions**](workflow-steps/subscriptions.md) | Subscription order creation | 2 |
| [**Purchase Orders**](workflow-steps/purchase-orders.md) | PO creation from orders | 3 |

## Identifying Workflow Steps

Each workflow step has a unique **Key** identifier used in configuration. This key is shown in the documentation for each step and matches the value in `FactoryContants.OrderActions`.

Example: The "Allocate to Warehouse" step has key `AllocateToWarehouse`.

## Common Patterns

### Test Mode

Most workflow steps support test mode (`context.IsTest = true`), which returns a simulated result without performing actual operations. This is useful for validating workflow configuration.

### Market/Store Restrictions

Steps can check `workflowStep.IsAvailableForMarket(order.MarketId)` to skip execution for orders from non-configured markets.

### Property Configuration

Steps read configuration from properties set on the workflow step:

```json
{
  "Connector": "Webhook",
  "Properties": [
    { "Key": "warehouseCode", "Value": "OSL-01" },
    { "Key": "SkipForManualOrder", "Value": "true" }
  ]
}
```

## Result Handling

| Status | Meaning |
| --- | --- |
| **Success** | Step completed successfully |
| **Warning** | Step completed with a non-critical issue |
| **Error** | Step failed - may cancel workflow if `StopOnError` is set |

When a step sets `CancelWorkflow = true`, remaining steps in the workflow are skipped.

When a step sets `TriggerNewStatus`, the order transitions to that status after the workflow completes.

* * *

## Example: Online Order Happy Flow

This example shows a typical Online order type "happy flow" - where everything goes smoothly without cancellations, returns, or other complications. The "Online" order type handles standard e-commerce scenarios - orders placed online that are fulfilled either from a central warehouse or directly from a store.

The configurations shown here are examples. Your actual setup will likely be different - it might be less complex or more complicated.

### Status: New (14 workflow steps)

When an online order is created:

1.  **TryReallocateToOtherWarehouse** - Attempts to find alternative warehouse inventory if primary warehouse lacks stock
2.  **ProductPackageBreakDown** - Breaks down bundled products into individual components for fulfillment
3.  **TransferReplacementOrderPayment** _(invisible)_ - Transfers payment from original order to replacement orders (only executes for orders with `IsReplacementOrder` property set)
4.  **CheckAndUpdateCouponUsage** - Validates and marks coupons as used to prevent double redemption
5.  **UpdateOrderLineReservedInventory** - Updates inventory reservations at the line level
6.  **EnrichOrderFromProducts** - Adds product details, weights, dimensions from product catalog
7.  **TrySplitUnreservedOrderLinesToNewShipment** - Splits unreserved order lines to a separate shipment for allocation
8.  **Notification** - Sends notifications (email/SMS) based on order status
9.  **IncreaseReservedInventory** - Increases reserved inventory for order lines
10.  **EnrichShipmentLabel** - Enriches shipping label information from shipping options
11.  **SetAuthorizationExpires** _(invisible)_ - Sets payment authorization expiration timeframe
12.  **GetOrCreateCustomerFromOrder** - Creates or updates customer record
13.  **CustomerClubCalculateNewPointsOnHold** _(invisible)_ - Calculates loyalty points (held pending completion)
14.  **CalculateAtp** _(runs after save)_ - Recalculates Available-to-Promise inventory levels

### Status: InProgress (2 workflow steps)

When order moves to processing:

1.  **Notification** - Sends notifications that order is being prepared
2.  **UpdateShipmentStatus** - Updates shipment status

### Status: Ship (11 workflow steps)

When order is shipped to customer:

1.  **UpdateShipmentStatus** - Updates shipment to "Released"
2.  **CapturePayments** - Charges the customer's payment method
3.  **ReduceInventoryAndReservedInventory** - Removes items from available inventory
4.  **CompleteShipment** - Marks shipment as completed in carrier system
5.  **Notification** - Sends shipping confirmation notifications with tracking info
6.  **RemoveAuthorizationExpires** _(invisible)_ - Removes payment auth expiration
7.  **TryReleaseRemainingAuth** _(invisible)_ - Releases any unused payment authorization
8.  **SetCompletedDate** - Records order completion timestamp
9.  **CustomerClubMoveFromOnHoldToEarnedPoints** _(invisible)_ - Converts held points to earned points
10.  **CustomerClubCancelNewPointsOnHold** _(invisible)_ - Cleans up temporary point calculations
11.  **CustomerClubCalculateAndUpdateTierForMember** _(invisible, runs after save)_ - Updates customer loyalty tier
