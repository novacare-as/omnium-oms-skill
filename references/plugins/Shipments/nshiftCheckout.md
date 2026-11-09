# nShift Checkout v2

Source: https://docs.omnium.no/docs/plugins/Shipments/nshiftCheckout

> Integration with nShift Checkout v2 for delivery options and partial shipment tracking in Omnium.

[nShift Checkout Options API reference](https://developers.nshiftone.com/checkout/nshift-checkout-options-api)

Omnium integrates with **nShift Checkout v2** for fetching delivery options, rendering the new checkout widget, and creating partial shipments for conversion tracking. Booking and label printing happens in nShift's shipping solution and is **outside the scope of this provider**.

* * *

## Relation to nShift Delivery (v1 / Unifaun)

nShift Checkout v2 replaces the older [nShift Delivery (Unifaun)](nshiftDelivery.md) flow for delivery options and customer selection. It is registered as a **separate provider** in Omnium, so existing Unifaun tenants are unaffected — use this provider only when migrating to Checkout v2.

| Concern | nShift Delivery (v1) | nShift Checkout v2 |
| --- | --- | --- |
| Authentication | Bearer token (static secret) | OAuth2 (Client ID + Client Secret, 55 min token cache) |
| Delivery options | `GET /rs-extapi/v1/delivery-checkouts/{merchantId}` | Session-based: `POST /options/v1/sessions/{connectionId}` then `POST /options/v1/shipping-options/{sessionId}` |
| Customer selection | Stored as a prepared shipment in nShift; consumed at booking via `prepareId` | Stored locally on the shipment in Omnium as `NShiftCheckoutResult`; not consumed at booking |
| Widget | Unifaun widget | nShift Checkout v2 widget |
| Variable mapping (provider config) | `DeliveryCheckoutCustomFields` (pipe-separated `key:value` pairs) | `Variables` (pipe-separated names only — mapping is built in) |
| Pre-calculated variables (order property) | `UnifaunDeliveryOptions_AdditionalQueryStringParameters` | `NShiftDeliveryOptions_Variables` |
| Partial / prepared shipment | Prepared shipment chains to booking | Partial shipment is analytics-only (see [Partial Shipment](nshiftCheckout.md#partial-shipment)) |
| Booking | Performed by Omnium against nShift's shipping API | Not performed by Omnium — handled by your existing nShift shipping setup outside Omnium |

### Scope of the current integration

The current Omnium integration supports:

*   Fetching delivery options via the v2 session-based API
*   Rendering the Checkout v2 widget in the OMS
*   Creating a partial shipment for conversion tracking
*   Resolving dynamic variables (ADR, B2B, etc.) per order

Booking and label printing are **out of scope** for this provider — they continue to be handled by your nShift shipping solution exactly as before. Customer-selected widget data (addons, fields, pickup point) is captured on the shipment but not forwarded to the booking call.

* * *

## Configuration Steps

1.  Navigate to: **Configuration > Settings > Orders > Shipping providers > Add New**

* * *

## Required Settings

| Field | Description | Example value |
| --- | --- | --- |
| **Name** | Internal provider name | `Nshift` |
| **Display Name** | Name shown to users | `Nshift` |
| **Shipping Provider** | Select provider type | `NShift` |
| **Merchant ID** | OAuth2 Client ID from nShift Portal |  |
| **Merchant Secret** | OAuth2 Client Secret from nShift Portal |  |
| **API Token** | Connection ID from nShift Portal |  |
| **Vue Template** | UI template for the widget | `NshiftProvider` |

* * *

## Provider Properties

### Variables (dynamic carrier conditions)

A pipe-separated list of variable names sent to nShift in the `variables` field of the delivery options request. Each variable is resolved automatically per order based on the cart contents.

Example value:

```
adr|nopickupinstore|b2b
```

Supported variable names:

| Variable | Resolved from | Description |
| --- | --- | --- |
| `ADR` | Product property `DangerousGoods` | `true` if any product in the order has a dangerous goods flag set, otherwise `false` |
| `nopickupinstore` | Product property `CanPickupInStore` | `true` if any product has `CanPickupInStore = false` (pickup in store not possible) |
| `B2B` | Order customer type | `true` if the customer is B2B |
| `FreightClass` | Product `FreightClass` | Minimum freight class across all products in the order |
| `AcquisitionGroup` | Product property `AcquisitionGroup` | Expands into 6 boolean keys: `DC`, `DirBuKu`, `DirButik`, `DirDC`, `DirHUBEH`, `DirKund` — each `true` if any product has the matching acquisition-group value |

Names are case-insensitive in the configuration but sent to nShift using their canonical casing (e.g. `ADR`).

Note

Dynamic resolution runs only when the order does not have a pre-calculated `NShiftDeliveryOptions_Variables` property (see [Order Properties](nshiftCheckout.md#order-properties)). When that property is set, it takes precedence and dynamic resolution is skipped.

### CountrySelector

JSON array of countries available in the OMS country dropdown. Stored as an escaped JSON string:

```json
[{\"countryName\":\"Sverige\",\"countryCode\":\"SE\"}]
```

For multiple countries:

```json
[{\"countryName\":\"Sverige\",\"countryCode\":\"SE\"},{\"countryName\":\"Norge\",\"countryCode\":\"NO\"}]
```

**Fallback behavior** if `CountrySelector` is not configured:

1.  Uses `currentOrder.billingAddress.countryCode` as a single country option
2.  If the order has no billing country, the dropdown shows "Country is retrieved from market settings" — and the backend falls back to the market's default `CountryCode`

**Auto-selection**:

*   If `CountrySelector` has exactly one country, it's selected automatically
*   Otherwise the dropdown pre-selects the country matching the order's billing address (if any)

* * *

## Order Properties

### NShiftDeliveryOptions\_Variables (pre-calculated variables)

This is the v2 equivalent of v1's `UnifaunDeliveryOptions_AdditionalQueryStringParameters`. The order property is set by your webshop (or any external system) and contains the variables pre-calculated from cart contents:

```
cartprice=63.29&volume=0.001188&weight=0.069&ADR=false&B2B=true&nopickupinstore=false&DirKund=false&nopickupatservicepoint=false&LQ=false&Version=2
```

The value is a query-string-style payload (`key=value&key=value`). When this property is present:

*   The values are parsed and sent as the `variables` object in the nShift request body
*   Dynamic resolution from the provider's `Variables` config is **skipped entirely**
*   `packages`, `totalWeightKg`, `totalVolumeCm3`, and `totalPrice` are **omitted** from the request — only `currencyCode`, `languageCode`, `localeId`, `receiver`, and `variables` are sent

This mirrors v1's behavior: the property is an opaque pass-through of values calculated outside Omnium, and overrides any defaults Omnium would compute.

When the property is absent, Omnium falls back to dynamic resolution + computed packages/totals.

* * *

## Shipment Options

Unlike Unifaun, delivery options for nShift Checkout v2 are returned dynamically by the widget — there is no need to configure individual delivery methods per market.

You still need **one placeholder shipment option** registered against the provider so the system has at least one option to associate with the provider.

| Field | Value |
| --- | --- |
| **Shipping Method** | `nshift` |
| **Shipping Provider** | `Nshift` |
| **Label** | `Nshift` (or any internal name) |
| **Hide In OMS** | `true` |

Setting **Hide In OMS** to `true` prevents the placeholder option from showing as a separately selectable row in the OMS shipment options list. The actual delivery options appear dynamically inside the widget when staff browses delivery options on an order.

* * *

## How It Works

### 1\. Fetch delivery options (at checkout)

*   Omnium obtains an OAuth2 access token (cached for 55 minutes)
*   Creates a session via `POST /checkout/options/v1/sessions/{connectionId}`
*   Builds the request body in one of two ways:
    *   **If the order has `NShiftDeliveryOptions_Variables` set**: parse the property into the `variables` object, omit `packages`/`totalWeightKg`/`totalVolumeCm3`/`totalPrice`
    *   **Otherwise**: resolve `variables` from the provider's `Variables` config, include `packages` and totals computed from the order's colli data
*   Calls `POST /checkout/options/v1/shipping-options/{sessionId}` with the built request
*   The widget renders the available delivery options to the customer or staff

### 2\. Selection captured locally

*   When the customer selects an option in the widget, the result (option ID, pickup point, addons, fields) is stored on the shipment as the `NShiftCheckoutResult` property
*   No nShift API call happens at this step

### 3\. Partial shipment (`PrepareShipmentDelivery` workflow step)

*   Omnium calls `POST /checkout/shipments/v1/shipments?send-to-book-and-print=false`
*   This registers the conversion in nShift's tracking and stores the returned `NShiftPartialShipmentId` on the order
*   This step is **analytics-only** — it does not produce a bookable shipment in the shipping solution

### 4\. Booking (`CompleteShipment` workflow step)

*   Booking is handled by nShift's shipping solution and is **not part of the Checkout v2 provider**
*   Label printing happens through your existing nShift shipping setup as before

* * *

## Partial Shipment

Once an order is converted in the checkout, Omnium must create a partial shipment by calling `POST /shipments/v1/shipments`. This step is mandatory and ensures full compatibility with current and future nShift Checkout features, including accurate conversion rate calculation for nShift Experiments.

Omnium calls this endpoint with the query parameter `send-to-book-and-print=false`. As nShift documents:

> If you prefer not to use the partial shipment to create the actual shipment in your shipping solution, you can add the query parameter `send-to-book-and-print=false` to the `/shipments` URL. This registers the call for conversion tracking without creating a partial shipment in the shipping solution.

This is the mode Omnium operates in today: the partial shipment is registered for conversion tracking only, and the actual booking and label printing is performed separately by your existing nShift shipping setup.

In future, this provider may be extended to support creating an actual partial shipment in the shipping solution (without the `send-to-book-and-print=false` parameter), to take advantage of additional Checkout features as they are added by nShift.

* * *

## Booking

Booking and label printing are not handled by this provider. There are two practical setups:

### Booking outside Omnium (typical for v2)

The most common setup: bookings happen in your existing nShift shipping setup, ERP, or the nShift portal — entirely outside Omnium. The Checkout v2 provider only captures the customer's choice and records the conversion. The order in Omnium stays at its current status; no booking-related properties (tracking number, label link) are populated.

### Booking through Omnium via the inherited Unifaun path

If you want Omnium to drive booking as well, the inherited Unifaun gateway is invoked at the `CompleteShipment` workflow step. The flow falls through to **direct booking** (Option 2 in [nShift Delivery](nshiftDelivery.md)) — the v1 PrepareId chain (Option 1) is not used by this provider because `UnifaunPrepareId` is never set.

**Important limitation**: the direct-booking path looks up the shipment option by the static `ShippingMethodName` (`nshift`) and uses the values configured on it (`ShipmentProduct`, services, addons). The customer's actual widget selection (option ID, pickup point, addons, fields) is captured on the shipment as `NShiftCheckoutResult` but **not currently forwarded** to the direct-booking call. If you need that data carried through, additional mapping logic is required.

* * *

## Troubleshooting

### Two "Nshift" rows in the OMS shipment options list

Set `HideInOms = true` on the placeholder shipment option. Otherwise it appears as a separate row alongside the provider section that renders the widget.

### Dropdown shows individual letters as options

The `CountrySelector` value must be a JSON **array** (`[{...}]`), not a single object (`{...}`). Without the brackets, the dropdown iterates over the object's property values as if they were items.

### Widget doesn't load / postal code & country inputs missing

The widget script is loaded from the nShift CDN (`nshiftportal.com`). Check the browser console for script load errors. Make sure the CDN is not blocked by Content Security Policy or an ad blocker. If the widget script fails to load, the country and postal code inputs do not render.

### Vue Template not picked up

Make sure the provider config has the **Vue Template** set to `NshiftProvider` exactly — the value is case-sensitive.
