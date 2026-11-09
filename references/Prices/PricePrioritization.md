# Price prioritization rules

Source: https://docs.omnium.no/docs/Prices/PricePrioritization

> Before adding prices to a product, it's important to understand how prices are prioritized. This includes filtering, sorting and selecting defaults based on the contextual input and available price configurations.

## Introduction

A product can have multiple prices depending on where it's sold and who is buying it. For example, different prices may apply based on the store, market, or specific customer.

Default prices are used in general product listings (e.g., product overview pages) and when a product is added to the shopping cart. These prices are selected based on a prioritization strategy that considers contextual information like market, store, customer, and other attributes.

Each price can have various conditions that determine its applicability:

| **Condition** | **Explanation** |
| --- | --- |
| Market | A price is valid only in a specific market. The currency of the price must match the market's currency. |
| Store | A price can be valid for a specific store, or all stores. |
| Store Group | To target multiple stores, a store group can be used. |
| Customer | A price can be valid for one specific customer. |
| Customer Group | Only applicable in B2B markets; prices can be targeted to customer groups when market type is B2B. |
| Date | The validity of a price can be limited to a specific date interval. |
| Unit | Prices can apply to a specific unit (e.g., box, pallet). The unit price will be the total price for that unit. |

## Valid prices

A product may have many prices, and not all are valid in every context. When searching or displaying prices, only those valid in the current context (market, store, customer, etc.) will be returned.

The following matrix shows how different property values affect price validity:

| **Property** | **Context.Property not given** | **Price.Property not given** | **Context.Property matches Price.Property** | **Explanation** |
| --- | --- | --- | --- | --- |
| **Market** | ✓ | ✓ | ✓ | If no market is given, all prices are considered. If a price has no market, it’s valid in any market. Market groups are also considered. Currency must match. |
| **Store** | ✓ | ✓ | ✓ | Prices not scoped to any store are valid everywhere, but a store-specific price is prioritized.. |
| **Store group** | ❌ | ✓ | ✓ | Store group prices require the context to include a matching group; otherwise, they are ignored. |
| **Customer** | ❌ | ✓ | ✓ | Prices with a customer ID are only valid for that customer. If no match on customerId, general prices apply. |
| **Customer group** | ❌ | ✓ | ✓ | Customer group specific prices are not valid in context without a specific customer group. |
| **Unit Matching** | ✓ | ✓ | ✓ | Unit-specific prices are used when context matches. Prices with no unit are fallback options. |

## Sorting strategy

When multiple valid prices exist, the system uses the following sorting strategy to determine which price to use first:

| **Priority** | **Condition** | **Notes** |
| --- | --- | --- |
| 1st | `store?.Id == y.StoreId` | Prefer store-specific prices |
| 2nd | `storeGroupIds?.Contains(x.StoreGroupId)` | Then check for store group |
| 3rd | `x.Unit == unit` | Then match on unit |
| 4th | `y.UnitPrice` | Then prefer lowest price |
| 5th | `x.PromotionId` (descending) | Finally, use highest promotion ID |

## Default price strategy

When adding a product to the cart or displaying the default price in a list, the system looks for the best matching price using a hierarchical prioritization:

Prioritization Logic:

### Notes on Market Condition

*   A price should always exist within the context of a market.
*   If no market is explicitly selected, the default market is used.
*   The default market is the one marked with IsDefaultMarket = true in the settings. If multiple markets are marked as default, the first one found is used.
*   The selected price must also match the currency and content language of the market.

## Examples: Price Prioritization Scenarios

These examples demonstrate how the system prioritizes prices under different combinations of conditions such as market, store, customer, units, dates, and promotions.

* * *

### Example 1: Expired Price

**Setup:**

| Price ID | Valid From | Valid To | Price |
| --- | --- | --- | --- |
| P1 | 2025-01-01 | 2025-06-01 | 10 |
| P2 | 2025-06-01 | 2025-12-31 | 12 |

**Context Date:**
`2025-06-15`

**Selected Price:** `P2`
**Reason:**

*   P1 is expired
*   P2 is within valid date range

* * *

