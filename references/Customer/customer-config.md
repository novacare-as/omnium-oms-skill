# Configuration

Source: https://docs.omnium.no/docs/Customer/customer-config

> Learn how to configure customer settings in Omnium, including identification, creation controls, address handling, consent management, and B2B features. This guide covers all customer-related configuration options for administrators and developers.

Customer settings control how customer records are created, validated, and managed throughout Omnium. These settings affect both B2C (private customers) and B2B (business customers) workflows.

* * *

## Customer identification

These settings control how customers are uniquely identified and validated within the system.

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| RequireUniqueCustomerEmails | bool | false | When enabled, the system enforces unique email addresses across all customers. Attempting to create or update a customer with a duplicate email will fail. |
| RequireUniqueCustomerPhoneNumbers | bool | false | When enabled, the system enforces unique phone numbers across all customers. Useful when phone number is a primary identifier. |
| CustomerIdField | string | null | Use an alternative field as the customer identifier. Valid values are `Email` or `Phone`. When set, the specified field's value is used as the customer ID instead of a system-generated ID. |

Enabling unique email or phone number requirements may cause import failures if your existing customer data contains duplicates. Clean up duplicates before enabling these settings.

### Sample

```
"CustomerSettings": {
  "RequireUniqueCustomerEmails": true,
  "RequireUniqueCustomerPhoneNumbers": false,
  "CustomerIdField": "Email"
}
```

* * *

## Customer creation control

These settings control when and how customers are automatically created in Omnium.

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| IsB2CGetOrCreateDisabled | bool | false | When enabled, disables all automatic B2C (private) customer creation. Existing customers can still be retrieved, but new customers will not be created automatically. |
| IsB2BGetOrCreateDisabled | bool | false | When enabled, disables all automatic B2B (business) customer creation. Existing customers can still be retrieved, but new customers will not be created automatically. |
| IsB2CGetOrCreateFromOrderDisabled | bool | false | When enabled, prevents B2C customer creation specifically from order processing. Orders can still reference existing customers. |
| IsB2BGetOrCreateFromOrderDisabled | bool | false | When enabled, prevents B2B customer creation specifically from order processing. Orders can still reference existing customers. |

The "GetOrCreate" settings affect the workflow step that attempts to find or create a customer based on order data. Use the more specific "FromOrder" settings to disable customer creation only during order processing while allowing creation through other channels.

### Sample

```
"CustomerSettings": {
  "IsB2CGetOrCreateDisabled": false,
  "IsB2BGetOrCreateDisabled": false,
  "IsB2CGetOrCreateFromOrderDisabled": true,
  "IsB2BGetOrCreateFromOrderDisabled": true
}
```

* * *

## Address configuration

These settings control how customer addresses are validated and stored.

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| RequiredAddressProperties | string\[\] | \[\] | List of address field names that must be provided when creating or updating customer addresses. Common values include: `Line1`, `City`, `PostalCode`, `CountryCode`. |
| IsStreetNumberSeparated | bool | false | When enabled, the street number is stored in a separate field from the street name. Useful for integrations with systems that require separated address components. |
| UpdateCustomerOnEditShipmentAddress | bool | false | When enabled, editing a shipment address on an order will also update the corresponding address on the customer record. |

### Available address properties

The following property names can be used in `RequiredAddressProperties`:

*   `Line1` - Primary address line (street address)
*   `Line2` - Secondary address line (apartment, suite, etc.)
*   `Line3` - Additional address line
*   `City` - City name
*   `PostalCode` - Postal/ZIP code
*   `CountryCode` - ISO country code
*   `State` - State or region
*   `StreetNumber` - House/building number (when separated)

### Sample

```
"CustomerSettings": {
  "RequiredAddressProperties": [
    "Line1",
    "City",
    "PostalCode",
    "CountryCode"
  ],
  "IsStreetNumberSeparated": true,
  "UpdateCustomerOnEditShipmentAddress": true
}
```

* * *

## Access control

These settings control how access to customer records is restricted.

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| RequireStoreIdsForAccess | bool | false | When enabled, customers are only accessible to users with matching store assignments. Customers must have a `StoreIds` property containing the stores they belong to, and users can only view/edit customers assigned to their stores. |

Store-based access control is useful for multi-store environments where customer data should be segregated by location. This setting affects both the UI and API access.

### Sample

