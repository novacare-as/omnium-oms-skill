# Configuration

Source: https://docs.omnium.no/docs/Projects/projects-configuration

## What is a Project?

In Omnium, a **project** is a flexible framework used to collect and structure information. Projects support any process that spans beyond a single order. They can be used for simple tasks such as collecting and tracking leads, or for more complex workflows like designing and building a kitchen.

## Project Types

Every project in Omnium is defined by a **project type**. The project type determines the structure and behavior of the project, including:

*   Statuses and workflow steps
*   Notification templates
*   Custom dashboards
*   Properties and checklists
*   Other project-specific configurations

A project type is similar to an **order type** in Omnium—the key difference is that it specifies rules and settings for projects instead of orders.

### Statuses

Statuses define the different steps in a project workflow. By setting up statuses, you create a clear progression for how projects move from start to finish.

Each status can be configured to support project execution, for example:

*   Triggering notifications
*   Running workflow actions (similar to order workflows)
*   Setting deadlines
*   Adding checklists
*   Displaying custom dashboards

### Notifications

Notifications are configured per project type using Omnium’s email template designer. Each notification is tied to a project status and is triggered automatically when that status is reached.

#### Product Tokens in Email Templates

Project notification templates support a **product repeater** for rendering the list of products associated with a project. This is useful for claim notifications that need to list the affected products with their status and reason codes.

**Repeater syntax:**

```json
{#PRODUCT_REPEAT}
  Product: {PRODUCT_NAME} (SKU: {PRODUCT_SKU_ID})
  Status: {PRODUCT_STATUS}
  Reason: {PRODUCT_CANCELLATION_CODE} - {PRODUCT_CANCELLATION_REASON}
{/PRODUCT_REPEAT}
```

**Available product tokens (inside the repeater):**

| Token | Description |
| --- | --- |
| `{PRODUCT_NAME}` | Product name |
| `{PRODUCT_SKU_ID}` | Product SKU ID |
| `{PRODUCT_PRODUCT_ID}` | Product ID |
| `{PRODUCT_QUANTITY}` | Quantity |
| `{PRODUCT_STATUS}` | Per-product status |
| `{PRODUCT_REFERENCE_TYPE}` | Reference type |
| `{PRODUCT_ORDER_TYPE}` | Order type |
| `{PRODUCT_ORDER_ID}` | Associated order ID |
| `{PRODUCT_CANCELLATION_CODE}` | Cancellation/complaint reason code |
| `{PRODUCT_CANCELLATION_REASON}` | Free text cancellation reason |
| `{PRODUCT_PROPERTIES}` | Renders all custom properties as an HTML table |

These tokens are available in the email template designer under the **Project products** merge tag group when editing project notification templates.

* * *

## Project Information

Projects in Omnium can contain a wide range of information. Not every option is required for every project type, but the table below shows the most common types of information:

| Information | Description |
| --- | --- |
| **Customer** | The customer associated with the project. |
| **Contacts** | One or more contact persons (e.g., store employees, partners, or other stakeholders). |
| **Partners** | Partners who execute the project, such as artisans or technicians. Typically registered as _BusinessCustomers_ in Omnium. |
| **Stores** | The store(s) linked to the project—for example, a store performing bicycle service. |
| **Comments** | Three types of communication are supported: internal, partner, and customer dialogue. Each supports email and SMS. |
| **Forms** | A key–value list for easy registration of custom data, often used when projects are registered via web forms. |
| **Attachments** | Upload relevant files to a project, or set default attachments on a project type that are automatically cloned to all projects of that type. |
| **Time Tracking** | Track time spent on projects. Data can currently only be written via API but is displayed in the project view. |
| **Invoices** | Register invoices on projects. Data can currently only be written via API but is displayed in the project view. |
| **Project Parts & Transactions** | For complex projects, use parts, change orders, and transactions to break down tasks and costs. |
| **Products** | A list of products associated with the project. Each product supports its own status, cancellation/complaint reason codes, and custom properties. Products are especially useful for claim projects and projects created from purchase orders. |

* * *

## Project Products

Projects can include a list of products, providing per-product tracking for claims, complaints, and other project types.

### Per-Product Fields

Each product in a project supports the following fields beyond the basic product reference:

