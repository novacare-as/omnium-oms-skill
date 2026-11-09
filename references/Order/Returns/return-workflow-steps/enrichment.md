# Enrichment Workflow Steps

Source: https://docs.omnium.no/docs/Order/Returns/return-workflow-steps/enrichment

> Workflow steps for enriching return data with RMA numbers, external IDs, and custom data.

## Overview

Enrichment workflow steps add additional data to returns during processing. They generate tracking identifiers, external system references, and custom data from configured sources.

## Available Steps

| Step | Key | Description |
| --- | --- | --- |
| [Ensure RMA](enrichment/ensure-rma.md) | `EnsureRma` | Generate RMA (Return Merchandise Authorization) number |
| [Generate External ID](enrichment/generate-external-id.md) | `GenerateExternalId` | Create unique external identifier for the return |
| [Set Custom Order Data](enrichment/set-custom-order-data.md) | `SetCustomOrderData` | Enrich return with data from custom connector |

## Common Patterns

### RMA Number Generation

The `EnsureRma` step generates a unique RMA number for tracking the return. This number can be:

*   Printed on return labels
*   Used for customer communication
*   Referenced in external systems

### External System Integration

Use `GenerateExternalId` to create identifiers that match external system requirements, and `SetCustomOrderData` to pull additional data from custom integrations.
