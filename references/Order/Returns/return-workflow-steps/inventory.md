# Inventory Workflow Steps

Source: https://docs.omnium.no/docs/Order/Returns/return-workflow-steps/inventory

> Workflow steps for managing inventory when processing returns.

## Overview

Inventory workflow steps handle stock adjustments when returns are processed. They ensure returned items are added back to available inventory when appropriate.

## Available Steps

| Step | Key | Description |
| --- | --- | --- |
| [Update Inventory](inventory/update-inventory.md) | `UpdateInventory` | Increase inventory for returned items |

## Inventory Update Logic

The inventory update respects the return type configuration:

*   If the return type has `UpdateInventory: true` (default), items are added back to stock
*   If the return type has `UpdateInventory: false`, items are not restocked (e.g., defective items)

The update also respects the "Update Stock" checkbox selection made when creating the return.
