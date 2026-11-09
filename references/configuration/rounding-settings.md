# Rounding Settings

Source: https://docs.omnium.no/docs/configuration/rounding-settings

> Configure price rounding policies with range-based rules and multiple rounding methods.

## Overview

Rounding Settings allow you to define price rounding policies that automatically adjust prices to predefined values. This is commonly used in retail to create "nice" price endings (e.g., 99, 95, 90) or to round prices to the nearest whole number or increment.

Each rounding policy contains a set of range-based rules. When a price is rounded, the system finds the rule whose price range matches the input price and applies the configured rounding method. Multiple policies can be defined to support different rounding strategies for different contexts (e.g., discount rounding vs. price list rounding).

Rounding Settings are configured under **Configuration > Settings > Finance > Rounding settings**.

* * *

## Configuration Model

Rounding Settings are stored in the `RoundingSettings` section of Tenant Settings. The configuration is hierarchical: settings contain policies, and policies contain rules.

### RoundingSettings

| Property | Type | Description |
| --- | --- | --- |
| `RoundingPolicies` | List<RoundingPolicy> | List of rounding policies available to the tenant |

### RoundingPolicy

Each policy defines a named rounding strategy with one or more price range rules.

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `Key` | string | Yes | Unique identifier used to reference this policy in code and other configuration |
| `Label` | string | No | Human-readable display name for the policy |
| `Rules` | List<RoundingRangeRule> | Yes | Ordered list of range-based rounding rules |

### RoundingRangeRule

Each rule defines how prices within a specific range should be rounded. When a price is evaluated, the first rule whose `MinPrice`/`MaxPrice` range contains the price is applied.

| Property | Type | Required | Description |
| --- | --- | --- | --- |
| `MinPrice` | decimal? | No | Lower bound of the price range (inclusive). If null, no minimum limit. |
| `MaxPrice` | decimal? | No | Upper bound of the price range (inclusive). If null or 0, no maximum limit. |
| `MethodKey` | string | Yes | The rounding method to use: `RoundToNicePrice`, `RoundToNearest`, or `RoundDownToNearest` |
| `Step` | int? | No | Rounding step increment. Used by `RoundToNicePrice`. |
| `Offset` | int? | No | Amount to subtract after rounding up. Used by `RoundToNicePrice`. |
| `RoundTo` | int? | No | Round to the nearest multiple of this value. Used by `RoundToNearest` and `RoundDownToNearest`. |
| `Mode` | string? | No | Rounding direction for `RoundToNicePrice`: `"up"`, `"down"`, or `"niceup"` (default). Only configurable via JSON/API, not exposed in the admin UI. |

* * *

## Rounding Methods

Three rounding methods are available out of the box. The method is selected per rule via the `MethodKey` property.

### RoundToNicePrice

Creates "nice" price endings by rounding to a step and optionally subtracting an offset. This is the most common method for retail price rounding.

**Parameters used**: `Step`, `Offset`, `Mode`

**Modes**:

| Mode | Formula | Description |
| --- | --- | --- |
| `niceup` (default) | `ceil(price / step) * step - offset` | Round up to the nearest step, then subtract the offset to create a "nice" price |
| `up` | `ceil(price / step) * step` | Round up to the nearest step |
| `down` | `floor(price / step) * step` | Round down to the nearest step |

**Examples** with Step = 100, Offset = 5, Mode = "niceup":

| Input Price | Result | Explanation |
| --- | --- | --- |
| 51 | 95 | ceil(51/100) \* 100 - 5 = 100 - 5 = 95 |
| 99 | 95 | ceil(99/100) \* 100 - 5 = 100 - 5 = 95 |
| 101 | 195 | ceil(101/100) \* 100 - 5 = 200 - 5 = 195 |

### RoundToNearest

Standard mathematical rounding to the nearest multiple of a specified value. Uses midpoint rounding away from zero (0.5 rounds up).

**Parameters used**: `RoundTo`

**Formula**: `Math.Round(price / roundTo, MidpointRounding.AwayFromZero) * roundTo`

**Examples** with RoundTo = 1 (round to nearest whole number):

