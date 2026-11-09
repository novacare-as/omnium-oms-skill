# Notifications

Source: https://api.omnium.no/documentation

> Send e-mail or SMS through Omnium.

Generated from the Omnium OpenAPI spec by `scripts/sync-api.ts` — do not edit by hand.
Common conventions and standard error responses (429, 500) are in `api/_INDEX.md`.

---

## `POST /api/Notifications/SendEmail`

**Send E-mail**

Operation ID: `NotificationsSendEmail`

**Request body:** [`OmniumEmailMessage`](../schemas/OmniumEmailMessage.md) — E-mail-message to send

**Responses:**

- 200: Email is sent
- 400: Email is invalid

---

## `POST /api/Notifications/SendSms`

**Send SMS**

Operation ID: `NotificationsSendSms`

**Request body:** [`OmniumSmsMessage`](../schemas/OmniumSmsMessage.md) — SMS-message to send

**Responses:**

- 200: SMS is sent
- 400: SMS is invalid
