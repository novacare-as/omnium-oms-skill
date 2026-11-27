# Email Client Settings

Source: https://docs.omnium.no/docs/configuration/email-client-settings

> Configure how Omnium sends email, through SendGrid, an SMTP server or Microsoft 365 with the Microsoft Graph API.

## Overview

Email client settings control how Omnium sends email: order confirmations, notifications, comment emails and other transactional mail. You choose one email service for the tenant and enter its connection details. You also set the default sender address, how replies to comment emails come back, and some content options.

The configuration is located under:

**Configuration → Settings → Communication → Email client**

Changing these settings requires an administrator.

## Email services

The **Email service** field selects the service Omnium sends email through. When it is empty, Omnium sends no email.

| Email service | Value | Description |
| --- | --- | --- |
| SendGrid | `sendgrid` | Sends through SendGrid with an API key. Also supports newsletters and replies to comment emails through SendGrid Inbound Parse. See [SendGrid](../plugins/Other/Sendgrid.md) |
| SMTP | `smtp` | Sends through an SMTP mail server |
| Microsoft 365 (Graph API) | `graph` | Sends through Microsoft 365 (Exchange Online) with the Microsoft Graph API and OAuth 2.0, from one mailbox in your Microsoft 365 tenant. See [Send email through Microsoft 365](email-client-settings.md#send-email-through-microsoft-365) |

The email service and its connection details apply to the whole tenant. Emails for every market and market group go through the same service. See [Email settings on markets and market groups](email-client-settings.md#email-settings-on-markets-and-market-groups).

## Compare the email services

All three services send notifications, comment emails and other single emails with attachments. They differ in these ways:

| Feature | SendGrid | SMTP | Microsoft 365 (Graph API) |
| --- | --- | --- | --- |
| Newsletters | Yes | No. Sending the newsletter fails | No. Each newsletter batch gives an **Error sending email** event |
| Newsletter statistics, such as opens and clicks | Yes | No | No |
| Reply-to address | Yes | No. Replies go to the sender address | Yes |
| PNG, JPEG and GIF images embedded in an `<img>` tag as base64 | Sent as inline attachments, except in newsletters | Left in the HTML. Many email clients do not show them | Sent as inline attachments |
| An email that is not sent | **Error sending email** event with SendGrid's answer | **Error sending email** event with the mail server's error | **Error sending email** event with the cause, and Microsoft's request ID when Microsoft answered |

The reply-to address matters for comment emails: with SMTP, a customer's reply goes to the sender address and does not come back as a comment.

## Email service settings

The fields on the **Email service** card depend on the email service you select.

### SendGrid

| Field | Description |
| --- | --- |
| SendGrid API key | The name of the configuration entry that holds the SendGrid API key, or the key itself |
| Server address | Empty means `https://api.sendgrid.com`. Use `https://api.eu.sendgrid.com` for an EU API key |

*   When **SendGrid API key** is empty, Omnium sends no email, and the event log shows no error.
*   Omnium ignores a server address that does not contain `sendgrid` and uses `https://api.sendgrid.com`. Clear the field when you switch from SMTP to SendGrid.
*   Omnium does not send an email without a subject through SendGrid.

### SMTP

| Field | Description |
| --- | --- |
| Server address | The mail server |
| Port | The mail server's port, usually `587`. Required |
| Username | The login on the mail server. Leave it empty when the server accepts mail from Omnium without a login |
| Password | The password for the login |

Omnium sends no email through SMTP until both the server address and the port are set. It always connects with TLS through STARTTLS, so a server that only offers implicit TLS on port `465` does not work.

When the mail server does not accept an email, Omnium does not try again. It logs an **Error sending email** event with the server's error. SMTP sends no reply-to address and no newsletters, see [Compare the email services](email-client-settings.md#compare-the-email-services).

Microsoft disables SMTP AUTH with Basic authentication (username and password) by default for existing Microsoft 365 tenants at the end of December 2026, and it is unavailable by default for tenants created after that. If you send through Microsoft 365, use [Microsoft 365 (Graph API)](email-client-settings.md#send-email-through-microsoft-365) instead.

### Microsoft 365 (Graph API)

| Field | Description |
| --- | --- |
| Directory (tenant) ID | The directory (tenant) ID or a verified domain of the Microsoft Entra ID the email app is registered in, for example `contoso.onmicrosoft.com` |
| Application (client) ID | The application (client) ID of the app registration in Microsoft Entra ID that may send mail |
| Client secret | The value of the app's client secret. Email stops when the secret expires, so renew it in time |
| Sender mailbox | The Exchange Online mailbox every email is sent from, for example `webshop@contoso.com` |
| Save a copy in Sent Items | Keeps every email Omnium sends in the Sent Items folder of the sender mailbox. Off by default |

The **Send test email** button sends a test email to you with the values in the form, also before you save them. See [Test the setup](email-client-settings.md#test-the-setup).

## Send email through Microsoft 365

With the **Microsoft 365 (Graph API)** email service, Omnium sends each email with the Microsoft Graph `sendMail` API. Omnium signs in as your own app registration in Microsoft Entra ID with the OAuth 2.0 client credentials flow (app-only access), so no username or password is used. The email leaves from Exchange Online, as it does with SMTP through Microsoft 365, so your SPF and DKIM setup does not change.

Your Microsoft 365 administrator sets up the app once. Then you enter its details in Omnium.

### Register the app in Microsoft Entra ID

1.  In the Microsoft Entra admin center, register a new application for your own tenant only (single tenant).
2.  Note the **Directory (tenant) ID** and the **Application (client) ID**.
3.  Create a client secret. Note its value and when it expires. Microsoft Entra ID allows a lifetime of at most 24 months.

### Give the app permission to send

The app needs the Microsoft Graph application permission `Mail.Send`. You can give it in two ways:

*   **Limited to the sender mailbox (recommended).** Use RBAC for Applications in Exchange Online. The app can then only send as the mailboxes in the scope you set.
*   **For all mailboxes.** Grant the `Mail.Send` application permission in Microsoft Entra ID with admin consent. The app can then send as any mailbox in your tenant.

To limit the permission to one mailbox, connect to Exchange Online PowerShell and run these commands. The object ID is the one on the app's **Enterprise applications** page, not on the **App registrations** page.

```
New-ServicePrincipal -AppId <application-client-id> -ObjectId <enterprise-app-object-id> -DisplayName "Omnium mail"
New-ManagementScope -Name "Omnium sender" -RecipientRestrictionFilter "PrimarySmtpAddress -eq 'webshop@contoso.com'"
New-ManagementRoleAssignment -App <enterprise-app-object-id> -Role "Application Mail.Send" -CustomResourceScope "Omnium sender"
```

Check the result with `Test-ServicePrincipalAuthorization -Identity <enterprise-app-object-id> -Resource webshop@contoso.com`. It shows `InScope` as `True` for the sender mailbox.

When you use RBAC for Applications, do not also grant `Mail.Send` in Microsoft Entra ID. The two grants add up, so the Entra ID grant would let the app send as every mailbox again. A permission change can take from 30 minutes to 2 hours to apply.

For details, see Microsoft's documentation on [RBAC for Applications in Exchange Online](https://learn.microsoft.com/en-us/exchange/permissions-exo/application-rbac).

### Configure Omnium

1.  Go to **Configuration → Settings → Communication → Email client**.
2.  Set **Email service** to **Microsoft 365 (Graph API)**.
3.  Enter the **Directory (tenant) ID**, the **Application (client) ID**, the **Client secret** and the **Sender mailbox**.
4.  Turn on **Save a copy in Sent Items** if you want a copy of every email in the sender mailbox.
5.  Press **Send test email**, and save when the test email arrives.

### Test the setup

**Send test email** sends an email to the email address of your Omnium user, through Microsoft Graph, with the values in the form. When the test fails, the message tells you why, for example:

| Message says | What to check |
| --- | --- |
| Microsoft Entra ID gave no access token | The directory ID, the client ID and the client secret. The secret may have expired |
| The Entra app may not send as `<sender mailbox>` | The `Mail.Send` permission for the sender mailbox. A change can take up to 2 hours |
| The mailbox `<sender mailbox>` was not found in Exchange Online | The sender mailbox address |

### How Omnium sends through Microsoft 365

*   **Sender.** Every email is sent from the sender mailbox. When an email has another sender address, for example a store's address in a notification template, and no reply-to address of its own, that sender address becomes the reply-to address, so replies still reach it.
*   **Size.** Microsoft Graph accepts at most 4 MB in one request, and attachments grow by about a third when they are sent. An email can carry about 3 MB of attachments. Omnium does not send an email that is larger, and logs an error event that gives its size.
*   **Throttling.** Exchange Online allows each mailbox to send 30 messages a minute and to 10,000 recipients a day. When Microsoft throttles the mailbox, Omnium waits as long as Microsoft asks and tries again, with at most 3 tries and 60 seconds of waiting in all. When Microsoft asks for a longer wait, Omnium does not send the email and logs an error event. See Microsoft's [Exchange Online limits](https://learn.microsoft.com/en-us/office365/servicedescriptions/exchange-online-service-description/exchange-online-limits).
*   **Timeouts.** When Microsoft Graph does not answer in time, Omnium does not send the email again, because Microsoft may already have sent it.
*   **Errors.** An email that is not sent gives an error event, **Error sending email**, in the event log. The event says what went wrong. When Microsoft answered, it also includes Microsoft's request ID, which Microsoft support asks for.
*   **Newsletters.** Exchange Online is not made for bulk email, so newsletters cannot be sent through Microsoft 365. Use SendGrid for newsletters.

## Sender and replies

| Field | Description |
| --- | --- |
| Sender address | The address emails are sent from when the market has none. The default email address in General settings comes first when it is set |
| Reply address for comments | Comment emails get this reply-to address, so the customer's reply comes back as a comment on the order, cart or case. A market or market group can have its own. Shown for SendGrid |
| Inbound email domains | Emails received for these domains are routed to this tenant when they carry no reference to an existing comment. Shown for SendGrid |
| Language of the reply line | The language of the line "Please type your reply above this line" in comment emails, for example `nb` or `en`. Empty means `en` |

## Email content

| Field | Description |
| --- | --- |
| Show product ID instead of SKU | Order lines in emails show the product ID under the name instead of the SKU |
| Fallback email template | The template file used when neither the market nor the default templates have a default email template |
| Template storage folder | The storage folder email templates and fonts are kept in. Empty means `emailtemplate`. Change it only together with moving the files |

## Email settings on markets and market groups

A market or a market group has no email service of its own. It can have its own values for some email fields, in the `EmailClientSettings` of the market or market group. On a market, only the sender address has a field, **Default e-mail address** on the market's **E-mail** card. The other fields are set in the market's or market group's settings.

| Field | Market | Market group | Description |
| --- | --- | --- | --- |
| StandardEmailAddress | Yes | No | The sender address for the market's emails. Without it, the default email address in General settings is used, then **Sender address** |
| InBoundEmailAddress | Yes | Yes | The reply address for comments. Omnium uses the market's address first, then the market group's, then the tenant's |
| InBoundEmailFromName | Yes | Yes | The sender name when Omnium forwards an emailed reply to the customer. A market's name replaces the name of the person who replied. Without it, Omnium keeps the name of the person who replied. A market group's name applies only to a reply without a sender name |
| InBoundEmailDomains | Yes | Yes | More domains routed to this tenant, as for **Inbound email domains** |
| EmailTemplateContentFile | Yes | No | The market's fallback email template, used when the market, its market group and the tenant have no default email template |
| EmailTemplateContainer | Yes | Yes | A storage folder for templates. Omnium reads a market's folder only for `.txt` template files and a market group's folder only for comment emails, so keep the templates in the tenant's **Template storage folder** |

The other fields, such as the email service, its connection details, **Language of the reply line** and **Show product ID instead of SKU**, are read only from the tenant. A value on a market or market group has no effect.

## Related documentation

*   [SendGrid](../plugins/Other/Sendgrid.md)
*   [Inbound email for cases](../Customer/Cases/cases-inbound-email.md)
*   [Markets configuration](../Markets/markets-config.md#email-client-settings)
*   [SMS Client Settings](sms-client-settings.md)
