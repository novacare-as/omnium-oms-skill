# Inbound Email

Source: https://docs.omnium.no/docs/Customer/Cases/cases-inbound-email

> Automatically create cases from incoming customer emails using SendGrid Inbound Parse — setup, email flow, reply tracking, and troubleshooting.

## Overview

Omnium can automatically create **Cases** from incoming customer emails. When a customer sends an email to a designated support address (e.g., `support@incoming.yourcompany.com`), Omnium receives the email via SendGrid's Inbound Parse webhook, identifies the tenant, and creates a new Case with the email content as the first note.

Replies to case notifications are automatically threaded back to the original case as new comments, enabling full email-based conversations between your support team and customers.

## Prerequisites

Before setting up inbound email case creation, ensure:

*   You have **admin access** to your SendGrid account
*   You have **admin access** to Omnium Tenant Settings
*   You have access to your **DNS provider** to create MX records
*   The **Cases module** is enabled for your tenant (requires the "cases" access claim)
*   SendGrid is configured as your email provider in Omnium (Email Client Settings → Type: **Sendgrid**)

* * *

## Part 1: SendGrid Configuration

### Step 1: Set Up MX Records

For SendGrid to receive emails on your behalf, you need to point a subdomain's mail exchange (MX) records to SendGrid.

1.  Log in to your **DNS provider** (e.g., Cloudflare, Azure DNS, GoDaddy)

2.  Create a new **MX record** for the subdomain you want to use for inbound email:

    | Field | Value |
    | --- | --- |
    | Type | MX |
    | Host/Name | `incoming.yourcompany.com` |
    | Value | `mx.sendgrid.net` |
    | Priority | 10 |
    | TTL | 3600 (or default) |

3.  Wait for DNS propagation (can take up to 48 hours, but typically 15–30 minutes)

4.  Verify the MX record is active:

    ```
    nslookup -type=MX incoming.yourcompany.com
    ```

    You should see `mx.sendgrid.net` in the response.

Use a **subdomain** (e.g., `incoming.yourcompany.com`) rather than your root domain. This prevents SendGrid from intercepting all email to your domain.

If you have multiple environments (e.g., dev, test, production), create separate subdomains for each:

*   `incomingdev.yourcompany.com` → Development
*   `incomingtest.yourcompany.com` → Test
*   `incoming.yourcompany.com` → Production

### Step 2: Configure SendGrid Inbound Parse

