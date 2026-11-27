# Project Actions

Source: https://docs.omnium.no/docs/Projects/project-actions

> Reference for all project workflow actions available in Omnium OMS.

Project actions are the building blocks of project workflows in Omnium. They work similarly to [order workflow steps](../Order/workflow-steps.md) but operate on **projects** instead of orders.

## How Project Actions Work

Project actions are configured on **project type statuses**. When a project transitions to a status that has actions configured, each action executes in sequence. Each action:

*   Receives the current **Project** and the **ProjectAction configuration**
*   Performs its operation and returns a result (`Success`, `Warning`, or `Error`)
*   Can optionally cancel the remaining workflow steps on failure

## Configuration

Each project action is configured as part of a project type status workflow. The `name` field maps to one of the action types listed below.

| Setting | Description |
| --- | --- |
| **name** | The action type identifier (e.g. `ExportProject`) |
| **Connector** | The connector to use (required for export-type actions) |
| **Properties** | Key-value pairs that control action behavior |
| **StopOnError** | Whether to halt the workflow if this action fails |
| **TranslateKey** | Translation key shown in the UI on success |

## Available Project Actions

| Action | Description |
| --- | --- |
| [**ExportProject**](project-actions/export-project.md) | Export the project to an external system via a connector |
| [**Notification**](project-actions/notification.md) | Send email/SMS notifications configured on the project type |
| [**CreditReturn**](project-actions/credit-return.md) | Issue a credit payment for a linked return order |
| [**CreateReplacementOrder**](project-actions/create-replacement-order.md) | Create a replacement order from a linked return |
| [**CreateReplacementCart**](project-actions/create-replacement-cart.md) | Create a replacement cart (without placing the order) from a linked return |
| [**CreateReplacementOrderFromCart**](project-actions/create-replacement-order-from-cart.md) | Place an order from an existing replacement cart |
| [**UpdateReturnStatus**](project-actions/update-return-status.md) | Update the status of the linked return order form |
| [**ChangeProjectTypeAndStep**](project-actions/change-project-type-and-step.md) | Move the project to a different project type and workflow step |
| [**RefundRentalDeposit**](project-actions/refund-rental-deposit.md) | Refund the rental deposit for products on the project |
