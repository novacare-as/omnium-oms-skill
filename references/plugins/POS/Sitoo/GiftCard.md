# Gift cards

Source: https://docs.omnium.no/docs/plugins/POS/Sitoo/GiftCard

> Omnium acts as the master system for gift cards, and Sitoo accesses the gift card data via dedicated API endpoints provided by Omnium.

## Overview

Gift cards function both as purchasable products and as a payment method. Omnium manages gift cards as the master system, while Sitoo interacts with them through SPI (Service Provider Interface) endpoints.

For more information on Sitoo’s side, see their [Sitoo GiftCard SPI Documentation](https://developer.sitoo.com/spi-giftcard/overview).

The integration supports both Sitoo’s main options for gift cards; “Pre-printed Cards” and "Vouchers".

* * *

## How it works

1.  **Creating Gift Cards:**
    This step differs depending on the type of gift card setting in Sitoo.

    Before you can sell a gift card in Sitoo, it must already exist in Omnium. This means Omnium manages the gift card codes and tracks their balances. You also need to have a gift card product set up in Sitoo.

2.  **Selling Gift Cards in Sitoo:**
    When a customer purchases a gift card in-store using the Sitoo system, you can enter the desired amount and scan or enter the pre-printed gift card code. The gift card appears as a product in the order, but Sitoo does not create or store the actual gift card details.

3.  **Gift cards are updated in Omnium through SPI endpoint AddTransaction:**
    After a gift card is sold, Sitoo uses the SPI endpoint to add a transaction to the corresponding gift card in Omnium.

4.  **Paying with Gift Cards in Sitoo:**
    When a customer chooses to pay with a gift card, Sitoo checks with Omnium to confirm that there is sufficient balance. If there is, Sitoo triggers Omnium to create a negative transaction on the gift card to deduct the used amount.

5.  **Refunds of gift card payments:**

    If a payment made with a gift card is refunded, Omnium adds the refunded amount back to the card.

6.  **Balance Checks:** Whenever Sitoo needs to check the remaining balance on a gift card, it queries Omnium for the current amount.

7.  Visualization of the operations:

* * *

## Configuration

### In Omnium

1.  Set this property on the Sitoo connector (per market):

```json
{
  "key": "GiftCardApiKey",
  "value": "{apiKey}"
}
```

2.  Set `giftCardSku` under `orderSettings` in json:

```
  "giftCardSku": "{skuId}"
```

Or in gui: ![Image](https://docs.omnium.no/_next/image?url=%2F_next%2Fstatic%2Fmedia%2FGiftCard-ConfigGiftCardCodeOms.37889f64.png&w=3840&q=75)

3.  Create a gift card product.

4.  To use this gift card integration with Sitoo, you also need to enable the Omnium gift card provider. See [Gift Cards](../../../Product/giftcards.md) for configuration details.

### In Sitoo Backoffice

1.  Go to: **Settings → Custom Gift Card**
2.  Set the following:
    *   **URL**:

        | Environment | Destination URL |
        | --- | --- |
        | Dev | [https://apidev.omnium.no/api/sitooGiftCard/{tenantId}/{marketId}/](https://apidev.omnium.no/api/sitooGiftCard/%7BtenantId%7D/%7BmarketId%7D/) |
        | Test | [https://apitest.omnium.no/api/sitooGiftCard/{tenantId}/{marketId}/](https://apitest.omnium.no/api/sitooGiftCard/%7BtenantId%7D/%7BmarketId%7D/) |
        | Prod | [https://api.omnium.no/api/sitooGiftCard/{tenantId}/{marketId}/](https://api.omnium.no/api/sitooGiftCard/%7BtenantId%7D/%7BmarketId%7D/) |

    *   **API Token**:
        `{apiKey}` (same as configured in Omnium)

3.  Go to Settings -> General -> GiftCards:
    *   Set Gift Card Service to `Custom Gift Card`.
    *   Set Gift Card Type to `Pre-printed Cards` or `Vouchers`.

![Image](https://docs.omnium.no/_next/image?url=%2F_next%2Fstatic%2Fmedia%2FGiftCard-EnableInSitoo.63b966d5.png&w=3840&q=75)

4.  Create a gift card product in Sitoo with skuId equal `giftCardSku` from settings in Omnium. The productType has to be GiftCard.

* * *

## Currently not supported

1.  Use of pin codes on gift cards
2.  Return of gift cards

Retur av ordre betalt med gavekort -> tilbakebetal til gavekort -> blir laget et nytt kort??
