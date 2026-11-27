# Properties

Source: https://docs.omnium.no/docs/Product/api-reference/product-properties

> Learn how to configure and manage product properties, including dropdowns, lists, and custom value types.

## Properties and Value Types

### Drop-down

The drop-down value type allows you to configure a set of options that can be selected from a dropdown list in the UI.

![Screenshot from Omnium's interface displaying the process of adding default value options to product properties](https://docs.omnium.no/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fdefaultvalueproperty.25411fa1.png&w=3840&q=75)

These options are available when the property is edited, for example, through "Edit Product."

![Screenshot from Omnium's interface displaying the process of selecting product property values](https://docs.omnium.no/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fproduct-property.f9c36dc6.png&w=3840&q=75)

By default, only a single selection is allowed. If multiple selections are needed, enable the setting "Allow multiple selections." Additionally, you can enable "Allow custom dropdown values" to permit adding options that are not predefined.

**Important:** Drop-down properties must be defined in the configuration. This is because the options ("valueOptions") are only stored in settings. New multi-select properties cannot be created directly from items like products, as these properties retrieve their "valueOptions" from settings rather than storing them.

* * *

### List

The "List" value type allows multiple values to be added to the same key.

Default properties are not automatically saved or updated to the products. For example, in the "Edit Product" view, you may notice that these properties do not initially appear in the property list on the right. However, when the "Edit" modal is opened, default properties are added to the list, and the value types are updated according to the default properties in settings. These changes are not saved on the product until you click "Save."

* * *

### Property Model

```json
{
    "key": "Material",
    "value": "Carbon",
    "valueType": "DropDown",
    "keyGroup": ""
}
```

A property is a key-value pair with non-strongly typed properties.

*   **Key:** The unique identifier.
*   **Value:** The property value.
*   **ValueType:** Defines the data type and determines the UI view & patch behavior for multiKey (multiselect dropdown/list) properties. Valid options include:
    *   String, Boolean, DateTime, Date, Number, Textarea, Xhtml, Store, File, DropDown, List
*   **KeyGroup:** Used to group properties in the UI.

* * *

### Multi-select Drop-down & List Properties

A property can only consist of a single string value. To handle multi-select drop-down and list properties, multiple properties with the same key are stored.

* * *

### DefaultProperty (from configurations)

In addition to the properties in the property model, default properties include:

```json
{
    "valueOptions": [], // List of strings
    "isCustomValueOptionAllowed": true,
    "isMultiSelectEnabled": true,
    "readOnly": true
}
```

*   **ReadOnly:** Makes the property read-only in the Omnium UI.
*   **ValueOptions, isCustomValueOptionAllowed, and isMultiSelectEnabled:** Only applicable for properties with valueType = DropDown.
    *   **ValueOptions:** Predefined options for the dropdown/multiselect.
    *   **isCustomValueOptionAllowed:** Enables adding custom values.
    *   **isMultiSelectEnabled:** Allows multiple selections if set to true.

* * *

### Patch

The "Properties" patch operation is highly flexible and can be customized in several ways:

*   **Patch.Properties:** Contains the properties to be updated.
*   **Patch.PropertiesRemovalConditions:** Specifies conditions for removing existing properties before applying updates.
*   **Patch.KeepExistingCustomProperties:** Controls whether new properties are added to existing ones or replace the entire list (default: true).
*   **Patch.DontOverwriteExistingPropertyValues:** Prevents overwriting properties that already have values. Useful for list or multi-select properties.

* * *

### PropertiesRemovalConditions

A list of `OmniumPropertyItem` that specifies conditions for removing existing properties. Maximum length: 250 items. Each condition contains multiple attributes, all of which must match an existing property for removal. For example:

```json
{
    "keyGroup": "KeyGroupToRemove",
    "valueType": "List"
}
```

This removes properties only if both `keyGroup == "KeyGroupToRemove"` and `valueType == "List"`. Conditions are evaluated using "OR" logic, so any matching condition triggers removal.

* * *

### KeepExistingCustomProperties

Determines whether to keep or update existing custom properties.

*   Set to `false` to update the entire properties list.
*   Set to `true` to add new properties to the existing list. Default is `true`.

* * *

### DontOverwriteExistingPropertyValues

Controls whether to overwrite existing property values.

*   Set to `true` to skip updating properties that already have values.
*   To add values to list/multi-select properties, set this option to `true` along with `valueType: "List"` or `DropDown`. Otherwise, the list property will be overwritten.

* * *
