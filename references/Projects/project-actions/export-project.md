# Export Project

Source: https://docs.omnium.no/docs/Projects/project-actions/export-project

> Configure the ExportProject project action to send project data to external systems via a connector.

## Overview

The **Export Project** action exports the current project to an external system using a configured connector. This is useful for integrating project workflows with ERPs, CRMs, third-party ticketing systems, or any external platform that needs to receive project data.

When this action executes, Omnium calls the specified connector's `Export` method with the full project object and any configured properties. The result determines whether the workflow continues or stops.

**Key behaviours:**

*   The export is **awaited** — the workflow waits for the export to complete before moving to the next action
*   On success, any previous `ProjectExportError` is cleared from the project
*   On failure with `StopOnError: true`, a `ProjectExportError` is added to the project and the workflow is cancelled
*   On failure with `StopOnError: false`, the result is downgraded to a warning and the workflow continues

## Identifier

| Property | Value |
| --- | --- |
| **Key** | `ExportProject` |
| **Group** | Project Actions |

* * *

## Configuration

### Minimum Required Configuration

At minimum you must specify a connector:

```json
{
  "name": "ExportProject",
  "Connector": "Webhook"
}
```

### All Available Options

| Property | Required | Type | Description | Example |
| --- | --- | --- | --- | --- |
| **name** | Yes | string | Must be `ExportProject` | `"ExportProject"` |
| **Connector** | Yes | string | The name of the connector to use for the export | `"Webhook"`, `"AzureStorageQueue"` |
| **StopOnError** | No | boolean | Stop the workflow and flag an error on the project if the export fails | `true` or `false` (default: `false`) |
| **Properties** | No | array | Key-value pairs passed directly to the connector's export implementation | See below |
| **TranslateKey** | No | string | Translation key shown in the UI action log on success | `"ProjectExported"` |

> **Note:** `ConnectorId` is not supported on project actions. Only one connector per type can be used. If you need to route to different queues, use separate connector types or configure the desired connector as the default for that type.

### Example Configurations

**Export to Azure Storage Queue:**

```json
{
  "name": "ExportProject",
  "Connector": "AzureStorageQueue"
}
```

**Critical export — stop workflow on failure:**

```json
{
  "name": "ExportProject",
  "Connector": "AzureStorageQueue",
  "StopOnError": true
}
```

* * *

## Azure Storage Queue Setup

Omnium supports exporting projects to an **Azure Storage Queue**. This is the recommended approach for async integrations where a downstream system polls or reacts to queue messages.

### Sharing a connector with order/customer exports

If you are already using `AzureStorageQueue` for exporting orders or customers, you do **not** need a separate connector. Each exporter reads a different queue name property from the same connector configuration:

| Exporter | Property key read |
| --- | --- |
| Orders | `OrderQueueName` |
| Projects | `ProjectQueueName` |

This means you can add `ProjectQueueName` to your existing connector and projects will be routed to their own queue automatically, with no other changes required.

### Step 1: Configure the Connector in Tenant Settings

If you already have an `AzureStorageQueue` connector, add `ProjectQueueName` to its properties:

```json
{
  "Connectors": [
    {
      "Name": "AzureStorageQueue",
      "Type": "integration",
      "ConnectorId": "claim-order",
      "Properties": [
        {
          "Key": "ConnectionString",
          "Value": "DefaultEndpointsProtocol=https;AccountName=yourAccount;AccountKey=YOUR_KEY;EndpointSuffix=core.windows.net"
        },
        {
          "Key": "OrderQueueName",
          "Value": "orders-queue"
        },
        {
          "Key": "ProjectQueueName",
          "Value": "projects-queue"
        }
      ]
    }
  ]
}
```

If you do not have an existing `AzureStorageQueue` connector, add the connector with at minimum `ConnectionString` and `ProjectQueueName`.

### Step 2: Configure the Project Action

In your project type status workflow:

```json
{
  "name": "ExportProject",
  "Connector": "AzureStorageQueue",
  "StopOnError": true
}
```

> **Note:** Project actions select the connector by name only. `ConnectorId` is not supported on project actions, so only one `AzureStorageQueue` connector can be used at a time.

* * *

## Export Behaviour

### On Success

*   Action status is set to `Success`
*   The `ProjectExportError` error (if previously set) is removed from the project
*   The workflow continues to the next action
*   The `TranslateKey` (if configured) is shown in the UI action log

### On Failure — `StopOnError: false` (default)

*   Action status is set to `Warning`
*   The workflow **continues** to the next action
*   The error reason is recorded in the action result

### On Failure — `StopOnError: true`

*   Action status is set to `Error`
*   A `ProjectExportError` error with severity `Error` is added to the project
*   The workflow is **cancelled** — no further actions in the current workflow run

* * *

## Error Handling

| Condition | Result | Continues Workflow? |
| --- | --- | --- |
| Export successful | Success | Yes |
| Export failed (`StopOnError: false`) | Warning | Yes |
| Export failed (`StopOnError: true`) | Error + `ProjectExportError` on project | No |
| Unhandled exception | Error | No |

* * *

## Troubleshooting

### Export not executing

1.  Confirm `"name": "ExportProject"` is spelled correctly (case-sensitive)
2.  Verify the connector name matches the connector configured in Tenant Settings
3.  Check the project's workflow log for error details

### Export failing

1.  Check the project for a `ProjectExportError` — the `ErrorReason` field contains the message from the connector
2.  For Webhook connectors: verify the endpoint URL is reachable and authentication is correct
3.  For Azure queue connectors: verify the connection string and queue/topic name are correct

### Workflow stops unexpectedly

Check whether `StopOnError: true` is set. If the export fails with this setting, the workflow is intentionally cancelled and the project will have a `ProjectExportError` error attached.

* * *

## Related

*   [Project Actions overview](../project-actions.md)
*   [Export Order workflow step](../../Order/workflow-steps/export/export-order.md) — the equivalent action for orders
