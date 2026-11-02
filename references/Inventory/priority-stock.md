# Priority Stock

Source: https://docs.omnium.no/docs/Inventory/priority-stock

> Mark units in a store's inventory as priority stock so allocation sells them first, for example a return the store took in for a product it does not carry.

Priority stock is the part of a warehouse's inventory that Omnium should sell before anything else. A typical case: as a service to the customer, a store accepts a return of a product that is outside its assortment. The returned unit lands in the store's inventory, where the store has no regular way to sell it. Marked as priority stock, the unit stays sellable from that store even though the store does not carry the product, so a click and collect order for it is accepted. When allocation is set up to prefer priority stock, ship-from-store orders for the product go to that store before the warehouse that would normally win, so the store is not left holding the unit.

Priority stock is a count on each inventory item (one SKU at one warehouse), next to the physical and reserved inventory. It is not a separate warehouse or a separate stock figure: the priority units are part of `inventory`.

* * *

## How the priority count behaves

*   The count is never more than the stock on hand. Omnium caps it whenever the stock drops below it.
*   Any stock reduction uses up priority units first. A unit that is sold, shipped, counted out, or transferred away lowers the priority count before the regular stock, until the count reaches 0.
*   Reserved units count against priority first. A priority unit reserved for an order stops attracting new orders, and attracts them again if the order releases the reservation.
*   Stock increases never add priority. Only the actions described below mark units as priority stock.

The count belongs to one SKU at one warehouse. A reduction of another SKU at the same store does not affect it.

### Example

A store takes in a return of one unit and marks it as priority stock. A click and collect order then reserves the unit, and the customer picks it up.

| Event | Inventory | Reserved | Priority count | Priority units free to allocate |
| --- | --- | --- | --- | --- |
| Return restocked as priority | 1 | 0 | 1 | 1 |
| Click and collect order reserves the unit | 1 | 1 | 1 | 0 |
| Order picked up, stock reduced | 0 | 0 | 0 | 0 |

If the order is cancelled before pickup, the reservation is released and the unit is free to allocate again.

A store holding three regular units and one priority unit (inventory 4, priority count 1) that sells one unit over the counter is left with inventory 3 and priority count 0. The count cannot tell units apart, so the first reduction always uses up priority.

* * *

## Mark returned units as priority stock

The [Update Inventory](../Order/Returns/return-workflow-steps/inventory/update-inventory.md) return workflow step (`UpdateInventory`) restocks returned units in the store that receives the return. It marks the restocked quantity as priority stock when either of these settings applies:

| Setting | Where | Marks as priority stock |
| --- | --- | --- |
| `PriorityInventoryOutsideAssortment` | Property on the `UpdateInventory` step in the return workflow | Units of a product that is outside the receiving store's assortment |
| `IsPriorityInventory` | Return type, shown as the **Priority stock** switch on the return type | Every unit restocked with that return type |

Neither setting is on by default. A product is outside a store's assortment when its `storeIds` list is not empty and does not include the store, or when the store's assortment categories leave the product out.

