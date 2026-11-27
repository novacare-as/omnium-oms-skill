# Shopify

Source: https://docs.omnium.no/docs/plugins/ECOM/Shopify

> Omnium integrates with Shopify to sync products, orders and inventory.

## Basic setup

Omnium is using ShopifySharp Lib: [https://github.com/nozzlegear/ShopifySharp](https://github.com/nozzlegear/ShopifySharp)

Each market can have a Shopify connector. Used for 1 to 1 mapping between an Omnium market and a Shopify site.

For Shopify instances with multiple markets(like International) use a “global connector” for markets that are sub markets in the International site.

Here is an example of a connector(json). The properties will be explained below the json

```json
{
            "name": "Shopify",
            "isAuthenticatedManually": false,
            "timeOut": "00:00:00",
            "implementations": [
                "IOrderExporter"
            ],
            "properties": [
                {
                    "key": "ShopifyUrl",
                    "value": "...."
                },
                {
                    "key": "AccessToken",
                    "value": "shpat_…"
                },
                {
                    "key": "ShopifyProductsWithExternalIdEnabled",
                    "value": "true"
                },
                {
                    "key": "ShopifyProductsExternalIdWithMarketPrefixEnabled",
                    "value": "true"
                },
                {
                    "key": "ShopifyFullProductExport",
                    "value": "false"
                },
      	    {
                "key": "ShopifyProductExportOnlyForNewProductsAsDraft",
                "value": "true"
                },

    {
                "key": "ShopifyExternalIdPrefix",
                "value": "INT"
                },
                {
                "key": "ProductPrimaryStore",
                "value": "store_22"
                },
               {
                "key": "OrderPrimaryStore",
                "value": "store_123"
                },
                {
                "key": "UsePresentmentCurrency",
                "value": "true"
                },
                {
                    "key": "ShopifyCreateCollections",
                    "value": "false"
                },
                {
                    "key": "ShortDescriptionMetaKey",
                    "value": "custom|short_description_omnium"
                },
                {
                    "key": "SpecificationMetaKey",
                    "value": "custom|specification_omnium"
                },
                {
                    "key": "MetaFieldNamespace",
                    "value": "property"
                },
                {
                    "key": "MetaFieldsCustomProperties",
                    "value": "ShopifyProp:OmniumProp|ShopifyProp:OmniumProp"
                },
                {
                    "key": "InventoryExportShouldIncludeInActiveProducts",
                    "value": "false"
                },
               {
                    "key": "ShopifyPublishedScope",
                    "value": "global"
                },
               {
                    "key": "DraftOrderExcludePrice",
                    "value": "false"
                }

            ],
            "disableStandardErrorPolicy": false,
        "enabledForMarkets": [
            "NO",
            "UK"
        ]

        }
```

## Property descriptions

Implementations: We support IOrderExporter(export orders), IInventoryExporter(inventory will be exported to Shopify) and IProductExporter(products will be exported to Shopify) If Omnium has multiple Shopify connectors, “Implementations” values are only added to “empty” connectors, so we only do one export. Omnium will then export to each connector.

Empty(without url, token and props) connector example:

```json
{
        "name": "Shopify",
        "type": "Shopify",
        "isAuthenticatedManually": false,
        "timeOut": "00:00:00",
        "implementations": [
            "IOrderExporter",
            "IProductExporter",
            "IInventoryExporter"
        ],
        "properties": [],
        "disableStandardErrorPolicy": false
    }
```

#### ShopifyUrl:

Shopify website url for market

#### AccessToken:

Access token to connect to Shopify

#### ShopifyProductsWithExternalIdEnabled:

Should be true, to make sure we require the Shopify externalIds on all products

#### ShopifyProductsExternalIdWithMarketPrefixEnabled:

Should be true, to indicate that products external id keys is prefixed with market: “SWE\_{ShopifyId}”

#### ShopifyExternalIdPrefix

If you have one connector, enabled for multiple markets, specify a ID prefix, used for this connector. Example: “INT” Then externalId key will be “INT\_{ShopifyId}”

#### ShopifyFullProductExport:

True if Omnium should be the master for product data, and export(override Shopify).

#### ShopifyProductExportOnlyForNewProductsAsDraft

If true, Omnium will only export products to Shopify if the product does not have Shopify externalIds for the connector. It will be published to Shopify as a draft, if the product has the correct market and store.

#### ProductPrimaryStore

If specified, products exported to Shopify must have this store selected, else they will be ignored.

#### OrderPrimaryStore

If specified, this will be order.StoreId when importing orders from Shopify to Omnium.

#### UsePresentmentCurrency

If true, Omnium will use user currency on Order. If you have a Shopify site with multiple markets. A Norwegian order will then get NOK as currency and not EUR.

#### ShopifyCreateCollections

If true, Omnium will create collections in Shopify, based on product categories in Omnium. Used when “ShopifyFullProductExport” is true.

#### ShortDescriptionMetaKey

Here you specify the Shopify property to sync Omnium product “ShortDescription” metaNameSpace|MetaKey. Only in use for ShopifyFullProductExport(or create for new products #1)

#### SpecificationMetaKey

Same as above, but for Property “Specification”

#### MetaFieldNamespace

If Omnium should export custom product properties(product.properties) over to Shopify meta fields. The Shopify namespace should be defined here(and exists in Shopify).

### Meta Fields

We support exporting custom properties to metafield types: single\_line\_text\_field, multi\_line\_text\_field, number\_integer and boolean Properties using the namespace that are added above. Example: ShopifyProp1:OmniumProp1|ShopifyProp2:OmniumProp2 ShopifyProp1: Metakey in Shopify OmniumProp1: Omnium property key, from PropertyList. | between each property mapping.

We also support custom namespaces for each property Example: ShopifyNamespace.ShopifyProp1:OmniumProp1|ShopifyNamespace.ShopifyProp2:OmniumProp2 “‘.” is separating Shopify namespace and metakey

##### MetaFieldsCustomProperties (single\_line\_text\_field)

```json
{
    "key": "MetaFieldsCustomProperties",
    "value": "productid:id|section:section|category:category|customNamespace.model:model"
}
```

##### MultiLineMetaFieldsCustomProperties (multi\_line\_text\_field)

```json
{
    "key": "MultiLineMetaFieldsCustomProperties",
    "value": "washing_instructions:washing_instructions"
}
```

##### IntegerMetaFieldsCustomProperties (number\_integer)

```json
{
    "key": "IntegerMetaFieldsCustomProperties",
    "value": "hideProduct:hideProduct"
}
```

##### BooleanMetaFieldsCustomProperties (boolean)

```json
{
    "key": "BooleanMetaFieldsCustomProperties",
    "value": "hideProduct:hideProduct"
}
```

#### EnabledForMarkets

Used for a global connector with multi markets. Specify a list of marketIds the connector should be used for.

#### InventoryExportShouldIncludeInActiveProducts

Inventory export from Omnium to Shopify is default only for active products. Set this property to true for export inventory for inActive products also.

#### ShopifyPublishedScope

Valid values(from Shopify api doc): web :The product isn't published to the Point of Sale channel. global :The product is published to the Point of Sale channel.

### Product export

#### ShopifyOptions

For selecting variants, Shopify needs options. Default options from Omnium products are Size and Color. If you want different options, you could add properties on variants, with keyGroup “ShopifyOptions”. These props will be used as options for selecting variants. All variants must have the same options. ![Image](https://docs.omnium.no/_next/image?url=%2F_next%2Fstatic%2Fmedia%2FshopifyOptions.6b69ced2.png&w=3840&q=75)

#### Product ExternalId

Each product in Omnium must have an ExternalId with value from Shopify product id and/or id to the variant. Then we can make sure not to create duplicate products in Shopify and also be able to sync inventory.

Main product should have externalId with key: “ShopifyId”, and variants should have externalId with key: ShopifyExternalVariantId

If “ShopifyProductsExternalIdWithMarketPrefixEnabled” is true, the keys should be prefixed with {MarketId}\_ Example: ““SWE\_ShopifyId” and “SWE\_ShopifyExternalVariantId” Products that are update to N numbers of Shopify instances, or inventory should be synced to N number of instances, you will have N number of externalIds

If ShopifyExternalIdPrefix has value(used for connectors with multi markets) products will get externalIds with this prefix and not marketId.

#### Store/warehouse Location id

To be able to sync inventory from Omnium over to Shopify each store/warehouse in Omnium should have one or more properties in store.properties list. Key: {MarketId}\_{Shopify location id}, Example: key: SWE\_ShopifyLocationId, value: 7578425784032

#### Shipment option mapping

Possible to add a property on each Shipment Option in Omnium(on market) with key ShopifyId. Value should be the same as Shopify shipment name. If we got match, we set shipmentOption.ShippingMethodName on the order, and not the code we get from Shopify. Example: If you in Shopify has "Postnord home delivery(2 days)" as shipping, and in Omnium shippingMethodName that should be used is "PostnordHomeDelivey", and this is what you need on the order. Add a property on the shipment option, with key "ShopifyId" and value "Postnord home delivery(2 days)"

#### Scheduled Task

##### ShopifyOrdersScheduledTask

Sync orders from Shopify over to Omnium, each 5 min(configurable)

##### ShopifyFullInventoryExportScheduledTask

Possible to do a full inventory sync, from Omnium to all Shopify instances each night. To make sure everything is update.