| Field | Description |
| --- | --- |
| **Status** | Individual product status (e.g. Active, Cancelled). Can be updated via the API independently of the project status. |
| **Cancellation Code** | A reason code for complaints or cancellation, selected from the cancellation types configured in order line settings. |
| **Cancellation Reason** | Free text field for additional detail about the complaint or cancellation. |
| **Custom Properties** | Key-value pairs for storing additional data per product. |

### Cancellation Codes for Products

Product-level cancellation codes are sourced from **Order Settings > Order Line Settings > Cancellation Types** in the tenant configuration. These are the same codes used for order line cancellations.

The cancellation code and reason fields are only shown in the project UI when the project category is **Claim**.

### Managing Products via API

Products can be managed through:

*   **PUT / PATCH** project endpoints — include the `products` array in the request body
*   **UpdateProjectProductStatus** endpoint — update status and cancellation codes per product without replacing the full product list

See [API Reference](project-api.md#project-products) for endpoint details and examples.

* * *

## Project Planning

The Omnium UI includes a **project calendar** to help with planning and execution.

### Setup

1.  Set a **capacity cost** on a project type.
2.  Define **store project capacity** (Stores → Date Planner → Default Project Capacity).

### Using the Calendar

From the project calendar, you can:

*   Create projects directly by clicking on a date.
*   View all projects planned for each day.
*   See store-specific capacity and availability (if a store is selected in the global store selector).

* * *

## Dashboards and Custom Views

Projects in Omnium support dashboards and custom views to provide tailored insights.

A project is the hub for all activities carried out over a period of time. Common use cases include:

*   Returns and claim workflows
*   Long-running sales processes
*   Selling and delivering services

Projects tie together carts, orders, returns, and all other relevant data needed for effective project management.

* * *

## Use Cases

### Claims and Returns

One of the most common uses of projects in Omnium is handling **customer claims and returns**. Projects provide a structured way to track, process, and follow up on these cases.

When you create a return in Omnium, you can also create a linked **claim project** by selecting the appropriate project type. The claim project is automatically connected to the order, making it easy to manage both the return process and its related complaint in one place.

This allows customer service teams to:

*   Get a full overview of the claim history.
*   Ensure no steps are missed in the follow-up process.
*   Maintain clear communication with customers about the progress of their claim.

* * *

### Service Projects

Omnium projects can also be used to manage **repair and maintenance services**.

For example, a sports shop offering bicycle repairs can define a **BikeRepair project type**. The workflow may include the following statuses:

| Project Status | Description |
| --- | --- |
| Request received | Customer submits a service request describing the work needed. |
| Request approved | Store approves the request and sets a service date. |
| Request rejected | Store declines the request. |
| Bike received | Customer delivers the bike to the store. |
| Service started | Store begins the repair service. |
| Service completed | Repair is finished. |
| Bike returned | Customer picks up the serviced bike. |

Each BikeRepair project can be assigned a **capacity cost**, and each store can configure its **daily service capacity**. With this setup, the **project calendar** helps staff plan and allocate work based on availability, reducing bottlenecks and improving turnaround times.

* * *

### Kitchen Sales and Installations

Another powerful use case is managing **large, multi-step projects**, such as selling and installing a new kitchen.

These projects involve many moving parts—multiple product orders, deliveries, subcontractors (such as carpenters, electricians, and plumbers), and ongoing customer communication.

A project type called **KitchenInstallation** could include statuses such as:

| Project Status | Description |
| --- | --- |
| Design phase | Customer works with sales staff to design the kitchen. |
| Order placed | Customer places the main kitchen order (cabinets, appliances, etc.). |
| Supplier orders | Sub-orders for appliances or materials are placed with suppliers. |
| Delivery scheduled | Delivery dates are confirmed with logistics partners. |
| Installation started | Contractors begin on-site installation. |
| Installation completed | Kitchen installation is finished. |
| Final inspection | Store or contractor verifies the work with the customer. |
| Project closed | Project is marked as completed. |

Using projects for this type of workflow provides:

*   A **single hub** connecting all related orders, deliveries, and sub-contractors.
*   Clear task management across multiple stakeholders.
*   A timeline view in the project calendar to ensure coordination between delivery and installation.
*   A communication log (customer, partner, internal) to keep everyone aligned throughout the project.

This makes projects in Omnium especially useful for businesses where sales and services overlap and where customer satisfaction depends on smooth execution across several teams.
