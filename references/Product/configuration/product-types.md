# Product Types

Source: https://docs.omnium.no/docs/Product/configuration/product-types

> Configure product types with custom properties to categorize and structure your product catalog

Product types allow you to define different categories of products with their own specific properties. For example, clothing products might have properties like "material" and "size", while electronics might have "voltage" and "warranty".

Product types are configured in the tenant settings under **Configuration → Settings → Products → Product Types**.

* * *

## Overview

Product types provide a way to:

*   **Categorize products**: Group products by their nature (clothing, electronics, food, etc.)
*   **Define type-specific properties**: Each product type can have its own set of custom properties
*   **Standardize data entry**: Ensure consistent property collection across products of the same type
*   **Enable inheritance**: Properties can be configured to inherit values to variants and language versions

* * *

## Configuring Product Types

### Product Type Structure

Each product type has the following configuration:

| Property | Type | Description |
| --- | --- | --- |
| name | string | The unique name/identifier for the product type. This is displayed in the product editor when selecting a type. |
| productTypeItems | array | The list of properties specific to this product type |

### Property Configuration

Each property within a product type supports the following options:

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| key | string | \- | The property identifier (used in API and data storage) |
| value | string | "" | The default value for this property |
| valueType | string | "string" | The data type: "string", "number", "boolean", "date" |
| keyGroup | string | null | Optional grouping key for organizing properties in the UI |
| variantsInheritValue | bool | false | When true, variants inherit this property value from the parent product |
| siblingsInheritValue | bool | false | When true, sibling products inherit this property value |
| productLanguagesInheritValue | bool | false | When true, language variants inherit this property value from the main language product |
| valueOptions | List<string> | null | Predefined list of allowed values (creates a dropdown in the UI) |
| isCustomValueOptionAllowed | bool | false | When true, users can enter custom values even when valueOptions is defined |
| isMultiSelectEnabled | bool | false | When true, multiple values can be selected from valueOptions |
| readOnly | bool | false | When true, the property cannot be edited in the UI |

* * *

## Inheritance Behavior

Product type properties support three types of inheritance:

### Variant Inheritance (`variantsInheritValue`)

When enabled, variants automatically receive the property value from their parent product. This is useful for properties that should be consistent across all sizes/colors of a product.

**Example use cases:**

*   Brand name (all variants share the same brand)
*   Country of origin
*   Care instructions

### Sibling Inheritance (`siblingsInheritValue`)

When enabled, related products (siblings) share property values. Changes to one sibling propagate to others.

**Example use cases:**

*   Collection name
*   Season

### Language Variant Inheritance (`productLanguagesInheritValue`)

When enabled, language variants inherit the property from the main language product. This is useful for properties that don't need translation.

**Example use cases:**

*   Numeric values (weight, dimensions)
*   Technical specifications
*   SKU-related data

* * *

## Value Options and Dropdowns

You can define predefined value options to create dropdown selections in the product editor:

```json
{
  "Key": "material",
  "Value": "",
  "ValueType": "string",
  "ValueOptions": ["Cotton", "Polyester", "Wool", "Silk", "Linen"],
  "IsCustomValueOptionAllowed": false,
  "IsMultiSelectEnabled": false
}
```

### Allowing Custom Values

Set `isCustomValueOptionAllowed: true` to let users enter values not in the predefined list:

```json
{
  "Key": "color",
  "ValueOptions": ["Red", "Blue", "Green", "Black", "White"],
  "IsCustomValueOptionAllowed": true
}
```

### Multi-Select Properties

Set `isMultiSelectEnabled: true` to allow selecting multiple values:

```json
{
  "Key": "features",
  "ValueOptions": ["Waterproof", "Breathable", "UV Protection", "Quick Dry"],
  "IsMultiSelectEnabled": true
}
```

* * *

## Ordering Product Types

Product types can be reordered using drag-and-drop in the UI. The order determines how they appear in dropdown menus when assigning a type to a product.

* * *

## Configuration Examples

### Clothing Product Type

```json
{
  "Name": "clothing",
  "ProductTypeItems": [
    {
      "Key": "material",
      "Value": "",
      "ValueType": "string",
      "ValueOptions": ["Cotton", "Polyester", "Wool", "Silk", "Linen", "Blend"],
      "IsCustomValueOptionAllowed": true,
      "VariantsInheritValue": true
    },
    {
      "Key": "careInstructions",
      "Value": "",
      "ValueType": "string",
      "VariantsInheritValue": true,
      "ProductLanguagesInheritValue": false
    },
    {
      "Key": "fit",
      "Value": "",
      "ValueType": "string",
      "ValueOptions": ["Slim", "Regular", "Loose", "Oversized"],
      "IsCustomValueOptionAllowed": false
    },
    {
      "Key": "gender",
      "Value": "",
      "ValueType": "string",
      "ValueOptions": ["Men", "Women", "Unisex", "Kids"],
      "VariantsInheritValue": true
    }
  ]
}
```

### Electronics Product Type

