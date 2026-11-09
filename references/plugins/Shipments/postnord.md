# PostNord

Source: https://docs.omnium.no/docs/plugins/Shipments/postnord

> Integration with PostNord for shipment booking in Omnium.

Omnium provides integration with PostNord for shipment booking, label generation, and pickup point services.

There are two PostNord provider implementations:

*   **PostNordV2** (Recommended) - Uses EDI-based booking API
*   **PostNord** (Legacy) - Uses OAuth2-based transport booking API

[PostNord API Documentation](https://developer.postnord.com/apis/details?systemName=shipment-v3-booking-sao)

* * *

## PostNord V2 (Recommended)

### Configuration

1.  Navigate to: **Configuration > Settings > Orders > Shipping Providers > Add New**

2.  Add the following details:

| Field | Description | Example |
| --- | --- | --- |
| **Name** | Internal provider name | `PostNord` |
| **Display Name** | Name shown to users | `PostNord` |
| **Provider** | Select provider type | `PostNordV2` |
| **API Token** | API key from PostNord portal | `your-api-key` |
| **Customer Number** | Customer ID from PostNord | `123456` |
| **Customer Name** | Account name from PostNord | `Company Name` |
| **Base URL** | API endpoint | See below |

### Base URLs

| Environment | URL |
| --- | --- |
| **Testing** | `https://atapi2.postnord.com` |
| **Production** | `https://api2.postnord.com` |

### API Endpoint

For shipment booking, Omnium uses:

```json
{BaseUrl}/rest/shipment/v3/edi/labels/pdf
```

* * *

## Shipment Options

### Adding shipment options for each market

Configure shipping options under each market:

| Field | Description |
| --- | --- |
| **Shipping Provider** | Set to `PostNordV2` |
| **Template** | `Standard` for home delivery, `PickUp Point` for pickup points |
| **Delivery Type** | `Delivery` (sent to customer) or `Pickup` (collected at store) |
| **Display Name** | User-friendly name |
| **Shipping Method** | Internal name for mapping order shipments |
| **Shipment Product** | `BasicServiceCode` from PostNord (e.g., `19`, `18`) |
| **Shipment Return Product** | `BasicServiceCode` for return bookings |

### Property Tab Options

| Property | Description |
| --- | --- |
| **Get Pickup Points** | Enable for pickup point services to validate service point |
| **HideFromApi** | Hide this option from Omnium API responses |

* * *

## Store Configuration

### Customer Number Override

Override the customer number per store using External IDs:

| Provider Name | Description |
| --- | --- |
| `Postnord` | Store-specific customer ID for outbound shipments |
| `PostnordRetur` | Store-specific customer ID for return shipments |

* * *

## Country Support

PostNord V2 supports the following countries with specific issuer codes:

| Country | Code | Issuer Code |
| --- | --- | --- |
| Norway | NO | Z13 |
| Denmark | DK | Z11 |
| Sweden | SE | Z12 |
| Finland | FI | Z14 |

* * *

## Pickup Points (Service Points)

### API Version

PostNord V2 uses the **businesslocation v5** API for service point lookup.

### Endpoint

```
GET /rest/businesslocation/v5/servicepoints/nearest/byaddress
```

### Parameters

| Parameter | Description |
| --- | --- |
| `apikey` | API token |
| `returnType` | `json` |
| `countryCode` | Two-letter country code |
| `postalCode` | Postal/ZIP code |

### Response Data

Service points include:

*   Service point ID
*   Name and address
*   Opening hours
*   Distance from search location

* * *

## Booking Process

### EDI Instruction Format

PostNord V2 uses EDI-based booking with the following structure:

```
EdiInstruction
├── MessageDate (UTC)
├── Application (Name: "Omnium")
└── Shipment[]
    └── ShipmentCustoms
        ├── ShipmentIdentification (OrderNumber)
        ├── References (CU type)
        ├── Service
        │   ├── BasicServiceCode
        │   └── AdditionalServiceCode
        ├── Parties
        │   ├── Consignor (with IssuerCode)
        │   ├── Consignee
        │   └── DeliveryParty (for pickup points)
        └── GoodsItem[] (weight/dimensions)
```

### Label Generation

Labels are returned in PDF format. Storage options:

1.  **Direct URL** - Use `UriStoreLabel` from response
2.  **Blob Storage** - Upload label data to Azure Blob Storage (fallback)

* * *

## Return Shipments

PostNord V2 has a dedicated return shipment booking method:

1.  Configure **Shipment Return Product** on the shipment option
2.  Return bookings use separate API endpoint
3.  Addresses are reversed (customer becomes sender)

* * *

## Error Handling

### Error Keys

| Error Key | Description |
| --- | --- |
| `PostnordBookingError` | Standard booking failure |
| `PostnordReturnBookingError` | Return booking failure |

Errors are stored on the Order entity and contain detailed API error messages.

* * *

## Supported Features (V2)

| Feature | Supported |
| --- | --- |
| Outbound shipment booking | Yes |
| Return shipment booking | Yes |
| Label generation (PDF) | Yes |
| Pickup point lookup | Yes |
| Multi-country support | Yes |
| Direct printing | No |
| Label download | No |
| Shipment status tracking | No |

* * *

## PostNord Legacy (V1)

Note

PostNord V1 is a legacy implementation. Use PostNordV2 for new integrations.

### Configuration

| Field | Description |
| --- | --- |
| **Provider** | Select `Postnord` |
| **Merchant ID** | Client ID for OAuth2 |
| **Merchant Secret** | Client Secret for OAuth2 |
| **Is Test** | Enable test environment |

### Authentication

PostNord V1 uses OAuth2 client credentials flow:

*   Tokens are cached for 20 hours
*   Automatic token refresh on expiration

### API Endpoints (V1)

| Endpoint | Purpose |
| --- | --- |
| `/transport-booking/customers/{id}/drafts` | Create draft consignment |
| `/transport-booking/customers/{id}/bookings` | Create booking |
| `/rest/businesslocation/v1/servicepoint/findNearestByAddress.json` | Pickup points |

### Booking Workflow (V1)

1.  Create draft consignment
2.  Create consignment within draft
3.  Update consignment with shipment details
4.  Validate products
5.  Create booking

### Shipping Products (V1)

V1 supports querying available shipping products:

*   MYPACK\_COLLECT (pickup point delivery)
*   MYPACK\_HOME (home delivery)

* * *

## Differences: V1 vs V2

| Feature | V1 (Legacy) | V2 (Recommended) |
| --- | --- | --- |
| **Authentication** | OAuth2 Bearer token | API key in URL |
| **Booking Format** | Draft > Consignment workflow | EDI format |
| **Service Points API** | v1 businesslocation | v5 businesslocation |
| **Configuration** | Complex (multiple URLs) | Simple (single base URL) |
| **Return Shipments** | Same workflow with flags | Dedicated method |
| **Product Lookup** | Supported | Not supported |

* * *

## Troubleshooting

### Common Issues

1.  **Invalid BasicServiceCode**: Ensure `ShipmentProduct` matches a valid PostNord service code for the target country.

2.  **Pickup point not found**: Enable **Get Pickup Points** on the shipment option and ensure valid service point ID is provided.

3.  **Authentication errors (V1)**: Check Merchant ID and Merchant Secret. Token cache may need clearing.

4.  **Missing labels**: Check if blob storage upload succeeded. The system falls back to API URL if upload fails.
