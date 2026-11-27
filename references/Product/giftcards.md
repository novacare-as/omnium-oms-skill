# Gift Cards

Source: https://docs.omnium.no/docs/Product/giftcards

> This page describes the technical configuration required to enable **gift cards** in Omnium, as well as API usage for buying and paying with gift cards.

**Related Documentation:** For user-facing documentation, see [Gift cards in the Help Center](https://help.omnium.no/hc/en-us/articles/34257045792145-Gift-cards).

## Activating the Gift Card Module

Gift cards are a separate module in Omnium and require a **separate license** to use.

Contact [petter@omnium.no](mailto:petter@omnium.no) to activate the module for your tenant.

## 1\. Payment Method

Gift cards are configured as a payment method with the following settings:

**Note:** `providerName` specifies the provider used. "Omnium" is the default built-in Omnium provider.

```json
{
  "name": "GiftCard",
  "paymentMethodName": "GiftCard",
  "providerName": "Omnium",
  "displayName": "Gavekort",
  "vueTemplate": "empty-payment",
  "displayInCart": true
}
```

You also need to add the corresponding _connector_ under connector settings:

```json
{
  "connectors": [
      {
          "name": "Omnium",
          "implementations": [
              "IGiftCardProvider"
          ]
      }
  ]
}
```

If you are using other providers other than the built in Omnium provider, you can change the name to the corresponding provider

## 2\. Order Workflow

For the first status when an order is added (typically **New**), the following workflow steps must be added:

```json
[
  {
    "name": "CreateAndSendGiftCards",
    "active": true,
    "isInvisible": true
  },
  {
    "name": "ReserveGiftCards",
    "active": true,
    "isInvisible": true
  }
]
```

These steps handle:

*   **CreateAndSendGiftCards** – generates the gift card and sends it to the customer.
*   **ReserveGiftCards** – ensures the gift card is reserved in the system.

## 3\. Order Settings

Gift card–specific settings must be defined in the order configuration:

```json
{
  "GiftCardSku": "1215694",       // SKU or ProductId of the gift card product.
  "GiftCardValidMonths": 12,       // Validity period in months
  "GiftCardCompletedStatus": null       // Optional: Will default to "Ship" if not set, but you can modify this to set your own desired status
}
```

The `giftCardSku` setting supports two matching modes:

1.  SKU-based: Matches order line items by their SKU code
2.  ProductId-based: Matches all variants of a product by ProductId

Use Case: This enables creating multiple gift card variants with predefined prices:

*   giftCard100 → $100 gift card
*   giftCard200 → $200 gift card
*   giftCard500 → $500 gift card

Behavior: When `giftCardSku` is set to a ProductId:

*   All order line items with matching ProductId will be processed as gift cards
*   Each variant maintains its own PlacedPrice (the gift card value)

## Creating Gift Cards from Orders

### How gift cards are created

Gift cards are generated from **order lines** that contain gift card products.
If multiple gift cards are purchased in a single order, each one is created and processed individually.

### Key parameters for gift card creation

*   **Gift card SKU**: The product code must be set in system settings (see _Order Settings_ above).
*   **Valid until**: If not explicitly set, the expiration date defaults to **12 months** from the order creation date.
*   **Amount**: Determined by the order line price.
*   **Gift card code**: Each gift card is assigned a **unique code**.

## Order Status Handling

Gift cards affect fulfillment and status updates. The system differentiates between **virtual** and **physical** shipments.

### Virtual shipment for gift cards

*   The shipment method is set to **VirtualShipment** (see _Shipping Method_).
*   The order status is updated to **VirtualShip** after all gift cards are successfully created.

### Order status transitions

*   **Gift card–only orders**: Status is automatically set to **VirtualShip** once the gift cards are created.
*   **Mixed orders** (gift cards + physical products): Gift cards are processed immediately; physical items follow the standard shipping flow.

### Partial shipments

For mixed orders, the system may create a **partial shipment** for the gift cards so customers receive their virtual cards immediately, while physical items continue through normal fulfillment.

## Configuring Gift Card Products

1.  **Create a virtual gift card product**
    Define a product with 'IsVirtual' set to 'true'

2.  **Set the gift card SKU in settings**
    Go to **Configuration → Settings → Orders → Gift Cards** and enter the SKU for your gift card product(s).

## 4\. Order Status: `VirtualShip`

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
      "name": "Notification",
      "active": true,
      "translateKey": "WorkflowStep_Notification"
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
*   **Notification** – triggers customer notifications.
*   **ExportOrder** – optionally exports the order to an external system.

## 5\. Shipping Method

Define a **VirtualShipment** shipping method which will be used for gift cards (or other digital products):

```json
{
  "shippingGateway": "Empty",
  "shippingMethodName": "VirtualShipment",
  "deliveryTime": "Umiddelbart",
  "vueTemplate": "standard-shipment-view",
  "shipmentDeliveryType": "Virtual",
  "label": "Virtuell frakt"
}
```

*   `shipmentDeliveryType` must be set to `Virtual`.
*   `deliveryTime` is typically set to _immediate_ (`Umiddelbart`).

## Summary

To enable gift cards in Omnium:

1.  Add the **GiftCard** payment method.
2.  Configure workflow steps (`CreateAndSendGiftCards` and `ReserveGiftCards`) for order status `New`.
3.  Define order settings (`giftCardSku` and validity period).
4.  Add a `VirtualShip` order status with the required workflow steps.
5.  Configure a **virtual shipping method**.

## Buying Gift Cards

Gift cards can be added to carts the same way standard products are added to the cart, but if you want the gift card price to be dynamic (set by the customer for instance), you will need to add the order line using the gift card SKU and the selected price:

**API Endpoint:** `/api/Cart/{cartId}/OrderLines` → [Documentation](https://apitest.omnium.no/documentation/index.html#/Carts%20%7C%20Add/CartAddOrderLineToCart)

You can also specify additional properties on the order:

**Properties:** _GiftCardReceiverEmail, GiftCardReceiverMessage, GiftCardReceiverMessageHeading, GiftCardReceiverName_

**Note:** If you are only buying a gift card, the shipment added to cart should be of type "VirtualShipment". If buying gift card and other items, the workflow will automatically handle this and create a split shipment for the gift card.

## Paying with Gift Cards

*   **Validate gift card balance** using `/api/GiftCard​/{code}` → [Documentation](https://apitest.omnium.no/documentation/index.html#/Orders%20%7C%20Gift%20Cards/GiftCardGet)
*   **Add gift card payment to cart:** `/api/Cart/{cartId}/AddGiftCard/{giftCardCode}`
*   \*\* (Optionally) Remove gift card payment from cart:\*\* `/api/Cart/{cartId}/RemoveGiftCard/{giftCardCode}`
