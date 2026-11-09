# Logistra

Source: https://docs.omnium.no/docs/plugins/Shipments/logistra

> Integration with Logistra (Cargonizer) for shipment booking in Omnium.

Omnium integrates with Logistra (Cargonizer) for shipment booking, return handling, service point lookup, and direct printing capabilities.

* * *

## Configuration Steps

1.  Navigate to: **Configuration > Settings > Orders > Shipping Providers > Add New**

* * *

## Required Settings

| Field | Description | Example |
| --- | --- | --- |
| **Name** | Internal provider name | `Logistra` |
| **Display Name** | Name shown to users | `Logistra` |
| **Shipping Provider** | Select provider type | `Logistra` |
| **Merchant ID** | Logistra customer/sender ID | `customer-id` |
| **Merchant Secret** | API key (X-Cargonizer-Key) | `your-api-key` |
| **Base URL** | Logistra API endpoint | `https://api.logistra.com/v2` |

### Optional Settings

| Field | Description |
| --- | --- |
| **Customer Name** | Account owner name (added to consignment) |
| **Customer Email** | Account owner email (added to consignment) |
| **Book Transfer** | Automatically transfer booking |
| **Provider Send Return Label On Email** | Provider sends return labels via email |
| **Add Product Names To Label** | Include product names/SKUs on labels |

* * *

## Shipment Options

### Adding shipment options for each market

Configure shipping options under each market:

| Field | Description |
| --- | --- |
| **Shipping Provider** | Set to `Logistra` |
| **Delivery Type** | `Delivery` or `Pickup` |
| **Display Name** | User-friendly name |
| **Shipping Method** | Internal name for mapping |
| **Shipment Product** | Logistra product code |
| **Shipment Product Name** | Product name for API |
| **Shipment Return Product** | Product code for returns |
| **Country Code** | Two-letter country code |

### Service Point Provider

If pickup points should be fetched from a different provider (e.g., PostNord):

| Field | Value |
| --- | --- |
| **Service Point Provider** | Provider key (e.g., `PostNordV2`) |

* * *

## Store Configuration

### Customer ID Override

Override the customer ID per store using External IDs:

| Provider Name | Description |
| --- | --- |
| `LogistraCustomerId` | Store-specific customer ID |

### Transport Agreement Override

Configure store-specific transport agreements:

| Provider Name | Description |
| --- | --- |
| `Logistra{ShippingCompany}Id` | Store-specific transport agreement |

Example: `LogistraBringId`, `LogistraPostNordId`

### Printer Configuration

For direct printing:

| Location | Property Key |
| --- | --- |
| User preferences | `LogistraPrinterId` |
| Store properties | `LogistraPrinterId` |

* * *

## Provider Services

Configure additional services as JSON array or comma-separated list in **Provider Services**:

### JSON Format

```json
[{"id": "bring_priority", "type": "1_hour"}, {"id": "sms_notification"}]
```

### Comma-Separated Format

```
bring_priority, sms_notification
```

* * *

## Shipment Option Properties

### Product Text Placement

Control where product text appears on the consignment:

| Property Key | Value | Result |
| --- | --- | --- |
| `ProductTextProperty` | `consignee_contact_person` | Products in contact person field |
| `ProductTextProperty` | (any other value) | Products in consignor reference |

### Helthjem Carrier Support

For Helthjem carrier pickup points:

| Property Key | Description |
| --- | --- |
| `ShopId` | Shop ID for helthjem carrier queries |

* * *

## Service Points (Pickup Points)

### Lookup

```
GET {BaseUrl}/service_partners.xml?country={countryCode}&postcode={postalCode}
```

### Response Format

XML response containing service partners with:

*   Number (ServicePointId)
*   Name
*   Address details
*   Opening hours by weekday
*   Distance from search location

### Delegated Lookup

If `ServicePointProvider` is configured on the shipment option, pickup point requests are delegated to that provider.

* * *

## Booking Process

### API Endpoint

```
POST {BaseUrl}/consignments.xml
```

### Headers

| Header | Value |
| --- | --- |
| `X-Cargonizer-Key` | API key (Merchant Secret) |
| `X-Cargonizer-Sender` | Customer ID |
| `Accept` | `application/xml` |

### XML Request Structure

