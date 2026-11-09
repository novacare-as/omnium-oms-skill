# API Reference

Source: https://docs.omnium.no/docs/Stores/store-api

> Learn all you need to know about the store API

## Omnium Store API

The **Omnium Store API** allows you to manage and retrieve store-related data, including store details, opening hours, and more. It provides several operations to create, retrieve, update, and delete store records, making it easy to integrate with external systems. The API enables seamless management of store locations and configurations, as well as the ability to manage special opening hours for holidays and other exceptions.

Each store contains essential details such as location, contact information, operating hours, and more. With this API, you can efficiently manage and customize store data for smooth operations across your system.

* * *

## Store Model

A store in Omnium is represented by a JSON object with the following structure:

```json
{
  "id": "Acme",
  "name": "acme.com",
  "address": {
    "streetName": "Street name",
    "streetNumber": "1",
    "city": "New York",
    "zipcode": "10001",
    "region": "NY",
    "regionCode": "",
    "country": "USA",
    "countryCode": "US"
  },
  "availableOnMarkets": ["USA"],
  "phoneNumber": "212-111-111-1111",
  "email": "acme@omnium.com",
  "comment": null,
  "url": "",
  "latitude": "40.7237",
  "longitude": "-73.9898",
  "googlePlaceId": "",
  "mondayOpeningHours": {
    "isOpen": true,
    "openFrom": "08:00:00",
    "openTo": "16:00:00"
  },
  "additionalOpeningHours": [
    {
      "date": "2019-04-19T00:00:00",
      "openingHours": {
        "isOpen": false,
        "openFrom": "00:00:00",
        "openTo": "00:00:00"
      },
      "closed": true
    }
  ],
  "externalIds": null,
  "isWarehouse": true,
  "isPrimaryWarehouse": true,
  "isPublicVisible": false,
  "properties": null
}
```

This structure includes the following fields:

*   **id**: Unique store identifier.
*   **name**: Store name or domain name.
*   **address**: The store’s physical address.
*   **availableOnMarkets**: Markets where the store is available.
*   **contact information**: Phone number and email.
*   **opening hours**: Regular and special hours for each day of the week.

