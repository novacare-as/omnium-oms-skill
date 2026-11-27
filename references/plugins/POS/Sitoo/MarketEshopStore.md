# Market/Eshop/Store

Source: https://docs.omnium.no/docs/plugins/POS/Sitoo/MarketEshopStore

> Market, e-shop, and store configuration in Sitoo integration.

# Market/Eshop/Store

The Sitoo integration connects Omnium markets to Sitoo environments. Each market maps to its own Sitoo instance with a separate base URL, API keys, product database, and currency. Stores within a market are mapped to Sitoo warehouses and optionally to Sitoo eshops.

## One Market Per Sitoo Instance

Each Omnium market connects to a separate Sitoo back office. This allows each market to have its own product catalog, language, currency, and store configuration.

The connection is configured through the Sitoo connector settings on each market:

*   **Base URL**: The Sitoo API endpoint for this market's Sitoo instance.
*   **API keys**: Authentication credentials for the Sitoo API. Multiple API keys can be configured for different operations (product export, order import, inventory sync, etc.), allowing rate limits to be managed independently per operation type.

All synchronization tasks — products, orders, inventory, prices — run per market using that market's Sitoo connection.

## Stores

Stores in Omnium are mapped to warehouses in Sitoo. This mapping is done through external IDs on each store.

### Warehouse ID

Each store that should be linked to Sitoo needs a Sitoo warehouse ID set as an external ID. This ID is used to:

*   Match incoming orders to the correct Omnium store (e.g., which store fulfilled the order)
*   Identify the pick-up location for click-and-collect orders
*   Synchronize inventory between Omnium and Sitoo

The warehouse ID can be set per market, so the same Omnium store can map to different Sitoo warehouse IDs across different markets.

### Eshop ID

A store can optionally be assigned a Sitoo eshop ID via an external ID. This is used when the integration runs in **store assortment mode**, where each store has its own product assortment in Sitoo rather than sharing a single catalog across the entire market.

When store assortment mode is enabled:

*   Products are grouped by store and exported separately to each store's eshop.
*   Categories are synchronized per eshop.
*   Each store receives only the products assigned to it in Omnium.

When store assortment mode is not enabled, all products are exported to a single market-level eshop configured on the connector.

### Configuration

| Setting | Description |
| --- | --- |
| `SitooWarehouseId` (external ID on store) | Maps the store to a Sitoo warehouse. Can be set globally or per market. |
| `SitooEshopId` (external ID on store) | Maps the store to a Sitoo eshop. Used in store assortment mode. |
| `SitooEshopId` (connector property) | The default eshop ID for the market. Used when store assortment mode is not enabled. |
| `ExportWithStoreAssortment` | Enables per-store product assortment export instead of a single market-wide catalog. |
