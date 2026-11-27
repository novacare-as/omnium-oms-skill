# Authentication - UI

Source: https://docs.omnium.no/docs/Security/authentication-roles

> Overview of authentication and authorization options in the Omnium UI and how roles are managed across identity providers.

## Overview

Omnium supports multiple authentication providers, allowing you to integrate with your preferred identity platform while maintaining consistent role-based access control.

Supported identity providers:

*   **Azure AD B2C** _(default)_
*   **Entra ID**
*   **Auth0**

In all setups, users and roles can also be managed directly via the Omnium API, giving you full control over your access model.

* * *

## Azure AD B2C (Default)

Azure AD B2C is the default authentication provider and login for Omnium. It handles user authentication and password management. There are no custom role mappings or tenant-level configurations available for this option.

* * *

## Entra ID

Omnium supports **Single Sign-On (SSO)** with Entra ID through **OpenID Connect (OIDC)**.

### Setup

To set up SSO with Entra ID, the following information is required from your organization:

| Parameter | Description |
| --- | --- |
| **TenantId** | Your Entra ID tenant ID |
| **ClientId** | The Application (client) ID of the app registration |
| **ClientSecret** | A client secret generated for the app registration |

**Your organization is responsible for:**

*   Creating the App Registration in Entra ID
*   Generating the Client Secret
*   Configuring the Redirect URI in the App Registration
*   Providing the above values to Omnium (unless using the new self service in tenant settings -> advanced)

### App Registration Configuration

#### Name

Use a descriptive name for the app registration, for example **Omnium** or **Omnium Production**. If you have separate environments (test and production), use distinct names such as **Omnium Test** and **Omnium Production**.

#### Supported Account Types

Select **"Accounts in this organizational directory only"** (Single tenant).

#### Redirect URIs

When adding Redirect URIs, select **Web** as the platform and add **both** of the following:

```
https://your-brand.oms.omnium.no/signin-oidc
https://your-brand.oms.omnium.no/Session/SignedOut
```

Replace `your-brand` with your Omnium subdomain.

*   `/signin-oidc` — used after successful sign-in
*   `/Session/SignedOut` — used after sign-out so Entra ID can clear the session and redirect the user back to Omnium

If you have separate environments, add the corresponding URIs for each. Omnium recommends the following hostname formats per environment:

| Environment | Hostname format |
| --- | --- |
| Production | `your-brand.oms.omnium.no` |
| Test | `your-brand.test.omnium.no` |
| Dev | `your-brand.dev.omnium.no` |

Each environment should have its own App Registration, or you can add all redirect URIs to a single registration if you prefer a shared setup.

Using the Omnium-managed subdomains above is the simplest option and is recommended for dev and test environments. The trade-off is that Omnium-managed subdomains route through Azure Front Door, so any Front Door disruption requires Omnium to update more DNS records to restore access. Production can use a custom domain instead — contact [Omnium Support](mailto:support@omnium.no) with your identity provider details to set this up.

#### Client Secret

When generating the client secret, note that **secrets have an expiration date** (maximum 24 months in Entra ID). Make sure to track the expiration and renew the secret before it expires. When a secret expires, users will no longer be able to sign in until a new secret is generated and provided to Omnium.

#### New SSO Admin page & Mirgration

We have a new SSO administration page where you can set up SSO config and update the secret when needed. The feature is gradually being rolled out and so the self service is currently available in the dev and test environments; in production it is still set up by Omnium. The page is located under Configuration -> Advanced -> SSO for users with web admin role.

Migration: Contact Omnium if you already have SSO and want to migrate to the new solution.

#### Branding & Properties (optional)

In the App Registration under **Branding & properties**, you can configure:

| Field | Value |
| --- | --- |
| **Logo** | Upload the Omnium logo (see below) |
| **Homepage URL** | `https://your-brand.oms.omnium.no` |

The logo and name are shown to users in the Entra ID MyApps portal and on consent screens.

**Logo requirements:** 215x215 pixels, PNG format, solid background, max 100 KB.

You can use one of the provided Omnium logos below. If you manage multiple environments, using different logos can help users visually distinguish between them.

