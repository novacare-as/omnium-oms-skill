# Allocation API (BETA)

Source: https://docs.omnium.no/docs/Order/Allocation/allocation-api

> Ask the allocation engine which warehouses an order or basket would ship from, without changing the order, the cart, or inventory.

Beta

The allocation engine is in beta. Its behavior, settings, and API can change before general availability. To enable the engine in dev.omnium.no, please contact support.

The Allocation API runs the allocation engine as a simulation: it answers which warehouses (stores) an order or basket would ship from, how many shipments that makes, and which alternatives exist. Nothing is written - the order, the cart, and inventory are left as they are. A typical use is a checkout that wants to show delivery options or split-shipment information before the order is placed.

This is the same simulation the [allocation simulator](allocation-simulator.md) runs in the Omnium UI.

## Endpoints

| Method | Endpoint | Description |
| --- | --- | --- |
| POST | `/api/Allocation/Simulate` | Work out where an order or basket should ship from |

The endpoint requires the `Admin` or `ApiUser` role.

## Simulate allocation

Send exactly one subject:

*   `orderId` or `cartId` for an order or a cart that already exists in Omnium.
*   `order` or `cart` for a basket that does not exist in Omnium yet. A checkout normally sends the basket, since it does not exist in Omnium until the order is placed.

### Request

