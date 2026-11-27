# Bonus Points

Source: https://docs.omnium.no/docs/plugins/Payments/bonusPoints

> Configure Bonus Points loyalty payment with Omnium for customer club point redemption.

## Bonus Points Integration with Omnium

Omnium supports **Bonus Points** as a payment method, allowing customers to redeem loyalty points from their customer club membership as payment for orders.

### Supported Features

*   **Authorize** (reserve) bonus points
*   **Capture** redeemed points
*   **Cancel** point reservations
*   **Credit/Refund** points back to customer
*   **Release remaining** uncaptured authorization

* * *

## Setup Instructions

### Configuration Path

1.  Navigate to: `Configuration > Settings > Payment > Payment Types > "..." > Add`

2.  Fill out the required fields as outlined below.

* * *

## Required Fields

| **Field** | **Description** | **Value** |
| --- | --- | --- |
| **Unique Payment Name** | The unique identifier for the Bonus Points payment method. | `BonusPoints` |
| **Payment Service** | The name of the payment service used for this configuration. | `BonusPoints` |
| **Provider Name** | Specifies which provider to use. | `BonusPoints` |
| **Display Name** | The name shown in the Omnium interface. | `Loyalty Points` or your preferred name |

* * *

## Optional Configuration

| **Field** | **Description** | **Default** |
| --- | --- | --- |
| **Display in Cart** | Show bonus points option in payment selection | `false` |
| **Requires Credit** | Only show if customer has available points | `false` |
| **Credit Priority** | Order for refund processing (lower = higher priority) | `0` |
| **Capture Priority** | Order for capture processing (lower = higher priority) | `0` |

* * *

## Supported Operations

| **Operation** | **Supported** | **Notes** |
| --- | --- | --- |
| Authorize | Yes | Reserves points from customer balance |
| Capture | Yes | Finalizes point redemption |
| Cancel | Yes | Returns reserved points to customer |
| Release Remaining Auth | Yes | Releases uncaptured portion of authorization |
| Credit/Refund | Yes | Adds points back to customer balance |

* * *

## How It Works

### Point Reservation Flow

1.  **Authorization**: Points are reserved from the customer's available balance

    *   Customer's `CurrentBalance` decreases
    *   Customer's `ReservedPoints` increases
    *   Transaction recorded with status "OnHold"
2.  **Capture**: Reserved points are finalized as redeemed

    *   Points moved from reserved to captured state
    *   Customer's bonus points balance updated
3.  **Cancellation**: If needed, reserved points return to available balance

    *   ReservedPoints decreased
    *   CurrentBalance restored

### Refund Flow

When processing returns, points are credited back to the customer:

*   Available credit amount is validated
*   Points added back to customer's CurrentBalance
*   Cannot credit more than originally authorized

### Partial Capture

For partial fulfillment scenarios:

*   Capture only the points for shipped items
*   Use "Release Remaining Auth" to return uncaptured points to customer

* * *

## Customer Club Integration

Bonus Points payment integrates with the Omnium Customer Club system:

### Point Balance Structure

| **Field** | **Description** |
| --- | --- |
| Current Balance | Available points for redemption |
| Reserved Points | Points held pending capture |
| Captured Amount | Points already redeemed |

### Point Earning Interaction

When orders are paid partially with bonus points:

*   Points earned on bonus-paid items are reduced proportionally
*   Items paid with other payment methods earn full points
*   If entire order paid with bonus points, no new points earned

* * *

## Usage Scenarios

### Scenario 1: Full Bonus Point Payment

1.  Customer has 500 points available
2.  Order total: 500 points equivalent
3.  Authorization: 500 points reserved
4.  Capture: 500 points redeemed
5.  Final balance: 0 points

### Scenario 2: Partial Payment

1.  Customer has 300 points
2.  Order total: 500 points equivalent
3.  Customer uses 150 points + credit card
4.  Authorization: 150 points reserved
5.  Capture: 150 points redeemed
6.  Customer earns points on the card-paid portion

### Scenario 3: Return with Points

1.  Original order: 100 points redeemed
2.  Customer returns 50% of items
3.  Credit: 50 points refunded
4.  Customer balance increases by 50 points

* * *

## Validation Rules

### Authorization

*   Customer must have active club membership
*   Sufficient points must be available
*   Order must have line items

### Credit/Refund

*   Cannot credit more than `AvailableAmountToCredit`
*   Order must exist
*   Active payment must be found

### Release Remaining

*   Only releases if remaining amount > 0
*   Calculates from total authorized minus captured

* * *

## Error Handling

### Common Error Messages

| **Error** | **Cause** |
| --- | --- |
| No active bonuspoints to cancel | Transaction not found or already cancelled |
| Could not credit amount. Max is \[X\] | Attempting to credit more than available |
| Order not found | Invalid order reference |

* * *

## Configuration Reference

### Payment Service

`BonusPoints`

### Prerequisites

*   Customer Club module enabled
*   Customer has active membership
*   Points balance tracking configured
