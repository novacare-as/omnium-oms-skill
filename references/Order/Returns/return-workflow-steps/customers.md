# Customer Workflow Steps

Source: https://docs.omnium.no/docs/Order/Returns/return-workflow-steps/customers

> Workflow steps for updating customer data and loyalty programs based on returns.

## Overview

Customer workflow steps handle updates to customer records and loyalty programs when returns are processed. They ensure loyalty points are reversed appropriately when items are returned.

## Available Steps

| Step | Key | Description |
| --- | --- | --- |
| [Update Customer Club](customers/update-customer-club.md) | `UpdateCustomerClub` | Reverse loyalty points earned on the original order when items are returned |

## Loyalty Point Handling

When a return is processed, previously earned loyalty points may need to be reversed. The `UpdateCustomerClub` step handles this by:

1.  Calculating points that were earned on the returned items
2.  Deducting those points from the customer's balance
3.  Recording a point cancellation transaction