| Light background | Dark background |
| --- | --- |
| ![Omnium logo (light)](https://docs.omnium.no/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fentra_id_logo.beebb80d.png&w=3840&q=75) | ![Omnium logo (dark)](https://docs.omnium.no/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fentra_id_logo2.da0c54bd.png&w=3840&q=75) |

Once configured, users from your organization can sign in using their existing Entra ID credentials.

### User and Role Provisioning

For automatic user and role synchronization with Entra ID, use **SCIM 2.0** provisioning.

See [Automatic User Management with SCIM 2.0](scim.md) for setup instructions.

* * *

## Auth0

Omnium supports **Single Sign-On (SSO)** with Auth0 through **OpenID Connect (OIDC)**.

### Setup

To set up SSO with Auth0, the following information is required from your organization:

| Parameter | Description |
| --- | --- |
| **Domain** | Your Auth0 domain (e.g., `your-tenant.eu.auth0.com`) |
| **ClientId** | The Application client ID |
| **ClientSecret** | The Application client secret |

**Your organization is responsible for:**

*   Creating the Application in Auth0
*   Generating the Client Secret
*   Configuring the Callback URL in the Application settings
*   Providing the above values to Omnium

**Callback URL:** In your Auth0 Application settings, add the Callback URL pointing to your Omnium environment:

```
https://your-brand.oms.omnium.no/callback
```

**Allowed Logout URL:** Also add the following to **Allowed Logout URLs** in your Auth0 Application settings:

```
https://your-brand.oms.omnium.no
```

Replace `your-brand` with your Omnium subdomain. See the [hostname formats above](authentication-roles.md#redirect-uris) for per-environment values.

Once configured, users from your organization can sign in using their existing Auth0 credentials.

### User and Role Provisioning

For automatic user and role synchronization with Auth0, use **SCIM 2.0** provisioning.

See [Automatic User Management with SCIM 2.0](scim.md) for setup instructions.

* * *

## User and Role Management via API

All users, roles, and permissions can also be managed via the Omnium API. This allows full programmatic control and can be used to integrate with external IAM or HR systems for automated user and role management.

**API documentation:** [https://apitest.omnium.no/documentation/index.html#/Users](https://apitest.omnium.no/documentation/index.html#/Users)

You can:

*   Create, update, or deactivate users
*   Assign or remove roles
*   Manage linked roles and permissions
*   Integrate with external IAM or HR systems for automated provisioning

**Tip:** On each user object, roles are represented as a flat list of strings under the `Roles` property. Market and store roles follow naming conventions:

*   **Market roles:** prefixed with `market-`
*   **Store roles:** prefixed with `store-`

## Security Model

Authentication and authorization are handled separately in Omnium.

*   User authentication is performed by your identity provider (for example, Entra ID or Auth0) using OpenID Connect.
*   Omnium manages authorization internally and evaluates what each role can access.
*   Roles define access to specific functionality, stores, markets, and other entities in the Omnium domain model.
*   User and role provisioning can be automated using [SCIM 2.0](scim.md).
*   Without SCIM, users must be invited or created in Omnium before they can sign in. Role assignment is managed entirely inside Omnium.

For details about role configuration and granular access rights, see [Roles, access rights, and users](https://help.omnium.no/hc/en-us/articles/22603831968017-Roles-access-rights-and-users).

* * *

## Forced Sign-In Frequency

Omnium supports forced sign-in frequency to control how often users must re-authenticate when accessing specific areas of the application. This feature enforces periodic credential verification, even when users have an active SSO session with their identity provider.

This feature works with all supported authentication providers (Azure AD B2C, Entra ID, and Auth0).

### How It Works

*   Omnium tracks the time since each user's last authentication
*   When accessing areas configured with "Enforce sign-in frequency", users who exceed the configured timeout are required to sign in again
*   The identity provider is instructed to prompt for credentials, bypassing any existing SSO session
*   After successful authentication, the user is returned to their original location and the timeout resets

### Configuration

Forced sign-in frequency is configured at two levels:

**1\. Global Settings**

Navigate to **Administration → Settings → Users & access → Security & authentication**:

| Setting | Default | Description |
| --- | --- | --- |
| Enable forced sign-in frequency | Off | Activates the feature |
| Timeout | 30 minutes | Time since last authentication before re-authentication is required (1-120 minutes) |

**2\. Per-Component Settings**

Once enabled globally, control which components require sign-in frequency. By default, no components require this:

*   Navigate to **Administration → Authorization**
*   Select a component
*   In the **Settings** tab, toggle **Enforce sign-in frequency**

### What Happens During Re-Authentication

*   Omnium requests a fresh login from the identity provider
*   Your organization's authentication policies (including MFA requirements) apply during re-authentication
*   This provides an additional layer of session control on top of any Conditional Access or session lifetime policies configured in your identity provider
