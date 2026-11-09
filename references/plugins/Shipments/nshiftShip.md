# nShift Ship

Source: https://docs.omnium.no/docs/plugins/Shipments/nshiftShip

> Integration with nShift Ship (Consignor) for shipment booking in Omnium.

Omnium integrates with nShift Ship V1 (formerly Consignor Shipping Advisor) for shipment booking, label generation, and pickup point services.

[nShift Ship API V1](https://helpcenter.nshift.com/hc/en-us/sections/360000749613-API-Version-1)

* * *

## Configuration Steps

1.  Navigate to: **Configuration > Settings > Orders > Shipping providers > Add New**

* * *

## Required Settings

| Field | Description | Example |
| --- | --- | --- |
| **Name** | Internal provider name | `Consignor` |
| **Display Name** | Name shown to users | `nShift Ship` |
| **Shipping Provider** | Select provider type | `Consignor` |
| **Merchant ID** | Actor CSID from nShift | `3996` |
| **Merchant Secret** | API Key from nShift | `your-api-key` |
| **Base URL** | nShift Ship API endpoint | `https://www.shipmentserver.com/ship/ShipmentServerModule.dll` |

### Optional Settings

| Field | Description |
| --- | --- |
| **API Token** | Optional additional token |
| **Tracking URL** | Template for tracking links |
| **Is Test** | Enable test mode |

* * *

## Shipment Options

### Adding shipment options for each market

Configure shipping options under each market:

| Field | Description |
| --- | --- |
| **Shipping Provider** | Set to `Consignor` |
| **Delivery Type** | `Delivery` (sent to customer) or `Pickup` (collected at store) |
| **Display Name** | User-friendly name |
| **Shipping Method** | Internal name for mapping |
| **Shipment Product** | Product Concept ID from nShift (integer) |
| **Shipment Return Product** | Product Concept ID for returns |
| **Shipping Company** | Carrier name (e.g., `DHL`) for special handling |

### Service Configuration

Add provider services as a comma-separated list of service IDs:

*   **Provider Services**: `442021, 442022`

### ConsignorServiceId Property

For pickup point filtering, add to shipment option properties:

```json
{
  "key": "ConsignorServiceId",
  "value": "442021"
}
```

* * *

## Store Configuration

### Actor ID Override

Override the default Actor ID per store using External IDs:

*   **Provider Name**: `Consignor_actorId`
*   **ID**: Store-specific Actor CSID

### Multi-tenant Authentication

Configure store or market-specific authentication in the shipping provider's **AuthSettings**:

```json
{
  "AuthSettings": [
    {
      "Id": "store-id",
      "AuthLevel": "Store",
      "MerchantId": "store-actor-id",
      "MerchantSecret": "store-api-key"
    },
    {
      "Id": "market-id",
      "AuthLevel": "Market",
      "MerchantId": "market-actor-id",
      "MerchantSecret": "market-api-key"
    }
  ]
}
```

Market-level authentication takes priority over store-level.

* * *

## Pickup Points (Drop Points)

### Configuration

The Consignor provider supports pickup point lookup via the GetDropPoints API.

### Request Parameters

| Parameter | Description |
| --- | --- |
| **ProdConceptID** | Product concept ID from shipment option |
| **ResultCount** | Maximum results (default: 10) |
| **Services** | Optional service ID filter from `ConsignorServiceId` property |

### Pickup Point Data

Returned pickup points include:

*   Service point ID (OriginalID)
*   Name and address
*   Latitude/longitude coordinates
*   Distance from search location
*   Contact information (phone, email)

* * *

## Booking Process

### Standard Shipment Booking

1.  Shipment request is built from order and shipment data
2.  Addresses are mapped (sender from store, recipient from order)
3.  Package weights converted to grams (kg \* 1000)
4.  Services parsed from shipment option configuration
5.  Request submitted via "SubmitShipment" command
6.  Labels uploaded to Azure Blob Storage (`consignorshippinglabels` container)
7.  Tracking URL retrieved

### Return Shipment Booking

1.  Uses `ShipmentReturnProduct` instead of `ShipmentProduct`
2.  Addresses reversed (customer becomes sender, store becomes recipient)
3.  Additional return documentation handled (waybills)

* * *

## DHL-Specific Features

When **Shipping Company** is set to `DHL`:

*   Pickup times are automatically set (14:00-16:00 next business day)
*   Driver messages can be added via store property `ConsignorMessageToDriver`

* * *

## Label Management

### Label Storage

Labels are uploaded to Azure Blob Storage:

*   **Container**: `consignorshippinglabels`
*   **Format**: PDF
*   **Naming**: `{shipment-id}.pdf`

### Multiple Labels

For shipments with multiple packages:

*   First label (index 0): Main shipment label
*   Additional labels: Named as "Additional return doc. #1", "#2", etc.
*   If second label has PkgCSID == 0: Named "Waybill"

* * *

## API Commands

| Command | Purpose |
| --- | --- |
| `SubmitShipment` | Book shipment and generate labels |
| `GetDropPoints` | Retrieve available pickup points |
| `GetTrackingURL` | Get tracking link for booked shipment |

### Request Format

All requests are sent as HTTP POST with form-encoded content:

```
POST {BaseUrl}
Content-Type: application/x-www-form-urlencoded

options={options}&data={json}&actor={merchantId}&key={merchantSecret}&command={command}
```

* * *

## Error Handling

### Error Key

| Error Key | Description |
| --- | --- |
| `ConsignorBookingError` | Booking failure |

### Error Logging

Failed bookings are logged to order events with detailed error information and the booking request for debugging purposes.

* * *

## Address Mapping

### Sender (Normal Shipment) / Recipient (Return)

Mapped from store:

*   Uses store's shipping address if available
*   Falls back to main store address
*   Phone/mobile from store.PhoneNumber

### Recipient (Normal Shipment) / Sender (Return)

Mapped from order shipment address:

*   Customer name and address
*   Phone and email from order

### Pickup Point (Drop Point)

When delivery type is pickup:

*   The pickup point address is mapped as a drop point
*   ServicePointId is included in the booking request

* * *

## Goods Description

When **IncludeGoodsDescription** is enabled on the shipment option:

*   The shipment's goods description is added as a contents reference
*   Falls back to the default package's goods description if the shipment has none

* * *

## Supported Features

| Feature | Supported |
| --- | --- |
| Outbound shipment booking | Yes |
| Return shipment booking | Yes |
| Label generation (PDF) | Yes |
| Pickup point lookup | Yes |
| Tracking URL | Yes |
| Multi-package shipments | Yes |
| DHL-specific handling | Yes |
| Multi-tenant (store-level auth) | Yes |
| Direct printing | No |
| Label download | No |
| Shipment status tracking | No |

* * *

## Troubleshooting

### Common Issues

1.  **Missing Product Concept ID**: Ensure `ShipmentProduct` is set as an integer representing the Consignor Product Concept ID.

2.  **No pickup points returned**: Verify the `ConsignorServiceId` property matches available services for the product.

3.  **Authentication errors**: Check Actor CSID and API Key. For multi-store setups, verify store-level AuthSettings.
