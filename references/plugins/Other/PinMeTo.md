# PinMeTo

Source: https://docs.omnium.no/docs/plugins/Other/PinMeTo

> Guide for setting up PinMeTo integration in Omnium.

## What is PinMeTo?

**PinMeTo** is a tool that helps businesses keep their contact information and opening hours up to date on platforms like **Google Maps**, **Facebook**, **Apple Maps**, and other map and search services.

Instead of manually updating this information on each platform, you can update it in one place — **PinMeTo** — and have the changes published everywhere simultaneously. This saves time, ensures customers find accurate information, and improves your online visibility.

* * *

## Setup in Omnium

To integrate with PinMeTo, a **connector** named **PinMeTo** must be added. Below you can see a draft of the connector. It is important that it implements the `IStoreExporter` and have the properties `AccountId`, `AppId` and `AppSecret` configured. These value of these properties are provided by **PinMeTo**.

```json
{
    "name": "PinMeTo",
    "host": "https://api.pinmeto.com",
    "isAuthenticatedManually": true,
    "timeOut": "00:00:00",
    "implementations": [
        "IStoreExporter"
    ],
    "properties": [
        {
            "key": "AccountId",
            "value": ""
        },
        {
            "key": "AppId",
            "value": ""
        },
        {
            "key": "AppSecret",
            "value": ""
        }
    ]
}
```

Once this connector is configured, stores will be **exported to PinMeTo each time they are saved in Omnium**.

* * *

## Exporting data from Omnium to PinMeTo

Export of store data from **Omnium** to **PinMeTo** is triggered by the scheduled task `PinMeToExportScheduledTask`. This scheduled task can be configured under _Configuration --> Settings --> Integrations --> Scheduled tasks_.

## Importing data from PinMeTo to Omnium

Import of store data from **PinMeTo** to **Omnium** is triggered by the scheduled task `PinMeToImportScheduledTask`. This scheduled task can be configured under _Configuration --> Settings --> Integrations --> Scheduled tasks_.

## Mapping

### Basic Store Information

| **PinMeTo** | **Description** | **Omnium** |
| --- | --- | --- |
| `Name` | Store name | `store.Name` |
| `StoreId` | Internal store ID | `store.Id` |
| `LocationDescriptor` | Display name | `store.Name` |
| `PermanentlyClosed` | Mark as permanently closed | `store.IsInactive` |

### Address

| **PinMeTo** | **Description** | **Omnium** |
| --- | --- | --- |
| `Street` | Street + house number | `store.Address.StreetName + StreetNumber` |
| `City` | City | `store.Address.City` |
| `Zip` | Postal code | `store.Address.Zipcode` |
| `Country` | Country (translated) | `store.Address.Country` |
| `State` | Region/County | `store.Address.Region` |

### Contact Information

| **PinMeTo** | **Description** | **Omnium** |
| --- | --- | --- |
| `Email` | Email address | `store.Email` |
| `Phone` | Phone number | `store.PhoneNumber` |
| `Homepage` | Website/URL | `store.Url` |

### Geolocation

| **PinMeTo** | **Description** | **Omnium** |
| --- | --- | --- |
| `Lat` | Latitude | `store.Latitude` |
| `Lon` | Longitude | `store.Longitude` |

### Regular Opening Hours (Monday–Sunday)

| **PinMeTo** | **Description** | **Omnium** |
| --- | --- | --- |
| `OpeningHours.Monday–Sunday` | Opening hours per day | `store.{Day}OpeningHours` |
| `State` | "Open" or "Closed" | `IsOpen` for the given day |
| `Times.Opens / Closes` | Opening/closing in "hhmm" format | `OpenFrom` and `OpenTo` for the given day |

### Special Opening Hours

| **PinMeTo** | **Description** | **Omnium** |
| --- | --- | --- |
| `Label` | Name of holiday/special day | `storeSpecialOpeningHours.Label` |
| `Start / End` | Date (same for both fields, one-day) | `storeSpecialOpeningHours.Date` |
| `OpenTime` | Opening time (hhmm format) | `OpeningHours.OpenFrom` |
| `CloseTime` | Closing time (hhmm format, "0000" → "2400") | `OpeningHours.OpenTo` |
| `IsClosed` | Whether the store is closed that day | `storeSpecialOpeningHours.Closed` |

### Descriptions

| **PinMeTo** | **Description** | **Omnium** |
| --- | --- | --- |
| `Description.Long` | Long description (max 750 chars, no HTML) | `store.Description` |
| `Description.Short` | Short description (max 255 chars, no HTML) | `store.ShortDescription` |

* * *

## Notes

*   **Address validation**: If `City`, `Zipcode`, or `StreetName` is missing, an exception will be thrown.
*   **Country name translation**:
    *   `"Norge"` → `"Norway"`
    *   `"Sverige"` → `"Sweden"`
    *   `"Danmark"` → `"Denmark"`
*   **HTML is removed** from descriptions using regex.
*   If `OpeningHours.OpenTo == 00:00`, it is sent as `"2400"` to correctly represent midnight in PinMeTo.
