# Access Control

Source: https://docs.omnium.no/docs/Product/local-products/access-control

> How user permissions and store access control the editing of local products

Local products use store-based access control to determine who can view and edit products. This page covers how access is evaluated, how it affects the UI, and how to manage permissions.

* * *

## Access Evaluation

When a user interacts with a local product, the system evaluates access through the following logic:

```
User requests product access
         │
         ▼
┌────────────────────────────┐
│ Is feature enabled?        │──── No ──→ Access granted
└────────────────────────────┘
         │ Yes
         ▼
┌────────────────────────────┐
│ Is user admin/allstores?   │──── Yes ──→ Access granted
└────────────────────────────┘
         │ No
         ▼
┌────────────────────────────┐
│ Is product local?          │──── No ──→ Access granted
└────────────────────────────┘
         │ Yes
         ▼
┌────────────────────────────┐
│ Product has storeIds?      │──── No ──→ Access granted
└────────────────────────────┘
         │ Yes
         ▼
┌────────────────────────────┐
│ User has access to at      │
│ least one product store?   │
│ ┌── Yes ──→ Access granted │
│ └── No  ──→ Access denied  │
└────────────────────────────┘
```

* * *

## Access Levels

There are three levels of access for local products:

| Level | Description | Can Edit | Can View |
| --- | --- | --- | --- |
| **Full access** | User has access to at least one of the product's stores | Yes | Yes |
| **Read-only** | Product is in a market the user can access, but not in their stores | No | Yes (with `showNonEditableLocalProducts`) |
| **No access** | Product is not in any of the user's stores or markets | No | No |

* * *

## UI Behavior

The frontend uses the `v-localAccess` directive to enforce access control on UI elements. This directive supports two modes:

### Hide Mode

```
v-localAccess.hide
```

Completely hides the element when the user does not have access to the product. Used for elements that should be invisible to unauthorized users.

### Disable Mode

```
v-localAccess.disable
```

Disables all interactive elements (inputs, buttons, textareas) within the element when the user lacks access. Delete buttons are hidden entirely. This allows users to view product information without being able to modify it.

### Affected UI Areas

The access control directive is applied across the product management interface:

| Area | Behavior |
| --- | --- |
| Product quick edit | Inputs disabled, delete hidden |
| Product images | Upload/edit disabled |
| Inventory editing | Inputs disabled |
| Price editing | Inputs disabled |
| Product components | Editing disabled |
| Product list actions | Action buttons disabled |

* * *

## Search Behavior

When local products filtering is active, the search system applies additional restrictions:

### Default Behavior

By default, product searches for local products only return products the user **can edit** — products assigned to stores the user has access to.

### Including Read-Only Products

Enable `showNonEditableLocalProducts` to also include products the user can see through market access but cannot edit:

```
POST /api/Products/Search
Content-Type: application/json

{
  "isLocalProduct": true,
  "showNonEditableLocalProducts": true
}
```

In the UI, this is available as a checkbox in the search filters: **Show non-editable local products**.

* * *

## Store Assignment Restrictions

When a non-admin user updates store assignments on a local product:

1.  The user can only assign stores they have access to
2.  Existing assignments to stores **outside** the user's access are preserved
3.  The system cannot accidentally remove store assignments the user doesn't have visibility into

### Example

A product is assigned to stores: `[A, B, C]`

User has access to stores: `[A, B]`

*   User removes store B → Result: `[A, C]` (C is preserved even though user can't see it)
*   User adds store D (if they have access) → Result: `[A, C, D]`
*   User cannot remove store C (they don't have access to it)

This ensures that multi-store products maintain their full store coverage even when edited by users with limited store access.

* * *

## Filtering in the Product List

When the feature is enabled, the product list shows additional filter options:

| Filter | Values | Description |
| --- | --- | --- |
| Local Product | Not Local (red) / Local (green) | Toggle between non-local and local product views |
| Show Non-Editable | Checkbox | Include local products from accessible markets that the user cannot edit |

These filters are automatically hidden for admin users and users with the `allstores` claim, as they already have unrestricted access to all products.