### Example 2: Store Group vs. Individual Store

**Setup:**

| Price ID | Store | Store Group | Price |
| --- | --- | --- | --- |
| P1 | — | groupA | 20 |
| P2 | store1 | — | 19 |

**Context:**
`Store = store1`, where `store1 ∈ groupA`

**Selected Price:** `P2`
**Reason:**

*   Direct store match (P2) has higher priority than store group match (P1)

* * *

### Example 3: Unit-Specific vs. General Price

**Setup:**

| Price ID | Unit | Price |
| --- | --- | --- |
| P1 | — | 5 |
| P2 | kg | 4.5 |

#### Case A: `Unit = "kg"`

Selected Price: `P2` (unit-specific match)

#### Case B: `Unit = (not specified)`

Selected Price: `P1` (general price)
P2 is valid but not prioritized unless unit is requested

* * *

### Example 4: Multiple Promotions and Lowest Price

**Setup:**

| Price ID | Store | Unit Price | Promotion ID |
| --- | --- | --- | --- |
| P1 | store1 | 7 | 100 |
| P2 | store1 | 6 | 200 |
| P3 | store1 | 6 | 150 |

**Context:**
`Store = store1`

**Selected Price:** `P2`
**Reason:**

*   All prices are valid
*   Prices P2 and P3 are tied on unit price
*   P2 wins due to higher Promotion ID (200 vs. 150)

* * *

### Example 5: Default Market Behavior

**Market Setup:**

| Market | IsDefaultMarket |
| --- | --- |
| US | ✓ |
| EU |  |

**Price Setup:**

| Price ID | Market | Price |
| --- | --- | --- |
| P1 | US | 8 |
| P2 | — | 9 |

#### Case A: `No market specified`

Selected Price: `P1` (from default market)

#### Case B: `No price for default market`

Selected Price: `P2` (market-agnostic fallback)

* * *

### Example 6: Customer and Store — Store Match Wins

**Setup:**

| Price ID | Customer | Store | Price |
| --- | --- | --- | --- |
| P1 | — | — | 8 |
| P2 | customer1 | — | 9 |
| P3 | — | store1 | 10 |

**Context:**
`Customer = customer1`, `Store = store1`

**Selected Price:** `P3`
**Reason:**

*   P3 (store-specific) has higher priority than P2 (customer-specific)
*   Both P2 and P3 are more specific than the default (P1)

* * *

### Example 7: Customer and Store — Exact Match Overrides

**Setup:**

| Price ID | Customer | Store | Price |
| --- | --- | --- | --- |
| P1 | customer1 | store1 | 8 |
| P2 | customer1 | — | 9 |
| P3 | — | store1 | 7 |

**Context:**
`Customer = customer1`, `Store = store1`

**Selected Price:** `P1`
**Reason:**

*   P1 has an exact match for both customer and store
*   It overrides more general store-only or customer-only prices

* * *

### Example 8: Store Group vs Customer — Store Wins

**Setup:**

| Price ID | Customer | Store Group | Price |
| --- | --- | --- | --- |
| P1 | customer1 | — | 9 |
| P2 | — | group1 | 8 |

**Context:**
`Customer = customer1`, `Store in group1`

**Selected Price:** `P2`
**Reason:**

*   Store group match takes precedence over customer match (per prioritization strategy)

* * *

### Example 9: No Match — Fallback to General

**Setup:**

| Price ID | Customer | Store | Price |
| --- | --- | --- | --- |
| P1 | — | — | 13 |

**Context:**
`Customer = customer1`, `Store = store1`

**Selected Price:** `P1`
**Reason:**

*   No specific price for either store or customer
*   Falls back to general/default price

* * *

### Example 10: Customer Group in B2C Market (Ignored)

**Setup:**

| Price ID | Customer Group | Market Type | Price |
| --- | --- | --- | --- |
| P1 | — | B2C | 15 |
| P2 | groupA | B2C | 14 |

**Context:**
`Market = B2C`, `CustomerGroup = groupA`

**Selected Price:** `P1`
**Reason:**

*   Customer group pricing is ignored in B2C markets

* * *
