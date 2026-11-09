# API Security Best Practices

Source: https://docs.omnium.no/docs/Security/api-security

> How to securely manage API credentials, design permissions, handle errors, and prepare for production.

## Overview

This guide covers the security side of building an API integration with Omnium. For the mechanics of authentication (token endpoints, code examples, request patterns), see the [API Developer Guide](../GettingStartedWithAPI/api-developer-guide.md).

* * *

## Credential Lifecycle

### Creating API Users

API credentials are created in the Omnium UI under **Configuration > Authorization > API Users**. Each API user receives a `ClientId` and `ClientSecret` pair.

Key points:

*   The `ClientSecret` is shown **only once** at creation time. Omnium stores it encrypted — there is no way to retrieve it later.
*   If a secret is lost, create a new API user and deactivate the old one.
*   Give each API user a **descriptive name** that identifies the system or integration it belongs to (e.g., `"Shopify Sync"`, `"ERP Order Export"`, `"Mobile App"`).

### One Integration, One API User

Every integration should have its own dedicated API user. This provides:

*   **Auditability** — API calls can be traced to a specific system
*   **Granular control** — Each integration gets only the roles it needs
*   **Safe rotation** — Deactivating one user doesn't break other integrations
*   **Independent rate limits** — Each API user has its own rate limit budget

Never share credentials between integrations. If your ERP and e-commerce platform both use the same API user, deactivating it will break both systems simultaneously.

### Storing Secrets

| Do | Don't |
| --- | --- |
| Store secrets in a vault or secrets manager (Azure Key Vault, AWS Secrets Manager, HashiCorp Vault) | Hard-code secrets in source code |
| Use environment variables or secure configuration for local development | Commit secrets to version control |
| Encrypt secrets at rest in your infrastructure | Store secrets in plain-text config files |
| Restrict access to secrets to the team members who need them | Share secrets via email or chat |

### Deactivating API Users

When an integration is retired or compromised:

1.  Navigate to **Configuration > Authorization > API Users**
2.  Locate the API user and deactivate it

Deactivated users are rejected immediately — any token issued to that user will stop working on the next API call, even if the token has not yet expired.

* * *

## Designing Permissions

### Principle of Least Privilege

Assign only the roles each integration actually needs. Common patterns:

| Integration type | Typical roles |
| --- | --- |
| E-commerce frontend (headless) | `CommerceUser` (includes cart, product, and customer access) |
| ERP order sync | `OrderRead` + `InventoryAdmin` |
| Product information management | `ProductAdmin` |
| Reporting / analytics | `OrderRead` + `ProductRead` + `CustomerRead` |
| Full administration | `ApiOwner` (use sparingly) |

### Store and Market Scoping

By default, an API user can see data across all stores and markets. To restrict access:

*   Assign the specific stores the user needs (e.g., `store-oslo-downtown`, `store-bergen-mall`)
*   Assign the specific markets (e.g., `market-nor`, `market-swe`)

If the user should access everything, assign `AllStores` and `AllMarkets`.

Store and market scoping is particularly useful for integrations that should only see data from specific locations — for example, a warehouse system that only needs orders destined for its warehouse.

### Role Inheritance

Roles follow a hierarchy. Higher-level roles automatically include the permissions of lower-level roles:

*   `ApiOwner` includes everything
*   `CommerceUser` includes `ApiUser`
*   Resource Admin roles (e.g., `OrderAdmin`) include the corresponding Read role (`OrderRead`)

You never need to assign both `OrderAdmin` and `OrderRead` to the same user — `OrderAdmin` already includes read access.

* * *

## Token Management

### Lifecycle

1.  Your integration calls `POST /api/token` with the client ID and secret
2.  Omnium returns a JWT valid for **10 days**
3.  Your integration includes the token in the `Authorization: Bearer {token}` header on every request
4.  When the token approaches expiry, request a new one

### Best Practices

**Cache and reuse tokens.** A token is valid for 10 days. Request a new one only when the current one is close to expiring or has been rejected with `401 Unauthorized`.

