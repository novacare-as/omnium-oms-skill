# Order Logging

Source: https://docs.omnium.no/docs/Order/order-logging

> Understanding the logging and audit trail features on orders in Omnium, including event log, order status log, workflow execution results, comments, and errors.

## Overview

Omnium provides several logging and audit trail features for orders. Each serves a different purpose and can be used independently.

| Feature | What It Tracks | Storage | Always Active? | Configuration |
| --- | --- | --- | --- | --- |
| [Event Log](https://docs.omnium.no/docs/Order/event-log) | All order operations (status changes, workflows, payments, notifications, errors) | Search index | Yes | Retention via `EventLogOrderPreservationDays` |
| [Order Status Log](https://docs.omnium.no/docs/Order/order-status-log) | Shipment status transitions with timestamps and duration | On the Shipment object | No | `OrderSettings.UseOrderStatusLog` |
| [Workflow Execution Results](https://docs.omnium.no/docs/Order/workflow-execution-results) | Result of each workflow step (success/failure, duration, errors) | Attached to Event Log entries | Yes | None |
| [Order Comments](https://docs.omnium.no/docs/Order/order-comments) | Manual notes and customer communication | Search index | Yes | Comment templates in `OrderSettings` |
| [Order Errors](https://docs.omnium.no/docs/Order/order-errors) | Processing failures on an order | On the Order object | Yes | None |
| [Verbose Logging](https://docs.omnium.no/docs/Order/verbose-logging) | Detailed per-step workflow execution events | Event Log (search index) | No | `OrderSettings.UseVerboseLogging` |