| Input Price | Result | Explanation |
| --- | --- | --- |
| 40.4 | 40 | Rounds down (below midpoint) |
| 40.5 | 41 | Rounds up (at midpoint) |
| 39.9 | 40 | Rounds up (above midpoint) |

### RoundDownToNearest

Always rounds down to the nearest multiple of a specified value.

**Parameters used**: `RoundTo`

**Formula**: `Math.Floor(price / roundTo) * roundTo`

**Examples** with RoundTo = 1 (round down to nearest whole number):

| Input Price | Result | Explanation |
| --- | --- | --- |
| 40.4 | 40 | Rounds down |
| 40.9 | 40 | Rounds down |
| 41.0 | 41 | Already a whole number |

* * *

## How Rounding Works

When a price is rounded using a policy, the following process occurs:

1.  **Policy Lookup**: The system finds the `RoundingPolicy` matching the provided policy key
2.  **Rule Matching**: The first `RoundingRangeRule` whose price range contains the input price is selected
3.  **Method Execution**: The rounding method specified by `MethodKey` is applied with the rule's parameters
4.  **Fallback**: If no matching policy, rule, or method is found, the original price is returned unchanged

Prices that fall outside all defined ranges are not rounded. This allows you to skip rounding for very low-value items by starting your first rule at a minimum threshold.

### Where Rounding Is Applied

Rounding policies can be applied in the following contexts:

*   **Discount Calculation**: When discounts produce non-round prices, a rounding policy can be applied to adjust the final discounted price
*   **Price List Editing**: When bulk-editing price lists, a rounding policy can be selected to round all adjusted prices

In both cases, the rounding policy is selected by its `Key` value.

* * *

## UI Configuration

Rounding Settings are configured in the Omnium UI under **Configuration > Settings > Finance > Rounding settings**.

### Creating a Rounding Policy

1.  Navigate to **Configuration > Settings > Finance > Rounding settings**
2.  Click **Add** to create a new rounding policy
3.  Fill in the policy details:
    *   **Name**: A unique key used to reference the policy (e.g., `NicePrice95`)
    *   **Display Name**: A human-readable label shown in the UI (e.g., "Round to .95")

### Adding Rules to a Policy

Each policy needs at least one rule. Rules define the rounding behavior for specific price ranges.

1.  Expand the policy panel
2.  Click **Add** to create a new rule
3.  Configure the rule:
    *   **Min Price**: The minimum price this rule applies to (leave empty for no lower bound)
    *   **Max Price**: The maximum price this rule applies to (leave empty for no upper bound)
    *   **Rounding Method**: Select `RoundToNicePrice`, `RoundToNearest`, or `RoundDownToNearest`
    *   **Round To**: (RoundToNearest / RoundDownToNearest only) The value to round to
    *   **Step**: (RoundToNicePrice only) The rounding step increment
    *   **Offset**: (RoundToNicePrice only) The value to subtract after rounding up

### Using a Rounding Policy

Once configured, rounding policies appear as selectable options in areas that support price rounding (e.g., price list bulk editing). The policy selector shows all defined policies by their key/label.

* * *

## Example Configurations

### "Nearest .95" Rounding Policy

A common retail strategy where prices end in .95 at different scales depending on the price range:

```json
{
    "RoundingSettings": {
        "RoundingPolicies": [
            {
                "Key": "NearestNinetyFive",
                "Label": "Round to .95 ending",
                "Rules": [
                    {
                        "MinPrice": 50,
                        "MaxPrice": 1000,
                        "MethodKey": "RoundToNicePrice",
                        "Step": 100,
                        "Offset": 5
                    },
                    {
                        "MinPrice": 1000,
                        "MaxPrice": 5000,
                        "MethodKey": "RoundToNicePrice",
                        "Step": 500,
                        "Offset": 50
                    },
                    {
                        "MinPrice": 5000,
                        "MaxPrice": 10000,
                        "MethodKey": "RoundToNicePrice",
                        "Step": 1000,
                        "Offset": 50
                    }
                ]
            }
        ]
    }
}
```

**Result examples**:

