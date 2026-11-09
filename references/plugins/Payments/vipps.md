# Vipps (Legacy)

Source: https://docs.omnium.no/docs/plugins/Payments/vipps

> Configure the legacy Vipps payment provider with Omnium for Norwegian mobile payments.

## Vipps (Legacy) Integration with Omnium

Omnium supports payments via the **legacy Vipps** integration. This provider uses the Vipps eComm v2 API.

For the newer Vipps ePayment API, see [Vipps ePayment](vippsEPayment.md).

### Supported Features

*   **In-store payment initiation**
*   **Capture** payments
*   **Cancel** payments
*   **Credit/Refund** payments
*   **Status checking** and authorization updates
*   **Get Details** - Retrieve transaction history

* * *

## Setup Instructions

### Configuration Path

1.  Navigate to: `Configuration > Settings > Payment > Payment Types > "..." > Add`

2.  Fill out the required fields as outlined below.

* * *

## Required Fields

| **Field** | **Description** | **Value** |
| --- | --- | --- |
| **Unique Payment Name** | The unique identifier for the Vipps payment method. | `Vipps` |
| **Payment Service** | The name of the payment service used for this configuration. | `Vipps` |
| **Provider Name** | Specifies which provider to use. | `Vipps` |
| **Display Name** | The name shown in the Omnium interface. | `Vipps` or your preferred name |
| **Client ID** | Your Vipps Client ID for OAuth authentication. | Your Client ID from Vipps |
| **API Token** | Your Vipps Client Secret. | Your Client Secret from Vipps |
| **Merchant ID** | Your Vipps Merchant Serial Number. | Your MSN from Vipps |
| **Subscription Key** | Your Vipps API Subscription Key. | Your Subscription Key from Vipps |
| **Base URL** | Vipps API endpoint URL. | See [Base URL Options](vipps.md#base-url-options) |
| **Fallback URL** | URL for payment failure/cancel scenarios. | Your fallback URL |

* * *

## Base URL Options

| **Environment** | **Base URL** |
| --- | --- |
| Test | `https://apitest.vipps.no` |
| Production | `https://api.vipps.no` |

* * *

## Supported Operations

| **Operation** | **Supported** | **Notes** |
| --- | --- | --- |
| In-Store Registration | Yes | Creates payment in Vipps app |
| Capture | Yes | Capture authorized payment |
| Cancel | Yes | Cancel payment |
| Refund | Yes | Amount must be greater than 0 |
| Check Status | Yes | Update authorization status |
| Get Details | Yes | Retrieve full transaction history |

* * *

## Special Features

### Auto-Increment Transaction References

When multiple payment attempts are made on the same order, Vipps requires unique transaction IDs. The provider automatically appends a counter suffix to prevent conflicts:

| Payment Attempt | Transaction ID |
| --- | --- |
| First | `ORDER-123` |
| Second | `ORDER-123-1` |
| Third | `ORDER-123-2` |

This ensures each payment attempt has a unique identifier in the Vipps system.

### Multi-Tenant Support

Callback URLs automatically include the tenant ID for proper routing in multi-tenant environments:

```json
{ApiUrl}/api/VippsPayment/{TenantId}/{OrderNumber}
```

### Transaction Text Handling

The transaction description sent to Vipps is built from order line display names:

*   Maximum **100 characters** (truncated if longer)
*   Items are joined with commas
*   Lines with code "OtherPayment" are excluded

### Mobile Number Processing

Customer mobile numbers are processed to extract the last 8 digits (Norwegian format), stripping any country code or formatting.

### Amount Handling

All amounts are converted to minor units (øre) before sending to Vipps:

*   `100.00 NOK` → `10000` øre
*   Responses are converted back to decimal format

* * *

## Payment Flow

### In-Store Payment Flow

1.  Customer initiates payment at POS
2.  Omnium creates payment request with customer's mobile number
3.  Customer receives push notification in Vipps app
4.  Customer approves payment in app
5.  Vipps sends callback to Omnium
6.  Payment status updated on order

### Status Values

| Status | Description |
| --- | --- |
| RESERVE | Payment authorization initiated |
| RESERVED | Payment successfully authorized |
| CAPTURE | Payment captured |
| REFUND | Payment refunded |
| COMPLETED | Payment flow completed |

* * *

## Error Handling

Vipps errors are displayed on the order in the **Errors** section.

### Common Error Scenarios

*   **401 Unauthorized**: Check Client ID, API Token, and Subscription Key
*   **Invalid amount**: Refund amount must be greater than 0
*   **Transaction not found**: Verify the transaction ID exists in Vipps

* * *

## Configuration Reference

### Payment Service

`Vipps`

### Default Currency

NOK (Norwegian Krone)

### Related Provider

For the newer API, see [Vipps ePayment](vippsEPayment.md)
