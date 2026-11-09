# Add Order Tags

Source: https://docs.omnium.no/docs/Order/workflow-steps/enrichment/add-order-tags

> Calculate and add default order tags based on shipment and customer data.

## Overview

The **Add Order Tags** step calculates and adds default tags to orders based on shipment characteristics and customer type. This enables order filtering and routing based on tags.

## Identifier

| Property | Value |
| --- | --- |
| **Key** | `AddOrderTags` |
| **Group** | Enrich |
| **Applicable Statuses** | New |

## Configuration Properties

This step has no configurable properties.

## Behavior

### What It Does

1.  Analyzes shipments to determine direct shipment status:
    *   Direct shipments have no expected delivery date and are fully reserved
    *   Checks for purchase order references
2.  Adds shipment-related tags:
    *   `DirectShipment` - All shipments are direct
    *   `PartialDirectShipment` - Some shipments are direct
    *   `NoDirectShipments` - No direct shipments
3.  Adds customer type tag:
    *   `B2B` - If customer type is B2B
4.  Deduplicates tags on order

### Prerequisites

*   Order should have shipments for shipment analysis

### Side Effects

*   Tags added to order
*   Tags deduplicated

## Business Cases

### When to Use

*   **Order routing**: Route based on direct/backorder status
*   **Filtering**: Filter orders by fulfillment type
*   **Notifications**: Different templates for different types

### Example Scenarios

**Scenario 1: Direct Shipment** All items in stock and reserved. Order gets "DirectShipment" tag.

**Scenario 2: Partial Direct** Some items direct, some on backorder. Order gets "PartialDirectShipment" tag.

**Scenario 3: B2B Order** Business customer order. Order gets "B2B" and appropriate shipment tag.

## Error Handling

| Condition | Result | Continues Workflow? |
| --- | --- | --- |
| Tags added | Success | Yes |

## Related Steps

*   [Add Custom Tags](add-custom-tags.md) - Add configured tags
*   [Add Order Tags by Category ID](add-order-tags-by-category-id.md) - Category-based tags
