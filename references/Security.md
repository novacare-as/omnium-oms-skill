# Security Overview

Source: https://docs.omnium.no/docs/Security

> How Omnium protects your data — authentication, authorization, tenant isolation, and security best practices.

## Security Architecture

Omnium separates **authentication** (who you are) from **authorization** (what you can do). This separation keeps the security model flexible — you can change your identity provider without affecting your permission structure.

| Layer | Responsibility | Where it happens |
| --- | --- | --- |
| **Authentication** | Verifying identity | Identity provider (Azure AD B2C, Entra ID, Auth0) or API credentials |
| **Authorization** | Granting access to resources | Omnium's internal role engine |
| **Tenant isolation** | Separating customer data | Omnium infrastructure (separate data indices per tenant) |

* * *

## In this section

*   [API Security Best Practices](Security/api-security.md) — Credential lifecycle, permission design, error handling, and go-live checklist
*   [Authentication — UI](Security/authentication-roles.md) — Set up SSO with Entra ID, Auth0, or Azure AD B2C for the Omnium backoffice
*   [SCIM 2.0 Provisioning](Security/scim.md) — Automatic user and role synchronization from your identity provider

* * *

## For API Developers

If you are building an integration against the Omnium API, start here:

*   **[API Developer Guide](GettingStartedWithAPI/api-developer-guide.md)** — Authentication flow, token management, roles, and code examples
*   **[API Security Best Practices](Security/api-security.md)** — Credential lifecycle, permission design, error handling, and a go-live checklist
*   **[Rate Limits](Environments/rate-limits.md)** — Concurrency and token bucket limits

* * *

## For Administrators

If you manage users, roles, and identity providers in the Omnium UI:

*   **[UI Authentication](Security/authentication-roles.md)** — Set up SSO with Entra ID, Auth0, or Azure AD B2C
*   **[SCIM 2.0 Provisioning](Security/scim.md)** — Automatic user and role synchronization from your identity provider
*   **[Access Rights and Invitations](access.md)** — Invite users and configure their access

* * *

## How Roles Work

Omnium uses **role-based access control (RBAC)** for both the API and the admin UI. Roles are assigned to users and determine which resources and actions they can access.

### API Roles

API users authenticate with a client ID and secret, and receive a JWT token containing their roles. There are three access levels, plus resource-specific roles:

| Level | Purpose |
| --- | --- |
| **ApiOwner** | Full API access (equivalent to Admin) |
| **CommerceUser** | Headless commerce endpoints (carts, products, customers) |
| **ApiUser** | Base access level — required for authentication |

Each resource domain (orders, products, customers, etc.) also has **Read** and **Admin** roles. See the [full role reference](GettingStartedWithAPI/api-developer-guide.md#resource-specific-roles) for details.

### UI Roles

UI users are organized into **role groups** that combine functional permissions with store and market access. Roles can contain other roles, allowing you to build a hierarchy that reflects your organization.

Role properties:

*   **Functional permissions** — What the user can see and do (e.g., view orders, manage products)
*   **Store access** — Which stores the user can work with (`AllStores` or specific stores)
*   **Market access** — Which markets the user can work with (`AllMarkets` or specific markets)

For detailed role configuration, see [Roles, access rights, and users](https://help.omnium.no/hc/en-us/articles/22603831968017-Roles-access-rights-and-users).

* * *

## Tenant Isolation

Omnium is a multi-tenant platform where each customer's data is completely separated at the infrastructure level:

*   **Data separation** — Each tenant's data is stored in its own search index. There is no shared data layer and no need for row-level tenant filtering.
*   **Token scoping** — Every JWT token contains a tenant claim. All API requests are automatically scoped to the tenant associated with the token.
*   **Cross-tenant protection** — An API user belonging to one tenant cannot access another tenant's data, even if they somehow obtain a valid token from another tenant. The system validates that the user's tenant matches the token's tenant on every request.
*   **Cache isolation** — Cached data is automatically keyed by tenant, so tenants never see each other's cached results.

* * *

## Encryption and Data Protection

| What | How |
| --- | --- |
| **API credentials** | Client secrets are encrypted at rest using AES-256 |
| **Data in transit** | All communication uses HTTPS/TLS |
| **SCIM tokens** | Stored as one-way SHA-512 hashes (plaintext is never stored) |
| **User passwords** | Managed by the identity provider (Azure AD B2C, Entra ID, or Auth0) — Omnium never stores passwords |

* * *

## Webhook Security

When Omnium sends data to your systems via webhooks, you can secure the connection using any of these methods:

| Method | Description |
| --- | --- |
| **Bearer Token** | Include a static token in the `Authorization` header (recommended) |
| **Basic Authentication** | Send a username and password via HTTP Basic Auth |
| **Custom Headers** | Add arbitrary headers (e.g., an API key) to every webhook request |

Webhook authentication is configured per connector in **Configuration > Connectors**. See the [Connectors guide](Integrations/connectors.md) for setup details.

Webhooks are **outbound only** — Omnium sends HTTP POST requests to your endpoint. Your endpoint should validate the authentication header before processing the payload.

* * *

## Security Checklist

Use this checklist when preparing an integration or environment for production.

### API Integrations

*   [ ]  Each integration uses its own dedicated API user (never share credentials between systems)
*   [ ]  Each API user has only the roles it needs (principle of least privilege)
*   [ ]  API users are scoped to specific stores and markets where possible
*   [ ]  Client secrets are stored in a secrets manager or vault — not in source code or config files
*   [ ]  Your integration handles `401 Unauthorized` by requesting a new token (not by retrying with the expired one)
*   [ ]  Your integration handles `429 Too Many Requests` with exponential backoff
*   [ ]  Test and production environments use separate API users with separate credentials

### User Management

*   [ ]  SSO is configured with your identity provider (Entra ID, Auth0, or Azure AD B2C)
*   [ ]  SCIM provisioning is enabled if you have more than a handful of users
*   [ ]  Forced sign-in frequency is enabled for sensitive areas (e.g., authorization settings)
*   [ ]  Departing employees are removed from the identity provider (SCIM handles the rest)
*   [ ]  Role groups follow least privilege — users should only access the stores and markets they work with

### Webhooks and Connectors

*   [ ]  All webhook endpoints use HTTPS
*   [ ]  Webhook endpoints validate the authentication header before processing
*   [ ]  Webhook endpoints are idempotent (safe to receive the same event more than once)
*   [ ]  Connector credentials are reviewed periodically and rotated when team members change
