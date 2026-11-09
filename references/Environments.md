# Environments

Source: https://docs.omnium.no/docs/Environments

> Understand Omnium's three environments — Dev, Test, and Production — along with rate limits and concurrency controls.

Omnium provides three environments for development, testing, and production use. Dev and Test share the same underlying data (except settings), while Production is fully isolated. Each environment follows a structured release cadence — changes flow from Dev to Test to Production on a weekly schedule.

Understanding environment differences, shared data boundaries, and rate limits is essential for building reliable integrations.

* * *

## In this section

*   [Test & Dev Environments](Environments/test-dev.md) — Environment URLs, shared data, release cadence, and settings copy
*   [Rate Limits](Environments/rate-limits.md) — Concurrency limits, token bucket system, and handling 429 responses
*   [Operations](Environments/operations.md) — Monitoring, data maintenance, performance tuning, and operational checklists

* * *

## Release cycle

Omnium ships a new release every week, and each release moves through the environments in a fixed order. Changes land continuously in Dev. Every Tuesday the release that has been validated in Test is deployed to Production, and the next release is promoted to Test immediately after.

Because a new release enters the cycle each week, all three stages are always occupied. While one release is live in Production, the next is being validated in Test and the one after it is still accumulating changes in Dev.

Dev is updated continuously, so week 1 represents the changes gathering for the next release rather than a fixed window. To see which release is currently in Test, check the Upcoming Release heading in the [release notes](Releasenotes.md).
