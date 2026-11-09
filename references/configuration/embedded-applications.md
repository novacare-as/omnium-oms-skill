# Embedded Applications

Source: https://docs.omnium.no/docs/configuration/embedded-applications

> Embed your own web application in the Omnium UI as a page or panel, receive user and object context through postMessage, and authenticate the user in your own application.

## Overview

You can embed your own web application inside the Omnium UI in an iframe. Omnium renders the iframe, passes context about the signed-in user and the object currently on screen, and leaves the rest to your application.

There are two ways to embed an application, and they differ in where it appears and what context it receives:

| Method | Where it appears | Context Omnium sends |
| --- | --- | --- |
| **Custom page** | Its own entry in the navigation menu, as a full page | The signed-in user |
| **GUI extension** | A panel, tab, sidebar or modal inside an existing Omnium page | The object on screen (order, product, customer, and so on) |

Both methods deliver context in two ways: values substituted into the iframe URL, and a `postMessage` sent into the iframe after it loads.

The context Omnium sends into the iframe is not signed, and it is not proof of identity. Anyone who can open the iframe URL can supply the same values, and a signed-in user can send an identical message from their browser's developer tools. Use the context to decide **what** to display, and authenticate the user in your own application before granting access. See [Authenticating the user](embedded-applications.md#authenticating-the-user).

* * *

## Custom pages

A custom page is a navigation component that opens your application instead of a built-in Omnium view. Use it when your application is a destination of its own rather than an addition to an existing page.

### Setting up a custom page

1.  Go to **Administration → Authorization**
2.  In the component tree, open the context menu on the parent the page should sit under and choose **Create**
3.  In the **Settings** tab, set **External URL** to your application's URL
4.  Set **ComponentName** to the label shown in the menu, and **Path** to the route the page is reached at
5.  Enable **Visible in Navigation** so the entry appears in the menu
6.  Grant the roles that should reach the page access to the component

The page then renders your URL in a full-page iframe.

**External URL** only takes effect on a component that has no built-in Omnium view of its own. Setting it on an existing component such as Orders or Products changes nothing — that component keeps rendering its built-in view. Always create a new component for an embedded application.

### Context in the URL

The **External URL** supports placeholders that Omnium replaces before loading the iframe. On a custom page, the following resolve:

| Placeholder | Resolves to |
| --- | --- |
| `{{user.email}}` | The signed-in user's email address |
| `{{user.firstName}}` | The user's first name |
| `{{user.lastName}}` | The user's last name |
| `{{user.id}}` | The user's identifier |
| `{{user.<propertyKey>}}` | The value of the custom property with that key on the user, when no field of that name exists |
| `{{tenantId}}` | The tenant identifier |
| `{{language}}` | The current UI language code |
| `{{selectedStoreIds}}` | The currently selected store IDs, comma-separated |

Values substituted from `{{user.*}}` are URL-encoded. An unknown placeholder resolves to an empty string rather than failing.

```
https://app.example.com/omnium?tenant={{tenantId}}&lang={{language}}&user={{user.email}}
```

Never place an API key, token, or other secret in the URL. The URL is stored in tenant settings that every signed-in Omnium user can read, and it is exposed in browser history, the `Referer` header, and your own server logs.

### Context in the message

When the iframe has finished loading, Omnium sends one message into it containing the signed-in user:

```json
{
  "user": {
    "id": "anna.berg@example.com",
    "email": "anna.berg@example.com",
    "firstName": "Anna",
    "lastName": "Berg",
    "properties": [
      { "key": "ErpUserId", "value": "EMP-4471" }
    ]
  }
}
```

| Field | Type | Description |
| --- | --- | --- |
| `id` | string | The user's identifier, normally the email address |
| `email` | string | Email address |
| `firstName` | string | First name |
| `lastName` | string | Last name |
| `properties` | array | Custom key/value properties on the user |

