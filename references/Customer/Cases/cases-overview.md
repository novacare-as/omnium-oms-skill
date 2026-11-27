# Overview & Concepts

Source: https://docs.omnium.no/docs/Customer/Cases/cases-overview

> What cases are, key concepts, data model, status lifecycle, and how cases relate to other Omnium entities.

## What are Cases?

Cases are Omnium's built-in support/CRM system for tracking customer inquiries, issues, complaints, and requests. They provide a structured way to manage customer communication with full history, assignment, prioritization, and analytics.

Cases can be created:

*   **Manually** by staff in the Omnium UI: from the cases list, from an order, or from an order line
*   **Automatically** from inbound customer emails and SMS messages
*   **Programmatically** via the public API
*   **With the AI assistant**

See [Creating a Case](cases-management.md#creating-a-case).

## Key Concepts

| Concept | Description |
| --- | --- |
| **Case Number** | A human-readable reference number from the case [number series](cases-config.md#case-numbers), for example `CS-1001`. A GUID when no series is configured |
| **Status** | The current stage in the case lifecycle. Statuses are fully configurable with levels that define progression order |
| **Priority** | Severity level of the case (e.g., Low, Medium, High, Critical). Configurable with severity values |
| **Source** | How the case was created. Omnium sets `Email`, `Sms` or `Order`; agents and integrations can type any value |
| **Participants** | People involved in the case, each with a name, email, optional customer ID, and role. Set through the API only |
| **Tags** | Labels for categorizing cases. Configurable in Case Settings |
| **Assigned To** | The staff member responsible for the case |

## Data Model

A case tracks the following key information:

*   **Identity** — Unique ID and human-readable case number, both from number series
*   **Content** — Subject (title) and description
*   **Workflow** — Status, priority, source, and assigned agent
*   **Customer** — Linked customer with name, email, and ID
*   **Tags** — Labels for categorization
*   **Dates** — Created, changed, follow-up, resolved, and closed timestamps
*   **Relations** — Linked orders, customers, projects, carts, products, and SKUs
*   **Participants** — People involved in the case with name, email, and role (API only)
*   **Notes** — Public notes (the thread with the customer) and internal notes (for staff)
*   **Custom properties** — Flexible key-value pairs for additional metadata (API only)
*   **Status log** — When the case first reached each status, with the time since the previous entry. A status the case returns to is not logged again

For the complete field reference, see the [API Reference](cases-api.md).

## Status Lifecycle

Cases follow a configurable status progression based on **levels**. Each status has a name and a numeric level that determines its position in the workflow.

A typical configuration:

| Status | Level | Description |
| --- | --- | --- |
| New | 1 | Initial status for newly created cases |
| In Progress | 2 | Case is being actively worked on |
| Resolved | 3 | Issue has been addressed |
| Closed | 4 | Case is complete |

Special status designations control automatic behavior:

*   **Status New** — Assigned to newly created cases (including those from inbound email)
*   **Status for Cases in Progress** (optional) — Applied the first time an agent replies to a new case
*   **Status Closed** — Triggers closed-case logic (sets `ClosedDate`, used for reopen detection)
*   **Status Reopen** — Applied when a customer replies to a closed case

See [Status Designations](cases-config.md#status-designations).

The status bar in the UI shows the statuses in level order, with the current status highlighted. Agents move a case to the next status with **Set to**, or pick any status in **Edit Case**. See [Changing Status](cases-management.md#changing-status).

## Relationships

Cases can be linked to other Omnium entities:

| Relation | Description |
| --- | --- |
| **Customers** | One or more private or business customers related to the case |
| **Orders** | Orders associated with the issue (auto-detected from email subjects and bodies containing `#12345` patterns) |
| **Projects** | Linked projects (API only) |
| **Carts** | Shopping carts related to the case (API only) |
| **Products / SKUs** | Specific products or SKU IDs involved (from an order line, or through the API) |

See [Linking to Other Entities](cases-management.md#linking-to-other-entities).

## Access Requirements

The Cases feature requires the **"cases"** access claim. Users without this claim will not see Cases in the navigation or be able to access case functionality.

Cases are managed under **Customers → Cases** in the Omnium navigation. Enable cases in [Case Settings](cases-config.md#enabling-cases) to create cases from inbound email and SMS and to show cases on orders, customers and My page.
