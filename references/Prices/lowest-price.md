# Lowest price history

Source: https://docs.omnium.no/docs/Prices/lowest-price

> Automatically tracks the lowest valid price for products over a set period to ensure compliance with pricing regulations such as the EU Omnibus Directive.

## Introduction

The lowest price history feature automatically tracks and records the lowest valid price for each product (and variant) per market over a configurable time window (e.g., the last 30 days).

This is primarily used to comply with the **EU Omnibus Directive** (Directive 2019/2161), which requires that any announced price reduction must reference the lowest price that was applied during a period of at least 30 days before the reduction.

When enabled, Omnium maintains a `lowestPriceHistory` array on each product. This array contains one entry per market, representing the lowest price recorded within the configured time window. The data is available through both the Omnium UI and the public API.

* * *

## Setup

### 1\. Set the historical threshold

Define how far back in time prices should be tracked:

1.  Navigate to: `Configuration → Products`
2.  Under **Lowest Price**, set the number of days (e.g., `30`)

Setting this value to `0` disables the feature entirely. Only prices within this time window will be considered when calculating the lowest historical price.

### 2\. Add the scheduled task

A scheduled task must be added to automatically recalculate lowest prices:

1.  Navigate to: `Configuration → Settings → Integrations → Scheduled tasks`
2.  Click the three-dot menu and select **Add**
3.  Set the following:
    *   **Implementation type:** `Product lowest price`
    *   **Schedule:** A cron expression for how often the task should run, e.g., daily at midnight (`0 0 * * *`) or every 30 minutes (`*/30 * * * *`)

The scheduled task processes all active products, evaluates their prices, and updates the `lowestPriceHistory` accordingly.

> **Tip:** Even without the scheduled task, price history is also updated whenever a product is saved (created or updated) through the API. The scheduled task ensures that all products stay up to date even when prices expire or new price windows begin.

* * *

## How it works

### Price evaluation criteria

When determining the lowest price, only prices that meet **all** of the following criteria are considered:

*   Belongs to the relevant **market**
*   Has a **start date** that is today or earlier (future-dated prices are excluded)
*   Has not **expired** (end date is either not set or is in the future)
*   Is **not** linked to a specific `customerId`, `customerGroupId`, or `storeGroupId` (customer-specific and store-group-specific prices are excluded)

### Tracking per market

Lowest price history is tracked **separately for each market**. A product sold in markets "NOR" and "SWE" will have separate entries in `lowestPriceHistory` — one for each market.

### Variant handling

*   Each **variant** maintains its own `lowestPriceHistory`.
*   The **parent product** reflects the lowest price across all its variants for each market. This means you can check either the parent or individual variants depending on your use case.

### What happens when prices change

Each time the scheduled task runs or a product is updated:

1.  **Old entries are pruned** — price records older than the configured threshold are removed.
2.  **The current valid price is compared** against the stored history.
3.  **If the price has changed**, the previous price is recorded as a historical entry (with `isCurrentPrice: false`), and a new current entry is added (with `isCurrentPrice: true`).
4.  **If no change occurred**, the existing records remain as-is.

This means the system keeps a rolling record of price changes within the time window, and always identifies which entry represents the current price vs. historical ones.

* * *

## API reference

### The `lowestPriceHistory` property

The lowest price history is exposed as the `lowestPriceHistory` array on product models. It is available on:

*   `OmniumProduct` — returned by single-product GET endpoints and scroll endpoints
*   `OmniumProductListItemViewModel` — returned by the search endpoint

Each entry in the array is an `OmniumPriceReference` object:

| Property | Type | Description |
| --- | --- | --- |
| `unitPrice` | `decimal` | The recorded price amount. **This is the lowest historical price** when `isCurrentPrice` is not `true`. |
| `currencyCode` | `string` | Currency code (e.g., `"NOK"`, `"SEK"`, `"EUR"`). |
| `marketId` | `string` | The market this price applies to (e.g., `"NOR"`). |
| `date` | `datetime` | When this price was recorded. |
| `promotionId` | `string` | ID of the associated promotion, if any. |
| `promotionName` | `string` | Name of the associated promotion, if any. |
| `priceListId` | `string` | ID of the price list this price originated from, if any. |
| `isCurrentPrice` | `bool?` | `true` if this represents the current active price. `null` or absent if this is a historical entry. |

> **Key insight:** Through the API, the array is mapped so that each market has **one representative entry** — the lowest non-current (historical) price. If no historical price exists yet (e.g., the price has not changed within the window), the current price is returned instead.

### Endpoints that return lowest price history

All product retrieval endpoints include `lowestPriceHistory` when the feature is enabled:

| Method | Endpoint | Response model |
| --- | --- | --- |
| GET | `/api/products/{productId}` | `OmniumProduct` |
| GET | `/api/products/{productId}/ByMarket/{marketId}` | `OmniumProduct` |
| GET | `/api/products/{productId}/ByStore/{storeId}` | `OmniumProduct` |
| GET | `/api/products/{productId}/ByCustomer/` | `OmniumProduct` |
| POST | `/api/products/SearchProducts` | `OmniumProductListItemViewModel[]` |
| POST | `/api/products/Scroll` | `OmniumProduct[]` |
| GET | `/api/products/Scroll/{scrollId}` | `OmniumProduct[]` |