| Input | Range | Result | Explanation |
| --- | --- | --- | --- |
| 40 | Below 50 (no rule) | 40 | No matching rule, price unchanged |
| 51 | 50-1000 | 95 | Step 100, Offset 5 |
| 99 | 50-1000 | 95 | Step 100, Offset 5 |
| 1000 | 50-1000 | 995 | Step 100, Offset 5 (MaxPrice is inclusive, so 1000 matches the first rule) |
| 3200 | 1000-5000 | 3450 | Step 500, Offset 50 |
| 6200 | 5000-10000 | 6950 | Step 1000, Offset 50 |

### "Nearest .99" Rounding Policy

A strategy with finer-grained ranges for .99/.90-style endings:

```json
{
    "RoundingSettings": {
        "RoundingPolicies": [
            {
                "Key": "NearestNinetyNine",
                "Label": "Round to .99 ending",
                "Rules": [
                    {
                        "MinPrice": 0,
                        "MaxPrice": 50,
                        "MethodKey": "RoundToNicePrice",
                        "Step": 10,
                        "Offset": 1
                    },
                    {
                        "MinPrice": 50,
                        "MaxPrice": 1000,
                        "MethodKey": "RoundToNicePrice",
                        "Step": 100,
                        "Offset": 1
                    },
                    {
                        "MinPrice": 1000,
                        "MaxPrice": 5000,
                        "MethodKey": "RoundToNicePrice",
                        "Step": 500,
                        "Offset": 10
                    },
                    {
                        "MinPrice": 5000,
                        "MaxPrice": 10000,
                        "MethodKey": "RoundToNicePrice",
                        "Step": 1000,
                        "Offset": 100
                    }
                ]
            }
        ]
    }
}
```

**Result examples**:

| Input | Range | Result |
| --- | --- | --- |
| 5 | 0-50 | 9 |
| 39 | 0-50 | 39 |
| 51 | 50-1000 | 99 |
| 1000 | 50-1000 | 999 (MaxPrice is inclusive, so 1000 matches this rule before the 1000-5000 rule) |
| 3200 | 1000-5000 | 3490 |
| 6200 | 5000-10000 | 6900 |

### Round to Nearest Whole Number

A simple policy that rounds all prices to the nearest whole number:

```json
{
    "RoundingSettings": {
        "RoundingPolicies": [
            {
                "Key": "NearestWholeNumber",
                "Label": "Round to nearest whole number",
                "Rules": [
                    {
                        "MinPrice": 0,
                        "MethodKey": "RoundToNearest",
                        "RoundTo": 1
                    }
                ]
            }
        ]
    }
}
```

**Result examples**:

| Input | Result |
| --- | --- |
| 40.4 | 40 |
| 40.5 | 41 |
| 39.9 | 40 |

### Multiple Policies

You can define multiple policies for different use cases:

```json
{
    "RoundingSettings": {
        "RoundingPolicies": [
            {
                "Key": "NicePrice",
                "Label": "Nice price (.95 ending)",
                "Rules": [
                    {
                        "MinPrice": 0,
                        "MethodKey": "RoundToNicePrice",
                        "Step": 100,
                        "Offset": 5
                    }
                ]
            },
            {
                "Key": "WholeNumber",
                "Label": "Round to nearest 10",
                "Rules": [
                    {
                        "MinPrice": 0,
                        "MethodKey": "RoundToNearest",
                        "RoundTo": 10
                    }
                ]
            }
        ]
    }
}
```

* * *

## Best Practices

### Rule Design

*   **Cover all price ranges**: Ensure your rules cover the full expected price range. Prices outside all defined ranges will not be rounded.
*   **Order rules carefully**: The first matching rule is used. Place more specific (narrower range) rules before broader ones if ranges could overlap.
*   **Avoid overlapping ranges**: While the system handles overlaps by using the first match, non-overlapping ranges are easier to reason about.
*   **Set a minimum threshold**: Consider skipping rounding for very low prices by starting your first rule's `MinPrice` above zero.

### Policy Naming

*   **Use descriptive keys**: Choose keys that describe the rounding behavior (e.g., `NicePrice95`, `RoundToNearest10`)
*   **Add labels**: Provide clear labels so users can easily select the right policy in the UI

* * *

## Related Documentation

*   [Generic Concepts](generic.md) - External IDs and Properties used in Omnium
