# Customer Management

Source: https://docs.omnium.no/docs/Customer/customer-management

> How to work with B2C and B2B customers in Omnium — data model, API patterns, search, privacy, and integration.

## Overview

Omnium manages two distinct customer types: **private customers** (B2C) for individual consumers, and **business customers** (B2B) for companies and organizations. Both types share a common foundation — addresses, external IDs, consents, tags, custom properties — but differ in the features built on top.

|  | Private Customer (B2C) | Business Customer (B2B) |
| --- | --- | --- |
| **Identity** | First name + last name | Company name |
| **Contacts** | Single person | Multiple contact persons (up to 1,000) |
| **Financial** | Bonus points (loyalty) | Credit management (balance, limit, per market) |
| **Product access** | Shared catalog | Restricted assortment per customer |
| **Discounts** | Coupons, customer club promotions | Price groups, discount groups |
| **Procurement** | N/A | PunchOut / OCI / cXML support |
| **Privacy** | GDPR anonymization | Standard deletion |
| **Loyalty** | Customer club membership, tiers, points | N/A |

* * *

## Customer Data Model

### Common Fields

Every customer — B2C and B2B — has the following:

| Field | Description |
| --- | --- |
| `customerId` | Unique identifier (GUID by default, or email/phone if configured) |
| `customerNumber` | Human-readable number (auto-generated or imported) |
| `email`, `phone` | Primary contact details |
| `address` | Primary address |
| `addresses` | Additional addresses (up to 200), each with a purpose (shipping, billing, invoice) |
| `storeIds` | Stores this customer belongs to |
| `marketId` | Market this customer belongs to |
| `preferredLanguage`, `preferredCurrency` | Communication and pricing preferences |
| `customerGroups` | Groups for segmentation and targeting |
| `externalIds` | Mappings to external systems (ERP, e-commerce, CRM) |
| `consents` | Active consent records (marketing, newsletter, etc.) |
| `tags` | Searchable labels for categorization |
| `properties` | Custom key-value pairs for extending the data model |
| `isInactive` | Soft-delete flag |
| `isGlobal` | Whether the customer is visible across all stores |

