# Dintero

Source: https://docs.omnium.no/docs/plugins/GiftCards/Dintero

> Technical configuration for issuing Dintero gift cards from Omnium orders, delivering the code and PIN by email, and redeeming the card in Dintero Checkout.

Omnium issues gift cards on the [Dintero Wallets API](https://docs.dintero.com/api/wallets.html). A gift card is created when an order containing a gift card product is processed, and Dintero returns a **card code** and a **PIN** that Omnium delivers to the customer by email.

The card is **redeemed inside Dintero Checkout**: the payer enters the code and the PIN in the Dintero payment step. Omnium does not reserve, capture or refund against the card.

## Supported features

*   Issue a gift card from an order line, for any amount (open amount or fixed denominations)
*   Code and PIN delivered through an Omnium notification, with a designed email template
*   Look up the remaining balance of a card by its code
*   Redemption handled by Dintero Checkout

Not supported by this plugin:

| Not supported | Why |
| --- | --- |
| Adding a Dintero gift card as a payment on an Omnium cart | The card is redeemed in Dintero Checkout, so Omnium never holds the payment. The `AddGiftCard` cart endpoints and the **Reserve gift cards** workflow step do not apply. |
| Listing or browsing gift cards in Omnium | Dintero owns the card records. Omnium does not store or index them, so gift card search only resolves an exact code. |
| Editing a balance or adding transactions from Omnium | Balance changes happen in Dintero. |
| Reading a PIN back after issuing | Dintero returns the PIN once, when the card is created. Omnium neither stores nor indexes it, so it cannot be retrieved later. |
| Scheduling when the card is sent | The `GiftCardSendDate` order line property only applies to providers that deliver the card themselves. With Dintero the email is queued as soon as the card is created, and the property is ignored. |

## Prerequisites

*   **Dintero Checkout must already be configured** for the tenant - see [Dintero (payments)](../Payments/dintero.md). Gift cards reuse the same account and API client.
*   Wallets must be enabled on the Dintero account, and the API client must have the **`write:wallets`** scope. That single scope covers creating cards and reading card information.
*   The gift card module must be active for the tenant - see [Gift Cards](../../Product/giftcards.md).

## Setup

### 1\. Add the gift card connector

Go to **Configuration → Settings → Integrations → Connectors** and add:

```json
{
  "name": "Dintero",
  "implementations": [
    "IGiftCardProvider"
  ]
}
```

The connector name must be exactly `Dintero` - it is the name Omnium uses to select the gift card provider. Only one gift card provider is used per tenant: if several connectors declare `IGiftCardProvider`, the first one wins, so remove any other gift card connector.

### 2\. Credentials

No separate payment type is needed. Gift cards read the credentials from the **Dintero** entry under **Configuration → Settings → Payment → Payment Types**, matched on either the payment method name or the provider name for the market. The fields used are:

| Field | Used for |
| --- | --- |
| **Account ID** | The Dintero account the cards are issued on (`T…` for test, `P…` for production). |
| **Client ID** | Authenticating the token request. |
| **Client Secret** | Authenticating the token request. |

The **Base URL** field on the payment type points at Dintero Checkout and is not used for gift cards. The Wallets API is only served from Dintero's API host, which Omnium targets directly.

### 3\. Gift card product and order settings

Create a virtual gift card product (`IsVirtual` set to `true`), then go to **Configuration → Settings → Orders → Gift Cards**:

| Setting | Description |
| --- | --- |
| **GiftCardSku** | Matched against both the **SKU** and the **product id** of each order line. Setting it to a product id makes every variant of that product a gift card, which is how fixed denominations (500, 1000, 2000…) are modelled. |
| **GiftCardValidMonths** | Months from creation until the card expires. Defaults to `12` when unset. |

The **amount on the card is the price of the order line**, so an open-amount gift card is simply a gift card product whose price the sales channel sets per order line. See [Buying gift cards](Dintero.md#buying-gift-cards).

### 4\. Workflow step

On the first order status (typically **New**), add the workflow step **Create and send gift cards (v2)** (`CreateAndSendGiftCardsV2`).

```json
{
  "name": "CreateAndSendGiftCardsV2",
  "active": true,
  "properties": [
    { "key": "ChangeToStatus", "value": "VirtualShip" }
  ]
}
```

*   `ChangeToStatus` moves the order to that status once every gift card line has a card. For a gift-card-only order the whole order moves; for a mixed order only the gift card shipment moves, and the physical items continue through normal fulfilment.
*   Leave `ChangeToStatus` empty to create the cards without changing status.

The step also needs the `VirtualShip` order status and the `VirtualShipment` shipping method described on the [Gift Cards](../../Product/giftcards.md) page.

If Dintero rejects a card, the step reports a **warning** and the reason is written to the order's error list. The order keeps its current status - and no shipment is created - so the problem can be corrected and the workflow re-run; re-running skips lines whose cards already exist. On an order with several gift cards, the cards that were created are still emailed, and only the rejected line is left without one.

### 5\. Notification

The code and PIN reach the customer through the **Gift card bought message** notification, under **Configuration → Settings → Notifications**.

*   Set the **To** field to `{GIFT_CARD_RECEIVER_EMAIL}`. It falls back to the buyer's email when the order line carries no separate receiver.
*   Fill in the **From** address. A notification whose sender is not a valid email address is discarded before it is sent or queued, while the order still records the notification as sent - an empty From therefore looks like a delivered email that never arrives. Use a literal address, or `{STORE_EMAIL}` to send from the order's store, which falls back to the market's default email address.
*   Build the body in the email designer, which offers the gift card merge tags listed below.

Two things will leave the customer holding a card they cannot redeem, because Dintero returns the PIN only when the card is created and it cannot be read back afterwards:

*   The email not containing `{GIFT_CARD_PIN}`. Resending the gift card email later produces a message without a PIN.
*   **Configuration → Settings → Orders → Gift card template** containing HTML. Omnium then sends the legacy gift card mail built from that field instead of the notification, and that template has no PIN placeholder. Leave the field empty.

Available merge tags:

| Merge tag | Value |
| --- | --- |
| `{GIFT_CARD_CODE}` | The card code: 16 digits, no prefix. |
| `{GIFT_CARD_PIN}` | The four-digit PIN. |
| `{GIFT_CARD_AMOUNT}` | The amount the card was issued for, without decimals. |
| `{GIFT_CARD_VALID_UNTIL}` | Expiry date, formatted `dd.MM.yyyy`. |
| `{GIFT_CARD_BARCODE}` / `{GIFT_CARD_QR_CODE}` | Rendered images of the card code. Add a width to either tag as `{GIFT_CARD_BARCODE:200px}`. |
| `{GIFT_CARD_RECEIVER_NAME}` | The `GiftCardReceiverName` order line property, falling back to the buyer's name. |
| `{GIFT_CARD_RECEIVER_EMAIL}` | The `GiftCardReceiverEmail` order line property, falling back to the buyer's email. |
| `{GIFT_CARD_RECEIVER_PHONE}` | The buyer's phone number from the order. It does not resolve the `GiftCardReceiverPhone` order line property. |
| `{GIFT_CARD_RECEIVER_MESSAGE}` / `{GIFT_CARD_RECEIVER_MESSAGE_HEADING}` | The personal greeting entered at purchase. |
| `{GIFT_CARD_CUSTOMER_NAME}` / `{GIFT_CARD_CUSTOMER_EMAIL}` | The buyer. |
| `{GIFT_CARD_ORDER_ID}` | The order the card was bought on. |

The order must have a store set. The gift card notification resolves the order's store to build the message, and no email is sent if the store cannot be found.

## The issued card

| Property | Value |
| --- | --- |
| Code | 16 digits, no prefix. This is the value the payer enters in Dintero Checkout. |
| PIN | 4 digits, no prefix. |
| Reusable | The code survives partial redemption - a card can be spent across several purchases until the balance runs out. |
| Expiry | `GiftCardValidMonths` from creation. The code itself is given a slightly longer lifetime than the card, so a valid card never has a dead code. |
| Currency | The billing currency of the order. |

Omnium sends the following along to Dintero so the card can be traced from the Dintero backoffice:

*   The Omnium **order id** as card metadata
*   The **buyer's email** as the customer reference
*   The **receiver name** as the card name

Each card gets its own unique card id, so an order containing several gift cards produces several distinct cards. A gift card line with a quantity above 1 is split into one line per card before the cards are created, so every card carries its own code, PIN and receiver properties.

## Buying gift cards

Add the gift card product to a cart the same way as any other product. To let the customer choose the amount, add the order line with the gift card SKU and the selected price:

**API endpoint:** `POST /api/Cart/{cartId}/OrderLines` → [Documentation](https://apitest.omnium.no/documentation/index.html#/Carts%20%7C%20Add/CartAddOrderLineToCart)

Optional order line properties controlling delivery of the card:

| Property | Description |
| --- | --- |
| `GiftCardReceiverEmail` | Where the gift card email is sent. Defaults to the buyer's email. |
| `GiftCardReceiverName` | Name of the recipient. Defaults to the buyer's name. |
| `GiftCardReceiverPhone` | Recipient phone number. Stored on the order line, but not used to deliver a Dintero card - the card is only sent by email. |
| `GiftCardReceiverMessageHeading` | Heading of the personal greeting. |
| `GiftCardReceiverMessage` | The personal greeting. |

A gift card line must carry a price. A line priced at 0 is rejected with _"Gift card has no amount"_ and no card is created, since Dintero would otherwise happily issue a worthless card. Sales channels that set the price themselves should send the amount on the order line when it is added.

If the order contains only gift cards, the shipment added to the cart should be of type `VirtualShipment`. For mixed orders the workflow splits the gift card lines into their own virtual shipment automatically.

## Checking a balance

**API endpoint:** `GET /api/GiftCard/{code}` → [Documentation](https://apitest.omnium.no/documentation/index.html#/Orders%20%7C%20Gift%20Cards/GiftCardGet)

| Parameter | Description |
| --- | --- |
| `code` | The card code exactly as it was issued. Whitespace is stripped, so a code copied with spaces still resolves. |
| `marketId` | Selects which Dintero credentials to use. |
| `giftCardPin` | Optional. Dintero returns the balance for a valid code without it. |

The response reports the **spendable balance** - what remains after earlier redemptions.

An unknown code returns _not found_. A rejected credential or a Dintero outage returns the underlying status instead, so a configuration problem is never reported as a missing card.

## Redeeming a gift card

Redemption happens entirely in Dintero Checkout. The payer selects the gift card option and enters the code and PIN from the email, and Dintero deducts the amount and settles the remainder with the ordinary payment method. Omnium sees only the resulting Dintero payment on the order.

Because of this, the Omnium gift card payment method, the cart gift card endpoints and the **Reserve gift cards** workflow step are not used with Dintero.
