# Delta Queries

Source: https://docs.omnium.no/docs/Integrations/delta

> Learn how to use delta queries in Omnium to efficiently retrieve only the data that has changed since a specific timestamp, helping you keep your system synchronized with updates in Omnium.

## API Endpoints

The following API endpoints in Omnium support delta queries. Use these to retrieve the changed data:

*   **[Search Orders](https://api.omnium.no/documentation/index.html#/Orders/OrdersSearchOrders)**
*   **[Search Products](https://api.omnium.no/documentation/index.html#/Products/ProductsSearchProducts)**
*   **[Search Private Customers](https://api.omnium.no/documentation/index.html#/Customers%20%7C%20B2C/PrivateCustomersSearch)**
*   **[Search Business Customers](https://api.omnium.no/documentation/index.html#/Customers%20%7C%20B2B/BusinessCustomersSearch)**

* * *

## 📖 Recommended Reading

**Read the [Data Out guide](data-out.md) first** - especially the **[Example Use Case: Exporting Product Data for External Systems](data-out.md#example-use-case-exporting-product-data-for-external-systems)** section for real-world patterns and best practices.

* * *

## Performing Delta Queries

### 1\. Prepare Your Request

When making a request to the delta query endpoint, include a `timestamp` parameter indicating the point in time from which you want to retrieve changes. This could be the timestamp of the last successful synchronization.

### 2\. Process the Response

The response from Omnium will contain data that has changed since the specified timestamp. Depending on your requirements, you can:

*   Add new records.
*   Update existing records.
*   Take other actions necessary to reflect changes in Omnium.

### Example Workflow

1.  **Send a Request:** Include the `timestamp` parameter in your API request.
2.  **Extract Data:** Process the response to extract the relevant information.
3.  **Update Your System:** Apply changes, such as adding or updating records.

* * *

## Best Practices

### Error Handling

Implement error handling mechanisms to manage situations where requests fail or encounter issues. Key strategies include:

*   **Retry Mechanisms:** Automatically retry failed requests.
*   **Logging:** Record issues for debugging and tracking.
*   **Fallbacks:** Ensure no changes are missed due to partial failures.

### Scheduling Delta Queries

Set up a schedule for executing delta queries based on your synchronization needs:

*   Frequent updates for critical data.
*   Periodic updates for less critical information.

### Testing Before Deployment

Thoroughly test your delta query implementation in a test environment before deploying it in production. This ensures:

*   Any potential issues are identified.
*   Functionality works as intended.
