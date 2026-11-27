# SCIM 2.0 (beta)

Source: https://docs.omnium.no/docs/Security/scim

> Automatic User Management with SCIM 2.0 (beta). Automatically synchronize users and roles to Omnium from any identity provider.

## Overview

System for Cross-domain Identity Management (SCIM) is standard that can be used to automatically sync users from your company's central identity system (like Microsoft Entra ID, Okta, or OneLogin) into Omnium. Instead of manually creating and managing each user account, the system does it for you.

Once set up, user management becomes automatic:

*   New employees are automatically added to Omnium when created in your identity system
*   User information (name, email, phone) updates automatically when changed
*   Departing employees lose access immediately when removed from your system
*   Groups and permissions sync automatically, so access control stays centralized

This is especially useful when managing many users or if you want to avoid having to update users in many systems.

NOTE: The SCIM functionality has not been thoroughly tested yet and changes/fixes may come at a later time.

## How It Works With Omnium

### Groups/Roles

Groups in SCIM are synced to roles in Omnium (not to be confused with roles in SCIM). New groups in your identity system will be created in Omnium, unless we find a match by display name that can be linked.

**Group deletion:**

*   SCIM can only delete groups that it has provisioned (created or adopted)
*   Roles that SCIM has never interacted with cannot be deleted via SCIM
*   Once a role is adopted by SCIM (matched by display name), deleting the group in your identity provider will delete the role in Omnium

Current limitations:

*   We don't support changing the name of an existing group/role.
*   Only one layer of nested Omnium roles is supported.

### Users

When SCIM tries to create users we first check if we can match on email or external id. If no user is found we create the user using the primary email address. If no email address is found we fall back to using the SCIM field userName.

**User deletion:**

*   SCIM can only delete users that it has provisioned (created or matched)
*   Users that SCIM has never interacted with cannot be deleted via SCIM
*   Once a user is matched by SCIM (by email or external id), deleting the user in your identity provider will delete the user in Omnium

Current limitations:

*   Users in Omnium cannot be deactivated since we as of now only support hard delete.

### Single Sign On (SSO)

SCIM and SSO in Omnium can work together, but it currently requires a small config change to the SCIM setup. Users created through SCIM need to have the field userPrincipalName mapped to emails\[type eq "work"\].value, so that when the user logs in our SSO solution finds the correct user.

## Setup

### 1\. Generate Authentication Token

Generate a secure bearer token for your identity provider:

```
# PowerShell - Generate random token
$tokenLength = 32   # bytes of entropy; change as needed
$token = [Convert]::ToBase64String([System.Security.Cryptography.RandomNumberGenerator]::GetBytes($tokenLength))
Write-Host "Bearer Token: $token"

# Hash with SHA-512 for Omnium
$bytes = [System.Text.Encoding]::UTF8.GetBytes($token)
$sha512 = [System.Security.Cryptography.SHA512]::Create()
$hashBytes = $sha512.ComputeHash($bytes)
$hash = [System.BitConverter]::ToString($hashBytes).Replace("-", "")
Write-Host "SHA-512 Hash: $hash"
$sha512.Dispose()
```

Save both values:

*   **Bearer Token**: Configure in your identity provider
*   **SHA-512 Hash**: Configure in Omnium

### 2\. Configure Omnium

Add the SHA-512 hash to your tenant settings:

*   Navigate to **Configuration** → **Settings** → **Users & access** → **Security & authentication**
*   Set `HashedScimProvisioningToken` to the SHA-512 hash from step 1

### 3\. Configure Your Identity Provider

**SCIM Endpoint:** `https://api.omnium.no/scim/v2/{YourTenantId}/{Provider}`

Replace:

*   `{YourTenantId}` - Your tenant ID from Omnium settings
*   `{Provider}` - Your identity provider name (e.g., `EntraID`, `Okta`, `OneLogin`)

**Authentication:** Bearer Token (use the plaintext token from step 1)

**Note:** The provider name in the URL is used to track which identity provider provisioned each user. This allows you to switch providers in the future while preserving user data.

Configure standard SCIM 2.0 provisioning with the attribute mappings below.

## Migrating to SCIM

### Key Considerations

Once SCIM is enabled, your identity provider becomes the master source for user and group management. Manual role assignments in Omnium will be replaced on next sync.

**Nested roles are preserved:** If an Omnium role contains other roles, those relationships remain. Users will see both direct (from IdP) and indirect (inherited) group memberships.

### Pre-Migration Steps

1.  **Backup existing users in Omnium** - Users can be exported in the top right corner in Omnium settings for users
2.  **Backup existing roles** - Either ask Omnium to do it or open developer tools, networking and open Roles in Omnium. The roles can be found in the GetGroupRoles request.
3.  **Audit existing users and roles** - Document current manual role assignments
4.  **Create groups in your identity provider** - Match Omnium role names where possible to enable automatic adoption
5.  **Assign users to groups** in your IdP before enabling provisioning
6.  **Test with pilot users** - Enable provisioning for a small group first

