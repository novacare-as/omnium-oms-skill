# POS Integration

Source: https://docs.omnium.no/docs/GettingStartedWithAPI/Tutorials/pos-integration

> This guide walks through a complete POS integration with Omnium — pushing in-store sales and returns, transferring online orders to the store, synchronizing store inventory, and subscribing to changes with webhooks.

## Prerequisites

Before starting, ensure you have:

*   **Access to Omnium**: You need an active Omnium account with appropriate permissions
*   **API Credentials**: You'll need a `ClientId` and `ClientSecret` for API authentication
*   **Required API Roles**: Your API user needs `OrderAdmin` and `InventoryAdmin` roles

If you don't have access yet, follow our [Get Access guide](../introtoapi.md) to request access and obtain your API credentials.

* * *

## Integration surface

A typical POS integration consists of five flows. Most integrations need all of them, but they can be built and released one at a time.

| Flow | Direction | Mechanism |
| --- | --- | --- |
| In-store sales | POS → Omnium | `POST /api/Orders` |
| Returns | POS → Omnium | Return on an existing order, or a POS order carrying a return order form |
| Order transfer (click & collect, ship from store) | Omnium → POS | Delta search or webhook, then status updates back |
| Store inventory | POS → Omnium | Nightly full sync plus delta updates |
| Change notifications | Omnium → POS | Event subscriptions (webhooks, queues) |

Each column below is a system and each band is a use case. Arrows run from the system that makes the call, so the direction tells you which side does the work.

Order integration patterns. A return is registered against whichever Omnium order the goods were sold on, whatever channel that order came from — or as an order-less return when there is none.

* * *

## 1\. Agree on the division of labour

This is the most important step, and it happens before any code is written. Omnium and the POS can both reduce stock, both capture payments, and both credit a return. When it is not explicit which system does what, the result is double-counted stock and double refunds.

Answer these four questions and write the answers down. They vary from case to case — there is no single correct setup.

### Who owns store stock?

In most POS integrations the POS is the master for stock in physical stores, while a central warehouse is mastered by an ERP or WMS. Omnium then holds the aggregated picture used for online availability and allocation.

Decide per warehouse, not per tenant. A single Omnium tenant commonly has POS-mastered store warehouses and ERP-mastered central warehouses side by side.

### Is inventory reduced by the order workflow, or pushed by the POS?

|  | Model A — Omnium reduces in the workflow | Model B — POS pushes the reduction |
| --- | --- | --- |
| **What reduces stock** | [Inventory workflow steps](../../Order/workflow-steps/inventory.md) on the order statuses | The POS sends the movement to the Inventory API |
| **Configure** | `IncreaseReservedInventory` on `New`, `ReduceInventoryAndReservedInventory` on the fulfilled status, `ReduceReservedInventory` on cancellation | Leave the inventory steps inactive for the statuses the POS owns |
| **The other system must** | Not report the same movement back to Omnium | Not have inventory steps active for the same movement |
| **Best for** | Omnium-mastered warehouses, and click & collect where Omnium reserves stock at order time | POS-mastered store warehouses where the till is the authoritative event |

Both models are valid, but only one may be active for a given movement. If Omnium reduces stock in the workflow **and** the POS reports the same sale in its inventory push, the store's stock in Omnium drifts down by twice the sold quantity.

### Which payments are handled where?

This matters most for returns, cancellations and crediting, where a wrong answer means the customer is refunded twice or not at all.

| Scenario | Payment taken by | Refund/credit issued by |
| --- | --- | --- |
| In-store sale | POS at the till | POS at the till |
| Online order, prepaid, picked in store | Payment provider via Omnium workflow | Omnium (`CreditReturn`) |
| Click & collect paid on pickup | POS at the till | POS at the till |
| Online order returned in store | Payment provider via Omnium workflow | Either — decide, and register the result in the other system |
| Order-less return in store | — | POS at the till |

