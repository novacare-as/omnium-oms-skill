# Completion Rates

Source: https://docs.omnium.no/docs/Product/configuration/completion-rates

> Configure product completion rate tracking to measure and improve product data quality

Completion rates allow you to measure how complete your product data is. By assigning points to different properties, you can track the overall "completeness" of products and identify gaps in your product information.

Completion rate settings are configured in the tenant settings under **Configuration → Settings → Products → Completion Rates**.

* * *

## Overview

The completion rate feature helps you:

*   **Measure data quality**: Track how well your products are populated with required information
*   **Prioritize data entry**: Identify which products need attention
*   **Set requirements**: Define which properties are mandatory vs. optional
*   **Weight importance**: Assign different point values to properties based on their importance

* * *

## Configuration Structure

Completion rates are organized into three categories:

1.  **Built-in Properties**: Core product fields like name, description, images
2.  **Default Properties**: Custom properties defined in your default property configuration
3.  **Product Type Properties**: Properties specific to each product type

Each category can be independently enabled or disabled.

* * *

## Built-in Properties

Built-in properties are the standard product fields that come with Omnium. You can configure which of these fields contribute to the completion rate.

### Configuration

| Property | Type | Description |
| --- | --- | --- |
| isEnabled | bool | Enable/disable completion rate tracking for built-in properties |
| sumPoints | int | Total points available for this category (auto-calculated) |
| properties | array | Individual property configurations |

### Property Configuration

Each property in the completion rate can be configured with:

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| name | string | \- | The property identifier |
| points | int | 0 | Number of points awarded when this property is populated |
| isEnabled | bool | true | Whether this property contributes to the completion rate |
| isRequired | bool | false | Whether this property is mandatory for the product to be considered "complete" |

### Common Built-in Properties

The following built-in properties are typically available for completion rate tracking:

| Property | Description |
| --- | --- |
| name | Product name |
| description | Product description |
| shortDescription | Short/summary description |
| images | Product images |
| categoryIds | Assigned categories |
| brand | Brand name |
| sku | Stock keeping unit |
| ean | European Article Number (barcode) |
| price | Product price |
| costPrice | Cost price |
| weight | Product weight |
| dimensions | Product dimensions |

### Sample Configuration

```json
{
  "CompletionRateSettings": {
    "Products": {
      "RequiredFields": {
        "IsEnabled": true,
        "Properties": [
          { "Name": "name", "Points": 20, "IsEnabled": true, "IsRequired": true },
          { "Name": "description", "Points": 15, "IsEnabled": true, "IsRequired": true },
          { "Name": "images", "Points": 20, "IsEnabled": true, "IsRequired": true },
          { "Name": "categoryIds", "Points": 10, "IsEnabled": true, "IsRequired": true },
          { "Name": "brand", "Points": 10, "IsEnabled": true, "IsRequired": false },
          { "Name": "sku", "Points": 10, "IsEnabled": true, "IsRequired": true },
          { "Name": "ean", "Points": 5, "IsEnabled": true, "IsRequired": false },
          { "Name": "price", "Points": 10, "IsEnabled": true, "IsRequired": true }
        ]
      }
    }
  }
}
```

* * *

## Default Properties

