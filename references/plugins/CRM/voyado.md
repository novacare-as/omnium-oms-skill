# Voyado

Source: https://docs.omnium.no/docs/plugins/CRM/voyado

> Omnium provides a standardized integration with Voyado Engage. This integration provides the opportunity to outsource customer club and CRM functionality to Voyado.

## The Voyado integration supports the following

*   Synchronization of customers
    *   One-way sync (Omnium as Master)
    *   Two-way sync
*   Export of receipts
    *   Order receipts
    *   Return receipts
    *   Receipt enrichment (from product data)
*   Loyalty and CRM over webhooks
    *   Bonus point balance
    *   Reward vouchers (import and redeem-at-capture)
    *   Personal offers / promotions
*   Promotions/Personal offers

* * *

## Customers

### Mapping Options

#### Contact types

The Omnium-Voyado integration provides several options for customizing the sync of customers to Voyado. In Voyado Engage there is the concept of contact-types, which separates between Contacts and Members. This is somewhat analogous to the separation between customers and customer club members in Omnium. In the default setup, this separation is mirrored between Omnium and Voyado, mapping PrivateCustomers to Voyado-Contacts and CustomerClubMembers to Voyado Members. However, depending on the use case, different customers might require different behaviors. The Omnium-Voyado integration supports several options for this flow.

|  | Default | ExportMembersOnly | ExportAllCustomersAsMember |
| --- | --- | --- | --- |
| _PrivateCustomer_ | Contact | \- | Member |
| _CustomerClubMember_ | Member | Member | Member |

#### Other options

|  | Description | Use case |
| --- | --- | --- |
| IgnoreConsents | This setting instructs Omnium to ignore consents when syncing customers | Used when Voyado is master of consents and they are pushed directly to Voyado. |
| UniqueIdentifier | Specifies the field that constitutes the unique identifier for a customer | In a case with a 2-way customer sync between Omnium and Voyado and 3rd party systems that create contacts directly in Voyado, Omnium needs to know which field it should use as customer Id in Omnium. This ensures unique customers. Supported options are Email and Phone. |
| SyncDelete | A delete operation in Omnium should also delete the corresponding Voyado contact |  |
| ConsentMapping | It is possible to configure custom mappings between customer consents in Omnium and Contact preferences and Consents in Voyado | When collecting consents from 3rd parties or migrating an existing solution, it is useful to map the collected consents to the corresponding consents configured in Voyado. |

#### Sync of customers from Omnium to Voyado

Sync of customers from Omnium to Voyado is done synchronously every time a customer is updated in Omnium. This is done by setting up the VoyadoExporter to implement IPrivateCustomerExporter, which creates a client exporting contacts to the Voyado Engage API. To relate customers in Omnium and Contacts in Voyado, Omnium stores the Voyado ContactId as an externalId on the private customer object in Omnium. Should the export of a customer fail, an error message will be displayed on the customer card in Omnium, with the option to inspect the error message returned from the Voyado Engage API.