For the full model definition, see the Swagger documentation: [Private Customer model](https://api.omnium.no/documentation/index.html#/model-OmniumPrivateCustomer) and [Business Customer model](https://api.omnium.no/documentation/index.html#/model-OmniumBusinessCustomer).

### Private Customer (B2C) Fields

In addition to the common fields:

| Field | Description |
| --- | --- |
| `firstName`, `lastName` | Personal name |
| `gender` | Optional gender |
| `birthDate` | Date of birth (used for birthday promotions) |
| `bonusPoints` | Current loyalty point balance |
| `isCustomerClubMember` | Whether the customer has an active club membership |
| `discountCoupons` | Assigned discount coupons |

### Business Customer (B2B) Fields

In addition to the common fields:

| Field | Description |
| --- | --- |
| `name` | Company name |
| `taxId` | VAT or registration number |
| `contacts` | List of contact persons (up to 1,000), each with name, email, phone, roles, and address |
| `businessCustomerCredit` | Credit management per market (balance, limit, remaining, denied status) |
| `discountGroups` | Assigned discount groups |
| `priceGroups` | Assigned price groups |
| `isAssortmentRestricted` | Whether the customer sees a restricted product catalog |
| `assortmentCodes` | Codes defining which product categories are visible |
| `punchOutDomain` | e-Procurement domain for OCI/cXML integration |

* * *

## API Endpoints

Omnium provides two sets of customer endpoints, one per customer type. Use the type-specific endpoints for all customer operations — there is no generic CRUD endpoint that works across both types.

### Private Customers (B2C)

**Base URL:** `/api/privatecustomers`

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/api/privatecustomers/{customerId}` | Get a private customer by ID |
| POST | `/api/privatecustomers` | Add a customer |
| POST | `/api/privatecustomers/Update` | Full update |
| PATCH | `/api/privatecustomers/PatchPrivateCustomer` | Partial update (only supplied fields change) |
| POST | `/api/privatecustomers/AddMany` | Bulk add (max 100) |
| PUT | `/api/privatecustomers/AddOrUpdateMany` | Bulk add or update (max 100) |
| POST | `/api/privatecustomers/Search` | Search private customers |
| POST | `/api/privatecustomers/Scroll` | Scroll through large result sets |
| GET | `/api/privatecustomers/Scroll/{id}` | Continue scrolling |
| GET | `/api/privatecustomers/{id}/CustomerClubMember` | Get customer club membership |
| DELETE | `/api/privatecustomers/Anonymize?id=...` | Anonymize (GDPR) |
| DELETE | `/api/privatecustomers/{id}` | Delete |

### Business Customers (B2B)

**Base URL:** `/api/businesscustomers`

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/api/businesscustomers/{id}` | Get a business customer by ID |
| POST | `/api/businesscustomers` | Add a customer |
| POST | `/api/businesscustomers/Update` | Full update |
| PATCH | `/api/businesscustomers/PatchBusinessCustomer` | Partial update (only supplied fields change) |
| PUT | `/api/businesscustomers/AddOrUpdateMany` | Bulk add or update (max 100) |
| POST | `/api/businesscustomers/Search` | Search business customers |
| POST | `/api/businesscustomers/Scroll` | Scroll through large result sets |
| GET | `/api/businesscustomers/Scroll/{id}` | Continue scrolling |
| PUT | `/api/BusinessCustomer/{businessCustomerId}/ContactPerson/AddContactPerson` | Add or update a contact person |
| DELETE | `/api/BusinessCustomer/{businessCustomerId}/ContactPerson/DeleteContactPerson` | Remove a contact person |
| GET | `/api/BusinessCustomer/{businessCustomerId}/ContactPerson/GetContactPersons` | List contact persons |
| GET | `/api/businesscustomers/GetBusinessCustomerByContactEmail?email=...` | Find company by contact email |
| GET | `/api/businesscustomers/GetBusinessCustomerByContactPhone?phoneNumber=...` | Find company by contact phone |
| GET | `/api/businesscustomers/{id}/SalesLimitations` | Get purchase restrictions |
| DELETE | `/api/businesscustomers/{id}` | Delete |

For complete endpoint details, see the [Swagger documentation](https://api.omnium.no/documentation/customers).

* * *

## Creating Customers

### From the API

Create a private customer:

```
POST /api/privatecustomers
{
  "firstName": "Sarah",
  "lastName": "Johnson",
  "email": "sarah@example.com",
  "phone": "+12125551234",
  "birthDate": "1985-03-20",
  "address": {
    "line1": "123 Main Street",
    "city": "New York",
    "postalCode": "10001",
    "countryCode": "US",
    "purposes": ["Shipping", "Billing"]
  },
  "storeIds": ["store-nyc"],
  "marketId": "market-us",
  "preferredLanguage": "en",
  "preferredCurrency": "USD",
  "tags": ["newsletter"],
  "consents": [
    {
      "type": "EmailMarketing",
      "date": "2026-02-14T10:00:00Z",
      "status": true,
      "source": "Web"
    }
  ]
}
```

Create a business customer with a contact person:

```
POST /api/businesscustomers
{
  "name": "Acme Industries LLC",
  "taxId": "US-87-1234567",
  "email": "info@acme-industries.com",
  "phone": "+13125559876",
  "address": {
    "line1": "456 Commerce Drive",
    "city": "Chicago",
    "postalCode": "60601",
    "countryCode": "US",
    "purposes": ["Billing"]
  },
  "contacts": [
    {
      "firstName": "Mike",
      "lastName": "Davis",
      "email": "mike@acme-industries.com",
      "phone": "+13125554321",
      "roles": ["Purchaser"],
      "isPrimaryContact": true,
      "notify": true
    }
  ],
  "storeIds": ["store-chicago"],
  "marketId": "market-us",
  "discountGroups": ["wholesale"]
}
```

### Automatically from Orders

When an order arrives from your e-commerce platform, the **Get or Create Customer** workflow step can automatically create or update the customer record based on the order data. This behavior is configurable — see [Customer creation control](customer-config.md#customer-creation-control) for the settings.

* * *

## Searching Customers

The Search endpoint supports filtering, sorting, and pagination:

```
POST /api/privatecustomers/Search
{
  "query": "sarah",
  "marketIds": ["market-us"],
  "tags": ["newsletter"],
  "isInactive": false,
  "sortOrder": "ModifiedDescending",
  "take": 25,
  "page": 0
}
```

### Available Filters

| Filter | Description |
| --- | --- |
| `query` | Free-text search across name, email, phone, and address fields |
| `email`, `phone`, `taxId` | Exact match on contact fields |
| `customerId`, `customerIds`, `customerNumbers` | Look up specific customers |
| `storeIds`, `marketIds` | Filter by store or market |
| `customerGroups` | Filter by group membership |
| `tags`, `excludedTags` | Filter by tags |
| `externalIds` | Filter by external system IDs |
| `consentTypes` | Find customers with specific consents |
| `isInactive`, `isGlobal`, `isCustomerClubMember` | Status filters |
| `createdFrom`, `createdTo`, `modifiedFrom`, `modifiedTo` | Date range filters |
| `postalCodeFrom`, `postalCodeTo` | Postal code range |
| `properties` | Filter by custom property values |

### Scrolling for Large Datasets

For bulk exports or migrations, use the Scroll endpoint instead of paginated Search. Scroll handles large volumes efficiently by maintaining a cursor:

```
POST /api/privatecustomers/Scroll
{
  "marketIds": ["market-nor"],
  "take": 1000
}
```

The response includes a `scrollId`. Use it to retrieve the next batch:

```
GET /api/privatecustomers/Scroll/{scrollId}
```

Continue until no more results are returned. See the [scrolling guide](../Integrations/scrolling.md) for details.

### Delta Queries

To retrieve only customers that changed since your last sync:

```
GET /api/privatecustomers/GetAll?changedSince=2026-02-13T00:00:00Z&page=0&pageSize=100
```

See the [delta queries guide](../Integrations/delta.md) for best practices.

* * *

## Updating Customers

### Full Update

Replaces the entire customer record. You must send all fields — omitted fields are reset to their defaults.

```
POST /api/privatecustomers/Update
{
  "customerId": "cust-12345",
  "firstName": "Sarah",
  "lastName": "Johnson",
  "email": "sarah.new@example.com",
  ...
}
```

### Partial Update (PATCH)

Only the fields you include are changed. Other fields are left untouched.

```
PATCH /api/privatecustomers/PatchPrivateCustomer
{
  "customerId": "cust-12345",
  "email": "sarah.new@example.com",
  "tags": ["newsletter", "vip"]
}
```

Use PATCH for most updates. It's safer — you won't accidentally clear fields you didn't intend to change. See the [PATCH patterns section](../GettingStartedWithAPI/api-developer-guide.md#updating-resources-patch) in the API Developer Guide for details on how properties and lists are merged.

### Bulk Operations

Add or update up to 100 customers in a single request:

```
PUT /api/privatecustomers/AddOrUpdateMany
[
  { "customerId": "cust-001", "firstName": "Sarah", ... },
  { "customerId": "cust-002", "firstName": "James", ... }
]
```

Customers that already exist (matched by ID) are updated; new customers are created.

* * *

## Customer Groups

Customer groups let you organize customers for targeted promotions, pricing, or reporting.

```
PUT /api/CustomerGroups/Add
{
  "id": "wholesale-partners",
  "name": "wholesale-partners",
  "displayName": "Wholesale Partners",
  "properties": [
    { "key": "discountTier", "value": "gold" }
  ]
}
```

Assign a customer to a group by including the group reference in the customer's `customerGroups` list:

```
PATCH /api/businesscustomers/PatchBusinessCustomer
{
  "customerId": "cust-67890",
  "customerGroups": [
    { "id": "wholesale-partners", "name": "Wholesale Partners" }
  ]
}
```

* * *

## External IDs and Integration

Customers can be linked to multiple external systems using the `externalIds` field. Each entry has a `source` (system name) and `value` (ID in that system):

```
"externalIds": [
  { "source": "Shopify", "value": "gid://shopify/Customer/12345" },
  { "source": "D365", "value": "CUST-00042" },
  { "source": "VoyadoContactId", "value": "abc-def-123" }
]
```

External IDs are used for:

*   **Import matching** — When importing customers, Omnium uses external IDs to find existing records and avoid duplicates
*   **Cross-system lookups** — Search for a customer by their ID in another system
*   **Export enrichment** — Workflow steps can copy external IDs from the customer to the order for downstream integrations

You can highlight specific external ID types in the admin UI — see the [configuration guide](customer-config.md#highlighted-external-ids) for details.

* * *

## Addresses

Customers can have a primary `address` and a list of additional `addresses`. Each address has a purpose (or multiple purposes) that indicates how it's used:

| Purpose | Description |
| --- | --- |
| Shipping | Where goods are delivered |
| Billing | Where invoices are sent |
| Invoice | Formal invoice address |
| Home | Residential address |

An address includes: `line1`, `line2`, `city`, `postalCode`, `countryCode`, `countryName`, `state`, `phone`, `email`, `name` (label), and optional `externalId` for integration mapping.

* * *

## B2B Contact Persons

Business customers can have multiple contact persons, each with their own role, contact details, and address. This models real-world organizations where different people handle purchasing, finance, and receiving.

### Adding a Contact Person

Adding a contact person is an upsert: if a contact with the same `id`, `email`, or `phone` already exists, it is replaced; otherwise a new contact is added.

```
PUT /api/BusinessCustomer/{businessCustomerId}/ContactPerson/AddContactPerson
{
  "firstName": "Emily",
  "lastName": "Clark",
  "email": "emily@acme-industries.com",
  "phone": "+13125558765",
  "roles": ["AccountsPayable"],
  "isPrimaryContact": false,
  "notify": true
}
```

### Looking Up Companies by Contact

Find the business customer associated with a specific person:

```
GET /api/businesscustomers/GetBusinessCustomerByContactEmail?email=emily@acme-industries.com
```

* * *

## B2B Credit Management

Business customers can have credit limits tracked per market:

```
"businessCustomerCredit": [
  {
    "marketId": "market-nor",
    "creditBalance": 50000,
    "creditLimit": 100000,
    "creditRemaining": 50000,
    "creditCurrency": "NOK",
    "isCreditDenied": false
  },
  {
    "marketId": "market-swe",
    "creditBalance": 20000,
    "creditLimit": 75000,
    "creditRemaining": 55000,
    "creditCurrency": "SEK",
    "isCreditDenied": false
  }
]
```

When `isCreditDenied` is `true`, the customer is blocked from placing orders on credit in that market.

* * *

## B2B Assortment Restrictions

Business customers can have restricted product catalogs, so they only see the products relevant to their contract:

*   Set `isAssortmentRestricted` to `true`
*   Assign `assortmentCodes` that map to product categories

For detailed configuration, see [Customer categories and assortment](../Product/product-assortment/customer-categories.md).

* * *

## Customer Relations (B2B)

Business customers can be linked to each other using relations. Common patterns:

*   **Invoice receiver** — Company A orders, Company B receives the invoice
*   **Goods receiver** — Company A orders, Company C receives the delivery

Relations are configured in the [customer configuration](customer-config.md#customer-relations-b2b) and assigned on the customer record via the `customerRelations` field.

* * *

## Customer Merge and Deduplication

Merge duplicate records using the privacy endpoint. The merge is directional: `fromCustomerId` is deleted, `toCustomerId` survives.

```
GET /api/customerprivacy/ChangePrivateCustomerId?fromCustomerId=old-id&toCustomerId=keep-id
```

**Related data moves to the target** — orders, carts, vouchers, club membership, projects, and B2B contact links are reassigned from source to target.

**The profiles are then combined:**

| Field | Behavior |
| --- | --- |
| Name, email, phone, address | Target wins; source fills blanks only |
| External IDs, consents, coupons, tags, properties | Merged (union); target wins on key conflict |
| Bonus points | Summed |
| Customer club member | True if either is |

The source is then deleted. Related data and unioned collections survive either way; only the base profile fields depend on direction, so use the most complete record as `toCustomerId`.

**Voyado: turn off Sync Delete before merging.** With the Voyado connector's **Sync Delete** setting on, deleting the source customer also deletes its contact in Voyado. If the duplicates share the same `VoyadoContactId`, that deletes the contact the surviving customer still references. The source's external IDs are copied to the target before deletion, so with Sync Delete off the Voyado link is preserved.

### Batch merges

```
POST /api/customerprivacy/ChangePrivateCustomerIdBatch
[
  { "fromCustomerId": "duplicate-1", "toCustomerId": "keep-1" },
  { "fromCustomerId": "duplicate-2", "toCustomerId": "keep-2" }
]
```

Business customers merge the same way via `ChangeBusinessCustomerId`.

* * *

## Privacy and Anonymization (GDPR)

When a customer exercises their right to be forgotten, anonymize their data:

```
DELETE /api/privatecustomers/Anonymize?id={customerId}
```

This:

*   Removes all personal data (name, email, phone, addresses)
*   Marks the customer as anonymized
*   Preserves order records for business continuity (without personal data)
*   Is irreversible

Anonymization is available for private customers. For business customers, use standard deletion via `DELETE /api/businesscustomers/{id}`.

* * *

## Consents

Omnium tracks customer consents for GDPR compliance and marketing preferences. Each consent records what was agreed to, when, and through which channel:

```
"consents": [
  {
    "type": "EmailMarketing",
    "date": "2026-02-14T10:00:00Z",
    "content": "I agree to receive marketing emails",
    "source": "Web",
    "status": true,
    "marketIds": ["market-nor"]
  }
]
```

Consent types are configured per tenant — see the [consent management section](customer-config.md#consent-management) in the configuration guide. Changes to consents are tracked in `consentHistory` for audit purposes.

When consent types are configured, a **Consents** filter appears in the advanced search area of both the private and business customer lists. This filter shows customers who have an active consent (`status: true`) for the selected type(s). The same filtering is available via the API using the `consentTypes` parameter on the search endpoint.

* * *

## Customer Club (Loyalty)

Omnium includes a built-in loyalty program with bonus points, tiers, and automated notifications. For setup and API usage, see the dedicated [Customer Club guide](customer-club.md).

Key concepts:

*   **Points** are earned on purchases and can be used as payment via the BonusPoints payment provider
*   **Tiers** segment members by spending level (e.g., Bronze, Silver, Gold)
*   **Birthday and sign-up points** reward engagement milestones
*   **Points expire** after a configurable number of days
*   **Workflow steps** handle point calculation, earning, and cancellation throughout the order lifecycle

* * *

## Integration with Orders

Customers and orders are connected through the order's `customerId` field. When an order is processed, workflow steps can:

1.  **Create or find the customer** — The "Get or Create Customer" step matches the order's email/phone to an existing customer or creates a new one
2.  **Enrich the order** — Copy customer properties, external IDs, or payment terms onto the order for downstream processing
3.  **Update the customer** — Sync address changes from the order back to the customer record (if configured)
4.  **Calculate loyalty points** — Award bonus points based on the order total

* * *

## Related Documentation

| Topic | Link |
| --- | --- |
| Full API model reference | [Swagger — Customers](https://api.omnium.no/documentation/customers) |
| Configuration settings | [Customer Configuration](customer-config.md) |
| Customer club / loyalty | [Customer Club](customer-club.md) |
| Product assortment for B2B | [Customer Categories](../Product/product-assortment/customer-categories.md) |
| Searching and scrolling | [Scrolling Guide](../Integrations/scrolling.md) |
| Delta / change tracking | [Delta Queries](../Integrations/delta.md) |
| CRM integration (Voyado) | [Voyado Connector](../plugins/CRM/voyado.md) |
