# Bring

Source: https://docs.omnium.no/docs/plugins/Shipments/bring

> Integration with Bring for shipment booking in Omnium.

Omnium integrates with Bring for shipment booking, return handling, and pickup point services in the Nordic region.

[Bring API Documentation](https://developer.bring.com/)

* * *

## Configuration Steps

1.  Navigate to: **Configuration > Settings > Orders > Shipping Providers > Add New**

* * *

## Required Settings

| Field | Description | Example |
| --- | --- | --- |
| **Name** | Internal provider name | `Bring` |
| **Display Name** | Name shown to users | `Bring` |
| **Shipping Provider** | Select provider type | `Bring` |
| **Merchant ID** | X-MyBring-API-Uid (typically email) | `user@company.no` |
| **API Token** | X-MyBring-API-Key | `your-api-key` |
| **Customer Number** | Bring customer number | `PARCELS_NORWAY-20000873008` |
| **Base URL** | Bring API endpoint | `https://api.bring.com/` |
| **Is Test** | Enable test mode | `true` or `false` |

* * *

## Shipment Options

### Adding shipment options for each market

Configure shipping options under each market:

| Field | Description |
| --- | --- |
| **Shipping Provider** | Set to `Bring` |
| **Delivery Type** | `Delivery` (sent to customer) or `Pickup` (pickup point) |
| **Display Name** | User-friendly name |
| **Shipping Method** | Internal name for mapping (e.g., `Bring_SERVICEPAKKE`) |
| **Shipment Product** | Bring product code (e.g., `SERVICEPAKKE`, `PICKUP_PARCEL`) |
| **Shipment Return Product** | Product code for return bookings |
| **Get Service Points** | Enable for pickup point validation |

### Default Package Configuration

Configure default package dimensions on the shipment option:

```json
{
  "DefaultPackage": {
    "WeightInKg": 1,
    "DefaultDimensions": {
      "LengthInCm": 20,
      "WidthInCm": 20,
      "HeightInCm": 20
    }
  }
}
```

* * *

## Store Configuration

### Customer Number Override

Override the customer number per store using External IDs:

| Provider Name | Description |
| --- | --- |
| `Bring` | Store-specific Bring customer number |

If no store-level customer number is configured, the provider-level `CustomerNumber` setting is used.

* * *

## Pickup Points

### Lookup by Postal Code

```
GET {BaseUrl}pickuppoint/api/pickuppoint/{countryCode}/postalCode/{postalCode}
```

Optional: Add street address for more accurate results:

```
GET {BaseUrl}pickuppoint/api/pickuppoint/{countryCode}/postalCode/{postalCode}?street={address}
```

### Lookup by Service Point ID

```
GET {BaseUrl}pickuppoint/api/pickuppoint/{countryCode}/id/{servicePointId}
```

### Pickup Point Data

Returned data includes:

*   Service point ID and name
*   Full address
*   Opening hours (day, opening time, closing time)
*   Latitude/longitude coordinates
*   Distance from search location
*   Google Maps and Posten Maps links

* * *

## Booking Process

### Request Format

Bookings are sent as JSON to:

```
POST {BaseUrl}booking/api/booking
```

### Headers

| Header | Value |
| --- | --- |
| `X-MyBring-API-Uid` | Merchant ID (email) |
| `X-MyBring-API-Key` | API Token |
| `X-Bring-Client-URL` | Site URL |
| `X-Bring-Test-Indicator` | `true` or `false` |
| `Accept` | `application/json` |

### Booking Request Structure

```json
{
  "testIndicator": false,
  "schemaVersion": 1,
  "consignments": [
    {
      "correlationId": "order-id",
      "shippingDateTime": "2024-01-15T10:00:00Z",
      "parties": {
        "sender": { ... },
        "recipient": { ... }
      },
      "product": {
        "id": "SERVICEPAKKE",
        "customerNumber": "PARCELS_NORWAY-20000873008",
        "services": {
          "recipientNotification": {
            "email": "customer@email.com",
            "mobile": "+4712345678"
          }
        }
      },
      "packages": [ ... ]
    }
  ]
}
```

### Booking Response

Successful bookings return:

*   Consignment number (tracking number)
*   Labels URL (PDF)
*   Tracking URL
*   Expected delivery date
*   Earliest pickup time

* * *

## Return Shipments

### Configuration

1.  Set **Shipment Return Product** on the shipment option
2.  Optionally disable customer notifications for returns

### Disable Return Notifications

Add to shipment option properties:

```json
{
  "key": "DisableCustomerEmailNotification",
  "value": "true"
}
```

When enabled, the return sender email is not sent to Bring, preventing automatic customer notifications.

* * *

## Recipient Notifications

Enable recipient notifications via the shipment option's **ProviderNotification** setting:

| Notification Type | Description |
| --- | --- |
| Email | Send tracking email to customer |
| SMS | Send tracking SMS to customer mobile |

Notifications are configured in the `product.services.recipientNotification` section of the booking request.

* * *

## Package Handling

### Weight and Dimensions

*   Weights are specified in kilograms in the API
*   Dimensions come from shipment packages or default to shipment option defaults
*   If packages are not specified, a default package is created

### Validation

*   Zero weights are replaced with default weight from shipment option
*   Zero dimensions are filled from default dimensions
*   At least one package is always created

* * *

## Error Handling

### Error Key

| Error Key | Description |
| --- | --- |
| `BringBookingError` | Booking failure |

### Error Storage

Errors are stored on the Order entity:

*   Removed on successful booking
*   Contains API error messages for debugging

* * *

## Supported Products

Common Bring product codes:

| Product | Description |
| --- | --- |
| `SERVICEPAKKE` | Service parcel to pickup point |
| `PICKUP_PARCEL` | Pickup parcel |
| `PA_DOREN` | Home delivery |
| `KLIMANØYTRAL_SERVICEPAKKE` | Climate neutral service parcel |

* * *

## Supported Features

| Feature | Supported |
| --- | --- |
| Outbound shipment booking | Yes |
| Return shipment booking | Yes |
| Pickup point lookup | Yes |
| Pickup point by ID | Yes |
| Recipient notifications | Yes |
| Label generation | Yes |
| Tracking URL | Yes |
| Direct printing | No |
| Label download | No |
| Shipment status | No |
| Available products query | No |

* * *

## Troubleshooting

### Common Issues

1.  **Missing customer number**: Ensure `CustomerNumber` is set in provider settings or as store External ID.

2.  **Invalid product code**: Verify `ShipmentProduct` matches a valid Bring product for the destination country.

3.  **Pickup point not found**: Enable **Get Service Points** on shipment option and provide valid postal code.

4.  **Authentication errors**: Verify `MerchantId` (API UID) and `ApiToken` (API Key) are correct.
