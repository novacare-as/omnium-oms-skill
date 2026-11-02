# Tax Groups (VAT codes)

Source: https://docs.omnium.no/docs/Order/Ledger/ledger-tax-groups

> Tenant-managed VAT codes in Omnium — a rate, an ERP/SAF-T external code (MVA-kode), validity windows for rate changes, store VAT rates with or without tenant VAT rates, and how tax groups tag products, prices, and ledger lines.

A **tax group** is a tenant-defined VAT code: a short stable identifier carrying a VAT **rate** and an **external code** (the ERP / SAF-T MVA-kode) that your accounting system uses on a VAT return. Tax groups tag products, prices, and order lines, and that tag flows through to the VAT code and rate on each [ledger line](ledger-postings.md).

Tax groups are managed under **Configuration → Settings → Advanced → Accounting settings**, on the **VAT rates** tab.

The tax-group subsystem is an **independent switch** from posting generation. Tax groups tag products, prices, and order lines whether or not postings are enabled, and postings can be generated without tax groups.

## Why tax groups exist

A bare VAT rate (`25`) is not enough for accounting. Two lines can both be 0 % yet need different treatment — _zero-rated_ (within VAT scope, reported) versus _outside VAT scope_ (not reported as VAT at all). A tax group attaches the rate **and** the ERP code **and** the scope flag to a single tenant-chosen code, so the distinction survives all the way to the VAT return.

## Enable tax groups

