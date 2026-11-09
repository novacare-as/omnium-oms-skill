# AwardIt

Source: https://docs.omnium.no/docs/plugins/GiftCards/AwardIt

> This page describes the technical configuration required to enable AwardIt in Omnium, as well as API usage for buying and paying with gift cards.

For the api used in this integration, take a look [here](https://api-docs.giftcards.awardit.com/api/mvalue-v2/redoc.html#section/API-Overview).

## Supported features

*   Buy gift card
*   Use gift card as payment. This will reserve the amount on a gift card. Payment workflow steps will then handle capture and credit.

## Setup

## Add a gift provider under Connectors

Go to Configuration -> Settings -> Integrations -> Connectors Add a connector like this:

```json
{
    "name": "AwardIt",
    "implementations": [
        "IGiftCardProvider"
    ]
}
```

## Add AwardIt payment provider

Go to **Configuration → Settings → Orders → Payment → Payment Types** Add:

*   Payment settings name: AwardIt
*   Payment method name: GiftCard
*   Provider name: Select AwardIt from the dropdown
*   Display name: Up to you
*   Authorization time in days: when gift card is used as a payment, set number of days the amount should be reserved on the gift card(30 days is normal)
*   Client ID: Get this from AwardIt
*   API Token: Get this from AwardIt
*   Base URL: Get this from AwardIt (test or prod)

### Template properties

When creating gift cards in AwardIt, correct template must be sent in the request from Omnium. You will find template id's in AwardIt portal. Add properties on the payment provider, for each market you can specify both email and sms templates.

**Templates for email**:

*   Key: "TemplateForMarket\_{MarketId}". Example: "TemplateForMarket\_NOR"
*   Value: "Template id from AwardIt" Example: "2344"

**Templates for SMS**:

*   Key: "SmsTemplateForMarket\_{MarketId}". Example: "SmsTemplateForMarket\_NOR"
*   Value: "Template id from AwardIt" Example: "2377"

#### DefaultTemplate

If you have multiple markets, using the same template in AwardIt, you can add a default template key instead of market specific.

**Template for email**:

*   Key: "DefaultTemplate"
*   Value: "Template id from AwardIt"

**Template for SMS**:

*   Key: "SmsDefaultTemplate"
*   Value: "Template id from AwardIt"

### Distribution details

Gift cards are sent by default via email to customer through AwardIt. If you want the gift card sent on Sms: Add properties on the payment provider, one for each market you want to send gift card as Sms

*   Key: "DistributionTypeForMarket\_{MarketId}". Example: "DistributionTypeForMarket\_NOR"
*   Value: "Sms"

## Configuring Gift Card Product

1.  **Create a virtual gift card product**
    Define a product with 'IsVirtual' set to 'true'

2.  **Set the gift card SKU in settings**
    Go to **Configuration → Settings → Orders → Gift Cards** and enter the SKU for your gift card product.

### Order Workflow

For the first status when an order is added (typically New), the following workflow step must be added:

*   Authorize payment Add this as the first step. If customer has paid with gift card, this will reserve the amount. Make sure to toggle "Stop on error" to prevent the rest of the workflow if reservation fails.
*   Create and send gift cards This will create and send the gift card to the customer and move the gift card into a virtual shipment

## Order Status: `VirtualShip`

Since gift cards will be "shipped" immediately and are a digital product, we need a "virtual" shipping order status.

Gift cards are considered a **virtual shipment** and require a dedicated order status:

```json
{
  "name": "VirtualShip",
  "displayName": "VirtualShip",
  "order": 0,
  "condition": "Delivery",
  "isDeliveredStatus": true,
  "shipmentStatusUpdate": "Released",
  "workflowSteps": [
    {
      "name": "CapturePayments",
      "active": true,
      "translateKey": "WorkflowStep_CapturePayments"
    },
    {
      "name": "CompleteShipment",
      "active": true,
      "translateKey": "WorkflowStep_CompleteShipment"
    },
    {
      "name": "RemoveAuthorizationExpires",
      "active": true,
      "isInvisible": true
    }
  ],
  "translateKey": "VirtualShippedCompleted"
}
```

This status completes the order lifecycle for digital shipments (gift cards). The workflow steps (such as notifications) in the example are typical steps for this status, same as on your other completed statuses. The key workflow steps include:

*   **CapturePayments** – captures any pending payments.
*   **CompleteShipment** – completes the virtual shipment.
*   **ExportOrder** – optionally exports the order to an external system.

#### Shipping method

Define a **VirtualShipment** shipping method which will be used for gift cards (or other digital products):

```json
{
  "shippingGateway": "Empty",
  "shippingMethodName": "VirtualShipment",
  "deliveryTime": "Immediate",
  "vueTemplate": "standard-shipment-view",
  "shipmentDeliveryType": "Virtual",
  "label": "Virtuell frakt"
}
```

*   `shipmentDeliveryType` must be set to `Virtual`.
*   `deliveryTime` is typically set to _immediate_.

## Buying Gift Cards

Gift cards can be added to carts the same way standard products are added to the cart, but if you want the gift card price to be dynamic (set by the customer for instance), you will need to add the order line using the gift card SKU and the selected price:

**API Endpoint:** `/api/Cart/{cartId}/OrderLines` → [Documentation](https://apitest.omnium.no/documentation/index.html#/Carts%20%7C%20Add/CartAddOrderLineToCart)

**Note:** If you are only buying a gift card, the shipment added to cart should be of type "VirtualShipment". If buying gift card and other items, the workflow will automatically handle this and create a split shipment for the gift card.

## Customize Sending

You can add properties to the order line to customize how the gift card is sent. The following properties are available:

**Receiver**

By default, the gift card is sent to the customer's email address or phone number from the order.

To override this, add one of the following properties to the gift card order line:

*   Key: "GiftCardReceiverEmail"

*   Value: "Receiver email address"

*   Key: "GiftCardReceiverPhone"

*   Value: "Receiver phone number (must include country code starting with + or 00)"

**Note:** If both properties are added, the phone number takes precedence. This will also override the distribution setting on the AwardIt provider.

**Message to Receiver**

Add this property to include a custom message for the gift card receiver:

*   Key: "GiftCardReceiverMessage"
*   Value: "Happy birthday!"

**Send Date**

Add this property to schedule the gift card to be sent at a specific date:

*   Key: "GiftCardSendDate"
*   Value: "DateTime string in UTC"

**Note:** If omitted, the gift card will be sent immediately when the order is created and the workflow is complete.

## Paying with Gift Cards

*   **Validate gift card balance** using `/api/GiftCard​/{code}` → [Documentation](https://apitest.omnium.no/documentation/index.html#/Orders%20%7C%20Gift%20Cards/GiftCardGet)
*   **Add gift card payment to cart:** `/api/Cart/{cartId}/AddGiftCard/{giftCardCode}` → [Documentation](https://apitest.omnium.no/documentation/index.html#/Carts%20%7C%20Checkout/CartAddGiftCardToCart)

Here both gift card code and pin can be used. This will add a payment to the cart with transactionType "AwaitingAuthorization". When order is created, the step "Authorize payment" will the do the reservation towards AwardIt. Amount is not reserved before this!

*   **(Optionally)** Remove gift card payment from cart:\*\* `/api/Cart/{cartId}/RemoveGiftCard/{giftCardCode}`

### Crediting a Gift Card Payment

By default, crediting a payment made with a gift card refunds the amount back onto the gift card that was used. You can instead have Omnium issue a new gift card for the credited amount, leaving the card that paid untouched.

Add this property on the payment provider:

*   Key: "IssueNewCardOnCredit"
*   Value: "true"

The new gift card is issued with the credited amount as its balance and is sent to the customer on the order (e-mail address or phone number, falling back to the billing address). A comment naming the new gift card code and the date it is valid until is added to the credit payment on the order.

**Expiry date**

Add this property to control how long the new gift card is valid:

*   Key: "IssueNewCardOnCredit\_ValidDays"
*   Value: "Number of days the new gift card is valid". Example: "30"

**Note:** If omitted, or not a positive whole number, the gift card is valid for the period set by the template in AwardIt.

**Template**

Cards issued on credit use the same templates as the gift cards customers buy. To use a separate template for them, add:

*   Key: "TemplateCreditForMarket\_{MarketId}". Example: "TemplateCreditForMarket\_NOR"
*   Value: "Template id from AwardIt" Example: "2388"

**Note:** This template is used for both e-mail and Sms. Without it, the templates described under [Template properties](AwardIt.md#template-properties) apply.

**Distribution details**

Cards issued on credit are sent on the channel configured for the market under [Distribution details](AwardIt.md#distribution-details). To send them on a different channel, add:

*   Key: "DistributionCreditTypeForMarket\_{MarketId}". Example: "DistributionCreditTypeForMarket\_NOR"
*   Value: "Sms"

**Message**

Add this property to send a message with cards issued on credit, for example to tell the customer which order the card refunds:

*   Key: "IssueNewCardOnCredit\_Message"
*   Value: "Message to the customer". Example: "Refund for order {OrderNumber}"

To localize the message, add one per market:

*   Key: "IssueNewCardOnCredit\_Message\_{MarketId}". Example: "IssueNewCardOnCredit\_Message\_SWE"
*   Value: "Message to the customer". Example: "Återbetalning för order {OrderNumber}"

**Note:** `{OrderNumber}` in the message is replaced with the order number, or the order id when the order has no order number. The message for the market is used when it exists, otherwise the message for all markets. The message is sent for both e-mail and Sms, and is shown where the AwardIt template uses `{{user.message}}`.

**Reference**

Cards issued on credit are sent to AwardIt with the order number, or the order id when the order has no order number, as the tag `reference`. AwardIt only accepts a tag value of at most 36 characters, using only the letters a-z and A-Z, the digits 0-9, `-` and `_`. An order number that does not fit is left out of the request and a warning is logged, and the card is still issued.

**Note:** If the new gift card cannot be issued, the credit fails and the error is shown on the order. The amount is not refunded onto the card that paid instead.
