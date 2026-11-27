# Formatting Settings

Source: https://docs.omnium.no/docs/configuration/formatting-settings

> Configure the default time zone, time zones per store, market and market group, culture and phone number prefix.

## Overview

Formatting settings control how Omnium reads and shows dates and times, which culture it uses for texts, and how it searches phone numbers.

The configuration is located under:

**Configuration → Settings → Formats & numbering → Formatting**

The page has two cards: **Formatting** for culture and phone number prefix, and **Time zone** for the default time zone and the time zone overrides.

## Time zone

### Default time zone

The **Default** row in the **Time zone** card is the time zone of the tenant. Omnium uses it when nothing more specific applies, for example:

*   Dates and times in notification texts and documents
*   Day boundaries in analytics, charts and data exports
*   The valid from and valid to dates of prices

If no default is set, Omnium uses `Central European Standard Time`.

### Time zones per store, market and market group

Stores in a different time zone from the tenant can have their own time zone. Click **Add** in the **Time zone** card to create an override, select a time zone, and select the stores, markets or market groups it applies to.

| Filter | Description |
| --- | --- |
| Available on Stores | The time zone applies to the listed stores |
| Available on Markets | The time zone applies to stores that are available on one of the listed markets |
| Available on Market Groups | The time zone applies to stores that are available on a market in one of the listed market groups |

An override with no stores, markets or market groups selected is not used.

### Resolution order

Omnium finds the time zone of a store in this order:

1.  **Store match**: an override with the store in _Available on Stores_
2.  **Market match**: an override with one of the store's markets in _Available on Markets_
3.  **Market group match**: an override with the market group of one of the store's markets in _Available on Market Groups_
4.  **Default time zone**

When two overrides match on the same level, the first one in the list is used. An override with an empty or unknown time zone is skipped, and Omnium continues with the next match.

### What the time zone of a store controls

The time zone of a store is used for:

*   The store pick limit, the extended pick limit and the customer pickup deadline. See [Click and collect](../Order/order-click-and-collect.md)
*   The reallocation deadline when it is set based on store opening hours
*   Notifications that wait for the store to open, and the send time of notifications with **Adjust for Store Opening Hours**
*   The `\{CUSTOMER_PICKUP_DATE\}` and `\{PICK_LIMIT\}` placeholders in notification texts
*   The received date and the pickup deadline on the click and collect PDF

### Time zone IDs

The time zone picker shows Windows time zone IDs. Summer time is handled automatically.

| ID | Example locations |
| --- | --- |
| `GMT Standard Time` | London, Dublin, Lisbon |
| `W. Europe Standard Time` | Oslo, Stockholm, Berlin, Amsterdam |
| `Romance Standard Time` | Copenhagen, Paris, Madrid, Brussels |
| `Central European Standard Time` | Warsaw, Zagreb |
| `FLE Standard Time` | Helsinki, Tallinn, Riga, Vilnius |

Dates in the Omnium user interface are shown in the time zone of the browser. Store staff with a computer set to local time see the deadlines in the time zone of the store.

## Culture

The culture, for example `nb-NO` or `en-US`, controls the language of month names in dates that Omnium writes into texts, when no market culture is given. If no culture is set, Omnium uses `nb-no`.

## Phone number prefix

The phone number prefix, for example `+47`, is added to a phone number without it when Omnium looks up the orders of a customer by phone number. The Sitoo integration also uses it when it searches for customers, unless the Sitoo configuration has a prefix for the market.
