# Scrolling

Source: https://docs.omnium.no/docs/Integrations/scrolling

> Scrolling retrieves large datasets efficiently with a consistent order. Ideal for bulk processing and reporting, it requires proper scrollId management and completion.

## Retrieving Large data sets efficiently

**Scrolling** is a method designed for retrieving large sets of data from our APIs in a consistent and efficient manner. It is particularly useful when you need to process all items matching a search or filter request, and the result set is too large to be managed with standard pagination techniques.

Unlike traditional pagination, which returns results in discrete pages (using parameters like `page` and `take`), scrolling creates a snapshot of the current state of the data at the time of the request. This ensures that the order of the documents remains consistent throughout the scroll, regardless of any updates or changes made to the data during the process.

#### Key Features of Scrolling:

1.  **Consistency**: Scrolling operates by taking a snapshot of the documents that match your query at the time the scroll request is made. This means that once a scroll has started, any changes to the documents (such as updates, additions, or deletions) will not affect the documents being returned. This ensures that you receive all relevant documents in the same order throughout the scroll.

2.  **Scroll ID**: When performing a scroll search, the API returns a `scrollId` with the initial batch of documents. This `scrollId` must be used in subsequent requests to fetch the remaining documents. You can continue the scroll operation by passing the `scrollId` to the designated scroll endpoint. For example:
    `/products/scroll/{id}`
    where `{id}` is the `scrollId` provided in the previous response.

    The `scrollId` returned by the initial search may change with each subsequent request to the `/products/scroll/{id}` endpoint as you retrieve each batch. Each batch will return a new `scrollId`, which must be used for the next request. Always ensure that the latest `scrollId` is used to fetch the remaining documents, and continue this process until all results are retrieved and no further `scrollId` is returned.

    **Note:** The scrollId may or may not change with each request. In some cases, the same scrollId is reused across multiple calls, and this is expected behavior. It does not mean the same documents are returned.

3.  **Use Case**: Scrolling is best suited for scenarios where you need to retrieve and process the entire dataset in batches, such as data migration, bulk processing, or reporting. It is **not** intended for real-time or interactive requests, where users are browsing or navigating through data.

4.  **Rate Limits**: Rate limits are stricter on scroll endpoints compared to other API operations. It is crucial to manage scroll requests efficiently to avoid hitting rate limits, especially when working with large datasets. Avoid sending concurrent scroll requests to initial scroll searches to prevent rate limit violations. Rate limits on the endpoints that accepts a `scrollId` are less strict as they do not create a new scroll context.

5.  **Completion**: It is essential to **always finish a scroll**. Unfinished scroll operations will remain open and continue to consume resources on the server. This can negatively impact performance and resource allocation, particularly when handling multiple scroll requests. Ensure that each scroll is properly completed or terminated to free up resources.

#### Example Workflow:

1.  **Initial Request**: Submit a search request that supports scrolling. This request will return a batch of results along with a `scrollId` to continue the scroll.

2.  **Subsequent Requests**: Use the `scrollId` to request the next batch of results by calling the scroll endpoint. Continue this process, ensuring that you always use the latest `scrollId` returned by each batch, until all data is retrieved.

3.  **Completion**: The scroll operation is complete when no additional results are returned by the scroll endpoint, at which point the `scrollId` becomes obsolete.

#### Best Practices:

*   Ensure that your system can handle large volumes of data returned by a scroll operation.
*   Use the scroll API in situations where you need to retrieve **all** documents for a specific query, rather than for paginated browsing.
*   Always finish a scroll to avoid leaving open operations that consume resources unnecessarily.
*   Be aware of the stricter rate limits on scroll endpoints and avoid concurrent scroll requests to stay within those limits.
*   Limit the duration of a scroll session, as `scrollId`s may expire after 5 minutes of inactivity.
