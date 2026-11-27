# Property Options

Source: https://docs.omnium.no/docs/configuration/property-options

> Centrally managed dropdown value lists that can be reused across custom property dropdowns on products, projects, customers, stores, orders, and carts.

## Overview

Property Options are reusable, centrally managed value lists for dropdown-type custom properties. Instead of declaring `valueOptions` inline on every property definition and duplicating values across entities, you define a list once as a **Property Option Group** and reference that group from any DropDown property.

Typical use cases:

*   A bookstore maintains a single **Authors** group. Every product's "Author" dropdown reads from the group; adding a new author makes it available across all products automatically.
*   A fashion retailer keeps **Colours**, **Materials**, and **Sizes** as central lists shared between products, projects, and store properties.

Changes to a group propagate everywhere it is referenced. Renaming or deleting an option does not modify any value already stored on an entity — existing references are preserved.

Property Options are configured in the Omnium UI under **Configuration > Property Options**.

* * *

## Concepts

### Group key vs display name

Each group has two names:

| Name | Purpose | Mutable? |
| --- | --- | --- |
| **Group key** (`Group`) | Internal lookup key. Stored normalized (trimmed, lowercased). Used by property definitions to reference the group. | Immutable. To change the key, delete the group and recreate it. |
| **Display name** (`GroupDisplayName`) | Human-readable label shown in the admin UI. Preserves the original casing entered on first creation. | Mutable via Rename. |

Group keys are **case-insensitive** — `"Authors"`, `"authors"`, and `"AUTHORS"` all resolve to the same group. The display name retains the casing of the first value created in the group.

Renaming a group changes only the display name; the underlying key is unchanged. Properties referencing the group continue to resolve correctly, and stored values on entities are not affected.

### Active flag

Each option has an `IsActive` flag (default `true`):

*   **Active options** are shown in end-user dropdowns and listed in the admin UI.
*   **Inactive options** are hidden from end-user dropdowns but remain visible in the admin UI. Existing entity values that reference an inactive option are preserved and still display correctly.

Use the active flag to retire a value without losing historical data on existing entities.

### Sort order

`SortOrder` controls the order in which values appear in dropdowns (ascending). Within the same sort order, values are sorted alphabetically by value.

### Reference preservation

Deleting a value or a whole group **never modifies entity data**. Products, projects, customers, stores, orders, and carts that already reference a deleted value keep their value as plain text — the entity still shows the value, but it will no longer appear as a selectable option in the dropdown.

This is by design: the system treats Property Options as a source of _choices_, not as a foreign-key constraint.

* * *

## Data Model

### OmniumPropertyOption

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `Id` | string | Auto | GUID, auto-generated if omitted on create |
| `Group` | string | Yes | Group key. Normalized to lowercase + trimmed on save. Max 100 chars |
| `GroupDisplayName` | string | No | Display name shown in the UI. Defaults to the trimmed input group on first create. Max 100 chars |
| `Value` | string | Yes | The selectable option text shown in the dropdown. Max 500 chars |
| `SortOrder` | int | No | Sort order within the group (ascending). Defaults to `0` |
| `IsActive` | bool | No | When `false`, the option is hidden from end-user dropdowns but kept in the admin UI. Defaults to `true` |

Options are isolated per tenant.

* * *

## UI Configuration

### Managing groups and values

Navigate to **Configuration > Property Options**. The view has two panels:

*   **Left panel — Groups**: lists all defined groups by display name. Click a group to load its values into the right panel.
*   **Right panel — Values**: shows the selected group's values with editable sort order, value text, and active flag.

#### Creating a group

1.  Click **Add Property Option Group** in the left panel.
2.  Enter the group name and confirm. The display name is taken from what you type; the underlying key is the trimmed, lowercased version.
3.  The new group becomes selected automatically. Add values in the right panel.

A group exists in the UI only while it has at least one value. Adding the first value creates the group; deleting the last value (or using **Delete** on the group) removes it.

#### Adding values

In the right panel, type a value into the input row at the bottom and click the **+** button (or press Enter). New values are appended with the next available sort order and `IsActive = true`.

#### Editing values

Edit sort order, value text, or the active checkbox directly in the table. Changes save on blur or on checkbox toggle.

#### Bulk import

To paste many values at once:

1.  Open the group's context menu (⋯) and select **Import**.
2.  Paste one value per line into the textarea.
3.  Click **Import**. Each non-empty line becomes a new option, in the order pasted, with sort order continuing from the existing max.