![Image](https://docs.omnium.no/_next/image?url=%2F_next%2Fstatic%2Fmedia%2FvoyadoCustomer.2beaac62.png&w=3840&q=75)

The following table shows the various operations used in syncing data from Omnium to Voyado.

| **Operation** | **Endpoint** | **Condition** | **Use case** | **Notes** |
| --- | --- | --- | --- | --- |
| **GET** | `/api/v2/contacts/{contactId}` | Omnium has an externalId referencing a Contact in Voyado | Used to look up existing contacts in Voyado based on Id |  |
| **GET** | `/api/v2/contacts/{contactType}/bykey/{keyValue}` | Omnium doesn't have an externalId referencing a Contact | Used to look up existing contacts in Voyado based on key (email/phone) |  |
| **POST** | `/api/v2/contacts/{contactId}/promoteToMember` | The member status of a customer changes in Omnium | Changes contact type from Contact to Member in Voyado |  |
| **POST** | `/api/v2/contacts/{contactId}/updateContactType` | The member status of a customer changes in Omnium | Changes contact type from Member to Contact in Voyado |  |
| **POST** | `/api/v2/contacts` | Existing customer in Voyado not found upon update | Creates new contact in Voyado |  |
| **POST** | `/api/v2/contacts/{contactId}` | Existing customer in Voyado found upon update | Updates existing contact in Voyado |  |
| **DELETE** | `/api/v2/contacts/{contactId}` | Customer deleted in Omnium | Deletes existing contact in Voyado | Only triggered if Voyado connector is configured for delete propagation |

#### Sync of customers from Voyado to Omnium

Sync of customers from Voyado to Omnium is performed asynchronously by polling the endpoint /api/v2/contacts/changes in the Voyado Engage API at regular intervals. This process is configured through the scheduled task VoyadoContactSync, where you can specify the frequency of the polls. The minimum allowed interval is once every minute.

* * *

### Property Mapping

You can map additional Voyado contact attributes to Omnium customer properties using the **Property mapping** table in the Voyado connector settings. Each row maps one Voyado field to one Omnium property, and the mapping is used in both directions:

*   **Voyado to Omnium**: the contact sync reads the Voyado field and sets the Omnium property.
*   **Omnium to Voyado**: the customer export sends the Omnium property in the Voyado field. Empty values are not sent, so Voyado keeps its own value.

| Column | Meaning |
| --- | --- |
| **Omnium property** (left) | The property on the Omnium customer. If the name matches a built-in field on the customer, that field is set directly; otherwise the value is stored as a custom property. |
| **Voyado field** (right) | The contact attribute to read the value from. Field names are matched case-insensitively. |

If a mapped field is **missing** from the Voyado contact, the corresponding Omnium property is left untouched. An **explicit `null`** value from Voyado is honored and clears the property in Omnium.

Omnium stores every mapped value as text. Values that are not text in Voyado are converted:

| Voyado value | Value in Omnium |
| --- | --- |
| Boolean, for example an interest field | `true` or `false` |
| Number | The number, with `.` as the decimal separator |
| Date and time | ISO 8601, for example `2026-10-20T11:09:29.0000000Z` |
| Store reference, for example `currentStore` | The `externalId` of the store, which is the Omnium store id |
| List, or an object without `externalId` | Not mapped. The Omnium property is left untouched. |

For example, the mapping `PrimaryStore` → `currentStore` stores the id of the customer's current store, such as `S032`, on the `PrimaryStore` property.

#### Member level mapping

Voyado exposes the customer's loyalty member level as a `memberlevel` object on the contact. To sync it into Omnium, add a property mapping that points to the desired field on that object using dot notation. For example, to store the level name on a `memberLevel` property in Omnium:

| Omnium property | Voyado field |
| --- | --- |
| `memberLevel` | `memberlevel.levelName` |

Any field on the `memberlevel` object can be mapped this way (for example `memberlevel.levelId` or `memberlevel.expires`); refer to the Voyado documentation for the available fields. Once mapped, the property is available on the customer in Omnium and can be highlighted on the customer card.

* * *

### Customer Group Mapping

When syncing customers **from Voyado to Omnium**, you can populate the customer's **customer groups** from a Voyado contact attribute.

To set it up, enter the **name of the Voyado attribute** in the **Customer group field** (`CustomerGroupField`) setting in the Voyado connector settings — for example `membershipTier`.

On each contact sync, Omnium reads that attribute on the contact and adds the customer to a customer group for each value it holds. For example, a contact with `membertype = ["employee", "member"]` is added to both the `employee` and `member` groups, while a contact with a single value is added to just that one group.

The value becomes both the **id** and **name** of the group, and any group that does not yet exist in Omnium is **created automatically during the contact sync**. Attribute names are matched case-insensitively.

Once populated, customer groups can be used to target promotions — a promotion that lists one or more customer groups applies only to customers belonging to at least one of them. This makes it possible to drive group-based campaigns (for example membership tiers such as Bronze/Silver/Gold) when the tier is delivered as a customer group attribute.

* * *

### Consent and Preference Mapping

Omnium stores all marketing opt-ins as a single list of **consents** on the customer. Voyado splits them across two structures on a contact:

*   **`preferences`** – the three standard booleans `AcceptsEmail`, `AcceptsSms`, and `AcceptsPostal`.
*   **`consents`** – custom, named consents defined per Voyado tenant (for example `acceptsTracking`).

The connector has one mapping table for each:

*   **Preferences mapping** – maps an Omnium consent type to one of the three standard Voyado preferences.
*   **Consents mapping** – maps an Omnium consent type to a custom Voyado consent, by its id.

In both tables the left column is the Omnium consent `type` and the right column is the Voyado field.

Both mappings are optional. Without them, opt-ins still sync: Voyado preferences are stored under their standard names (`AcceptsEmail`, `AcceptsSms`, `AcceptsPostal`) and named consents under their Voyado id. Configure a mapping when you want the Omnium consent to use a **different name** — for example to align with consents your storefront already writes.

When the connector has a connector prefix (see [Multiple Voyado Instances](voyado.md#multiple-voyado-instances)), opt-ins synced from Voyado are stored on the Omnium customer with the prefix in front of the name, for example `INO_acceptsTracking` for prefix `INO`. This applies to both preferences and consents, with or without a mapping, and keeps opt-ins from several Voyado instances apart on the same customer. The prefix never reaches Voyado: when syncing to Voyado, the connector reads the prefixed consents and sends them under the Voyado name. Consents on the customer without this connector's prefix are not sent to that Voyado instance, so a storefront or other integration that writes opt-ins for a prefixed connector must write the prefixed `type`.

When Voyado data syncs into Omnium, each incoming opt-in updates the existing consent with the same `type`, or is added as a new one if none matches. The match is exact, including casing, so `acceptsEmail` and `AcceptsEmail` count as two separate consents. Map opt-ins explicitly to keep the names aligned and avoid a duplicate entry under each name.

* * *

### Get or Create Customers from Voyado

Omnium supports integrating the Voyado connector with the workflow step
`GetOrCreateCustomerFromOrder`. This is enabled by configuring **VoyadoExporter** as the connector for the workflow step.

When the Voyado connector is attached, the behavior of the workflow step is modified as described below.

#### Customer resolution logic

When `customerId` is provided

1.  **Look up customer in Omnium**
    Omnium attempts to find an existing customer whose `externalId` matches the provided `customerId` (i.e. customers that have already been synchronized from Voyado).

2.  **Fallback 1: Look up contact in Voyado based on `contactId`**
    If no matching customer is found in Omnium, Omnium attempts to locate a contact in Voyado with a matching `contactId`.

3.  **Fallback 2: Try to find existing Omnium customer with matching `customerId`**
    If no matching customer has been found and `order.customerId` is set, Omnium tries to find an existing Omnium customer with the corresponding Id.

4.  **Fallback 3: Look up contact in Voyado based on phone/email** If no matching customer has been found, Omnium attempts to locate a contact in Voyado based on phone/email. If `CustomerClubMemberId` is set on the order Omnium will search for a **Member** in Voyado, if not Omnium will seach for any contact.

5.  **Fallback 4: Try to create Voyado contact** If neither lookup succeeds, Omnium will try to create the contact in Voyado and in Omnium based on the information available on the order.

6.  **Fallback 5: Default Omnium behavior**
    If no matching customer has been found, Omnium falls back to the default behavior of `GetOrCreateCustomerFromOrder` and gets or creates a customer in Omnium based on the provided `customerId`.

When `customerId` is not provided

*   Omnium uses the phone number and email address from the order to search for a matching customer in Voyado.
*   If a match is found, the customer is imported from Voyado into Omnium.

#### Notes

*   In this setup, `customerId` may refer to either:
    *   the **Voyado ContactId**, or
    *   the **Omnium customerId**.

#### GetOrCreateCustomerMode

Set `GetOrCreateCustomerMode` to `MemberLookupOnly` to restrict Voyado lookup to club members only. Omnium first checks for an existing customer in Omnium by `externalId`, then looks up the Voyado contact using `CustomerClubMemberId` from the order. If no match is found at either step, no Voyado contact is resolved — Omnium falls back to getting or creating a customer in Omnium based on the provided `customerId`, without any Voyado involvement.

**Use case:** When only loyalty members should be resolved via Voyado and guest/non-member checkouts should proceed without a Voyado contact.

* * *

## Receipts

Export of both order and return receipts from **Omnium** to **Voyado** can be configured through workflow steps in Omnium.
As receipts in Voyado cannot be altered once created, it is recommended that the export of **order receipts is always set up at the very end** of an order's workflow.

See [Excluding Products from Receipts and Bonus Calculations](voyado.md#excluding-products-from-receipts-and-bonus-calculations) for how order lines are left out of a receipt and how a receipt with no items is handled.

* * *

### Receipt Enrichment

Transaction objects (receipts) exported to Voyado are lightweight and contain limited product information. To provide more context, receipts can be enriched with product data from Omnium.

This is done via an **XML export** that includes all products in Omnium and sends them to Voyado. The export frequency is managed by the scheduled task:

*   **Task**: `VoyadoProductDataExport`
*   **Recommended Frequency**: Once daily
*   **Format Specification**: [Voyado Enrichment XML Format](https://developer.voyado.com/resources/Article_enrichment_example.xml)

See section below for details on the xml product feed.

* * *

## Voyado Product Data Export – Field Mappings

### Standard Field Mappings

| Voyado Field | Omnium Source |
| --- | --- |
| `sku` | `skuId`, or `Ean` when `UseEanAsProductIdentifier` is on |
| `number` | `Product.ProductId` |
| `name` | `Variant.Name` |
| `maincategory` | `ProductCategory.Name` |
| `brand` | `Brand` |
| `color` | `Color` |
| `size` | `Size` |
| `group` | `Product.ProductType` |
| `productcategory` | `ProductCategory.Name` |
| `subcategory` | `ProductCategory.Name` |
| `gender` | `Gender` |
| `season` | `Season` |
| `spare1`–`spare10` | Configurable custom properties |

* * *

### Category Mapping Logic

The category hierarchy is resolved using a parent traversal algorithm.

#### 1\. Main Category Determination

*   First checks `Product.MainCategoryId`
*   If empty and the product has variants, checks `Variant.MainCategoryId` for the specific variant
*   Falls back to the first category marked as `IsMainCategory` in `ProductCategories`
*   Final fallback: the first category in the `ProductCategories` list

#### 2\. Hierarchy Traversal

*   Starting from the main category, traverses upward through parent categories using `ParentId`

*   Creates a linked list:

    ```
    Main Category → Parent (Secondary) → Grandparent (Tertiary) → ...
    ```

*   Maximum of 20 iterations to prevent infinite loops

#### 3\. Category Assignment

*   `maincategory` = resolved main category name
*   `productcategory` = parent of the main category (secondary level)
*   `subcategory` = grandparent of the main category (tertiary level)

#### Example Hierarchy

```
Clothing (Tertiary – subcategory)
└── Outerwear (Secondary – productcategory)
    └── Winter Jackets (Main – maincategory)
```

* * *

### Optional Settings

Two optional settings change the traversal direction from child→parent to parent→child, and let you pin the starting point in the hierarchy.

#### Category Tree Root ID

Pin the hierarchy to a specific category. When set, that category becomes `maincategory` and the levels below it fill `productcategory` and `subcategory`.

**Example — root ID set to third level (`Outerwear`):**

```
All Products (global root)
└── Clothing
    └── Outerwear    ← ProductExportCategoryRootId = "cat-outerwear"
        └── Jackets  → maincategory
            └── Winter Jackets → productcategory
```

#### Skip Root (Use Category Hierarchy After Root)

When enabled, the root category (global root, or the one set above) is skipped and mapping starts one level below it.

```
All Products (global root)
└── Clothing         ← skipped (UseCategoryHierarchyAfterRoot = true)
    └── Outerwear    → maincategory
        └── Jackets  → productcategory
            └── Winter Jackets → subcategory
```

The two settings compose: if both are set, the specified category is used as the root and then skipped.

* * *

### Parent Products (Export Parent Products)

By default, a product with variants produces one article per variant and none for the parent. Enable **Export parent products** on the connector (`ExportParentProducts`) to also export the parent as an article. Use this when stores sell the main product, so its receipt lines can be enriched.

The parent row uses the parent's `ProductId` as `sku`, or its `Ean` when `UseEanAsProductIdentifier` is on. `number` is the parent's `ProductId`, as on the variant rows. The row is skipped if a variant already has the same `sku`.

* * *

### Custom Fields (`spare1`–`spare10`)

Custom properties are mapped to `spare1` through `spare10` fields based on connector configuration.

*   **Configuration**: `VoyadoProductDataCustomProperties` connector setting

*   **Format**: Comma-separated list of property names Example:

    ```
    Material,Weight,Collection
    ```

*   **Mapping order**:

    *   1st property → `spare1`
    *   2nd property → `spare2`
    *   …
*   **Retrieval**: the value on the variant is used first, then the value on the parent product. The parent row reads from the parent product.

* * *

### Export Process

1.  Products are processed in batches of **1000**

2.  For products with variants, each variant is exported as a separate article. With **Export parent products** enabled, the parent product is exported as one more article (see [Parent Products](voyado.md#parent-products-export-parent-products))

3.  Products with SKUs (no variants) are exported directly

4.  XML files are generated with a timestamp:

    ```
    OmniumArticleExport_yyyy-MM-dd-HH-mm-ss-fff.xml
    ```

5.  Files are uploaded to:

    ```
    ftp://{host}/articleImport/{filename}
    ```

* * *

### Product Assortment Filtering

When the Voyado connector has market restrictions configured, the product data export will automatically filter products based on their market assignments. This ensures that only products relevant to the connector's configured markets are included in the export.

The filtering uses the following connector settings:

| Setting | Description |
| --- | --- |
| `EnabledForMarkets` | Only include products assigned to these markets |
| `DisabledForMarkets` | Exclude products assigned to these markets |
| `EnabledForMarketGroups` | Only include products assigned to these market groups |
| `DisabledForMarketGroups` | Exclude products assigned to these market groups |

Products without any market assignment (`MarketIds` or `MarketGroupIds` not set) are always included in the export, regardless of market restrictions.

If none of the above settings are configured on the connector, no market filtering is applied and all products are exported.

* * *

### Required Fields

Products are skipped if any of the following fields are missing:

*   `skuId`
*   `ProductId`
*   `name` (variant name)
*   `mainCategoryId` (and its corresponding category)

* * *

## Excluding Products from Receipts and Bonus Calculations

Certain products can be **excluded** from appearing in receipts or from contributing to bonus point calculations in Voyado. This is achieved by adding specific custom properties to those products and ensuring these properties are enriched onto order lines, or by listing SKUs in the connector settings.

### 1\. Exclude from Receipts

To exclude products from receipts entirely:

*   **Custom Property**: `ExcludeFromVoyadoReceipts = true`

When present on an order line, **Omnium will omit that line** from the exported receipt.

### 2\. Exclude from Bonus Point Calculation

To exclude products from bonus point rewards:

*   **Custom Property**: `ExcludeFromVoyadoBonusPoints = true`

When present, **Voyado will ignore the order line** when calculating bonus points.

### 3\. Exclude by SKU List

To exclude a fixed set of SKUs from receipts without changing the products or the order lines:

*   **Connector setting**: `VoyadoExcludedSkuIds`
*   **Value**: a comma-separated list of SKUs, for example `BAG01, PACKAGING, DEPOSIT`

Any order line whose SKU is in the list is omitted from the exported receipt. Matching is case-insensitive. This works for SKUs that do not exist as products in Omnium, since it only looks at the SKU on the order line.

An excluded line's amount is subtracted from the receipt total and the payment amount, so the receipt stays balanced.

* * *

### Receipts With No Items

Voyado rejects a receipt with no items. Omnium handles the two ways this can happen differently:

*   **All order lines are excluded** by the methods above. The receipt is not sent, the order gets an event, and no error is set. This always applies.
*   **No order line is delivered**, for example a POS order with quantity 0. By default the receipt is sent and Voyado rejects it with an error on the order. To skip it instead, enable `SkipReceiptsWithoutDeliveredLines` on the **Export order** workflow step for the `VoyadoExporter` connector. The order then gets an event and no error. Enable this only on workflows where such orders are expected, since an order that lost its delivered quantities by mistake is also skipped silently.

* * *

### Configuration Steps

To implement either exclusion:

1.  **Set the appropriate custom property** (`ExcludeFromVoyadoReceipts` or `ExcludeFromVoyadoBonusPoints`) on the relevant products.
2.  **Ensure these properties are enriched onto order lines** during the order process.

Refer to the **Order Line Enrichment Configuration** section below.

* * *

### Order Line Enrichment Configuration

To ensure custom product properties are copied to order lines:

*   Navigate to:
    **Configuration → Orders → Order line**
*   Under **"Enrich order line from products"**, add the necessary custom properties (`ExcludeFromVoyadoReceipts` and/or `ExcludeFromVoyadoBonusPoints`)

All properties listed here will be copied from products to the corresponding order line items automatically.

* * *

## Multiple Voyado Instances

**Omnium** supports integration with **multiple Voyado instances**, with one Voyado connector per instance. Each connector must always be [scoped](voyado.md#connector-scoping) to its markets. The connector prefix does not limit what a connector syncs. Whether you also need one depends on how customers are modeled:

*   **Separate customer per market** (recommended): scoping is enough. Leave the connector prefix empty.
*   **One customer linked to several Voyado instances**: in addition to scoping, set a connector prefix on each connector. The prefix keeps the `externalId`s, consents and preferences from each instance apart on the same customer. A storefront or other integration must then use the prefixed `externalId` format and read and write consents and preferences with the prefixed `type`.

> ⚠️ **Important:** The prefix should be configured **during setup** and **must not be changed** once the integration is live.

### Connector Scoping

For multi-instance setups, each Voyado connector should be scoped using one of the following configurations in Omnium:

*   `EnabledForMarkets` / `DisabledForMarkets`
*   `EnabledForMarketGroups` / `DisabledForMarketGroups`

This ensures that each connector operates **only within its intended scope** and does not interfere with others.

### External ID Format

When a prefix is defined, `externalId`'s in Omnium will be generated in the following format:

`<ConnectorPrefix>_VoyadoContactId`

This structure ensures that each `externalId` is unique and clearly associated with the correct Voyado instance.

Consents and preferences synced from Voyado use the same prefix on the consent `type`, for example `<ConnectorPrefix>_acceptsTracking` and `<ConnectorPrefix>_AcceptsEmail`. See [Consent and Preference Mapping](voyado.md#consent-and-preference-mapping).

* * *

## Stores

By default, Omnium will use the `StoreId` from an order as the `StoreExternalId` on a receipt when sending it to Voyado.

However, in cases with multiple Voyado integrations or when the store structure differs between Omnium and Voyado, there might not be a 1-to-1 match between store IDs. To support flexible mapping, you can set an **external store ID** from Voyado as an `externalId` on the store entity in Omnium. This ensures that receipts are linked to the correct store in Voyado.

The `providerName` of the `externalId` in Omnium should by default be `VoyadoExternalStoreId`. The `id` should match the `ExternalId` of the corresponding store in Voyado.

Example:

```json
{
    "providerName": "VoyadoExternalStoreId",
    "id": "1100"
}
```

As it is possible to have multiple connectors in Omnium it is also important to remember to include a potential connector-prefix in the provider name to ensure the externalId is related to the correct Voyado instance.

* * *

### Market-Specific Store Mapping

Sometimes, a single store in Omnium might serve multiple markets. In such cases, it can be useful to have separate stores in Voyado for each market, even if they map to the same store in Omnium.

To handle this, you can add the `MarketId` as a postfix to the `providerName`, separated by an underscore (`_`). This allows Omnium to determine the correct Voyado store based on the order’s market context.

Example with multiple store references separated by market context:

```json
[
  {
    "providerName": "VoyadoExternalStoreId_NOR",
    "id": "1100"
  },
  {
    "providerName": "VoyadoExternalStoreId_SWE",
    "id": "1100"
  }
]
```

In summary the provider name should have the following format for in multi instance scenario, where there are multiple stores in Voyado per store in Omnium:

`<ConnectorPrefix>_VoyadoExternalStoreId_<MarketId>`

Full example with connector prefix `"BikeShop"` and market specific stores in Voyado for single store in Omnium:

```json
[
  {
    "providerName": "BikeShop_VoyadoExternalStoreId_NOR",
    "id": "1100"
  },
  {
    "providerName": "BikeShop_VoyadoExternalStoreId_SWE",
    "id": "1100"
  }
]
```

* * *

# Webhooks

Omnium receives real-time events from Voyado over webhooks and reacts instantly, without polling. All events arrive on one endpoint, every request is verified with a signing secret, and the payload can additionally be encrypted.

| Event | Purpose |
| --- | --- |
| [Bonus points](voyado.md#bonus-points) | Keep the bonus point balance in sync |
| [Vouchers](voyado.md#vouchers) | Import reward vouchers and redeem them at capture |
| [Promotions](voyado.md#promotions-personal-offers) | Import personal offers assigned to a contact |

Use the webhooks for new setups. Each event is described in its feature's section below.

## Initial configuration

One Voyado endpoint carries every event. Set it up once per Voyado connector, then add the events you need.

1.  **Ask Voyado to activate the events.** Voyado activates webhooks per account and per event. Contact Voyado Solution & Delivery if you are new to webhooks, or Voyado Support to add further events to an existing setup. Events are not delivered until Voyado enables them server-side, even after you have subscribed to the event.
2.  **Add the endpoint** in Voyado's webhooks dashboard: choose **Add Endpoint**, set the **Endpoint URL** to `https://{your-omnium-api-domain}/api/VoyadoWebhook`, subscribe to the events you use, and save it. Then open the endpoint, go to **Advanced**, and add a header with key `omniumtenantid` and value set to your Omnium tenant id.
3.  **Copy the signing secret** shown on the endpoint in Voyado into the Voyado connector in Omnium, **Connection** tab, **Webhooks** panel, field **Webhook signing secret**. See [Signing secret](voyado.md#signing-secret).
4.  **Enable the events** on the connector's **Loyalty** tab. Each event's setting is named in its feature's section below.

Omnium resolves the connector by matching the payload `tenant` to the connector host subdomain (for example `omnium` from `https://omnium.voyado.com`). If an account's URL differs from the tenant Voyado sends, set a `VoyadoTenantName` property on the connector to that value.

An event the connector has not enabled is acknowledged and ignored, so nothing is imported until its setting is on.

## Signing secret

Every webhook request is verified before its payload is read. Voyado signs each request with the endpoint's signing secret, and Omnium recomputes the signature with the secret stored on the connector and compares the two. A request that cannot be verified, because the connector has no secret or the signature does not match, is rejected with `401 Unauthorized` and not processed.

If you change the secret in Voyado, paste the new one into the connector.

The secret is per endpoint. If you run several Voyado connectors on one tenant, each has its own endpoint in Voyado and its own secret.

## Payload encryption

Voyado can encrypt the event payload for a tenant. This is optional and is enabled on the Voyado side, for the whole tenant rather than per endpoint. When it is on, every event arrives with `isEncrypted` set to `true` and an encrypted payload, and Omnium decrypts it with the key from the connector before handling the event as usual.

To enable it:

1.  Ask Voyado to enable payload encryption for the tenant. Voyado provides the encryption key.
2.  Paste the key into the Voyado connector, **Connection** tab, **Webhooks** panel, field **Webhook encryption key**.

* * *

# Bonus points

**Event** `point.balance.updated` · **Setting** Loyalty → **Sync bonus points (webhook)**

Bonus point balance updates are received over a webhook. The event is sent whenever the balance changes. The balance is a full snapshot that replaces the stored value and shows on the customer card.

* * *

# Vouchers

Voyado converts accumulated bonus points into reward vouchers (bonus checks). In Omnium they are called vouchers. They are imported over the [webhook](voyado.md#import-over-webhook) (recommended) or [SFTP](voyado.md#import-over-sftp).

## Setup

1.  Set **Vouchers** to **Webhook** or **SFTP** on the connector's **Loyalty** tab, and complete the setup for that import below.
2.  Add the payment type **Voucher** in Omnium settings. The only thing that needs to be set in the payment type settings is Vue-template = `voucher-payment`.
3.  Set up the scheduled task `VoucherExpirationScheduledTask` to enforce the expiration dates on vouchers. It is sufficient for this task to run once a day. Only vouchers with status **Available** are affected by this task, so vouchers that are applied before the expiration date can still be captured after it.

## Import over webhook

**Event** `reward.voucher.created` · **Setting** Loyalty → **Vouchers** set to **Webhook**

Requires the [webhook setup](voyado.md#initial-configuration), including the signing secret. The payload carries the Voyado voucher id, which the SFTP export lacks; without it a voucher cannot be redeemed or reactivated through Voyado's API.

### How it works

1.  Voyado creates reward vouchers in two daily batches (05:00 and 22:00), sending one event per voucher it creates for a customer.
2.  Omnium imports the voucher and links it to the customer, creating the customer from the Voyado contact if needed.
3.  Apply the voucher to a cart (UI **Payments → Voucher**, or `api/cart/{cartId}/ApplyVoucher/{voucherId}`); it becomes an authorized payment with status **Applied**.
4.  On capture, Omnium marks it **Redeemed** and redeems it in Voyado (reward-voucher API v3). Non-blocking: capture succeeds even if Voyado is down.
5.  On credit or cancel, Omnium frees the voucher and reactivates it in Voyado.

## Import over SFTP

The SFTP voucher export does not include the Voyado voucher id, so vouchers imported this way cannot be redeemed or reactivated through Voyado's API. Omnium marks them redeemed in Voyado when the receipt is exported to Voyado.

### Setup

1.  Set **Vouchers** to **SFTP** on the connector's **Loyalty** tab.
2.  Set up the **FTP Connection** on the **Connection** tab.
3.  Set the DefaultCurrency-setting under Voyado order settings. This will determine the currency on imported vouchers and should be the same as the group currency in Voyado.
4.  In Voyado the Voucher export file must be configured to contain contactId, this is required to connect the voucher to the correct customer in Omnium.

### How it works

1.  Voyado generates vouchers from accumulated bonus points.
2.  Omnium has a scheduled task that retrieves both new and redeemed vouchers from Voyado.
    *   New vouchers from the import are created in Omnium and assigned to the private customer connected to the Voyado contact that was assigned the voucher.
    *   If this customer does not already exist in Omnium, Omnium will try to create it by fetching data from Voyado.
    *   Vouchers redeemed in Voyado will be redeemed in Omnium as well, in case a voucher is redeemed through another channel.
3.  The vouchers should now be available to inspect from either the private customer cart in Omnium or retrieved using the Omnium voucher-api.
4.  In order to use a voucher in Omnium, apply it to a cart. This can be done through the UI under payments -> voucher or through the api-endpoint `api/cart/{cartId}/ApplyVoucher/{voucherId}`
5.  This will add the voucher as an authorized payment on the order as well as updating the voucher status to Applied (thus preventing multiple uses of the same voucher in Omnium).
6.  When completing an order, the capture payment workflow step will set the voucher payment to “captured” and update the voucher status to “Redeemed”
7.  The voucher in Voyado will be marked redeemed once the receipt is exported to Voyado. This happens on the workflow step “Export Order” that is usually executed on the last order status.

## Orders with several shipments

The capture can split a voucher between the shipments of an order. Omnium redeems the voucher on the first capture, and the next shipments capture the rest of the voucher.

## Vouchers redeemed outside Omnium

The webhook does not send redemptions. A voucher redeemed outside Omnium, for example in an external POS or manually in Voyado, stays **Available** in Omnium and can be applied to a cart again. Omnium does not check the voucher in Voyado before it is applied.

*   If all vouchers are redeemed through Omnium (including Omnium POS), use the webhook.
*   If vouchers are also redeemed in other channels, a system that applies vouchers through the Omnium API must check the voucher in Voyado first. Alternatively, use the [SFTP import](voyado.md#import-over-sftp), which also imports vouchers redeemed in other channels, but cannot redeem or reactivate vouchers through Voyado's API.

* * *

# Promotions (Personal Offers)

Voyado assigns personal offers to contacts. Omnium redeems the coupon in Voyado when the order goes through. The two are linked by a shared code.

> **Important** A Voyado coupon only works in Omnium if a matching promotion exists in Omnium. The discount logic (percentage, amount, etc.) is configured in Omnium, not in Voyado. Each coupon is single-use and can only be redeemed once.

## Setup

1.  **Create the promotion in Omnium** with `IsPersonalCouponPromotion = true` and a `DiscountCode`.

2.  **Create the promotion in Voyado Engage** of type **Multichannel**, with a redemption channel `type: ECOM`, `valueType: EXTERNALOFFER` and the Omnium `DiscountCode` as value.

3.  **Enable the assignment import** on the Voyado connector (see [below](voyado.md#assignment-import)).

4.  **Add two workflow steps** with connector `VoyadoExporter` and `StopOnError = true`: `CheckPersonalDiscountCoupons` and `TryRedeemPersonalDiscountCoupons`. Place them on order status **New**.

    > **Note:** The steps can also run just before payment capture. Either placement prevents two completed orders from using the same coupon, but only **New** redeems it at order placement, so the customer cannot place a second order with the coupon while the first is still open.

## How it works

1.  Voyado assigns the promotion to a contact. The import stores the coupon on the customer in Omnium, creating the customer from the Voyado contact if needed (matched on `CustomerUniqueIdentifier`).
2.  The coupon code is applied to the cart (`CartAddCouponCodeToCart` or the cart UI). Omnium only accepts it if the customer holds that coupon.
3.  When the order is placed, the workflow checks the coupon against Voyado and redeems it (`/api/v3/promotion-assignments/{assignmentId}/redeem`).

## Assignment import

### Over webhook

**Event** `promotion.multiChannel.assigned` · **Setting** Loyalty → **Promotions** set to **Webhook**

Recommended. Omnium imports each promotion assigned to a contact as a personal coupon on the customer, as soon as Voyado assigns it. Requires the [webhook setup](voyado.md#initial-configuration), including the signing secret.

### Over SFTP

Set **Promotions** to **SFTP** on the connector's **Loyalty** tab and fill in the **FTP Connection** (Host, Username, Password) on the **Connection** tab. The setting also adds the scheduled task **Voyado - Coupon Synchronization** (`VoyadoPromotionSyncScheduledTask`, every 5 minutes) to the tenant, and removes it again when set to **Off**, so the task does not need to be set up separately.

The task reads `/couponExport/` on Voyado's SFTP server and handles **Assigned**, **Redeemed** (in another channel, e.g. POS) and **Deleted** coupons. Failed files are moved to `/couponExport/failed/`. Coupons are therefore not available in Omnium immediately after assignment.

## Coupons redeemed outside Omnium

The webhook does not send redemptions or deletions. A coupon redeemed outside Omnium, for example in an external POS, stays on the customer in Omnium. It cannot be used twice: the `CheckPersonalDiscountCoupons` workflow step checks the coupon in Voyado when the order is placed, and stops the order if the coupon is already redeemed.

## Troubleshooting

| Error | Description |
| --- | --- |
| `PromotionNotFound` | The promotion ID doesn't exist in Voyado |
| `PromotionAlreadyRedeemed` | The coupon has already been used |
| `PromotionNotAssociatedWithContact` | The coupon isn't assigned to this customer |
| `PromotionNotValidForRedemptionChannel` | The coupon isn't valid for the ECOM channel |

Coupons not showing up: with **Webhook**, check that the endpoint in Voyado subscribes to `promotion.multiChannel.assigned` and that the signing secret on the connector is set. With **SFTP**, check `/couponExport/failed/` and the SFTP connection.

* * *

# Voyado Order API - V2

The Omnium-Voyado integration enables sending **transactional emails** via **Voyado**, using the **Voyado Order API v2**.

## Setup

1.  **Activate the Exporter** Enable the `VoyadoOrderExporter` from the Voyado settings UI in Omnium.

2.  **Configure the Workflow** In Omnium, add the `ExportOrder` action to any workflow step where you want to trigger a Voyado action.

    *   Set the **Connector** to `VoyadoOrderExporter`.

## How It Works

1.  **Setting up Omnium**

    For each order status in Omnium where a transactional email in should be triggered in VOyado, add a workflow step called `ExportOrder` using the connector **VoyadoOrderExporter**.

    > **Note:** Do not confuse **VoyadoOrderExporter** with **VoyadoExporter**, which handles **receipt exports**.

    The `ExportOrder` step will:

    *   Map the Omnium Order to Voyado's `OrderModel`.
    *   Send the order data to Voyado's `/api/v2/orders` endpoint.
2.  **Configuring Email Triggers in Voyado**

    In Voyado, configure transactional emails to trigger upon receiving an order with one of the relevant statuses from Omnium.

* * *

# Voyado Order API – V3

Omnium now supports **Voyado Order API V3**, a more flexible and powerful version than its predecessor. This integration enables triggering various order-related actions in Voyado directly from Omnium.

## Setup

1.  **Activate the Exporter** Enable the `VoyadoOrderV3Exporter` from the Voyado settings UI in Omnium.

2.  **Configure the Workflow** In Omnium, add the `ExportOrder` action to any workflow step where you want to trigger a Voyado action.

    *   Set the **Connector** to `VoyadoOrderV3Exporter`.

    *   **OPTIONAL**: In the **Properties** tab of the workflow step configuration modal:

        *   Add a property with key: `VoyadoOrderAction`

        *   Set the value to: `"ACTION_NAME"` (Replace `ACTION_NAME` with the specific action to trigger in Voyado.)

        *   **To add data to the order action**: Add properties with keyGroup `VoyadoActionExtraData` and key equaling the propertyName in Omnium. The property name can point to string values on order/shipment/return root or custom properties on the order, shipment, or return.

        *   **To add line-item level data to the order action**: Prefix the property key with `LineItem.` (e.g., `LineItem.Color`). This will resolve the property for each line item in the shipment (or order form if no shipment) and include it in the action payload under an `itemLevel` array.

Example of how the export workflow step JSON should look:

```json
{
   "name": "ExportOrder",
   "active": true,
   "runAfterOrderIsSaved": false,
   "stopOnError": false,
   "connector": "VoyadoOrderV3Exporter",
   "properties": [
      {
            "key": "VoyadoOrderAction",
            "value": "<ActionName>"
      },
      {
            "key": "<PropertyName1>",
            "value": "",
            "keyGroup": "VoyadoActionExtraData"
      },
      {
            "key": "<PropertyName2>",
            "value": "",
            "keyGroup": "VoyadoActionExtraData"
      },
      {
            "key": "LineItem.<PropertyName3>",
            "value": "",
            "keyGroup": "VoyadoActionExtraData"
      }
   ]
}
```

## How It Works

The Omnium–Voyado integration operates by executing hooks in the Omnium order workflow that initiate an export to Voyado and trigger a specific action.

Here's a step-by-step outline:

1.  **Triggering the Export** When a configured workflow step executes the `ExportOrder` action, Omnium initiates an export to Voyado containing the specified order action as an embedded order action.

2.  **Polling for Completion** Omnium receives a job reference from Voyado and continuously polls the API to monitor the status of the order import job.

3.  **Error Handling** If an error occurs (e.g., a failed import or API error), it is logged in Omnium and associated with the affected order. These errors are visible from both the **Order Detail Page** and the **Order List**.

> **Note:** Due to the asyncronous nature of this part of the integration Omnium will perform steps 2-3 asynchronously in the backgroud. The order workflow will continue to execute in the meantime, and there is no guarantee that action in Voyado is completed nor successful at time the next workflow step in Omnium is executed.

* * *

## Return Order Exports

The `VoyadoOrderV3Exporter` also supports exporting **return orders** to Voyado. This allows triggering Voyado actions when a return is processed in Omnium (e.g., sending a return confirmation email).

### Setup

1.  In Omnium, add the `ExportReturn` action to the relevant return workflow step.
2.  Set the **Connector** to `VoyadoOrderV3Exporter`.
3.  **OPTIONAL**: Configure a `VoyadoOrderAction` property and `VoyadoActionExtraData` properties on the workflow step, just like for order exports.

### How It Works

The return export follows the same pattern as order exports:

1.  Omnium maps the return order form to the Voyado Order V3 format, including the return status.
2.  If a `VoyadoOrderAction` is configured on the workflow step, it is included as an embedded order action on the request.
3.  Omnium sends the return data to Voyado. If the return has been exported previously (tracked via `externalId`), Omnium will update the existing order in Voyado. Otherwise, a new order is created.
4.  Omnium polls the job status asynchronously to verify completion, the same as for order exports.

### Notes

*   The return exporter resolves the Voyado contact using the same customer lookup logic as the order exporter (private customer first, then business customer).
*   If the `VoyadoOrderV3Exporter` connector is configured as a related connector, the main connector settings are used for customer lookup.
*   The return `externalId` key uses the connector prefix (if configured) to support multi-instance setups.

* * *

## Anonymous Contact Creation (Guest Orders)

When exporting orders via `VoyadoOrderV3Exporter`, if no matching customer exists in Omnium, the exporter can optionally create an anonymous Voyado contact of type **Contact** using the order's email, name, and phone — without creating any customer record in Omnium.

This is useful for guest checkouts where transactional emails in Voyado should still be triggered even though the customer is not registered in Omnium.

### Setup

1.  Ensure the `VoyadoOrderV3Exporter` is active and has `RelatedConnector` pointing to the main **VoyadoExporter** connector.
2.  On the **main VoyadoExporter** connector settings, enable **Create anonymous contact on missing customer**.

### Behavior

*   If no Omnium customer is found for the order and the setting is enabled, Omnium creates a Voyado Contact using:
    *   **Email** (required — if the order has no email, the export is skipped with a warning)
    *   **Name** (split into first and last name)
    *   **Mobile phone** (if present)
*   If a contact with the same email already exists in Voyado, the existing contact is used instead.
*   The order export then proceeds normally using the resolved Voyado contact ID.
*   No Omnium customer record is created.

* * *

## Order Action Extra Data

### Order/Shipment/Return Level Properties

When configuring `VoyadoActionExtraData` properties on a workflow step, the property key refers to a property name on the entity being exported. The resolution order depends on the export type:

*   **Order exports**: Shipment properties are checked first, then order properties.
*   **Return exports**: Return order form properties are checked first, then order properties.

For each property, the system first checks custom properties on the entity, and then falls back to built-in properties on the entity root (e.g., `Status`, `Id`).

### Line-Item Level Properties

To include per-line-item data in the order action, prefix the property key with `LineItem.` in the `VoyadoActionExtraData` configuration.

For example, configuring `LineItem.Color` will:

1.  Iterate over all line items in the shipment (or order form if no shipment is present).
2.  For each line item, resolve the `Color` property (first from custom properties, then from built-in fields).
3.  Include the result in an `itemLevel` array in the action data payload.

Each entry in the `itemLevel` array contains the line item's `id` and the resolved property values.

Example resulting action payload:

```json
{
  "action": "ActionName",
  "language": "sv-SE",
  "data": {
    "trackingUrl": "https://example.com/track/123",
    "itemLevel": [
      {
        "id": "line-item-1",
        "color": "Red"
      },
      {
        "id": "line-item-2",
        "color": "Blue"
      }
    ]
  }
}
```

Multiple `LineItem.*` properties can be configured. If multiple properties are specified for the same line item, they are merged into a single entry per line item.