```
<consignments>
  <consignment>
    <values>
      <order-id>{orderId}</order-id>
      <provider>{customerName}</provider>
      <provider-email>{customerEmail}</provider-email>
    </values>
    <transfer>{bookTransfer}</transfer>
    <product>{productName}</product>
    <transport_agreement>{transportAgreement}</transport_agreement>
    <parts>
      <consignee>...</consignee>
      <return_address>...</return_address>
      <service_partner>...</service_partner>
    </parts>
    <items>
      <item>
        <type>package</type>
        <amount>1</amount>
        <weight>{weightKg}</weight>
        <description>{goodsDescription}</description>
      </item>
    </items>
    <services>...</services>
    <references>...</references>
  </consignment>
</consignments>
```

### NVIT Customs Declarations

For domestic Norwegian shipments, Omnium adds one `<nvit>` element per customs code (HS number) group to the consignment, as attributes:

```
<consignment>
  ...
  <nvit quantity="2" number="610910" description="T-shirts" gross-weight="1.234" net-weight="1.1" origin-country="NO" currency="NOK" amount="1200.50"/>
  <nvit quantity="1" number="640411" description="Sneakers" gross-weight="0.8"/>
</consignment>
```

See [NVIT (Norwegian Goods in Transit)](../Shipments.md#nvit-norwegian-goods-in-transit) for when this data is built and what each value is derived from.

### Response

Successful bookings return:

*   Consignment ID
*   Tracking number with checksum
*   Tracking URL
*   Label PDF URL

* * *

## Return Shipments

### Configuration

1.  Set **Shipment Return Product** on the shipment option
2.  Optionally enable **Provider Send Return Label On Email** to have Logistra email labels

### Email Label Option

When enabled, labels are emailed by Logistra instead of returned for printing:

*   `email_label_to_consignee` element set in XML request

* * *

## Label Management

### Label Download

```
GET {BaseUrl}/consignments/label_pdf?consignment_ids[]={consignmentId}
```

### Label Storage

Labels are uploaded to Azure Blob Storage:

*   **Container**: `logistrashippinglabels`
*   **Format**: PDF

* * *

## Direct Printing

Logistra supports direct printing to network printers.

### Print Endpoint

```
POST {BaseUrl}/consignments/label_direct
```

### Batch Processing

*   Consignments are processed in batches of 50
*   Both shipment and return labels can be printed

### Printer ID

Printer ID is retrieved from:

1.  User preferences (`LogistraPrinterId`)
2.  Store properties (fallback)

* * *

## Product Names on Labels

When **Add Product Names To Label** is enabled:

*   Order line items are collected for each package
*   Format: `{AlternativeProductName or Code}*{quantity}`
*   Limited to 30 items, truncated with "..."
*   Placement controlled by `ProductTextProperty` setting

* * *

## Error Handling

### Error Key

| Error Key | Description |
| --- | --- |
| `LogistaBookingError` | Booking failure |

### Error Response Parsing

Error responses are XML with structure:

```
<consignments>
  <consignment>
    <errors>
      <error>Error message 1</error>
      <error>Error message 2</error>
    </errors>
  </consignment>
</consignments>
```

* * *

## Address Mapping

### Consignee (Recipient)

Mapped from order address:

*   Name: Full name, FirstName + LastName, or Organization
*   Contact: Daytime phone > Evening phone > General phone
*   Email from address
*   Country defaults to shipment option country code

### Return Address (Sender)

Mapped from store:

*   Prefers store's shipping address
*   Falls back to main store address
*   Validates required fields (name, street, zipcode)
*   Country defaults to "NO" (Norway)

* * *

## Supported Features

| Feature | Supported |
| --- | --- |
| Outbound shipment booking | Yes |
| Return shipment booking | Yes |
| Label generation (PDF) | Yes |
| Service point lookup | Yes |
| Direct printing | Yes |
| Email labels | Yes |
| Product names on labels | Yes |
| Provider services | Yes |
| Delegated service points | Yes |
| Multi-store configuration | Yes |
| NVIT customs declarations | Yes |
| Shipment status | No |
| Single pickup point lookup | No |

* * *

## Troubleshooting

### Common Issues

1.  **Missing transport agreement**: Ensure the shipment option has a valid transport agreement or configure store-level External ID.

2.  **Direct print not working**: Verify `LogistraPrinterId` is configured in user preferences or store properties.

3.  **Service points not found**: Check if `ServicePointProvider` should be configured for delegated lookup.

4.  **Invalid product**: Verify `ShipmentProductName` matches a valid Logistra product code.
