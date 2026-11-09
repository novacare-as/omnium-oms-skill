# Inventory

Source: https://docs.omnium.no/docs/plugins/POS/Flow/Inventory

> Inventory export from Omnium to Flow Retail stores.

## Overview

The Flow integration supports **one-way** inventory synchronization from Omnium to Flow Retail. Stock levels are pushed to Flow stores based on the Omnium inventory data. Flow, however, has support for pushing stock to Omnium for stores where they are master.

| Direction | Description | Use Case |
| --- | --- | --- |
| **Export** (Omnium -> Flow) | Stock levels from Omnium are pushed to Flow stores | Omnium is the inventory master |

## How It Works

1.  Products with modified inventory since the last sync are identified
2.  For each market (or market group), stores are resolved
3.  Inventory levels are sent to each Flow store
4.  Optionally, cost price list data is included in the inventory update

## Scheduled Task

The inventory export runs on a schedule and uses delta synchronization — only products with inventory changes since the last run are processed.

**Configuration -> Settings -> Integrations -> Scheduled tasks**

```json
{
    "schedule": "*/30 * * * *",
    "implementationType": "FlowInventoryScheduledTask",
    "isDisabled": false
}
```

## Stock Master Configuration

When Omnium is the master of stock levels, enable the following property:

```json
{
    "key": "OmniumIsMasterForStock",
    "value": "true"
}
```

## Cost Price in Inventory Export

Optionally include cost price data alongside inventory levels:

```json
{
    "key": "UseCostPriceListInInventoryExport",
    "value": "true"
}
```

When enabled, the cost price list is sent as part of the inventory update to each store.

## Configuration Reference

| Setting | Description | Default |
| --- | --- | --- |
| `OmniumIsMasterForStock` | Omnium is the master system for inventory | `false` |
| `UseCostPriceListInInventoryExport` | Include cost prices in inventory export | `false` |
| `FlowWebWarehouse` | UID of the web/online warehouse in Flow | Not set |
