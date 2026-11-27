# Porterbuddy

Source: https://docs.omnium.no/docs/plugins/Shipments/porterbuddy

> Integration with Porterbuddy for same-day and scheduled delivery in Omnium.

Omnium integrates with Porterbuddy for same-day and scheduled delivery services. Porterbuddy orders are typically created externally (via webshop widget) and then booked through Omnium.

* * *

## Configuration Steps

1.  Navigate to: **Configuration > Settings > Orders > Shipping Providers > Add New**

* * *

## Required Settings

| Field | Description | Example |
| --- | --- | --- |
| **Name** | Internal provider name | `Porterbuddy` |
| **Display Name** | Name shown to users | `Porterbuddy` |
| **Shipping Provider** | Select provider type | `Porterbuddy` |
| **API Token** | Porterbuddy API key | `your-api-key` |
| **Base URL** | Porterbuddy API endpoint | `https://api.porterbuddy.com` |

### Optional Settings

| Field | Description |
| --- | --- |
| **Customer Name** | Account name |
| **Customer Email** | Account email |
| **Tracking URL** | Template for tracking links |

* * *

## Shipment Options

### Adding shipment options for each market

Configure shipping options under each market:

| Field | Description |
| --- | --- |
| **Shipping Provider** | Set to `Porterbuddy` |
| **Delivery Type** | Typically `Delivery` |
| **Display Name** | User-friendly name |
| **Shipping Method** | Internal name for mapping |

### Default Package Configuration

Configure default dimensions for packages:

```json
{
  "DefaultPackage": {
    "WeightInKg": 1,
    "GoodsDescription": "Goods",
    "DefaultDimensions": {
      "HeightInCm": 20,
      "WidthInCm": 20,
      "LengthInCm": 30
    }
  }
}
```

* * *

## Integration Flow

Porterbuddy orders typically follow this flow:

1.  **Webshop**: Customer selects Porterbuddy delivery slot
2.  **Webshop**: Creates Porterbuddy order via their API
3.  **Webshop**: Stores Porterbuddy ID on order
4.  **Omnium**: Receives order with Porterbuddy ID
5.  **Omnium**: Updates shipment details and retrieves labels

Important

The Porterbuddy order must be created externally before Omnium can book the shipment. The Porterbuddy ID is required for booking.

* * *

## Porterbuddy ID Storage

### Shipment Tracking Number

The Porterbuddy ID should be stored in the shipment's `ShipmentTrackingNumber` field.

### Order Properties

Alternative storage locations (used by various integrations):

*   `porterbuddyId` - Standard property key
*   `UnifaunPorterbuddyId` - Used by Unifaun integration

* * *

## API Endpoints

| Endpoint | Method | Purpose |
| --- | --- | --- |
| `/order/{id}/status` | GET | Get order status |
| `/order/{id}/label` | GET | Get shipping label |
| `/order/{id}/update-shipment-details` | PUT | Update package details |

### Authentication

All requests include the API token in the header:

```
x-api-key: {apiToken}
Accept: application/json
```

* * *

## Booking Process

### Update Shipment Details

Before retrieving labels, shipment details are updated:

```json
{
  "shipmentIdentifier": "shipment-id",
  "orderReference": "order-id",
  "parcels": [
    {
      "description": "Goods description",
      "widthCm": 20,
      "heightCm": 20,
      "depthCm": 30,
      "weightGrams": 1000,
      "parcelShipmentIdentifier": "parcel-id"
    }
  ]
}
```

### Weight Conversion

*   Omnium stores weight in kilograms
*   Porterbuddy API expects weight in grams
*   Automatic conversion: `weightKg * 1000`

### Label Retrieval

After updating details, labels are retrieved:

```json
{
  "shipmentLabelUrl": "https://...",
  "packages": [
    {
      "labelUrl": "https://...",
      "parcelShipmentIdentifier": "parcel-id"
    }
  ]
}
```

* * *

## Order Status

Get the current status of a Porterbuddy order:

```json
{
  "orderId": "order-id",
  "orderStatus": "confirmed",
  "pickupDate": "2024-01-15T14:00:00Z",
  "statusUpdatedAt": "2024-01-15T10:00:00Z"
}
```

* * *

## Shipping Method Mapping

### Magento Integration

For Magento orders with dynamic Porterbuddy method names (e.g., `porterbuddy_d_210208+01:00_1730_2130`), Omnium automatically maps these to a standard "Porterbuddy" shipping method.

### JetShop Integration

JetShop integrations detect Porterbuddy orders from:

*   Carrier name: `Porterbuddy`
*   Transporter code: `PTRBDY` (via Unifaun)
*   Ingrid widget shipping data

* * *

## Ongoing WMS Integration

When using Ongoing WMS with Porterbuddy:

| Setting | Value |
| --- | --- |
| Transporter Code | `ONGOING_PORTERBUDDY` |
| Service Code | `ONGOING_PORTERBUDDY_STANDARD` |
| Porterbuddy ID Storage | `FreeText1` field |

* * *

## Error Handling

### Error Key

| Error Key | Description |
| --- | --- |
| `PorterbuddyError` | Booking failure |

### Common Errors

| Error | Cause |
| --- | --- |
| "No Porterbuddy id on order" | Missing ShipmentTrackingNumber |
| "Could not get details" | API update failed |
| "Could not get label" | Label retrieval failed |

* * *

## Supported Features

| Feature | Supported |
| --- | --- |
| Outbound shipment booking | Yes |
| Label retrieval | Yes |
| Order status | Yes (API only) |
| Package dimension updates | Yes |
| Return shipments | No |
| Pickup points | No |
| Direct printing | No |
| Label download | No |

* * *

## Troubleshooting

### Common Issues

1.  **"No Porterbuddy id on order"**: Ensure the Porterbuddy ID is stored in `ShipmentTrackingNumber` on the shipment.

2.  **Missing labels**: Verify the Porterbuddy order was created successfully in the external system before attempting to book.

3.  **Invalid dimensions**: Check that default package dimensions are configured on the shipment option.

4.  **Shipping method not mapped**: For Magento, ensure the order enrichment workflow is configured to map Porterbuddy shipping methods.