The message carries the user's identity and custom properties, and nothing else. Roles, phone number, store defaults and identity provider identifiers are not part of the payload. Fields with no value are omitted rather than sent as `null`, so treat every field as optional.

Use custom properties on the user to pass any additional identifier your application needs — an ERP employee number, an external account ID, a permission level of your own. Set them on the user under **Administration → Users**, and read them from `properties` in the message or from `{{user.<propertyKey>}}` in the URL.

* * *

## GUI extensions

A [GUI extension](gui-extensions.md) with an iframe URL embeds your application inside an existing Omnium page. Unlike a custom page it receives the object the user is working on, and **not** the signed-in user. When your application needs the user as well, pass it through the URL with `{{user.email}}` or another placeholder.

The message payload depends on the extension area the extension is assigned to. Areas rendered as a tab, context menu or action menu send an identifying wrapper around the object:

```json
{
  "objectId": "C123456",
  "className": "Order",
  "dataObject": { "id": "C123456", "status": 200, "orderLines": [] }
}
```

Areas rendered inline or in a sidebar send the object under `dataObject` and no `objectId` or `className`, usually together with a named alias. Some inline and sidebar areas send `dataObject` only — see the table below:

```json
{
  "dataObject": { "id": "C123456", "status": 200 },
  "order": { "id": "C123456", "status": 200 }
}
```