**Check expiry proactively.** Decode the JWT and read the `exp` claim to know when it expires, or track the `expiresIn` value from the token response. Request a new token before the old one expires to avoid service interruptions.

**Handle 401 gracefully.** If a request returns `401`, your token has expired or the API user has been deactivated. Request a new token and retry the original request once. If the second attempt also returns `401`, the credentials themselves may be invalid — log the error and alert your team instead of retrying in a loop.

**Never expose tokens.** Tokens carry the same access as the credentials that created them. Do not log full tokens, include them in URLs, or send them to client-side code.

* * *

## Handling Security Errors

| Status Code | Meaning | What to Do |
| --- | --- | --- |
| `401 Unauthorized` | Token is missing, expired, or the API user is deactivated | Request a new token. If that also fails, check that the API user is still active. |
| `403 Forbidden` | The API user does not have the required role for this endpoint | Check which roles the endpoint requires (see Swagger documentation) and update the API user's roles. |
| `429 Too Many Requests` | Rate limit exceeded | Back off and retry with exponential backoff and jitter. Consider reducing parallelism. See [Rate Limits](../Environments/rate-limits.md). |

A `403` means the credentials are valid but the user lacks permission. This is a configuration issue, not a runtime error — fix it by adjusting the API user's roles, not by retrying.

* * *

## Multi-Tenant Considerations

If you manage integrations across multiple Omnium tenants (for example, you are an agency or system integrator working with several brands):

*   **Separate credentials per tenant.** Each tenant has its own API users. A token from one tenant cannot access another tenant's data.
*   **Separate token caching per tenant.** If your integration serves multiple tenants, make sure token storage is keyed by tenant to prevent accidentally using the wrong token.
*   **Environment awareness.** Test and production are separate environments with separate data. API users created in test do not exist in production and vice versa.

* * *

## Securing Your Webhook Endpoints

When Omnium sends webhook requests to your systems, your endpoints are responsible for validating the incoming request.

### Validate Authentication

Configure a **Bearer token** or **API key header** on the connector in Omnium, then validate it on your end:

```json
[HttpPost("omnium-webhook")]
public IActionResult HandleWebhook([FromHeader(Name = "Authorization")] string auth)
{
    if (auth != "Bearer YOUR_EXPECTED_TOKEN")
        return Unauthorized();

    // Process the webhook payload
    // ...
    return Ok();
}
```

### Design for Idempotency

Omnium may retry webhook deliveries if your endpoint does not respond with a success status. Ensure your endpoint can safely receive the same event more than once without duplicating actions.

Common approaches:

*   Track processed event IDs and skip duplicates
*   Use the order ID and status as a natural deduplication key
*   Design operations to be naturally idempotent (e.g., "set status to X" rather than "increment counter")

### Respond Quickly

Webhook requests have a timeout. If your processing takes a long time, accept the request immediately (return `200 OK`) and process it asynchronously.

* * *

## Go-Live Security Checklist

Before moving an integration to production, verify:

### Credentials

*   [ ]  Production API user created with a descriptive name
*   [ ]  Client secret stored in a vault or secrets manager
*   [ ]  Test credentials are **not** used in production
*   [ ]  Only the required roles are assigned (no `ApiOwner` unless genuinely needed)
*   [ ]  Store and market scoping is applied where appropriate

### Token Handling

*   [ ]  Token is cached and reused (not requested on every API call)
*   [ ]  Token expiry is tracked and renewal happens proactively
*   [ ]  `401` responses trigger token renewal, not infinite retries
*   [ ]  Tokens are not logged, exposed in URLs, or sent to browsers

### Error Handling

*   [ ]  `429 Too Many Requests` is handled with exponential backoff
*   [ ]  `403 Forbidden` is logged as a configuration issue and not retried
*   [ ]  Network errors and timeouts are retried with reasonable limits

### Webhooks (if applicable)

*   [ ]  Endpoint uses HTTPS
*   [ ]  Endpoint validates the authentication header
*   [ ]  Endpoint is idempotent
*   [ ]  Endpoint responds within the configured timeout
