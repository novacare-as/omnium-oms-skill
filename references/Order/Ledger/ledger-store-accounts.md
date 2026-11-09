# Store Accounts

Source: https://docs.omnium.no/docs/Order/Ledger/ledger-store-accounts

> Give a store its own accounting accounts that replace individual tenant chart-of-accounts entries, and set the store's accounting company code and accounting dimension code.

Most stores book to the tenant [Chart of Accounts](ledger-chart-of-accounts.md). When a store needs different accounts — its own cash account, its own revenue account, or a separate company's account numbers — you add **store accounts** that replace only the tenant entries they match. Every other tenant entry still applies to the store.

Store accounts are edited under **Stores** → select the store → **Information → Accounting**, which has the views **Accounts**, **JSON**, and **Validate** — plus **VAT rates** when tax groups are enabled, where you give the store its own [VAT rates](ledger-tax-groups.md#store-vat-rates). Store accounts can also be read and written as `chartOfAccounts` on the store in the [Store API](../../Stores/store-api.md).

## How store accounts combine with the tenant chart

The chart a store uses is its own entries first, followed by every tenant entry that none of its own entries replaces:

*   **A store entry replaces the tenant entry it matches.** Two entries match when their category, discriminator, currency, and tax group are all the same. The discriminator is compared case-sensitively; currency and tax group are not. In the **Accounts** view, a replacing entry is labelled **Override**.
*   **All other tenant entries are inherited** unchanged.
*   **To switch off a tenant account for one store**, add a store entry with the same category, discriminator, currency, and tax group, and turn **Active** off. The inactive entry still replaces the tenant entry; the line then resolves through the remaining [resolution steps](ledger-chart-of-accounts.md#how-an-account-is-resolved), for example to a catch-all entry, or gets no account.
*   **A store with no entries of its own** uses the tenant chart as it stands.

Entries from the country presets carry a tax group code, which is only visible in the **JSON** view. To replace one of them, copy it from the tenant chart (see below) so the tax group comes along; an entry added by hand without the tax group does not replace it, and web-fulfillment lines keep resolving to the tenant entry by tax group.

Because the store's own entries come first, a store entry also wins over tenant entries that match the same line at the same resolution step — for example a store catch-all over a tenant catch-all.

### Which store's accounts a line uses

Each ledger line resolves against the chart of the store it is booked at:

| Line | Store |
| --- | --- |
| Sales, shipping, gift-card sales, rental deposits | The store the posting is built for |
| Return lines and their VAT | The store that received the return — or the purchase store when both stores are in the same store group, or when the refund's payment method has **Refund to original sales store** turned on. A refund without a return reverses sales and VAT at the store the posting is built for. |
| Captured payments | The store that took the payment — or the store the posting is built for when the payment method has **Refund to original sales store** turned on |
| Refunds | The store that paid out the refund — or the purchase store when both stores are the same or in the same store group, or when the payment method has **Refund to original sales store** turned on |
| `InternalTransferIn` (cost transfer debit) | The store that received the return |
| `InternalTransferOut` (cost transfer credit) | The purchase store |

## Adding store accounts

| Action | What it does |
| --- | --- |
| **Add account** | Adds an empty entry. Use the category, discriminator, currency, and tax group of the tenant entry it should replace. |
| **Insert accounts from → Tenant chart of accounts** | Copies the tenant entries to the store, skipping entries the store already has. The summary reports how many of the added entries override a tenant account. |
| **Insert accounts from → Replace with tenant chart of accounts** | Removes every store entry and inserts a fresh copy of the tenant chart, after a confirmation. |
| **Insert accounts from → Insert Norwegian / Swedish / Danish account chart** | The same country presets as on the [tenant chart](ledger-chart-of-accounts.md#building-the-chart). |

A practical way to change a few accounts: copy the tenant chart, change the account numbers you need, then delete the entries you did not change. An entry with the same account number as the tenant entry it replaces usually adds nothing, and validation suggests removing it.

### Copying accounts from another store

In the **JSON** view, **Load accounts from** lists the tenant chart and every other store:

1.  Select the source and select **Load**. The accounts are loaded into the text area for review — not applied yet. A store without entries of its own has nothing to load.
2.  Edit the text if needed.
3.  Select **Apply accounts**. The accounts are validated against the tenant chart.
4.  Save the store.

The JSON format is the same as for the [tenant chart](ledger-chart-of-accounts.md#editing-the-chart-as-json).

## Validating store accounts

The **Validate** view checks the store's entries merged over the tenant chart, against the tenant's payment methods and tax groups — and against the store's own VAT rates when it has them. The number of errors and warnings appears as a badge on the view. A store without accounts or VAT rates of its own has nothing to check.

When the store has VAT rates of its own but no accounts, only the checks the VAT rates can change run: the store's own rows, and — when tax groups are enabled — an account for each of the store's own active codes, matched on the code, on the store's rate, or by a catch-all entry.

Besides the chart, payment-method, and tax-group checks described in [Configuration](ledger-config.md#validation), store validation reports:

| Check | Severity | Meaning |
| --- | --- | --- |
| Overrides the tenant account | Info | The entry replaces a tenant entry for this store. |
| Matches the tenant account it overrides | Info | The entry has the same account number as the tenant entry; you can usually delete it. |
| Inactive and hides the tenant account | Info | The entry switches off the tenant entry for this store. |
| References a tax group neither the store nor the tenant has | Warning | The entry's tax group code is in neither the store's own VAT rates nor the tenant's. |
| Accounts carry custom properties | Warning | Entries have custom properties. |
| Chart size | Warning / Error | The store's entries exceed 128 KB (warning) or 512 KB (error). |
| Store VAT rates | Error | One of the store's own VAT rates breaks a rule that the save checks when the rates change — see [Saving a store with its own VAT rates](ledger-tax-groups.md#saving-a-store-with-its-own-vat-rates). Shown in the area `StoreTaxGroups`. |

When you save a store that has accounts or VAT rates of its own, the check runs again. If it finds errors or warnings, a **Check the chart of accounts before saving** dialog lists them; select **Save anyway** to save or **Abort** to go back. The check never blocks the save on its own, but the save itself refuses changed store VAT rates that break a rule.

## Store accounting fields

Two further fields are under **Information → Payments**, in the **Information** section:

| Field | Description |
| --- | --- |
| Accounting company code | Written on the store's postings and on every ledger line of those postings as `accountingCompanyCode`. Postings can be filtered by it — see the [API Reference](api-reference.md#posting-search-request) — and it is included in **Export ledger lines** under **Reports → Accounting** and in the **Export bookkeeping file**. Use it when stores belong to different companies in your accounting system. |
| Accounting dimension code | Store code used on cost-transfer lines (`InternalTransferIn` / `InternalTransferOut`) when goods are returned to another store in the same store group. It is written as the line's store and in its description. Defaults to the store ID when empty. Also exposed as `accountingDimensionCode` on the store in the [Store API](../../Stores/store-api.md). |

## Related pages

*   [Chart of Accounts](ledger-chart-of-accounts.md) — entry fields, discriminators, and resolution order.
*   [Postings & Ledger Lines](ledger-postings.md) — how lines are booked per store.
*   [Configuration](ledger-config.md) — tenant validation and posting settings.
