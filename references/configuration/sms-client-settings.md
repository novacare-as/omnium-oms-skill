# SMS Client Settings

Source: https://docs.omnium.no/docs/configuration/sms-client-settings

> Guide for configuring SMS providers in Omnium with per-market, market group, and store resolution.

## Overview

SMS client settings allow you to configure one or more SMS providers in Omnium. You can assign each provider to specific stores, markets, or market groups. Omnium will automatically resolve the correct provider based on the context of the SMS being sent.

The configuration is located under:

**Configuration → Settings → Communication → SMS client**

## Adding a provider

Click **Add** to create a new SMS provider entry. Each entry has a provider (the SMS gateway) and optional availability filters that control when it is used.

## Availability filters

Each SMS provider entry can be scoped to specific stores, markets, or market groups using the availability filters:

| Filter | Description |
| --- | --- |
| Available on Stores | The provider is used when the SMS originates from one of the listed stores |
| Available on Markets | The provider is used when the SMS originates from one of the listed markets |
| Available on Market Groups | The provider is used when the SMS originates from a market belonging to one of the listed market groups |

An entry with **no filters set** acts as the **tenant default** — it is used as a fallback when no store, market, or market group match is found.

## Resolution order

When sending an SMS, Omnium resolves the provider in the following priority order:

1.  **Store match** — entry with a matching store in _Available on Stores_
2.  **Market match** — entry with a matching market in _Available on Markets_
3.  **Market group match** — entry with a matching market group in _Available on Market Groups_
4.  **Tenant default** — entry with no availability filters set

## Supported providers

| Type | Description |
| --- | --- |
| `linkmobility` | LINK Mobility SMS gateway, with optional two-way replies. See [LINK Mobility](../plugins/Other/LinkMobility.md) |
| `vianett` | ViaNett SMS gateway, the older LINK Mobility API. Customers cannot reply to SMS sent through it |
| `sveve` | Sveve SMS gateway |
| `twilio` | Twilio SMS gateway |
| `keysms` | Key SMS gateway |
| `salesforce` | Salesforce SMS gateway |

## Avoid overlapping filters

Each store, market, or market group should only appear on one provider entry. If the same value exists on multiple entries, the first match is used and the others are ignored.

## Configuration fields

The available fields depend on the provider type selected. Common fields:

| Field | Description |
| --- | --- |
| Provider | The SMS gateway provider |
| Username | Account username (if required by the provider) |
| Password or API key | Account password or API key (if required by the provider) |
| API address | Gateway endpoint URL (if required by the provider) |
| Sender | The sender name or phone number shown to the recipient. Empty means the default SMS sender in General settings |

LINK Mobility has more fields, including the settings for two-way replies. See [LINK Mobility](../plugins/Other/LinkMobility.md).
