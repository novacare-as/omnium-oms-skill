# GUI Extensions

Source: https://docs.omnium.no/docs/configuration/gui-extensions

> Extend the Omnium UI with custom iframes, webhook actions, and context-aware panels — without modifying the core platform.

## What Are GUI Extensions?

GUI extensions let you embed custom content and actions directly into the Omnium backoffice UI. Each extension is a configuration entry in tenant settings that can:

*   **Display an iframe** — embed an external application, dashboard, or tool inside an Omnium page
*   **Trigger a webhook** — add a button that sends contextual data to an external endpoint when clicked
*   **Show information** — display text, descriptions, or custom properties alongside Omnium data

Extensions are configured per tenant and appear in specific **extension areas** throughout the UI — on order pages, product pages, customer views, store pages, and more. No code changes to Omnium are required.

* * *

## How Extensions Work

```
  CONFIGURATION                    RUNTIME

  Admin configures                 Omnium UI renders
  extension in       ──────────▶   extension in the
  Settings                         assigned area
                                       │
                              ┌────────┴────────┐
                              ▼                 ▼
                        Iframe loads      Button click
                        with context      sends webhook
                        data (URL         with event
                        templates)        data
```

1.  An admin creates an extension in **Configuration > Settings > Advanced > GUI Settings**
2.  The extension is assigned to an **extension area** (e.g., the order sidebar, product edit page, or a context menu)
3.  At runtime, Omnium renders the extension in that area and passes **context data** (the current order, product, customer, etc.)
4.  If the extension has an **iframe URL**, it loads the external page with context values injected into the URL
5.  If the extension has a **webhook URL**, clicking the button sends the context data to the external endpoint

* * *

## Extension Areas

Each extension is assigned to an area that determines where it appears in the UI and how it's displayed. Areas are grouped by the page or feature they belong to.

### Orders

| Area | Display type | Description |
| --- | --- | --- |
| `orders` | Inline | Order list page |
| `orderInfo` | Inline | Order detail — info section |
| `EditOrderInline` | Inline | Order edit — inline panels |
| `editorderSidebarLeft` | Sidebar | Order edit — left sidebar |
| `orderEditManage` | Context menu | Order edit — manage/action menu |
| `orderEditCustomer` | Inline | Order edit — customer section |
| `orderEditExport` | Inline | Order edit — export section |
| `orderLine` | Context menu | Order line — right-click actions |
| `orderContextMenu` | Context menu | Order list — right-click actions |
| `ordersEditPickList` | Inline | Pick list edit page |
| `pickListContextMenu` | Context menu | Pick list — right-click actions |
| `ordersPromotionInline` | Inline | Order promotion section |

### Carts

| Area | Display type | Description |
| --- | --- | --- |
| `carts` | Inline | Cart list page |
| `cart` | Inline | Cart detail page |
| `cartInline` | Inline | Cart edit — inline panels |
| `cartManage` | Context menu | Cart — manage/action menu |
| `cartSidebar` | Sidebar | Cart — sidebar |

### Products

| Area | Display type | Description |
| --- | --- | --- |
| `products` | Inline | Product list page |
| `productEdit` | Inline | Product edit page |
| `productInline` | Inline | Product edit — inline panels |
| `editProductSidebar` | Sidebar | Product edit — sidebar |

### Customers

| Area | Display type | Description |
| --- | --- | --- |
| `privateCustomers` | Inline | Private customer list |
| `privateCustomerEdit` | Inline | Private customer edit page |
| `privateCustomerContact` | Inline | Private customer — contact section |
| `viewPrivateCustomerSidebarLeft` | Sidebar | Private customer — left sidebar |
| `businessCustomers` | Inline | Business customer list |
| `businessCustomerEdit` | Inline | Business customer edit page |
| `businessCustomerContact` | Inline | Business customer — contact section |
| `businessCustomersButtonRow` | Button row | Business customer list — action buttons |

### Stores

| Area | Display type | Description |
| --- | --- | --- |
| `stores` | Inline | Store list page |
| `storeEdit` | Inline | Store edit page |
| `storeInformationInline` | Inline | Store edit — info section |
| `storeTab` | Tab | Store edit — additional tab |

### Purchase Orders

| Area | Display type | Description |
| --- | --- | --- |
| `editPurchaseOrderDetailsInline` | Inline | Purchase order detail — inline |
| `PurchaseOrderManage` | Context menu | Purchase order — manage menu |
| `editPurchaseOrderSidebarLeft` | Sidebar | Purchase order — left sidebar |
| `PurchaseOrderContextMenu` | Context menu | Purchase order list — right-click |
| `ProcessGoodsModal` | Inside modal | Goods reception modal |
| `AfterProcessGoodsModal` | Inside modal | After goods reception |

