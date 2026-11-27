# LINK Mobility

Source: https://docs.omnium.no/docs/plugins/Other/LinkMobility

> Send SMS through LINK Mobility and let customers reply by SMS, with each order, return or case conversation on its own number from a subnumber range.

## Overview

With the LINK Mobility integration, Omnium sends SMS notifications and SMS notes through LINK Mobility. You can also turn on two-way SMS: customers then answer the SMS they receive, and each reply is added as a note to the order, case or other object the SMS was about. A reply about a return is added to its order.

With a subnumber range from LINK Mobility, every conversation is sent from a number of its own, so a customer with several open orders, returns or cases can answer each of them and the reply still lands in the right place.

## Get a LINK Mobility account

To get started, you must first set up an agreement with LINK Mobility.

1.  **Contact LINK Mobility** to obtain a license and establish the agreement.
2.  Once the agreement is in place, **LINK Mobility will reach out to Omnium** to configure the integration in your system.

LINK Mobility gives you an account letter with the API address, username, password, platform id and platform partner id.

For two-way SMS you also need one of these from LINK Mobility:

*   a **reply number**: a short code or a long number that customers can reply to, for keyword routing; or
*   a **subnumber range** and the **gate id** it is attached to, for subnumber routing.

## Add LINK Mobility as an SMS provider

SMS providers are configured under:

**Configuration → Settings → Communication → SMS client**

Click **Add** and select **LINK Mobility** as the provider. See [SMS Client Settings](../../configuration/sms-client-settings.md) for how to choose which stores, markets and market groups a provider is used for.

| Field | Description |
| --- | --- |
| Username | The username from the LINK Mobility account letter |
| Password or API key | The password from the LINK Mobility account letter |
| API address | The send URL from the account letter, for example `https://n-eu.linkmobility.io/sms`. Enter it as it ends in `/sms` |
| Sender | The name or number SMS are sent from when replies are off. Empty means the default SMS sender in General settings |
| Platform id | From the account letter. Normally `SMS` |
| Platform partner id | From the account letter |
| Use basic authentication | Off by default, which uses OAuth 2.0, the method LINK Mobility recommends |
| Failover URL | Tried once when the API address cannot be reached or returns a server error. Optional |

### Sender names and numbers

When replies are off, the **Sender** is sent as follows:

*   A number that starts with `+` or `00` is sent as a phone number.
*   A sender of digits only is sent as a short code.
*   Any other sender is sent as a name. Only the letters a-z and A-Z and digits are kept, leading digits are removed, and the name is cut to 11 characters. For example, `4Seasons Oslo` is sent as `SeasonsOslo`.

When replies are on, every SMS is sent from the reply number or a number in the range instead, because a handset cannot reply to a name.

### Phone numbers and errors

LINK Mobility only accepts recipients in international format. Omnium adds the country code to a national number. It takes the country from the market of the SMS. When the SMS has no market, it uses the provider's market if the provider is used for exactly one market, and otherwise the default market.

When LINK Mobility rejects an SMS, or it cannot be sent, Omnium writes an **Error sending SMS** entry to the event log, with the result code and response from LINK Mobility.

## Let customers reply by SMS

Turn on **Allow replies** on the LINK Mobility provider. The reply settings then appear below it.

**Reply routing** decides how LINK Mobility gets replies to Omnium:

| Reply routing | When to use it | What Omnium does |
| --- | --- | --- |
| Keyword | You have a short code or long number, with or without a keyword | Registers the reply endpoint and the keyword with LINK Mobility |
| Subnumber | LINK Mobility has assigned a subnumber range and created a gate for it | Points the gate LINK Mobility created at Omnium. Only LINK Mobility can attach a gate to a range |

### Reply settings

| Field | Description |
| --- | --- |
| Reply number | The number customers reply to. With subnumber routing, the short code followed by the subnumber. With a number range, the first number of the range |
| Last number in range | Subnumber routing only. The last number of the range LINK Mobility assigned. Leave it empty to send everything from the reply number |
| Keyword matching | Keyword routing only. `DEFAULT`, `EQUALS`, `STARTS_WITH` or `FIRST_WORD`, see below |
| Keyword | Keyword routing only. Not used with `DEFAULT` |
| Reply endpoint id | Subnumber routing only. The gate id LINK Mobility sent you with the number range |
| Gate API URL | Used to set up replies with LINK Mobility. Usually the send URL with `/gate` instead of `/sms` |
| Callback user name | LINK Mobility presents this, with the callback password, when it delivers a reply to Omnium. Pick values used nowhere else |
| Callback password | See callback user name |
| Reply window (days) | How long a reply still counts as part of the same conversation. Defaults to 30 days |

### Keyword matching

| Keyword matching | Which replies reach Omnium | Text added to the note |
| --- | --- | --- |
| `DEFAULT` | Every reply to the reply number. The simplest choice for a dedicated number | The whole reply |
| `EQUALS` | Replies that are exactly the keyword | The whole reply |
| `STARTS_WITH` | Replies that start with the keyword | The reply without the keyword |
| `FIRST_WORD` | Replies whose first word is the keyword | The reply without the keyword |