Note: SCIM can only delete users and roles that it has provisioned. Pre-existing users and roles that SCIM has never interacted with are protected from deletion.

### Migration Process

1.  Configure SCIM following the Setup section above
2.  Assign only pilot users (5-10) to the Omnium application in your IdP
3.  Verify pilot users sync correctly with expected group memberships
4.  Assign all users to the application and trigger full sync
5.  Validate all users retained necessary access

### Common Scenarios

**Existing user with manual roles:** User has roles `[RoleA, RoleB]` in Omnium. IdP provisions with groups `[GroupX]`. Result: User will have only `[GroupX]` after sync (except first sync when merged).

**Role name mismatch:** Omnium has "Store Managers", IdP sends "Store Manager". Result: New role created; existing role not adopted.

**Nested roles:** User assigned "Regional Manager" which contains \["Store Manager", "Sales Team"\]. Result: User gets direct membership to "Regional Manager" and indirect to the nested roles.

### Rollback

If issues occur, pause provisioning in your IdP and unassign users from the Omnium application to stop further syncs. Contact Omnium for help.

## Attribute Mappings

### Users

| Omnium Field | SCIM Attribute | Microsoft Entra ID (example) | Notes |
| --- | --- | --- | --- |
| User.Id | `emails[type eq "work"].value` | `mail` | **Primary identifier** (fallback to `userName` if missing) |
| User.Email | `emails[type eq "work"].value` | `mail` | Prioritize emails set to primary |
| User.ExternalIds | `userName` | `userPrincipalName` | Stored with the provider parameter from the scim url |
| User.FirstName | `name.givenName` | `givenName` |  |
| User.LastName | `name.familyName` | `surname` |  |
| User.Phone | `phoneNumbers[type eq "work"].value` | `mobilePhone` |  |
| User.B2CId | `externalId` | `objectId` | Azure AD ObjectId or equivalent |
| User.Roles | `groups` |  |  |

Note: userPrincipalName must be mapped to User.Id (emails\[type eq "work"\].value) to make SSO work out of the box.

### Groups

| Omnium Field | SCIM Attribute | Microsoft Entra ID (example) | Notes |
| --- | --- | --- | --- |
| Role.Id | `id` | `displayName` | Normalized from DisplayName (lowercase, no spaces), returned as SCIM `id` |
| Role.DisplayName | `displayName` | `displayName` | Group name - **immutable after creation** |
| Role.ExternalIds | `externalId` | `objectId` | Azure group ObjectId stored with provider name |
| Role.RoleType | \- | \- | Constant value "Group" |
| Role.Roles | \- | \- | Empty array |

**Group Matching (Migration Support):**

*   On first sync, Omnium checks for existing roles by `externalId` (Azure ObjectId), then by `displayName`
*   If a matching role exists, it's adopted and the `externalId` is stored
*   If no match, a new role is created with `Id` normalized from `displayName` (e.g., "Sales Team" → "salesteam")
*   This allows seamless migration from manually created roles to SCIM-managed roles

**Important Notes:**

*   **DisplayName is immutable**: Group names cannot be changed via SCIM after creation. If a group is renamed in Azure, it will be treated as a new group.
*   When users are added to a group, the normalized role ID is added to their User.Roles list, granting them the associated permissions.

## Provider Examples

### Microsoft Entra ID

1.  **Enterprise Applications** → **Provisioning** → **Automatic**
2.  **Tenant URL**: Production: `https://api.omnium.no/scim/v2/{YourTenantId}/EntraID`
3.  **Secret Token**: Your bearer token
4.  Map: `userPrincipalName` → `userName`, `mail` → `emails[type eq "work"].value`, etc.

### Okta

1.  **Applications** → **Provisioning** → **Configure API Integration**
2.  **SCIM Base URL**: Production: `https://api.omnium.no/scim/v2/{YourTenantId}/Okta`
3.  **Bearer Token**: Your bearer token
4.  Enable Create/Update/Deactivate operations

### Other Providers

Use standard SCIM 2.0 configuration with:

*   **Endpoint**: Production: `https://api.omnium.no/scim/v2/{YourTenantId}/{ProviderName}`
*   **Bearer Token**: Your plaintext token from step 1

## Troubleshooting

**Connection fails:**

*   Verify tenant ID in URL is correct
*   Ensure bearer token matches the SHA-512 hash configured in Omnium
*   Check that SCIM provisioning is enabled in your identity provider
*   Make sure you are using the url for the correct environment (apidev/apitest/app)

**Users not syncing:**

*   Verify email (`emails[type eq "work"].value`) is mapped - this is the primary identifier
*   Ensure `userName` is also mapped
*   Check users are assigned to the application in your IdP
*   Review provisioning logs in your identity provider

**Groups not working:**

*   Enable group provisioning in your IdP
*   Ensure `displayName` is mapped
*   Verify groups are assigned to the application

## Support

Create a ticket at [https://help.omnium.no/hc/en-us/requests/new](https://help.omnium.no/hc/en-us/requests/new) with your tenant ID and provisioning logs if you need assistance.
