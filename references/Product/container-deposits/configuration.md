# Configuration

Source: https://docs.omnium.no/docs/Product/container-deposits/configuration

> Enable container deposits, define deposit types and their deposit articles, choose how orders from external channels are handled, and give products a deposit type

Container deposits are configured in the tenant settings under **Configuration → Settings → Products → Container deposit (pant)**. The settings hold the master switch, the policy for orders from external channels and the deposit types. Amounts and VAT are not configured here; they live on the deposit articles the deposit types point to.

* * *

## Enable container deposits

| Setting | Type | Default | Description |
| --- | --- | --- | --- |
| `isEnabled` | bool | false | Shown as **Enable container deposits**. Adds a read-only deposit line next to every product with a deposit type, priced from the deposit article. When off, no deposit lines are generated or tagged, the deposit fields on products are hidden, and deposit lines already on orders are left as they are. |
| `inboundOrderHandling` | string | `TagOnly` | Shown as **Orders from external channels**. One of `TagOnly`, `ValidateAndWarn` and `Generate`. See [Orders from external channels](configuration.md#orders-from-external-channels). |
| `depositTypes` | array | empty | Shown as **Deposit types**. See [Deposit types](configuration.md#deposit-types). |

```
"DepositSettings": {
  "IsEnabled": true,
  "InboundOrderHandling": "TagOnly",
  "DepositTypes": [
    {
      "Code": "PANT2",
      "Name": "Pant 2 kr",
      "DepositSkuId": "PANT-NO-2",
      "MarketOverrides": [
        { "MarketId": "se", "DepositSkuId": "PANT-SE-2" }
      ],
      "IsActive": true
    },
    {
      "Code": "PANT3",
      "Name": "Pant 3 kr",
      "DepositSkuId": "PANT-NO-3",
      "MarketOverrides": [],
      "IsActive": true
    }
  ]
}
```

* * *

## Deposit types

Each deposit type is one deposit class, such as the Norwegian 2 kr and 3 kr classes or the Danish pant A, B and C. Products reference a deposit type by its code.

| Field | Type | Description |
| --- | --- | --- |
| `code` | string | Shown as **Code**. The stable key products reference in `depositTypeCode`. Compared without regard to case. When two active types share a code, only the first is applied. |
| `name` | string | Shown as **Name**. Display name, shown under the deposit type on the product. |
| `depositSkuId` | string | Shown as **Deposit article (SKU)**. The SKU of the product whose price and tax group make up the deposit line. |
| `marketOverrides` | array | Deposit articles for specific markets, each with `marketId` and `depositSkuId`, for tenants that keep one article per country for the same class. The deposit types editor shows the base article only; market overrides are maintained in the settings JSON. |
| `isActive` | bool | Shown as **Active**. Defaults to `true`. Products referencing an inactive type get no deposit line. |

### How the deposit article is chosen

For an order in a given market, the deposit type's article is the market override for that market when one is set, otherwise `depositSkuId`. A type with neither for that market gives no deposit line on that order, and a warning is written to the log. The **Validation** tab reports the type, see [Validation](configuration.md#validation).

### Presets

While the list is empty, the editor offers **Insert Norwegian preset**, **Insert Swedish preset** and **Insert Danish preset**. A preset only seeds the deposit type rows. You still create the deposit articles it names, with their prices and tax group, or point the rows at articles you already have.

| Preset | Code | Name | Deposit article |
| --- | --- | --- | --- |
| Norway | `PANT2` | Pant 2 kr | `PANT-NO-2` |
| Norway | `PANT3` | Pant 3 kr | `PANT-NO-3` |
| Sweden | `PANT2` | Pant 2 kr | `PANT-SE-2` |
| Sweden | `PANT3` | Pant 3 kr | `PANT-SE-3` |
| Denmark | `PANT-A` | Pant A (1,00 kr) | `PANT-DK-A` |
| Denmark | `PANT-B` | Pant B (1,50 kr) | `PANT-DK-B` |
| Denmark | `PANT-C` | Pant C (3,00 kr) | `PANT-DK-C` |

### Article check in the editor

As you type an article SKU, the editor looks it up in the catalogue and shows a warning on the row when the deposit type has no article, when the article does not exist, or when it has no price. The same problems are reported on the **Validation** tab when the settings are saved.

* * *

## Deposit articles

A deposit article is an ordinary product. Create one per deposit class, and one per market when the same class uses different articles per country.

*   **It must exist** as a product or a variant with the SKU the deposit type names. The SKU is also matched against the product's ID and product ID.
*   **It needs a price** in every market the deposit is charged in, or a price that applies to every market. The deposit line's amount is the article's price for the order's market. An article without a price gives a deposit of zero. Tenants on external prices are not checked for prices.
*   **Its tax group or tax rate decides the VAT on the deposit.** See [Tax on deposits](configuration.md#tax-on-deposits).
*   **It needs no stock.** Deposit lines never update inventory and never create purchase orders.
*   **Its own product type is not used.** A deposit line's product type is always `ContainerDeposit`.

A government rate change is a price change on the deposit article: add the new price with its valid-from date. Deposit lines already on orders are price locked and keep what the customer paid.

* * *

## Tax on deposits

The deposit line takes the tax of the price it is priced from. With tax groups enabled, the article's tax group gives the line its tax group code, external VAT code and rate; without tax groups, the article's tax rate is used, otherwise the market's default rate. In a market where tax is excluded from the cart total, the deposit line is priced excluding tax at rate `0`; with tax groups enabled, the article's tax group still gives the line its code, external VAT code and rate.

*   **Norway.** Pant is kept outside the VAT base as long as it is its own line on the receipt and kept apart in the accounts. Give the article a 0 % tax group marked outside VAT scope, such as `PANT` from the Norwegian preset in [Tax Groups](../../Order/Ledger/ledger-tax-groups.md#presets), or a tax rate of `0`. When a deposit article prices deposits in a market with country code `NO` at a VAT rate above zero, saving the settings reports a warning naming the article, the deposit type, the market and the rate.
*   **Other countries** normally charge VAT on deposits. Give the article the tax group your accountant specifies.

See [Prices and Tax](../../Prices/PricesAndTax.md) for how prices carry tax.

* * *

## Orders from external channels

An order received from outside Omnium, for example through the [Order API](../../Order/order-api.md) or a connector, is normally paid already. The **Orders from external channels** setting decides what Omnium does with its deposits.

**Every policy tags deposit lines.** When the order is received, each line whose SKU is one of the active deposit types' articles, base or market override, is marked as a deposit line: its `productType` becomes `ContainerDeposit`, it is excluded from promotions and member prices, the property `ContainerDepositType` records the deposit type, and when tax groups are enabled and the line has no tax group code, the article's tax group is applied. Prices are left as the channel sent them.

| Value | Shown as | Behaviour |
| --- | --- | --- |
| `TagOnly` | Tag only | Tags deposit lines. Nothing is added to the order. |
| `ValidateAndWarn` | Validate and warn | Tags deposit lines, and compares, per deposit article, the deposit units the deposit-bearing lines call for (quantity less cancelled quantity, times units per item) with the units the order holds in deposit lines of that article. When fewer are found, the order gets the warning `ContainerDepositMissing`, "The order is missing container deposit lines", with details such as `PANT-NO-2: expected 8, found 0`. The warning is removed when a later check finds nothing missing. |
| `Generate` | Generate missing deposit lines | Tags deposit lines and generates the missing ones as on a cart, which changes the order total. A deposit line the channel sent without a link to its product blocks generation for that article, so a deposit the channel already charged is never charged twice. An order whose prices are locked, because it was priced offline or a receipt has been issued for it, is never given new lines; it gets the warning instead. |

Warnings are listed on the order. See [Order errors](../../Order/order-logging/order-errors.md).

Channel orders that already carry their deposit lines work best with **Tag only**. Use **Generate** for channels that do not know about deposits and whose orders Omnium prices, such as a cart handed over for checkout.

* * *

## Deposit fields on products

When container deposits are enabled, the product's **Settings** tab shows a **Deposit** section:

| Field | Shown as | Description |
| --- | --- | --- |
| `depositTypeCode` | Deposit type | One of the active deposit type codes. The type's name is shown under the field. Leave it empty for no deposit. |
| `depositQuantity` | Deposit units per item | Shown once a deposit type is chosen. A whole number of containers in one sales unit, for example `4` for a 4-pack. Empty counts as `1`. |

A variant can have its own deposit type and deposit units. When set, they replace the parent product's values for that variant. The same fields are available on the [Product API](api-reference.md#product-fields).

Changing a product's deposit type or deposit units affects carts on their next update. Orders keep their deposits as charged.

* * *

## Validation

The **Validation** tab of the tenant settings lists container deposit problems as warnings of the type **Container deposits**, each linking to the deposit settings. They never block saving, so a half-configured deposit setup does not stop you from saving other settings.

| Warning | Meaning |
| --- | --- |
| Container deposits are enabled, but no active deposit type is configured | The feature is on but cannot add any deposit. |
| An active deposit type has no code, so no product can reference it | Give the type a code. |
| Deposit type code 'X' is used by more than one active deposit type; only the first is applied | Codes must be unique among active types. |
| Deposit type 'X' has no deposit article, so no deposit line can be generated for it | Set `depositSkuId`. When only market overrides are set, the warning names the covered markets and that orders in other markets get no deposit line. |
| Deposit article 'SKU' (deposit type 'X') does not exist as a product, so no deposit line is generated | Create the article or point the type at an existing product. |
| Deposit article 'SKU' (deposit type 'X') has no price, so its deposit line would be zero | Give the article a price. |
| Deposit article 'SKU' (deposit type 'X') charges 25% VAT on deposits in market no | Norwegian pant should be outside VAT. Give the article a 0 % tax group such as `PANT`, or a tax rate of `0`. |

* * *

## Related pages

*   [Container Deposits](../container-deposits.md) — how deposit lines behave in carts, orders, returns and reports.
*   [API Reference](api-reference.md) — the product fields and the deposit line JSON.
*   [Tax Groups](../../Order/Ledger/ledger-tax-groups.md) — the `PANT` tax group and how a line gets its tax group.