| Field | Type | Description |
| --- | --- | --- |
| `OrderId` | string | Id of an order in Omnium |
| `CartId` | string | Id of a cart in Omnium |
| `Order` | object | An order that is not stored in Omnium, in the same model as the [Order API](../order-api.md) |
| `Cart` | object | A basket that is not stored in Omnium, in the same model as the [Cart API](../../Carts/cart-api.md) |
| `ProfileKeys` | array | Additional profiles to rank the plans under, at most 10. Each adds a ranking after the primary profile's ranking. See [profiles](allocation-api.md#profiles) |
| `InventoryOverrides` | array | What-if availability per SKU and warehouse, at most 2000 entries. See [inventory overrides](allocation-api.md#inventory-overrides) |
| `ReplaceInventoryWithOverrides` | bool | When `true`, only the supplied availability is used and Omnium's own inventory is ignored. Default `false` |
| `Trigger` | string | The trigger the simulation runs as: `InitialAllocation` (default) or `Reallocation`. [Allocation rules](allocation-rules.md#scope-where-the-rule-is-used) scoped to a trigger only take part when it matches |
| `IncludeTrace` | bool | When `true`, the response includes the engine's full reasoning in `trace`. Default `false`, since the trace is large |

#### Profiles

A profile is a ranking policy. The **primary profile** decides `selectedPlan` and is always the first ranking. Omnium picks it in this order:

1.  The order's or cart's `requestedAllocationProfileKey`.
2.  The default profile in the allocation settings - set globally, and optionally overridden for the order's market or sales store.
3.  `Balanced`.

An unknown key is skipped and the next source is used. Profiles in `profileKeys` add more rankings after the primary one, so you can compare policies in one call. The plans are worked out once and each profile only orders them, so asking for three profiles costs little more than asking for one.

| Key | Ranks plans by |
| --- | --- |
| `Balanced` | A mix of fewest shipments, distance, shipping cost, delivery probability, warehouse priority, and keeping lines where they are |
| `FewestShipments` | Fewest warehouses first |
| `LowestCost` | Lowest estimated shipping cost first |
| `Closest` | Shortest distance to the customer first |
| `HighestDeliveryProbability` | Deepest stock first, so the shipments are most likely to be picked in full |
| `Greenest` | Mainly estimated emissions, with distance and number of shipments, then warehouse priority |

#### Inventory overrides

A checkout that already holds its own availability can pass it in `inventoryOverrides` instead of relying on Omnium's inventory. You can also use overrides to try a scenario, such as a warehouse running out of a product. The given values replace what Omnium holds for that SKU and warehouse; entries without a `skuId` or `warehouseId` are ignored.

| Field | Type | Description |
| --- | --- | --- |
| `SkuId` | string | The SKU, matching the order line code |
| `WarehouseId` | string | The warehouse (store) code |
| `Available` | decimal | Units available to promise |

### Example: simulate a basket at checkout

```
POST /api/Allocation/Simulate
Authorization: Bearer YOUR_API_KEY
Content-Type: application/json
```

```json
{
  "cartId": "C123456",
  "profileKeys": ["Closest"],
  "inventoryOverrides": [
    { "skuId": "1003456-42", "warehouseId": "S077", "available": 0 }
  ],
  "includeTrace": false
}
```

### Response

| Field | Type | Description |
| --- | --- | --- |
| `RequestId` | string | Identifies this run |
| `Outcome` | string | The result of the run. See [outcomes](allocation-api.md#outcomes) |
| `PrimaryProfileKey` | string | The profile that decided the selected plan |
| `SelectedPlan` | object | The plan at the top of the primary ranking. `null` when no plan was found |
| `Plans` | array | Every feasible plan. Rankings refer to them by `planId` |
| `Rankings` | array | One ordered list of plans per requested profile, the primary profile first |
| `UnallocatableLines` | array | Lines no warehouse could serve, each with the reasons why |
| `Trace` | array | The engine's reasoning. Only included when `includeTrace` is `true` |
| `ConfigurationVersion` | string | The version of the allocation configuration the decision was made against |
| `TotalMs` | long | How long the run took, in milliseconds |

#### Plan

| Field | Type | Description |
| --- | --- | --- |
| `PlanId` | string | Identifies the plan. The same decision gets the same id across runs |
| `Shipments` | array | The shipments the plan creates, one per warehouse and shipment |
| `EstimatedShippingCost` | decimal | Estimated internal shipping cost, when the shipping options carry costs |
| `TotalDistanceKm` | double | Total distance from the sending warehouses to the destination, when coordinates are known |
| `DeliveryProbability` | decimal | From 0 to 1: how likely it is that every shipment can be picked in full, given stock depth |
| `IsPartial` | bool | `true` when the plan leaves some lines unplaced |
| `ShipmentCount` | int | Number of shipments the plan creates |

#### Planned shipment

| Field | Type | Description |
| --- | --- | --- |
| `WarehouseId` | string | The warehouse code to ship from |
| `SourceShipmentId` | string | The existing shipment this replaces, when the order already had one |
| `ShippingMethodName` | string | The shipping method the plan chose, when it chose one |
| `AllowedShippingMethodNames` | array | Shipping methods that can be used from this warehouse |
| `TotalWeightKg` | double | Total weight of the shipment |
| `DistanceKm` | double | Distance from the warehouse to the destination, when coordinates are known |
| `Lines` | array | The order lines in the shipment |

#### Planned line

| Field | Type | Description |
| --- | --- | --- |
| `LineId` | string | The order line id |
| `SkuId` | string | The SKU |
| `Quantity` | decimal | The quantity this shipment carries |
| `ArrivesOn` | datetime | When the goods reach the warehouse, if they are not there yet |
| `PurchaseOrderId` | string | The purchase order the line waits for, if any |
| `PurchaseOrderLineId` | string | The purchase order line the quantity comes from |
| `DeliveryId` | string | The delivery within that purchase order |

#### Ranking

| Field | Type | Description |
| --- | --- | --- |
| `ProfileKey` | string | The profile this ranking is for |
| `SelectedPlanId` | string | The plan this profile would choose |
| `Plans` | array | The plans in order under this profile, best first. Each has `planId`, `score`, `labels`, and `breakdown` |

In a ranked plan, `score` runs from 0 to 1 and the lowest score ranks first, the same direction as rule priority. It is the score of the profile's first tier; later tiers only break ties. `breakdown` holds the score per objective across all tiers, where lower is also better. `labels` says what the plan is best at, for showing to a customer: `Recommended` marks the first plan in that ranking, and `FewestShipments`, `Cheapest`, `Closest`, and `MostLikelyToDeliver` mark the plans that are best on that measure across all plans.

#### Unallocatable line and trace entry

An unallocatable line has `lineId`, `skuId`, `quantity`, and `reasons` - a list of trace entries.

| Field | Type | Description |
| --- | --- | --- |
| `Stage` | string | The engine stage the entry belongs to: `Candidates`, `LineRules`, `Segmentation`, `ShipmentRules`, or `Scoring` |
| `Kind` | string | `Info`, `WarehouseExcluded`, `WarehouseRestricted`, `WarehousePreferred`, `PlanRejected`, `Repaired`, or `Scored` |
| `Message` | string | The reason, as a stable key such as `InsufficientStock`. See [reason keys](allocation-simulator.md#reason-keys) |
| `RuleId` | string | The allocation rule responsible, when a rule was |
| `WarehouseId` | string | The warehouse the entry concerns |
| `LineId` | string | The order line the entry concerns |
| `PlanId` | string | The plan the entry concerns |

### Example response

```json
{
  "requestId": "7f3c2a9e-51b4-4c8e-9d2a-0b6e1f4a8c73",
  "outcome": "Simulated",
  "primaryProfileKey": "Balanced",
  "selectedPlan": {
    "planId": "a41f09c2",
    "shipments": [
      {
        "warehouseId": "S012",
        "sourceShipmentId": null,
        "shippingMethodName": "HomeDelivery",
        "allowedShippingMethodNames": ["HomeDelivery", "PickupPoint"],
        "totalWeightKg": 2.4,
        "distanceKm": 18.6,
        "lines": [
          { "lineId": "1", "skuId": "1003456-42", "quantity": 1, "arrivesOn": null, "purchaseOrderId": null, "purchaseOrderLineId": null, "deliveryId": null },
          { "lineId": "2", "skuId": "2004871-M", "quantity": 2, "arrivesOn": null, "purchaseOrderId": null, "purchaseOrderLineId": null, "deliveryId": null }
        ]
      }
    ],
    "estimatedShippingCost": 79,
    "totalDistanceKm": 18.6,
    "deliveryProbability": 0.83,
    "isPartial": false,
    "shipmentCount": 1
  },
  "plans": [],
  "rankings": [
    {
      "profileKey": "Balanced",
      "selectedPlanId": "a41f09c2",
      "plans": [
        {
          "planId": "a41f09c2",
          "score": 0.12,
          "labels": ["Recommended", "FewestShipments", "Closest"],
          "breakdown": { "SplitCount": 0, "ShippingCost": 0.32, "Distance": 0.04, "DeliveryProbability": 0.17, "WarehousePriority": 0.25, "CurrentWarehouse": 0 }
        }
      ]
    },
    {
      "profileKey": "Closest",
      "selectedPlanId": "a41f09c2",
      "plans": [
        {
          "planId": "a41f09c2",
          "score": 0.04,
          "labels": ["Recommended", "FewestShipments", "Closest"],
          "breakdown": { "Distance": 0.04, "SplitCount": 0, "DeliveryProbability": 0.17 }
        }
      ]
    }
  ],
  "unallocatableLines": [],
  "trace": null,
  "configurationVersion": "3f9a1c07be42",
  "totalMs": 42
}
```

`plans` is shortened in this example; in a real response it lists every feasible plan, including the selected one.

### Outcomes

| Outcome | Meaning |
| --- | --- |
| `Simulated` | The engine found a plan for the order |
| `NoFeasiblePlan` | No combination of warehouses can serve the order. See `unallocatableLines` for the reasons |
| `PartialPlanOnly` | The best plan leaves some lines unplaced. They are listed in `unallocatableLines` |
| `SkippedNotEnabled` | Allocation is not enabled |
| `SkippedNothingToAllocate` | There are no lines or no warehouses to allocate |
| `SkippedVslUnsupported` | The order uses virtual stock locations, which the allocation engine does not handle |

### Errors

| Status | When |
| --- | --- |
| 400 | The request has no body, does not contain exactly one of `orderId`, `cartId`, `order`, or `cart`, or has a `trigger` other than `InitialAllocation` or `Reallocation` |
| 404 | No order or cart exists with the given `orderId` or `cartId` |

A simulation of a stored order covers the whole order, including shipments the engine already decided on earlier. Stock is read as it is now, so the result can differ from the decision made when the order was placed.

## Related documentation

*   [Allocation simulator](allocation-simulator.md) - run the same simulation in the Omnium UI and see why the engine decided as it did
*   [Allocation workflow steps](../workflow-steps/allocation.md) - the workflow steps that allocate and reallocate orders
*   [Cart API](../../Carts/cart-api.md) - build the basket you send for simulation

For the full interactive API reference, see the [swagger documentation](https://api.omnium.no/documentation/index.html).
