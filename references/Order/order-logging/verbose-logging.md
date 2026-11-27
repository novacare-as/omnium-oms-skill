# Verbose Logging

Source: https://docs.omnium.no/docs/Order/order-logging/verbose-logging

> Optional detailed logging that creates individual Event Log entries for every workflow step execution, useful for troubleshooting.

## Verbose Logging

Verbose Logging is an optional feature that creates additional [Event Log](event-log.md) entries for every individual workflow step execution. This is useful for troubleshooting workflow issues but comes with a performance cost.

### What It Adds

**Without verbose logging** (default), the Event Log records:

*   Workflow **started** event
*   Workflow **completed** event (with aggregated results as attachments)

**With verbose logging enabled**, you also get:

*   Individual **step execution** events (category: `Information`) for each workflow step
*   **Skipped steps** with reasons why they were skipped
*   Detailed timing for each step

This makes it much easier to diagnose which specific step failed or why a step was skipped, without needing to parse the aggregated workflow results.

### Configuration

Enable verbose logging in your tenant settings:

```
"OrderSettings": {
  "UseVerboseLogging": true
}
```

Verbose logging significantly increases the number of Event Log entries created per order. This can impact search-index storage and query performance. Use it for troubleshooting, but consider disabling it in production once the issue is resolved.
