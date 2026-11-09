# Create Rental Project from Order

Source: https://docs.omnium.no/docs/Order/workflow-steps/rental/create-rental-project-from-order

> Creates a tracking project for each rental line item on a new order.

## Overview

The **Create Rental Project from Order** step creates a project for each rental line item on the order. The project tracks the rental period, the associated deposit, and the rental lifecycle through to return and deposit settlement.

One project is created per rental line. If the same order has three rental line items, three projects are created.

## Identifier

| Property | Value |
| --- | --- |
| **Key** | `CreateRentalProjectFromOrder` |
| **Group** | Project |
| **Applicable Statuses** | New |

## Configuration Properties

No additional properties are required. The project type is read from the tenant setting `rentalProjectTypeId` under **Configuration → Settings → Orders**.

This step has no effect if `rentalProjectTypeId` is not configured in the tenant settings. Ensure the setting is populated before activating this step.

## Behavior

### What It Does

1.  Iterates over all order line items.
2.  Identifies rental lines where `isRental` is `true` or the line has an `IsRental` property set to `"true"`.
3.  For each rental line, reads the `RentalFrom` and `RentalTo` properties from the line item to determine the rental period.
4.  Identifies any deposit line items linked to the rental line via the `DepositFor` property.
5.  Creates a project of the type configured in `rentalProjectTypeId`, marked as a rental project.
6.  Sets the rental period (`rentalFrom`, `rentalTo`) and customer data on the project.
7.  Links the project to the rental line item and its deposit line.

### Prerequisites

*   The order must have at least one line item with `isRental: true`.
*   `rentalProjectTypeId` must be configured in tenant settings.
*   Rental line items must carry `RentalFrom` and `RentalTo` properties in ISO 8601 format.

### Side Effects

*   Creates one project per rental line item.
*   Projects are of type `isRentalProject: true`.
*   Projects carry the following rental-specific fields:

| Field | Description |
| --- | --- |
| `rentalFrom` | Rental period start, taken from the order line's `RentalFrom` property |
| `rentalTo` | Rental period end, taken from the order line's `RentalTo` property |
| `totalRentalDepositAmount` | Deposit amount taken from the linked deposit line item |

## Business Cases

### When to Use

*   Any order type that supports rental products and requires lifecycle tracking through the project module.
*   When you need to track deposit withholding, partial refunds, or rental return status per rental item.

### Example Scenario

An order contains two line items: a rental bicycle (`isRental: true`) for 7 days, and its associated deposit line (`DepositFor: "rental-001"`).

After this step runs:

*   One project is created for the bicycle rental.
*   The project records the 7-day rental period and the deposit amount.
*   When the customer returns the bicycle, staff update the project and use the [Refund Rental Deposit](../../../Projects/project-actions/refund-rental-deposit.md) project action to credit the deposit back (minus any withheld amount for damage).

## Error Handling

| Condition | Result | Continues Workflow? |
| --- | --- | --- |
| No rental lines on order | No action taken | Yes |
| `rentalProjectTypeId` not configured | No projects created | Yes |
| Project creation fails | Error logged per line | Yes |

## Related

*   [Rental Overview](../../Rental/rental-overview.md) — How rental products and order lines are structured
*   [Refund Rental Deposit](../../../Projects/project-actions/refund-rental-deposit.md) — Project action for refunding the deposit at end of rental
