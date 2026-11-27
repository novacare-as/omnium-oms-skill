# Kustom Checkout

Source: https://docs.omnium.no/docs/plugins/Payments/klarnav3

> Configure Kustom Checkout (formerly Klarna Checkout v3) with Omnium to process payments.

## Kustom Checkout Integration with Omnium

Klarna Checkout v3 is now **Kustom Checkout**, following Klarna's rebrand of the product. Only names and API hosts changed - existing configurations keep working, and the stored provider key is still `KlarnaCheckout`.

Omnium supports **Kustom Checkout**, providing the following features for managing payments:

*   **Capture** payments (full or partial)
*   **Cancel** payments
*   **Credit/Refund** payments
*   **Release Remaining Authorization** when necessary
*   **Update Merchant ID/Order ID** during conversion from cart to order
*   **Update Authorization** to reflect changes in order value without creating a new order
*   **Extend Authorization Time** before expiration
*   **Update Shipment Information** with tracking details after capture
*   **Retrieve Settlements/Payouts** for reconciliation

This integration allows seamless payment management, helping you stay flexible in handling orders and payments.

* * *

## Setup Instructions

Follow these steps to configure Kustom Checkout in Omnium and get everything working smoothly.

### Configuration Path

1.  Navigate to: `Configuration > Settings > Payment > Payment Types > "..." > Add`

2.  Select **Kustom Checkout**. Omnium fills in the Payment Service, Provider Name, Display Name, Base URL, Vue Template and logo for you - the table below is what those values are, and what to check if you are editing an older configuration.

3.  Fill in your Merchant ID and API Token.

* * *

## Required Fields

