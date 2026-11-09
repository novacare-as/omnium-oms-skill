# Customers

Source: https://docs.omnium.no/docs/plugins/POS/Flow/Customers

> Customer data export from Omnium to Flow Retail for both private and business customers.

## Overview

The Flow integration exports customer data **one-way** from Omnium to Flow Retail. Both private (person) and business (company) customers are supported.

| Customer Type | Flow Type | Interface |
| --- | --- | --- |
| Private Customer | `PERSON` | `IPrivateCustomerExporter` |
| Business Customer | `COMPANY` | `IBusinessCustomerExporter` |

## Private Customer Mapping

| Flow | Omnium | Notes |
| --- | --- | --- |
| `customerUid` | `Id` | Customer identifier |
| `firstname` | `FirstName` | Falls back to `"-"` if empty |
| `lastname` | `LastName` | Falls back to `"-"` if empty |
| `email` | `Email` |  |
| `mobile` | `Phone` |  |
| `address` | `Address.Line1` + `StreetNumber` | Combined street address |
| `city` | `Address.City` |  |
| `postalCode` | `Address.PostalCode` |  |
| `countryCode` | `Address.CountryCode` |  |
| `customerType` | — | Always `PERSON` |
| `loyaltyId` | External ID | Voyado contact ID (see below) |

## Business Customer Mapping

| Flow | Omnium | Notes |
| --- | --- | --- |
| `customerUid` | `Id` | Customer identifier |
| `companyName` | `Name` | Business name |
| `customerParentUid` | `CustomerRelations` | First relation with type `"Parent"` |
| `email` | `Email` |  |
| `mobile` | `Phone` |  |
| `address` | `Address.Line1` + `StreetNumber` | Combined street address |
| `city` | `Address.City` |  |
| `postalCode` | `Address.PostalCode` |  |
| `countryCode` | `Address.CountryCode` |  |
| `vatNumber` | `TaxId` | Tax/VAT identification number |
| `customerType` | — | Always `COMPANY` |
| `loyaltyId` | External ID | Voyado contact ID (see below) |

## Loyalty Integration

The integration automatically maps Voyado loyalty IDs to Flow's `loyaltyId` field. The ID is resolved from external IDs on the customer in the following priority order:

1.  External ID with key `"Voyado"`
2.  External ID with key `"VoyadoContactId"`
3.  External ID with key `"{marketGroupId}_VoyadoContactId"`

This enables loyalty program lookups in Flow POS using the Voyado contact ID.

## Batch Export

The integration supports batch customer creation for bulk imports. This is useful for initial data migration or large-scale customer sync operations. Contact support about this.

## Limitations

*   **No customer club support** — The integration does not support exporting customer club membership data
*   **Duplicate IDs** — The same customer ID cannot be used for both a private and a business customer in Flow
