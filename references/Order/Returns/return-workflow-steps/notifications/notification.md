# Notification

Source: https://docs.omnium.no/docs/Order/Returns/return-workflow-steps/notifications/notification

> Send email or SMS notifications to customers about return status changes.

## Overview

The **Notification** step sends communications to customers about their return. It supports email and SMS channels and uses configured notification templates to format messages with return details.

## Identifier

| Property | Value |
| --- | --- |
| **Key** | `Notification` |
| **Group** | Notifications |

## Configuration Properties

This step has no configurable properties. Notification templates, recipients, and channels (email/SMS) are configured in the notification system, not as step properties.

## Behavior

### What It Does

1.  Retrieves customer contact information from the return/order
2.  Selects appropriate notification template based on return status
3.  Populates template with return details (RMA, items, amounts)
4.  Sends notification via configured channel (email/SMS)
5.  Records notification status on the return

### Prerequisites

*   Customer must have valid contact information (email/phone)
*   Notification templates must be configured
*   Notification provider must be active

### Side Effects

*   Sends email/SMS to customer
*   Records notification in return history
*   May update notification delivery status

### Attach the Credit Note

Select the **Credit notes** attachment on the return notification to send the credit note PDF of the return with the email. The credit note must exist when this step runs, so place [Create Credit Note](../payment/create-credit-note.md) before Notification, in the same return status or in a status the return passes through earlier. Do not turn on **Run after order is saved** for Create Credit Note unless Notification has it too. An email for a return without a credit note has no credit note attached.

## Business Cases

### When to Use

*   Confirming return creation to customer
*   Notifying when items are received
*   Confirming refund processing
*   Providing return shipping labels

### Example Scenarios

**Return Created Notification** Return is created with RMA-2024-001. Customer receives email: "Your return request has been received. Your RMA number is RMA-2024-001."

**Refund Processed Notification** Return completed with $150 refund. Customer receives: "Your refund of $150 has been processed and will appear on your statement within 5-7 business days."

**Return Label Notification** Return created with shipping label. Customer receives email with PDF label attachment and return instructions.

## Sample Configuration

```json
{
  "Name": "Notification",
  "Active": true,
  "TranslateKey": "WorkflowStep_ReturnNotification"
}
```

## Error Handling

| Condition | Result | Continues Workflow? |
| --- | --- | --- |
| Notification sent | Success | Yes |
| No contact information | Warning | Yes |
| Template not found | Warning | Yes |
| Provider error | Error | Depends on StopOnError |
| Email/SMS delivery failed | Warning | Yes |

## Related Steps

*   [Ensure RMA](../enrichment/ensure-rma.md) - Generate RMA before notification
*   [Create Return Shipment Booking](../shipments/create-return-shipment-booking.md) - Generate label before sending
*   [Create Credit Note](../payment/create-credit-note.md) - Issue the credit note before sending