### Deliveries

| Area | Display type | Description |
| --- | --- | --- |
| `DeliveriesInline` | Inline | Delivery view — inline panels |
| `DeliveriesManageContextMenu` | Context menu | Delivery — manage menu |

### Other

| Area | Display type | Description |
| --- | --- | --- |
| `customView` | Custom view | Shown only inside a custom view that selects it — see [Showing an extension through a custom view](gui-extensions.md#showing-an-extension-through-a-custom-view) |
| `settings` | Inline | Settings page |

* * *

## Extension Model

Each extension is a JSON object in `TenantSettings.GuiSettings.GuiExtensions`:

| Property | Type | Description |
| --- | --- | --- |
| **Name** | string | Internal name (or translation key via `NameTranslateKey`) |
| **GuiExtensionArea** | string | Which area to display in (see [Extension Areas](gui-extensions.md#extension-areas)) |
| Header | string | Title shown above the extension (or `HeaderTranslateKey`) |
| Description | string | Text displayed in the extension panel (or `DescriptionTranslateKey`) |
| ButtonText | string | Label for the action button (or `ButtonTextTranslateKey`) |
| IconCssClass | string | CSS class for the extension icon |
| IframeUrl | string | URL to load in an iframe (supports [URL templates](gui-extensions.md#url-templates)) |
| WebhookUrl | string | URL to call when the button is clicked |
| WebhookHttpVerb | string | HTTP method for webhook (`POST` or `GET`) |
| WebhookRequestHeaders | List | Custom headers sent with webhook requests |
| Properties | List | Custom key-value properties displayed in the panel |
| Tags | List | Tags for [conditional display](gui-extensions.md#tag-based-filtering) |

### Minimal example

An extension that embeds an external dashboard on the order edit page:

```json
{
  "Name": "Order Dashboard",
  "GuiExtensionArea": "EditOrderInline",
  "Header": "External Dashboard",
  "IframeUrl": "https://dashboard.example.com/order?id={{dataObject.orderId}}"
}
```

### Full example

An extension with both an iframe and a webhook action:

```json
{
  "Name": "Fraud Check",
  "GuiExtensionArea": "editorderSidebarLeft",
  "Header": "Fraud Analysis",
  "Description": "Review fraud risk score for this order",
  "ButtonText": "Run Fraud Check",
  "IconCssClass": "fa fa-shield",
  "IframeUrl": "https://fraud.example.com/check?order={{dataObject.orderId}}&market={{dataObject.marketId}}",
  "WebhookUrl": "https://api.example.com/webhooks/fraud-check",
  "WebhookHttpVerb": "POST",
  "WebhookRequestHeaders": [
    { "Key": "Authorization", "Value": "Bearer your-api-key" },
    { "Key": "X-Source", "Value": "omnium" }
  ],
  "Tags": ["requires-review"]
}
```

* * *

## Iframe Extensions

When an extension has an `IframeUrl`, Omnium renders an iframe in the designated area. The iframe receives context data in two ways:

### URL templates

The `IframeUrl` supports dynamic placeholders that are replaced with actual values at render time. Placeholders use double curly braces:

| Placeholder | Resolves to |
| --- | --- |
| `{{dataObject.*}}` | Any property on the current object (order, product, customer, etc.) |
| `{{user.email}}` | Current logged-in user's email |
| `{{user.firstName}}` | Current user's first name |
| `{{user.lastName}}` | Current user's last name |
| `{{user.<propertyKey>}}` | The value of the custom property with that key on the user, when no field of that name exists |
| `{{tenantId}}` | The tenant identifier |
| `{{language}}` | Current UI language code |
| `{{selectedStoreIds}}` | Comma-separated list of currently selected store IDs |

**Example URLs:**

```
https://app.example.com/order/{{dataObject.orderId}}
https://erp.example.com/customer?id={{dataObject.customerId}}&lang={{language}}
https://dashboard.example.com/?stores={{selectedStoreIds}}&user={{user.email}}
```

### postMessage API

After the iframe loads, Omnium also sends the context data to the iframe via the browser's `postMessage` API, addressed to the origin of the iframe URL. Your iframe application can listen for this message to receive the complete object data:

```
window.addEventListener('message', function(event) {
  // Verify origin for security — compare against an exact string
  if (event.origin !== 'https://your-brand.oms.omnium.no') return;

  const order = event.data.dataObject;
});
```

The shape of the payload depends on the extension area. Areas rendered as a tab, context menu or action menu send `objectId` and `className` alongside `dataObject`; areas rendered inline or in a sidebar send `dataObject` without those identifiers, usually with a named alias. Areas that have no object in context — the context menus on list pages and the dashboard gadget — receive no message at all. See [Embedded Applications](embedded-applications.md#gui-extensions) for the payload of each area.

Omnium sends the postMessage twice — once when the iframe loads, and again five seconds later. This ensures your application receives the data even if it initializes slowly. Communication is one-way: Omnium does not listen for messages sent back from the iframe.

The context Omnium sends is not signed and is not proof of identity. Use it to decide what to display, and authenticate the user in your own application before granting access. See [Authenticating the user](embedded-applications.md#authenticating-the-user).

* * *

## Webhook Extensions

When an extension has a `WebhookUrl` and `ButtonText`, Omnium displays an action button. Clicking the button sends the current context data to the webhook URL.

### Request format

The webhook receives a JSON payload containing the event data for the current context object:

```json
{
  "objectId": "ORD-12345",
  "className": "Order",
  "message": "Fraud Check",
  "operationId": 200001,
  "category": "Information",
  "attachments": [
    { "name": "SLA", "type": "...", "value": "24 hours" }
  ]
}
```

The `message` is the extension's name, and any custom `Properties` configured on the extension are sent as `attachments` (each with `name`, `type`, and `value`). The `className` and `objectId` identify the current context object.

Custom headers configured in `WebhookRequestHeaders` are included in the request, allowing you to pass API keys or other authentication tokens.

### Response format

Your webhook endpoint can return a validation result that Omnium displays to the user:

```json
{
  "isValidatedSuccessful": true,
  "validationMessage": "Fraud check passed — low risk score",
  "validationWarnings": [
    { "message": "Customer is from a new region" }
  ],
  "validationErrors": []
}
```

| Field | Type | Effect |
| --- | --- | --- |
| `isValidatedSuccessful` | bool | Whether the operation succeeded. When `false`, the first validation error message is shown as a failure |
| `validationMessage` | string | Informational message shown to the user on success |
| `validationWarnings` | object\[\] | Warning entries (each with a `message`); the first is shown to the user |
| `validationErrors` | object\[\] | Error entries (each with a `message`); the first is shown when validation fails |

### Retry policy

Webhook requests are retried automatically on failure, with increasing delays between attempts (1, 5, and 15 seconds).

### Event logging

Every webhook trigger is logged in the Omnium event system with operation ID `200001` (GuiExtensionTriggered). You can subscribe to this event via the standard [Events system](../Integrations/events.md) for monitoring or auditing.

* * *

## Tag-Based Filtering

Extensions can be conditionally displayed based on tags. When an extension has `Tags` configured, it only appears if the current context object's tags include **at least one** of the extension's tags.

This lets you show different extensions for different types of objects. For example:

```json
[
  {
    "Name": "B2B Credit Check",
    "GuiExtensionArea": "orderInfo",
    "Tags": ["B2B"],
    "IframeUrl": "https://credit.example.com/check?order={{dataObject.orderId}}"
  },
  {
    "Name": "Gift Wrapping Options",
    "GuiExtensionArea": "orderInfo",
    "Tags": ["gift-order"],
    "IframeUrl": "https://gifts.example.com/wrap?order={{dataObject.orderId}}"
  }
]
```

The "B2B Credit Check" extension only appears on orders tagged with "B2B". The "Gift Wrapping Options" extension only appears on orders tagged with "gift-order".

* * *

## Showing an extension through a custom view

A custom view can show one GUI extension instead of its grid of fields, or as an item in the grid (see [As an item in the grid](gui-extensions.md#as-an-item-in-the-grid)). To replace the grid, the view names the extension in its `guiExtensionName` field, set with the **Extension** picker in the custom view editor under **Configuration > Custom views**. When the field is empty the view shows its grid as before.

The view keeps its own area, markets, order types and hidden tabs, so the custom view decides where and for whom the extension appears. Any extension can be picked, whatever its area. Assign an extension to the `customView` area to keep it out of every other extension area: it then appears only in the custom views that select it.

The extension is referenced by its `Name`. If the extension is renamed or removed in GUI settings, the custom view shows nothing; administrators see a note that the extension was not found.

The extension replaces the grid in these places, with this event context:

| Custom view context | Areas | `className` | `objectId` | `dataObject` |
| --- | --- | --- | --- | --- |
| Product | `ProductQuickEdit`, `ProductCreate` | `Product` | Product ID | The product |
| Cart | `CartEdit` | `Cart` | Cart ID | The cart |
| Order line | `EditOrderLine` | `OrderLine` | Line item ID | The order line |
| Project | Workflow step dashboards | `Project` | Project ID | The project |

In the `OrderLineEnrichment` and `CreateConfigurableProduct` areas the extension is ignored and the view keeps its grid.

The iframe URL takes the usual [URL templates](gui-extensions.md#url-templates), filled from the `dataObject` in the table — for example `https://stock.example.com/?sku={{dataObject.id}}` on a product view, or `{{dataObject.lineItemId}}` on an order line view. The [postMessage](gui-extensions.md#postmessage-api) payload and the [webhook request](gui-extensions.md#request-format) carry the `objectId` and `className` from the table. [Tag-based filtering](gui-extensions.md#tag-based-filtering) is not applied to an extension shown through a custom view.

### As an item in the grid

An extension can also be one item in the grid, next to the fields. In the custom view editor, pick **GUI extension** in **Add property** and choose the extension in the item's header; a view can hold several extension items. The item is stored in the view's `dashboardItems` like the other tools, with the extension name in its item string (`custom-gui-extension:omnium__name{StockCheck}`).

The extension fills the item, so its height is the height the item is given in the editor. Iframe, properties and webhook button work as for a whole-view extension, with the same event context and areas.

* * *

## Custom Properties

Extensions can include custom key-value properties that are displayed in the extension panel. These are useful for showing static configuration or reference information:

```json
{
  "Name": "Support Info",
  "GuiExtensionArea": "orderInfo",
  "Header": "Support Details",
  "Properties": [
    { "Key": "SLA", "Value": "24 hours" },
    { "Key": "Escalation Email", "Value": "escalation@company.com" },
    { "Key": "Documentation", "Value": "https://wiki.company.com/support" }
  ]
}
```

* * *

## Help Menu Items

In addition to page-level extensions, you can add custom items to the help menu in the Omnium UI. Help menu items are configured in `TenantSettings.GuiSettings.GuiHelpMenuItems`:

```json
{
  "GuiHelpMenuItems": [
    {
      "Name": "Company Wiki",
      "Url": "https://wiki.company.com/omnium",
      "Routes": ["orders", "products"]
    },
    {
      "Name": "Training Videos",
      "Url": "https://training.company.com",
      "Routes": []
    }
  ]
}
```

When `Routes` is empty, the help item appears on all pages. When specific routes are listed, it only appears on matching pages.

* * *

## Common Patterns

### External dashboard on order page

Embed an analytics dashboard that shows order-specific insights:

```json
{
  "Name": "Order Analytics",
  "GuiExtensionArea": "editorderSidebarLeft",
  "Header": "Analytics",
  "IframeUrl": "https://analytics.example.com/order/{{dataObject.orderId}}?lang={{language}}"
}
```

### ERP sync button

Add a button that triggers an order sync to your ERP system:

```json
{
  "Name": "Sync to ERP",
  "GuiExtensionArea": "orderEditManage",
  "ButtonText": "Send to ERP",
  "IconCssClass": "fa fa-sync",
  "WebhookUrl": "https://erp-integration.example.com/sync",
  "WebhookHttpVerb": "POST",
  "WebhookRequestHeaders": [
    { "Key": "Authorization", "Value": "Bearer erp-api-key" }
  ]
}
```

### Store-specific information panel

Show store-specific tools on the store edit page:

```json
{
  "Name": "Store Performance",
  "GuiExtensionArea": "storeTab",
  "Header": "Performance Dashboard",
  "IframeUrl": "https://dashboard.example.com/store/{{dataObject.id}}?stores={{selectedStoreIds}}"
}
```

### Customer lookup in external CRM

Embed a CRM view on the customer page:

```json
{
  "Name": "CRM Profile",
  "GuiExtensionArea": "privateCustomerEdit",
  "Header": "CRM",
  "IframeUrl": "https://crm.example.com/customer?email={{dataObject.email}}"
}
```

* * *

## Configuring in the UI

Extensions are managed in the Omnium backoffice under **Configuration > Settings > Advanced > GUI Settings**.

The admin panel provides:

1.  **Extensions tab** — add, edit, reorder, and remove extensions
    *   **Settings**: name, header, description, button text, area assignment, tags, icon
    *   **Properties**: custom key-value pairs
    *   **IFrame**: iframe URL configuration
    *   **Webhook**: webhook URL, HTTP method, custom request headers
2.  **Help menu tab** — configure custom help menu items

Extensions can be reordered by dragging them in the list. The order determines the display order within each extension area.

* * *

## Related Documentation

| Topic | Link |
| --- | --- |
| Embedding and authenticating an external application | [Embedded Applications](embedded-applications.md) |
| Events and webhooks | [Events](../Integrations/events.md) |
| Custom reports | [Custom Reports](custom-reports.md) |
| Configuration overview | [Configuration](../configuration.md) |