You can find more details in the [Store model documentation](https://api.omnium.no/documentation/index.html#/model-OmniumStore).

* * *

## Store Example

A webshop located at Manhattan, New York City, New York, US could look like this:

```json
{
  "id": "Acme",
  "name": "acme.com",
  "address": {
    "streetName": "Street name",
    "streetNumber": "1",
    "city": "New York",
    "zipcode": "10001",
    "region": "NY",
    "regionCode": "",
    "country": "USA",
    "countryCode": "US"
  },
  "availableOnMarkets": ["USA"],
  "phoneNumber": "212-111-111-1111",
  "email": "acme@omnium.com",
  "comment": null,
  "url": "",
  "latitude": "40.7237",
  "longitude": "-73.9898",
  "googlePlaceId": "",
  "mondayOpeningHours": {
    "isOpen": true,
    "openFrom": "08:00:00",
    "openTo": "16:00:00"
  },
  "additionalOpeningHours": [
    {
      "date": "2019-04-19T00:00:00",
      "openingHours": {
        "isOpen": false,
        "openFrom": "00:00:00",
        "openTo": "00:00:00"
      },
      "closed": true
    }
  ],
  "externalIds": null,
  "isWarehouse": true,
  "isPrimaryWarehouse": true,
  "isPublicVisible": false,
  "properties": null
}
```

In the Omnium GUI, the store would appear with a map location of any given coordinates.

![Image](https://docs.omnium.no/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fstores_sample.97494563.jpg&w=3840&q=75)

You can also edit store information in the GUI.

![Image](https://docs.omnium.no/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fstore_edit.fa936956.jpg&w=3840&q=75)

* * *

## Store Operations

### Create Store

Add a new store to Omnium by submitting a store object to the stores endpoint. If the store exists, it will be overridden by the object. The store's `chartOfAccounts` and `taxGroups` are kept when you leave them out — see [Store accounts and VAT rates](store-api.md#store-accounts-and-vat-rates).

[Create store documentation](https://api.omnium.no/documentation/index.html#/Stores/put_api_Stores).

### Get Store

*   **Get all stores**: Retrieve a list of all stores, warehouses, and pickup points.

    *   [Get all stores documentation](https://api.omnium.no/documentation/index.html#/Stores/StoresGet)
*   **Get single store**: Retrieve information about a single store using its ID.

    *   [Get single store documentation](https://api.omnium.no/documentation/index.html#/Stores/StoresGet)

### Update Store

Update a store by submitting a store object.

[Update store documentation](https://api.omnium.no/documentation/index.html#/Stores/StoresPut).

### Delete Store

To delete a store, send a delete request to the stores endpoint.

Important

The store will be permanently deleted and cannot be recovered.

[Delete store documentation](https://api.omnium.no/documentation/index.html#/Stores/StoresDelete).

### Get the VAT rates a store sells under

```
GET /api/Stores/{storeId}/TaxGroups?validOn=2026-11-01
```

Returns the VAT rates (tax groups) the store sells under: the store's own VAT rates merged over the tenant VAT rates by code. Use it, for example, in a webshop that shows prices excluding VAT for a store with its own [VAT rates](../Order/Ledger/ledger-tax-groups.md#store-vat-rates).

*   Only active rows are returned.
*   Without `validOn`, every validity window of a code is returned. With `validOn`, only the rows valid on that day are returned.
*   The list is empty when the tenant does not use tax groups. It is also empty for a store without rows of its own when the tenant has no VAT rates of its own.
*   The account overrides of the rows are not returned.
*   An unknown store returns `404`.

A shortened response for a store that replaces the `FOOD` code — the response also contains every tenant code the store does not replace:

```json
[
  {
    "code": "FOOD",
    "name": "Livsmedel 12%",
    "rate": 12,
    "externalCode": "MP2",
    "isOutsideVatScope": false,
    "isActive": true
  },
  {
    "code": "HIGH",
    "name": "Standard 25%",
    "rate": 25,
    "externalCode": "3",
    "isOutsideVatScope": false,
    "isActive": true
  }
]
```

* * *

## Store accounts and VAT rates

A store can have its own accounting accounts and its own VAT rates, which replace individual tenant entries. Both are lists on the store model:

| Field | Type | Description |
| --- | --- | --- |
| `chartOfAccounts` | array | The store's own accounts. Each one replaces the tenant account it matches on category, discriminator, currency, and tax group. The fields are described in [Chart of Accounts](../Order/Ledger/ledger-chart-of-accounts.md); `category` is sent as the category name, for example `"Sales"`. See [Store Accounts](../Order/Ledger/ledger-store-accounts.md). |
| `taxGroups` | array | The store's own VAT rates. A row replaces every tenant row with the same code, and the code must exist in the tenant VAT rates. When the tenant has no VAT rates of its own, the stores define the codes. The fields are described in [Tax Groups](../Order/Ledger/ledger-tax-groups.md#tax-group-fields). See [Store VAT rates](../Order/Ledger/ledger-tax-groups.md#store-vat-rates). |

Besides the fields described on those pages, a VAT rate row has `overrideSalesAccountNumber` and `overrideOutputVatAccountNumber`, which are stored with the row but not used by postings — postings take their accounts from the chart of accounts — and an account entry has `properties`, its custom properties.

How the two lists behave in the API:

*   **Reading** — they are returned when you get a single store and in the responses of `PUT /api/Stores` and `POST /api/Stores/Update`. Store lists and searches leave them out.
*   **Writing** — on `POST /api/Stores`, `PUT /api/Stores`, `POST /api/Stores/Update`, and `POST /api/Stores/AddMany`, a list you leave out keeps the store's current list, and an empty list removes it. On `PATCH /api/Stores/PatchStore`, a list you send replaces the whole list. `POST /api/Stores/Enrich` fills a list only when the store has none.
*   **Validation** — VAT rates you change that break a rule return `400` with the reason. One example is a code the tenant does not have, when the tenant has VAT rates of its own. A list sent back unchanged is accepted. `POST /api/Stores/AddMany` checks every store before it saves any of them.

* * *

## More Store Information

### Store Opening Hours

A store has opening hours for every day of the week as separate properties (e.g., `mondayOpeningHours`, `tuesdayOpeningHours`, etc.). You can also create special opening hours for public holidays or other exceptions.

For more details, refer to the [Opening Hours Model documentation](https://api.omnium.no/documentation/index.html#/model-OmniumOpeningHours).

### Special Opening Hours Model

For special opening hours, refer to the [Special Opening Hours Model documentation](https://api.omnium.no/documentation/index.html#/model-OmniumSpecialOpeningHours).

* * *

## Store FAQ

### Creating a Store: What is a Store ID?

A store ID must be unique across all markets. Any duplicate IDs will overwrite existing stores. We recommend using URL-friendly IDs.
