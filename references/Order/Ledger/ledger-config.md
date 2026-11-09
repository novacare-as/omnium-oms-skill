# Configuration

Source: https://docs.omnium.no/docs/Order/Ledger/ledger-config

> Configure Omnium accounting — enable postings, set currency and time zone, tune auto-balancing, schedule the daily web-fulfillment posting job, and validate the setup.

Accounting is configured per tenant under **Configuration → Settings → Finance → Accounting settings**. The screen is organised into tabs: **Accounting settings**, **VAT rates** (tax groups), and **Validation**. This page covers the general and posting settings, the setup order, and validation. The chart of accounts, tax groups, posting exclusions, and store-level accounts each have their own page.

Accounting is **off by default**. Nothing is posted until you enable it explicitly. Enabling it is safe to do incrementally — turn on postings first, validate, then enable the web-fulfillment job.

## Set up accounting

A first-time setup follows this order, because each step depends on the one before it:

1.  Set the **Default currency** and **Time zone** — see [General settings](ledger-config.md#general-settings).
2.  On the **VAT rates** tab, turn on **Tax groups enabled**, insert the preset for your country, and choose a **Default tax group** — see [Tax Groups](ledger-tax-groups.md). The country account presets reference these tax-group codes, so set them up first. A tenant whose stores sell under their own VAT rates can leave both empty — see [Store VAT rates without tenant VAT rates](ledger-tax-groups.md#store-vat-rates-without-tenant-vat-rates).
3.  In **Chart of accounts**, insert the country account preset, then use **Generate accounts from payment methods** and fill in the account numbers — see [Chart of Accounts](ledger-chart-of-accounts.md).
4.  Make sure there is an `OverShort` account (or set **Over/short account number**) and, if you will post web orders, a `Receivable` account.
5.  Turn on **Posting enabled** — and, for web orders, **Web fulfillment posting enabled** — but do not save yet. On the **Validation** tab, select **Validate** and resolve every error, then save. Several checks only run while posting is on, and validation reads the values on screen, including unsaved changes — see [Validation](ledger-config.md#validation).
6.  For web orders, add the [Web Fulfillment Posting](../../configuration/scheduled-tasks/accounting/web-fulfillment-posting.md) scheduled task.
7.  Optionally add [posting exclusions](ledger-posting-exclusions.md), [store-level accounts](ledger-store-accounts.md), [store VAT rates](ledger-tax-groups.md#store-vat-rates), and product tax groups.
8.  Check the first postings under **Reports → Accounting**, or run a [Posting Preview](ledger-preview.md) before going live.

## General settings

| Setting | Type | Default | Description |
| --- | --- | --- | --- |
| Default currency | string | `NOK` when not set | ISO currency code (e.g. `NOK`, `SEK`, `EUR`). Every posting and ledger line carries this currency, and it is the currency used when resolving accounts. Postings do not convert amounts: an order paid in another currency is booked with its amounts unchanged under this currency. Only the **Export bookkeeping file** and **Payment Ledger** [custom reports](../../configuration/custom-reports.md) leave out orders in another currency. |
| Time zone | string | Tenant time zone | IANA time zone (e.g. `Europe/Oslo`). Decides which accounting day a web-fulfillment transaction falls on, and is the clock for the web fulfillment cutoff hour. When empty or not a recognised ID, the tenant's default time zone is used. It does not affect POS postings. |
| Round to whole units | bool | `false` | Applies only to **Export bookkeeping file** under **Reports → Payments** and to **Payment Ledger** [custom reports](../../configuration/custom-reports.md): debit and credit are rounded to whole currency units and the difference is booked to the `Rounding` account. It does not change POS or web-fulfillment postings. |

## Posting settings

| Setting | Type | Default | Description |
| --- | --- | --- | --- |
| Posting enabled | bool | `false` | Master switch for posting generation. When off, **no** postings are produced — not even from Z-reports — the accounting scheduled tasks do nothing, and web-fulfillment postings cannot be generated or previewed. Existing postings stay viewable. |
| Web fulfillment posting enabled | bool | `false` | Lets the [Web Fulfillment Posting](../../configuration/scheduled-tasks/accounting/web-fulfillment-posting.md) scheduled task post web / click & collect orders, and shows the posting preview on an order's **Payments** tab. Has no effect unless **Posting enabled** is also on. Manual generation from **Reports → Accounting** only requires **Posting enabled**. |
| Require payment before posting | bool | `false` | Web-fulfillment postings always require a real-money payment, whether this setting is on or off: sales book when the payment is captured, sold, or invoiced, and refunds book when they are credited. Orders that are only authorized wait for their capture. |
| Web fulfillment posting per order type | bool | `false` | Produce one posting per order type per store and day instead of one combined posting per store and day. Orders without an order type are grouped as `Unspecified`. Lets accounting separate, for example, online and click & collect sales. |
| Over/short account number | string | — | GL account used for till discrepancies and for auto-balancing lines that go to `OverShort`. Overrides any `OverShort` entry in the chart of accounts. |
| Balance tolerance | decimal | `0.005` | When a posting's debit and credit differ by **more** than this amount, an auto-balancing line is added. Differences at or below it are left unbalanced. Set `0` to balance every difference. See [auto-balancing](ledger-postings.md#auto-balancing). |
| Draft orphan timeout (minutes) | int | `10` | Age after which an abandoned `Draft` posting is removed by the [Orphaned Posting Cleanup](../../configuration/scheduled-tasks/accounting/orphaned-posting-cleanup.md) scheduled task. Drafts only remain when saving a posting is interrupted. |
| Web fulfillment cutoff hour | int | `2` | Hour of the day (0–23) in the accounting time zone. When the scheduled task runs at or after this hour, it posts the previous day; before it, it posts only a day that earlier runs left out. It is a gate, not a run time — the task's own schedule decides when it runs. |

**Posting enabled** is the master switch. The web-fulfillment job, Z-report postings, and all downstream exports depend on it. Turning it off stops all posting generation immediately.

## How POS and web postings are triggered

*   **POS** — postings are built **inline** when a register's Z-report is closed. No scheduling is involved; the posting exists as soon as the Z-report settles. If the posting cannot be built (for example because an auto-balancing account is missing), the Z-report itself still succeeds and no posting is created.
*   **Web fulfillment** — the [Web Fulfillment Posting](../../configuration/scheduled-tasks/accounting/web-fulfillment-posting.md) scheduled task posts the previous accounting day for all stores when it runs at or after the cutoff hour. Add it under **Configuration → Settings → Integrations → Scheduled tasks**; turning on the setting alone does not schedule it.

You can also generate or preview web-fulfillment postings on demand from the UI without waiting for the scheduled run — see [Posting Preview](ledger-preview.md) and [Postings in the UI](ledger-reports.md).

## Saving changes

When card saving is in use on the tenant, each card on the **Accounting settings** and **VAT rates** tabs shows its own save bar once changed, with **See changes**, **Abort**, and **Save**. You can also save all settings at once with **Save and publish** from the menu at the top right of the settings page, confirmed in an **Are you sure?** dialog.

Only a card's **Save** checks the [tax-group rules](ledger-tax-groups.md#saving-the-vat-rates); **Save and publish** saves without any check. Everything on the **Validation** tab is advisory.

## Validation

The **Validation** tab checks the accounting settings currently on screen — including unsaved changes. Select **Validate** to list each issue with a severity (`Error`, `Warning`, `Info`), an area, a message, and usually a suggested fix. Run it after editing the chart of accounts or tax groups, with **Posting enabled** turned on — several checks only run while it is on. Stores with their own accounts or VAT rates have a separate check — see [Store Accounts](ledger-store-accounts.md#validating-store-accounts).

| Check | Severity | What triggers it |
| --- | --- | --- |
| No PaymentMethod account | Error | A payment method configured on the tenant has no `PaymentMethod` entry and no catch-all. |
| No RefundPaymentMethod account | Warning | A payment method has no `RefundPaymentMethod` entry and no catch-all. Refunds with that method get no account number. |
| No OverShort account | Error | **Posting enabled** is on, and neither **Over/short account number** nor an active `OverShort` entry without discriminator exists. Postings that need auto-balancing to `OverShort` fail. |
| No Receivable account | Error | **Web fulfillment posting enabled** is on and there is no active `Receivable` entry without discriminator. |
| No GiftCardLiability account | Error | A `GiftCard` payment method exists but there is no `GiftCardLiability` entry with discriminator `GiftCard` and no catch-all. |
| Chart of accounts is empty | Error | **Posting enabled** is on and the chart has no active entries. |
| Entry has no account number / name | Error / Warning | A chart entry is missing its account number (error) or its name (warning). |
| Duplicate chart entries | Warning | Two active entries share category, discriminator, currency, and tax group. Only the first is used. |
| Entry doesn't match any active payment method | Warning | A `PaymentMethod` or `RefundPaymentMethod` discriminator matches no configured payment method name, and is not a [payment type entry](ledger-chart-of-accounts.md#accounts-per-payment-type) (`Nets|Visa`) of one either. The method part of a type entry is case-sensitive. |
| Payment type entry has no type | Warning | A discriminator is a payment method name followed by `|` and nothing more (`Nets|`). The entry is never used. |
| Payment type has no refund account | Info | A payment type has its own `PaymentMethod` entry but no `RefundPaymentMethod` entry. Its refunds book to the method's refund account. |
| Tax group has no matching Sales / OutputVat account | Error | Tax groups are enabled and an active tax group has no `Sales` or `OutputVat` entry — by tax-group code, by rate, or as a catch-all. `OutputVat` is not required for groups marked outside VAT scope. |
| Tax groups left to the stores | Info | Tax groups are enabled, but the tenant has none of its own. Only stores with their own VAT rates use them. The suggested fix says what a default tax group changes — see [Store VAT rates without tenant VAT rates](ledger-tax-groups.md#store-vat-rates-without-tenant-vat-rates). |
| Tax group has no code | Error | An active tax group has no code. |
| Default tax group missing or inactive | Warning / Error | The tenant has tax groups of its own but no default (warning), or the default does not reference an active group (error). |
| Tax group has Rate=0 but is not outside VAT scope | Info | A 0 % group is not marked **Outside VAT**. Expected for zero-rated groups such as `ZERO`, `EXPORT`, and `EU_B2B`, which are inside VAT scope; ignore it for those. |
| Duplicate tax group code | Error | Two tax groups share a code. Also reported for groups that share a code with non-overlapping validity windows, which is the valid way to [change a rate](ledger-tax-groups.md#validity-windows-and-rate-changes); in that case you can ignore it. |
| Time zone, currency, cutoff hour | Warning / Error | **Posting enabled** is on and the time zone or default currency is empty (warning), the time zone is not a recognised ID (error), or the cutoff hour is outside 0–23 (error). |
| Balance tolerance is 0 or less | Warning | **Posting enabled** is on and **Balance tolerance** is `0` or negative. The message says auto-balancing is disabled; in fact `0` balances every difference, so ignore it when `0` is intended. |
| Posting exclusion problems | Info / Warning / Error | Active rules exist while web-fulfillment posting is off (info), an active rule has no filters, or a rule references an unknown market, market group, store group, order type, order status, or payment method (warning), or a rule has an unknown transaction type (error). |

## Permissions

Editing the accounting settings requires administrator access to **Configuration → Settings**. Viewing postings requires access to **Reports → Accounting**; deleting postings requires the **Administer** access level on that menu item.

## Related pages

*   [Chart of Accounts](ledger-chart-of-accounts.md) — map events to GL account numbers.
*   [Tax Groups](ledger-tax-groups.md) — configure VAT codes and MVA-koder.
*   [Posting Exclusions](ledger-posting-exclusions.md) — keep selected orders out of web-fulfillment postings.
*   [Postings & Ledger Lines](ledger-postings.md) — how the settings above shape the resulting vouchers.
