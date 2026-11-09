# Customers

Source: https://docs.omnium.no/docs/plugins/POS/Sitoo/Customers

> Customer data synchronization and CRM integration options.

# Customers

Sitoo supports four different approaches for managing customer data:

1.  **Sitoo Native CRM** - Sitoo has its own customer register
2.  **Omnium CRM via CRM SPI v2** - Use Omnium's customer register through Sitoo's CRM Service Provider Interface
3.  **Voyado as CRM via Omnium CRM SPI** - Use Voyado as the CRM with Omnium acting as intermediary through CRM SPI
4.  **Voyado as CRM (Direct)** - Sitoo connects directly to Voyado for CRM, with order import handling customer resolution

## Option 1: Sitoo Native CRM

When using Sitoo's native customer register:

*   Customers are created in Omnium from customer information on orders
*   There is no dedicated customer information synchronization
*   Customers are **not** automatically created in Sitoo when orders are created in Omnium
*   Customer data flows from Sitoo to Omnium via order events only

This is the default configuration and requires no additional setup.

This is not recommended

## Option 2: Omnium as CRM via CRM SPI v2 (Recommended)

Using Omnium's customer register allows Sitoo POS to interact directly with customer data stored in Omnium. This enables full customer management capabilities including search, create, update, and transaction history.

### What We Support

The Omnium CRM SPI v2 implementation provides the following capabilities:

*   **Customer Search** - Search for customers by mobile or email when adding to cart in POS
*   **Customer Lookup** - Look up customers for display purposes
*   **Get Customer** - Retrieve individual customer details
*   **Add Customer** - Create new customers from Sitoo POS
*   **Update Customer** - Modify existing customer information
*   **Transaction History** - View customer purchase history
*   **Redeem Items** - Handle bonus checks and promotions redemption
*   **Consents** - Manage customer consent preferences

### What We Don't Cover

The following CRM SPI v2 features are **not implemented**:

*   **Undo Redeem** - Reversing redemptions is not implemented
*   **Custom Sections** - Custom data sections in customer model
*   **Advanced Campaigns** - Customized campaign activation

### Configuration

#### Step 1: Add CRM API Key Property

Add the following property to your Sitoo connector configuration in the market settings:

```json
{
    "key": "CrmApiKey",
    "value": "{crmapikey-value}"
}
```

Generate a GUID value for `{crmapikey-value}` (e.g., `5ebbe037-0dda-4532-8e01-eee69378095a`).

#### Step 2: Configure Sitoo Back Office

Navigate to **Settings -> General -> POS Settings -> Advanced** in the Sitoo back office and configure the CRM SPI v2 endpoint:

```
crm:
  channels:
    -
      id: customcrmV2
      title: Omnium CRM
      client_settings:
        member_number_title: Medlemsnummer
        search_types:
          - mobile
          - email
        fields_add:
          email: editable
          member_number: hidden
          name: editable
          personal_id: hidden
          mobile: editable
          invoice_address: hidden
          accepts_email: hidden
          accepts_sms: hidden
          accepts_mail: hidden
          consents: hidden
        fields_edit:
          email: editable
          member_number: hidden
          name: editable
          personal_id: hidden
          mobile: editable
          invoice_address: hidden
          delivery_address: hidden
          accepts_email: hidden
          accepts_sms: hidden
          accepts_mail: hidden
          consents: hidden
      handler:
        crm_v2:
          api_url: 'https://apitest.omnium.no/api/SitooCRM/{TenantId}/{MarketId}/'
          token: '{crmapikey-value}'
web_apps: null
```

Replace:

*   `{TenantId}` with your tenant ID (e.g., `DevShop`)
*   `{MarketId}` with your market ID (e.g., `NOR`)
*   `{crmapikey-value}` with the same GUID from Step 1

For production environments, use `https://api.omnium.no` instead of `https://apitest.omnium.no`.

#### Step 3: Enable CRM SPI for Order Import

To retrieve customers from Omnium instead of Sitoo when importing orders, add the following property to your Sitoo connector configuration:

```json
{
    "key": "UseCrmSpi",
    "value": "true"
}
```

#### Step 4: Configure Phone Number Formatting

Ensure proper phone number formatting by adding the following to your Sitoo connector configuration:

```json
{
    "key": "MarketSpecificPhonePrefix",
    "value": "+47"
}
```

Adjust the country code prefix as needed for your market.

If this is not set, the global country code prefix is used, found in tenant settings under **Advanced -> Formatting**:

```json
{
    "phoneNumberPrefixForSearch": ""
}
```

### API Endpoints

The following endpoints are exposed to sitoo:

| Method | Endpoint | Purpose |
| --- | --- | --- |
| GET | Search customers by key (mobile/email) |  |
| POST | Create a new customer |  |
| GET | Get customer details |  |
| PUT | Update customer information |  |
| GET | Get customer transaction history |  |
| POST | Redeem bonus checks/promotions |  |
| DELETE | Undo redemption (not implemented) |  |
| GET | Get available consent types |  |

### Authentication

All endpoints use HTTP Basic Authentication. The `Authorization` header is validated against the configured `CrmApiKey` value. Requests without valid authorization will receive a `401 Unauthorized` response.

### POS Integration Points

The CRM integration is used at the following points in Sitoo POS:

*   **Find Customer** - Search when adding customer to cart
*   **Customer Card** - Display customer details, bonus checks, and promotions
*   **Customer Purchase History** - View past transactions
*   **Create/Edit Customer** - Manage customer information
*   **Redeem Bonus Checks & Promotions** - Apply rewards to purchase
*   **Refund Historic Purchase** - Process returns with customer lookup

### Customer Club Members and Price List Access

When a customer is synced to Sitoo via the CRM SPI, customer club members automatically receive the password configured with key `OmniumCustomerClubMemberPassword` in their Sitoo profile (`voucher_passwords`). This grants them access to any Sitoo voucher or price list protected by that password.

### Customer Transactions

Customer transactions (purchases) are sent to Omnium via the Sitoo Events SPI (webhooks) for orders, not through the CRM SPI. See the [Orders](Orders.md) documentation for webhook configuration.

## Option 3: Voyado as CRM via Omnium CRM SPI

When using Voyado as the CRM system with Sitoo connecting through Omnium's CRM SPI, Omnium acts as an intermediary between Sitoo and Voyado. In this scenario:

*   Voyado is connected to Omnium through the Voyado connector
*   Sitoo connects to Omnium's CRM SPI endpoints (using the same configuration as Option 2)
*   Omnium forwards customer requests to Voyado and translates responses back to Sitoo

This enables centralized customer management across multiple channels while maintaining Voyado as the source of truth for customer data.

### Configuration

Use the same configuration steps as **Option 2: Omnium as CRM via CRM SPI v2** above. The only difference is that Omnium will be configured internally to sync and update customers between Omnium and Voyado.

## Option 4: Voyado as CRM (Direct Sitoo Integration)

In this scenario, Sitoo connects **directly to Voyado** for CRM operations, bypassing Omnium's CRM SPI. However, when orders are imported from Sitoo to Omnium, customer data needs to be resolved.

### How It Works

**During POS Operations:**

*   Sitoo communicates directly with Voyado for customer search, display, and management
*   Customer data is managed entirely in Voyado

**During Order Import to Omnium:**

*   When an order is imported from Sitoo with `CrmChannelId = "voyado"`
*   Omnium only receives the `customerId` from the Sitoo order
*   Full customer resolution happens via the `GetOrCreateCustomerFromOrder` workflow step
*   This workflow step looks up or creates the customer in both Omnium and Voyado as needed

See the [Voyado documentation](https://docs.omnium.no/plugins/CRM/voyado#get-or-create-customers-from-voyado) for detailed customer resolution logic including:

*   Looking up customers in Omnium by externalId
*   Looking up contacts in Voyado by contactId
*   Looking up contacts in Voyado by phone/email
*   Creating contacts in both Voyado and Omnium if needed

### Configuration

**In Sitoo:**

*   Configure Voyado as the CRM provider in Sitoo back office
*   Set up the direct Voyado connection

**In Omnium:**

*   Configure the Voyado connector
*   Ensure the `GetOrCreateCustomerFromOrder` workflow step is configured with the **VoyadoExporter** connector
*   Do **not** enable `UseCrmSpi` in the Sitoo connector settings