### Set up replies

1.  Fill in the reply settings and **save** the settings. Setup reads the saved settings, so anything not saved yet is not used.
2.  Click **Set up replies**. You need an administrator role.
3.  With keyword routing, Omnium registers the reply endpoint and the keyword with LINK Mobility. The ids LINK Mobility returns are shown under **Registered with LINK Mobility**.
4.  With subnumber routing, Omnium points the gate LINK Mobility created at itself. The whole range is attached to that gate, so there is nothing to set up for each number.

When setup succeeds, the screen shows that customers can now answer messages from the number, or from every number in the range.

## Subnumber ranges

A subnumber range is a block of consecutive numbers LINK Mobility assigns to you, for example `27222001010000` to `27222001010999`. Each number is the short code `27222` followed by a subnumber.

Enter the first number of the range as the **Reply number** and the last as **Last number in range**. Below the field, Omnium shows how many numbers the range has: 1 for messages outside a conversation and the rest for conversations. A range of 1,000 numbers gives 999 numbers for conversations.

Saving fails when the two numbers do not make a range: both must have the same number of digits, and the last number must be higher than the reply number. A last number with keyword routing has no effect, and saving gives a warning.

Ask LINK Mobility for a separate range for each Omnium tenant, and do not share a range between tenants. The range tells Omnium which tenant a reply belongs to, and each tenant hands out its own numbers. A range does not need to be large: a number only has to be unique among one customer's open conversations, and numbers are reused automatically.

## How replies find their conversation

### One number per conversation

A conversation is one customer phone number and one object: an order, a return, a case, a cart, a purchase order, a project, a private or business customer, or a campaign. With a subnumber range:

*   The first SMS about an object is sent from a number the customer has no other open conversation on.
*   Later SMS about the same object to the same customer are sent from the same number, however long ago the last one was, unless the number has since gone to another of the customer's conversations.
*   An internal note, a public note and the replies about one order are one conversation on one number.
*   Different customers can get the same number. LINK Mobility tells conversations apart by the pair of the customer's number and Omnium's number.
*   When an SMS has several recipients, each recipient gets a conversation of their own.
*   Omnium spreads new conversations over the whole range, so a customer gets a number back only after the range has gone round.
*   If a customer has an open conversation on every number in the range, the conversation that has been idle longest gives up its number.

Example: Kari has case `1042` and return `RMA-55` open. The SMS about the case is sent from `27222001010042` and the SMS about the return from `27222001010317`. Kari answers the case SMS, and the reply is added to case `1042`, even though the return SMS was sent later.

### Which SMS start a conversation

Notes sent by SMS start or continue a conversation, whether you add them in the Omnium UI or through the API. That covers notes on orders, returns, cases, carts, purchase orders, projects, private and business customers, and campaigns. A note written on the return page belongs to the return, and gets a number apart from its order.

These SMS are sent from the reply number and do not start a conversation:

*   automated notifications, such as order, return and project notifications;
*   SMS to a customer segment;
*   delivery notes;
*   SMS sent through the API that are not notes;
*   test SMS sent from a notification template.

A reply to the reply number is added to the conversation the customer last had on that number, if there is one and it is inside the reply window. Otherwise it is handled as a new message.

### A single reply number

Without a range, every SMS is sent from the reply number, and Omnium keeps one conversation per customer. The latest note sent to the customer by SMS decides where the next reply goes. Automated notifications do not take the conversation over.

### Reply window

The reply window counts from the last message in the conversation, in either direction, so a customer who keeps answering keeps the conversation open. A reply that arrives after the window has closed is handled as a new message. The default is 30 days.

## Where a reply lands

A reply is added as a note on the object the conversation is about, with SMS as the delivery method. Where the object has both public and internal notes, the reply goes on the same thread as the latest SMS Omnium sent in the conversation.

*   A reply about a **return** is added to the order's notes, because a return has no notes of its own. The note gets the title `RMA` followed by the RMA number, so you can see which return it answers.
*   A reply that LINK Mobility delivers twice is added once.

### Replies that match no conversation

A reply that matches no open conversation is handled as a new message, in this order:

1.  When [Cases](../../Customer/Cases/cases-overview.md) are enabled, Omnium creates a case with the reply as its first note. The first 60 characters of the reply become the case subject, and the case is linked to the customer whose phone number matches. The customer's next SMS to the same number, and SMS you send about the case, continue on that number.
2.  Otherwise, when the phone number matches a private or business customer, the reply is added as a note on the customer.
3.  Otherwise, Omnium records the reply as an unmatched inbound SMS.

## Related pages

*   [SMS Client Settings](../../configuration/sms-client-settings.md)
*   [Order comments](../../Order/order-logging/order-comments.md)
*   [Cases overview](../../Customer/Cases/cases-overview.md)
*   [Inbound email](../../Customer/Cases/cases-inbound-email.md)
