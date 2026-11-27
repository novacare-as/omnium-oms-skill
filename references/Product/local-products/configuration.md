# Configuration

Source: https://docs.omnium.no/docs/Product/local-products/configuration

> How to enable and configure the Local Products feature

The Local Products feature is controlled by a tenant-level setting and can be combined with other product assortment settings for fine-grained control.

* * *

## Enabling Local Products

Navigate to **Configuration → Settings → Products → Assortment and Stores** and enable the **Local Products** toggle.

| Setting | Type | Default | Description |
| --- | --- | --- | --- |
| `isLocalProductsEnabled` | bool | false | Master toggle for the local products feature |

```json
{
  "ProductSettings": {
    "IsLocalProductsEnabled": true
  }
}
```

When this setting is disabled, the `isLocalProduct` flag on products has no effect — all products behave as global products regardless of their local product flag.

* * *

## What Happens When Enabled

When `IsLocalProductsEnabled` is set to `true`:

1.  **Non-admin users** creating new products will have `isLocalProduct` automatically set to `true`
2.  **Product search** gains local product filtering capabilities
3.  **UI access control** is enforced — editing is restricted based on store assignments
4.  **Search filters** for local/non-local products become visible in the product list
5.  **Store group expansion** is applied when assigning stores to local products

* * *

## Related Settings

Local products work alongside other product assortment settings:

| Setting | Interaction with Local Products |
| --- | --- |
| `isAssortmentStoreIdRequired` | When both are enabled, local products enforce strict store-based filtering in search |
| `hasSeparateCostPrices` | Enables per-store cost prices for local products. See [Cost Prices](cost-prices.md) |
| `requireProductMarket` | Local products still respect market requirements when enabled |

* * *

## User Requirements

For the feature to work effectively, ensure:

1.  **Stores are configured** in **Settings → Stores** with appropriate store groups
2.  **Users have store access** assigned through their user profile or role
3.  **Store groups are set up** if you want automatic expansion of store assignments

### User Store Access

The system determines store access from the user's security profile. This is typically configured through:

*   Direct store assignment on the user
*   Role-based store access
*   The `allstores` claim (grants access to all stores, equivalent to admin for local products)

* * *

## Admin Behavior

Users with the following roles bypass all local product restrictions:

| Role/Claim | Effect |
| --- | --- |
| `administrators` | Full access to all products, local filter hidden |
| `admin` | Full access to all products, local filter hidden |
| `apiuser` | Full access via API |
| `apiowner` | Full access via API |
| `allstores` claim | Full access to all stores and their local products |

Administrators can:

*   View and edit all local products regardless of store assignment
*   Mark any product as local or remove the local flag
*   Assign products to any store

The local product search filters are hidden for admin users and users with the `allstores` claim, since they already have access to all products.

* * *

## API Configuration

When using the API to manage local products, the same tenant settings apply. The `IsLocalProduct` property can be set via the product PATCH endpoint:

```
PATCH /api/Products/{productId}
Content-Type: application/json

{
  "isLocalProduct": true,
  "storeIds": ["store-001", "store-002"]
}
```

API users with `apiuser` or `apiowner` roles bypass local product access restrictions, similar to admin users.
