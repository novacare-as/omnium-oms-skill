# OmniumUserPatch

OmniumUserPatch is used to patch existing omnium users

**Fields:**

- `roles`: List<string>, nullable, max length 2000 — List of roles assigned to user
- `firstName`: string, nullable — User's first name
- `lastName`: string, nullable — User's last name
- `email`: string, nullable — User's contact email
- `phone`: string, nullable — User's phone number
- `projectTypes`: List<string>, nullable, max length 1000 — Project types of interest to user
- `imageUrl`: string, nullable — Url to user image
- `properties`: List<[`OmniumPropertyItem`](OmniumPropertyItem.md)>, nullable, max length 250 — User properties, (key values)
- `propertiesRemovalConditions`: List<[`OmniumPropertyItem`](OmniumPropertyItem.md)>, nullable, max length 250 — Specifies conditions for removing existing properties before proceeding with the patch operation. Each item in this list is a property specification with multiple attributes that must all match an existing property for it to be removed. For instance, a condition { "KeyGroup": "KeyGroupToRemove", "ValueType": "List" } will remove properties only if both KeyGroup == "KeyGroupToRemove" and ValueType == "List". Multiple items in this list are evaluated with "OR" logic, so any matching condition will trigger removal.
- `keepExistingCustomProperties`: boolean, nullable — Set to 'false' if you want to update the whole 'properties' list. If true, new properties will be added to the existing list of properties. 'True' by default.

**Used directly by endpoints in:**

- [Users](../endpoints/users.md)
