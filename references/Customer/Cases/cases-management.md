# Managing Cases

Source: https://docs.omnium.no/docs/Customer/Cases/cases-management

> Working with cases in the Omnium UI — list view, creating cases from the list, orders and order lines, editing, assigning, status changes, linking, deleting, and the AI assistant.

## Cases List View

Open the cases list from **Customers → Cases → Cases** in the Omnium navigation. The list shows each case's subject, status, created date, priority, customer, assigned user, and modified date or follow-up date.

### Search and Filtering

| Filter | Description |
| --- | --- |
| **Search** | Free-text search across the subject, case number, customer name, customer email and tags. Near matches are found too, so a small typo still finds the case. The description is not searched |
| **My cases** | Shows only the cases assigned to you |
| **Status** | One status, or **All** |
| **Priority** | One priority |
| **Date range** | **From** and **To** on the date the case was created |
| **Show only** | **Without orders** or **Without customers**, to find cases that are not linked yet |

The active filters show as chips above the list. **Clear search** removes them all except **My cases**.

When the list opens, it uses the default status filter and sort order from the [case settings](cases-config.md#case-list-defaults). When you go back to the list from a case, it keeps the search, filters, sort order and page you had.

### Sorting

Click a column header to sort on **Subject**, **Status**, **Created**, **Priority**, **Customer**, **Assigned to**, **Modified** or **Follow-up date**. Sorting on priority follows each priority's severity.

### List Menu

| Menu item | Description |
| --- | --- |
| **New Case** | Creates a case and opens it. See [Creating a Case](cases-management.md#creating-a-case) |
| **Log** | Opens the event log for cases |

Each case in the list has a menu with **Edit** and **Delete**.

## Creating a Case

You can create a case in four places:

| Where | What happens |
| --- | --- |
| **New Case** in the cases list | Omnium creates an empty case at once and opens it. Set the subject, description, priority and the rest in **Details → Edit** |
| **Cases** tab on an order | **New Case** asks for a **Subject** and a **Description**. The case is linked to the order and gets the order's customer, store and market, with the source `Order` |
| **Create case** in the menu of an order line | The subject is filled in with the product name and SKU, for example `Rain jacket (RJ-100-M)`. The case is linked to the order, the SKU and the product, and gets the order's customer, store and market, with the source `Order` |
| [Inbound email](cases-inbound-email.md) or SMS | A message without a reference to an existing Omnium object creates a case with the source `Email` or `Sms` |

The **Cases** tab on orders and **Create case** on order lines are shown when [Cases is enabled](cases-config.md#enabling-cases). Private and business customers also have a **Cases** tab that lists their cases. Integrations create cases through the [API](cases-api.md), and agents can create cases with the [AI assistant](cases-management.md#ai-assistant).

Every new case gets:

| Field | Value |
| --- | --- |
| **Case number** | Generated from the [case number series](cases-config.md#case-numbers) |
| **Status** | **Status New**, unless a status is given |
| **Priority** | The **Default Priority**, unless a priority is given or a [priority rule](cases-config.md#priority-rules) matches an inbound email |
| **Assigned to** | The user who creates the case, unless someone else is given. A case from an inbound email or SMS has no assigned user |

## The Case View

The case view has a **Details** panel, a **Customer** panel and the notes. **Hide details** collapses the side panels to give the notes more room, and **Show details** brings them back. Your browser remembers the choice.

### Details

The **Details** panel shows the case number, priority, source, tags, description, the created, changed and follow-up dates, the assigned user, and the linked orders, customers and related products.

The **Details** menu has:

| Menu item | Description |
| --- | --- |
| **Edit** | Opens **Edit Case** |
| **Link To Order** | Links an order. See [Linking to Other Entities](cases-management.md#linking-to-other-entities) |
| **Link To Customer** | Links a customer. See [Linking to Other Entities](cases-management.md#linking-to-other-entities) |

The case's own menu has **Log**, which opens the event log of the case, and **Delete**.

### Edit Case

**Edit Case** has these fields:

| Field | Description |
| --- | --- |
| **Subject** | Title summarizing the case |
| **Description** | Detailed description of the issue |
| **Status** | Any configured status. See [Changing Status](cases-management.md#changing-status) for what this field does not do |
| **Priority** | One of the configured priorities |
| **Source** | Free text. Omnium itself sets `Email`, `Sms` or `Order` |
| **Follow-up date** | A date to come back to the case |
| **Tags** | The tags configured in the case settings |

Custom properties have no field in the UI. Integrations set them through the API.

### Customer

The **Customer** panel shows the name, email and customer ID of the case's customer. On a case from an inbound email, the sender's email address is matched to an existing customer. Linking an order replaces the customer with the order's customer.

### Assignment

Click **Assigned to** in the **Details** panel and pick a user to assign or reassign the case. Assigning a case can send a [case notification](cases-notes-and-communication.md#case-notifications) to the user or the customer.

### Dates

The case tracks these dates:

| Date | Description |
| --- | --- |
| **Created** | When the case was created |
| **Changed** | When the case was last changed |
| **Follow-up date** | Set by an agent. Omnium sends no reminder: a follow-up date in the past shows a warning icon in the list and in **Details**. Sort the list on **Follow-up date** to work through them |
| **Resolved date** | Set the first time the case moves to a status in one of the two highest levels, except the **Status for Cases in Progress**. It is not cleared when the case is reopened |
| **Closed date** | Set each time the case moves to **Status Closed**. It is not cleared when the case is reopened |

The resolved and closed dates are set only when the status changes with **Set to**, the AI assistant or the API's change status endpoint. See [Changing Status](cases-management.md#changing-status).

## Changing Status

A bar at the top of the case shows the configured statuses with a level above 0, in level order. It marks the current status and the statuses the case has been in. The bar shows progress only; you cannot click it.

You can change the status in these ways:

| Way | What happens |
| --- | --- |
| **Set to** _next status_ in **Details** | Moves the case to the status with the next higher level. Sets the resolved and closed dates, sends [case notifications](cases-notes-and-communication.md#case-notifications) and logs a status change event |
| **Status** in **Edit Case** | Sets any status and adds it to the status log, but sets no resolved or closed date, sends no case notification and logs no status change event |
| Automatically | **Status for Cases in Progress** on the first agent reply, and **Status Reopen** when a customer replies to a closed case. See [Status Designations](cases-config.md#status-designations) and [Email Threading](cases-notes-and-communication.md#email-threading) |
| [AI assistant](cases-management.md#ai-assistant) or the API's [change status endpoint](cases-api.md) | Works like **Set to**, but to any status |

Use **Set to** to close a case. A case closed with the **Status** field in **Edit Case** gets no closed date, so it is missing from resolution figures on the [dashboard](cases-dashboard.md).

The UI has no bulk actions: you change the status and the assignee one case at a time.

## Linking to Other Entities

| Entity | How to link it |
| --- | --- |
| **Orders** | **Details → Link To Order**: type the order ID. Omnium shows **Order not found** when no order has that ID. Linking an order also replaces the case's customer with the order's customer and adds that customer to the case's customers. Cases created from an order or order line, or from an email that mentions an order number like `#12345`, are linked automatically |
| **Customers** | **Details → Link To Customer**: search for a private or business customer. The customer is added to the case's customers; the **Customer** panel does not change |
| **Products and SKUs** | **Create case** on an order line links the line's product and SKU. They show as **Related products** and as charts on the [Dashboard](cases-dashboard.md) |
| **Projects** and **Carts** | Only through the [API](cases-api.md) |

Links cannot be removed in the UI.

## Participants

A case can hold a list of participants, each with a name, email, optional customer ID and role. Participants are set only through the [API](cases-api.md): the UI does not show them, and Omnium sends them no notifications.

## Deleting Cases

Delete a case with **Delete** in the case's menu or in its row in the list. Omnium asks you to confirm. Deletion is a soft delete: the case's status is set to `Deleted`, and the case no longer shows in the list. The UI cannot show deleted cases; integrations can read them through the [API](cases-api.md) with `IncludeDeleted`.

## AI Assistant

The Omnium AI assistant can work with cases for users who have access to cases:

| Tool | What it does |
| --- | --- |
| `case_triage` | Lists open, unassigned cases older than a number of hours (24 by default), most severe priority first |
| `list_cases` | Finds cases by status, priority, assigned user ("me", an email address or "nobody"), customer, order, or words in the subject, customer name or email, case number or tags |
| `get_case` | Reads one case with its notes in time order |
| `create_case` | Creates a case with a subject, description, priority and customer. The case is assigned to you unless you name someone else |
| `reply_to_case` | Emails the customer a reply from one of the reply templates, with the template's subject |
| `add_case_note` | Adds an internal note. It is not sent to the customer and does not change the status |
| `assign_case` | Assigns the case to a user, by email address, name or "me" |
| `change_case_status` | Moves the case to another status, like **Set to** |

The tools that change a case show a preview first and change nothing until you confirm.