For the return type settings, see [Return types](../Order/Returns/return-config.md#return-types).

* * *

## Set priority stock manually

### In the Omnium UI

In the inventory view of a product, open the cell for the variant and warehouse, and set **Priority stock**. The change is saved as an inventory transaction with the reason from the change bar. A value above the stock on hand is capped at the stock when you save.

### Through the API

| Method | Endpoint | Description |
| --- | --- | --- |
| PATCH | `/api/Inventory` | Set `priorityInventory` on one existing inventory item |
| PATCH | `/api/Inventory/PatchMany` | Set `priorityInventory` on several existing inventory items |
| POST | `/api/Inventory/ProcessInventoryTransactions` | Add to or subtract from the count with `priorityInventoryChange`. Creates the inventory item if it does not exist |

Set the count on one item. The value is capped at the item's inventory, and the item must already exist:

```
PATCH /api/Inventory
Content-Type: application/json
```

```json
{
  "skuId": "BK-20431-M",
  "warehouseCode": "OsloCity",
  "priorityInventory": 1
}
```

Restock a returned unit and mark it as priority stock in the same delta update. `priorityInventoryChange` is applied after `inventoryChange`:

```json
[
  {
    "skuId": "BK-20431-M",
    "warehouseCode": "OsloCity",
    "inventoryChange": 1,
    "priorityInventoryChange": 1,
    "reason": "Return received in store"
  }
]
```

When you add or update whole inventory items (`POST /api/Inventory`, `POST /api/Inventory/AddMany`, `PUT /api/Inventory/Update`, `PUT /api/Inventory/UpdateMany`, `PUT /api/Inventory/UpdateManyWithMetadata`), `priorityInventory` is only read for items that do not exist yet. For existing items Omnium keeps the stored count, so an integration that sends full stock snapshots does not reset it. A lower `inventory` in such an update still uses up priority units first. When the tenant [applies virtual stock location rules to API inventory updates](virtual-stock-locations.md#applying-rules-to-api-inventory-updates), `AddMany`, `UpdateMany`, and `UpdateManyWithMetadata` turn whole items into stock changes and do not read `priorityInventory`. `POST /api/Inventory` and `PUT /api/Inventory/Update` do so only for items whose warehouse has virtual stock locations with a matching rule.

Inventory items returned by the API include `priorityInventory`. Inventory transactions include `priorityInventoryChange` for changes made through delta updates, whole-item updates, the Omnium UI, and returns. Changes made with PATCH are not logged as inventory transactions.

* * *

## Prefer priority stock in allocation

### Allocation profiles

When you allocate with allocation profiles, add the **Priority stock first** objective (`PriorityInventory`) to the profile. Place it in a tier before **Store priority** (`WarehousePriority`) to send an order to the store holding priority stock instead of the warehouse ranked first.

On orders where no warehouse holds priority stock, the objective scores every plan the same and has no effect. When the priority stock sits at a store that cannot ship the whole order, Omnium also evaluates split plans for profiles with this objective, as long as the profile allows splitting and the split stays within its maximum number of shipments. With the objective alone in the first tier, it also outranks **Fewest shipments** (`SplitCount`), so an order may be split to ship the priority unit from the store.

### TrySplitUnreservedOrderLines

Set `PrioritizePriorityInventory` to `true` on the [Try Split Unreserved Order Lines](../Order/workflow-steps/allocation/try-split-unreserved-order-lines.md) workflow step to try warehouses holding priority stock for the lines first. Among warehouses that cover as many lines from priority stock, the step keeps its usual warehouse order.

* * *

## Where priority stock overrides store restrictions

Priority stock is meant to be sold from the store that holds it. When a store's priority stock covers the full quantity of a line, the restrictions below no longer rule the store out. Which restrictions apply depends on where the line is checked:

| Restriction | Allocation profiles | [Inventory Validator](../Carts/validation/cart-validators/inventory-validator.md) (carts) | `TrySplitUnreservedOrderLines` and reallocation steps |
| --- | --- | --- | --- |
| Product outside the store's assortment | Overridden (`storeIds` and assortment categories, when allocation applies the product assortment) | Overridden (`storeIds`) | Overridden (`storeIds`) |
| The store's [stock buffer](stock-buffer.md) | Overridden | Overridden | Not applied by these steps |
| `omniStockRules.minimumAvailableQuantity` on the store | Overridden | Not applied | Not applied |

The reallocation steps that check the product's assortment against the target warehouse include [Try Reallocate Entire Order](../Order/workflow-steps/allocation/try-reallocate-entire-order.md) and [Try Reallocate Entire Order to Specific Warehouse](../Order/workflow-steps/allocation/try-reallocate-entire-order-to-specific-warehouse.md). Other [OmniStock](omnistock.md) rules, such as excluded brands or categories, still apply to priority stock.

Outside the assortment, a store only offers its priority units. Its other stock of the product stays out of reach.

* * *

## See priority stock in the Omnium UI

*   Inventory badges on order lines, carts, and product lists show a flag badge with the priority count. The tooltip names the warehouses that hold it.
*   The inventory view of a product shows **Priority stock** per warehouse, and the warehouse filter offers **Have priority stock**.
*   The inventory transaction list shows the priority change next to the stock change.

* * *

## Related documentation

*   [Update Inventory return workflow step](../Order/Returns/return-workflow-steps/inventory/update-inventory.md)
*   [Return configuration](../Order/Returns/return-config.md)
*   [Try Split Unreserved Order Lines](../Order/workflow-steps/allocation/try-split-unreserved-order-lines.md)
*   [Inventory API reference](inventory-api.md)

For the full interactive API reference, see the [swagger documentation](https://api.omnium.no/documentation/index.html).
