# Check For Fraud

Source: https://docs.omnium.no/docs/Order/workflow-steps/validation/check-for-fraud

> Run fraud detection checks on orders using configured fraud service connector.

## Overview

The **Check For Fraud** step runs fraud detection analysis on orders using a configured fraud service connector. This helps identify potentially fraudulent orders before processing.

## Identifier

| Property | Value |
| --- | --- |
| **Key** | `CheckForFraud` |
| **Group** | Validation |
| **Applicable Statuses** | New |
| **Hidden** | Yes |

## Configuration Properties

| Property | Type | Required | Default | Description |
| --- | --- | --- | --- | --- |
| `Connector` | String | Yes | \- | Name of fraud detection connector to use |

## Behavior

### What It Does

1.  Retrieves the fraud detection connector from tenant settings
2.  Validates connector exists (throws exception if not found)
3.  Checks if connector is available for the order's market
4.  If available, runs fraud check against the configured fraud detection provider
5.  Returns fraud check result

### Prerequisites

*   Fraud detection connector must be configured in tenant settings
*   Connector must be available for the order's market

### Side Effects

*   Fraud check results may update order properties
*   Fraud service may log fraud signals

## Business Cases

### When to Use

*   **High-value orders**: Check orders above certain thresholds
*   **New customers**: Additional verification for first-time buyers
*   **Risk markets**: Orders from regions with higher fraud rates

### Example Scenarios

**Scenario 1: Fraud Detected** Fraud service identifies suspicious signals. Order flagged for manual review.

**Scenario 2: Market Not Available** Connector not configured for order's market. Step returns success, skipping check.

**Scenario 3: Clean Order** Fraud check passes. Order continues through workflow.

## Error Handling

| Condition | Result | Continues Workflow? |
| --- | --- | --- |
| Connector not found | Exception thrown | No |
| Market not available | Success (skipped) | Yes |
| Fraud check passes | Success | Yes |
| Fraud detected | Result from fraud service | Depends on service |

## Related Steps

*   [Validate Order](validate-order.md) - General order validation
