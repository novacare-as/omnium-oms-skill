# nShift Delivery

Source: https://docs.omnium.no/docs/plugins/Shipments/nshiftDelivery

> Integration with nShift Delivery (Unifaun) for shipment booking in Omnium.

[nShift Delivery API](https://helpcenter.nshift.com/hc/en-us/categories/4407954390802-Delivery)

Omnium integrates with nShift Delivery (formerly Unifaun) for comprehensive shipping management, including delivery checkout widgets, shipment booking, label generation, and direct printing.

* * *

## Configuration Steps

1.  Navigate to: **Configuration > Settings > Orders > Shipping providers > Add New**

* * *

## Required Settings

| Field | Description | Example |
| --- | --- | --- |
| **Name** | Internal provider name | `nShift` |
| **Display Name** | Name shown to users | `nShift Delivery` |
| **Shipping Provider** | Select provider type | `Unifaun` |
| **Merchant ID** | Your nShift user/merchant ID | `user@company.com` |
| **Merchant Secret** | Bearer token for API authentication | `your-api-token` |
| **Base URL** | nShift API endpoint | `https://api.unifaun.com` |
| **Vue Template** | UI template for widget display | `unifaun-provider` |

### Optional Settings

| Field | Description |
| --- | --- |
| **Add Tax On Provider Price** | Add tax to prices returned by nShift |
| **Add Product Names To Label** | Include product names/SKUs on shipping labels |
| **Print Label** | Enable label printing (default: true) |
| **Tracking URL** | Template URL with `{languageCode}` and `{orderNumber}` placeholders |

### Widget Configuration

To enable the nShift delivery checkout widget in Omnium:

1.  Set **Vue Template** to `unifaun-provider`
2.  Add a property with key `UseWidget` and value `true`

* * *

## Shipment Options

### Adding shipment options for each market

Under each market, define the shipping options available in your webshop. You have two booking methods:

### Option 1: Book based on PrepareId (Recommended for Widget Users)

If your webshop uses the nShift widget at checkout, retrieve a `prepareId` from the user session and store it on the Omnium cart or order in the property list:

```json
{
  "properties": [
    {
      "key": "UnifaunPrepareId",
      "value": "6f977858-35b8-4d5f-8fa6-5d46456543"
    }
  ]
}
```

When using prepareId, configure a single shipping option with:

*   **Shipping Method**: `Unifaun_deliveryCheckout`

Your webshop sends `Unifaun_deliveryCheckout` as the shipping method name on the shipment, together with the `UnifaunPrepareId` property. When Omnium books the shipment, it books the shipment prepared in nShift, so the service and pickup point are the ones the customer chose in the widget.

Nobody selects this option in the Omnium UI. Set **HideInOms** on it to hide it from the shipment option list.

### Option 2: Direct Booking

Configure individual shipping options for each delivery method:

| Field | Description |
| --- | --- |
| **Shipping Provider** | Set to `Unifaun` |
| **Template** | `Standard` for home delivery, `PickUp Point` for pickup points |
| **Delivery Type** | `Delivery` (sent to customer) or `Pickup` (collected at store) |
| **Display Name** | User-friendly name |
| **Shipping Method** | Internal name for mapping order shipments |
| **Shipment Product** | Service ID from nShift |
| **Shipment Return Product** | Service ID for return bookings |

### Show the order number on the shipping label

On a direct booking, Omnium sends the order number to nShift as `orderNo` and `receiverReference`. The sender reference (`senderReference`) is the contents of the first parcel: the shipment's goods description, or the product names when **Add Product Names To Label** is enabled. On a prepareId booking, the references and parcel contents come from the prepared shipment. Some carrier label layouts, such as DHL's, print the sender reference as the visible reference on the label.

To send the order number as the sender reference instead, add this property:

| Property Key | Value | Description |
| --- | --- | --- |
| `UseOrderNumberAsSenderReference` | `true` | Set it on a shipment option to apply it to that option only, or on the shipping provider to apply it to all its shipment options |

The setting is on when either the shipment option or the shipping provider has it set to `true`. Setting it to `false` on a shipment option does not turn it off when the provider has it set to `true`.

The setting applies to direct bookings, prepareId bookings, and return bookings, and it changes only the sender reference. If the order has no order number, the sender reference is left as it would be without the setting.

* * *

## Store Configuration

### QuickId Configuration

nShift supports QuickId for simplified sender identification. Configure on the store or shipment option:

| Property | Description |
| --- | --- |
| **QuickId** | nShift sender quick ID |
| **PreferQuickId** | Set to `true` to use only QuickId without full address details |

### Printer Configuration

For direct printing, configure the printer ID:

| Location | Property Key |
| --- | --- |
| User preferences | `UnifaunPrinterId` |
| Store properties | `UnifaunPrinterId` |

* * *

## Delivery Checkout / Delivery Options

### Search for delivery options in the Omnium UI

When the shipping provider uses the `unifaun-provider` Vue template, you can search for nShift delivery options on a cart or an order in the Omnium UI. Omnium queries your nShift delivery checkout with the currency of the cart or order, the postal code and country you search with, and the custom fields described below. nShift returns the options whose rules match these values. If no rule matches, the search returns no options and no error.

When you select an option, Omnium uses the market's shipment option whose shipping method ID matches the nShift service ID, or whose shipping method name matches the nShift option name. If no shipment option matches, the shipment gets the shipping method `Unifaun_deliveryCheckout`.

Omnium queries the delivery checkout only from this search. When your webshop shows the nShift widget, the webshop or widget sends its own values to nShift, and the settings in this section do not apply.

### Custom fields

To let your nShift delivery checkout rules use values from the cart or order, add the property `DeliveryCheckoutCustomFields` to the shipping provider. Omnium calculates each value and adds it to the delivery checkout query.

The value is a list of `parameter:field` pairs separated by `|`:

*   `parameter` is the name of the field in your nShift delivery checkout. Omnium sends it as the query parameter name.
*   `field` is one of the fields in the table below.

```
weight:TotalWeight|isb2b:IsB2B|maxlength:MaxLength
```

With this value, a 3 kg order from a private customer, whose longest parcel is 60 cm, adds `&weight=3&isb2b=false&maxlength=60` to the query.

| Field | Value sent |
| --- | --- |
| `TotalWeight` | Total weight of all colli, in kilograms |
| `MaxVolume` | Volume of the largest colli, in cubic metres (m³) |
| `MaxLength` | Length of the longest colli, in centimetres |
| `MaxWidth` | Width of the widest colli, in centimetres |
| `MaxHeight` | Height of the tallest colli, in centimetres |
| `DangerousGoods` | `true` when any product contains dangerous goods. See [Dangerous Goods Support](nshiftDelivery.md#dangerous-goods-support) |
| `IsB2B` | `true` when the customer type is B2B |
| `TotalPrice` | The order total |
| `PickUpInStoreNotPossible` | `true` when any product has the property `CanPickupInStore` with a value other than `true` |
| `AcquisitionGroup` | Six parameters with fixed names. See [Acquisition group parameters](nshiftDelivery.md#acquisition-group-parameters) |
| `FreightClass` | The lowest numeric freight class among the products (`freightClass`) and the order lines (property `FreightClass`). Empty when none is set |

Follow these rules when you write the value:

*   Field names are case-sensitive. Omnium ignores a field it does not recognise.
*   Omnium does not remove spaces, so do not put spaces around `:` or `|`.
*   Every pair needs a `:`, and each parameter name can appear only once. Otherwise the search fails.
*   Omnium adds the custom fields only when the cart or order has order lines.

Omnium always sends `TotalWeight` in kilograms. If the rules in your nShift delivery checkout expect grams, a 3 kg order is sent as `3` and does not match a rule such as "weight over 1000". Write the rules in kilograms, or send the weight yourself with [additional query parameters](nshiftDelivery.md#additional-query-parameters).

### Where the weight and dimensions come from

Omnium calculates the weight and dimension fields from the `colli` list on each product in the cart or order. It uses the variant's colli when the variant has any, and otherwise the product's. Each colli counts once per ordered quantity. A product without colli adds nothing, and the fields are `0` when no product has colli.

| Colli field | Unit |
| --- | --- |
| `weight` | gram |
| `length`, `width`, `height` | centimetre |
| `volume` | dm³ |

### Acquisition group parameters

The `AcquisitionGroup` field ignores the parameter name in its pair, so any name works (for example `AcquisitionGroup:AcquisitionGroup`). It reads the property `AcquisitionGroup` on each product and adds six parameters. Each is `true` when at least one product has the matching value (case-insensitive), otherwise `false`.

| Parameter | Product property value |
| --- | --- |
| `DC` | `DC` |
| `DirBuKu` | `Dir bu/ku` |
| `DirButik` | `Dir butik` |
| `DirDC` | `Dir/DC` |
| `DirHUBEH` | `Dir/HUBEH` |
| `DirKund` | `Dir kund` |

### Additional query parameters

To send parameters that Omnium does not calculate, set the property `UnifaunDeliveryOptions_AdditionalQueryStringParameters` on the cart or order. Omnium appends the value to the delivery checkout query exactly as written, so write it as a URL-encoded query string:

```json
{
  "properties": [
    {
      "key": "UnifaunDeliveryOptions_AdditionalQueryStringParameters",
      "value": "weight=3000&isb2b=false"
    }
  ]
}
```

When this property has a value, Omnium sends it **instead of** the `DeliveryCheckoutCustomFields` values. Include every parameter your nShift rules need. Like the custom fields, it is sent only when the cart or order has order lines.

* * *

## Return Shipments

### Configuration

1.  Set **Shipment Return Product** on the shipment option with the nShift service ID for returns
2.  The system automatically reverses sender/recipient addresses for return bookings

### Special Handling for Bring Carriers

For Bring carriers (products starting with 'b'), return bookings use direct consignment requests instead of the prepareId method.

* * *

## Label Management

### PDF Configuration

Labels are generated with the following default settings:

*   **Target 1**: `thermo-se` (Swedish thermal printer)
*   **Target 2**: `laser-a4` (A4 laser printer)

### Label Storage

Labels are uploaded to Azure Blob Storage in the `unifaunshippinglabels` container.

### Direct Printing

To enable direct printing:

1.  Configure **UnifaunPrinterId** on user preferences or store
2.  Labels are sent to the printer queue automatically
3.  Batch processing supports up to 50 shipments per batch

* * *

## Dangerous Goods Support

Products can be marked with dangerous goods flags. If ANY flag is true, the order is marked as containing dangerous goods:

*   Explosive
*   Corrosive
*   Oxidizing
*   Toxic
*   Harmful
*   Strong odor
*   Environmentally hazardous
*   Gas under pressure
*   Aerosol
*   Harmful to health
*   Flammable

Store dangerous goods information as JSON in the product's `DangerousGoods` property.

* * *

## API Endpoints

| Endpoint | Purpose |
| --- | --- |
| `GET /rs-extapi/v1/delivery-checkouts/{merchantId}` | Query delivery options |
| `POST /rs-extapi/v1/shipments/` | Book direct shipments |
| `POST /rs-extapi/v1/delivery-checkouts/{merchantId}` | Prepare shipments (creates UnifaunPrepareId) |
| `GET /rs-extapi/v1/prepared-shipments/{orderId}` | Get prepared shipment data |
| `POST /rs-extapi/v1/prepared-shipments/{prepareId}/shipments` | Book prepared shipment |
| `GET /rs-extapi/v1/shipments/{shipmentId}/pdfs/{pdfId}` | Download label PDF |
| `POST /rs-extapi/v1/print/shipments/{shipmentId}/prints/{labelId}/printjobs` | Submit to printer |

* * *

## Error Handling

### Error Keys

| Error Key | Description |
| --- | --- |
| `UnifaunBookingError` | Booking failure for standard shipments |
| `UnifaunBookingReturnError` | Booking failure for return shipments |

Errors are stored on the Order entity and automatically removed on successful booking.

* * *

## Supported Features

| Feature | Supported |
| --- | --- |
| Delivery checkout widget | Yes |
| Outbound shipment booking | Yes |
| Return shipment booking | Yes |
| PrepareId-based booking | Yes |
| Direct shipment booking | Yes |
| Label generation (PDF) | Yes |
| Direct printing | Yes |
| Pickup point selection | Yes (via widget) |
| Dangerous goods handling | Yes |
| B2B/B2C differentiation | Yes |
| Tax calculations | Yes |
| Multi-parcel shipments | Yes |

* * *

## Troubleshooting

### Common Issues

1.  **Booking fails with invalid phone number**: The system validates phone numbers against market patterns. Ensure the phone number matches the destination country format.

2.  **PrepareId not found**: Verify the `UnifaunPrepareId` property is set on the order or shipment properties.

3.  **Widget not loading**: Check that `UseWidget` property is set to `true` and Vue Template is `unifaun-provider`.
