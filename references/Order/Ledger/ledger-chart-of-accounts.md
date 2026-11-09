# Chart of Accounts

Source: https://docs.omnium.no/docs/Order/Ledger/ledger-chart-of-accounts

> Map Omnium events to general-ledger account numbers — account categories, discriminators, currency and tax-group keys, country presets, and the rules Omnium uses to resolve which account a ledger line books to.

The **Chart of Accounts** (COA) is the tenant's mapping from Omnium accounting events to general-ledger account numbers. Every [ledger line](ledger-postings.md) carries an [account category](ledger-postings.md#account-categories); the chart turns that category — together with a VAT rate, tax group, or payment method — into the concrete account number your accounting system expects.

The chart is edited under **Configuration → Settings → Finance → Accounting settings**, in the **Chart of accounts** card. A store can also carry its own entries that replace individual tenant entries for that store only — see [Store Accounts](ledger-store-accounts.md).

Run the **Validation** tab after editing the chart — see [Configuration](ledger-config.md#validation). A line whose account cannot be resolved is in most cases still written to the posting, but with an empty account number — see [How an account is resolved](ledger-chart-of-accounts.md#how-an-account-is-resolved).

## Chart entry fields

Each entry maps one slice of activity to one account number.

| Field | Required | Description |
| --- | --- | --- |
| Account number | ✓ | The GL account number this entry books to. |
| Name | ✓ | Human-readable account name. Copied onto each ledger line as the account name. Not used for matching. |
| Description |  | Optional free-text note. |
| Category | ✓ | The [account category](ledger-postings.md#account-categories) this entry serves (`Sales`, `OutputVat`, `PaymentMethod`, …). |
| Discriminator |  | Sub-key within the category — see [The discriminator](ledger-chart-of-accounts.md#the-discriminator). Leave blank for a category-wide catch-all. |
| VAT code |  | VAT code stamped onto lines booked to this account. On `OutputVat` lines, the line's [tax group](ledger-tax-groups.md) external code is used instead when the line has one. |
| VAT rate |  | Copied as entered onto ledger lines that carry no VAT rate of their own, such as payment and gift-card lines. Not used for matching. Ledger-line VAT rates are percentages (`25`), so enter the rate in the same form if you want them to agree. |
| Currency code |  | Restrict the entry to a single ISO currency (e.g. `NOK`). Leave blank to match any currency. |
| Tax group code |  | Bind the entry to a specific [tax group](ledger-tax-groups.md). When set, it takes precedence over discriminator (rate) matching. |
| Active |  | Inactive entries are skipped during resolution. Defaults to on. |

The **Accounts** view shows account number, name, category, discriminator, VAT rate, VAT code, and active. **Currency code**, **Tax group code**, and **Description** are set in the [JSON view](ledger-chart-of-accounts.md#editing-the-chart-as-json); the country presets fill in the tax group code for you.

## The discriminator

The **discriminator** is what distinguishes two entries that share the same category:

*   For **`Sales`**, **`OutputVat`**, **`Shipping`**, and **`RentalSales`**, the discriminator is the **VAT rate as a fraction**, with a dot as decimal separator and without trailing zeros — `0.25` for 25 %, `0.15` for 15 %, `0.1` for 10 %, `0.11` for 11.11 %, `0` for 0 %. This is how a 25 % sale and a 15 % sale book to different revenue and VAT accounts.
*   For **`PaymentMethod`** and **`RefundPaymentMethod`**, the discriminator is the **payment method name** — the name configured on the payment method for web orders (for example `klarna_kco`), or the payment method recorded by the register for POS. Matching is case-sensitive. To book one payment type of a method on its own account, write the method name, a vertical bar and the type: `Nets|Visa` — see [Accounts per payment type](ledger-chart-of-accounts.md#accounts-per-payment-type).
*   For **`GiftCardLiability`**, the discriminator is `GiftCard`.
*   For **`DepositLiability`**, use `Deposit`, or leave it blank.

Discriminators are compared as exact text, so `25`, `0,25`, and `0.10` never match a rate. An entry with **no discriminator** acts as the catch-all for its category.

### Accounts per payment type

One payment method can carry several payment types — a card terminal reports the card scheme (BankAxept, Visa, Mastercard), and some providers report their own types (for example invoice or card). To book a type on its own account, add a `PaymentMethod` entry, and usually a `RefundPaymentMethod` entry, whose discriminator is the payment method name, a vertical bar and the type: `Nets|Visa`. Keep the entry for the method itself (`Nets`): every type without an entry of its own still books there.

| Chart entries | A day of Nets payments: BankAxept 6 000, Visa 3 000, Mastercard 800, no type 200 |
| --- | --- |
| `1920 Nets` | `1920` Payment — Nets: 10 000 |
| `1920 Nets` and `1921 Nets|Visa` | `1920` Payment — Nets: 7 000 · `1921` Payment — Nets (Visa): 3 000 |

*   The method part is case-sensitive, like every discriminator. The type part is not, and known card scheme spellings count as one: `Nets|VISA`, `Nets|visa`, and `Nets|Visa` are the same entry, as are `Nets|Amex` and `Nets|American Express`.
*   The type of a POS payment is the card type the payment terminal reported. Z-reports have stored it since Release 2026-34; an older Z-report books all of a method to the method's entry, also when its posting is regenerated.
*   The type of an order payment is its **payment type**; when that is empty, the card issuer the In-Store app stored on the payment; and when that is empty too, the payment type of another payment with the same transaction and payment method, such as the authorization a refund belongs to.
*   A type with a `PaymentMethod` entry but no `RefundPaymentMethod` entry refunds to the method's `RefundPaymentMethod` entry. Validation points this out as `Info`.
*   Gift cards are not split by type.
*   The type entries apply to postings and to the **Export bookkeeping file** and **Payment Ledger** custom reports alike.

A chart without type entries books exactly as before, so adding the first one is the only step needed. Use [**Generate accounts for payment types**](ledger-chart-of-accounts.md#building-the-chart) to add them from the types your payments actually carry.

## Categories and when they are used

| Category | Booked when | Discriminator |
| --- | --- | --- |
| `Sales` | Goods are sold or returned | VAT rate, or blank with a tax group code |
| `RentalSales` | Rental revenue is booked. Without a `RentalSales` entry, rental revenue books to `Sales`. | VAT rate, or blank |
| `OutputVat` | VAT is collected or reversed | VAT rate, or blank with a tax group code |
| `Shipping` | Shipping is charged or refunded | VAT rate |
| `PaymentMethod` | A payment is received | Payment method name, or method and [payment type](ledger-chart-of-accounts.md#accounts-per-payment-type) (`Nets|Visa`) |
| `RefundPaymentMethod` | Money is paid back. There is no fallback to the `PaymentMethod` entry. | Payment method name, or method and [payment type](ledger-chart-of-accounts.md#accounts-per-payment-type) (`Nets|Visa`) |
| `GiftCardLiability` | Gift cards are sold in the In-Store app (from the Z-report), or used or refunded as payment. A payment method named `GiftCard` books here instead of to `PaymentMethod`. | `GiftCard` |
| `DepositLiability` | Rental deposits are taken or refunded | `Deposit`, or blank |
| `Receivable` | A web-fulfillment posting is auto-balanced because sales exceed payments | Blank |
| `OverShort` | A till discrepancy or any other auto-balancing line is booked | Blank |
| `InternalTransferIn` / `InternalTransferOut` | The cost of goods is moved between stores of the same store group on a cross-store return | Blank |
| `Rounding` | Rounding differences in the **Export bookkeeping file** under **Reports → Payments** and in **Payment Ledger** [custom reports](../../configuration/custom-reports.md). Not used by postings. | Blank |
| `PaymentProviderFee`, `Discount`, `CashFloat`, `CashInTransit`, `Tip`, `Other` | Not booked today. Discounts are already netted into the sales amounts. | — |

## How an account is resolved

When Omnium needs an account for a line, it filters the chart to **active entries of the matching category**, then picks the first entry that matches in this order:

1.  **Tax-group match** — an entry whose **tax group code** matches the line's tax group, preferring one that also matches the posting currency. This wins over rate-based matching. Only applies when the line has a tax group.
2.  **Exact discriminator + currency** — entry matching both the discriminator and the posting currency.
3.  **Discriminator only** — entry matching the discriminator with no currency restriction.
4.  **Category catch-all** — the first entry for that category with no discriminator and no currency.

Within each step, the entry higher in the list wins. `Receivable` and `OverShort` are looked up separately: the first active entry of that category with no discriminator and either no currency or the posting currency.

A payment or refund with a [payment type](ledger-chart-of-accounts.md#accounts-per-payment-type) first looks for an entry for that type — `Nets|Visa` with the posting currency, then `Nets|Visa` with no currency — before the steps above. A type entry therefore wins over a currency-specific entry for the method.

If none of these match, the line is still written to the posting, with an empty account number and no warning. The exceptions:

*   **Auto-balancing** — when a posting needs a `Receivable` or `OverShort` account and none exists, the posting is not created.
*   **Cost transfers** — when an `InternalTransferIn` or `InternalTransferOut` account is missing, the transfer lines are left out and the posting gets a warning.
*   **Deposits** — a `DepositLiability` line without an account adds a warning to the posting.

The country presets bind `Sales` and `OutputVat` entries to a tax group code and leave the discriminator blank, so those entries also act as **catch-alls** in step 4. POS postings match `Sales` and `OutputVat` by VAT rate only — a Z-report carries no tax group — so with an unmodified preset every POS sale books to the first `Sales` entry and all POS VAT to the first `OutputVat` entry, whatever the rate. If you sell at more than one VAT rate in the In-Store app, add a `Sales` and an `OutputVat` entry per rate with the rate as discriminator (`0.25`, `0.15`, …). Web orders keep resolving through the tax-group entries.

The **Over/short account number** set in [posting settings](ledger-config.md#posting-settings) overrides any `OverShort` entry in the chart.

## Building the chart

The **Chart of accounts** card offers these actions:

| Action | What it does |
| --- | --- |
| **Add account** | Adds an empty entry. |
| **Insert accounts from → Insert Norwegian / Swedish / Danish account chart** | Appends the country preset. Entries whose category, discriminator, currency, and tax group already exist are skipped, and a summary shows how many were added and skipped. |
| **Insert accounts from → Generate accounts from payment methods** | Adds a `PaymentMethod` and a `RefundPaymentMethod` entry for each configured payment method that does not have one, with the payment method name as discriminator and an empty account number for you to fill in. |
| **Insert accounts from → Generate accounts for payment types** | Opens a dialog listing, per configured payment method, the [payment types](ledger-chart-of-accounts.md#accounts-per-payment-type) its POS and order payments carried in the last 90 days, with counts. For a card terminal it also lists the other known card schemes. Types that already have both entries are marked. **Other payment type** adds a type the list does not show. **Add accounts** adds a `PaymentMethod` and a `RefundPaymentMethod` entry (`Nets|Visa`) per selected type, with an empty account number. |
| Delete icon | Removes the entry. |

The presets follow common national charts (NS 4102, BAS, Standardkontoplan). Verify every account number against your own accounting system before going live.

### Norwegian preset

| Account number | Name | Category | Tax group code |
| --- | --- | --- | --- |
| 3000 | Salg, høy sats | `Sales` | `HIGH` |
| 3030 | Salg, lav sats (12%) | `Sales` | `MID` |
| 3050 | Salg, næringsmidler (15%) | `Sales` | `FOOD` |
| 3100 | Salg, fritatt for mva | `Sales` | `ZERO` |
| 3200 | Salg, eksport | `Sales` | `EXPORT` |
| 2700 | Utgående mva, høy sats | `OutputVat` | `HIGH` |
| 2710 | Utgående mva, lav sats | `OutputVat` | `MID` |
| 2720 | Utgående mva, næringsmidler | `OutputVat` | `FOOD` |
| 3700 | Rabatter | `Discount` |  |
| 3220 | Frakt | `Shipping` |  |
| 7090 | Øreavrunding | `Rounding` |  |
| 1500 | Kundefordringer | `Receivable` |  |
| 1900 | Kontantkasse | `CashFloat` |  |
| 1909 | Kontanter i transitt | `CashInTransit` |  |
| 1580 | Kassedifferanse | `OverShort` |  |
| 2470 | Forskudd fra kunder (gavekort) | `GiftCardLiability` |  |

The Swedish (BAS) and Danish presets follow the same structure with their national account numbers and tax-group codes (`HIGH`, `MID`, `LOW`, `ZERO`, `EXPORT` for Sweden; `HIGH`, `ZERO`, `EU_B2B`, `EXPORT` for Denmark).

The presets' `GiftCardLiability` entries carry no discriminator, so they act as the catch-all for gift cards. The account presets pair with the matching [tax-group presets](ledger-tax-groups.md#presets); insert the tax groups first.

## Editing the chart as JSON

The **JSON** view shows the whole chart as a JSON array, one object per entry with `accountNumber`, `name`, `description`, `category`, `discriminator`, `vatCode`, `vatRate`, `currencyCode`, `isActive`, `taxGroupCode`, and `properties`. Use it to set the currency or tax group of an entry, to copy a chart between tenants (**Copy to clipboard**), or to paste a chart prepared elsewhere.

*   **Compare** shows the differences between the text and the current chart.
*   **Apply accounts** replaces the chart with the text. Nothing is applied if the text is not valid JSON or an entry has a missing or unknown category; unknown fields are ignored with a warning. Save the card afterwards.
*   **Reset** discards your text edits.

The text may be a bare array or an object with a `chartOfAccounts` array.

```json
[
  {
    "accountNumber": "3050",
    "name": "Salg, næringsmidler (15%)",
    "category": "Sales",
    "discriminator": "",
    "taxGroupCode": "FOOD",
    "isActive": true
  },
  {
    "accountNumber": "3051",
    "name": "Salg, næringsmidler (15%) POS",
    "category": "Sales",
    "discriminator": "0.15",
    "isActive": true
  },
  {
    "accountNumber": "1920",
    "name": "Klarna (payment)",
    "category": "PaymentMethod",
    "discriminator": "klarna_kco",
    "isActive": true
  }
]
```

## Worked example

A tenant selling at 25 % and 15 % VAT, taking card and cash, and shipping to customers might configure:

| Account number | Category | Discriminator | Currency | Purpose |
| --- | --- | --- | --- | --- |
| 3000 | `Sales` | `0.25` |  | Revenue, standard rate |
| 3001 | `Sales` | `0.15` |  | Revenue, food rate |
| 2700 | `OutputVat` | `0.25` |  | Output VAT, standard rate |
| 2701 | `OutputVat` | `0.15` |  | Output VAT, food rate |
| 1910 | `PaymentMethod` | `Cash` |  | Cash tender |
| 1920 | `PaymentMethod` | `Card` |  | Card tender |
| 3100 | `Shipping` |  |  | Shipping charged to customer |
| 1500 | `Receivable` |  |  | Web sales awaiting settlement |
| 1909 | `OverShort` |  |  | Till discrepancies (suspense) |

A 25 % sale paid by card then books revenue to 3000, output VAT to 2700, and the tender to 1920.

## Related pages

*   [Postings & Ledger Lines](ledger-postings.md) — the categories and debit/credit conventions the chart serves.
*   [Tax Groups](ledger-tax-groups.md) — VAT codes and the tax-group keys used in resolution.
*   [Store Accounts](ledger-store-accounts.md) — replace individual tenant entries for one store.
*   [Configuration](ledger-config.md) — the Over/Short override and the Validation tab.
