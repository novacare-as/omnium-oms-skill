# ShipmentsV3

Source: https://docs.omnium.no/docs/plugins/POS/Sitoo/Shipments

> Purchase order deliveries integration using Sitoo's shipments-v3 API.

# ShipmentsV3

The integration supports purchase order deliveries using Sitoo's shipments-v3 API. You can create purchase orders in Omnium, export them as deliveries in Sitoo, and receive the counted difference back in Omnium once the delivery is finished.

For detailed information on setting up and using the deliveries integration, see the [Shipments documentation](Shipments.md).

## Key Features

*   Create purchase orders in Omnium
*   Export as deliveries/shipments to Sitoo
*   Receive goods in Sitoo (via web or mobile app)
*   Sync counted quantities back to Omnium

# Omnium and Sitoo Shipments Integration

This document outlines the process for integrating Omnium with Sitoo to enable automatic export and synchronization of purchase orders with goods reception in Sitoo.

## Overview

The integration allows purchase orders created in Omnium to be exported and synchronized with Sitoo's goods reception system. Each delivery in Omnium corresponds to a shipment in sitoo, which can be marked as received, counted and completed. Sitoo supports adding barcodes to packages and shipments, enabling scanning of either the entire shipment (corresponding to the whole delivery in Omnium) or individual groups as packages for receiving multiple goods at once.

## Requirements

Currently, for shipments to work, Sitoo must be master of inventory. However extending this is possible

## Steps to Set Up Integration

1.  **Configure the Export Step in Purchase Order Status**

    *   Add an export step to a specific purchase order status in Omnium to enable synchronization with Sitoo.
2.  **Create a Purchase Order in Omnium**

    *   Create a purchase order and add deliveries to it. Each delivery in Omnium represents a package in Sitoo.
    *   Ensure all desired deliveries are created before exporting, as updates to shipments in Sitoo are not supported once created.
3.  **Trigger Export to Sitoo**

    *   Set the purchase order status to the one configured with the export step. This action triggers the export of the purchase order to Sitoo.

## API Endpoints and Examples

### Creating a Purchase Order

Use the `/api/PurchaseOrders` endpoint to create a purchase order in the oms. If you have multiple pacages in sitoo with the same items, you have to add the packageSkuId when you create the purchaseOrder. However, if you only send one pckSkuId of each lineitem, you can add it when adding the deliveries. Remember to set sup+plierId, supplierName, and storeId that matches your data in Omnium. If not, you will receive fetching errors in the GUI.

**Example Request Body:**

```json
{
  "name": "123123",
  "supplierId": "hovedlager",
  "supplierName": "H Varelager",
  "billingCurrency": "NOK",
  "marketId": "NOR",
  "purchaseOrderForm": {
    "lineItems": [
      {
"lineItemId": "1",
        "code": "1215001071",
        "displayName": "Lampettledning u/støpsel 10m sort",
        "alternativeProductName": "PL-ledning u/støpsel",
        "gtin": "7058960027080",
        "placedPrice": 71.06,
        "placedPriceExclTax": 71.06,
        "currency": "NOK",
        "quantity": 11,
        "extendedPrice": 781.66,
        "extendedPriceExclTax": 781.66,
        "discountedPrice": 781.66,
        "discountedPriceExclTax": 781.66,
        "unit": "pcs",
        "packageSkuId": "Here you can add packageskuId."
      },
      {
"lineItemId": "2",
        "code": "862500754",
        "displayName": "LED E27 normal dimbar 7W klar",
        "alternativeProductName": "LED normal E27 7W dimbar",
        "gtin": "7071033243125",
        "placedPrice": 71.06,
        "placedPriceExclTax": 71.06,
        "currency": "NOK",
        "quantity": 11,
        "extendedPrice": 781.66,
        "extendedPriceExclTax": 781.66,
        "discountedPrice": 781.66,
        "discountedPriceExclTax": 781.66,
        "unit": "pcs"
      }
    ]
  },
  "purchaseOrderNotes": [],
  "publicPurchaseOrderNotes": [],
  "status": "Ny",
  "subTotal": 1563.32,
  "subTotalExclTax": 1563.32,
  "taxTotal": 0,
  "total": 1563.32,
  "totalExclTax": 1563.32,
  "purchaserId": "user@example.com",
  "purchaserName": "John Doe",
  "properties": [],
  "storeId": "6",
  "requestedDeliveryDate": "2025-08-30T14:18:55.784Z",
  "origin": "",
  "versionId": "2516458157975278540",
  "errors": [],
  "externalIds": [],
  "isDelivery": false,
  "tags": []
}
```

### Creating Deliveries

To create deliveries for the purchase order, which represents a shipment in sitoo, use the `/api/Deliveries/CreateDelivery/{purchaseOrderId}` endpoint. Each delivery can include specific line items and quantities, and a barcode can be added to the delivery in Omnium, which will be visible on the shipment in Sitoo. On each lineItem here, you also have to set a packageSkuId which represents the Sitoo Barcode on the package. With this, they can easily scan the package to add the items. To make it easier to add packages in loop, we now allow you to decide the lineitem by the code/sku. Also add barcode on the delivery as you can see in swagger parameters.

**Example Request Body:**

```json
[
  {
    "quantity": 4,
    "code": "1215001071",
    "packageSkuId": "sku1"
  },
  {
    "quantity": 4,
    "code": "862500754",
    "packageSkuId": "sku12"
  }
]
```

### To export:

Now, once you have created the deliveries you want, you can use setpurchaseorderstatus to change the status of the purchaseOrder to the status with the export step. Now you can log either into sitoo online or through the ipad and procecess the shipments. They have a mobile app that you can use if you have an activationCode from them.

## Notes

*   To separate products into multiple shipments (e.g., splitting quantities into groups of 5), use the same endpoint multiple times with `cancelRemainingLineItems` set to `false`. it can be usefull to use Sku here, as the original lineitemId is tied to the earlier shipment created.
*   Ensure the `barcode` field is included if you want to assign a scannable barcode to the package or shipments in Sitoo.
*   When exporting multiple times, it will only export the shipments that isn't exported. We are not able to update shipments in sitoo, however, we can add the new shipments you add.
*   Listen to public const int ApiUpdatedDelivery = 352115 for events;

You can also ofcourse do this flow in the gui, I recommend you to try and create purchaseorders and deliveries first to see what warehouse/supplier/other fields end up being
