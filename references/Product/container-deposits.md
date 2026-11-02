# Container Deposits

Source: https://docs.omnium.no/docs/Product/container-deposits

> How Omnium charges container deposits (pant) as separate order lines that follow the product through carts, orders, cancellations, returns and reports

A **container deposit** (Norwegian, Swedish and Danish _pant_) is the statutory amount charged per bottle or can on top of the beverage price and paid back when the empty container is returned. Omnium charges the deposit as a line of its own next to the product it belongs to: give a product a **deposit type**, and Omnium adds a read-only deposit line in carts and orders, keeps its quantity in step with the product, and refunds it together with the product on returns. The amount and the VAT treatment come from a **deposit article** in your catalogue, so a government rate change is an ordinary price change with a valid-from date.

Container deposits are enabled under **Configuration → Settings → Products → Container deposit (pant)**. They are not the same as [rental deposits](../Order/Rental/rental-overview.md), which are refundable amounts held while a rental runs.

* * *

## How a deposit line comes about

Three things take part:

| Concept | Where it lives | What it provides |
| --- | --- | --- |
| Deposit type | Tenant settings, the **Deposit types** list | A stable code such as `PANT2`, a name, the SKU of its deposit article, and optional deposit articles per market |
| Deposit article | An ordinary product in the catalogue | The deposit amount, through its price per market, and the VAT treatment, through its tax group or tax rate |
| Deposit-bearing product | The product or variant you sell | `depositTypeCode`, naming the deposit type, and `depositQuantity`, the number of containers in one sales unit |

A variant can carry its own deposit type and deposit quantity. When it does, the variant's values are used instead of the parent product's.

* * *

## What a deposit line looks like

For every order line whose product has an active deposit type, Omnium inserts one deposit line directly after it, in the same shipment:

*   The line's `code` is the deposit article's SKU and its `productType` is `ContainerDeposit`.
*   `packageLineItemId` and `packageSkuId` point at the product line the deposit belongs to.
*   Its quantity is the product's quantity multiplied by the deposit units per item (`depositQuantity`, where empty or `0` counts as `1`). Its cancelled quantity follows the product's cancelled quantity the same way.
*   It is read-only and price locked. It is excluded from promotions and member prices, earns no bonus points, does not update stock and never creates a purchase order.
*   Its price is the deposit article's price for the order's market. Its VAT comes from the article's tax group or tax rate. In a market where tax is excluded from the cart total, the line is priced excluding tax at rate `0`, unless the article has a tax group, whose rate then applies.
*   It carries the properties `ContainerDepositFor` (the product line's `lineItemId`), `ContainerDepositType` (the deposit type code) and `ContainerDepositUnitsPerItem` (the units per item at the time the deposit was charged).

The full field list and a JSON example are on the [API reference](container-deposits/api-reference.md#deposit-lines-on-carts-and-orders).

In the Omnium UI, a deposit line shows a badge with its quantity and a note that it is added automatically and follows the product it belongs to. Carts, the order line view and receipts show an **Of which deposit** total.

* * *

## Carts

Deposit lines are synchronised every time a cart is saved or recalculated, through the [Cart API](../Carts/cart-api.md) as well as the Omnium UI. A cart follows the catalogue:

*   A deposit line is added for every product line that has an active deposit type with a deposit article for the cart's market.
*   When the product's quantity changes, the deposit's quantity changes with it.
*   When the product line is removed, when the product no longer carries a deposit, or when its deposit type now points at another article, the deposit line is removed, and in the last case replaced.

Do not add, edit or delete deposit lines yourself. The next cart update re-derives them.

* * *

## Orders

**Orders placed from a cart** keep the deposit lines the cart had.

**Orders received from external channels**, such as a web shop that posts finished orders, a POS or a connector, are normally paid already. How Omnium treats their deposits is the tenant setting **Orders from external channels**:

| Policy | Effect on the received order |
| --- | --- |
| Tag only (default) | Lines whose SKU is one of your deposit articles are recognised as deposit lines, so promotions, tax and reports treat them as deposits. Nothing is added. |
| Validate and warn | As **Tag only**, and the order gets a warning when a deposit-bearing product arrives without the deposit units it calls for. |
| Generate missing deposit lines | Missing deposit lines are generated, which changes the order total. An order whose prices are locked, because it was priced offline or a receipt has been issued for it, is tagged but never given new lines; it gets the warning instead. |

The warning is the order error `ContainerDepositMissing`, with the expected and found deposit units per article in its details. See [Orders from external channels](container-deposits/configuration.md#orders-from-external-channels) for what each policy does in detail.

**Existing orders** are normally paid, so Omnium never back-fills deposits onto lines the customer has already paid for. A deposit line is added only for a line that is being added to the order now. Deposit lines already on the order keep following their product's quantity and cancelled quantity, using the units per item recorded when the deposit was charged, so a later change to the product's deposit type or deposit quantity never rewrites what the customer paid.

**Cancellations** cancel the deposit with the product: the deposit's cancelled quantity follows the product's. When cancelled lines are moved to a new shipment for reallocation, the deposit lines travel with their products.

* * *

## Returns

A deposit is refunded together with the product it was charged for, in the same proportion and never beyond what is left to return. The refunded deposit line does not update stock.

*   **Returns registered in the Omnium UI** add the deposit lines of the returned products automatically, also when the user did not select them.
*   **Returns created through the [Return API](../Order/Returns/return-api.md)** refund exactly the lines you send. Include the deposit line's `lineItemId` and quantity in the request to refund it. Omnium does not add it for you, because a return settled by a POS or another system carries exactly the amounts that were refunded there.

A deposit line that a channel sent without a link to its product (no `packageLineItemId`) is not added automatically in the UI either. Return it as an ordinary line.

* * *

## Reports and accounting

On the **Order lines** tab of **Reports → Orders**, a deposit row is flagged as a container deposit and carries its deposit type and the line it was charged for. Its cost equals its revenue, so it contributes no profit: the store pays the same deposit to its supplier as it charges the customer. A **Deposit** switch adds the deposit rows, charged and refunded, as a set of their own next to product sales, returns and shipping, and the rows can be grouped by deposit type and by line type. Through the API, the same rows are selected with `includeContainerDeposits` on the analytics order line search. See the [API reference](container-deposits/api-reference.md#analytics-rows-for-deposits).

Postings use the deposit line's tax group like any other sales line. In Norway, pant is kept outside the VAT base as long as it is its own line on the receipt and kept apart in the accounts: give the deposit article a 0 % tax group marked outside VAT scope, such as the `PANT` group of the Norwegian preset, and map that group to its own ledger account. Omnium warns when a deposit article prices Norwegian deposits with VAT. Other countries normally charge VAT on deposits; use the tax group your accountant specifies. See [Tax Groups](../Order/Ledger/ledger-tax-groups.md).

* * *

## Setting up container deposits

1.  **Create the tax group for deposits** when tax groups are enabled, for example `PANT`, 0 %, outside VAT scope, under **Configuration → Settings → Advanced → Accounting settings**. Without tax groups, give the deposit article a tax rate instead.
2.  **Create one deposit article per deposit class**, for example `PANT-NO-2` for the 2 kr class, with a price in every market the deposit is charged in and the tax group from step 1. A tenant that keeps one article per country creates one per market.
3.  **Enable container deposits** under **Configuration → Settings → Products → Container deposit (pant)**. Add a deposit type per class pointing at its article, or insert a country preset and create the articles it names, and choose how orders from external channels are handled.
4.  **Give products a deposit type** and, for multipacks, the deposit units per item, in the product's **Settings** tab or through the [Product API](container-deposits/api-reference.md#product-fields).
5.  **Check the Validation tab** of the tenant settings for container deposit warnings, such as an article that does not exist or has no price.

| Page | Covers |
| --- | --- |
| [Configuration](container-deposits/configuration.md) | The settings, deposit types and presets, deposit articles, tax, the inbound order policy, the product fields and validation |
| [API Reference](container-deposits/api-reference.md) | Product fields, deposit lines in cart and order JSON, orders received with deposits, returns and analytics |
