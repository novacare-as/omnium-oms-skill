# Dashboard & Analytics

Source: https://docs.omnium.no/docs/Customer/Cases/cases-dashboard

> Cases dashboard with key numbers, charts by status, priority, assignee, source, tag, SKU and product, filtering, and the My cases panel on My page.

The Cases Dashboard provides an overview of your case workload and trends. Open it from **Customers → Cases → Dashboard**. Deleted cases are never counted.

## Key Numbers

Four figures are displayed at the top of the dashboard:

| Figure | Description |
| --- | --- |
| **Open Cases** | Cases that are not in **Status Closed**. Cases in other statuses, such as a resolved status, count as open. When **Status Closed** is not set, a status named `Closed` counts as closed |
| **Unassigned Cases** | Open cases with no assigned user |
| **Avg resolution time** (days) | The average number of days from creation to the resolved date, for the cases that have a resolved date. A case gets a resolved date only when its status changes with **Set to**, the AI assistant or the API's change status endpoint. See [Dates](cases-management.md#dates) |
| **Created This Week** | Cases created in the last 7 days |

## Charts

The dashboard includes several charts that break down cases by different dimensions. Each chart has a fixed chart type.

### Cases by Status

Distribution of cases across the statuses. Quickly identify bottlenecks (e.g., too many cases stuck in "New").

### Cases Over Time

Cases created per day over the last 90 days. Useful for spotting trends and seasonal patterns.

### Cases by Assignee

Shows how cases are distributed among team members. Useful for workload balancing.

### Cases by Priority

Breakdown by priority. Helps assess the severity distribution of cases.

### Cases by Source

Distribution by case origin (`Email`, `Sms`, `Order` or a source an agent typed). Reveals which channels generate the most support requests.

### Top Tags

The 10 most used tags. Identifies common issue categories.

### Cases by SKU and Cases by Product

Two charts that show which SKUs and which products the cases are linked to. Helps identify products with recurring issues. Cases are linked to SKUs and products when they are created from an order line, or through the API.

## Filtering

The dashboard supports filters to narrow the data:

| Filter | Description |
| --- | --- |
| **My cases** | Only the cases assigned to you |
| **Status** | One status |
| **Priority** | One priority |
| **Date range** | Cases created in this period |
| **Show only** | **Without orders** or **Without customers**, as in the case list |

Filters apply to all figures and charts at the same time.

## My Cases on My Page

When [Cases is enabled](cases-config.md#enabling-cases), **My page** has a **My cases** panel for the signed-in user. It shows how many open cases (not in **Status Closed**) are assigned to the user, and a chart of the user's cases created in the period chosen on My page.