1.  Log in to [SendGrid](https://app.sendgrid.com)

2.  Navigate to **Settings → Inbound Parse**

3.  Click **Add Host & URL**

4.  Configure the following:

    | Field | Value |
    | --- | --- |
    | Receiving Domain | `incoming.yourcompany.com` (must match your MX record) |
    | Destination URL | `https://api.omnium.no/api/InboundParse/raw` |
    | Spam Check | Unchecked (optional) |
    | Send Raw | **Checked** (required) |

5.  Click **Add**

The Destination URL **must use HTTPS**. Omnium requires HTTPS for all API endpoints. SendGrid does not follow HTTP-to-HTTPS redirects.

**Send Raw** must be checked. The `/raw` endpoint expects the full MIME message in raw format. Without this, the email content will not be parsed correctly.

* * *

## Part 2: Omnium Configuration

### Step 3: Configure Inbound Email Domains

Omnium needs to know which email domains belong to your tenant so it can route incoming emails correctly.

Set the domains in **Configuration → Settings → Communication → Email client**, in the **Inbound email domains** field on the **Sender and replies** card. The field is shown when **Email service** is **SendGrid**.

In the tenant settings, the domains sit next to the addresses:

```json
{
  "EmailClientSettings": {
    "Type": "sendgrid",
    "StandardEmailAddress": "noreply@yourcompany.com",
    "InBoundEmailAddress": "support@incoming.yourcompany.com",
    "InBoundEmailDomains": [
      "incoming.yourcompany.com"
    ]
  }
}
```

Key fields:

| Field | Purpose | Example |
| --- | --- | --- |
| `InBoundEmailAddress` | Reply-to address included in outbound case notifications | `support@incoming.yourcompany.com` |
| `InBoundEmailDomains` | Domains that route inbound emails to this tenant | `["incoming.yourcompany.com"]` |
| `StandardEmailAddress` | Sender address for outbound emails | `noreply@yourcompany.com` |

`InBoundEmailDomains` can also be configured at the **Market** or **Market Group** level if you have different support email addresses per market. Domains configured at the tenant, market, or market-group level all route to the owning tenant — a given domain maps to only one tenant. If the same domain is configured for more than one tenant, the first one encountered wins and a warning is logged for the duplicates.

### Step 4: Configure the Inbound Email Address

The **Reply address for comments** is the reply-to address that Omnium includes in outbound comment emails. This allows customers to reply directly to case notifications.

1.  Navigate to **Configuration → Settings → Communication**
2.  Go to **Email client**
3.  Set the **Reply address for comments** field (e.g., `support@incoming.yourcompany.com`). The field is shown when **Email service** is **SendGrid**
4.  Click **Save**

### Step 5: Enable Cases and Configure Case Settings

1.  Navigate to **Configuration → Settings → Customer**
2.  Go to **Case Settings**
3.  Toggle **Enabled** to on
4.  Configure statuses, priorities, and default values as described in [Configuration](cases-config.md)

### Step 6: Configure Inbound Email From Name (Optional)

You can set the sender name Omnium uses when it forwards an emailed reply to the customer, at the Market or Market Group level. The setting has no field in the UI: set `InBoundEmailFromName` in the `EmailClientSettings` of the market or market group.

*   On a market, the name replaces the name of the person who replied.
*   Without a market name, Omnium keeps the name of the person who replied.
*   On a market group, the name applies only to a reply without a sender name.

See [Email settings on markets and market groups](../../configuration/email-client-settings.md#email-settings-on-markets-and-market-groups).

* * *

## How It Works

### New Case Creation

1.  A customer sends an email to `support@incoming.yourcompany.com`
2.  SendGrid receives the email and POSTs it to the Omnium webhook
3.  Omnium extracts the recipient domain and matches it to your tenant via `InBoundEmailDomains`
4.  A new Case is created:
    *   **Subject** — from the email subject line
    *   **Source** — set to "Email"
    *   **Customer** — matched by sender email (searches Private Customers, then Business Customers)
    *   **Status** — set to the configured **Status New**
    *   **Priority** — set to the configured **Default Priority**
    *   **Related Order** — if the subject or body contains `#12345`, the order is automatically linked
5.  The email body and any attachments are added as the first Case Note

### Reply Tracking

When a case notification email is sent to a customer, Omnium embeds a tracking reference in the email headers. When the customer replies:

1.  Omnium detects the tracking reference in the reply headers
2.  The reply is added as a new comment on the original Case
3.  If the case was **closed**, it is automatically reopened to the **Status Reopen** status

### Customer Matching

When an inbound email arrives, Omnium searches for the sender by email address:

1.  First searches **Private Customers**
2.  Then searches **Business Customers**
3.  If a match is found, the case is linked to that customer
4.  If no match is found, the case is still created but without a customer link

* * *

## Important Notes

*   **HTTPS Required** — The Omnium webhook URL must use HTTPS
*   **Raw Mode Required** — "Send Raw" must be enabled in SendGrid for correct parsing
*   **Domain Caching** — Omnium caches the domain-to-tenant mapping for 5 minutes. Changes to `InBoundEmailDomains` may take up to 5 minutes to take effect
*   **Attachments** — File attachments in inbound emails are automatically uploaded and attached to the Case Note
*   **Inline Images** — Inline images (e.g., from email signatures) are extracted and stored as file attachments
*   **Unassigned Cases** — Cases created from inbound email have no assigned user. Assign cases manually or configure automation rules

* * *

## Troubleshooting

| Issue | Solution |
| --- | --- |
| Emails not arriving at Omnium | Verify MX records: run `nslookup -type=MX incoming.yourcompany.com` |
| "No tenant found for email domain" | Add the domain to `InBoundEmailDomains` in Tenant Settings JSON. Wait up to 5 minutes for cache refresh |
| "No email content to process" | Ensure **Send Raw** is checked in SendGrid Inbound Parse settings |
| Cases not created (no errors) | Verify **Case Settings → Enabled** is on |
| Cases created without customer link | Sender email doesn't match any customer in Omnium |
| Customer replies not threaded | Ensure **Reply address for comments** is configured in Email Client Settings |
| SendGrid shows failed webhook delivery | Verify the URL uses HTTPS (not HTTP) |
| Duplicate domains warning | Same domain configured for multiple tenants — each domain can only map to one tenant |

* * *

## Configuration Checklist

*   **DNS**: MX record for inbound subdomain pointing to `mx.sendgrid.net`
*   **DNS**: MX record propagation verified with `nslookup`
*   **SendGrid**: Inbound Parse entry with correct domain and HTTPS webhook URL
*   **SendGrid**: "Send Raw" / "Post the raw, full MIME message" is checked
*   **Omnium**: `InBoundEmailDomains` configured in Tenant Settings JSON
*   **Omnium**: `InBoundEmailAddress` set in Email Client Settings
*   **Omnium**: Case Settings → **Enabled** is on
*   **Omnium**: At least one status configured with **Status New** set
*   **Omnium**: **Default Priority** is set
*   **Test**: Send a test email and verify a Case is created
