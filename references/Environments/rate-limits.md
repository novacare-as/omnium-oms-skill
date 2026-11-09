# Rate Limits

Source: https://docs.omnium.no/docs/Environments/rate-limits

Omnium uses concurrency limits and a token bucket system to keep the API stable and predictable for everyone. It’s for your own protection!

## Default Rate Limits

Unless otherwise agreed, the following limits apply to most tenants:

| Limit type | Default value |
| --- | --- |
| Concurrent requests (general) | 20 concurrent requests |
| Token bucket | Capacity 12 000 tokens; refill 1 000 tokens every 10 seconds |
| Batch update operations (such as POST api/Products/UpdateMany) | Max 4 concurrent operations (recommendation: process synchronously) |
| High traffic endpoints (product & inventory read operations) | Up to 150 concurrent requests |

Rate limits are applied **per API user** (API key). In addition, there’s a **tenant-wide concurrency limit of 40** to protect shared resources.

⚠️ **Disclaimer:** These limits are current defaults and may change over time as we tune capacity and protect platform stability. Please also use good judgment - avoid spamming the API and help keep the platform healt️hy for everyone✌️

**💡 Concurrency vs. Requests per Second**

**Concurrency** = how many requests are being processed at the same time.
Example: if each request takes 20–80 ms and you have a **20-concurrent limit**, you can usually process about **250–1000 requests per second** (because requests finish and free up slots quickly).

## Endpoint Exceptions

High traffic endpoints read operations are explicitly excluded from the 20-concurrent limit and support a much higher concurrent requests limit. These endpoints are designed to be far more forgiving.

## Dedicated vs. Multi-Tenant Environments

**Dedicated environments**
Customers on a dedicated environment can have rate limits disabled or tailored to their needs.

**Multi-tenant environments**
Default limits apply. In very rare cases, we may temporarily adjust rate limits for a specific tenant to protect overall multi-tenant platform stability.

## Handling 429 Responses

If you receive HTTP 429 Too Many Requests:

*   Back off and retry with exponential backoff and jitter.
*   Consider lowering parallelism.

## Customization

Enterprise customers can request custom rate limit configurations. Contact us to discuss throughput, concurrency, or dedicated capacity.
