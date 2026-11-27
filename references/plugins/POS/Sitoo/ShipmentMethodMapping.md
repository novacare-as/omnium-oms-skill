# Shipment Method Mapping

Source: https://docs.omnium.no/docs/plugins/POS/Sitoo/ShipmentMethodMapping

> How Omnium determines the shipment method for orders imported from Sitoo POS.

# Shipment Method Mapping

When Omnium imports an order from Sitoo, it must determine which **shipment method** (shipping option) to assign. The resolution is based on three inputs:

1.  **Order state** in Sitoo (`Closed` or `Open`)
2.  **`delivery-pickup-externalid`** in the Sitoo order's additional data (indicates a pickup order)
3.  **`delivery-carrier-productid`** in the Sitoo order's additional data (explicit carrier selection)

The shipment method is resolved against the **ShipmentOptions** configured on the Omnium market.

* * *

## Decision Flow

```
Order imported from Sitoo
│
├─ No order lines?  → No shipment created
├─ Return / ReturnAndNewSale?  → No shipment created
│
├─ Order state = Closed
│   └─ First ShipmentOption with DeliveryType = "PickUp"
│      Status = Released (already delivered)
│
└─ Order state = Open
    │
    ├─ delivery-pickup-externalid IS SET (Endless Aisle / BOPIS)
    │   ├─ Try: match DeliveryCarrierProductId → ShipmentOption by name or id
    │   └─ Fallback: first ShipmentOption with DeliveryType = "PickUp"
    │      Status = AwaitingInventory
    │
    └─ delivery-pickup-externalid IS NULL (regular delivery / BOSFS)
        ├─ Try: match DeliveryCarrierProductId → ShipmentOption by name or id
        └─ Fallback: first ShipmentOption with DeliveryType = "Delivery" where IsDefaultShipment = true
           └─ Fallback: first ShipmentOption with DeliveryType = "Delivery"
              Status = AwaitingInventory
```

* * *

## Scenario Details

### 1\. Closed Orders (already completed in POS)

Regular POS sales where the customer paid and took the goods in store arrive with order state `Closed`.

*   **Shipment method**: First shipment option on the market with delivery type **PickUp**
*   **Shipment status**: Released (the order is already fulfilled)
*   **Warehouse**: The Omnium warehouse mapped from the Sitoo store where the sale happened
*   **Pickup warehouse**: Set to the store's external ID

This covers the majority of Sitoo orders since most POS transactions are completed at the register.

### 2\. Open Orders with Pickup (Endless Aisle / BOPIS)

When a store associate creates an endless aisle order or a click-and-collect order, Sitoo sets `delivery-pickup-externalid` to the store where the customer will pick up the goods. The order state is `Open` because fulfillment hasn't happened yet.

*   **Shipment method selection**:
    1.  If `delivery-carrier-productid` is provided, find the shipment option whose shipping method name or ID matches that value
    2.  Otherwise, use the first shipment option with delivery type **PickUp**
*   **Shipment status**: AwaitingInventory
*   **Pickup warehouse**: Set to the value of `delivery-pickup-externalid` (the pickup store)
*   **Shipment address**: Overwritten with the pickup store's address

### 3\. Open Orders without Pickup (Home Delivery / BOSFS)

When the order should be shipped to the customer (e.g., endless aisle with home delivery or buy-online-ship-from-store), `delivery-pickup-externalid` is not set.

*   **Shipment method selection**:
    1.  If `delivery-carrier-productid` is provided, find the shipment option whose shipping method name or ID matches that value
    2.  Otherwise, use the first shipment option with delivery type **Delivery** and **IsDefaultShipment** enabled
    3.  If no default is configured, use the first shipment option with delivery type **Delivery**
*   **Shipment status**: AwaitingInventory

* * *

## Nshift Freight Fee Handling

Before the shipment method is resolved, Omnium checks for an Nshift freight fee line item on the Sitoo order (a product line in the "Freightfee" product group). If one is found and the shipping cost is zero, the freight fee amount is applied to the shipment's shipping subtotal and tax.

Nshift delivery properties and external IDs are also carried over to the shipment automatically.

* * *

## Configuration Requirements

For shipment method mapping to work correctly, ensure:

1.  **Market ShipmentOptions** include at least one option with delivery type **PickUp** (for POS and pickup orders)
2.  **Market ShipmentOptions** include at least one option with delivery type **Delivery** and preferably **IsDefaultShipment** enabled (for home delivery orders)
3.  If Sitoo sends `delivery-carrier-productid`, the corresponding shipment option must have a matching shipping method name or ID

* * *

## Summary Table

| Scenario | Order State | `delivery-pickup-externalid` | Method Resolution | Shipment Status |
| --- | --- | --- | --- | --- |
| Regular POS sale | Closed | n/a | First PickUp option | Released |
| Endless Aisle (pickup) | Open | Set (store ID) | Match by carrier product ID, or first PickUp option | AwaitingInventory |
| Endless Aisle (home delivery) / BOSFS | Open | Null | Match by carrier product ID, or default Delivery option | AwaitingInventory |
