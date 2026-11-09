# OmniumProjectTypePatch

Patch object for project types

**Fields:**

- `projectTypeId`: string, nullable — Unique project type ID
- `projectTypeName`: string, nullable — Name of project type
- `projectCategory`: string, nullable — Project type category (e.g. Claim, Service)
- `availablePartnerIds`: List<string>, nullable, max length 250 — Business customer IDs that can be related to project as partners
- `isPartnerDisabled`: boolean, nullable — True if projects of this type cannot be assigned to partners
- `active`: boolean, nullable — True if project type is active

**Used directly by endpoints in:**

- [Projects | Project types](../endpoints/projects/project-types.md)