If you have configured [default properties](../configuration.md#properties-configuration) in your product settings, you can also track their completion rates.

### Configuration

The structure is the same as built-in properties:

| Property | Type | Description |
| --- | --- | --- |
| isEnabled | bool | Enable/disable completion rate tracking for default properties |
| properties | array | Individual property configurations |

Default properties completion rate tracking is only available when you have configured default properties in your product settings.

### Sample Configuration

```json
{
  "CompletionRateSettings": {
    "Products": {
      "DefaultPropertiesStatus": {
        "IsEnabled": true,
        "Properties": [
          { "Name": "material", "Points": 10, "IsEnabled": true, "IsRequired": false },
          { "Name": "countryOfOrigin", "Points": 5, "IsEnabled": true, "IsRequired": false },
          { "Name": "careInstructions", "Points": 5, "IsEnabled": true, "IsRequired": false }
        ]
      }
    }
  }
}
```

* * *

## Product Type Properties

When you have configured [product types](product-types.md), you can define completion rate requirements specific to each product type. This allows different types of products to have different completion criteria.

### Configuration

Each product type has its own completion rate configuration:

| Property | Type | Description |
| --- | --- | --- |
| id | string | The product type identifier (matches the product type name) |
| isEnabled | bool | Enable/disable completion rate tracking for this product type |
| properties | array | Individual property configurations for this type |

### Sample Configuration

```json
{
  "CompletionRateSettings": {
    "Products": {
      "ProductTypeStatus": [
        {
          "Id": "clothing",
          "IsEnabled": true,
          "Properties": [
            { "Name": "material", "Points": 15, "IsEnabled": true, "IsRequired": true },
            { "Name": "careInstructions", "Points": 10, "IsEnabled": true, "IsRequired": true },
            { "Name": "fit", "Points": 5, "IsEnabled": true, "IsRequired": false },
            { "Name": "gender", "Points": 5, "IsEnabled": true, "IsRequired": true }
          ]
        },
        {
          "Id": "electronics",
          "IsEnabled": true,
          "Properties": [
            { "Name": "voltage", "Points": 15, "IsEnabled": true, "IsRequired": true },
            { "Name": "warrantyMonths", "Points": 10, "IsEnabled": true, "IsRequired": true },
            { "Name": "energyClass", "Points": 10, "IsEnabled": true, "IsRequired": false }
          ]
        },
        {
          "Id": "food",
          "IsEnabled": true,
          "Properties": [
            { "Name": "allergens", "Points": 20, "IsEnabled": true, "IsRequired": true },
            { "Name": "nutritionInfo", "Points": 15, "IsEnabled": true, "IsRequired": true },
            { "Name": "storageInstructions", "Points": 10, "IsEnabled": true, "IsRequired": true }
          ]
        }
      ]
    }
  }
}
```

* * *

## Calculating Completion Rate

The completion rate is calculated as follows:

1.  **Sum all enabled property points** for the applicable categories (built-in, default, product type)
2.  **Sum points for populated properties** where the property has a value
3.  **Calculate percentage**: (Populated Points / Total Points) × 100

### Example Calculation

For a clothing product with the following configuration:

| Property | Points | Required | Has Value |
| --- | --- | --- | --- |
| name | 20 | Yes | Yes |
| description | 15 | Yes | Yes |
| images | 20 | Yes | No |
| categoryIds | 10 | Yes | Yes |
| brand | 10 | No | Yes |
| material | 15 | Yes | Yes |
| careInstructions | 10 | Yes | No |

**Calculation:**

*   Total points: 20 + 15 + 20 + 10 + 10 + 15 + 10 = 100
*   Populated points: 20 + 15 + 0 + 10 + 10 + 15 + 0 = 70
*   Completion rate: 70%

* * *

## Required Properties

Properties marked as `isRequired: true` are mandatory. A product with missing required properties may:

*   Be flagged in reports
*   Be prevented from publishing (depending on your workflow configuration)
*   Receive a lower quality score

Required properties are separate from the points system. A product could have a high completion percentage but still be incomplete if a required property is missing.

* * *

## Enabling and Disabling

### Category Level

You can enable or disable entire categories:

```json
{
  "RequiredFields": {
    "IsEnabled": false
  }
}
```

When a category is disabled, its properties don't contribute to the completion rate calculation.

### Property Level

You can enable or disable individual properties within a category:

```json
{
  "Name": "shortDescription",
  "Points": 5,
  "IsEnabled": false,
  "IsRequired": false
}
```

Disabled properties are not included in the completion rate calculation.

* * *

## Complete Configuration Example

Below is a comprehensive example of completion rate settings:

```json
{
  "CompletionRateSettings": {
    "Products": {
      "RequiredFields": {
        "IsEnabled": true,
        "Properties": [
          { "Name": "name", "Points": 20, "IsEnabled": true, "IsRequired": true },
          { "Name": "description", "Points": 15, "IsEnabled": true, "IsRequired": true },
          { "Name": "shortDescription", "Points": 5, "IsEnabled": true, "IsRequired": false },
          { "Name": "images", "Points": 20, "IsEnabled": true, "IsRequired": true },
          { "Name": "categoryIds", "Points": 10, "IsEnabled": true, "IsRequired": true },
          { "Name": "brand", "Points": 10, "IsEnabled": true, "IsRequired": false },
          { "Name": "sku", "Points": 10, "IsEnabled": true, "IsRequired": true },
          { "Name": "ean", "Points": 5, "IsEnabled": true, "IsRequired": false },
          { "Name": "price", "Points": 5, "IsEnabled": true, "IsRequired": true }
        ]
      },
      "DefaultPropertiesStatus": {
        "IsEnabled": true,
        "Properties": [
          { "Name": "material", "Points": 10, "IsEnabled": true, "IsRequired": false },
          { "Name": "countryOfOrigin", "Points": 5, "IsEnabled": true, "IsRequired": false }
        ]
      },
      "ProductTypeStatus": [
        {
          "Id": "clothing",
          "IsEnabled": true,
          "Properties": [
            { "Name": "material", "Points": 15, "IsEnabled": true, "IsRequired": true },
            { "Name": "careInstructions", "Points": 10, "IsEnabled": true, "IsRequired": true },
            { "Name": "gender", "Points": 5, "IsEnabled": true, "IsRequired": true }
          ]
        },
        {
          "Id": "electronics",
          "IsEnabled": true,
          "Properties": [
            { "Name": "voltage", "Points": 15, "IsEnabled": true, "IsRequired": true },
            { "Name": "warrantyMonths", "Points": 10, "IsEnabled": true, "IsRequired": true }
          ]
        }
      ]
    }
  }
}
```

* * *

## Best Practices

### Point Allocation

*   **Weight by importance**: Assign more points to properties that have higher business value
*   **Consider customer impact**: Properties that affect the customer experience should have higher weights
*   **Balance the total**: Aim for a reasonable total that allows meaningful percentage calculations

### Required Properties

*   **Start with essentials**: Only mark truly essential properties as required
*   **Consider product types**: Different product types may have different requirements
*   **Review periodically**: As business needs change, update your requirements

### Monitoring

*   **Track trends**: Monitor average completion rates over time
*   **Identify gaps**: Use low completion rates to prioritize data improvement efforts
*   **Set targets**: Establish minimum completion rate thresholds for publishing

* * *

## Troubleshooting

| Problem | Possible Cause | Solution |
| --- | --- | --- |
| Completion rate shows 0% | All categories are disabled | Enable at least one category |
| Product type properties not showing | No product types configured | Configure product types first |
| Default properties tab missing | No default properties defined | Add default properties in product settings |
| Points not adding up correctly | Some properties are disabled | Check `isEnabled` on individual properties |
| Required property not being enforced | Property has `isRequired: false` | Set `isRequired: true` on the property |