| Setting | Description |
| --- | --- |
| Tax groups enabled | Turns tax groups on. When on, the default tax group selector and the tax-group list appear, and the tax-group **Code** field appears on products. A tenant without tax groups of its own can also turn it on. Then only stores with their own VAT rates use tax groups — see [Store VAT rates without tenant VAT rates](ledger-tax-groups.md#store-vat-rates-without-tenant-vat-rates). |
| Default tax group | The code applied to a product, price, or line that has no group of its own — see [How a line gets its tax group](ledger-tax-groups.md#how-a-line-gets-its-tax-group) for the exceptions. Lists the active tax-group codes. Must reference an active group valid today. When the tenant has no tax groups of its own, you type the code, and it is optional. |

## Tax group fields

| Field | Required | Description |
| --- | --- | --- |
| Code | ✓ | Short stable identifier referenced by products, prices, and lines (e.g. `HIGH`, `FOOD`, `OUTSIDE`). Shown as **Code**. |
| Name | ✓ | Display name shown in the UI (e.g. `Standard 25%`, `Næringsmidler 15%`). |
| Description |  | Optional longer note. Not shown in the **VAT rates** list. |
| Rate | ✓ | VAT rate as a percentage — `25` for 25 %, `11.11` for 11.11 %, `0` for zero-rated. Shown as **Rate (%)**. A product with this tax group is sold at this rate. |
| External code |  | The ERP / SAF-T tax code (Norwegian **MVA-kode** such as `3`, `33`, `6`). Shown as **VAT code**. Free text — each ERP and country differs. Copied onto order lines with the group. On web-fulfillment postings, it becomes the VAT code on `OutputVat` lines whose order lines carry it, replacing the chart entry's VAT code. POS postings use the chart entry's VAT code, because the Z-report totals VAT by rate only. |
| Outside VAT scope |  | Mark groups that represent activity **outside** the VAT system (no VAT applies). Shown as **Outside VAT**. Validation then does not require an `OutputVat` account for the group, and does not report its 0 % rate. |
| Valid from / Valid to |  | Inclusive validity window (date only). Used to handle government rate changes — see below. |
| Active |  | Inactive groups are not selectable and are ignored when Omnium looks up a group by code, rate, or as the default. A group already stored on an order line is still used by web-fulfillment postings. Turn a group off instead of deleting it. Defaults to on. |

## Saving the VAT rates

When **Tax groups enabled** is on and the tenant has tax groups of its own, the VAT rates are only valid when:

*   a default tax group is selected;
*   no rate is negative;
*   no **Valid from** is after its **Valid to**;
*   active entries with the same code do not have overlapping validity windows;
*   the default tax group is active and valid today.

Saving with the card's **Save** button is refused when the change breaks one of these rules. **Save and publish** saves without checking them; the settings are validated only afterwards, without blocking the save.

A tenant without tax groups of its own can save the switch with an empty list. The default tax group can be empty or typed in. The stores then define the codes — see [Store VAT rates without tenant VAT rates](ledger-tax-groups.md#store-vat-rates-without-tenant-vat-rates).

## Validity windows and rate changes

When a government changes a VAT rate, you do **not** edit the existing group in place. Instead, introduce a **new entry with the same code** and the new effective `Valid from` date, and set the old entry's `Valid to` to the day before. The group valid on the date of each sale or posting is used, so historical postings keep the rate that was in force when the sale happened and new postings pick up the new rate automatically.

Validity windows for the same code must **not overlap** — an overlap is ambiguous, and the card's **Save** refuses it. The **Validation** tab reports every repeated code as `Duplicate tax group code`, including a correct rate-change chain; you can ignore that message when the windows do not overlap.

## How a line gets its tax group

*   **Products and prices** — when a product or price is saved, the group comes from the price's own code, then the product's tax group (the **Code** field), and otherwise the default tax group. A product that has its own **Tax rate** but no tax group gets no group. The group's code and rate are stored on the price.
*   **Carts, and orders placed from a cart** — a line keeps the group it already has, and that group's code, external code, and rate are applied to the line. A line with an explicit tax rate but no group stays without a group; any other line gets the default tax group.
*   **Container deposit lines** — a deposit line generated next to a deposit-bearing product takes the tax group of the deposit article it is priced from, and the group's code, external code, and rate are copied onto the line. A deposit article a channel sent on a received order gets the article's tax group when the line has none. See [Container Deposits](../../Product/container-deposits.md).
*   **In-Store app sales** — a line keeps the group it already has. A line without one gets the active group with the same rate on the sale date. When several groups share that rate (for example several 0 % groups) or none does, the default tax group is used only if its rate equals the line's rate; otherwise the line has no tax group.
*   **Web-fulfillment postings** — the line's stored group is used. A line without one gets the active group with the line's rate on the posting date, when exactly one group has that rate; otherwise it gets the default tax group, even when the default's rate differs from the line's.

POS postings are built from the Z-report, which totals sales and VAT by rate without tax groups. Their `Sales` and `OutputVat` lines are therefore matched to accounts by rate — see the note in [How an account is resolved](ledger-chart-of-accounts.md#how-an-account-is-resolved).

For a store with its own VAT rates, carts and web-fulfillment postings resolve these groups against the store's rates — see [Store VAT rates](ledger-tax-groups.md#store-vat-rates). When the tenant has no tax groups of its own, only such stores use tax groups. Every other sale keeps the VAT rate of its price or market — see [Store VAT rates without tenant VAT rates](ledger-tax-groups.md#store-vat-rates-without-tenant-vat-rates).

## Store VAT rates

A store that sells under another VAT scheme than the rest of the tenant — for example one webshop store per country on a single market — can have **its own VAT rates**. They are edited under **Stores** → select the store → **Information → Accounting → VAT rates**, which is shown when tax groups are enabled.

*   **A store row replaces every tenant row with the same code**, with all of its validity windows, so the store keeps its own rate-change dates. Every other tenant VAT rate still applies to the store.
*   **The code must exist in the tenant VAT rates.** You pick it from the tenant codes, and the tenant's rate for the code is shown beside it. Products and prices keep referring to the tenant codes. A tenant without VAT rates of its own leaves the codes to the stores instead — see [Store VAT rates without tenant VAT rates](ledger-tax-groups.md#store-vat-rates-without-tenant-vat-rates).
*   **An inactive store row** still replaces the tenant rows with its code, which switches that code off for the store.
*   **Copy tenant VAT rates** copies the tenant rows whose code the store does not replace yet, so you only change the rates that differ.
*   **The default tax group stays a tenant setting.** A store that replaces the default code uses its own row for it. Without tenant VAT rates, the default tax group can be empty. When it is set, every store with its own VAT rates needs a row for it.
*   **A store with no rows of its own** uses the tenant VAT rates as they stand.

The In-Store app does not support store VAT rates yet — it is sent the tenant VAT rates. Do not give a store that sells through the In-Store app its own VAT rates.

### Saving a store with its own VAT rates

Saving the store is refused when one of its own rows breaks a rule:

*   the row has no code;
*   the tenant has VAT rates of its own, and the row's code is not one of them;
*   the rate is negative, or **Valid from** is after **Valid to**;
*   active rows with the same code have overlapping validity windows;
*   when tax groups are enabled, the store replaces the default tax group but none of its rows for that code is active and valid today;
*   the tenant has no VAT rates of its own, a default tax group is set, and the store has no active row for it valid today.

When the store's VAT rates are saved unchanged, they are accepted even when they no longer pass — for example after a code was removed from the tenant VAT rates — so other changes to the store can still be saved. Changing any of the rows checks all of them again. When tax groups are enabled, saving the tenant settings then warns which stores still have codes the tenant does not have. When the tenant has no VAT rates of its own and a default tax group is set, the warning differs. It names the stores with their own VAT rates that have no row for the default.

When tax groups are enabled, the store's **Validate** view also checks that the store's accounts merged over the tenant chart have a `Sales` account, and an `OutputVat` account unless the group is outside VAT scope, for each of the store's own active codes — matched on the code, on the store's rate, or by a catch-all entry. A row with override accounts set counts as covered, although postings do not use them. See [Store Accounts](ledger-store-accounts.md#validating-store-accounts).

### What the store's VAT rates change

*   **Cart lines** take the tax group, VAT code, and rate from the store of the cart. A line priced from a price row without a tax group code, such as a price-list row, takes the tax group of its product, or the default tax group when the product has none. A product with its own **Tax rate** but no tax group keeps that rate. Prices including VAT keep their amount; prices excluding VAT are converted at the store's rate.
*   **Moving a cart to another store** resolves the VAT of its lines again when either store has its own VAT rates. The line prices do not change. A line can leave a store with its own VAT rates for a store that has no rate for it. Such a line goes back to the product's own **Tax rate**. Without one, it gets the market's default rate. In a market without VAT it gets `0` either way. It also drops a tax group code the new store has no rate for. A shipment in the same position is resolved again for the new store: its shipping method's VAT code sets the rate, otherwise the market's default rate.
*   **Lines, shipping, and fees without a rate of their own** get the rate of the store's default tax group instead of the market's default rate: shipping options and shipping for a cart, shipping on orders (including shipping added to an existing order), lines added to an existing order, exchange lines, package component lines, and return fees. A shipment with a tax group code, or with a shipping method that has one, gets the store's rate for that code — see [Tax group on a shipping method](ledger-tax-groups.md#tax-group-on-a-shipping-method). Without a code, return shipping takes the rate of the store's default tax group instead of the shipping option's rate. Without a default tax group, all of these keep the rate they have without store VAT rates. That is the market's default rate, or the shipping option's rate for return shipping.
*   **Promotion base prices** are converted at the rate of the line they apply to.
*   **Web-fulfillment postings** look up a line without a tax group by its rate in the store's VAT rates.
*   **Prices stored on products** keep the tenant rate; the cart applies the store's rate when the line is priced.

The `GET /api/Stores/{storeId}/TaxGroups` endpoint returns the VAT rates a store sells under, and the store's own rows can be read and written as `taxGroups` on the store — see the [Store API](../../Stores/store-api.md).

### Set up a store with its own VAT rates

1.  Add every code the store uses to the tenant VAT rates first. Skip this step when the tenant has no VAT rates of its own; the store's rows then define the codes.
2.  On the store, open **Information → Accounting → VAT rates**, select **Copy tenant VAT rates**, change the rates and VAT codes that differ, and delete the rows you did not change. Without tenant VAT rates, type the rows the store needs.
3.  Give products a tax group instead of a **Tax rate** of their own. A product with its own **Tax rate** and no tax group keeps that rate in every store. Give shipping methods a **VAT code** the same way — see [Tax group on a shipping method](ledger-tax-groups.md#tax-group-on-a-shipping-method).
4.  Create carts with the store's ID. A cart created without a store ID gets the user's default store, the market's default store, or the default warehouse, and with it that store's VAT rates.
5.  Add [store accounts](ledger-store-accounts.md) for the store's rates where they need other accounts than the tenant chart, and run the store's **Validate** view.

### Store VAT rates without tenant VAT rates

A tenant can use store VAT rates without tax groups of its own. Example: the stores in one country sell food at a reduced rate, and every other sale keeps the market's VAT rate. Turn on **Tax groups enabled** and leave the tax-group list empty. The **Default tax group** can also stay empty. The **Validation** tab then reports an `Info`: only stores with their own VAT rates use tax groups.

In this setup:

*   **The stores define the codes.** On the store's **VAT rates** view, you type the **Code**. No tenant rate is shown, and **Copy tenant VAT rates** is not offered. While the store has no rows, you can insert a country preset on the store.
*   **Only a line with a store row gets a store rate.** A cart line in such a store resolves its own tax group code first, then the product's **Code**, against the store's rows. With a match, the line gets the store's rate, code, and VAT code. Without a match, it keeps the rate of its price or market and gets no tax group, unless a default tax group is set (see below). Shipping takes the store's row for the shipping method's VAT code. A method without a store row for its code is charged as if it had no code.
*   **Everything else is unchanged.** Stores without rows of their own keep the VAT rate of the price or market, as they do without tax groups. So does every line without a store row, while no default tax group is set. Web-fulfillment postings match such lines to accounts by rate.
*   **Codes are typed everywhere.** The **Code** field on products and the **VAT code** field on shipping methods are text fields. The shipping method's **Tax rate** stays visible, because its VAT code sets the rate only in stores with a row for it.
*   **A default tax group is optional.** When you set one, every store with its own VAT rates needs a row for it. Lines without a tax group in such a store then take that row's rate instead of the market's. Saving the tenant settings warns about stores that lack the row, and saving such a store is refused. Without a default, nothing is required of the stores.

`GET /api/Stores/{storeId}/TaxGroups` returns the store's own rows in this setup, and an empty list for a store without rows. The In-Store app limitation above applies here as well.

## Tax group on a product

When tax groups are enabled, a product's **Settings** tab shows a **Code** field in the **Tax** section — the product's tax group — listing the active tax-group codes. Leave it empty to use the default tax group — unless the product has its own **Tax rate**, in which case it gets no group; the placeholder names the default (`Default tax group: HIGH`). Without a default tax group, the placeholder reads `Market VAT rate`. Choosing a group also sets the VAT rate the product is sold at. When the tenant has no tax groups of its own, you type the code. It then sets the rate only in stores with a row for it.

## Tax group on a shipping method

When tax groups are enabled, the shipping method form in the tenant settings shows a **VAT code** field listing the active tax-group codes. The code is stored as `taxGroupCode` on the shipping method. When the tenant has no tax groups of its own, you type the code, and the **Tax rate** field stays visible. The code then sets the rate only in stores with a row for it.

*   **With a VAT code**, shipping is charged the rate the code has for the order's store: the store's own row for the code when it has one, otherwise the tenant's. The **Tax rate** field is hidden and not used, and a 0 % code gives 0 % VAT.
*   **Shipping options** for a cart are calculated at that rate for the cart's store, and return the code as `taxGroupCode`. A provider price excluding VAT (**Add tax on provider price**) has that rate added. Shipping options for a postal code, without a cart, use the tenant's rate.
*   **A shipment without a rate and without shipping tax** gets the VAT code of its shipping method, found by its shipping method name on the order's market, and with it the rate and the external VAT code. A rate or a shipping tax sent on the shipment is kept, and a tax group code on the shipment itself wins over the method's. A shipment sent with a rate but no code gets the method's code and external VAT code when the code has that rate for the store.
*   **Shipping added in Omnium** takes the method's VAT code and shows the rate for the order's store. Typing another tax rate on the shipment removes the code.
*   **Changing the shipping method** of a shipment resolves its VAT again for the new method's price when **Update totals on shipment change** is on in the order settings and the old or the new method has a VAT code that resolves for the store. Otherwise the shipment keeps its rate, as it keeps its price.
*   **Returns** credit and charge shipping at the rate of the method's VAT code for the order's store.
*   **Web-fulfillment postings** post the shipping VAT on the shipment's code and external VAT code.
*   **Saving the tenant settings** warns about every shipping method whose VAT code the tenant VAT rates do not have. This check runs only when the tenant has VAT rates of its own. Such a code never resolves, so the method's shipping is charged as if it had no code.
*   **Without a VAT code**, shipping works as before: the method's **Tax rate**, otherwise the store's default tax group for a store with its own VAT rates, otherwise the market's default rate.

## Presets

Omnium ships starter charts for common markets that you can apply and then adjust. The **Insert Norwegian preset**, **Insert Swedish preset**, and **Insert Danish preset** buttons are shown while the list is empty. **You must verify every external code against your own ERP's MVA-kode chart** — the presets use commonly-used codes but every ERP differs.

### Norway

| Code | Name | Rate | External code |
| --- | --- | --- | --- |
| `HIGH` | Standard 25% | 25 | `3` |
| `MID` | Lav sats 12% | 12 | `33` |
| `FOOD` | Næringsmidler 15% | 15 | `31` |
| `FISH` | Råfisk 11.11% | 11.11 | `32` |
| `ZERO` | Fritatt for mva (0%) | 0 | `5` |
| `EXPORT` | Eksport (0%) | 0 | `52` |
| `OUTSIDE` | Utenfor mva-loven | 0 (outside scope) | `6` |
| `PANT` | Pant (statsavgift) | 0 (outside scope) | — |

`PANT` represents a bottle/container deposit — a statutory deposit, not VAT — and should be mapped to its own GL account.

### Sweden

| Code | Name | Rate | External code |
| --- | --- | --- | --- |
| `HIGH` | Standard 25% | 25 | `MP1` |
| `MID` | Livsmedel 12% | 12 | `MP2` |
| `LOW` | Böcker, transport 6% | 6 | `MP3` |
| `ZERO` | Momsfri (0%) | 0 | `MF` |
| `EXPORT` | Export (0%) | 0 | `EX` |
| `EU_B2B` | EU-försäljning utan moms | 0 | `EUF` |
| `OUTSIDE` | Utanför momslagen | 0 (outside scope) | — |

### Denmark

| Code | Name | Rate | External code |
| --- | --- | --- | --- |
| `HIGH` | Moms 25% | 25 | `U25` |
| `ZERO` | Nulsats (0%) | 0 | `U0` |
| `EXPORT` | Eksport (0%) | 0 | `UEX` |
| `EU_B2B` | EU-salg uden moms | 0 | `UEU` |
| `OUTSIDE` | Uden for momsloven | 0 (outside scope) | — |

## Related pages

*   [Postings & Ledger Lines](ledger-postings.md#how-sales-and-vat-are-split) — how sales and VAT are split per rate and tagged with the group's code.
*   [Chart of Accounts](ledger-chart-of-accounts.md) — bind a chart entry to a tax group.
*   [Configuration](ledger-config.md) — the setup order and the Validation tab.
