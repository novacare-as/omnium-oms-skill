# Return Workflow Steps

Source: https://docs.omnium.no/docs/Order/Returns/return-workflow-steps

> Complete reference for all return workflow steps in Omnium OMS - the building blocks of return processing workflows.

Return workflow steps are the core building blocks of return processing in Omnium. Each step performs a specific action on a return, such as processing refunds, updating inventory, sending notifications, or exporting to external systems.

## Default Behavior

**Important:** When you configure custom return statuses, the default workflow steps are **completely replaced**. If you still want the default functionality (refunds, inventory updates, notifications, etc.), you must manually re-add those steps to your custom statuses.

If no return statuses are configured in your tenant settings, Omnium uses a default "Completed" status with the following workflow steps:

| Step | Description |
| --- | --- |
| **EnsureRma** | Generates an RMA (Return Merchandise Authorization) number if one doesn't already exist |
| **CreditReturn** | Processes the refund to the customer's original payment method |
| **UpdateInventory** | Adds returned items back to stock at the return store location |
| **UpdateCustomerClub** | Removes loyalty points that were earned from the original purchase |
| **CreateCreditNote** | Creates a credit note document (requires Invoices module) |
| **UpdateOrderStatus** | Sets the original order status to "Returned" or "PartiallyReturned" |
| **Notification** | Sends a return confirmation notification to the customer |

When you define your own return statuses in **Configuration → Settings → Orders → Return Statuses**, these defaults are no longer applied. You must explicitly add each workflow step you need to your custom statuses.

## How Return Workflow Steps Work

Workflow steps are configured in **Return Statuses** and execute automatically when returns enter a status. Each step:

*   Receives the current **Return Order**, original **Order**, and **WorkflowStep configuration**
*   Performs its action and returns a result (Success, Warning, or Error)
*   Can optionally trigger further status changes or halt the workflow on failure

## Configuration

Each workflow step can be configured with the following properties:

| Setting | Description |
| --- | --- |
| **Name** | Workflow step key (required). See individual step documentation for valid keys. |
| **Active** | Whether the step is enabled. Set to `false` to disable without removing. |
| **Connector** | External system connector (required for export, notification steps). |
| **RunAfterOrderIsSaved** | Execute after return is persisted to database. |
| **StopOnError** | Halt workflow if this step fails. |
| **TranslateKey** | Translation key for step name in UI. |
| **IsInvisible** | Hide result from workflow execution log. |
| **EnabledForMarkets** | List of markets where step is enabled (all if empty). |
| **DisabledForMarkets** | List of markets where step is disabled (overrides enabled). |
| **Properties** | Key-value pairs for step-specific configuration. |

## Step Categories

Return workflow steps are organized into functional categories:

| Category | Description | Steps |
| --- | --- | --- |
| [**Payment**](return-workflow-steps/payment.md) | Refunds, credits, payment export | 3 |
| [**Inventory**](return-workflow-steps/inventory.md) | Stock updates for returned items | 1 |
| [**Notifications**](return-workflow-steps/notifications.md) | Email and SMS notifications | 1 |
| [**Customers**](return-workflow-steps/customers.md) | Loyalty points and membership updates | 1 |
| [**Enrichment**](return-workflow-steps/enrichment.md) | RMA generation, external IDs, custom data | 3 |
| [**Status**](return-workflow-steps/status.md) | Order and project status updates | 3 |
| [**Export**](return-workflow-steps/export.md) | ERP and external system integration | 2 |
| [**Replacement**](return-workflow-steps/replacement.md) | Exchange and replacement order creation | 3 |
| [**Shipments**](return-workflow-steps/shipments.md) | Return label creation and shipment completion | 2 |

## Common Patterns

### Standard Return Flow

A typical return workflow processes the return through these steps:

1.  **EnsureRma** - Generate RMA number for tracking
2.  **Notification** - Send confirmation to customer
3.  **UpdateOrderStatus** - Mark original order as having a return

When the return is completed:

4.  **UpdateInventory** - Add items back to stock
5.  **CreditReturn** - Process refund to customer
6.  **ExportOrder** - Sync to ERP/external systems

### Exchange Flow

For exchanges where items are swapped:

1.  **EnsureRma** - Generate RMA number
2.  **CreateExchangeOrder** - Create new order with replacement items
3.  **UpdateInventory** - Handle inventory adjustments
4.  **UpdateOrderStatus** - Update original order status

### Replacement Order Flow

For sending replacement items without charging:

1.  **EnsureRma** - Generate RMA number
2.  **CreateReplacementOrder** or **CreateReplacementOrderKeepingPrices** - Create replacement
3.  **UpdateOrderStatus** - Update original order

## Result Handling

| Status | Meaning |
| --- | --- |
| **Success** | Step completed successfully |
| **Warning** | Step completed with a non-critical issue |
| **Error** | Step failed - may halt workflow if `StopOnError` is set |

When a step fails and `StopOnError` is `true`, remaining steps in the workflow are skipped. The return stays in the current status for manual intervention.

## Market and Store Filtering

Steps can be restricted to specific markets or stores:

```json
{
  "Name": "ExportOrder",
  "Active": true,
  "Connector": "ERPConnector",
  "EnabledForMarkets": ["NO", "SE"],
  "DisabledForMarkets": ["FI"]
}
```

This configuration enables the export for Norway and Sweden, but explicitly disables it for Finland even if it were in the enabled list.

## Migrating from Default to Custom Workflow

When setting up custom return statuses for the first time, consider which default behaviors you want to preserve:

### Minimum Recommended Steps for a "Completed" Status

To maintain core return functionality, your completed status should typically include:

```json
{
  "Name": "Completed",
  "DisplayName": "Completed",
  "Order": 3,
  "WorkflowSteps": [
    { "Name": "EnsureRma", "Active": true },
    { "Name": "CreditReturn", "Active": true },
    { "Name": "UpdateInventory", "Active": true },
    { "Name": "UpdateOrderStatus", "Active": true },
    { "Name": "Notification", "Active": true }
  ]
}
```

### Optional Steps Based on Your Setup

| Step | Add If... |
| --- | --- |
| **UpdateCustomerClub** | You use the Customer Club / loyalty points feature |
| **CreateCreditNote** | You use the Invoices module and need credit notes |
| **ExportOrder** | You integrate with an ERP or external system |

### Common Mistake

A frequent oversight is creating custom statuses without workflow steps, or only adding an `ExportOrder` step. This results in:

*   No refunds being processed
*   Inventory not being updated
*   Order status not reflecting the return
*   Customers not receiving notifications

Always review the [default behavior](return-workflow-steps.md#default-behavior) section and ensure your custom workflow includes the steps your business requires.
