# Validation Steps

Source: https://docs.omnium.no/docs/Order/workflow-steps/validation

> Workflow steps for validating orders, payments, and data integrity.

## Overview

Validation steps verify order data, payment status, and business rules before allowing orders to progress through the workflow. They act as gates to ensure data integrity and completeness.

## Available Steps

| Step | Key | Description |
| --- | --- | --- |
| [Validate Order](validation/validate-order.md) | `ValidateOrder` | Run order validators for data integrity |
| [Check For Fraud](validation/check-for-fraud.md) | `CheckForFraud` | Run fraud detection checks |
| [Verify Completely Paid](validation/verify-completely-paid.md) | `VerifyCompletelyPaid` | Verify order is 100% paid |
| [Verify Capture Is Completed](validation/verify-capture-is-completed.md) | `VerifyCaptureIsCompleted` | Verify payment captures succeeded |
| [Validate Default External ID](validation/validate-default-external-id.md) | `ValidateDefaultExternalId` | Validate required external ID exists |
| [Validate Serial Numbers](validation/validate-serial-numbers.md) | `ValidateSerialNumbers` | Validate serial numbers on serializable products |
| [Validate Tracking Number](validation/validate-tracking-number.md) | `ValidateTrackingNumber` | Validate shipment tracking numbers |
| [Validate Colli Count](validation/validate-colli-count.md) | `ValidateColliCount` | Validate package count on shipments |

## Common Use Cases

### Pre-Processing Validation

Before processing orders, validate data completeness:

```
New Order → ValidateOrder → ValidateDefaultExternalId → Continue
```

### Payment Verification

Ensure payments are complete before fulfillment:

```
Before Ship → VerifyCompletelyPaid → VerifyCaptureIsCompleted → Ship
```

### Pre-Ship Validation

Validate shipment data before completing:

```
Ship → ValidateSerialNumbers → ValidateTrackingNumber → ValidateColliCount → Complete
```

## Validation Behavior

Most validation steps follow this pattern:

1.  **Check condition** - Evaluate if validation criteria are met
2.  **Return result** - Success if valid, Error if invalid
3.  **Cancel workflow** - Many validation steps cancel the workflow on failure to prevent invalid orders from progressing

This ensures orders only progress when all required data is present and valid.
