# Managing Cases

Source: https://docs.omnium.no/docs/Customer/Cases/cases-management

> Working with cases in the Omnium UI — list view, creating, editing, assigning, status changes, bulk operations, and linking to other entities.

## Cases List View

The cases list is accessible from **Customer → Cases** in the Omnium navigation. It shows all cases with columns for case number, subject, status, priority, assigned user, customer, and dates.

### Search and Filtering

The list supports:

*   **Free-text search** across case number, subject, description, and customer name
*   **Status filter** — filter by one or more statuses
*   **Priority filter** — filter by priority level
*   **Assigned to filter** — filter by assigned agent
*   **Tag filter** — filter by tags
*   **Date range filter** — filter by creation or modification date
*   **Customer / Order filter** — find cases linked to a specific customer or order

### Sorting

Click column headers to sort. Available sort fields:

*   Created date
*   Changed date
*   Status
*   Priority
*   Subject
*   Customer name
*   Assigned to
*   Follow-up date

### My Cases

Use the **My Cases** toggle to quickly filter the list to only cases assigned to you.

## Creating a Case

Click **Create** to open a new case form. Required and optional fields:

| Field | Required | Description |
| --- | --- | --- |
| Subject | Yes | Title summarizing the case |
| Description | No | Detailed description of the issue |
| Priority | No | Defaults to the configured default priority |
| Status | Auto | Automatically set to the configured **Status New** |
| Tags | No | Select from predefined tags |
| Source | No | How the case originated (Email, Phone, Web, etc.) |
| Customer | No | Link to an existing customer |
| Assigned To | No | Assign to a specific user |

## Editing a Case

Open a case to view and edit its details. The case detail view includes:

### Status Progression Bar

A visual bar at the top shows all configured statuses in level order. The current status is highlighted. Click the **next suggested status** button to advance the case, or select any status from the bar to jump directly.

### Case Information

Edit the following fields directly:

*   **Subject** and **Description**
*   **Priority** — select from configured priorities
*   **Tags** — add or remove tags
*   **Follow-up Date** — set a reminder date
*   **Source** — update the case origin
*   **Custom Properties** — add key-value pairs for additional metadata

### Assignment

Assign or reassign the case to a user. The assigned user's name appears in the case list and can be used as a filter.

### Dates

The case tracks several dates automatically:

*   **Created** — when the case was first created
*   **Changed** — last modification timestamp
*   **Follow-up Date** — manually set reminder date
*   **Resolved Date** — set when case moves to a resolved status
*   **Closed Date** — set when case moves to the configured **Status Closed**

## Changing Status

Status can be changed in several ways:

1.  **Status bar** — click the next suggested status or any status in the progression bar
2.  **Bulk status change** — select multiple cases from the list and apply a status change
3.  **API** — use the change status endpoint

When a case moves to the **Status Closed** status, the `ClosedDate` is automatically set. When a closed case is reopened (e.g., via customer email reply), the status changes to **Status Reopen**.

## Bulk Operations

Select multiple cases from the list to perform bulk actions:

### Bulk Assign

Select cases and choose **Assign** to assign all selected cases to a specific user at once.

### Bulk Status Change

Select cases and choose **Change Status** to move all selected cases to a new status simultaneously.

## Linking to Other Entities

Cases can be linked to related Omnium entities:

### Orders

Link one or more orders to a case. When cases are created from inbound email, orders are automatically detected if the email subject or body contains a pattern like `#12345`.

### Customers

Link one or more customers (private or business) to a case. When created from email, the sender's email is used to match an existing customer.

### Projects

Link cases to projects for tracking project-related issues.

### Carts

Associate shopping carts with a case.

### Products and SKUs

Add related product IDs or SKU IDs to track which products are involved in the case. These appear as chart dimensions in the [Dashboard](cases-dashboard.md).

## Participants

Manage the list of people involved in a case. Each participant has:

*   **Name** — display name
*   **Email** — contact email
*   **Customer ID** — optional link to an Omnium customer
*   **Role** — their role in the case

Participants can receive notifications when notes are added to the case.

## Deleting Cases

Cases can be deleted from the case detail view. Deletion is a soft delete — the case status is set to "Deleted" and the case is hidden from the default list view. Deleted cases can be included by enabling the **Include Deleted** filter.