For every scenario where the POS moves the money, Omnium must still be told about it so order totals, available credit and reporting are correct — but Omnium must not attempt the refund itself. That is the difference between `creditPayment: true` and `creditPayment: false` in [step 5](pos-integration.md#returns-on-an-existing-order).

### Which system owns identifiers?

Decide whether the POS receipt number becomes the Omnium order ID, or whether Omnium generates the order number and the POS reference is stored as an external ID. Either works, but the choice determines how you look up an order later:

```
"externalIds": [
    { "providerName": "Pos", "id": "OSL-1-2026-004512" }
]
```

Orders can be searched by external ID, which is how a POS finds "the order this receipt belongs to" without storing Omnium IDs itself.

* * *

## 2\. Know what is standard and what is tenant configuration

Very little of Omnium's order behaviour is fixed. Order types, order statuses, the workflow steps that run at each status, return types and return statuses are all **tenant configuration** — two tenants can respond quite differently to the identical API call. An integration that hardcodes `"Completed"` or a numeric return type will work in one tenant and quietly misbehave in the next.

Before writing code, get the tenant's configuration from whoever administers it, and treat these names as _input_ to your integration rather than constants in it.

### What Omnium fixes

These are the same in every tenant, and you can build on them directly.

| Fixed | Notes |
| --- | --- |
| Endpoint paths and HTTP verbs | The API surface itself |
| The order, return and inventory models | JSON property names such as `orderForm.lineItems`, `returnOrderForms`, `reservedInventory` |
| Payment transaction types | `Authorization`, `Capture`, `Sale`, `Credit`, `Invoiced`, `Void`. See [transaction types](../../Order/order-api.md#transaction-types) |
| The catalogue of workflow steps | Which steps _exist_ and what each one does. See [workflow steps](../../Order/workflow-steps.md) |
| Semantic status flags | `IsDeliveredStatus`, `IsCanceledStatus`, `IsInProgressStatus`, `IsPicked`. The flag names never change, so use them to work out what a tenant's own status names mean |
| Search parameters and paging limits | `ModifiedFrom`, `SelectedStores`, `Take` max 100, `Take * Page` max 10,000 |
| Event structure and operation IDs | See [Events](../../Integrations/events.md) |
| That `returnQuantity`, `quantity` and `updateStock` drive restocking | The mechanism is fixed; whether it fires depends on the return type |

### What the tenant configures

Every row here is a value you must obtain rather than assume.

| Configuration | What varies | Why the POS cares |
| --- | --- | --- |
| [Order types](../../Order/order-config.md#order-types) | Which types exist and what they are called | The `orderType` on every order you push must match one of them |
| [Order statuses](../../Order/order-config.md#order-statuses) | Names, sort order, semantic flags, allowed next statuses | The exact strings you send to `UpdateStatus`, and which transitions are legal |
| [Workflow steps per status](../../Order/workflow-steps.md) | Which steps are active on which status, and their properties | What actually happens when you change a status — capture, restock, notify, export |
| [Return types](../../Order/order-config.md#return-types) | The type IDs, whether each restocks (`UpdateInventory`), and return fees | The `returnType` on return lines, and whether stock moves at all |
| [Return statuses](../../Order/order-config.md#return-statuses) | Names and the workflow steps on each | The status you send to the return `UpdateStatus` call |
| [Return settings](../../Order/order-config.md#return-settings) | `DefaultUpdateStock`, `DefaultReturnOrderType`, shipping credit rules, one-charge-per-order | The defaults applied when you omit a field |
| [Payment methods](../../Markets/markets-config.md#payment-configuration) | Which methods exist per market, and their provider | `paymentMethodName` must match a configured method for capture and credit to work |
| [Shipment options](../../Markets/markets-config.md#shipment-options) | Method names and delivery types | `shippingMethodName` on shipments, and which options mean pickup rather than delivery |
| [Stores and warehouses](../../Stores.md) | IDs, store roles, external ID mapping, opening hours | `storeId` and `warehouseCode`, and which store the POS maps to |
| [Store roles](../../Stores/store-config.md#store-roles) | Which role IDs exist and their names | Which stores are eligible for ship-from-store and click & collect |
| [Markets](../../Markets.md) | IDs, currency, language, tax | `marketId` on every order |
| [Number options](../../Markets/markets-config.md#number-options) | Order and RMA number sequences | Whether Omnium assigns numbers or the POS supplies them |
| [Notifications](../../Order/workflow-steps/notifications/notification.md) | Templates and which statuses send them | Whether a status change you make emails or texts the customer |
| [Click & collect deadlines](../../Order/order-click-and-collect.md#deadlines) | Pick and pickup limits, per tenant or per store | When unpicked or uncollected orders are cancelled automatically |

Tenant settings are administered in the Omnium UI under **Configuration**, and are also reachable through the settings API (`GET /api/Settings`) if you want your integration to read them at startup rather than hold them in its own configuration.

### Key off the flags, not the status names

Because status names belong to the tenant, avoid branching on the string. A status called `Completed` in one tenant may be `Sent`, `CompleteFromPos` or `Levert` in the next, and a tenant may have several statuses that all mean "delivered".

What a status _means_ is carried by its flags — `IsDeliveredStatus`, `IsCanceledStatus`, `IsInProgressStatus`, `IsPicked`. Read the tenant's status list once, map its names onto the states your POS understands, and keep that mapping in configuration on your side.

### What to ask for before you start

A short list that saves a lot of guessing:

*   The order types the POS will read and write, and the full status list for each
*   Which statuses the POS is expected to set, and which workflow steps run on them
*   The return type IDs, and which of them restock
*   The return statuses, and which one completes a return
*   The payment method names to use for till payments and refunds
*   The store IDs and warehouse codes for every physical store, and the POS identifier each maps to
*   The market IDs the stores belong to
*   Whether inventory is reduced by the order workflow or pushed by the POS, per warehouse — see [step 1](pos-integration.md#is-inventory-reduced-by-the-order-workflow-or-pushed-by-the-pos)

* * *

## 3\. Configure stores and order types

### Stores

Create one Omnium store per physical store. Stores that hold stock and can fulfill orders need `isWarehouse: true`:

```
POST /api/Stores/AddMany

[
    {
        "id": "oslo-downtown",
        "name": "Oslo Clothes Downtown",
        "availableOnMarkets": ["nor"],
        "isWarehouse": true,
        "storeRoleIds": ["ship-from-store", "click-and-collect"],
        "address": {
            "streetName": "Universitetsgata",
            "streetNumber": "22",
            "zipcode": "0162",
            "city": "Oslo",
            "countryCode": "NO"
        },
        "externalIds": [
            { "providerName": "Pos", "id": "1042" }
        ]
    }
]
```

**Key properties for a POS integration:**

*   **isWarehouse** — required for the store to hold inventory and fulfill orders
*   **storeRoleIds** — controls which locations are eligible for ship-from-store and click & collect. See [store roles](../../Stores/store-config.md#store-roles)
*   **externalIds** — maps the Omnium store to the store or warehouse identifier used in the POS. Add one per POS identifier the store needs
*   **opening hours** — required for click & collect deadlines to be calculated at all. See [Click and Collect](../../Order/order-click-and-collect.md#deadlines)

Store opening hours must be set in Omnium for click and collect deadlines to work. A pick limit counted in opening hours never runs out in a store that never opens, so no deadline is set on the order.

### Order types

Order types drive workflows. A POS integration normally touches three or four of them, and the POS needs to treat each one differently.

| Order type | Description |
| --- | --- |
| Pos | Order from a Point of Sale system |
| Online | Order from B2B / B2C web portals — including ship-from-store |
| ClickAndCollect | Click and collect orders (not paid) |
| Bopis | Buy online, pick up in store (paid) |
| PreOrder | Orders placed for products that are not yet released |

Order types are free-text and configured per tenant, so the names above are conventions rather than fixed values. What matters is that every order you push carries an `orderType` that exists in the [order type configuration](../../Order/order-config.md#order-types), with a matching `status`.

A POS order type is usually the simplest one in the tenant — a completed sale needs no further processing:

```
"OrderTypes": [
  {
    "Name": "Pos",
    "EnableEdit": false,
    "EnableCreateFromCart": false,
    "OrderStatuses": [
      {
        "Name": "Completed",
        "DisplayName": "Completed",
        "IsMainFilter": true,
        "IsDeliveredStatus": true,
        "Order": 1,
        "WorkflowSteps": []
      }
    ]
  }
]
```

Add workflow steps to this status only for the work Omnium owns — restoring stock on returns, enriching line items from the product catalog, creating or updating the customer, or exporting to an ERP.

* * *

## 4\. Push POS sales to Omnium

### Create a POS order

A till transaction is created with the regular order endpoint. Set `orderType` and `status` explicitly — a completed sale needs no further processing, so it goes straight to the POS order type's completed status:

```
POST /api/Orders

{
    "id": "OSL-1-2026-004512",
    "orderNumber": "OSL-1-2026-004512",
    "orderType": "Pos",
    "status": "Completed",
    "marketId": "nor",
    "storeId": "oslo-downtown",
    "billingCurrency": "NOK",
    "customerId": "4791234567",
    "customerName": "Ola Nordmann",
    "customerPhone": "4791234567",
    "salesPersonId": "kari.hansen@example.com",
    "salesPersonName": "Kari Hansen",
    "orderForm": {
        "lineItems": [
            {
                "lineItemId": "1",
                "code": "yellow-tshirt-medium",
                "placedPrice": 299.00,
                "quantity": 2,
                "taxRate": 25
            }
        ],
        "shipments": [
            {
                "shipmentId": "1",
                "shippingMethodName": "InStore",
                "warehouseCode": "oslo-downtown",
                "lineItems": [
                    {
                        "lineItemId": "1",
                        "code": "yellow-tshirt-medium",
                        "placedPrice": 299.00,
                        "quantity": 2,
                        "taxRate": 25
                    }
                ]
            }
        ],
        "payments": [
            {
                "paymentMethodName": "Card",
                "transactionId": "OSL-1-TERM-3-8891",
                "transactionType": "Sale",
                "status": "Processed",
                "amount": 598.00
            }
        ],
        "properties": [
            { "key": "PosTerminalId", "value": "OSL-1-TERM-3" }
        ]
    }
}
```

**Required properties:** `id`, `orderNumber`, `orderType`, `storeId` and `marketId`. Both the `orderType` and the `status` must exist in the tenant's [order type configuration](../../Order/order-config.md#order-types) — see [step 2](pos-integration.md#what-the-tenant-configures).

**Key points:**

*   **transactionType: "Sale"** — the correct type for POS payments, where the money is taken immediately at the till. There is no separate authorization and capture step. Use `Authorization` only for e-commerce checkouts
*   **storeId vs warehouseCode** — `storeId` on the order is where the sale happened; `warehouseCode` on the shipment is where the goods came from. For a plain in-store sale they are the same store
*   **placedPrice and taxRate** — set only these two price fields per line and let Omnium calculate the rest. See [price properties](../../Order/order-api.md#price-properties)
*   **salesPersonId / salesPersonName** — carry the till operator through so sales can be attributed. `SalesPersonId` is a searchable filter on order search
*   **properties** — a natural place for terminal IDs, till numbers and receipt references that have no dedicated field

The same endpoint covers till transactions that are not finished at the counter. An endless-aisle sale taken at the till but shipped from another warehouse is the same call with `status` set to the POS order type's opening status, usually `New`, so the fulfilment workflow picks it up.

### Batch and backfill

| Endpoint | Use for |
| --- | --- |
| `POST /api/Orders/AddMany` | Pushing a batch of new orders in one request |
| `POST /api/Orders/ImportMany` | Migrating historical orders from the POS at go-live |

### Make the push idempotent

Tills go offline and retry. Keep the order ID deterministic — derived from store, terminal and receipt number — so a retry targets the same order rather than creating a duplicate. Before creating, you can check existence cheaply:

```
HEAD /api/Orders/OSL-1-2026-004512/Exists
```

`200 OK` means the order already exists; `404 Not Found` means it is safe to create.

### Scanning barcodes instead of SKUs

If the POS identifies products by GTIN rather than SKU, add the [`EnrichOrderFromProductGtins`](../../Order/workflow-steps/enrichment/enrich-order-from-product-gtins.md) workflow step to the `New` status. It looks up the product catalog by GTIN and populates SKU, name and product data on the line items. For SKU-based line items, [`EnrichOrderFromProducts`](../../Order/workflow-steps/enrichment/enrich-order-from-products.md) does the same job.

* * *

## 5\. Register returns in Omnium

Returns at the till come in two shapes, and they use different mechanisms. Which one applies depends on whether the original order exists in Omnium.

### Pure returns (order-less returns)

A customer returns goods with no order to attach them to — no receipt, a receipt from before the integration went live, or a POS that does not carry the original sale.

Push the receipt as an order that _carries_ the return: no order lines, and a `returnOrderForms` entry holding the returned items and the refund. Do not create an empty order first and then add a return to it as a separate call.

**1\. Create the order carrying the return**, with the return form in a placeholder status:

```
POST /api/Orders/AddMany

[
    {
        "id": "OSL-1-2026-004530",
        "orderNumber": "OSL-1-2026-004530",
        "orderType": "Pos",
        "storeId": "oslo-downtown",
        "marketId": "nor",
        "billingCurrency": "NOK",
        "returnOrderForms": [
            {
                "returnId": "8f14e45f-ceea-467a-9575-9a1f6b1c2d3e",
                "status": "New",
                "storeId": "oslo-downtown",
                "returnType": "StandardReturn",
                "creditPayment": false,
                "total": 299.00,
                "lineItems": [
                    {
                        "lineItemId": "1",
                        "code": "yellow-tshirt-medium",
                        "displayName": "Yellow T-Shirt - Medium",
                        "quantity": 1,
                        "returnQuantity": 1,
                        "placedPrice": 299.00,
                        "extendedPrice": 299.00,
                        "taxRate": 25,
                        "returnType": "StandardReturn",
                        "returnReason": "Wrong size",
                        "updateStock": true
                    }
                ],
                "payments": [
                    {
                        "amount": 299.00,
                        "paymentMethodName": "PaidInStore",
                        "transactionType": "Credit",
                        "status": "Processed"
                    }
                ]
            }
        ]
    }
]
```

**2\. Complete the return** so the return workflow runs:

```
POST /api/Returns/OSL-1-2026-004530/UpdateStatus

{
    "returnId": "8f14e45f-ceea-467a-9575-9a1f6b1c2d3e",
    "status": "Completed"
}
```

**Key points:**

*   **returnId** — an ID you generate, typically a GUID. It is what the `UpdateStatus` call references
*   **quantity and returnQuantity** — set both on every return line. The inventory adjustment is based on `quantity`
*   **updateStock: true** — has Omnium add the item back to inventory at the return form's `storeId`. Stock is only adjusted when the `returnType` is also configured with `UpdateInventory` enabled
*   **returnType** — a return type ID from your tenant's [return settings](../../Order/order-config.md#return-types), on both the return form and each line
*   **creditPayment: false** — the till already refunded the customer. Record what was refunded as a `Credit` transaction on the return form. The credit step logs a warning that there is nothing to credit, which is expected here
*   **rmaNumber** — omit it and one is generated

The second call runs the workflow configured for that return status, which typically generates the RMA, increases inventory, creates a credit note, updates the order status and sends notifications. Set `"isNotificationsDisabled": true` on the order to suppress the notifications on a back-office registration.

`orderNumber` must be unique. If an order with that number already exists, `AddMany` answers `200` with a "not added" message rather than an error, so check the response body and not just the status code.

See [Create an order-less return](../../Order/Returns/return-api.md#create-an-order-less-return) for the full property reference.

**Mixed receipts.** A single till transaction can contain both a sale and a return. Put the sold items in `orderForm.lineItems` and the returned items in `returnOrderForms[0].lineItems` on the same order — the shape Omnium's own POS connectors use when importing till transactions ([Front Systems](../../plugins/POS/FrontSystems.md#sales-order-mapping) has a worked mapping). When the POS pushes such a receipt as an already-completed order, the returned items can be restocked by the order workflow instead, using the [`CheckPosOrderForReturnAndIncreaseInventory`](../../Order/workflow-steps/inventory/check-pos-order-for-return-and-increase-inventory.md) step on the completed status. It is idempotent, so re-running the workflow does not double-count.

Skip the stock handling entirely when the POS is the stock master and reports the increase itself through the Inventory API — that is the same division-of-labour decision as in [step 1](pos-integration.md#is-inventory-reduced-by-the-order-workflow-or-pushed-by-the-pos).

Returns without an existing order can also be created from the Omnium UI, from the return list. Omnium creates a placeholder order to hold the return; the order type it gets is set with `DefaultReturnOrderType` in [return settings](../../Order/order-config.md#return-settings).

### Returns on an existing order

When the original order is in Omnium — an online order, a click & collect order, or an earlier POS sale — register the return against it. This keeps the returned quantities, credits and reporting on the original order.

**1\. Find the order.** Search on whatever the customer can produce at the counter:

```
POST /api/Orders/Search

{
    "OrderNumber": "ORD-12345",
    "DisableFacets": true
}
```

Other useful filters for a counter lookup are `Phone`, `Email`, `CustomerId` and `ExternalIds` — the last one being how you find an order by its POS receipt reference.

**2\. Create the return:**

```
POST /api/Returns/ORD-12345/Return

{
    "returns": [
        {
            "lineItemId": "1",
            "returnQuantity": 1,
            "returnReason": "Wrong size",
            "returnType": "StandardReturn",
            "isStockUpdated": true
        }
    ],
    "storeId": "oslo-downtown",
    "creditPayment": false,
    "creditShipment": false,
    "rmaNumber": "OSL-1-2026-004530",
    "comment": "Returned at Oslo Downtown, refunded on card at the till"
}
```

**3\. Advance the return through its workflow:**

```
POST /api/Returns/ORD-12345/UpdateStatus

{
    "status": "Completed",
    "returnId": "ret-12345"
}
```

The `returnId` comes from the create-return response. The response to `UpdateStatus` lists which [return workflow steps](../../Order/Returns/return-workflow-steps.md) ran and whether they succeeded — check `isAborted` and the individual results.

### The two fields that encode the division of labour

Two fields on the return decide whether Omnium acts or merely records. Getting them wrong is what causes double refunds and double stock.

| Field | Set to `true` when | Set to `false` when |
| --- | --- | --- |
| `creditPayment` | Omnium should refund the original payment method. The [`CreditReturn`](../../Order/Returns/return-workflow-steps/payment/credit-return.md) step submits the refund to the payment provider | The POS already refunded the customer at the till |
| `isStockUpdated` | Omnium should add the returned goods back to inventory | The POS is the stock master and will report the increase itself |

When the POS refunds at the till but the order lives in Omnium, set `creditPayment: false` and register the refund on the order so its totals and available credit stay correct:

```
POST /api/Orders/ORD-12345/AddPayments

[
    {
        "paymentMethodName": "Card",
        "transactionId": "OSL-1-TERM-3-8905",
        "transactionType": "Credit",
        "status": "Processed",
        "amount": 299.00
    }
]
```

Cross-channel returns are where this goes wrong most often. A customer who paid online with an invoice provider and is handed cash in store has been refunded once — but if `creditPayment` is left `true`, Omnium credits the provider as well. Decide per payment method which system refunds, and encode it in the request.

Return types can also carry the inventory decision: a return type configured with `UpdateInventory: false` never restocks, regardless of the request. Use them for damaged goods that must not go back on the shelf. See [return types](../../Order/order-config.md#return-types).

* * *

## 6\. Transfer orders from Omnium to the POS

Orders that the store has to act on — pick, hand over, or pack and ship — need to reach the POS. Before building the transfer, be clear on which order types the store will see, because the POS handles them differently.

### Order types the store acts on

**Online with ship from store.** An online order allocated to a physical store's warehouse. The store picks, packs and ships it to the customer.

*   The shipment's `warehouseCode` is the store — this is what tells you the order belongs to that store
*   The order carries the customer's delivery address, on the order and on the shipment
*   Allocation to the nearest or best-stocked store is handled upstream by Omnium's [allocation workflow steps](../../Order/workflow-steps/allocation.md), so the POS only reads the result
*   The store completes it with tracking information

**Click and collect.** An order placed online and collected in store, usually unpaid at order time.

*   Omnium reserves the stock when the order is created and sends a confirmation to the customer
*   No shipping address — the customer comes to the store
*   The store picks, sets the order ready for pickup, and completes it when the customer collects and pays
*   Pickup and pick deadlines apply, and expired orders are cancelled automatically by the `CancelExpiredClickCollectScheduledTask` scheduled task. See [Click and Collect](../../Order/order-click-and-collect.md)

The practical difference for the POS: a ship-from-store order ends with a parcel and a tracking number, a click & collect order ends with a customer at the counter and possibly a payment.

### Delta search

Poll Omnium for orders the store has not yet processed. Filtering on `ModifiedFrom` catches both new orders and changes to orders already sitting in the store's queue:

```
POST /api/Orders/Search

{
    "ModifiedFrom": "2026-09-03T08:00:00Z",
    "SelectedStores": ["oslo-downtown"],
    "SelectedStatuses": ["New", "InProgress", "ReadyForPickup"],
    "SortOrder": "ModifiedAscending",
    "Take": 100,
    "Page": 1,
    "DisableFacets": true
}
```

**Response:**

```json
{
    "result": [ /* array of OmniumOrder objects */ ],
    "totalHits": 7
}
```

**Key parameters:**

*   **ModifiedFrom** — inclusive (greater than or equal to). Persist the timestamp of your last successful run and use it as the next `ModifiedFrom`
*   **SelectedStores** — one query per store, so each till only pulls its own work
*   **SelectedStatuses** — the statuses the store still has to act on. Once an order reaches a terminal status it drops out of the result
*   **OrderType** — an optional filter that takes a single order type. Add it and run one query per type if the POS handles ship-from-store and click & collect through different screens
*   **SortOrder: "ModifiedAscending"** — process changes chronologically, so a checkpoint is always safe to resume from
*   **DisableFacets** — always `true` for integration queries. Facet computation is expensive and the POS does not need it
*   **Take** — maximum 100 per page, and `Take * Page` cannot exceed 10,000

**Checkpointing.** Store the last successfully processed timestamp, not the time the job ran. Poll with a small overlap and deduplicate on order ID plus status, so an order that changes mid-run is never skipped.

**Backfill and recovery.** For the initial load, or after downtime longer than your search window allows, use the scroll endpoint instead:

```
POST /api/Orders/Scroll

{
    "SelectedStores": ["oslo-downtown"],
    "SelectedStatuses": ["New", "InProgress", "ReadyForPickup"]
}
```

The response contains a `scrollId`. Fetch subsequent batches until the `result` array is empty:

```
GET /api/Orders/Scroll/{scrollId}
```

See [Scrolling](../../Integrations/scrolling.md) for the full pattern and its rate limits.

### Report progress back to Omnium

Every step the store takes should be reflected in Omnium, because the workflow attached to each status is what sends notifications, captures payment and adjusts inventory.

**Acknowledge receipt:**

```
POST /api/Orders/ORD-12345/UpdateStatus

{
    "status": "InProgress"
}
```

**Store the POS reference without triggering a workflow:**

```
PATCH /api/Orders/ORD-12345/PatchOrder

{
    "externalIds": [
        { "providerName": "Pos", "id": "POS-ORD-98122" }
    ]
}
```

`PatchOrder` updates only the fields you send and runs no workflow steps — the right tool for references and metadata.

**Click and collect — ready for pickup:**

```
POST /api/Orders/ORD-12345/UpdateStatus

{
    "status": "ReadyForPickup"
}
```

Include the [`SetShipmentOrOrderReadyForPickup`](../../Order/workflow-steps/inventory/set-shipment-or-order-ready-for-pickup.md) step on this status. It clears the store pick deadline so the automatic cancellation task leaves the order alone. Reaching this status also starts the customer pickup deadline and typically triggers the notification telling the customer their order is ready.

**Click and collect — collected:**

```
POST /api/Orders/ORD-12345/UpdateStatus

{
    "status": "Completed"
}
```

If the customer paid at the till, add the payment to the order first with `POST /api/Orders/{orderId}/AddPayments` using `transactionType: "Sale"`, so the order is fully paid before the completion workflow runs.

**Ship from store — shipped:**

```
POST /api/Orders/ORD-12345/UpdateStatus

{
    "status": "Completed",
    "shipmentInfo": {
        "shipmentId": "1",
        "trackingNumber": "BRING-789456123",
        "trackingUrl": "https://tracking.bring.com/tracking/BRING-789456123",
        "warehouseCode": "oslo-downtown"
    }
}
```

**Partial pick.** When the store can only fulfill part of the order, use `OrderLinesUpdate` to deliver some lines and leave the rest:

```
POST /api/Orders/ORD-12345/OrderLinesUpdate

{
    "status": "Completed",
    "lineItemUpdates": [
        { "lineItemId": "1", "deliveredQuantity": 2 },
        { "lineItemId": "2", "deliveredQuantity": 0 }
    ],
    "shipmentInfo": {
        "shipmentId": "1",
        "trackingNumber": "BRING-789456123",
        "warehouseCode": "oslo-downtown"
    }
}
```

**Cancel what the store cannot deliver:**

```
POST /api/Orders/ORD-12345/OrderLines/2/Cancel?sendNotifications=true
```

Set `skipRunWorkflow: true` on `UpdateStatus` when you are only mirroring a status the POS already acted on, and the workflow's side effects — notifications, payment capture, inventory changes — have already happened elsewhere. Leave it `false` whenever you want Omnium to do the work.

* * *

## 7\. Synchronize inventory with the POS as master

When the POS owns store stock, Omnium needs a steady picture of it so online availability and allocation are correct. The recommended shape is a nightly full sync as a baseline, with delta updates during the day.

Inventory integration patterns. Model A and Model B are alternatives, never both — only one system may account for a given movement.

### Nightly full sync

```
PUT /api/Inventory/UpdateMany

[
    {
        "sku": "yellow-tshirt-small",
        "warehouseCode": "oslo-downtown",
        "inventory": 10,
        "location": "A3-B2"
    },
    {
        "sku": "yellow-tshirt-medium",
        "warehouseCode": "oslo-downtown",
        "inventory": 15
    },
    {
        "sku": "yellow-tshirt-large",
        "warehouseCode": "oslo-downtown",
        "inventory": 12
    }
]
```

**Key behaviors of UpdateMany:**

*   **Upsert** — creates inventory items that do not exist yet and updates the ones that do
*   **Change detection** — items whose values have not actually changed are skipped, which is what makes a full nightly sync cheap even with large catalogs
*   **Preserves reserved inventory** — `reservedInventory` is left untouched by default (`isReservedInventoryOverwritten` defaults to `false`)
*   **Transaction logging** — every real change writes an inventory transaction for auditing
*   **Batch size** — use 1,000 items per request

Send absolute quantities, not deltas. A full sync is a correction mechanism: it repairs whatever drift accumulated during the day.

Avoid creating inventory items with a value of zero for SKUs a store has never carried. A missing inventory item is treated as zero, and skipping them keeps the item count — and sync times — down.

### Delta changes during the day

For near-real-time updates, send only the SKUs that changed, using the same endpoint and absolute values:

```
PUT /api/Inventory/UpdateMany

[
    { "sku": "yellow-tshirt-medium", "warehouseCode": "oslo-downtown", "inventory": 13 }
]
```

When the POS knows the movement rather than the resulting level — a goods receipt, a stock count correction, a returned item put back on the shelf — send a signed transaction instead:

```
POST /api/Inventory/ProcessInventoryTransactions

[
    {
        "skuId": "yellow-tshirt-medium",
        "warehouseCode": "oslo-downtown",
        "inventoryChange": -1,
        "reason": "POS sale OSL-1-2026-004512"
    },
    {
        "skuId": "yellow-tshirt-large",
        "warehouseCode": "oslo-downtown",
        "inventoryChange": 4,
        "reason": "Goods receipt from central warehouse"
    }
]
```

**Key fields:**

*   **inventoryChange** — the delta: positive for additions, negative for removals
*   **reason** — written to the transaction history, and worth populating with the receipt or document number that caused the movement
*   **orderId** — optional link to a related order
*   **adjustReservedInventory** — whether the delta should also adjust reserved inventory. Leave it off unless the POS owns reservations

### Do not disturb reservations

Omnium's order workflows maintain `reservedInventory` for orders that are placed but not yet fulfilled — click & collect orders waiting to be picked, online orders waiting to be packed. That reserved quantity is what stops the same last item being sold twice, in two channels.

Never send `isReservedInventoryOverwritten: true` from a POS integration unless the POS is also the master for reservations. Overwriting reservations releases stock that is already promised to a customer, and the next online order can sell an item the store has already set aside.

Some POS systems report a single net "available" figure with in-store reservations already subtracted. If yours does, Omnium receives the net number as physical stock and has no separate visibility of those reservations — worth knowing when the quantity in Omnium is lower than the count the store sees on its own screen.

If reserved quantities do drift out of step, the [`RecalculateReservedInventory`](../../Order/workflow-steps/inventory/recalculate-reserved-inventory.md) workflow step rebuilds them from the open orders.

### Reading inventory back from Omnium

If the POS also needs Omnium's view — for endless-aisle lookups, or to show stock in other stores at the till — use a delta query:

```
POST /api/Inventory/Search

{
    "lastModified": "2026-09-03T08:00:00Z",
    "isBatchesExcluded": true
}
```

When `totalHits` exceeds 2,000 the response contains a `scrollId`. Fetch the remaining items in batches of 2,000:

```
GET /api/Inventory/Scroll/{scrollId}
```

Set `isBatchesExcluded: true` unless you need batch data — it significantly reduces the payload.

The `inventory` field returned by the Product Search API is a snapshot copied onto the product by a scheduled task, not live inventory. For current quantities, query the Inventory API. See [inventory handling in product search](../../Inventory/inventory-api.md#inventory-handling-in-product-search-api).

* * *

## 8\. Subscribe to changes with webhooks

Delta polling is simple and reliable, but a store waiting on a new click & collect order should not wait for the next poll. Subscribe to events for the changes that need to reach the till immediately, and keep polling as a safety net.

### Configure a subscription

In the Omnium UI, go to **Configuration → Event subscriptions** and create a subscription:

| Field | Value | Description |
| --- | --- | --- |
| **Name** | `POS Order Sync` | Human-readable name |
| **Connector** | `Webhook` | Delivery mechanism |
| **Base URL** | `https://your-pos.example.com` | Your endpoint host |
| **Request URI** | `/api/webhooks/omnium-orders` | Your webhook path |
| **HTTP Verb** | `POST` | HTTP method |

Then filter so each subscription only delivers what it is for:

| Filter | Example values |
| --- | --- |
| **Class Names** | `Order` |
| **Categories** | `Created`, `Updated`, `Workflow` |
| **Statuses** | `New`, `ReadyForPickup`, `OrderCanceled` |
| **Order types** | `ClickAndCollect` |
| **Stores** | `oslo-downtown` |
| **Markets** | `nor` |

Custom HTTP headers can be added to the subscription for authenticating the incoming request on your side.

Besides webhooks, the same subscriptions can deliver to **Azure Storage Queues**, **Azure Service Bus** and **Apache Kafka** — useful when the POS backend prefers to consume a queue rather than expose an endpoint.

### The payload is metadata, not the order

```json
{
    "timestamp": "2026-09-03T07:23:07.638Z",
    "operationId": 111102,
    "message": "Workflow completed",
    "className": "Order",
    "subClassName": "ClickAndCollect",
    "objectId": "ORD-12345",
    "objectNumber": "ORD-12345",
    "category": "Workflow",
    "market": "nor",
    "storeId": "oslo-downtown",
    "status": "New",
    "previousStatus": "",
    "isError": false,
    "origin": "POST /api/Cart/CreateOrderFromCart/"
}
```

Use `objectId` to fetch the full order with `GET /api/Orders/{id}`. The event tells you _that_ something happened and _where_; it never carries the order itself.

### What a POS integration typically subscribes to

| Purpose | Filter on |
| --- | --- |
| New work for the store | `Order`, order type `ClickAndCollect` / `Online`, status `New`, filtered to the store |
| Order cancelled centrally or by the customer | `Order`, status matching your cancelled status |
| Pickup deadline expired and order auto-cancelled | `Order`, cancelled status, filtered to click & collect |
| Failures needing attention | A separate subscription filtered to `isError: true` |

### Reliability

*   **Retries** — the default policy is 3 attempts with 1, 5 and 15 second delays. Responses in the 200–299 range, plus 400 and 404, are not retried. Return a fast `200` and process asynchronously
*   **Deduplicate** — retries and overlapping delta polls both mean the same change can arrive twice. Use the event `id`, or the order ID plus status, as an idempotency key
*   **Monitor** — every subscription execution writes an event with operation ID `290100`. Browse events in the UI under **Configuration → Advanced → Events**
*   **Poll anyway** — a delta search every few minutes catches anything a webhook failed to deliver. Events for speed, polling for completeness

See [Events](../../Integrations/events.md) for the full event structure and operation ID reference.

* * *

## 9\. Best practices

### Reliability

*   **Combine webhooks with delta polling** — webhooks for latency, polling as the safety net
*   **Persist the last successful timestamp**, not the job's start time, and resume from it
*   **Keep order IDs deterministic** so an offline till's retry updates rather than duplicates
*   **Handle `409 Conflict`** with a short backoff — it means another operation holds the order
*   **Implement exponential backoff** for `429` rate-limit responses

### Data integrity

*   **Never overwrite `reservedInventory`** from the POS unless the POS owns reservations
*   **One system per movement** — either the workflow reduces stock or the POS reports it, never both
*   **Use `creditPayment: false`** whenever the till already refunded the customer, and record the refund as a `Credit` transaction on the order
*   **Use `PatchOrder` for references and metadata** — it does not run workflows
*   **Use external IDs** on orders, returns and stores to link Omnium and POS records in both directions

### Performance

*   **`DisableFacets: true`** on every integration search
*   **Batch inventory in 1,000-item requests**, and let change detection skip the unchanged
*   **`isBatchesExcluded: true`** on inventory searches that do not need batch data
*   **Scroll for backfills**, delta search for steady state — and always finish a scroll so its context is released

### Monitoring

*   **Subscribe to error events** with a dedicated subscription filtered to `isError: true`
*   **Check the event log** under **Configuration → Advanced → Events**, or with `POST /api/EventLog/Search`
*   **Read workflow results** — order and return status updates both return which steps ran; check `isAborted` rather than assuming success from the HTTP status

* * *

## Next Steps

Your POS integration now covers:

✅ An explicit division of labour for stock and payments ✅ In-store sales pushed to Omnium as POS orders ✅ Order-less returns and returns against existing orders ✅ Click & collect and ship-from-store orders transferred to the store and reported back ✅ Store inventory synchronized with full and delta updates ✅ Real-time change notifications through event subscriptions

For more details on specific topics:

*   [Order Guide](../../Order/order-api.md) — the order model, payments, discounts and pricing
*   [Order Configuration](../../Order/order-config.md) — order types, statuses and workflow configuration
*   [Click and Collect](../../Order/order-click-and-collect.md) — deadlines, picking and automatic cancellation
*   [Returns](../../Order/Returns/return-api.md) — the full Return API reference
*   [Inventory](../../Inventory.md) — reservations, ATP, stock buffers and virtual stock locations
*   [Events & Webhooks](../../Integrations/events.md) — event structure and subscription configuration
*   [Data Out](../../Integrations/data-out.md) — delta query and export patterns
*   [POS Plugins](https://docs.omnium.no/docs/plugins/POS) — ready-made integrations for Sitoo, Front Systems and Flow

For the full interactive API reference, see the [swagger documentation](https://api.omnium.no/documentation/index.html).
