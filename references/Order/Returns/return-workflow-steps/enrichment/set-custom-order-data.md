# Set Custom Order Data

Source: https://docs.omnium.no/docs/Order/Returns/return-workflow-steps/enrichment/set-custom-order-data

> Enrich return data from a custom connector implementation.

## Overview

The **Set Custom Order Data** step enriches the return with additional data from a custom connector. This allows for flexible integration with external systems that can provide supplementary information during return processing.

## Identifier

| Property | Value |
| --- | --- |
| **Key** | `SetCustomOrderData` |
| **Group** | Enrichment |

## Configuration Properties

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| Connector | string | Yes | The custom data connector to use |

Additional properties can be passed to the connector.

## Behavior

### What It Does

1.  Calls the configured custom connector with return data
2.  Receives enrichment data from the connector
3.  Applies returned data to the return order
4.  May update properties, metadata, or other return attributes

### Prerequisites

*   Custom connector must be configured and active
*   Connector must implement the custom order data interface
*   External system must be accessible

### Side Effects

*   Updates return with custom data
*   May modify properties, tags, or metadata
*   Creates enrichment log entries

## Business Cases

### When to Use

*   Adding data from external systems during processing
*   Custom business logic that modifies return data
*   Integration with specialized systems
*   Dynamic data enrichment based on return contents

### Example Scenarios

**Warranty Check** Connector checks if returned items are under warranty and adds warranty status to return properties.

**Fraud Scoring** Connector evaluates return against fraud patterns and adds risk score to return metadata.

**Supplier Information** Connector retrieves supplier return instructions for defective items and adds to return notes.

## Sample Configuration

```json
{
  "Name": "SetCustomOrderData",
  "Active": true,
  "Connector": "CustomReturnEnricher",
  "TranslateKey": "WorkflowStep_CustomEnrichment",
  "Properties": [
    { "Name": "IncludeWarrantyCheck", "Value": "true" }
  ]
}
```

## Error Handling

| Condition | Result | Continues Workflow? |
| --- | --- | --- |
| Enrichment successful | Success | Yes |
| Connector not found | Error | Depends on StopOnError |
| External system error | Error | Depends on StopOnError |
| No data returned | Success (no changes) | Yes |

## Related Steps

*   [Ensure RMA](ensure-rma.md) - Generate identifiers
*   [Generate External ID](generate-external-id.md) - Create external references
