# Ingrid Integration

Source: https://docs.omnium.no/docs/plugins/Shipments/ingrid-plugin

Omnium offers integration with Ingrid, enabling seamless order management. Orders added to Omnium that include an Ingrid transport order ID can be processed directly through Omnium. The Ingrid widget can be activated in the Omnium user interface, allowing users to create new shipments effortlessly.

* * *

## Omnium - Ingrid setup

### Configuring Omnium: Adding a new shipping provider

1.  Navigate to the configuration settings: **Configuration -> Settings -> Orders -> Shipping Providers**

2.  Add the following details:

    *   **Name**: Enter the name of the provider.
    *   **Display Name**: Specify the name to be shown to users.
    *   **Provider**: Select "Ingrid."
    *   **Merchant Secret**: Retrieve this from the Ingrid portal. This is used as a Bearer token for API authentication.
    *   **Base URL**:
        *   For testing: `https://api-stage.ingrid.com/v1`
        *   For production: `https://api.ingrid.com/v1`
    *   **Customer Number** (Optional): Used for Bring carrier integration as a fallback when not configured on the store.
3.  Enable the Ingrid Widget in the Omnium UI (Optional):

    *   **Vue Template**: Set the template to `ingrid-provider`.
    *   **Turn On**: Enable the **Display in OMS** option.

This configuration will integrate Ingrid as a shipping provider within Omnium and allow the use of the Ingrid widget in the user interface.

* * *

## Ingrid shipment options

### Adding shipment options for each market

Under each market, define the shipment options you provide in your webshop:

1.  Include the following details:

    *   **Shipping Provider**: Set as "Ingrid."
    *   **Delivery Type**:
        *   Use `Delivery` if the package is sent to the customer (e.g., home delivery, pickup points).
        *   Use `Pickup` if the customer collects the package at a store or warehouse.
    *   **Display Name**: Enter a user-friendly name for the option.
    *   **Shipping Method**: Provide the system name or shipping code from Ingrid (e.g., `pnl-mph` for Postnord home delivery).
    *   **Shipping Company**: Set the carrier name (e.g., `postnord`, `bring`, `gls`). This is used to determine carrier-specific metadata for booking.
    *   **Shipment Return Product** (Optional): The Ingrid product code to use for return shipments. Required if you want to support return bookings through Ingrid.
2.  Navigate to the Property Tab:

    *   Mark the option as **Hidden in OMS** to ensure shipment options are selected through the Ingrid widget.

* * *

## Return shipments

### Configuring return shipments

To enable return shipment booking through Ingrid:

1.  Configure the **Shipment Return Product** on the shipment option with the appropriate Ingrid product code for returns.

2.  Configure the store's return address:

    *   If the store has a **Shipping Address** configured, it will be used as the return destination.
    *   If no Shipping Address is set, the store's main address is used as fallback.

When a return shipment is booked:

*   The order's shipping address becomes the sender (customer returning the package)
*   The store's address becomes the recipient (where the return is sent)
*   The direction type is set to `RETURN`

* * *

## Carrier-specific configuration

### Store ExternalIds for carriers

Certain carriers require additional configuration on the store level. Add these as **External IDs** on the store:

#### PostNord

*   **Provider Name**: `Postnord`
*   **ID**: Your PostNord customer ID

#### Bring

*   **Provider Name**: `Bring`
*   **ID**: Your Bring customer number

Note

For Bring, if no ExternalId is configured on the store, the **Customer Number** from the shipping provider settings is used as a fallback.

#### GLS

GLS requires up to three External IDs on the store:

*   **Provider Name**: `GlsUsername` - Your GLS username
*   **Provider Name**: `GlsCode` - Your GLS code
*   **Provider Name**: `GlsContactId` - Your GLS contact ID

* * *

## Webshop creates the Ingrid transport order, and Omnium books the shipment

### Integration Flow

1.  In your webshop, when users select a shipment option provided by Ingrid, a corresponding shipment should be added to their cart.
2.  Ensure your webshop creates the Ingrid transport order.
3.  Omnium will then book the shipment based on the transport order details.

* * *

## Storing the TosId for shipments

### Add TosId to the Shipment property list

1.  Include a key named **IngridTosId** in the property list of the shipment or order.
2.  Assign the ID from Ingrid as the value for this key.

Important

The TosId is essential for booking shipments through Omnium. If the **IngridTosId** is not provided, Omnium will be unable to book the shipment.

CommerceTools Compatibility

For CommerceTools integrations, **TosId** (without the "Ingrid" prefix) is also supported as an alternative property name.

* * *

## Additional shipment properties

### IngridSkipUpdateSender

Set `IngridSkipUpdateSender` to `true` on the order or shipment properties to skip updating the sender address and return address when booking. This is useful when Ingrid should use the addresses already configured in the transport order.

```json
{
  "Properties": {
    "IngridSkipUpdateSender": "true"
  }
}
```

* * *

## Ingrid Widget in Omnium UI

When the Ingrid widget is enabled in the Omnium UI, sessions are automatically created and managed for the checkout process. The widget:

*   Creates checkout sessions with cart items including SKU, name, quantity, price, and discount
*   Pre-fills delivery address from the order's billing address
*   Uses purchase country and currency from the order or market settings
*   Sets locale from the market's ISO language code (defaults to `nb-NO`)

After the customer selects their shipping option, the session is completed and the selected delivery method is stored on the order.

* * *

## Label management

### Label storage

When a shipment is booked through Ingrid, the shipping labels are:

1.  Downloaded from Ingrid
2.  Uploaded to Azure Blob Storage in the `ingridshippinglabels` container
3.  The blob URL is stored in the booking confirmation

Note

Direct printing is not supported by the Ingrid integration. Labels must be downloaded from the blob storage URL.

* * *

## Error handling

### Booking errors

When a booking fails, an error is stored on the order with the key `IngridBookingError`. This error can be viewed in the Omnium UI and is automatically removed when a subsequent booking succeeds.

Error details include:

*   Error message from Ingrid
*   Internal error details for debugging

* * *

## Weight handling

Shipment weight is calculated from the packages:

*   If packages have weight configured, the total weight in grams is sent to Ingrid
*   If no weight is configured, a default of 1000 grams is used
*   If multiple packages exist, the `number_of_parcels` field is set accordingly

* * *

## Supported features

| Feature | Supported |
| --- | --- |
| Checkout widget | Yes |
| Outbound shipment booking | Yes |
| Return shipment booking | Yes |
| Multi-parcel shipments | Yes |
| Label download | Yes |
| Direct printing | No |
| Pickup point lookup | No |
| Shipping product lookup | No |
| Shipment status tracking | No |
