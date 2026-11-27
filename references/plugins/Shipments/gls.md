# GLS

Source: https://docs.omnium.no/docs/plugins/Shipments/gls

> Integration with GLS for shipment booking in Omnium.

Omnium integrates with GLS for shipment booking, return handling, and parcel shop services. The current implementation focuses on the Danish market.

* * *

## Configuration Steps

1.  Navigate to: **Configuration > Settings > Orders > Shipping Providers > Add New**

* * *

## Required Settings

| Field | Description | Example |
| --- | --- | --- |
| **Name** | Internal provider name | `GLS` |
| **Display Name** | Name shown to users | `GLS` |
| **Shipping Provider** | Select provider type | `Gls` |
| **Base URL** | GLS API endpoint | `https://ws.gls.dk/` |
| **Tracking URL** | Tracking URL base | `https://track.gls.dk/track?bid=` |

* * *

## Store Configuration

GLS requires store-level authentication via External IDs:

| Provider Name | Description | Required |
| --- | --- | --- |
| `GlsUsername` | GLS API username | Yes |
| `GlsCode` | GLS API password/code | Yes |
| `GlsContactId` | GLS contact ID | Yes |

Important

All three External IDs must be configured on the store. Missing credentials will cause booking failures.

* * *

## Shipment Options

### Adding shipment options for each market

Configure shipping options under each market:

| Field | Description |
| --- | --- |
| **Shipping Provider** | Set to `Gls` |
| **Delivery Type** | `Delivery` (home delivery) or `Pickup` (parcel shop) |
| **Display Name** | User-friendly name |
| **Shipping Method** | Internal name for mapping |
| **Shipment Product** | GLS product code |

* * *

## Parcel Shops (Pickup Points)

### Lookup

GLS uses a SOAP-based Shop Finder service for parcel shop lookup. The service accepts address, postal code, country code, and the number of results to return.

### Response Data

Parcel shops include:

*   Shop number (ServicePointId)
*   Company name
*   Address details
*   Opening hours per weekday
*   Latitude/longitude
*   Distance from search location

Note

The current implementation is focused on Denmark (country code "DK").

* * *

## Booking Process

### API Endpoint

```
POST {BaseUrl}/ws/DK/V1/CreateShipment
```

### Authentication

*   Authentication using GlsUsername and GlsCode from store External IDs
*   Customer ID from GlsUsername; Contact ID from GlsContactId

### Request Structure

```json
{
  "UserName": "gls-username",
  "Password": "gls-code",
  "Customerid": "gls-username",
  "Contactid": "gls-contact-id",
  "ShipmentDate": "20240115",
  "Reference": "order-id",
  "Addresses": {
    "Delivery": { ... },
    "Pickup": { ... }
  },
  "Parcels": [
    {
      "Weight": 1,
      "Reference": "order-id"
    }
  ],
  "Services": {
    "ShopDelivery": "service-point-id",
    "NotificationEmail": "customer@email.com"
  }
}
```

### Booking Response

Successful bookings return:

*   ConsignmentId (tracking number)
*   PDF label (base64 encoded)
*   Parcel numbers for each package

* * *

## Return Shipments

### Configuration

Return shipments reverse the addresses:

*   Customer location becomes **Pickup** address
*   Store location becomes **Delivery** address
*   `ShopReturn` service flag is set to `"Y"`

### Booking

Return bookings use the same API endpoint with modified address mapping.

* * *

## Label Management

### Label Generation

Labels are returned as base64-encoded PDF in the booking response.

### Label Storage

Labels are uploaded to Azure Blob Storage:

*   **Container**: `shippinglabels`
*   **Filename**: `{ConsignmentId}.pdf`

* * *

## Tracking

### Tracking URL Format

```json
{TrackingUrl}{ConsignmentNumber}
```

Example:

```
https://track.gls.dk/track?bid=123456789
```

* * *

## Services

### Shop Delivery

For parcel shop deliveries, set the `ShopDelivery` service with the service point ID:

```json
{
  "Services": {
    "ShopDelivery": "12345"
  }
}
```

### Notification Email

Customer notification emails can be configured:

```json
{
  "Services": {
    "NotificationEmail": "customer@email.com"
  }
}
```

* * *

## Error Handling

### Error Keys

| Error Key | Description |
| --- | --- |
| `GlsBookingError` | Standard booking failure |
| `GlsReturnBookingError` | Return booking failure |

### Error Response

Failed bookings return error messages in the response body, which are stored on the Order entity.

* * *

## Supported Features

| Feature | Supported |
| --- | --- |
| Outbound shipment booking | Yes |
| Return shipment booking | Yes |
| Label generation (PDF) | Yes |
| Parcel shop lookup | Yes |
| Tracking URL | Yes |
| Shop delivery | Yes |
| Direct printing | No |
| Label download | No |
| Shipment status | No |
| Multi-parcel | Partial (weight hardcoded) |

* * *

## Limitations

1.  **Country Support**: Currently optimized for Denmark (DK)
2.  **Weight**: Package weight is currently hardcoded to 1 kg
3.  **Country Code**: ISO numeric code is hardcoded to "208" (Denmark)
4.  **Single Pickup Point Lookup**: Individual pickup point lookup is not implemented

* * *

## Troubleshooting

### Common Issues

1.  **Missing store credentials**: Ensure all three External IDs (GlsUsername, GlsCode, GlsContactId) are configured on the store.

2.  **Authentication failed**: Verify the GLS credentials are correct and the account is active.

3.  **No parcel shops found**: The SOAP service may be limited to Danish addresses.

4.  **Label not generated**: Check the API response for error messages stored in the order errors.