Bulk import always _appends_ — it does not deduplicate against existing values or replace the group.

#### Renaming a group

1.  Open the group's context menu (⋯) and select **Rename**.
2.  Enter the new display name and confirm.

Only the display name changes. The underlying key, all references on entities, and all values stay intact.

#### Deleting an option or a group

*   Delete a single value via the row's context menu.
*   Delete an entire group via the group's context menu — this removes all its values in one operation.

Both actions show a confirmation prompt. Neither modifies entity data; references to deleted values remain on entities as plain text.

* * *

## Using a Property Option Group on a custom property

Property Option Groups are referenced from **DropDown**\-type custom properties defined in tenant settings (Product Types, Project Types, Customer Settings, Store Settings, Order Settings, Cart Settings).

### Wiring up a property to a group

1.  Edit the property in the appropriate settings area (e.g., **Product Types > \[type\] > Properties**).
2.  Set **Value Type** to `DropDown`.
3.  Click **Show More** to reveal advanced settings.
4.  In the **Property Option Group** dropdown, select an existing group.

When a group is selected:

*   The static **Default Value Options** list is ignored at runtime — values come from the group instead.
*   Toggling **Is Custom Default Value Options Allowed** and **Is MultiSelect Enabled** continues to work as usual.

### End-user behaviour

When an end user opens a dropdown bound to a group:

*   The list of values is **lazy-loaded** the first time the dropdown is opened or focused (one network call per page load per group).
*   Only **active** values are shown.
*   The dropdown supports **search-as-you-type** — as the user types, a prefix search hits the property options index and returns matching active values.
*   If the entity already has a value that is no longer in the group (or has been deactivated), the stored value is still shown in the dropdown so it can be read and re-selected if desired.

### Static list vs group reference

You can leave **Default Value Options** populated as a fallback, but if a Property Option Group is also set on the property, the group always wins. The simplest pattern is to clear the static list when moving a property to a centrally managed group.

* * *

## Public API

The public API lives at `/api/PropertyOptions` and requires the `Admin` or `ApiUser` role. It is intended for external integrators that need to manage option groups programmatically (e.g., syncing a list of authors from a PIM).

| Method | Path | Description |
| --- | --- | --- |
| GET | `/api/PropertyOptions?group={group}&includeInactive={bool}` | Returns all options in a group, sorted by sort order ascending. `includeInactive` defaults to `false` |
| GET | `/api/PropertyOptions/groups` | Returns the list of distinct group display names |
| POST | `/api/PropertyOptions` | Create a single option. Body: `OmniumPropertyOption` |
| POST | `/api/PropertyOptions/AddMany` | Create multiple options in one request. Body: `List<OmniumPropertyOption>` |
| PUT | `/api/PropertyOptions/{id}` | Update `Value`, `SortOrder`, and `IsActive`. The group key is immutable; `Group` changes on the body are ignored |
| DELETE | `/api/PropertyOptions/{id}` | Delete an option. Does not modify any entity that references the option |

`OmniumPropertyOption` payload:

```json
{
    "id": "auto-generated-if-omitted",
    "group": "authors",
    "groupDisplayName": "Authors",
    "value": "Jane Doe",
    "sortOrder": 0,
    "isActive": true
}
```

Group display name behaviour on create: if the normalized group key already exists, the new option inherits the existing group's display name regardless of what you send. The display name is only set from the request payload when creating the first option in a brand-new group.

* * *

## Behaviour Summary

| Action | Effect |
| --- | --- |
| Create option with new group | Group key is normalized (lowercase + trim). Display name is taken from the input |
| Create option with existing group key (any casing) | Option joins the existing group. The existing display name is preserved |
| Update option | Only `Value`, `SortOrder`, and `IsActive` are mutable. Group cannot be changed |
| Rename group | Display name updates on every option in the group. Key, references, and values are untouched |
| Delete option | Option is removed from the index. Entities referencing the option keep their stored value |
| Delete group | All options in the group are removed. Entities referencing any of the values keep their stored values |
| Deactivate option (`IsActive = false`) | Option is hidden from end-user dropdowns. Entities with the value still display it correctly |

* * *

## Related Documentation

*   [Generic Concepts](generic.md) — Properties and external IDs in Omnium
*   [GUI Extensions](gui-extensions.md) — Other ways to extend tenant settings
