# Recommendations

Source: https://docs.omnium.no/docs/Product/recommendations

> Product recommendations in Omnium — related products, cart-based suggestions, and top sellers, with personalization and filtering.

Omnium generates product recommendations from order history, the active cart, and the catalog. Use them to power "customers also bought" carousels, cart upsells, and top-seller listings.

Recommendations are available through two endpoints:

*   **Related recommendations** (`Search`) — products commonly bought together with one or more seed products, the current cart, or a specific customer's history.
*   **Top sellers** (`GetTopSellers`) — the best-selling products over a period, optionally scoped by store, market, or category.

See the [API reference](recommendations/api-reference.md) for request and response details, and [Configuration](recommendations/configuration.md) for the tenant settings that control filtering.

## How related recommendations are built

The `Search` endpoint runs each request through several steps before returning results.

### Seeds

`Search` needs at least one seed product to generate related recommendations. Seeds are resolved in this order:

*   The `productIds` you send.
*   If you send a `cartId` and no `productIds`, the products in that cart become the seeds.
*   If neither resolves to a product, the response is empty.

### Exclusions

Omnium removes products the shopper is unlikely to need again:

*   Products already in the cart, when you pass a `cartId`.
*   Products the customer has previously purchased, when you pass a `customerId`.

### Personalization

When you pass a `customerId`, Omnium re-ranks results toward the categories and brands that customer has purchased before, so their recommendations reflect their own history. Customers with no order history are unaffected.

### Filtering

Two tenant settings further constrain results (see [Configuration](recommendations/configuration.md)):

*   **Out-of-stock exclusion** removes products with no available stock.
*   **Price band** keeps related products within a price range around the seed product.

### Variant diversification

Results never contain more than one variant of the same product. When several variants of a product match, the highest-scoring one represents it.

### Top-seller top-up

If there are too few related matches to fill the result set, Omnium completes the list with current top sellers. These fallback items are always ranked below genuine related matches, so a request never returns a sparse carousel.

A `Search` response contains up to 5 recommendations.

## Top sellers

The `GetTopSellers` endpoint returns the best-selling products since a date you specify, ranked by sales. Scope results by store, market, and category, and choose whether to include full product data or only product identifiers and scores. A response contains up to 10 products.

## Scores

Each recommendation carries a `score` — a relative relevance value. Higher scores indicate stronger recommendations, and results are ordered by score descending. Scores are only meaningful within a single response; do not treat them as absolute values or compare them across requests.

## Permissions

The Recommendations API requires an API user with product read access.
