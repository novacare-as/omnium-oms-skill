# VAT / Product Groups

Source: https://docs.omnium.no/docs/plugins/POS/Sitoo/VatGroups

> How to map Omnium products to Sitoo Product Groups for correct VAT rates

# VAT / Product Groups

Sitoo uses **Product Groups** to determine which VAT rate applies to a product. When Omnium exports products to Sitoo, it needs to know which Product Group each product belongs to. This mapping is configured in the Sitoo connector options.

## How the Mapping Works

When a product is exported to Sitoo, the integration determines the Product Group ID through a **fallback chain**:

1.  **Match by Product Type** — The product's `ProductType` field is looked up in the `ProductGroupKeyGroup` mapping
2.  **Match by configurable property** — If no match is found by Product Type, a configurable product property (specified by `ProductGroupPropertyKey`) is used instead
3.  **Default Product Group** — If the product has no Product Type at all, the `DefaultProductGroup` setting is used

If none of these resolve to a valid Sitoo Product Group ID, no group is set and the product will use Sitoo's default behavior.

## Configuration

All settings are configured as connector option properties on the Sitoo market connector.

### 1\. Set up Product Groups in Sitoo

Configure Product Groups in Sitoo under **Settings > Product Groups**. Each group should have the appropriate VAT rate. Note the numeric ID of each group — you will need it for the mapping.

### 2\. Map values to Sitoo Product Group IDs

Add properties with `keyGroup: "ProductGroupKeyGroup"` to map Omnium values to Sitoo Product Group IDs:

```json
{
    "key": "Food",
    "value": "3",
    "keyGroup": "ProductGroupKeyGroup"
}
```

*   **key**: The value in Omnium to match against (e.g. a Product Type value like `"Food"`, or a property value like `"15"`)
*   **value**: The Sitoo Product Group ID that corresponds to the correct VAT rate
*   **keyGroup**: Must be `"ProductGroupKeyGroup"`

You can add as many entries as needed — one per distinct value you want to map.

### 3\. Configure the property-based lookup (optional)

If your products don't use the `ProductType` field, or you need to map based on a different product property, add the `ProductGroupPropertyKey` setting:

```json
{
    "key": "ProductGroupPropertyKey",
    "value": "VatCode"
}
```

This tells the integration to look up the product property named `VatCode` and use its value to find a matching entry in the `ProductGroupKeyGroup` mapping. For example, if a product has property `VatCode = "15"` and there is a `ProductGroupKeyGroup` entry with `key: "15"`, the corresponding Sitoo Product Group ID will be used.

### 4\. Set a default Product Group (optional)

For products that have no Product Type set, you can configure a fallback:

```json
{
    "key": "DefaultProductGroup",
    "value": "1"
}
```

This sets the default Sitoo Product Group ID (e.g. the standard VAT rate group) for products without a type.

## Lookup Order

The integration resolves the Product Group in this order:

| Step | Method | Condition |
| --- | --- | --- |
| 1 | `ProductType` → `ProductGroupKeyGroup` (market-specific) | Product has a `ProductType` value |
| 2 | `ProductType` → `ProductGroupKeyGroup` (global fallback) | Market-specific lookup returned no match |
| 3 | `ProductGroupPropertyKey` → `ProductGroupKeyGroup` | Steps 1-2 returned no match |
| 4 | `DefaultProductGroup` | Product has no `ProductType` |

## Example

A tenant has two VAT rates: 25% (standard) and 15% (food). In Sitoo, Product Group 1 = 25% and Product Group 3 = 15%.

Connector options:

```json
[
    { "key": "DefaultProductGroup", "value": "1" },
    { "key": "ProductGroupPropertyKey", "value": "VatCode" },
    { "key": "Standard", "value": "1", "keyGroup": "ProductGroupKeyGroup" },
    { "key": "Food", "value": "3", "keyGroup": "ProductGroupKeyGroup" },
    { "key": "15", "value": "3", "keyGroup": "ProductGroupKeyGroup" }
]
```

| Product | ProductType | VatCode property | Result |
| --- | --- | --- | --- |
| Backpack | `Standard` | — | Group 1 (matched by ProductType) |
| Apple juice | `Food` | `15` | Group 3 (matched by ProductType) |
| Gift card | — | `15` | Group 3 (matched by VatCode property) |
| Unknown item | — | — | Group 1 (DefaultProductGroup fallback) |