```json
{
  "Name": "electronics",
  "ProductTypeItems": [
    {
      "Key": "voltage",
      "Value": "",
      "ValueType": "string",
      "ValueOptions": ["110V", "220V", "110-240V"],
      "VariantsInheritValue": true,
      "ProductLanguagesInheritValue": true
    },
    {
      "Key": "warrantyMonths",
      "Value": "12",
      "ValueType": "number",
      "VariantsInheritValue": true
    },
    {
      "Key": "energyClass",
      "Value": "",
      "ValueType": "string",
      "ValueOptions": ["A+++", "A++", "A+", "A", "B", "C", "D"],
      "VariantsInheritValue": true
    },
    {
      "Key": "connectivity",
      "Value": "",
      "ValueType": "string",
      "ValueOptions": ["WiFi", "Bluetooth", "USB-C", "HDMI", "Ethernet"],
      "IsMultiSelectEnabled": true,
      "VariantsInheritValue": true
    }
  ]
}
```

### Food Product Type

```json
{
  "Name": "food",
  "ProductTypeItems": [
    {
      "Key": "allergens",
      "Value": "",
      "ValueType": "string",
      "ValueOptions": ["Gluten", "Nuts", "Dairy", "Eggs", "Soy", "Fish", "Shellfish"],
      "IsMultiSelectEnabled": true,
      "VariantsInheritValue": true
    },
    {
      "Key": "nutritionInfo",
      "Value": "",
      "ValueType": "string",
      "ProductLanguagesInheritValue": false
    },
    {
      "Key": "organic",
      "Value": "false",
      "ValueType": "boolean",
      "VariantsInheritValue": true
    },
    {
      "Key": "storageInstructions",
      "Value": "",
      "ValueType": "string",
      "ValueOptions": ["Room Temperature", "Refrigerate", "Freeze"],
      "VariantsInheritValue": true
    }
  ]
}
```

* * *

## Complete Configuration Example

Below is a complete example of ProductSettings with multiple product types:

```json
{
  "ProductSettings": {
    "ProductTypes": [
      {
        "Name": "clothing",
        "ProductTypeItems": [
          {
            "Key": "material",
            "Value": "",
            "ValueType": "string",
            "ValueOptions": ["Cotton", "Polyester", "Wool", "Silk"],
            "IsCustomValueOptionAllowed": true,
            "VariantsInheritValue": true
          },
          {
            "Key": "careInstructions",
            "Value": "",
            "ValueType": "string",
            "VariantsInheritValue": true
          },
          {
            "Key": "gender",
            "Value": "",
            "ValueType": "string",
            "ValueOptions": ["Men", "Women", "Unisex"],
            "VariantsInheritValue": true
          }
        ]
      },
      {
        "Name": "electronics",
        "ProductTypeItems": [
          {
            "Key": "voltage",
            "Value": "220V",
            "ValueType": "string",
            "VariantsInheritValue": true
          },
          {
            "Key": "warrantyMonths",
            "Value": "24",
            "ValueType": "number",
            "VariantsInheritValue": true
          }
        ]
      },
      {
        "Name": "furniture",
        "ProductTypeItems": [
          {
            "Key": "material",
            "Value": "",
            "ValueType": "string",
            "ValueOptions": ["Wood", "Metal", "Plastic", "Glass", "Fabric"],
            "IsCustomValueOptionAllowed": true
          },
          {
            "Key": "assemblyRequired",
            "Value": "false",
            "ValueType": "boolean"
          },
          {
            "Key": "weightKg",
            "Value": "",
            "ValueType": "number",
            "ProductLanguagesInheritValue": true
          }
        ]
      }
    ]
  }
}
```

* * *

## Integration with Completion Rates

Product types integrate with the [Completion Rates](completion-rates.md) feature. You can configure completion requirements specific to each product type, ensuring that products of different types have appropriate required fields.

When a product type is selected for a product, the completion rate calculation considers:

*   Built-in required fields
*   Default properties
*   Product type-specific properties

See [Completion Rates](completion-rates.md) for details on configuring completion requirements per product type.

* * *

## Best Practices

### Naming Conventions

*   Use lowercase, descriptive names for product types (e.g., "clothing", "electronics")
*   Use camelCase for property keys (e.g., "careInstructions", "warrantyMonths")
*   Keep names concise but clear

### Property Design

*   **Enable inheritance strategically**: Only enable inheritance for properties that genuinely should be shared
*   **Use value options**: Predefined options improve data consistency and reduce entry errors
*   **Group related properties**: Use `keyGroup` to organize properties logically in the UI
*   **Set sensible defaults**: Provide default values for properties with common values

### Maintenance

*   Review product types periodically to ensure they match your catalog needs
*   Add new properties when business requirements change
*   Consider the impact on existing products when modifying property configurations

* * *

## Troubleshooting

| Problem | Possible Cause | Solution |
| --- | --- | --- |
| Product type not appearing | Type was just added | Refresh the page or wait for cache to clear |
| Properties not showing on product | Wrong product type selected | Verify the correct type is assigned to the product |
| Inheritance not working | `variantsInheritValue` not enabled | Enable the appropriate inheritance flag on the property |
| Dropdown not showing options | `valueOptions` is empty or null | Add values to the `valueOptions` array |
| Can't enter custom value | `isCustomValueOptionAllowed` is false | Set `isCustomValueOptionAllowed: true` |
