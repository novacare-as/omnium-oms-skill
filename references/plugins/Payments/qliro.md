# Qliro

Source: https://docs.omnium.no/docs/plugins/Payments/qliro

> Comprehensive guide for integrating and configuring the Qliro payment plugin with Omnium, covering setup instructions, required fields, and advanced options.

## Supports

1.  In Qliro, you can capture individual order lines.
2.  You can refund individual order lines.
3.  You can release the remaining Auth.
4.  Split the shipment and capture over different order lines.
5.  You can fetch live payment details from our GUI
6.  You can decrease the price of order lines before the first capture

## Restrictions

The following limitations apply when using Qliro:

1.  Qliro does not allow you to change the price of order lines after the first orderline is captured
2.  You cannot refund a specific amount; you have to refund the initial order line amount that was captured.

## Technical considerations

1.  **Callback URLs**
    *   Callback URLs must be configured to ensure proper payment status updates (see the Callbacks section below).
2.  When we perform our first capture, we will update the order. This is so we can get shipping to match, changes in splitted orderlines and also price updates.

## Setup configuration

To configure Qliro as a payment method in Omnium, use the following settings:

| Parameter | Value |
| --- | --- |
| **PaymentMethodName** | Qliro |
| **Unique PaymentName** | Qliro |
| **PaymentService** | Qliro |
| **DisplayName** | Qliro |
| **API Token** | `token from Qliro "vbQqAxuaVE4K"` |
| **Client ID** | `Id from Qliro "QTEST"` |
| **Base URL** | `https://pago.qit.nu` |
| **Display in Cart** | `true` |
| **FetchDetailsFromPaymentProvider** | `true` |
| **Terms URL** | `https://somethingUrl` |
| **Fallback URL** | `Your homepage or a designated fallback page` |
| **Vue Template** | `"qliro-payment"` |
| **IntegrityPolicyUrl** | `Webpage for integrity policy` |

## Callbacks

When creating payments through your own system, you must include the following callback URLs in the `createOrder` request.

### Callback URL Format

**Status Push URL:**

```json
{ApiBaseUrl}/api/QliroPayment/StatusUpdate/{TenantId}/{OrderNumber}/{MerchantReference}
```

**Parameters:**

| Parameter | Description |
| --- | --- |
| `{ApiBaseUrl}` | Your Omnium API URL (e.g., `https://api.omnium.no`) |
| `{TenantId}` | Your tenant identifier |
| `{OrderNumber}` | The order number |
| `{MerchantReference}` | Your merchant reference for the payment |

Replace the placeholders with actual values when configuring your integration.

## Example JSON configuration

Below is a sample JSON configuration for integrating Qliro:

```json
{
    "name": "QliroQTest",
    "paymentMethodName": "QliroQTest",
    "providerName": "Qliro",
    "displayName": "Qliro",
    "apiToken": "vbQpPxudasfEK",
    "clientId": "QTEST123",
    "baseUrl": "https://pago.qit.nu",
    "vueTemplate": "qliro-payment",
    "isEmptyPayment": false,
    "displayInCart": true,
    "editable": false,
    "enableUpdateAuthorizationAmount": false,
    "enableExtendAuthorizationTime": false,
    "authorizationTimeInDays": 0,
    "hidden": false,
    "validOnMarkets": [],
    "validForStores": [],
    "disableTransactions": false,
    "requiresCredit": false,
    "isZeroOrLessCreditAllowed": false,
    "isZeroOrLessCreditNotSentToProvider": false,
    "termsUrl": "https://omnium.no/terms",
    "fallbackUrl": "https://omnium.no/",
    "readOnly": false,
    "getDetailsFromProvider": true,
    "properties": [
        {
            "key": "IntegrityPolicyUrl",
            "value": "https://integritetErviktig.no/integrity",
            "editKey": false
        }
    ],
    "creditPriority": 0,
    "capturePriority": 0,
    "paymentProviderFee": 0
}
```