```
"CustomerSettings": {
  "RequireStoreIdsForAccess": true
}
```

* * *

## Version tracking and statistics

These settings control customer record versioning and analytics data collection.

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| TrackVersions | bool | false | When enabled, Omnium maintains a version history of customer records. Each update creates a new version, allowing you to view historical changes. |
| UseStatsCustomerQueues | bool | false | When enabled, customer records are copied to dedicated statistics queues for analytics processing. Enable this for advanced customer analytics and reporting. |
| ExportPrivateCustomers | bool | false | When enabled, private customers are included in exports to external systems (e.g., ERP integrations). |

### Sample

```
"CustomerSettings": {
  "TrackVersions": true,
  "UseStatsCustomerQueues": true,
  "ExportPrivateCustomers": false
}
```

* * *

## Consent management

These settings configure customer consent types for GDPR compliance and marketing preferences.

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| ConsentTypes | array | \[\] | Consent types available for B2C (private) customers. See [Consent type object](customer-config.md#consent-type-object) below. |
| BusinessConsentTypes | array | \[\] | Consent types available for B2B (business) customers. See [Consent type object](customer-config.md#consent-type-object) below. |
| FilterOnGlobalConsents | bool | false | When enabled, consent filtering applies at a global level rather than per-customer. Use this when consents should be managed centrally. |
| CopyConsentsToCustomerClubMember | bool | false | When enabled, consents from the customer record are automatically synchronized to the associated customer club membership. |

### Consent type object

| Property | Type | Description |
| --- | --- | --- |
| Type | string | Unique identifier for the consent type (e.g., "EmailMarketing", "SMS", "ThirdParty") |
| Content | string | Description or translation key for the consent |
| IsRequired | bool | Whether this consent is mandatory for customer registration |
| IsFeatured | bool | Whether this consent should be prominently displayed in the UI |

### Sample

```
"CustomerSettings": {
  "ConsentTypes": [
    {
      "Type": "EmailMarketing",
      "Content": "Consent_EmailMarketing",
      "IsRequired": false,
      "IsFeatured": true
    },
    {
      "Type": "SmsMarketing",
      "Content": "Consent_SmsMarketing",
      "IsRequired": false,
      "IsFeatured": true
    },
    {
      "Type": "ThirdPartySharing",
      "Content": "Consent_ThirdPartySharing",
      "IsRequired": false,
      "IsFeatured": false
    }
  ],
  "BusinessConsentTypes": [
    {
      "Type": "B2BNewsletter",
      "Content": "Consent_B2BNewsletter",
      "IsRequired": false,
      "IsFeatured": true
    }
  ],
  "FilterOnGlobalConsents": false,
  "CopyConsentsToCustomerClubMember": true
}
```

* * *

## Phone number formatting

These settings control how phone numbers are validated and formatted for customers. Separate settings are available for private and business customers.

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| PrivateCustomerPhoneFormatSettings | object | null | Phone number formatting rules for B2C customers. See [Phone format settings object](customer-config.md#phone-format-settings-object) below. |
| BusinessCustomerPhoneFormatSettings | object | null | Phone number formatting rules for B2B customers. See [Phone format settings object](customer-config.md#phone-format-settings-object) below. |

### Phone format settings object

| Property | Type | Description |
| --- | --- | --- |
| RequireCountryCode | bool | When true, phone numbers must include a country code |
| RemoveCountryCode | bool | When true, country codes are stripped from stored phone numbers |
| UsePlusInCountryCode | bool | When true, country codes use the + prefix (e.g., +47) |
| UseZeroZeroInCountryCode | bool | When true, country codes use 00 prefix instead of + (e.g., 0047) |
| DefaultCountryCode | string | Default country code applied when none is provided (e.g., "47" for Norway) |
| ExpectedPhoneNumberFormats | array | Validation rules for phone numbers by country. See [Phone format object](customer-config.md#phone-format-object) below. |

### Phone format object

| Property | Type | Description |
| --- | --- | --- |
| CountryCode | string | The country code this format applies to (e.g., "47", "46") |
| MinExpectedNumberLength | int | Minimum number of digits (excluding country code) |
| MaxExpectedNumberLength | int | Maximum number of digits (excluding country code) |

### Sample

```
"CustomerSettings": {
  "PrivateCustomerPhoneFormatSettings": {
    "RequireCountryCode": true,
    "RemoveCountryCode": false,
    "UsePlusInCountryCode": true,
    "UseZeroZeroInCountryCode": false,
    "DefaultCountryCode": "47",
    "ExpectedPhoneNumberFormats": [
      {
        "CountryCode": "47",
        "MinExpectedNumberLength": 8,
        "MaxExpectedNumberLength": 8
      },
      {
        "CountryCode": "46",
        "MinExpectedNumberLength": 9,
        "MaxExpectedNumberLength": 10
      }
    ]
  },
  "BusinessCustomerPhoneFormatSettings": {
    "RequireCountryCode": true,
    "UsePlusInCountryCode": true,
    "DefaultCountryCode": "47",
    "ExpectedPhoneNumberFormats": [
      {
        "CountryCode": "47",
        "MinExpectedNumberLength": 8,
        "MaxExpectedNumberLength": 8
      }
    ]
  }
}
```

* * *

## Customer relations (B2B)

These settings define relationship types between B2B customers, useful for complex corporate structures where one company may handle invoicing while another receives goods.

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| RelationTypes | array | \[\] | Available relationship types between customers. See [Customer relation object](customer-config.md#customer-relation-object) below. |

### Customer relation object

| Property | Type | Description |
| --- | --- | --- |
| Name | string | Display name for the relationship type |
| IsInvoiceReceiver | bool | When true, related customers with this relationship receive invoices |
| IsGoodsReceiver | bool | When true, related customers with this relationship receive goods |

### Sample

```
"CustomerSettings": {
  "RelationTypes": [
    {
      "Name": "InvoiceCustomer",
      "IsInvoiceReceiver": true,
      "IsGoodsReceiver": false
    },
    {
      "Name": "DeliveryCustomer",
      "IsInvoiceReceiver": false,
      "IsGoodsReceiver": true
    },
    {
      "Name": "HeadquartersCustomer",
      "IsInvoiceReceiver": true,
      "IsGoodsReceiver": true
    }
  ]
}
```

* * *

## Contact roles (B2B)

These settings define available roles for contacts within B2B customer organizations.

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| ContactRoleTypes | array | \[\] | Available role types for B2B contacts. See [Contact role object](customer-config.md#contact-role-object) below. |

### Contact role object

| Property | Type | Description |
| --- | --- | --- |
| Name | string | Display name for the contact role |

### Sample

```
"CustomerSettings": {
  "ContactRoleTypes": [
    { "Name": "Purchaser" },
    { "Name": "AccountsPayable" },
    { "Name": "TechnicalContact" },
    { "Name": "PrimaryContact" }
  ]
}
```

* * *

## Contact person tag (B2B)

This setting controls which private customers are eligible to be linked as contact persons on a business customer.

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| ContactPersonTag | string | null | When set, only private customers with this tag on their profile can be added as contact persons to a business customer. When empty or not configured, any private customer can be added. |

When `ContactPersonTag` is configured and a user attempts to add a private customer that does not have the required tag, the operation is rejected with an error.

### Sample

```
"CustomerSettings": {
  "ContactPersonTag": "contact-person"
}
```

* * *

## Customer categorization

These settings control how customers are categorized and displayed.

### Tags

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| TagSettings | array | \[\] | Available tags for categorizing customers. See [Tag object](customer-config.md#tag-object) below. |

#### Tag object

| Property | Type | Description |
| --- | --- | --- |
| Name | string | Tag identifier used in the system |
| TranslationKey | string | Translation key for displaying the tag in the UI |

### Default properties

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| DefaultProperties | array | \[\] | Custom properties automatically added to new customer records. See [Default property object](customer-config.md#default-property-object) below. |

#### Default property object

| Property | Type | Description |
| --- | --- | --- |
| Key | string | Property name/identifier |
| Value | string | Default value for the property |
| ValueType | string | Data type (String, Number, Boolean, Date) |
| KeyGroup | string | Optional grouping for organizing properties |
| ValueOptions | string\[\] | Predefined options for dropdown selection |
| IsCustomValueOptionAllowed | bool | Allow custom values outside the predefined options |
| IsMultiSelectEnabled | bool | Allow selecting multiple values |
| ReadOnly | bool | Make the property read-only after creation |

### Highlighted external IDs

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| HighlightedExternalIds | string\[\] | \[\] | External ID types to display prominently on customer records |

### Customer facets

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| CustomerFacets | array | \[\] | Filterable facets for customer search. See [Facet object](customer-config.md#facet-object) below. |

#### Facet object

| Property | Type | Description |
| --- | --- | --- |
| Name | string | Facet name/identifier |
| Type | string | Facet type (determines how values are aggregated) |
| IsCustomProperty | bool | When true, fetches facet values from the properties list even if a matching field name exists |

### Sample

```
"CustomerSettings": {
  "TagSettings": [
    { "Name": "VIP", "TranslationKey": "CustomerTag_VIP" },
    { "Name": "Wholesale", "TranslationKey": "CustomerTag_Wholesale" },
    { "Name": "NewCustomer", "TranslationKey": "CustomerTag_New" }
  ],
  "DefaultProperties": [
    {
      "Key": "CustomerSegment",
      "Value": "",
      "ValueType": "String",
      "ValueOptions": ["Retail", "Wholesale", "Enterprise"],
      "IsCustomValueOptionAllowed": false,
      "IsMultiSelectEnabled": false,
      "ReadOnly": false
    },
    {
      "Key": "PreferredContactMethod",
      "Value": "Email",
      "ValueType": "String",
      "ValueOptions": ["Email", "Phone", "SMS"],
      "IsCustomValueOptionAllowed": false
    }
  ],
  "HighlightedExternalIds": [
    "ERPCustomerId",
    "LoyaltyProgramId"
  ],
  "CustomerFacets": [
    { "Name": "CustomerSegment", "Type": "keyword", "IsCustomProperty": true },
    { "Name": "CountryCode", "Type": "keyword", "IsCustomProperty": false }
  ]
}
```

* * *

## Loyalty integration

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| UseExternalBonusPointsProvider | bool | false | When enabled, bonus points are managed by an external loyalty system instead of Omnium's built-in customer club. Use this when integrating with third-party loyalty platforms. |

When using an external bonus points provider, ensure the appropriate connector is configured to synchronize points data between systems.

### Sample

```
"CustomerSettings": {
  "UseExternalBonusPointsProvider": true
}
```

* * *

## PunchOut settings (B2B)

PunchOut settings configure B2B procurement integrations using OCI (Open Catalog Interface) or cXML protocols. These settings enable e-procurement systems to "punch out" to Omnium for catalog browsing and cart creation.

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| PunchOutSettings | object | null | Configuration for B2B PunchOut/OCI integration. See [PunchOut settings object](customer-config.md#punchout-settings-object) below. |

### PunchOut settings object

| Property | Type | Description |
| --- | --- | --- |
| UnitConversionLists | array | Named lists for converting between ISO unit codes and OCI unit codes. See [Unit conversion list object](customer-config.md#unit-conversion-list-object) below. |

### Unit conversion list object

| Property | Type | Description |
| --- | --- | --- |
| UnitConversionListName | string | Display name for the conversion list |
| UnitConversionListId | string | Unique identifier for the conversion list (assigned to specific B2B customers) |
| UnitConversions | array | List of unit code mappings. See [Unit conversion object](customer-config.md#unit-conversion-object) below. |

### Unit conversion object

| Property | Type | Description |
| --- | --- | --- |
| IsoCode | string | Standard ISO unit code (e.g., "PCE", "KGM", "MTR") |
| OciCode | string | OCI/cXML unit code used by the procurement system (e.g., "EA", "KG", "M") |

Different procurement systems may use different unit codes. Create separate conversion lists for each customer or procurement system with specific mapping requirements.

### Sample

```
"CustomerSettings": {
  "PunchOutSettings": {
    "UnitConversionLists": [
      {
        "UnitConversionListName": "SAP Standard",
        "UnitConversionListId": "sap-standard",
        "UnitConversions": [
          { "IsoCode": "PCE", "OciCode": "EA" },
          { "IsoCode": "KGM", "OciCode": "KG" },
          { "IsoCode": "MTR", "OciCode": "M" },
          { "IsoCode": "LTR", "OciCode": "L" }
        ]
      },
      {
        "UnitConversionListName": "Oracle Procurement",
        "UnitConversionListId": "oracle-procurement",
        "UnitConversions": [
          { "IsoCode": "PCE", "OciCode": "Each" },
          { "IsoCode": "KGM", "OciCode": "Kilogram" },
          { "IsoCode": "MTR", "OciCode": "Meter" }
        ]
      }
    ]
  }
}
```

* * *

## Complete configuration example

Below is a comprehensive example showing all customer settings configured together:

```json
{
  "CustomerSettings": {
    "RequireUniqueCustomerEmails": true,
    "RequireUniqueCustomerPhoneNumbers": false,
    "CustomerIdField": null,

    "IsB2CGetOrCreateDisabled": false,
    "IsB2BGetOrCreateDisabled": false,
    "IsB2CGetOrCreateFromOrderDisabled": false,
    "IsB2BGetOrCreateFromOrderDisabled": false,

    "RequiredAddressProperties": [
      "Line1",
      "City",
      "PostalCode",
      "CountryCode"
    ],
    "IsStreetNumberSeparated": false,
    "UpdateCustomerOnEditShipmentAddress": true,

    "RequireStoreIdsForAccess": false,

    "TrackVersions": true,
    "UseStatsCustomerQueues": true,
    "ExportPrivateCustomers": false,

    "ConsentTypes": [
      {
        "Type": "EmailMarketing",
        "Content": "Consent_EmailMarketing",
        "IsRequired": false,
        "IsFeatured": true
      },
      {
        "Type": "SmsMarketing",
        "Content": "Consent_SmsMarketing",
        "IsRequired": false,
        "IsFeatured": true
      }
    ],
    "BusinessConsentTypes": [
      {
        "Type": "B2BNewsletter",
        "Content": "Consent_B2BNewsletter",
        "IsRequired": false,
        "IsFeatured": true
      }
    ],
    "FilterOnGlobalConsents": false,
    "CopyConsentsToCustomerClubMember": true,

    "PrivateCustomerPhoneFormatSettings": {
      "RequireCountryCode": true,
      "RemoveCountryCode": false,
      "UsePlusInCountryCode": true,
      "UseZeroZeroInCountryCode": false,
      "DefaultCountryCode": "47",
      "ExpectedPhoneNumberFormats": [
        {
          "CountryCode": "47",
          "MinExpectedNumberLength": 8,
          "MaxExpectedNumberLength": 8
        }
      ]
    },
    "BusinessCustomerPhoneFormatSettings": {
      "RequireCountryCode": true,
      "UsePlusInCountryCode": true,
      "DefaultCountryCode": "47",
      "ExpectedPhoneNumberFormats": [
        {
          "CountryCode": "47",
          "MinExpectedNumberLength": 8,
          "MaxExpectedNumberLength": 8
        }
      ]
    },

    "RelationTypes": [
      {
        "Name": "InvoiceCustomer",
        "IsInvoiceReceiver": true,
        "IsGoodsReceiver": false
      },
      {
        "Name": "DeliveryCustomer",
        "IsInvoiceReceiver": false,
        "IsGoodsReceiver": true
      }
    ],

    "ContactRoleTypes": [
      { "Name": "Purchaser" },
      { "Name": "AccountsPayable" },
      { "Name": "TechnicalContact" }
    ],

    "ContactPersonTag": "contact-person",

    "TagSettings": [
      { "Name": "VIP", "TranslationKey": "CustomerTag_VIP" },
      { "Name": "Wholesale", "TranslationKey": "CustomerTag_Wholesale" }
    ],

    "DefaultProperties": [
      {
        "Key": "CustomerSegment",
        "Value": "",
        "ValueType": "String",
        "ValueOptions": ["Retail", "Wholesale", "Enterprise"],
        "IsCustomValueOptionAllowed": false,
        "IsMultiSelectEnabled": false,
        "ReadOnly": false
      }
    ],

    "HighlightedExternalIds": [
      "ERPCustomerId",
      "LoyaltyProgramId"
    ],

    "CustomerFacets": [
      { "Name": "CustomerSegment", "Type": "keyword", "IsCustomProperty": true }
    ],

    "UseExternalBonusPointsProvider": false,

    "PunchOutSettings": {
      "UnitConversionLists": [
        {
          "UnitConversionListName": "Standard Units",
          "UnitConversionListId": "standard",
          "UnitConversions": [
            { "IsoCode": "PCE", "OciCode": "EA" },
            { "IsoCode": "KGM", "OciCode": "KG" }
          ]
        }
      ]
    }
  }
}
```