There is no dedicated endpoint for price history alone — it is always part of the product response.

### Example: Get a product with lowest price history

**Request:**

```
GET /api/products/12345
```

**Response (simplified):**

```json
{
  "id": "12345",
  "title": "Winter Jacket",
  "prices": [
    {
      "unitPrice": 599.00,
      "currencyCode": "NOK",
      "marketId": "NOR",
      "validFrom": "2026-03-01T00:00:00Z"
    }
  ],
  "lowestPriceHistory": [
    {
      "unitPrice": 499.00,
      "currencyCode": "NOK",
      "marketId": "NOR",
      "date": "2026-03-10T12:00:00Z",
      "promotionId": "spring-sale-2026",
      "promotionName": "Spring Sale",
      "priceListId": null,
      "isCurrentPrice": null
    }
  ],
  "variants": [
    {
      "skuId": "12345-S",
      "lowestPriceHistory": [
        {
          "unitPrice": 499.00,
          "currencyCode": "NOK",
          "marketId": "NOR",
          "date": "2026-03-10T12:00:00Z",
          "isCurrentPrice": null
        }
      ]
    }
  ]
}
```

In this example:

*   The product currently costs **599 NOK** (see `prices`).
*   The lowest price in the configured period was **499 NOK** during the "Spring Sale" promotion (see `lowestPriceHistory`).
*   Since `isCurrentPrice` is `null`, this is a **historical** entry — i.e., the lowest price was lower than the current price.

### Example: Search for products and read lowest price history

**Request:**

```
POST /api/products/SearchProducts
```

```json
{
  "marketId": "NOR",
  "take": 10,
  "includedFields": {
    "specificFields": ["lowestPriceHistory", "prices"]
  }
}
```

**Response (simplified):**

```json
{
  "totalHits": 142,
  "result": [
    {
      "id": "12345",
      "lowestPriceHistory": [
        {
          "unitPrice": 499.00,
          "currencyCode": "NOK",
          "marketId": "NOR",
          "date": "2026-03-10T12:00:00Z",
          "isCurrentPrice": null
        }
      ]
    }
  ]
}
```

### Example: Scroll all products to export lowest price data

Use the scroll endpoint when you need to retrieve lowest price history for a large number of products:

**Step 1 — Initial request:**

```
POST /api/products/Scroll
```

```json
{
  "marketId": "NOR",
  "includedFields": {
    "specificFields": ["lowestPriceHistory", "prices"]
  }
}
```

**Step 2 — Continue scrolling** (if `scrollId` is returned):

```
GET /api/products/Scroll/{scrollId}
```

Repeat step 2 until no more results are returned.

* * *

## Interpreting the data

### Finding the lowest historical price

The `lowestPriceHistory` array through the API contains **one entry per market**, representing the lowest price during the configured period.

To find the lowest historical price for a specific market:

```
// JavaScript example
const product = await fetchProduct("12345");

const lowestForNOR = product.lowestPriceHistory
  ?.find(entry => entry.marketId === "NOR");

if (lowestForNOR) {
  console.log(`Lowest price (NOR): ${lowestForNOR.unitPrice} ${lowestForNOR.currencyCode}`);
  // Output: "Lowest price (NOR): 499 NOK"
}
```

```
// C# example
var product = await client.GetAsync<OmniumProduct>("api/products/12345");

var lowestForNOR = product.LowestPriceHistory?
    .FirstOrDefault(x => x.MarketId == "NOR");

if (lowestForNOR != null)
{
    Console.WriteLine($"Lowest price (NOR): {lowestForNOR.UnitPrice} {lowestForNOR.CurrencyCode}");
    // Output: "Lowest price (NOR): 499 NOK"
}
```

### Displaying a price reduction notice

When showing a price reduction on a product page (e.g., for Omnibus compliance), compare the current price with the lowest historical price:

```
const currentPrice = product.prices?.find(p => p.marketId === "NOR");
const lowestHistorical = product.lowestPriceHistory?.find(p => p.marketId === "NOR");

if (currentPrice && lowestHistorical) {
  // Display both prices — the Omnibus directive requires showing the lowest
  // price from the reference period alongside any announced price reduction.
  console.log(`Now: ${currentPrice.unitPrice} — Lowest in last 30 days: ${lowestHistorical.unitPrice}`);
}
```

### When `lowestPriceHistory` is empty or missing

*   **Feature is not enabled:** The `lowestPriceHistoryDays` setting is `0` or not configured.
*   **No valid prices exist:** The product has no valid prices for any market (e.g., all prices are future-dated or expired).
*   **Scheduled task has not run yet:** If the task was just enabled, it needs to run at least once to populate history. Saving the product through the API will also trigger an initial calculation.

* * *

## Viewing in the Omnium UI

When the feature is enabled, the lowest price history is visible in the Omnium UI:

*   **Product detail page:** A "Lowest Price" section displays the tracked price history per market, including the recorded price, currency, market, and date.
*   **Price editor:** When editing prices, a "Lowest Price" tab shows the full history and allows manual adjustments if needed.
*   **Configuration:** The threshold (number of days) is shown under `Configuration → Products → Lowest Price`.
