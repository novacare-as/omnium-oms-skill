# Dintero

Source: https://docs.omnium.no/docs/plugins/Payments/dintero

> Learn all you need to know about our Dintero plugin

## Omnium Dintero Integration

Omnium supports full payment handling with Dintero, including the following actions:

*   Capture payment (split payment)
*   Refund payment
*   Cancel payment
*   InStore payment
*   Payment details from provider
*   Settlements

* * *

## Setup Instructions

To set up Dintero in Omnium, follow these steps:

### Configuration Path

Navigate to:

```
Configuration -> Settings -> Payment -> Payment Types -> "..." -> Add
```

### Required Fields

| Field | Description | Example |
| --- | --- | --- |
| **Unique Payment Name** | The unique identifier for the Dintero payment method. | Dintero |
| **Payment Service** | The payment service name for the configuration. | Dintero |
| **Display Name** | The name displayed to users in the checkout process. | Ex: Dintero, Dintero Norway |
| **Return URL** | When using InStore payment, Dintero mandates a Return URL where the customer will be sent after completing shipment. Set up your own result page or use the Dintero default page. | `https://checkout.dintero.com/result/` |
| **Account ID** | The Dintero Account ID, with an environment-specific prefix (T for test, P for production). | e.g. `T11112222`, `P11112222` |
| **Client ID** | Used for authenticating requests. This corresponds to `ClientId` in Dintero. | e.g. `89dsa8s7da8sd7asd7...` |
| **Client Secret** | Client secret for authenticating requests. This corresponds with `ClientSecret` in Dintero. | e.g. `89dsa8s7da8sd7asd7...` |
| **Base URL** | Target URL for the Dintero API. | `https://checkout.dintero.com/v1/` |
| **Vue Template** | Ensure the correct payment template is integrated. Use "dintero-payment" as the value. | `dintero-payment` |

* * *

### Display in Cart

Set this to `true` if you want the Dintero payment option to appear directly within your shopping cart interface.

### Advanced Options

You can enable **"Get details from provider"** to fetch real-time payment details directly from Dintero. This feature allows you to pull detailed transaction data by selecting the **"Get payment information"** action, ensuring you always get the latest info from the provider.

* * *

## Split Payments

Dintero supports **split payments**, where the payout is split between multiple payout destinations. The settings below are in the **User Interface** panel of the Dintero payment type.

| Setting | Description |
| --- | --- |
| **Split Disabled** | On by default. When on, Omnium sends no splits, and Dintero pays the full amount to the merchant account. |
| **Preserve Authorization Splits** | Use the splits that your checkout set on each line at authorization (for example a marketplace commission) on capture and refund, instead of the splits Omnium builds. |
| **Return Charge Payout Destination** | The Dintero `payout_destination_id` that keeps the return charges (for example return shipping) withheld from a refund. Requires **Preserve Authorization Splits**. |

### Splits built by Omnium

When **Split Disabled** is off, the warehouse/sender on each shipment gets the payout for the items and shipping on that shipment.

### Preserve authorization splits

Turn on **Preserve Authorization Splits** when your checkout sets the splits on the Dintero session, for example a marketplace that keeps a commission per line. On capture and refund, Omnium reads the splits from the Dintero transaction and sends them back per line. On a partial capture or refund, the splits are scaled in proportion to the amount. Lines without a split in the authorization keep the split built by Omnium.

### Return charges on refunds

When a return withholds a charge from the refund (for example return shipping), Omnium takes the charge off the refunded lines. By default, the charge is split in the same proportion as the line, so every destination keeps a part of it.

Set **Return Charge Payout Destination** to make one destination keep the full charge, for example a marketplace that pays the return shipping. The other destinations then refund their full share. The value must match the `payout_destination_id` in the authorization splits exactly (case-sensitive). The splits are not stored in Omnium; find the id on the transaction in the Dintero backoffice, under the item splits.

Example: a line of 4099 NOK is split 80/20 between the store and the marketplace, and 149 NOK return shipping is withheld.

| Destination | Captured | Refunded | Keeps |
| --- | --- | --- | --- |
| Store | 3279.20 | 3279.20 | 0 |
| Marketplace | 819.80 | 670.80 | 149 |

If the destination's share of the returned lines is smaller than the charge, the destination refunds nothing, and the other destinations pay the rest in proportion.

* * *

## Settlements

For Omnium to fetch settlements from Dintero, the scheduled task **PaymentSettlementsScheduledTask** needs to be activated in configuration.

To activate:

1.  Go to **Configuration -> Settings -> Integrations -> Scheduled tasks**.
2.  Select **"Add"** from the menu in the top right corner.
3.  Select **PaymentSettlementsScheduledTask** from the list.
4.  Set up a schedule for the task.
    *   We recommend running the task **once every night**.
    *   The schedule for running the task at **04:00 every morning** is:

        ```
        0 04 * * *
        ```

5.  Make sure the task is **not disabled** and publish settings.

* * *
