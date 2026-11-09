# Overview & Concepts

Source: https://docs.omnium.no/docs/Customer/Cases/cases-overview

> What cases are, key concepts, data model, status lifecycle, and how cases relate to other Omnium entities.

## What are Cases?

Cases are Omnium's built-in support/CRM system for tracking customer inquiries, issues, complaints, and requests. They provide a structured way to manage customer communication with full history, assignment, prioritization, and analytics.

Cases can be created:

*   **Manually** by staff in the Omnium UI
*   **Automatically** from inbound customer emails
*   **Programmatically** via the public API

## Key Concepts

| Concept | Description |
| --- | --- |
| **Case Number** | A human-readable reference number, auto-generated with a configurable prefix (e.g., `CS-1001`) |
| **Status** | The current stage in the case lifecycle. Statuses are fully configurable with levels that define progression order |
| **Priority** | Severity level of the case (e.g., Low, Medium, High, Critical). Configurable with severity values |
| **Source** | How the case was created — `Email`, `Phone`, `Web`, or custom values |
| **Participants** | People involved in the case, each with a name, email, optional customer ID, and role |
| **Tags** | Labels for categorizing cases. Configurable in Case Settings |
| **Assigned To** | The staff member responsible for the case |

## Data Model

A case tracks the following key information:

*   **Identity** — Unique ID and human-readable case number (auto-generated with configurable prefix)
*   **Content** — Subject (title) and description
*   **Workflow** — Status, priority, source, and assigned agent
*   **Customer** — Linked customer with name, email, and ID
*   **Tags** — Labels for categorization
*   **Dates** — Created, changed, follow-up, resolved, and closed timestamps
*   **Relations** — Linked orders, customers, projects, carts, products, and SKUs
*   **Participants** — People involved in the case with name, email, and role
*   **Notes** — Public notes (customer-visible) and internal notes (staff-only)
*   **Custom properties** — Flexible key-value pairs for additional metadata
*   **Status log** — Full timeline of status changes with timestamps and durations

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

Three special status designations control automatic behavior:

*   **Status New** — Assigned to newly created cases (including those from inbound email)
*   **Status Closed** — Triggers closed-case logic (sets `ClosedDate`, used for reopen detection)
*   **Status Reopen** — Applied when a customer replies to a closed case

The status bar in the UI shows all statuses in level order, with the current status highlighted. Users can advance to the next suggested status or select any status manually.

## Relationships

Cases can be linked to other Omnium entities:

| Relation | Description |
| --- | --- |
| **Customers** | One or more private or business customers related to the case |
| **Orders** | Orders associated with the issue (auto-detected from email subjects containing `#12345` patterns) |
| **Projects** | Linked projects |
| **Carts** | Shopping carts related to the case |
| **Products / SKUs** | Specific products or SKU IDs involved |

## Access Requirements

The Cases feature requires the **"cases"** access claim. Users without this claim will not see Cases in the navigation or be able to access case functionality.

Cases are managed under **Customer** in the Omnium navigation. The feature must also be enabled in [Case Settings](cases-config.md).