| **Field** | **Description** | **Value** |
| --- | --- | --- |
| **Unique Payment Name** | Your label for this configuration. Free text - choose anything that is unique within the tenant. | e.g. `KustomCheckout` |
| **Payment Service** | Identifies the method on orders and in the chart of accounts. | `KustomCheckout` |
| **Provider Name** | Dropdown selecting the provider that processes the payment. | Select **Kustom Checkout** |
| **Display Name** | The name shown to customers in the checkout process. | `Kustom Checkout` |
| **Base URL** | The target URL for the API (see [Base URL Options](klarnav3.md#base-url-options) below). | `KustomTestBaseUrl` (test) or `KustomBaseUrl` (production) |
| **Vue Template** | The template for payment method integration. | `kustom-checkout-template` |
| **Merchant ID** | Your unique identifier for Kustom, from the Kustom portal. | Your Merchant ID from Kustom |
| **API Token** | The API token used for authentication, from the Kustom portal. | Your API Token from Kustom |

Provider Name is a dropdown - pick **Kustom Checkout**. Behind it Omnium still stores the original key `KlarnaCheckout`, so that value appears if you look at the settings as JSON or export them. That is expected and must not be edited: it is what the payment provider is resolved by.

Older configurations may use `klarna-v3-payment` as the Vue Template and any of `KlarnaV3`, `KlarnaCheckout` or `Klarna` as the Unique Payment Name. Those keep working. Move a configuration to `kustom-checkout-template` when convenient: the older template only completes the return from the checkout when the configuration is named exactly `KlarnaV3`.

* * *

## Base URL Options

Following Klarna's rebrand to Kustom, the API is served from `kustom.co`. Select the environment from the Base URL dropdown:

| **Environment** | **Shortcut** | **Resolves To** |
| --- | --- | --- |
| Production | `KustomBaseUrl` | `https://api.kustom.co` |
| Sandbox/Test | `KustomTestBaseUrl` | `https://api.playground.kustom.co` |

There is no regional split - the same pair serves every market.

### Retired klarna.com hosts

Klarna's API hosts have been switched off and every configuration has been moved to Kustom, so the Klarna options are gone from the Base URL dropdown. The old shortcut values (`eubaseurl`, `eutestbaseurl`, `nabaseurl`, `natestbaseurl`) are still resolved to the matching Kustom host, so a value left behind anywhere keeps working - it simply shows in the editor as a custom URL rather than as one of the two environments.

Credentials were unchanged by the move: only the host differs.

* * *

## Additional Configuration

### Display Options

| **Setting** | **Description** | **Default** |
| --- | --- | --- |
| **Display in Cart** | Set to `true` to show the Kustom payment option in the shopping cart interface. | `false` |
| **Editable** | Allow editing payment details in the GUI. | `false` |
| **Hidden** | Hide this payment method from the GUI entirely. | `false` |
| **Read Only** | Make this payment method read-only in the GUI. | `false` |
| **Logo URL** | URL to a custom logo image to display in the GUI. | \- |

### Authorization Settings

| **Setting** | **Description** | **Default** |
| --- | --- | --- |
| **Enable Update Authorization Amount** | Allow updating the authorized amount from the GUI (e.g., when order value changes). | `false` |
| **Enable Extend Authorization Time** | Allow extending the authorization expiration time from the GUI. | `false` |
| **Authorization Time In Days** | Default authorization expiration time in days (informational, actual expiration set by Kustom). | `0` |

### Market & Store Restrictions

| **Setting** | **Description** | **Default** |
| --- | --- | --- |
| **Valid On Markets** | Restrict this payment method to specific markets. Leave empty for all markets. | All markets |
| **Valid For Stores** | Restrict this payment method to specific stores. Leave empty for all stores. | All stores |

### Operational Settings

| **Setting** | **Description** | **Default** |
| --- | --- | --- |
| **Disable Transactions** | Prevent new transactions from being created with this payment method. | `false` |
| **Is empty payment** | Record payments without calling Kustom, for when the storefront captures and refunds itself. Provider Name, Base URL and credentials are then ignored. See [Empty payment types](../Payments.md#empty-payment-types). | `false` |
| **Get Details From Provider** | Enable fetching real-time payment details from Kustom via "Get payment information" action. | `false` |

### Priority Settings

| **Setting** | **Description** | **Default** |
| --- | --- | --- |
| **Credit Priority** | Priority for refund processing when order has multiple payments. Lower value = higher priority. | `0` |
| **Capture Priority** | Priority for capture when order has multiple payments. Lower value = higher priority. | `0` |

### Reporting

| **Setting** | **Description** | **Default** |
| --- | --- | --- |
| **Payment Provider Fee** | Fee percentage charged by the payment provider. Used in reports. | `0` |

* * *

## Advanced Features

### Update Authorization Amount

When enabled via **Enable Update Authorization Amount**, you can update the authorized amount on an order without creating a new Kustom order. This is useful when:

*   Order value changes after authorization (e.g., item quantity adjustment)
*   Customer adds or removes items before capture

The update is performed through the order's payment actions in the GUI.

### Extend Authorization Time

Kustom authorizations have an expiration time. When enabled via **Enable Extend Authorization Time**, you can extend the authorization before it expires. This is useful for orders with longer fulfillment times.

### Shipment Information Updates

After capturing a payment, you can update the shipment information with:

*   **Shipping Company/Carrier**: The name of the shipping carrier
*   **Tracking Number**: The shipment tracking identifier
*   **Tracking URI**: A link to track the shipment
*   **Shipping Method**: The type of shipping (e.g., postal delivery, pickup point, store pickup)

This information is sent to Kustom and can be displayed to the customer.

### Settlements/Payouts

Omnium can retrieve settlement and payout data from Kustom for reconciliation purposes. Settlement data includes:

*   **Sales transactions**: Captured payments
*   **Refund transactions**: Credited/refunded payments
*   **Fee transactions**: Kustom processing fees

Settlement data can be filtered by date range and currency.

### Get Payment Details

When **Get Details From Provider** is enabled, you can fetch real-time payment information from Kustom, including:

*   Current order status
*   Captured amount vs. remaining authorized amount
*   Refunded amount
*   Order lines
*   Capture history with tracking information
*   Authorization expiration date

* * *

## Kustom Payment Link

Alongside Kustom Checkout, Omnium supports **Kustom Payment Link** (previously Klarna In-Store) for physical retail locations. It uses Kustom's hosted payment page, sent to the customer by SMS or email.

### Setup for Kustom Payment Link

Add it the same way - `Configuration > Settings > Payment > Payment Types > "..." > Add`, then select **Kustom Payment Link**. Omnium fills in these values:

| **Field** | **Value** |
| --- | --- |
| **Unique Payment Name** | Your label, e.g. `KustomPaymentLink` |
| **Payment Service** | `KustomPaymentLink` |
| **Provider Name** | Select **Kustom Payment Link** |
| **Display Name** | `Kustom Payment Link` |
| **Vue Template** | `kustom-payment-link-template` |
| **Terms URL** | **Required.** An absolute `http` or `https` URL to your terms and conditions, e.g. `https://example.com/terms` |

**Terms URL must be an absolute http or https URL.** Omnium sends it to Kustom as the terms, confirmation and checkout URL when creating the order, and Kustom requires all three to be valid URIs. A blank value, or one without a scheme such as `example.com/terms`, is rejected with **HTTP 400** and no payment link is created:

```
Bad value: merchant_urls.checkout (must be a valid http or https URI),
merchant_urls.terms (must be a valid http or https URI),
merchant_urls.confirmation (must be a valid http or https URI)
```

Omnium checks the field before sending, so an unusable value fails immediately with an explanation on the order rather than as an opaque 400. It is not filled in for you - set it before taking the payment type into use.

As with Kustom Checkout, the Provider Name dropdown reads **Kustom Payment Link** while the stored value remains `KlarnaInStore`.

Older configurations use `klarna-in-store-payment` as the Vue Template, which still works. Note the hyphen between "in" and "store": `klarna-instore-payment` does not resolve to any component and the payment panel will fail to render.

### Kustom Payment Link Flow

1.  A Kustom checkout order is created
2.  A hosted payment page (HPP) session is generated
3.  A payment link is distributed to the customer via SMS or email
4.  The customer completes payment on the hosted page
5.  The system polls for session completion
6.  On completion, an authorization transaction is created
7.  Standard capture/refund flow proceeds from there

* * *

## Refund Limitations

### Standard Refunds

Standard refunds are supported for all Kustom markets. You can perform:

*   **Full refunds**: Refund the entire captured amount
*   **Partial refunds**: Refund a portion of the captured amount with specific order lines

### Return Fee (Refund Charge)

Kustom supports charging a return fee when processing refunds in certain markets. However, this feature has the following conditions:

*   The order must be fully captured in a **single capture** (no partial captures)
*   The sum of the refunded order lines must exactly match the refund amount
*   Supported markets: **Austria, Germany, Denmark, Finland, France, Netherlands, Norway, Sweden**

The return fee feature requires specific configuration. Contact support if you need this functionality enabled.

* * *

## Order Line Handling

When sending order data to Kustom, the following rules apply:

| **Aspect** | **Behavior** |
| --- | --- |
| **Tax Handling** | Taxes are always included in unit prices and total amounts |
| **Reference Length** | Order line references are truncated to 64 characters (provider limit) |
| **Quantity Rounding** | Quantities less than 1 are rounded up to 1 (decimals below 1 are not accepted) |
| **Line Types** | Supported: `physical`, `shipping_fee`, `store_credit`, `discount`, `return_fee` |

* * *

## Troubleshooting

### Common Issues

| **Issue** | **Possible Cause** | **Solution** |
| --- | --- | --- |
| Authentication failed | Invalid Merchant ID or API Token | Verify credentials in the Kustom portal |
| Order not found | Transaction ID doesn't match the Kustom order | Check that the correct environment (test/prod) is used |
| Capture failed | Authorization expired or already captured | Check authorization status and expiration date |
| Refund failed | Amount exceeds captured amount or order not captured | Verify capture status before refunding |
| Update authorization failed | Order already captured or cancelled | Authorization updates only work on authorized orders |

### Error Handling

Kustom errors are logged and displayed on the order in the **Errors** section. Check the order details for detailed error messages from Kustom when a payment operation fails.

* * *

## Supported Operations

| **Operation** | **Kustom Checkout** | **Kustom Payment Link** |
| --- | --- | --- |
| Capture | Yes | Yes |
| Partial Capture | Yes | Yes |
| Cancel | Yes | Yes |
| Refund | Yes | Yes |
| Partial Refund | Yes | Yes |
| Update Authorization | Yes | Yes |
| Extend Authorization | Yes | Yes |
| Release Remaining Auth | Yes | Yes |
| Update Shipment Info | Yes | Yes |
| Get Details | Yes | Yes |
| Get Settlements | Yes | Yes |
| In-Store HPP | No | Yes |
