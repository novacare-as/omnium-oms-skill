# Create and Send Gift Cards

Source: https://docs.omnium.no/docs/Order/workflow-steps/payment/create-and-send-gift-cards

> Create purchased gift cards and send them to recipients.

## Overview

The **Create and Send Gift Cards** step creates gift cards from order line items that are gift card products and sends them to the designated recipients. This handles the fulfillment of gift card purchases.

## Identifier

| Property | Value |
| --- | --- |
| **Key** | `CreateAndSendGiftCards` |
| **Group** | Payments |
| **Applicable Statuses** | New |

## Configuration Properties

This step has no configurable properties. Gift card provider is configured in tenant settings.

## Behavior

### What It Does

1.  Identifies gift card products in the order
2.  Creates and sends gift cards from the order
3.  Creates gift cards with the purchased values
4.  Sends gift cards to recipients (via email or other configured method)

### Prerequisites

*   Order must contain gift card products
*   Gift card provider must be configured

### Side Effects

*   Creates new gift cards in the gift card provider
*   Sends delivery notification to recipients
*   Gift cards become available for use

## Business Cases

### When to Use

*   **Gift card sales**: When customers purchase gift cards
*   **Digital delivery**: Instant delivery of digital gift cards
*   **Promotional gift cards**: Create gift cards as part of promotions

### Example Scenarios

**Scenario 1: Email Gift Card** Customer buys $50 gift card for [friend@email.com](mailto:friend@email.com). Step creates the gift card and emails the code to the recipient.

**Scenario 2: Multiple Gift Cards** Order contains 3 gift cards for different recipients. Step creates and sends each one.

## Error Handling

| Condition | Result | Continues Workflow? |
| --- | --- | --- |
| Gift cards created and sent | Success | Yes |
| No gift card products | Success (no action) | Yes |
| Creation/sending failed | Error | Depends on StopOnError |

## Related Steps

*   [Reserve Gift Cards](reserve-gift-cards.md) - Reserves gift cards for payment
