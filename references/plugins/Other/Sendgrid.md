# Sendgrid

Source: https://docs.omnium.no/docs/plugins/Other/Sendgrid

> Guide for setting up the Omnium Sendgrid plugin.

## SendGrid integration

### Settings in Omnium

1.  Go to **Configuration -> Settings -> Communication -> Email client**.
2.  Set **Email service** to **SendGrid**.
3.  Add the API key to the **SendGrid API key** field.
4.  For an EU API key, set **Server address** to `https://api.eu.sendgrid.com`.

See [Email Client Settings](../../configuration/email-client-settings.md) for all fields and for what SendGrid supports compared with SMTP and Microsoft 365.

### Inbound Parsing

To handle incoming e-mails for adding replies to carts, orders, projects, etc., follow SendGrid's documentation: [SendGrid Inbound Parse Documentation](https://sendgrid.com/docs/for-developers/parsing-email/setting-up-the-inbound-parse-webhook/)

### Set up MX Records

1.  Navigate to the MX Records page on your hosting provider’s website. If you're unsure who your hosting or DNS provider is, contact your website administrator.
2.  Create a new MX record for the subdomain (e.g., `parse.yourdomain.com`) you want to process incoming email. This hostname should be used exclusively for parsing incoming emails.
3.  Assign the MX record a priority of **10** and point it to **mx.sendgrid.net**.

### Inbound Settings in SendGrid

_**NB!** It is recommended to use the **POST the raw, full MIME message** option as this is more robust with respect to different email formats. See the section "Using Raw-format with SendGrid" for details. The below example relies on the automatic parsing done by sendgrid._

1.  Go to **Settings -> Inbound Parse**.
2.  Click **"Add host & URL"**.
3.  Add your subdomain (same as MX record, e.g., "incoming").
4.  Add your **Domain** (verified domain).
5.  Set the Destination URL based on your environment:

| Environment | Destination URL in SendGrid |
| --- | --- |
| Test | [https://apitest.omnium.no/api/InboundParse](https://apitest.omnium.no/api/InboundParse) |
| Prod | [https://api.omnium.no/api/InboundParse](https://api.omnium.no/api/InboundParse) |

6.  **Optional**: Check **"Check incoming emails for spam"**.
7.  Do not check "POST the raw, full MIME message".

### Inbound Settings in Omnium

1.  Go to **Configuration -> Settings -> Communication -> Email client**.
2.  Add the new inbound e-mail address to **Reply address for comments**.

### Using Raw-format with SendGrid

Due to varying formats across different email providers, formatting issues may sometimes occur when using the standard model received from SendGrid. A way to overcome this issue is leveraging the SendGrid option **"POST the raw, full MIME message"** when setting up the inbound parse hook. This better preserves the formatting information related to the email.

### Steps to Use the Raw Option:

1.  Go to **Settings** -> **Inbound Parse**
2.  Click **"Add host & URL"**
3.  Add **subdomain** (same as MX record, e.g., "incoming")
4.  **Domain**: Add your verified domain
5.  **Destination URL**: `https://api.omnium.no/api/InboundParse/Raw`
6.  Optional: **Check incoming emails for spam**
7.  Check the option **"POST the raw, full MIME message"**

### Inbound Settings in Omnium:

1.  Go to **Configuration** -> **Settings** -> **Communication** -> **Email client**
2.  Add the new inbound email address to **Reply address for comments**