| Extension area | Message payload |
| --- | --- |
| `EditOrderInline` | `dataObject` (order) |
| `editorderSidebarLeft` | `dataObject`, `order` |
| `cartInline` | `dataObject`, `cart` |
| `cartTab` | `objectId`, `className`, `dataObject` (cart) |
| `productInline`, `editProductSidebar` | `dataObject`, `product` |
| `editProductTab` | `objectId`, `className`, `dataObject` (product) |
| `viewPrivateCustomerSidebarLeft` | `dataObject`, `customer` |
| `privateCustomerTab`, `businessCustomerTab` | `objectId`, `className`, `dataObject` (customer) |
| `storeInformationInline` | `dataObject`, `store` |
| `storeTab`, `supplierTab` | `objectId`, `className`, `dataObject` |
| `ordersEditPickList` | `dataObject`, `pickList`, `pickListItems` |
| `ordersPromotionInline` | `dataObject`, `promotion`, `currentPromotion` |
| `ProcessGoodsModal` | `dataObject`, `delivery`, `purchaseOrderLines`, `purchaseOrderId` |
| `DeliveriesInline` | `dataObject`, `delivery`, `purchaseOrderLines`, `purchaseOrderId`, `selectedPurchaseOrderLineItemId` |
| `AfterProcessGoodsModal` | `dataObject` holding `delivery`, `purchaseOrderLines`, `selectedPurchaseOrderLineItemId` and the processed goods data |
| `editPurchaseOrderDetailsInline`, `editPurchaseOrderSidebarLeft` | `dataObject` (purchase order) |
| `DeliveriesManageContextMenu` | `objectId`, `className`, `dataObject` holding `delivery`, `purchaseOrderLines`, `purchaseOrderId` |
| `PurchaseOrderManage`, `PurchaseOrderContextMenu` | `objectId`, `className`, `dataObject` holding a nested `dataObject`, `purchaseOrder` and `purchaseOrderId` |
| Context and action menu areas on a detail page | `objectId`, `className`, `dataObject` |
| An extension shown through a [custom view](gui-extensions.md#showing-an-extension-through-a-custom-view) | `objectId`, `className`, `dataObject` (product, cart, order line or project) |

Omnium sends no message at all when there is no object in context. This applies to the context menu areas on list pages (`orders`, `carts`, `products`, `stores`, `privateCustomers`, `businessCustomers`, `priceLists`), to `businessCustomersButtonRow`, and to the dashboard GUI extension gadget. An extension in one of those areas has to take everything it needs from the URL.

* * *

## Receiving the message

Omnium posts the context with the browser's `postMessage` API, addressed to the origin of the iframe URL. The payload is plain JSON.

|  | Custom page | GUI extension |
| --- | --- | --- |
| First message | When the iframe finishes loading | When the iframe finishes loading |
| Repeat | None | Once more, five seconds later |

Communication is one-way. Omnium does not listen for messages sent back from the iframe, so your application cannot acknowledge the message or ask for the context again. Register the listener synchronously at the top of your page, before the rest of the application loads, and store the payload as soon as it arrives — a custom page schedules no repeat.

```
<!-- In <head>, before the application bundle loads -->
<script>
  window.omniumContext = new Promise((resolve) => {
    window.addEventListener('message', (event) => {
      if (event.origin !== 'https://your-brand.oms.omnium.no') return;
      if (!event.data) return;
      resolve(event.data);
    });
  });
</script>
```

```
const context = await window.omniumContext;

const user = context.user;             // custom page
const order = context.dataObject;      // GUI extension
```

Compare `event.origin` against an exact string. A substring or pattern match accepts an origin such as `https://your-brand.oms.omnium.no.example.com`, which an attacker controls.

* * *

## Authenticating the user

Omnium does not currently issue a signed token that your application can verify, so the embedded application has to authenticate users itself. The message and the URL values tell you which user Omnium believes is signed in — they do not prove it.

Treat the context as a hint and verify it:

1.  Establish your own session in the iframe. Signing in against the same identity provider the Omnium users authenticate with makes this transparent to them, because the existing session is reused.
2.  Wait for the message from Omnium.
3.  Compare the identity from your own session with the identity Omnium sent, and only render when they match.

```
const [context, session] = await Promise.all([
  window.omniumContext,
  fetch('/api/me', { credentials: 'include' }).then((r) => r.json())
]);

if (session.email.toLowerCase() !== context.user.email.toLowerCase()) {
  showError('Signed-in user does not match');
  return;
}

// Use context.user.properties to decide what to show,
// but let your own session decide what the user is allowed to do.
```

### Response headers

Your application must allow Omnium to frame it, and must restrict who else can:

```
Content-Security-Policy: frame-ancestors https://your-brand.oms.omnium.no;
```

Do not send `X-Frame-Options: DENY` or `X-Frame-Options: SAMEORIGIN` — either prevents the iframe from rendering at all. Use `frame-ancestors` instead, naming the Omnium host, so no other site can embed your application and receive its content.

### Cookies

A session cookie set inside an iframe is a third-party cookie. Set it with `SameSite=None; Secure`, and be aware that browsers which block third-party cookies outright will drop it anyway. In that case, request access with the Storage Access API or move the sign-in into a popup window.

### Reading Omnium data

When your application needs data from Omnium, call the API from its **backend** using its own API user and client credentials, as described in [API Security](../Security/api-security.md). Never place an Omnium token in the browser: anything the iframe holds is readable by the user.

* * *

## Troubleshooting

| Symptom | Cause |
| --- | --- |
| The page stays blank and the browser console reports a framing error | Your application sends `X-Frame-Options`, or `frame-ancestors` does not include the Omnium host |
| No message arrives | The listener was registered after the page finished loading — register it synchronously in `<head>` — or the extension sits in an area with no object context |
| The message arrives but is ignored | The origin check does not match the Omnium host exactly, including scheme and any subdomain |
| Sign-in loops or the session is lost on every load | The session cookie is missing `SameSite=None; Secure`, or the browser blocks third-party cookies |
| A placeholder resolves to an empty string | The placeholder is not available in the area the application is embedded in — object placeholders do not resolve on a custom page |

* * *

## Related Documentation

| Topic | Link |
| --- | --- |
| GUI extensions and extension areas | [GUI Extensions](gui-extensions.md) |
| API authentication and credentials | [API Security](../Security/api-security.md) |
| Users, roles, and identity providers | [Authentication and Roles](../Security/authentication-roles.md) |
| Getting started with the API | [Preparing for integration](../GettingStartedWithAPI/getStarted.md) |
