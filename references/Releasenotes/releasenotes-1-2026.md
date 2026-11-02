# 2026

Source: https://docs.omnium.no/docs/Releasenotes/releasenotes-1-2026

> Key updates, bug fixes, and improvements for Omnium in 2026, detailed week by week.

**Black week**: We will freeze deploy after November 17th and until December 8th to ensure that Black Friday/Week/Month will go as smooth as possible. This means that new features must be ready in dev by November 6th in order to make it to the test period.

## Upcoming Release 2026-38

Release date: Nov 10, 2026

### Main focus areas

This release strengthens inventory and purchasing workflows, improves order and shipment handling, and expands payment, receipt and VAT capabilities. Product management becomes more flexible with enhanced custom views and search, while API and integration updates provide better event filtering, shipment updates and multi-market support.

### Key changes and improvements

#### Payments, Accounting & VAT

*   Payment types can now be assigned their own ledger accounts, allowing payment schemes such as Visa to be booked separately. A new Generate accounts for payment types action suggests accounts based on payment types used during the last 90 days.
*   Omnium can now generate a paid receipt for each delivered shipment, including delivered items, payments and VAT breakdowns. Add the Create receipt for shipment workflow step after Capture, and receipts can be made available through the invoice API.
*   Stores can now use their own VAT rates without requiring tenant-level VAT rates. With tax groups enabled and a default code configured, stores use their own rates while other sales use the market VAT rates.
*   Order lines using fixed-price promotions now always add up to the order total, preventing rounding differences that could cause receipt exports to fail.

#### Order Management & Fulfillment

*   Allocation rules can now assign the cart to the store shipping the goods. For Click & Collect, the order is assigned to the pickup store, even when the cart was started elsewhere.
*   Return notifications can include the return's credit note as a PDF attachment. The Create credit note workflow step must run before the notification step in the same return status.
*   A new Add properties to shipment workflow step allows custom shipment properties to be set during processing. The `{Now}` value can record when an event occurred, such as when a shipment became ready for pickup.
*   Shipment PATCH endpoints now support setting or correcting the completed date without sending the entire shipment.
*   Sitoo Click & Collect can now cancel an order in Omnium when a store rejects the pickup, optionally using a configured order status. An experimental setting can also cancel the order in Sitoo.
*   Order, purchase order and product lists now support keyboard navigation with `Ctrl+Shift+Up` and `Ctrl+Shift+Down` to select rows, and Enter to open them.

#### Inventory & Purchasing

*   Inventory now supports priority stock: units a store should sell first, such as returned items outside its regular assortment. Returns can mark these units automatically, allocation can prioritize stores holding them, and the units remain available for Click & Collect outside the store's assortment.
*   Warehouse priorities can now be reordered using drag and drop, with a Move to top action for quick adjustments.
*   Reorder suggestions now include a `boost` property, allowing external analysis to increase or decrease suggested quantities.
*   Purchase orders can now be created automatically as drafts based on reorder suggestions.

#### Product Management & Customization

*   New products can inherit default markets configured in the product creation custom view. Markets unavailable to the user are automatically excluded.
*   Custom views can now display GUI extensions instead of the standard field grid, or include them as individual items. This is supported in product quick edit, carts, order lines and project steps.
*   The product Sales tab now shows ordered and delivered quantities per order line, with cancelled quantities highlighted in red.
*   Product search now supports partial, multi-word matching in any order, finding products as the customer types.
*   Product pages now display property items beneath their respective properties, and product search can filter by a property's key group.

#### Integrations & APIs

*   Order payments in the public API now include a payment number. Integrations can use this shorter reference instead of the payment ID and update it through PATCH.
*   Tripletex can now post to a separate company per market using an `EmployeeToken` configured on the market's connector. Orders, products and invoice payments use the corresponding company.
*   Cart event subscriptions can now be filtered by order type and cart status. Cart events also respect the market filter.
*   Front Systems inventory sync transactions now identify the scheduled task as the user and use the new `Integration` transaction type, making synchronized stock updates easier to distinguish from other inventory activity.

#### Campaigns & Price Lists

*   When a campaign is changed, products no longer included in it are removed from the campaign's price list, and the price list is updated with the campaign name.

| Type | Issue No | Domain | Description |
| --- | --- | --- | --- |
| Feature | #DEV-25837 | Core | You can now book a payment type, such as a card scheme, on its own account in the chart of accounts, for example Nets|Visa. Payment types without their own account still book to the payment method's account. The new action Generate accounts for payment types suggests accounts from the payment types used in the last 90 days. |
| Feature | #DEV-25834 | Core | Allocation rules can now give the cart the store that ships the goods. With click and collect, the order then belongs to the store where the customer collects it, even when the cart was started in another store. |
| Feature | #DEV-25808 | Api | Payments on orders in the public API now include the payment number. Integrations can use this short number instead of the payment ID, and can set it with PATCH. |
| Feature | #DEV-25804 | Order management | Return notifications can now attach the credit note of the return as a PDF. Select the Credit notes attachment on the return notification, and place Create credit note before the notification step in the same return status. |
| Feature | #DEV-25802 | Product | You can now set default markets on the Markets field in a custom view for product creation, so new products start in those markets. Markets that the user has no access to are left out. |
| Feature | #DEV-25799 | Core | Custom views can now show a GUI extension. Pick an extension on the custom view to show it in place of the field grid on product quick edit, cart, order line and project step pages, or add it as an item in the grid. |
| Feature | #DEV-25793 | Product | The Sales tab on the product page now shows the delivered and ordered quantity of each order line, as on the order page. Canceled quantities are shown in red, so canceled lines are no longer mistaken for sales. |
| Bugfix | #DEV-25782 | Core | When you change a campaign, products that no longer belong to it are removed from the campaign's price list. The price list also gets the name of the campaign. |
| Bugfix | #DEV-25781 | Order management | Orders with a fixed price promotion, such as "3 for 59", could have order lines that added up to 1-2 øre more or less than the order total. Receipt exports such as Voyado then rejected the order. The order lines now always add up to the order total. On existing orders, one line amount can change by 1-2 øre at the next update, and the order total stays the same. |
| Feature | #DEV-25774 | Core | You can now move through the order list, the purchase order list and the product list with the keyboard. Press Ctrl+Shift+Down or Ctrl+Shift+Up to highlight a row, and press Enter to open it. |
| Feature | #DEV-25760 | Sitoo Connector | Sitoo click and collect: a new market setting lets a pickup rejected in the store cancel the order in Omnium, optionally to a status of your choice. An experimental setting can also cancel the order in Sitoo. |
| Feature | #DEV-25759 | Core | Event subscriptions for carts can now be filtered on order type, so you only receive cart events for the order types you choose. |
| Feature | #DEV-25757 | Core | You can now reorder the warehouse priority list under Stores with drag and drop. A new "Move to top" option in each row's menu moves a warehouse to the top of the list in one step. |
| Feature | #DEV-25754 | Shipment | Shipment PATCH endpoints now accept a completed date. You can set or correct when a shipment was completed without sending the full shipment with PUT. |
| Feature | #DEV-25727 | Core | Event subscriptions for carts can now filter on cart status. Cart events now also match the market filter. |
| Feature | #DEV-25726 | Product | Product search now finds products while the customer is still typing. Each word can be the start of a word in the product name, in any order, so "dung crawler carl" finds "Dungeon Crawler Carl". |
| Feature | #DEV-25722 | Core | VAT rates can now be set on stores only. Turn on tax groups, leave the tenant VAT rates empty and set a default code. Stores with their own VAT rates use them, and all other sales use the market VAT rate. |
| Feature | #DEV-25706 | Product | The product page now shows the items of a property under the property, and the product search can filter on a property's key group. |
| Feature | #DEV-25676 | Tripletex Connector | Tripletex can now post to a separate company per market. Set the EmployeeToken on the Tripletex connector of the market, and orders, products and invoice payments for that market use that company. |
| Feature | #DEV-25658 | Orders | Inventory now supports priority stock: units a store should sell first, such as a return it took in for a product outside its assortment. Returns can mark these units automatically, allocation can be set up to prefer the store holding them, and they stay sellable for click and collect even outside the store's assortment. |
| Feature | #DEV-25653 | Order management | A new workflow step, Add properties to shipment, lets you put your own properties on a shipment when the workflow runs. Use {Now} as a value to record the time the step ran, for example when a shipment became ready for pickup. |
| Feature | #DEV-25650 | Front Systems Connector | Inventory transactions from the Front Systems inventory sync now show the scheduled task as the user and the new transaction type Integration, so stock updates from Front are easy to tell apart from sales and purchase orders. |
| Feature | #DEV-25637 | Core | Omnium can now issue a paid receipt for each delivered shipment, with the delivered items, the payments and the VAT per rate. Add the workflow step Create receipt for shipment after Capture, and your webshop can show the receipts to customers through the invoice API. |
| Feature | #DEV-22873 | Purchase orders | Adding boost property to reorder-suggestions. Can be used when performing more advanced analysis outside Omnium to amplify or reduce the generated reorder-suggestions in Omnium. |
| Feature | #DEV-22872 | Purchase orders | Adding support for automatic purchase order drafts based on reorder-suggestions. |

## Release 2026-37

Release date: Nov 3, 2026

### Main focus areas

This release expands reporting and analytics, improves product and promotion management, and introduces more flexible rental and inventory workflows. Configuration and administration become easier to navigate, while enhancements to APIs, integrations, invoicing, taxation and claims provide greater control over operational processes.

### Key changes and improvements

#### Configuration & Administration

*   The Configuration page now provides an overview of settings areas as searchable tiles, with Advanced settings reorganized into clearer groups such as Finance, Communication and Users & access.
*   The notification list now supports search, filters, sortable columns and shareable URLs that retain active filters. Creating notifications opens a dialog with available types grouped by category.
*   Ongoing connector settings are now organized into clearer groups.
*   Role deletion confirmations display the role name and clarify that linked groups in Entra ID or other identity providers remain in place.

#### Product Management & Assortments

*   Product settings can define which assortment codes indicate that a product is discontinued. The discontinued date is set to the code's validity start date unless one already exists.
*   Brand categories generated by the scheduled task can now be made visible through the Show brand categories setting. They remain hidden by default.
*   Product custom views can be restricted to specific markets and are available in quick edit and product creation for those markets.
*   The product image editor now supports drag-and-drop image ordering and a more compact layout.
*   Product lists on the purchase order Products tab can be sorted by name, number, price and inventory, using stock levels in the purchase order's store.

#### Promotions & Pricing

*   Product cards now show promotions in priority order, with priority 1 first, and display restrictions such as customer groups, loyalty membership, stores, order types and coupon codes.
*   Fixed-price campaigns no longer increase prices above the regular product price.
*   Administrators can process the price list queue immediately from Advanced settings without waiting for the background worker.

#### Inventory, Reservations & Purchasing

*   Rental units can remain reserved for a configurable period after return, allowing time for inspection and cleaning. Reserved units appear as booked and cannot be added to new rentals.
*   The Retry reserving order lines in open orders scheduled task now supports an `OrderTypes` property to restrict processing to selected order types.
*   A reservation bug has been fixed so fully reserved order lines retain their reservations when stock is insufficient for other open orders.

#### Rental & Project Management

*   The Rental tab on projects has a redesigned layout with a rental summary, product list and availability buttons. Rental products can be searched by name or SKU, and deletion requires confirmation.
*   Claim settings now support reason-code restrictions by project type, project-type eligibility for order types and purchase orders, and mandatory reason codes for product lines.
*   Additional claim controls can restrict cancellation and returns by order status, include product lines in project printouts, limit projects to the user's stores and warn when a product falls outside the supplier's assortment. These options are disabled until configured.
*   Dark mode now also covers the rental availability calendar and the customer Relations tab.

#### Order Management & Fulfillment

*   Online order delivery filters now include Partially cancelled and Partially delivered and partially cancelled.
*   Order and shipment status-change buttons now display the configured status colours, making the intended status clearer before applying a change.
*   The reserved-inventory update workflow no longer removes reservations from fully reserved order lines when other open orders exceed available stock.
*   A new `{LINEITEM_REMAINING_QUANTITY}` merge tag displays the quantity still to be delivered, calculated as ordered minus cancelled minus delivered.

#### Reporting & Analytics

*   The product report's SKU tab now displays paginated results sorted by selected sales figures, with a new Inventory column showing stock for each product.
*   The Order lines report can group completed order lines by weekday and hour. These groupings now follow the configured time zone rather than UTC.
*   Custom analytics order-line reports can include supplier SKUs and the most specific main product category. Historical data requires re-indexing before these fields are populated.

#### Finance, Tax & Invoicing

*   Stores can define their own VAT rates, overriding tenant-level rates with matching codes. Store-specific rates are used for orders, shipping and accounting.
*   Invoices now include the invoice number, bank account and due date based on the payment terms of the order or business customer.
*   Credit notes can use a separate number series. Invoice emails respect disabled notifications, and deleting a number option no longer deletes other number options.
*   POS Z-reports now book sales and returns to the correct sales account for each VAT rate within a product group, while keeping each group on a single report row.

#### APIs & Event Processing

*   Cart APIs now support `stopOnValidationError` when adding items or changing quantities. If validation fails, Omnium does not save the change and returns the validation errors in the same response.
*   Azure Service Bus event subscriptions can enable sessions, assigning a shared `SessionId` to events for the same order, cart or customer.

#### Shipping & Messaging Integrations

*   nShift Delivery (Unifaun) can use the order number as the sender reference on carrier labels through `UseOrderNumberAsSenderReference`.
*   Ongoing can notify Omnium through a webhook when an order reaches a configured status, locking the corresponding shipment against changes in Omnium.
*   Two-way SMS through LINK Mobility now supports subnumber ranges, allowing each order, return and case to receive its own number so customer replies reach the correct conversation.
*   Tripletex-invoiced orders now use the consistent `TripletexInvoiceId` external ID instead of the duplicate `TripleTex` ID. Use `TripletexOrderId`, which has the same value.

#### Markets, Customers & Communication

*   Phone number formats can be configured per market. Omnium adds the relevant country code to customer phone numbers received from orders in that market.

| Type | Issue No | Domain | Description |
| --- | --- | --- | --- |
| Feature | #DEV-25640 | Core | The notification list in Administration now has a search field, filters for channel, type, order status, order type, market and shipment option, and sortable columns. The active filters stay in the page address, so a filtered view can be bookmarked or shared. New notifications are created from a dialog that lists the available types by group. |
| Bugfix | #DEV-25639 | Tripletex Connector | Tripletex: Orders invoiced through Tripletex now get the external id TripletexInvoiceId, like other orders exported to Tripletex. These orders no longer get the extra external id TripleTex. Use TripletexOrderId, which has the same value. |
| Feature | #DEV-25636 | Product | You can now choose which assortment codes mean that a product is discontinued. When a product gets one of these codes, Omnium sets its discontinued date to the date the code is valid from, unless the product already has a discontinued date. |
| Feature | #DEV-25635 | Core | The Rental tab on projects has a new layout, with rental info and a summary side by side and the rental products in a list with an availability button for each product. When you add a rental product you can search by name or SKU, and Omnium asks you to confirm before it deletes one. Dark mode now also covers the rental availability calendar and the Relations tab on customers. |
| Feature | #DEV-25634 | Product | Rental units can now stay reserved for a set time after they are returned, for example for checking and cleaning. Set the time in minutes in Settings → Orders → Rental. While a unit is reserved, it shows as booked in the availability calendar and cannot be added to a new rental. |
| Feature | #DEV-25621 | Product | A new setting in Product settings, Show brand categories, lets you create the brand categories from the scheduled task as visible categories. By default, brand categories stay hidden. |
| Bugfix | #DEV-25609 | Core | POS Z-report: Sales and returns in a product group that has items at several VAT rates (for example toys at 25% and sweets at 15%) are now booked on the Sales account for each rate, instead of all on the account for the first rate. The printed report and the In-Store app still show each product group as one row. |
| Feature | #DEV-25608 | Core | The SKU tab in the product report now shows the products in pages, sorted by the sales figures you choose. A new Inventory column shows the stock of each product on the page. |
| Feature | #DEV-25607 | Core | In the Order lines report you can now group by Weekday (completed) and Hour (completed), to see when order lines were completed. Hour and weekday groupings now follow your time zone instead of UTC. |
| Feature | #DEV-25606 | Product | The Promotions panel on the product card now shows the priority of each promotion and lists the promotions by priority, with the highest priority (1) at the top. |
| Feature | #DEV-25605 | Core | Custom reports for analytics order lines can now show the supplier SKU and the most specific main category of each product. Order lines from before the update show the new values after they are re-indexed. |
| Feature | #DEV-25604 | Order management | The Delivery status filter in the online order list has two new options: Partially cancelled, and Partially delivered and partially cancelled. Use them to find orders where some of the ordered items were cancelled. |
| Feature | #DEV-25603 | Order management | The buttons that change the status of an order or a shipment now show the colour you have given the status in the order type settings. This makes it easier to see which status you are about to set, for example before you set an order to Ready for pickup. |
| Feature | #DEV-25602 | Core | The promotion panel on the product card now shows the limitations of each promotion, such as customer club members only, customer groups, stores, order types and coupon codes. This makes it easier to see who a promotion applies to. Promotions set up with market groups now show the correct status. |
| Feature | #DEV-25601 | Ongoing Connector | The Ongoing settings page is easier to use, with the settings in groups. |
| Feature | #DEV-25599 | Ongoing Connector | Omnium can now lock a shipment when the Ongoing order reaches a set status. Ongoing sends a webhook, and the shipment shows 'Locked by the warehouse' and cannot be changed in Omnium. |
| Feature | #DEV-25597 | Core | A campaign no longer gives the customer a higher price than the regular price. When a fixed-price campaign would cost more than the products at their regular price, Omnium does not apply it. |
| Feature | #DEV-25589 | Product | You can now sort the product list on the purchase order Products tab by clicking the Name, Number, Price and Inventory column headers. Sorting by inventory uses the stock in the purchase order's store, so it is easier to see which products to order. |
| Feature | #DEV-25574 | Order management | The scheduled task Retry reserving order lines in open orders has a new OrderTypes property. Enter a comma-separated list of order types, for example TheftGB,CompGB, to reserve order lines only for orders of those types. |
| Bugfix | #DEV-25573 | Order management | Update order line reserved inventory no longer removes the reservation from an order line that is already fully reserved when a warehouse has more open orders than stock. Orders reserved by the task Retry reserving order lines in open orders now stay reserved when their workflow runs. |
| Feature | #DEV-25567 | Product | In the product image editor you can now drag images into the order you want, and each image takes up less space, with smaller images and the image fields laid out in two columns. |
| Feature | #DEV-25555 | Cart | Integrations can add items to a cart or change line quantities through the API with stopOnValidationError. When a cart validator reports an error, such as too little stock, Omnium does not save the change and returns the validation errors. This removes the need for a separate validation call. |
| Feature | #DEV-25552 | Shipment | nShift Delivery (Unifaun) can now send the order number as the sender reference, so it shows on carrier labels such as DHL’s. To turn it on, add the property UseOrderNumberAsSenderReference = true to a shipment option or to the shipping provider. |
| Feature | #DEV-25541 | Core | Administrators can now process the price list queue right away from the Queue status tab in Advanced settings, without waiting for the background worker. Choose Process now in the queue's menu. The queue is processed in the background, and the count updates when you refresh the list. |
| Feature | #DEV-25534 | Core | When you delete a role, the confirmation now shows the name of the role. If the role is linked to a group in Entra ID or another provider, the confirmation also tells you that the group stays there. |
| Feature | #DEV-25520 | Product | Product custom views can now be limited to one or more markets. A view with markets only shows in quick edit and when you create a product in one of those markets. Views without markets work as before. |
| Feature | #DEV-25519 | Core | Claims get new settings: reason codes can be limited to the project type, order types and purchase orders can limit which project types a claim may use, and a project type can require a reason code on every product. The order status can now decide whether an order can be cancelled or returned, the project print can include the product lines, projects can be limited to the user's stores, and a claim warns when a product is outside the supplier's assortment. Everything is off until you turn it on in settings. |
| Feature | #DEV-25505 | Core | You can now set a phone number format per market in the market settings. Omnium adds the country code to the phone number on customers from orders in that market, for example +447710502350 for a UK number entered as 07710502350. |
| Feature | #DEV-25502 | Core | Stores can now have their own VAT rates. A store's rate replaces the tenant rate with the same code, so one market can serve several countries with different VAT schemes. Orders, shipping and accounting for the store use the store's rates. |
| Feature | #DEV-25495 | Core | The Configuration page now opens with an overview of all settings areas as tiles, next to the settings tree, and you can search for a settings page. The long Advanced list is replaced by clear groups such as Finance, Communication and Users & access. |
| Feature | #DEV-25484 | Core | Invoices created in Omnium now show the invoice number, the bank account and a due date from the payment terms of the order or business customer. You can set a separate number series for credit notes, and invoice emails respect disabled notifications. Deleting a number option no longer removes other number options. |
| Feature | #DEV-25468 | Core | Event subscriptions that use Azure Service Bus can now enable sessions. Omnium then sets a SessionId on each message, so all events about the same order, cart or customer share one session, for example order:110000104602. |
| Feature | #DEV-25258 | Link Mobility Connector | Two-way SMS with LINK Mobility now supports subnumber ranges. Each order, return and case gets its own number from the range, so a customer's reply lands in the right conversation even when several are open at once. Set the range with the new Last number in range field in the SMS client settings. |
| Feature | #DEV-25230 | Notification | New merge tag {LINEITEM\_REMAINING\_QUANTITY} shows the quantity still to be delivered per line (ordered minus canceled minus delivered) on order and purchase order templates, such as packing slips. |

## Release 2026-36

Release date: Oct 27, 2026

### Main focus areas

This release improves configuration usability, pricing and promotion flexibility, and inventory reservation management. It also expands API capabilities, strengthens integration support for Voyado and shipping providers, and adds better tools for case management, order tracking and inventory reconciliation.

### Key changes and improvements

#### Configuration & User Experience

*   Configuration pages are being reorganized into smaller, clearly labelled groups with descriptions and selection lists for predefined values.
*   Cart settings now have clearer sections and descriptions, with the option to name order lines after their variant grouped under Order lines.
*   Carts and orders now support a compact order-line view that displays one line per product. Omnium remembers the selected view in the browser.
*   Price labels are standardized across price lists, promotions and product prices. Discounted prices and cost fields now use consistent terminology, and full price list exports include store cost discount amounts and percentages.

#### Promotions & Pricing

*   Rule-based promotions are now available to all customers, allowing product eligibility to be defined through attribute rules.
*   Promotions can be restricted to products already discounted by other promotions with specified tags, enabling additional discounts on selected sale items.
*   Price list promotions now respect the price list's Allow promotions setting when determining whether they can be combined.
*   Voyado promotions can be delivered through webhooks, making contact-specific promotions available as personal coupons in Omnium within seconds.
*   The public API now preserves kit promotion rewards when integrations read and update carts or orders.

#### Inventory & Reservations

*   A new Reservation reconciliation report compares reserved inventory with order reservations and highlights delivered or cancelled orders that still hold reservations.
*   Order statuses can be configured not to reserve inventory when the ERP already handles reservations, preventing duplicate reservations during recalculation.
*   Inventory badges now indicate when reorder suggestions are disabled for a product, including cases where the setting applies only to specific variants or warehouses.

#### Order Management & Fulfillment

*   Order status badges can now use configurable colours across order lists, Click & Collect and order pages. The Picked up and paid status uses neutral grey to distinguish it from In progress.
*   Pick lists can be configured to exclude orders with a requested date by default when Orders to pick opens.
*   Order history and event logs now identify the API user and endpoint for requests submitted with `enqueue: true`, instead of displaying System.
*   A new order setting keeps virtual service lines together with their associated physical goods when shipments are split, including deliveries from Sitoo.

#### Allocation Rules

*   Allocation rule dropdown searches now match the displayed effect and attribute names.
*   Allocation rules can use Order subtotal as a condition.

#### API & Integrations

*   The accounting API now includes `debitInclVat` and `creditInclVat` on ledger lines, allowing accounting systems to import VAT-inclusive revenue amounts directly.
*   A new project API endpoint, `POST /api/Projects/{projectId}/ChangeProjectType`, changes a project's type or applies the latest updates to its existing type while preserving project progress.
*   The new `PATCH /api/Suppliers/PatchMany` endpoint updates only the supplier fields provided, without requiring the complete supplier object.
*   Public API date-time values now include a UTC designator (`Z`) in responses. Requests should use `Z` or an explicit UTC offset to ensure price validity periods start and end at the intended times.
*   Consignor (nShift Ship) shipments within Norway now include NVIT customs data for each group of goods, including customs code, description, quantity, weight and country of origin. The carrier account must be enabled for NVIT.

#### Customer Service

*   Case lists can now be filtered to show only cases without orders or without customers, making it easier to identify incomplete case records.

| Type | Issue No | Domain | Description |
| --- | --- | --- | --- |
| Feature | #DEV-25497 | Product | Price labels are now the same in price lists, promotions and product prices: the price after discount is always called Discounted price, and cost fields use Cost price, Discounted cost price and Discounted store cost price. The full price list export also includes the store cost discount amount and percent. |
| Feature | #DEV-25494 | Core | The settings pages under Configuration are being reorganised area by area. Related settings are grouped in smaller cards, every setting gets a clear label and a description of what it does, and fields with a fixed set of values are chosen from a list instead of typed. |
| Feature | #DEV-25493 | Cart | Carts and orders now have a compact view of the order lines. Use the switch in the table header on the Order details tab or the order page to show one line per product, and Omnium remembers your choice in the browser. |
| Feature | #DEV-25491 | Cart | The Cart settings page is now organised in groups, such as Creating carts, Market and store, and Limits, and every setting has a label and description that explain what it does. The option to name order lines after the variant is now available in the Order lines group. |
| Feature | #DEV-25488 | Voyado Connector | Voyado promotions can now be received through the webhook. Set Promotions to Webhook on the Voyado connector, and a promotion assigned to a contact in Voyado is available as a personal coupon in Omnium within seconds. |
| Feature | #DEV-25477 | Core | Ledger lines in the accounting API now include debitInclVat and creditInclVat. Revenue lines show the amount with VAT, so accounting systems that derive the VAT from the VAT code can import them directly. |
| Feature | #DEV-25475 | Core | You can now filter the case list to show only cases without orders or cases without customers. Use the new switches under 'Show only' in the case filters. |
| Feature | #DEV-25470 | Core | Rule-based promotions are now available to all customers. When you create a promotion, you can select the Rule-based promotion type and use attribute rules to choose the products it applies to. |
| Feature | #DEV-25469 | Inventory | A new Reservation reconciliation report under Reports > Inventory compares the reserved inventory with the reservations from orders. It highlights delivered or cancelled orders that still hold a reservation, so you can find and correct wrong reservations. |
| Feature | #DEV-25458 | Order management | You can now choose a color for each order status in the order type settings. The color shows on the status badges in the order lists, the Click & Collect view and the order page. 'Picked up and paid' now has a neutral grey color, so it is easy to tell apart from 'In progress'. |
| Feature | #DEV-25449 | Inventory | Order statuses have a new setting, "Order does not reserve inventory". Turn it on for statuses where your ERP has already reserved the items, so Omnium does not reserve the same items again. When Omnium recalculates reserved inventory, it leaves out orders in these statuses. |
| Feature | #DEV-25448 | Inventory | Inventory badges now show a small icon when reorder suggestions are switched off for a product in a warehouse. A dotted icon means suggestions are off for only some of the variants or warehouses behind the number. Hover the icon to see which ones. |
| Feature | #DEV-25443 | Order management | Discounts in the public API now include the kit promotion reward (promotionKitReward). A kit discount keeps its amount when an integration reads an order or cart and sends it back with POST, PUT or PATCH. |
| Feature | #DEV-25442 | Pick list | Pick lists: A new pick list setting turns on “Exclude orders with requested date” by default when Orders to pick opens |
| Feature | #DEV-25436 | Order management | Order version history and events now show the API user and the endpoint for requests sent with enqueue: true, instead of System. |
| Feature | #DEV-25434 | Consignor Connector | Consignor (nShift Ship) shipments within Norway now include NVIT customs data (Norwegian goods in transit). Omnium sends the customs code, description, quantity, weight and country of origin for each group of goods. The carrier account must be enabled for NVIT with the carrier. |
| Feature | #DEV-25431 | Core | Search in the allocation rule dropdowns now matches the names you see, for example effect and attribute names. Allocation rules can now use the order subtotal (Order subtotal) in conditions. |
| Feature | #DEV-25429 | Api | The public API has a new endpoint, POST api/Projects/{projectId}/ChangeProjectType, that changes the project type of a project. Call it without a project type to update a project with the latest changes to its project type, such as new workflow steps, while the progress of the project is kept. |
| Feature | #DEV-25405 | Api | The new PATCH /api/Suppliers/PatchMany endpoint updates only the supplier fields you send. You no longer need to send the whole supplier, as you do with PUT /api/Suppliers/UpdateMany. |
| Feature | #DEV-25299 | Promotions | Promotions can now be limited to products that an active promotion with given tags has already discounted (for example an extra 50 % off items already on sale) with the new "Only on lines already discounted by these promotions" switch under "Only combine with tags", and a price list promotion's "Can be combined" setting now follows its price list's "Allow promotions" setting. |
| Feature | #DEV-25158 | Sitoo Connector | A new order setting, 'Keep service lines with physical items', keeps isVirtual lines in the same shipment as the goods they belong to. When goods are split to their own shipment, for example to wait for a purchase order, these lines now follow them. The setting also applies to deliveries from Sitoo. |
| Bugfix | #DEV-24995 | Api | Public API: all date-time values are now returned with a UTC designator (Z), as required by RFC 3339. For example, 0001-01-01T00:00:00 is now returned as 0001-01-01T00:00:00Z. Send date-times with Z or an offset, such as 2026-10-01T00:00:00Z or 2026-10-01T00:00:00+02:00. A value sent without either is returned with Z. Price ValidFrom and ValidUntil are affected the most: send them with Z or an offset so the price starts and ends at the intended time. |

## Release 2026-35

Release date: Oct 20, 2026

### Main focus areas

This release focuses on improving order and inventory workflows, store opening hours and time zone handling, promotion lifecycle management, and customer service. It also expands API capabilities for returns, inventory transactions and attachments, while adding more flexible allocation rules, pricing controls, campaign analytics and access management.

### Key changes and improvements

#### Order Management & Fulfillment

*   The Try split unreserved order lines workflow step now supports `ForceAllocate` with a `WarehouseCode`, allowing a previously rejecting warehouse to allocate a line as a last-resort backorder.
*   A new Remove order lines to be purchased workflow step clears purchase flags when lines are shipped, picked up or cancelled, preventing outdated purchase suggestions.
*   The customer pickup deadline offset now also applies to Click & Collect deadlines configured in working days.
*   Returns created through the API can set `isDelivered: false` for paid but undelivered items. These units are registered as cancelled rather than returned, without updating inventory.
*   Order line editors in carts and orders now support entering a Discounted price directly, with the discount calculated automatically. Resetting a manual discount restores the original promotion when applicable.

#### Inventory & Stock Management

*   Inventory updates now support configurable reason codes alongside free-text reasons, both in the UI and through the new `UpdateManyWithReason` API endpoint.
*   Inventory transactions display reason codes and internal references, improving traceability.
*   The `IncreaseReservedInventory` and `DecreaseReservedInventory` endpoints accept an optional `Reason`; reservations created through these endpoints use the transaction type `API`.

#### Promotions, Campaigns & Pricing

*   Campaigns can now be exported and imported as JSON through the Administration import/export pages. Imports preserve the specified campaign status, including statuses that cannot be reached through normal workflow transitions.
*   Campaign pages now display gross profit and gross margin alongside revenue for users with cost-price access.
*   A scheduled task can emit events when price lists and promotions start or end, allowing storefronts and search engines to synchronize displayed prices.
*   A new scheduled task removes expired promotion IDs and campaign prices from products after promotions end.
*   Allocation rules can be filtered by status, stage, effects, order types and markets, with additional advanced filters. Rules that apply globally are included when filtering by a specific scope.

#### Stores, Opening Hours & Time Zones

*   Stores now support multiple opening periods per day, including lunch closures. Regular, special and global opening hours are supported, and Click & Collect deadlines, notifications and PinMeTo integration account for all periods.
*   Store-specific settings control how long before opening notifications can start and how long before closing they stop when adjusted for opening hours.
*   Time zones can be configured per store, market or market group, ensuring opening hours, notification schedules and pickup deadlines follow local time.
*   A new calendar view shows week numbers, store opening hours, the opening hours for a selected date and the number of open days until that date.

#### Customer Service & Notifications

*   Case lists now support configurable default filters, sorting and status colours, while retaining filters when returning from a case.
*   Keywords in incoming emails can set case priority.
*   Reply templates can be inserted directly into the editor, unsent notes are saved as drafts, and formatted replies can include links and personal email signatures.
*   Order confirmation emails can display expected delivery windows supplied through the API, formatted as localized date ranges.
*   Cart and order comments created through the public API can include file attachments, either through file links or uploads in the same request. Attachments are included in email notifications.
*   Conditional notification and PDF templates can use the new expected delivery window data through the `LINEITEM_EXPECTED_DELIVERY_DATE` template tag.

#### Access Control & Security

*   The Administrators role can now be linked to another role, granting administrator access to all users assigned to that role, including roles synchronized from Entra ID through SCIM.
*   User pages indicate when administrator access is inherited through a role.
*   Store API access rights for API users have been tightened to prevent access beyond their permissions.

#### Payments & Refunds

*   Dintero refunds can now specify which payout destination retains return charges, such as return shipping, when a refund is split across multiple destinations.

#### In-Store Experience

*   The customer Statistics tab in the In-Store app has been redesigned with clearer visualizations for coverage, order types, returns and cancellations.

| Type | Issue No | Domain | Description |
| --- | --- | --- | --- |
| Feature | #DEV-25404 | Core | You can now export and import campaigns on the JSON Export and JSON Import pages in Administration. An import keeps the campaign status as given, so you can correct a campaign that the status workflow cannot move. |
| Feature | #DEV-25380 | Notifcation | Order lines can now have an expected delivery window (a start and an end date, set through the API), which order confirmation emails and the {LINEITEM\_EXPECTED\_DELIVERY\_DATE} template tag show as a date range, such as "01.05.2026 - 04.05.2026", in the market's language. |
| Bugfix | #DEV-25376 | Api | Loose access rights for stores have been tightened for api-users. We have notified owners of api-users that called the store endpoints with insufficient rights. |
| Feature | #DEV-25370 | Core | The allocation rule list can now be filtered by status, stage, effects, order types and markets. More filters, such as customer types, sales stores, triggers, profiles, tags and validity period, are available under advanced filters. When you filter on a scope value, rules that apply everywhere are included, so the list shows every rule that can affect such an order. |
| Feature | #DEV-25366 | Core | The Statistics tab on the customer page in the In-Store app has a new look. Coverage, order types, and returns and cancellations now show as clear bars, and all key numbers fit on one screen. |
| Feature | #DEV-25365 | Order management | The customer pickup deadline offset on a store now also applies to the click and collect deadline when it is set in working days. |
| Feature | #DEV-25364 | Order management | When you create a return through the API, you can now set isDelivered to false for items that were paid for but not delivered. Omnium then registers the units as cancelled on the order instead of returned, and does not update the inventory. |
| Feature | #DEV-25355 | Core | Stores can now have more than one opening period per day, for example when they close for lunch. Use the + button to add a period to regular, special and global opening hours. Click & collect deadlines, notifications and the PinMeTo integration take all periods into account. |
| Feature | #DEV-25349 | Order management | The 'Try split unreserved order lines' workflow step has a new ForceAllocate option. When set together with a WarehouseCode, the step can allocate a line back to a warehouse that previously cancelled it, so that warehouse can backorder the product as a last resort. |
| Feature | #DEV-25348 | Core | Administrators can now link the Administrators role to a role, so everyone with that role gets administrator access. This works with roles synchronized from Entra ID through SCIM. The user page shows when a user gets Administrators through a role. |
| Feature | #DEV-25345 | Promotions | Omnium can now send an event when a price list or promotion starts or ends. Turn on the scheduled task 'Price list and promotion start/end events' and subscribe to the events, so storefronts and search engines always show the current price. |
| Feature | #DEV-25339 | Core | The campaign page now shows gross profit and gross margin alongside the revenue figures. The numbers are visible to users with access to cost prices. |
| Feature | #DEV-25319 | Inventory | Inventory transactions now show the internal reference below the transaction type, and the reason icon next to it. The IncreaseReservedInventory and DecreaseReservedInventory endpoints accept an optional Reason, which is shown on the transaction. Reservations from these endpoints now get the transaction type API. |
| Feature | #DEV-25312 | Prices | In both the cart and the order view, the order line editor now has a "Discounted price" field where you can type the price the customer should pay, and the discount is calculated for you. Setting a manual discount back to 0% or the full price now restores the line's original promotion if it had one. |
| Feature | #DEV-25310 | Payment integration | Dintero: You can now choose which payout destination keeps the return charges, such as return shipping, when a refund is split between several payout destinations. The other destinations then refund their full share. |
| Feature | #DEV-25309 | Core | A new scheduled task, RemoveExpiredPromotionDataFromProductsScheduledTask, removes ended promotions from products. It clears the promotion IDs and the expired campaign prices, so products no longer show a campaign tag after the promotion has ended. |
| Feature | #DEV-25281 | Core | Tap the clock in the top bar, or open Calendar from the menu, to see a calendar with week numbers and the store's opening hours. Select a date to see the opening hours that day and how many open days there are until then. |
| Feature | #DEV-25277 | Inventory | When you update inventory in the inventory matrix, you now choose a reason code from a dropdown, in addition to the reason text, and it shows in the transaction history. |
| Feature | #DEV-25276 | Purchase orders | New workflow step "Remove order lines to be purchased" unmarks order lines for purchasing. To be used when they are shipped, picked up or canceled, so they stop showing up as purchase order suggestions or as awaiting a purchase order. |
| Feature | #DEV-25245 | Inventory | Inventory updates can now carry a reason code: choose one in the inventory change bar, or send it to the new UpdateManyWithReason API endpoint. Each tenant can define its own codes, and the built-in "Other" is always available. |
| Feature | #DEV-25239 | Core | Cases work better as a support queue: you can set a default status filter, sort order and status colours for the case list, let keywords in incoming e-mails set the priority, and the list keeps your filters when you return from a case. Replies are easier to write: templates go in where you type, unsent notes are kept as drafts, and you can switch on formatted replies with links and a personal e-mail signature. |
| Feature | #DEV-24812 | Cart | Comments added to carts and orders through the public API can now carry attachments, either as links to files Omnium copies in or as files uploaded in the same request with the new AddCommentWithFiles endpoints, and the attachments are included in the email notification. |
| Feature | #DEV-24538 | Core | You can now set, per store, how long before opening notifications may be sent and how long before closing they stop. This applies to notifications set to 'Adjust for store opening hours'. For example, a store open 10:00-19:00 can send them from 09:45 to 18:30. |
| Feature | #DEV-23254 | Core | You can now set a time zone per store, market or market group under Formatting settings. Opening hours, notification send times and pickup deadlines then follow the local time of the store, for example for stores in Finland. |

## Release 2026-34

Release date: Oct 14, 2026 (postponed to Wednesday due to our Insights event)

### Main focus areas

This release focuses on improving the in-store experience, promotion management, fulfillment performance and control, and product pricing visibility. It also expands API and integration capabilities across Voyado, Adyen and Sitoo, while adding more flexible automation, reporting and template functionality.

### Key changes and improvements

#### In-Store & User Experience

*   The In-Store app receives a redesigned interface with updated fonts, colours, icons, home screen and improved dark mode.
*   A new store calendar provides week numbers and opening hours.
*   Local number formats are now used for prices, and keyboard shortcuts are available for the till.

#### Promotions & Campaigns

*   Campaign product filters now show SKU or product ID, with a dedicated tab for reviewing and managing the products included in a filter.
*   Multiple promotions can now be updated in bulk, including dates, prices, tags, campaigns and promotion periods.
*   Bulk promotion operations run in the background and report which promotions could not be changed and why.
*   A new Rule-based promotion type can select products using product fields, properties, categories, price lists and stock, with configurable AND/OR rule groups.
*   Rule-based promotion discounts can be calculated against selected base price lists and configured through either a form or JSON.
*   Variant tags are now visible in the expanded product view.

#### Orders, Deliveries & Fulfillment

*   Creating deliveries from large purchase orders is significantly faster. ATP recalculation and expected delivery dates can optionally run in the background.
*   Shipments included in pick lists can be locked to prevent changes such as cancellation, product replacement, splitting, warehouse changes or moving order lines.
*   The order list can now be filtered by product variety, including SKUs, packages, bundles and kits.
*   A new workflow step can set an order-line property based on stock availability in selected warehouses.
*   Service lines can optionally remain with their related physical items when shipments are split, including Sitoo deliveries.
*   Click & Collect pick lists can now use custom print templates.
*   GUI extensions can be added to return orders from the return page and return list.

#### Inventory & OmniStock

*   OmniStock store rules can now include or exclude products based on assortment codes.
*   Only currently valid assortment codes are considered, with variant-level codes taking precedence over product-level codes.
*   Stock-based workflow automation can now identify which warehouse should fulfil an order line by setting a configurable property.

#### Product Pricing

*   A new Price history tab shows historical, current and planned sales, cost and variant prices in both chart and table form.
*   Price history is restricted to users with access to cost prices.
*   The price before discount is now displayed directly above the discounted price in price history.

#### API & Integrations

*   The Promotions API now returns `rewardType` as the documented string values `Percentage`, `Amount` or `FixedPrice` instead of numeric values.
*   Public API date-time values now consistently include the UTC `Z` designator according to RFC 3339.
*   Adyen split payments can use separate balance accounts per market.
*   Voyado webhooks now support encrypted payloads and signature verification using the configured signing secret.
*   Voyado webhook integrations now use the single `api/VoyadoWebhook` endpoint with all required events selected; the previous per-event URLs are removed.

#### Reporting & Templates

*   The Payment report can now be filtered by shipping method, and the Excel export includes the shipping method.
*   Notification and PDF templates support conditional blocks based on specific property values.
*   Boolean conditional blocks are now hidden when the property is explicitly `false`.

#### Product & Order Configuration

*   Order lists can be filtered by product variety across SKUs, packages, bundles and kits.
*   Product and variant properties can be used as inputs for rule-based promotion selection.
*   GUI extensions can be integrated into return order workflows.

| Type | Issue No | Domain | Description |
| --- | --- | --- | --- |
| Feature | #DEV-25284 | Core | The In-Store app has a new design with new fonts, colours and icons, a refreshed home screen and improved dark mode. The app also adds a store calendar with week numbers and opening hours, prices in the local number format, and keyboard shortcuts for the till. |
| Feature | #DEV-25274 | Promotions | Campaign product filters show each product's SKU or product ID. A new "Produkter i filter" tab in the product dialog lists the selected products with image, price and stock, and each one can be removed on its own or all at once. Long product lists show the first 10, with a toggle to show all. |
| Feature | #DEV-25256 | Core | Creating a delivery from a purchase order with many lines is now much faster. A new setting, "Recalculate ATP in the background when creating deliveries", lets the delivery return at once while ATP and expected delivery dates update a few seconds later. |
| Feature | #DEV-25255 | Returns | GUI extensions can now be added to return orders: in the context menu and information panel on the return page, below the return details, and in the context menu on the return list. |
| Feature | #DEV-25237 | Order management | You can now filter the order list by product variety (SKUs, packages, bundles or kits); kit lines on existing orders are only found after those orders are re-enriched. |
| Feature | #DEV-25233 | Pick list | When "Lock shipments that are part of a pick list" is turned on, a shipment on a pick list can no longer be changed in the order view. Cancelling, replacing or adding products, splitting, moving order lines and changing warehouse are blocked, and locked shipments are shown greyed out with a message to remove the shipment from the pick list first. |
| Feature | #DEV-25229 | Payment integration | Adyen split payments can now use a separate balance account for each market |
| Bugfix | #DEV-25222 | Api | The Promotions API now returns rewardType in promotionKitReward and promotionKitBundles as a string (Percentage, Amount or FixedPrice), as the API documentation describes. Integrations that read the value as a number must update. |
| Feature | #DEV-25162 | Voyado Connector | Voyado webhooks with encrypted payloads are now supported. Enter the encryption key from Voyado under Connection in the connector settings. |
| Feature | #DEV-25158 | Sitoo Connector | A new order setting, 'Keep service lines with physical items', keeps isVirtual lines in the same shipment as the goods they belong to. When goods are split to their own shipment, for example to wait for a purchase order, these lines now follow them. The setting also applies to deliveries from Sitoo. |
| Feature | #DEV-25146 | Notifcation | Conditional blocks in notification and PDF templates can now check for specific values |
| Feature | #DEV-25129 | ClickAndCollect | Adds possibility to customize Click and Collect Pick List printout with custom template |
| Feature | #DEV-25115 | Inventory | A new workflow step can set a property on order lines based on the stock in chosen warehouses, for example to tell the ERP which warehouse sends the line. |
| Feature | #DEV-25094 | Inventory | OmniStock rules on a store can now include or exclude products by assortment code, for example to count a drop-ship warehouse's stock online only for products with a given code. Only currently valid assortment codes are used, and a variant with its own codes is judged on those instead of the product's. |
| Feature | #DEV-25091 | Voyado Connector | Voyado webhooks are now verified with the signing secret from the Voyado endpoint. Enter the secret under Connection in the Voyado connector settings. The old per-event webhook URLs are removed; use the single endpoint api/VoyadoWebhook with all events selected. |
| Feature | #DEV-25076 | Core | The Payment report can now be filtered by shipping method, and the Excel export includes a new Shipping method column, so you can see which delivery method each payment's order used. |
| Feature | #DEV-25075 | Product | The product page has a new Price history tab after the Cost price tab. It shows the sales, cost and planned prices for the product or the selected variant as a chart and a table, and only users with access to cost prices can see it. In the price history table, the price before a discount now shows above the discounted price. |
| Feature | #DEV-25074 | Core | The new promotion type Rule-based promotion selects its products by rules on product fields, custom and variant properties, categories, price lists and stock, combined in AND/OR groups. The discount can be calculated from chosen base price lists, and the rules can be edited in a form or as JSON. |
| Feature | #DEV-25071 | Promotions | You can now change many promotions at once from the selected promotions dialog: set or move their dates, update their prices, change their tags or campaign, create a purchase order, copy them to a new period or delete them. The changes run in the background, and the dialog shows which promotions were left unchanged and why. |
| Bugfix | #DEV-24995 | Api | Public API: all date-time values now include a UTC designator (Z) as required by RFC 3339, so unset or offset-less dates such as 0001-01-01T00:00:00 are returned as 0001-01-01T00:00:00Z. |
| Feature | #DEV-24398 | Products | Shows variant tags in product expanded view. |
| Feature | #DEV-24296 | Notification | Conditional blocks in templates ({#IF:Property}...{/#IF:Property}) are now hidden when the property is a yes/no value set to false, so sections tied to a flag only show when the flag is on. |

## Release 2026-33

Release date: Oct 6, 2026

### Main focus areas

This release focuses on promotion management and reporting, pricing and product search capabilities, inventory accuracy, accounting exports, and expanded Voyado integration options. It also introduces more flexible allocation rules, market-scoped administration and customer validation, and updates to payment and shipping integrations.

### Key changes and improvements

#### Promotions & Campaigns

*   Multiple promotions can now be selected in the promotion list, individually or by selecting an entire page.
*   Products from all selected promotions can be exported together using the built-in export or a custom promotion product report.
*   Promotion product reports can include promotion price, original price, discount amount and percentage, and margin for each product and variant.
*   The promotion product export now includes EAN values for products and variants.
*   Read-only users can be restricted to a configurable number of months of campaign and promotion history, while editors and administrators retain full visibility.

#### Price Lists & Pricing

*   API updates to price-list base prices can optionally propagate sales price, cost price and store cost price to other current and future price lists using the same currency.
*   Existing discounted prices are preserved while their discount amount and percentage are recalculated against the new base price.
*   Price-list items without discounts follow the new base price, while discounts are removed when the new base price reaches or falls below the discounted price.
*   Promotion-managed price lists can now use Calculate for bulk price and discount adjustments.
*   The Standard cost view no longer displays standard cost values converted to the selling currency.

#### Inventory & Fulfillment

*   The Locations column on the product Inventory tab now appears immediately after Available, making warehouse quantities visible without horizontal scrolling.
*   Cancelled order lines now release their inventory reservation when an order reaches Picked or Ready for pickup, keeping available stock accurate immediately.
*   Allocation rules can now use Order total and Currency to route orders based on their value.

#### Product Management

*   Search groups can be created from saved product searches and SKU lists with configurable include and exclude rules.
*   Search groups can be used as dynamic product categories or queried through the public API.

#### Accounting & Reporting

*   The accounting postings page now supports exports containing all ledger lines in a single file.
*   A separate export provides totals per account per day.
*   Both exports support Excel and CSV and follow the filters applied on the accounting postings page.
*   The per-day CSV export now also respects Status and Order type filters.
*   Web fulfillment dialogs now use the dates from the current search.

#### Voyado Integration

*   Voyado receipt exports can skip orders without delivered order lines instead of failing on empty receipts.
*   Voyado webhooks can now use a single endpoint for all selected events; existing per-event URLs remain supported until the next release.
*   Voyado connector settings are now organized into General, Connection, Customers, Loyalty, and Orders & Products tabs.
*   The Voyado product feed can optionally export parent products as separate articles for variant groups.
*   Parent-product export can be enabled when stores also sell the main product.

#### Configuration & Administration

*   API imports can now be restricted to a single market, limiting copied products, inventory, stores and orders to that market.
*   Customer email and phone uniqueness checks can be scoped to individual markets or market groups, allowing the same contact information once per market.

#### Payments

*   Klarna Checkout has been renamed to Kustom Checkout throughout Omnium.
*   Existing configurations and credentials continue to work, while the Base URL can now point API traffic to Kustom's new endpoints.

| Type | Issue No | Domain | Description |
| --- | --- | --- | --- |
| Feature | #DEV-25069 | Voyado Connector | The Voyado receipt export can now skip orders where no order line is delivered, instead of failing on an empty receipt. Enable SkipReceiptsWithoutDeliveredLines on the export step in the workflow. Receipts where every line is excluded by configuration are always skipped. |
| Feature | #DEV-25062 | Promotions | You can now export the products of all selected promotions at once. Open the selected promotions from the top bar and choose Export to run the built-in product export or any custom promotion product report. |
| Feature | #DEV-25060 | Promotions | Custom reports for promotion products can now include the promotion price, the original price, the discount (amount and percent) and the margin for each product and variant, the same figures as the built-in export on the promotion. These columns are listed first when you add properties to the report. The built-in export is renamed from "Export products (Excel)" to "Export products". |
| Feature | #DEV-25058 | Promotions | You can now select several promotions in the promotion list, one at a time or a whole page at once. The top bar shows how many promotions you have selected, and a click opens a list of them. |
| Feature | #DEV-25056 | Core | The accounting postings page has two new exports: all ledger lines in one file, and totals per account per day. Both can be exported to Excel or CSV and follow the filters on the page. The per-day CSV export now also follows the Status and Order type filters, and the web fulfillment dialogs take their dates from the search. |
| Feature | #DEV-25055 | Inventory | On the product's Inventory tab, the Locations column now comes right after Available, so you can see the quantity per location without scrolling sideways. Min, Max, Reorder, On order, Batches and Value follow after it. |
| Feature | #DEV-25054 | Price list | When price list items are updated through the API, the new base prices (sales price, cost price and store cost price) can now also be applied to the same products in all other current and future price lists in the same currency, such as campaign price lists. The discounted prices stay the same, and the discount amount and percentage are recalculated against the new base price. Items without a discount follow the new base price, and a discount is removed if the new base price is at or below the discounted price. |
| Feature | #DEV-25052 | Product | You can now use Calculate on price lists that are managed by a promotion, for example to adjust cost prices or set discounts for all items at once. The Standard cost tab in the price list item dialog is also simpler: it no longer shows the standard cost values converted to the selling currency. |
| Feature | #DEV-25041 | Core | The Export products (Excel) report on a promotion now includes the EAN of each product and variant. |
| Feature | #DEV-25035 | Configuration | The API import under Administration → Import can now be limited to one market, so only products, inventory, stores and orders from that market are copied from the source tenant. |
| Feature | #DEV-25030 | Core | Tenants can now limit how far back and forward users with read-only access can see campaigns and promotions. Set the number of months in Promotion management settings - anyone who can edit campaigns, and administrators, still see everything. |
| Feature | #DEV-25027 | Voyado Connector | Voyado webhooks can now be set up with a single endpoint in Voyado Engage. Select all events on one endpoint instead of creating one endpoint per event. The old per-event URLs keep working until the next release. |
| Feature | #DEV-25012 | Voyado Connector | The Voyado connector settings are now grouped into tabs: General, Connection, Customers, Loyalty, and Orders & Products. |
| Feature | #DEV-25011 | Customer | Unique email and phone number checks for customers can now be limited to each market or market group, so the same email or phone number can exist once per market |
| Bugfix | #DEV-25010 | Inventory | ReduceInventoryAndReservedInventory workflow step: Cancelled order lines now release their inventory reservation when the order is set to picked or ready for pickup, so the available stock is correct straight away. |
| Feature | #DEV-24990 | Product | You can now create search groups: named product sets built from saved product searches and pasted SKU lists, with include and exclude rules. Use a search group as a dynamic product category or query it through the public API. |
| Feature | #DEV-24984 | Core | Allocation rules can now branch on what an order is worth. Two new attributes — Order total and Currency — let you write rules such as 'orders below 200 SEK ship from the central warehouse' straight from the rule builder. |
| Feature | #DEV-24830 | Payment integration | Klarna Checkout is now Kustom Checkout. The payment provider has been renamed throughout Omnium following Klarna's rebrand of the product, and API traffic can be pointed at the new kustom.co endpoints from the Base URL setting. Existing configurations and credentials continue to work unchanged. |
| Feature | #DEV-24481 | Voyado Connector | The Voyado Engage product feed can now include the parent product of a variant group as its own article. Enable 'Export parent products' on the Voyado connector when stores also sell the main product. |

## Release 2026-32

Release date: Sep 29, 2026

### Main focus areas

This release focuses on purchase-order and pricing workflows, expanded event subscription APIs, improved inventory management, and stronger cart and order controls. It also adds support for container deposits, improves promotion and price-list management, and strengthens integration, payment and tenant configuration capabilities.

### Key changes and improvements

#### Purchase Orders & Pricing

*   Purchase order requested delivery dates are now automatically derived from connected promotions whenever the order is saved without a delivery date, including promotions added after creation.
*   Purchase order barcode scanning now supports EAN-8, EAN-13, UPC-A and GTIN-14, matching barcode fields only.
*   Price lists can now bulk-update cost prices, store cost prices and sales prices.
*   A new Set discounts function can apply discounts across all three price types, either to the entire list or only filtered items.
*   Price list items can be updated through the API without unintentionally creating or preserving outdated discounts.
*   Cost discounts can be set as percentages or cleared by sending `0`.

#### Promotions

*   Multi-buy promotion products now show the actual expected unit price after applying the reward, such as the effective price in a 3-for-2 promotion.
*   Promotion product lists can be exported to Excel using predefined or custom report columns.
*   Multi-buy and Mix&Match promotions now support configured rounding policies.
*   Promotion cost-price and store-cost-price dates are presented in clearly separated sections to reduce configuration errors.

#### Inventory

*   The product Inventory tab and Warehouse dialog now provide a unified grid across warehouses and variants.
*   The grid can switch between stock, available quantity, min/max levels, reorder values, deliveries, batches, value and locations.
*   Stock, thresholds and shelf locations can be edited directly and saved together with a single reason.
*   Inventory summaries now follow the selected stores and markets.

#### Cart & Order Management

*   A new cart setting, Max number of items, limits the total quantity in a cart while excluding bundle and package component lines.
*   Shipping costs are retained when shipments are cancelled and can be moved to an eligible remaining shipment so they remain part of the order total and can be captured with delivered goods.
*   Shipping-cost transfers respect configured market shipping prices to prevent, for example, a free pickup method from inheriting a home-delivery charge.
*   Payment custom properties can now be used in notification and receipt templates.
*   Container deposits (pant) are supported through dedicated deposit articles, with deposit lines automatically following product quantities through carts, orders and returns.

#### Events, Webhooks & API

*   Event subscriptions can exclude events based on their origin, such as a scheduled task or specific API path.
*   Event subscriptions can now be created and managed through the public API, including webhooks and queue subscriptions.
*   A test endpoint is available to verify an event subscription destination after creation.
*   The Promotions API now supports filtering by up to 250 promotion IDs in a single request, alongside existing filters.

#### Integrations

*   Sitoo queue receivers can be paused from Administration > Advanced settings > Queue status.
*   Messages remain queued while the receiver is paused and are processed when it is resumed, allowing integrations to be configured before incoming messages are handled.
*   Comment emails now reliably support CC and BCC recipients, which are also shown on sent comments.

#### Product Alerts & Product Management

*   Product alerts now record the originating store and channel.
*   Store and channel can be searched and used as filters in the product alert list.
*   The referring store can be used as a merge field in alert notification templates.

#### Tenant Configuration

*   Tenant settings can once again be saved reliably without false concurrent-edit conflicts.
*   Newly added markets, order types, payment types, shipping providers and connectors are persisted before their editors open.
*   Validation warnings are separated from blocking errors so the actual save failure is easier to identify.

#### Register & Device Configuration

*   Rental and Project tiles can now be placed inside folders on the register home screen.
*   Both tiles can be added through the device layout editor and share a configurable colour.

| Type | Issue No | Domain | Description |
| --- | --- | --- | --- |
| Feature | #DEV-24960 | Core | The requested delivery date on a purchase order is now filled in automatically from its connected promotions whenever the order is saved without one. Previously this only happened when the purchase order was created from a promotion — now it also applies when you add a promotion from the metadata dialog. |
| Feature | #DEV-24947 | Sitoo Connector | You can now pause a queue receiver for your tenant under Administration > Advanced settings > Queue status. Messages stay in the queue while the receiver is paused, and the worker processes them when you resume it. Use this when an integration must be configured before Omnium processes incoming messages. |
| Feature | #DEV-24930 | Cart | A new cart setting, Max number of items, limits the total quantity in a cart. Set it under Configuration → Settings → Cart. Component lines of a bundle or package are not counted. |
| Feature | #DEV-24912 | Core | Event subscriptions can now exclude events by origin. Add one or more origins, such as a scheduled task name or an API path like 'POST /api/orders', and events coming from those sources will no longer trigger the subscription. |
| Feature | #DEV-24911 | Api | The Promotions API search endpoints now accept a promotionIds filter, so you can fetch a known set of promotions in a single call instead of requesting each promotion by id. It combines with the existing filters and takes up to 250 ids per request. |
| Feature | #DEV-24898 | Order management | The cost price dates on a promotion now sit in two labelled sections, Cost price and Store cost price, each with its own divider. The fields also have more space between them, so it is easier to see which date you are editing. |
| Feature | #DEV-24872 | Product | Barcode scanning when adding products to purchase orders and orders now supports 8, 12 and 14 digit codes (EAN-8, UPC-A, GTIN-14) in addition to EAN-13. The scan matches on barcode fields only, so a numeric product id can no longer be picked up by mistake. |
| Feature | #DEV-24855 | Core | The Rental and Project tiles can now be placed inside folders on the register home screen, and can be added from the device layout editor in Omnium. The two tiles share one colour, which you can set from either of them. |
| Feature | #DEV-24852 | Api | Event subscriptions can now be created and managed through the public API. Webhooks and queue subscriptions can be set up from a deploy pipeline or script instead of the admin interface, and a test endpoint lets you verify the destination right after creating one. |
| Bugfix | #DEV-24834 | Product | Price list items can now be updated through the API without touching their discounts — changing only a cost, store cost or sales price no longer creates a discount that holds the old price. Cost discounts can also be set as a percentage, and cleared by sending 0. |
| Bugfix | #DEV-24823 | Shipment | Shipping cost is no longer lost when the shipment carrying it is cancelled. When every line on a shipment is cancelled, for example after a failed reallocation, its shipping cost now moves to a remaining shipment, so it stays in the order total and is captured together with the delivered goods. Shipments that are already shipped are preferred last, so a pending capture picks the cost up. The moved amount is capped at the market's configured price for the receiving shipment's shipping method, so a free store pickup does not take over a home-delivery fee; this cap only applies when the configured prices match what the customer paid, and provider-priced or unconfigured methods keep the original amount. Orders where every shipment is cancelled still charge no shipping. Existing orders affected by this will show the shipping cost as capturable the next time they are recalculated. |
| Feature | #DEV-24820 | Core | Custom properties on a payment can now be used in notification and receipt templates. Add the property key under Advanced in the template designer, and pick the variant under "From the payment" to show a value from the order's payment — for example your own name for a payment method. |
| Feature | #DEV-24819 | Order management | Promotions with a multi-buy reward now show the expected price on the Products tab - for a "3 for 2" offer you see the price per item the customer ends up paying. The product list can also be exported to Excel, either with a ready-made set of columns or through a custom report where you pick the columns yourself. |
| Feature | #DEV-24805 | Product | Price lists can now have their cost prices and store cost prices changed in bulk, not just the selling price. A new Set discounts tab sets discounts for all three price types across the whole list — or only the items you have filtered — and recalculates the discounted prices for you. |
| Feature | #DEV-24798 | Notifcation | Fixed CC and BCC on comment emails, which could silently fail to send, and they are now shown on the sent comment. |
| Feature | #DEV-24739 | Product | Product alerts now record which store and which channel a customer signed up through. Both are searchable and available as filters in the product alert list, and the referring store can be used as a merge field in the alert notification template. |
| Feature | #DEV-24436 | Inventory | The product page's Inventory tab and the Warehouse dialog now show one grid of all warehouses and variants, with a switch between stock, available, min/max, reorder, deliveries, batches, value and locations. Stock, thresholds and shelf locations can be edited directly in the grid and saved together with one reason, and the summary follows the selected stores and markets. |
| Feature | #DEV-24428 | Product | Omnium now supports container deposits (pant). Give a product a deposit type and a separate deposit line is added automatically in carts and orders, follows the product's quantity and is refunded with it on returns. Deposit amounts and VAT come from your deposit articles, so rate changes are ordinary price changes. |
| Bugfix | #DEV-24172 | Core | Tenant settings can be saved reliably again: saving a single setting no longer reports a false "modified by another user" conflict, newly added markets, order types, payment types, shipping providers and connectors are saved before their editor opens instead of prompting you to discard them, and validation warnings are shown separately so the error that actually blocked a save is visible. |
| Feature | #DEV-22389 | Promotions | Multi-buy and Mix&Match promotions now support rounding policies, so nice-price rules apply to multibuy rewards the same way they already do for category, brand and kit promotions. |

## Release 2026-31

Release date: Sep 22, 2026

### Main focus areas

This release focuses on faster campaign and purchase-order workflows, improved inventory and fulfillment control, stronger product and API capabilities, and expanded administration and security tooling. It also introduces tighter integration between promotions, purchase orders and pricing, alongside improvements to Click & Collect, projects, payments and customer service.

### Key changes and improvements

#### Campaigns & Promotions

*   Campaign pages are substantially faster and remain responsive as the number of promotions and filter scope increase.
*   The non-functional Revenue by Hour and Revenue by Weekday charts have been removed.
*   The promotion list now defaults to an Active and upcoming view, with configurable date filtering and hidden tags.
*   Purchase orders can be created directly from promotions or campaigns, with relevant promotions and products preselected.
*   Requested delivery dates for promotion-related purchase orders are derived automatically from promotion cost-price or start dates.

#### Purchase Orders & Pricing

*   New purchase orders prefill the supplier and warehouse based on configured defaults and the user's store access.
*   Product price history is available directly from purchase orders, including historical and future sales and cost prices.
*   Price history can include customer club, customer group, customer-specific and store prices, with a freely selectable period.
*   Purchase orders can be linked to the promotions they are intended to support.

#### Order Management & Fulfillment

*   The Update order line reserved inventory workflow step now supports ForceReserve, allowing all shipment lines to be reserved regardless of inventory availability.
*   Combined with a warehouse filter, ForceReserve allows a central warehouse to receive lines that no store can fulfill without automatic cancellation.
*   Expired Click & Collect cancellation tasks now ignore orders older than a configurable age, preventing large historical backlogs from being cancelled unexpectedly.
*   Expired Click & Collect statuses can be configured independently for store pick, customer pickup and transit limits.
*   Payment filtering now distinguishes Reserved, not captured from Captured payments, with multiple payment statuses supported in a single search.
*   Gift receipts now include a scannable barcode containing the order number.
*   Split shipments can optionally collect goods from the original warehouses while moving stock and reservations to the sending warehouse.

#### Projects & In-Store

*   The in-store app can view customer projects, open project carts and orders, create projects, and start project-linked carts directly from the register.
*   A new Project tile shows the linked project's number, type and current workflow step and allows the project relationship to be changed or removed.
*   Changes to the customer on a project-linked cart require confirmation because the project follows the customer.
*   Rental and Project tiles now share the same colour.
*   Rental project types can no longer be created manually; rental projects are created from orders.

#### Inventory

*   Product locations can automatically synchronize with the SKU's default warehouse location.
*   An administration backfill is available to populate existing product locations.
*   Warehouse stock editing now provides quantity controls and immediate change feedback.
*   Negative available stock and overallocation warnings are shown directly on the affected quantity values.

#### Product Management

*   Products can now be linked to multiple suppliers, with separate supplier SKU, colour and packaging quantity information.
*   The Product Query API can require products to explicitly have one of the requested markets using `isMarketRequired`.
*   Product assets support the `ExternalCertification` type for externally hosted certification and labelling marks.
*   External certification images remain linked to the source instead of being copied, allowing them to stay current and be reused across products.
*   Product URLs can include the product language through the `{productLanguage}` template variable.

#### API & Integrations

*   OmniStock rules are now available through the public `OmniumStore` API, including excluded brands, seasons, promotions and products, category inclusion/exclusion and profitability thresholds.
*   Business customer asset APIs now support name, description, purpose and alt text metadata.
*   Attachments uploaded through the customer Attachments tab receive an asset ID and can subsequently be updated or deleted through the API.
*   Nets Easy webhook secrets can be configured per payment type, with multiple secrets supported to allow seamless secret rotation.

#### Customer Service

*   Cases can automatically transition to a configured status when an agent sends the first customer-facing reply.
*   Internal notes do not trigger the status transition, and manually assigned statuses are preserved.
*   B2C and B2B customer lists now support filtering by errors.
*   The To be purchased badge on order lines is now clickable and opens the Orders to purchase overview filtered to the relevant product.

#### Administration & Security

*   A new Security administration page provides a centralized overview of full-access users, inactive accounts, open invitations, API users, webhooks, audit history and unresolved errors.
*   Security findings link directly to the relevant administration page for remediation.
*   Accounting postings can now be deleted by users with Administer access to the accounting report.
*   The accounting deletion dialog shows the exact date range and store IDs searched.
*   Store-market selections are automatically checked when inviting users and cleared when no selected store covers the market.
*   Administrators can self-service SSO configuration in test environments.

#### Localization

*   Omnium UI text is now fully translated in Danish, German, Spanish, Finnish, French, Norwegian, Dutch, Polish and Swedish.
*   Recently introduced screens, including promotion approval, access control, price-list copying and Sitoo-related product mapping, no longer fall back to English.

| Type | Issue No | Domain | Description |
| --- | --- | --- | --- |
| Feature | #DEV-24784 | Core | Campaign pages now load substantially faster and stay fast as campaigns grow — the detail page and the Performance overview and Charts tabs no longer slow down as you add promotions or widen the filter. The 'Revenue by Hour' and 'Revenue by Weekday' charts have been removed from the campaign page, as they never displayed data. |
| Feature | #DEV-24777 | Core | Purchase orders can now be linked to the promotions they are bought for. You can create a purchase order directly from a promotion or a campaign, with the promotions prefilled, and the products tab is filtered to those promotions so you only see what the campaign covers. The requested delivery date is set automatically from the promotion's cost price or start dates. |
| Feature | #DEV-24774 | Core | The promotion list now opens in a new 'Active and upcoming' view showing running and planned promotions. The Valid from filter is pre-filled so long-running always-on promotions stay out of the way until you change or clear the date, and tags can be configured to hide promotions from this view by default. The default view, number of days and hidden tags are set under Promotion management settings. |
| Feature | #DEV-24773 | Core | Purchase orders are quicker to create: the new purchase order dialog now pre-fills the supplier and the warehouse. Set a default supplier under Purchase order settings, and the warehouse is taken from your selected store - or your only store if you have access to just one. |
| Feature | #DEV-24751 | Product | The product Query API can now exclude products that have no market set. Pass isMarketRequired: true next to marketIds to get only the products that explicitly list one of the requested markets. |
| Feature | #DEV-24748 | Product | Purchase orders now offer a price history for each product: click the chart icon next to the price to see how the sales price and cost price have developed and will develop, including prices planned in price lists that are not yet activated. Customer club, customer group, customer specific and store prices can be switched on, and the period can be changed freely. |
| Feature | #DEV-24737 | Order management | Arbeidsflytsteget 'Update order line reserved inventory' har fått en ny innstilling, ForceReserve, som reserverer alle ordrelinjer på forsendelsen uavhengig av lagerbeholdning. Kombinert med varehusfilter kan et hovedlager dermed alltid ta imot linjer ingen butikk kan levere, uten at de kanselleres automatisk. |
| Feature | #DEV-24731 | Core | The in-store app now shows a customer's projects, lets you open a project's carts and orders, start a new cart for a project, and create new projects directly from the register. A new Project tile on the register links the active cart to a project: pick an existing project or create one for the cart's customer, see the project's number, type and current step on the tile, open it in a panel over the sale, and change or remove the link. Removing or changing the customer on a linked cart asks for confirmation, since the project follows the customer. Rental and Project tiles share one colour. Rental project types can no longer be created by hand in the web or the app; rental projects come from orders. |
| Feature | #DEV-24730 | Inventory | Product location can now follow the default warehouse location automatically. Turn on 'Sync default location to product' under Inventory management, and whenever a SKU's default location changes in the warehouse, the location on the product is updated to match. Existing data can be filled in with an admin backfill. |
| Feature | #DEV-24721 | Access rights | When inviting users, the markets a selected store belongs to are now ticked automatically, and cleared again when no selected store covers them. |
| Feature | #DEV-24711 | Inventory | The warehouse stock dialog now has up/down arrows in each quantity field for quick adjustments and shows your change next to the field. Warnings for negative available stock and overallocation are shown directly on the value instead of as separate text. |
| Feature | #DEV-24704 | Order management | The task that cancels expired Click & Collect orders now ignores orders older than 90 days, so setting the deadlines for the first time no longer cancels a long backlog in one run. The age is configurable under Click and Collect settings. |
| Feature | #DEV-24702 | Product | Product assets can now use the type ExternalCertification for certification and labelling marks hosted outside Omnium. The image is linked rather than copied, so it stays current at the source and can be shared across any number of products. |
| Bugfix | #DEV-24701 | Core | Accounting postings can now be deleted by anyone with Administer access to the accounting report, instead of requiring Omnium support. The delete dialog also shows the exact date range and store IDs it searched, so an empty result is easy to explain. |
| Feature | #DEV-24699 | Order management | The payment status filter in the order list now separates payments that are only reserved from payments that are captured. Use 'Reserved, not captured' to find orders where the customer's money has not been drawn yet, or 'Captured' for fully settled orders. Several payment statuses can now be combined in one search. |
| Feature | #DEV-24687 | Api | The store's OmniStock rules (excluded brands, seasons, promotions, products, category include/exclude and profitability threshold) are now available in the public API on OmniumStore for GET, PUT/POST and PATCH. |
| Feature | #DEV-24684 | Core | Cases can now move automatically to a status of your choice the first time an agent replies to the customer, so your case list separates untouched cases from ones already being worked on. Pick the status under Case settings — internal notes never trigger the change, and a status you set by hand is never overwritten. |
| Feature | #DEV-24680 | Order management | Gift receipts now include a barcode of the order number in the top right corner. The order can be looked up by scanning the receipt instead of typing the number by hand. |
| Feature | #DEV-24679 | Api | When adding an asset to a business customer through the API, you can now supply a name, description, purpose and alt text along with the file. Attachments uploaded from the customer's Attachments tab now get an asset ID, so they can be updated and deleted through the API. |
| Feature | #DEV-24626 | Core | Self service of SSO is now open for admins in test. |
| Feature | #DEV-24575 | Shipment | Create split shipment has a new option to collect goods from the original warehouses. When enabled, stock and reservations for lines picked at other stores are moved to the sending warehouse as the shipment is created, so one shipment can be booked and labelled while each store's stock stays correct. It can be turned on by default in Order settings. |
| Feature | #DEV-24549 | Order management | The status that expired Click & Collect orders receive can now be configured per limit (store pick, customer pickup, transit) under Tenant settings → Click & Collect. Existing tenants keep the current statuses. |
| Feature | #DEV-24533 | Customer | New error filter on b2c and b2b customers |
| Feature | #DEV-24531 | Product | Product URLs generated by Omnium can now include the product's language. Add {productLanguage} to the URL provider template to build language-specific URLs, for example /en/products/sku-12345. |
| Feature | #DEV-24529 | Core | All Omnium UI text is now fully translated in Danish, German, Spanish, Finnish, French, Norwegian, Dutch, Polish and Swedish. Recently added screens — promotion approval, the access control matrix, price list copying and Sitoo related-product mapping — no longer fall back to English. |
| Bugfix | #DEV-24521 | Payment integration | Nets Easy webhook secrets can now be configured per payment type in tenant settings. Several values can be listed so a secret can be rotated without interrupting payments created with the previous one. |
| Feature | #DEV-24502 | Product | Products can now be linked to more than one supplier. Under Supplier in the product editor you can add additional suppliers, each with their own supplier SKU, colour and packaging quantity, and they are listed on the product page with a link to each supplier. |
| Feature | #DEV-24491 | Core | A new Security page under Administration gives administrators one place to review who has full access, inactive accounts, open invites, API users, webhooks, the audit trail and unresolved errors. Every finding links straight to the page where it can be fixed. |
| Feature | #DEV-24254 | Order management | The 'To be purchased' badge on order lines is now clickable and opens the Orders to purchase overview, filtered on that product. |

## Release 2026-30

Release date: Sep 15, 2026

### Main focus areas

This release focuses on expanding order and fulfillment workflows, strengthening API capabilities, improving customer service and Click & Collect operations, and providing greater flexibility in promotions, analytics, and dashboard configuration. It also introduces enhanced inventory allocation, accounting, consent management, and integration capabilities.

### Key changes and improvements

#### Order Management & Fulfillment

*   Order workflows can now limit **purchase suggestions to backorder products** using the `BackorderOnly` option.
*   Inventory reduction workflows can optionally reduce stock based on **delivered quantity only**, preventing undelivered lines from affecting inventory.
*   Added support for **exchange orders**, allowing customer service to exchange returned products while automatically transferring the payment.
*   Click & Collect views now support **product images, clickable product numbers, and selected product properties** on order lines.
*   Order notifications based on working days and store opening hours are now sent when the relevant store **opens**.
*   Added **product reallocation from the pick list**, allowing unavailable items to be routed to the nearest store with stock instead of being cancelled.

#### Purchase Orders & Inventory

*   Reorder suggestions and customer orders for the same SKU are now **combined when grouping purchase orders by SKU**, while quantities remain independently removable.
*   Purchase order lines without an individual delivery date can now contribute to **ATP using the purchase order's requested delivery date**.
*   Deliveries now support **custom properties**, including highlighted properties shown across delivery and goods-reception workflows.
*   Added improved inventory allocation and fulfillment controls for packages and bundled products.

#### API

*   Product Query APIs (`Query` and `Query/Scroll`) are now **generally available** and recommended for product search and retrieval.
*   Saved product searches can now be used as the base query through `savedSearchId`.
*   Added API support for **crediting/refunding payments through the configured payment provider**.
*   `GetConfiguredConsents` now supports filtering by `marketIds`.
*   Projects returned through the public API now include **`rmaNumbers`**, exposing associated RMA numbers without a separate lookup.
*   Product publish dates can now be **cleared through the API**.

#### Promotions & Pricing

*   Promotions can now use **member price as the discount base**, enabling promotion stacking on customer club prices while excluding unrelated campaign prices.
*   Kit promotions can now contain **multiple bundle alternatives**, with the best available customer price applied automatically.

#### Product Management

*   Product publish dates are now assigned only when a product becomes **active** and can be cleared manually.
*   Product Query API support for saved searches provides a reusable foundation for consistent product filtering.

#### Analytics & Dashboards

*   Analytics table views now include a sortable **Number of orders** column showing unique order counts per group.
*   Grouped Excel exports now include the unique order count.
*   Multiple dashboards can now be configured as **tabbed home-screen dashboards**, with templates for different roles and shared dashboards assigned to user groups.
*   Order gadgets can be filtered by order type, shipping method, and period, with direct navigation to matching orders.

#### Cart & Customer Service

*   Cart API can now return configurable **price metadata per order line**, including customer club pricing and lowest-price information.
*   Custom web pages can now be embedded as **cart tabs**, while built-in tabs can be hidden.
*   Customer details on order pages can now be copied as **plain text**, without field labels.

#### Customer & Case Management

*   Business customer IDs can now be **generated automatically from email or phone**, matching private customer identification behavior.
*   Consent types can now be restricted by **market**.
*   Case settings can default replies to **public notes**.
*   Case emails can optionally include the **conversation history**.

#### Configuration & Administration

*   Workflow groups can now be **copied and edited as JSON**, simplifying configuration migration between environments.
*   Sitoo settings are now organized into dedicated tabs with improved change tracking and publishing behavior.
*   Added support for **LINK Mobility SMS**, including two-way replies in the originating order, case, project, or customer thread.

#### Returns & Projects

*   Returns now record a **completion date**, which can be filtered and included in reports.
*   Project APIs now expose associated **RMA numbers** for easier integration with return processes.

#### Shipping & Integrations

*   Enhanced **NVIT and Logistra** support with additional customs, origin, weight, package type, and marking fields.

| Type | Issue No | Domain | Description |
| --- | --- | --- | --- |
| Feature | #DEV-24463 | Order management | The workflow step that marks unreserved order lines for purchase can now be limited to backorder products only. Enable BackorderOnly on the step so that only items you do not keep in stock become purchase order suggestions. |
| Feature | #DEV-24458 | Core | Business customers created in the Omnium UI can now get their customer ID automatically from the email or phone field, the same way private customers already can. Enable it under Configuration → Customer → Identification with the new 'Business customer ID field' setting. |
| Feature | #DEV-24454 | Core | Workflow groups can now be copied and edited as JSON from the order type settings. Use Copy JSON on a group, or the new JSON tab in the group editor, to move a group between environments or edit it directly. Changes to a group take effect immediately after saving. |
| Feature | #DEV-24450 | Core | Cases can now open with the public note tab preselected, so replies go to the customer without switching tabs each time. Enable 'Default to public notes' under case settings - internal notes remain the default if you leave it off. |
| Feature | #DEV-24444 | Inventory | The "Reduce inventory" and "Reduce inventory and reserved inventory" workflow steps have a new ReduceByDeliveredQuantity option. When enabled, stock is reduced only by the delivered quantity on each order line, so lines that have not been delivered yet are left untouched. |
| Feature | #DEV-24441 | Core | Emails sent from a case can now include the conversation so far, so customers can follow the dialogue instead of receiving single disconnected messages. Turn it on under Configuration → Settings → Customer → Case settings, or add the new CASE\_HISTORY tag to a case notification template. |
| Feature | #DEV-24440 | Order management | Returns now record when they were completed. A new "Set completed date" step in the return workflow stamps the completion time on the return, and that date can be filtered on in the returns list and added as a column to return reports - so you can export exactly which returns were completed in a given period. |
| Feature | #DEV-24433 | Core | When creating a purchase order with Group by SKU enabled, reorder suggestions are now combined with customer orders for the same SKU on a single line. Removing a reorder suggestion from a shared line only removes its quantity, leaving the customer order quantity in place. |
| Feature | #DEV-24432 | Core | Analytics reports can now be grouped by variant name, giving each variant its own row with its colour and size included. Grouping on product name is unchanged, so existing reports keep working as before. |
| Feature | #DEV-24424 | Customer | Api: GetConfiguredConsents can now filter by marketIds |
| Feature | #DEV-24423 | Pick list | Stores can now reallocate an item directly from the pick view: when "Cannot Pick" is used, the item line is split into a separate shipment and sent to the nearest store with the item in stock, instead of being canceled. Enabled per tenant in the pick list settings. |
| Feature | #DEV-24420 | Customer | Consent types in settings can now be restricted on markets |
| Feature | #DEV-24415 | Api | Api: Credit (refund) a payment on an order through the payment provider |
| Feature | #DEV-24413 | Order management | The Click & Collect order view now shows a product image and a clickable product number on each order line, so you can open the product straight from the order. Order lines can also display selected product properties - such as shelf location or author - to make picking in store easier. |
| Feature | #DEV-24372 | Cart | The get cart API can now include price information on each order line, such as whether a customer club price was used and the product's lowest price. Enable it by listing the desired price properties in the new order line setting under tenant settings. |
| Feature | #DEV-24360 | Sitoo Connector | The Sitoo settings page is now organised into tabs (API connection, Secrets, Product settings, Orders, Inventory). Changes made there are tracked and saved like other settings, so saving a section no longer causes a conflict when publishing. |
| Feature | #DEV-24359 | Api | The Product Query API endpoints (Query, Query/Scroll) are now generally available and no longer marked as preview. We strongly recommend using these endpoints for all product search and get operations. |
| Feature | #DEV-24333 | Link Mobility | Omnium now supports LINK Mobility as an SMS provider, using their current REST API. When two-way SMS is enabled, replies from customers appear automatically in the same comment thread the message was sent from — on the order, case, project or customer card. |
| Feature | #DEV-24332 | Product | Saved product searches can now be used directly in the Product Query API: pass the saved search ID as savedSearchId and the saved criteria run as the base query. Page size, sorting, and any filters set on the request override the saved values. |
| Feature | #DEV-24331 | Cart | You can now show your own web pages as tabs directly on the cart page, placed before the standard tabs. Cart settings also lets you hide the built-in cart tabs, so a custom tab or view can be the main working area. |
| Feature | #DEV-24328 | Purchase orders | Purchase order lines without their own delivery date can now be counted as incoming stock (ATP), using the order's requested delivery date. Enable Set ETA from purchase order in the purchase order settings. |
| Feature | #DEV-24327 | Order management | Customer service can now create exchange orders directly from an order. Pick the items the customer is sending back, swap them for another size, colour or product, and Omnium creates a new order with the payment moved across — showing exactly what is credited and what the customer still owes. |
| Feature | #DEV-24326 | Gui | The customer card on the order page now has a copy button that copies the customer's details as text. Selecting the card by hand copies just the values — names, phone numbers and addresses — without the field labels, so pasting into an email or another system needs no cleanup. |
| Feature | #DEV-24321 | Order management | Notifications that wait a number of working days and follow store opening hours are sent when the store opens. |
| Feature | #DEV-24311 | Core | Promotions can now calculate their discount from the member price. Enable the new 'Use member price as base' setting to make a promotion stack on top of customer club prices — from member price lists or members-only promotions — while prices from other campaigns are never used as the base. |
| Feature | #DEV-24305 | Core | Deliveries now support custom properties, configured under Purchase order settings → Deliveries. Selected properties can be highlighted so they show directly in the delivery list, on the delivery, during goods reception and on the delivery receipt. |
| Feature | #DEV-24302 | Core | You can now have multiple dashboards on the home screen, organized in tabs. Create your own from ready-made templates for different roles, and administrators can build shared dashboards and assign them to user groups. Order gadgets can also be configured with order type, shipping method and period - and clicking the numbers opens the matching order list. |
| Feature | #DEV-24298 | Core | The Analytics report's table view now includes a sortable 'Number of orders' column showing the unique order count per group — the same number previously only available in the chart. The column is also included in the grouped Excel exports. |
| Feature | #DEV-24282 | Product | Products no longer receive a publish date until they are set to active — a product created as inactive keeps the field empty until you activate it. The publish date can now also be cleared, both from the product editor and through the API. |
| Feature | #DEV-24163 | Promotions | Kit promotions can now offer multiple bundles - each with its own products and price - and automatically apply whichever gives the customer the best deal. |
| Feature | #DEV-23080 | Shipment | Improved NVIT support with CustomsCode and CountryOfOrigin on orderlines and NetWeightInKg, PackageType and Marking on shipment packages. Improved NVIT support for Logistra. |
| Feature | #DEV-22445 | Project | Projects returned by the public API now include an rmaNumbers field listing the RMA numbers of returns registered on the project. Integrations can read a project's returns straight from the project response instead of making a separate lookup. |

## Release 2026-29

Release date: Sep 8, 2026

### Main focus areas

This release focuses on stronger configuration governance and auditability, improved order and inventory workflows, enhanced purchase planning, and expanded API capabilities. It also introduces more flexible environment management, accounting controls, and payment integration support.

### Key changes and improvements

#### Order Management & Click & Collect

*   Click & Collect now supports **custom order tabs**, configurable by order type, shipping method, tags, and statuses, with both order- and order-line-based views.
*   Order version history now includes the **source cart versions**, with JSON export and anonymized customer data options for troubleshooting.
*   Shipment external IDs are now more prominent, while unpaid orders have a clearer **Due payment** indicator.
*   Package and bundle products can now be configured to **prevent warehouse splitting** and keep linked components together during fulfillment.

#### Inventory & Purchase Planning

*   Reorder suggestions can now be **disabled per SKU/warehouse**, with dedicated status filtering and visual indicators.
*   Internal transfers now show **source and destination warehouse inventory**, including incoming quantities, directly in purchase order product views.
*   Inventory reservations can now be **increased or decreased through the API**, with idempotent references to safely support retries.
*   Purchase planning now distinguishes **purchasable and non-purchasable products**, with filtering and clearer assortment-code indicators.

#### Products & Purchase Orders

*   Purchase order product pricing now correctly reflects the **campaign supplying the cost price**, including its validity period and campaign-specific margin calculation.
*   `/api/products/Query` now supports querying by **GTIN**.
*   Improved product component configuration for controlling fulfillment and warehouse allocation behavior.

#### Promotions

*   Promotion lists now support filtering by **creator and creation date**, including a **My promotions** filter.
*   Fixed combinable promotions so eligible promotions **stack correctly on the same product**, with `CanBeCombined` consistently enforced.

#### Configuration & Administration

*   Custom Views can now be **exported and imported between environments**, supporting migration between environments such as test and production.
*   Event subscriptions can be bulk-exported using the `*` wildcard.
*   Scheduled tasks can now be **stopped safely while running**, with status feedback indicating when a stop has been requested.
*   Project integration errors are now managed directly from the project information panel, including viewing, resolving, and removing errors.

#### Accounting

*   Generated accounting postings can now be **deleted for selected stores and date ranges**, allowing affected orders to be posted again.
*   Store-specific charts of accounts now **inherit from the global chart**, with support for copying, JSON editing, and validation.

#### Notification Templates & Auditability

*   Notification templates now have a complete **event log and version history**, including who changed what and when.
*   Versions can be compared side by side and inspected as raw JSON.

#### Workflow & API

*   `GoToWorkflowStep` API now supports `runWorkflow=false`, allowing project workflow steps to be corrected or backfilled without executing the workflow or triggering customer notifications.

| Type | Issue No | Domain | Description |
| --- | --- | --- | --- |
| Feature | #DEV-24293 | Core | The event log now covers notification templates. You can see who created, changed or deleted a template — including which fields were edited — from the Log menu on the template. |
| Bugfix | #DEV-24285 | Product | When adding products to a purchase order, the customer price now reflects the campaign the cost price comes from, including the period it applies to. The current price is shown alongside it when the two differ, and the margin is calculated on the campaign's own cost and price. |
| Feature | #DEV-24284 | Order management | The Click & Collect page can now be set up with custom tabs, so store employees see exactly the orders they are responsible for. Each tab can be filtered by order type, shipping method, tags and preselected statuses, and can use either the order-based or the order-line-based view. |
| Feature | #DEV-24283 | Core | Projects now show integration errors directly in the project information panel, where support can view the details, mark them as solved, or remove them - the same way order and purchase order errors already work. Integrations can set these errors through the project API when an export fails. |
| Feature | #DEV-24281 | Core | Notification templates now keep a full version history. Open "Version list" from the notification's menu to see who changed what and when, compare any two versions side by side, and view the raw JSON. |
| Feature | #DEV-24279 | Core | Administrators can now delete generated accounting postings for a selected date range and set of stores directly from the Accounting postings view. Deletion requires confirmation, and removing postings frees the affected orders to be posted again by a new run. |
| Feature | #DEV-24278 | Core | The promotion list can now be filtered by who created a promotion — use the new "My promotions" switch to see your own, or pick a colleague from the Created by dropdown. You can also filter on when a promotion was created, and the filters are now grouped into labelled columns. |
| Feature | #DEV-24274 | Product | In purchase planning, products that cannot be ordered (non-purchasable assortment codes) are now hidden by default, with a new Purchasable/All/Not purchasable filter and a clear 'Not purchasable' tag on affected products. The assortment code field in the product editor is now searchable. |
| Feature | #DEV-24250 | Order management | The order version history can now also show the versions of the cart the order was created from. Any version can be copied as JSON, including an anonymized copy with all customer data removed — useful for troubleshooting. |
| Feature | #DEV-24235 | Order management | Shipment external IDs are now more prominent on the order page, and the Due payment badge on order lists is clearly red so unpaid orders stand out. |
| Feature | #DEV-24223 | Inventory | You can now disable reorder suggestions for individual inventory items (SKU/warehouse combination) using the 'Disable reorder suggestions' action in the row menu of the reorder views. Disabled items are highlighted, no longer receive purchase suggestions, and can be filtered with the new Active/All/Disabled filter. |
| Feature | #DEV-24222 | Order management | Package and bundle products can now be configured to prevent splitting across warehouses during allocation, and individual components can be linked so they are always delivered together (for example a jersey and its print). The settings are available on the product's component editor and in the API. |
| Feature | #DEV-24219 | Inventory | Internal transfers now show inventory for both the source and destination warehouse directly in the purchase order product list, including incoming quantities. This makes it easier to see what can be transferred without opening inventory details for each product. |
| Feature | #DEV-24206 | Core | You can now stop a running scheduled task directly from the scheduled tasks settings page. The task stops safely at its next checkpoint, and the status shows when a stop has been requested. |
| Feature | #DEV-24201 | Inventory | You can now increase or decrease reserved inventory directly via the API, matching the reservation behavior used internally for orders. Repeated requests with the same reference are safely ignored, so integrations can retry without double-reserving stock. |
| Feature | #DEV-24196 | Core | You can now export and import Custom Views between environments (e.g. from test to production) from Administration → Export/Import. Event subscriptions can also be exported in bulk using the \* wildcard. |
| Bugfix | #DEV-24195 | Product | Now possible to query gtin in /api/products/Query |
| Bugfix | #DEV-24177 | Promotions | Fixed combinable promotions not stacking on the same product, and also made sure that CanBeCombined is always honored. |
| Feature | #DEV-24154 | Core | A store's chart of accounts now adds to the global chart instead of replacing it, so a store only needs the accounts that differ — everything else is inherited. You can copy accounts from the global chart or another store, edit the whole chart as JSON, and check it for problems before saving. |
| Feature | #DEV-24128 | Api | The GoToWorkflowStep API can now change a project's workflow step without running the project type's workflow. Pass runWorkflow=false to correct or backfill a step without notifying the customer. |

## Release 2026-28

Release date: Sep 01, 2026

### Main focus areas

This release strengthens workflow and cart validation controls, improves order and customer visibility, and expands API capabilities for pricing and customer data. It also adds better event-driven integration support and clearer shipment-level order tracking.

### Key changes and improvements

#### Order Management & Workflow

*   Order event logs now identify the **shipment associated with each event**, with shipment-specific labels and timelines for easier analysis of multi-shipment orders.
*   Added **tag filtering to order reports**, applying filters consistently to both charts and exported data.
*   Added a **Set order line return date** workflow step for automatically timestamping returned order lines.
*   Order splitting workflows now support **assortment-aware allocation**, ensuring products and virtual bundle components are only allocated to eligible stores.
*   Fixed out-of-stock cancellation to evaluate availability against the **actual shipping warehouse**, rather than aggregated stock across all warehouses.

#### Cart Validation

*   Cart validators can now be configured by **market and market group**, in addition to order type.
*   Validators can be independently enabled or disabled for specific **markets and order types**, allowing validation rules such as credit-limit and inventory checks to run only where applicable.

#### Customer & API

*   Customer APIs now expose an `errors[]` collection across **get, search, scroll, versions, and information** endpoints for both private and business customers.
*   Customer search now supports a **`hasErrors` filter**, aligning customer APIs with existing order error handling.
*   Price imports can now use **SKU-only matching**, allowing source systems without Omnium Product IDs to import prices directly. Ambiguous or unknown SKUs are reported in the response.

#### Price Lists & Promotions

*   Price list deactivation is now safely queued when activation is still running, preventing stale prices from remaining on products.
*   Added an option to **re-run price cleanup** for an already deactivated price list without reactivating it.
*   Omnium now emits an event when **promotion price processing completes**, allowing integrations to react when products are added to or removed from promotions.

#### Product

*   Improved the Product Published filter so publication status is evaluated independently from activation status.
*   Inactive products can now correctly appear as published when they have a published date, while activation state is controlled separately by the Active/Inactive filter.

#### Email & Notifications

*   Email templates created in the Designer now support the **full notification merge tag set**, including cancelled and ready-for-pickup product lists.
*   Test emails can now be generated using a **real order number**, providing actual order content during template validation.

#### Connectors

*   **Sitoo:** Product specifications can now be sent as the POS product description and short description, configurable per market.
*   Sitoo product content falls back to the existing description when no specification is available.

| Type | Issue No | Domain | Description |
| --- | --- | --- | --- |
| Feature | #DEV-24092 | Customer | The customer API now returns `errors[]` on private and business customers (get, search, scroll, versions, information), and customer search supports a hasErrors filter, matching what orders already had. |
| Feature | #DEV-24089 | Order management | The workflow steps 'Try split unreserved order lines to closest zip / nearest coordinates' now support a CheckAssortment option. When enabled, products restricted to specific stores under Assortment - including virtual bundle components such as club prints - are only allocated to stores they are assorted for, keeping the whole bundle together. |
| Feature | #DEV-24076 | Core | Email templates built in the Designer now support the full set of notification merge tags, including cancelled and ready-for-pickup product lists. You can also preview and send test messages using a real order number, so you see actual order content instead of sample data. |
| Feature | #DEV-24075 | Core | Omnium now emits an event when a promotion's price update has finished processing. Integrations can subscribe to this event to react when products are added to or removed from a promotion. |
| Feature | #DEV-24041 | Order management | Order reports can now be filtered by tags. Select tags to include or exclude on the order reports page, and both the charts and the exported report will only cover the matching orders — the same way tag filtering already works on the order list. |
| Feature | #DEV-24037 | Cart | Cart validators can now be scoped to markets and market groups, in addition to order types. Each validator can be enabled or disabled per market, so checks only run where they are relevant. |
| Feature | #DEV-24018 | Order management | A new return workflow step 'Set order line return date' is available. When added to a return workflow, it automatically stamps the return date on the returned order lines. |
| Bugfix | #DEV-23986 | Workflow | Out-of-stock cancellation now checks each order line against the warehouse actually shipping it, rather than the combined stock of all warehouses on the order. |
| Bugfix | #DEV-23985 | Product | The Published filter in the product list now finds products by their published date alone, so a product that is published but not activated is no longer hidden from the list. Whether a product is active is controlled only by the Inactive/All/Active filter, which also means inactive products are no longer listed as Unpublished. |
| Feature | #DEV-23964 | Cart | Cart validators can now be scoped to specific order types. Each validator can be enabled or disabled per order type, so checks like credit limit or inventory validation only run where they are relevant. |
| Feature | #DEV-23958 | Product | Prices can now be imported using only the SKU. If your source system does not know Omnium's ProductId, you can send prices with just the SKU in the code field, and Omnium matches them to the right product and variant. SKUs that are unknown or that exist under several products are reported back in the response. |
| Bugfix | #DEV-23951 | Price list | Deactivating a price list while it is still being activated no longer leaves old prices on products — the deactivation is queued and runs once the activation completes. A new action lets you re-run the price cleanup on an already deactivated price list without activating it again. |
| Feature | #DEV-23950 | Sitoo Connector | Sitoo connections can now show product specifications in the POS instead of the web shop description. Enable "Use Specification as product description" on the Sitoo settings for a market, and the product's Specification field is sent to Sitoo's description and short description. Products without a specification keep their existing texts. |
| Feature | #DEV-23945 | Order management | The order event log now shows which shipment each event belongs to, with a colour-coded label and timeline per shipment. This makes it much easier to follow orders with multiple shipments. |

## Release 2026-27

Release date: Aug 25, 2026

### Main focus areas

This release focuses on a refreshed user experience, improved pricing and promotion logic, enhanced product and category usability, and expanded integration capabilities. It also introduces additional configuration flexibility for external IDs and CDN delivery.

### Key changes and improvements

#### User Interface & Core Platform

*   Introduced a **refreshed Omnium user interface** with a modernized design, full dark-mode support, and improvements across pages, views, and dashboards.
*   Historical order versions can now be **previewed directly from the version list**.
*   CDN URLs can now be configured **per market**, while markets without an override continue using the global CDN configuration.
*   Discount percentage merge tags in print and email templates now include the **% sign automatically** and remain empty when no discount is applied.

#### Product & Pricing

*   Category picker usability improved: removing a category no longer collapses the category tree.
*   Product and order line views now show both:
    *   **Reorder price**
    *   **Average cost of available stock** including the source of each value.
*   Order line margins against both cost values now update **in real time** while editing prices.

#### Promotions

*   Category and brand promotions using **amount-based discount steps** now evaluate thresholds based on the products covered by the promotion.
*   Discounts are distributed proportionally across qualifying order lines.
*   Added an option to evaluate amount steps **per order line**, allowing each qualifying line to receive its applicable discount independently.

#### External IDs & Integrations

*   Configurable **external ID links** can now also be used on customer records, reusing the same link configuration as orders.
*   **Sitoo Connector:** Sitoo webhook secrets can now be viewed and managed directly in Omnium settings.
*   **Voyado Connector:** Added support for synchronizing Voyado multi-channel promotions and coupons through webhooks.

| Type | Issue No | Domain | Description |
| --- | --- | --- | --- |
| Feature | #DEV-23907 | Order management | You can now preview a historical version of an order directly from the version list — click the eye icon next to a version to open it in the order preview. |
| Feature | #DEV-23877 | Sitoo Connector | You can now view and edit the Sitoo webhook secret directly in Sitoo settings, instead of having it configured manually. The value must match the api\_token in your Sitoo event subscription settings. |
| Feature | #DEV-23873 | Product | Unselecting a category in the category picker no longer collapses the category tree, so several categories can be removed in a row without expanding your way back down each time. |
| Feature | #DEV-23871 | Core | External ID links can now be used on customers as well as orders. Configure a link once under Order settings → External ID links, and it will appear next to matching external IDs on both orders and customer cards — for example a direct link to the customer in Voyado. |
| Feature | #DEV-23860 | Core | Omnium has a refreshed look and feel: a modernized interface with full dark-mode support and improvements across views, pages, and dashboards throughout the application. |
| Feature | #DEV-23854 | Core | Discount percentage merge tags in print and email templates now include the % sign themselves, and stay empty on lines without a discount. If your templates add a literal % after {LINEITEM\_DISCOUNT\_PERCENTAGE}, remove it to avoid a doubled sign. |
| Feature | #DEV-23842 | Core | CDN URLs can now be configured per market. Markets without their own CDN URL continue to use the global one, so existing setups are unaffected. |
| Feature | #DEV-23829 | Product | When editing an order line or viewing a product, Omnium now shows both the reorder price and the average cost of the stock you actually have, each labelled with where the number comes from. In the order line editor the margin against both figures updates live as you adjust the price, so sales staff can see how much discount they can give and still earn on the items in stock. |
| Feature | #DEV-23817 | Core | Category and brand promotions with amount steps now evaluate the step thresholds against the products covered by the promotion, and the discount is distributed proportionally across those order lines. A new setting lets you evaluate the steps per order line instead, so each qualifying line gets the reached step's discount. |
| Feature | #DEV-22841 | Voyado Connector | Adding support for syncing Voyado multi channel promotions (coupons) via webhooks. |

## Release 2026-26

Release date: Aug 18, 2026

### Main focus areas

This release focuses on stronger configuration governance and auditability, foundational RFID support, improved import validation, and enhanced workflow and integration capabilities. It also introduces usability improvements for dashboards and product management.

### Key changes and improvements

#### Order Management & Workflows

*   Introduced a new version of the **Create and send gift cards** workflow step, allowing the target order or gift card shipment status to be configured after gift card creation.
*   Improved compatibility with workflow steps that execute **after the order has been saved**.

#### Configuration & Auditability

*   Tenant settings can now be **saved independently per configuration card**, rather than publishing the entire configuration at once.
*   Each setting shows **who last changed it and when**.
*   Added full **configuration change history**, including the ability to review previous values and restore them.

#### Inventory & RFID

*   Added foundational **RFID support** through the new EPC Tags API.
*   EPC tags can be associated with **products, deliveries, and orders**.
*   Added an RFID view on product pages showing all EPC tags associated with a SKU.
*   RFID can be enabled under **Inventory Management** in tenant settings.

#### Import & Data Validation

*   Import mapping now detects **Excel date-formatted cells** mapped to price, cost, or quantity fields.
*   The mapping step warns users when values may be interpreted incorrectly and shows the **actual value that would be stored**.

#### Integrations & Webhooks

*   **Fifo Webhooks:** Added support for credit payment events through `ICreditPaymentExporter`, allowing credited payments to be delivered through webhooks.

#### Product Management

*   Product copy settings now allow administrators to control which **external IDs and properties are excluded** when copying products.
*   Date formatting for **highlighted properties** has been corrected.

#### Dashboard & User Experience

*   Gadget selection now includes a **live preview using tenant data**, with keyboard navigation for quickly browsing available gadgets.

| Type | Issue No | Domain | Description |
| --- | --- | --- | --- |
| Feature | #DEV-23809 | Order management | A new version of the 'Create and send gift cards' workflow step is available. It lets you configure which status the order (or the gift card shipment for mixed orders) should move to after gift cards are created, and works correctly with workflow steps configured to run after the order is saved. |
| Feature | #DEV-23806 | Core | Import files are now checked for cells Excel stores as dates. If such a column is mapped to a price, cost or quantity, the mapping step warns you before importing and shows the number that would actually be stored - for example a cell showing 2356.5 that is really the date 1 May 2356 and would import as 166673. |
| Bugfix | #DEV-23803 | Product | Highlighted properties - fix formatting on dates |
| Feature | #DEV-23802 | Core | When adding a gadget to the dashboard you now get a live preview of it. Browse the gadget list with the arrow keys and the preview on the right follows along, so you can see exactly what a gadget looks like with your own data before adding it. |
| Feature | #DEV-23798 | undefined Connector | FIFO webhooks can now deliver credit payment events. Add ICreditPaymentExporter to your FifoWebhook connector's Implementations to receive a webhook with the credited payment whenever a payment is credited. |
| Feature | #DEV-23755 | Core | Tenant settings can now be saved one card at a time instead of publishing the whole configuration at once. Each field shows when it was last changed and by whom, and a full change history lets you review earlier values and restore them. |
| Feature | #DEV-23651 | Inventory | Omnium now has foundational support for RFID: EPC tags can be stored and managed through the new EPC Tags API, with references to products, deliveries and orders. A new RFID view on the product page shows all tags for a SKU. Enable RFID under Inventory Management in tenant settings. |
| Feature | #DEV-22147 | Product | Product settings now let you choose which external IDs and properties are left out when you copy a product — either exclude all external IDs, or list specific providers and property keys. |

## Release 2026-25

Release date: Aug 11, 2026

### Main focus areas

This release delivers significant enhancements to inventory and purchase order workflows, expands product and price list management capabilities, improves accounting and reporting, and introduces new API functionality and workflow automation. The release also includes numerous usability improvements across customer service, promotions, and integrations.

### Key changes and improvements

#### Inventory & Purchase Orders

*   Major enhancements to **inventory location management**:
    *   Manage stock locations directly wherever inventory is displayed
    *   Receive goods into specific stock locations
    *   Correct location quantities in a single step
    *   Create new location codes on demand
*   Deliveries now include a dedicated **Quantity** tab, supporting quantity adjustments, stock location management, and purchase order line splitting.
*   Purchase order search now supports **multi-supplier filtering**.
*   Purchase order lines now automatically use the **lowest available cost price** unless a cost price list is selected.
*   Added bulk API endpoint for **cancelling multiple purchase order lines** in a single request.
*   Added API endpoint to **recalculate reserved inventory for selected SKUs** without processing the entire catalog.
*   Reorder suggestions can now be calculated directly from the product list using current search filters and sales periods.
*   Store staff can now report **"Cannot pick"** directly from pick lists, with optional inventory correction and order line cancellation.

#### Product & Price Lists

*   Product search now supports **sorting by custom product properties** through both the UI and Product API.
*   Added configurable **product ID validation** using regular expressions in tenant settings.
*   Price list editor has been significantly redesigned with:
    *   Improved grouped layout
    *   Store cost discount support
    *   Per-store stock visibility
    *   Inline cost currency selection
*   Price lists can now automatically **copy selected product properties** onto price list items during enrichment.
*   Promotion-managed price lists can now **copy prices from other price lists**.
*   Promotion pickers now display **promotion status** (active, upcoming, expired) and load faster.
*   Products using store cost pricing now inherit the **discounted store cost price** when available.

#### Order Management & Workflow

*   Orders can now receive a dedicated **internal Order ID** separate from the customer-facing order number.
*   Added workflow step to **remove order line reservations**, enabling subsequent allocation and splitting workflows.
*   Order status logging now captures **all status changes**, including updates performed outside normal workflow execution.
*   External order IDs now support **configurable hyperlinks** for direct navigation to external systems.
*   Shipment API now supports **removing order lines from existing shipments**, with optional cleanup of empty shipments.

#### Accounting & Reporting

*   Added configurable **posting exclusion rules** to selectively exclude transactions from accounting exports based on market, store, order type, payment method, and other criteria.
*   Rental revenue can now be posted to a dedicated **Rental Sales** account.
*   Accounting postings page now supports **pagination** and improved generation progress reporting.
*   Return reports now support:
    *   Return store
    *   Supplier name
    *   Aggregated return reasons
    *   Line-level return reason reporting
*   Improved year-over-year comparisons with enhanced **date picker shortcuts**.
*   Fixed several accounting and analytics issues related to VAT handling, web fulfillment postings, and missing analytics data.

#### API & Integrations

*   Added APIs for retrieving **inventory reservations** from both orders and purchase orders.
*   Cart PATCH endpoint can now optionally **return the updated cart** in the same response.
*   Added APIs exposing configured **customer consent types** for both B2B and B2C.
*   **Sitoo Connector:** Added synchronization of related products.
*   **Voyado Connector:** Added real-time reward voucher import via webhook and automatic voucher reactivation after refunds or cancellations.
*   **EG Connector:** Added support for EG/Lindbak gift cards, including issuance, balance lookup, redemption, and recharge.
*   Performance improvements for **Voyado XML feeds**.

#### Customer & Customer Service

*   Customer search can now optionally **search across all stores**, regardless of user store access.
*   Customer service cases can now be linked to existing customers using the standard customer search, with support for creating new customers directly from the dialog.
*   Added support for **@mentions in comments**, including email notifications and personal mention overview pages.

#### Promotions

*   Promotions can now use **short promotion numbers** generated from tenant-specific number series.
*   Promotion list now includes:
    *   Creation and modification metadata
    *   Creator information
    *   Visual indicators for markets, stores, and active filters
*   Promotion lists are now automatically filtered by the selected market.
*   Promotion edit filters are now grouped by category for improved usability.

#### Core Platform & Administration

*   Scheduled tasks now support a **visual scheduling interface**, eliminating the need to manually write cron expressions.
*   My Page now includes:
    *   My Orders
    *   My Carts
    *   My Events
*   Event log now displays **human-readable queue names** for batch operations.
*   Property option activation state now saves correctly.
*   Numerous usability improvements across inventory, accounting, customer service, ISA configuration, and analytics.

| Type | Issue No | Domain | Description |
| --- | --- | --- | --- |
| Feature | #DEV-23744 | Product | Product search can now be sorted by custom product properties. In the product query API, use the sort field "properties.{key}" — for example "properties.countryOfOrigin" — with asc or desc; products without the property are listed last. |
| Feature | #DEV-23743 | Inventory | Deliveries now have a Quantity tab, matching the purchase order view, where you can adjust quantities and stock locations and split order lines. On a product's Inventory tab, the location list is now expanded by default. |
| Feature | #DEV-23732 | Product | You can now define a validation pattern (regex) for product IDs directly in Tenant Settings -> Number options. New products created in the UI must then follow your chosen ID format. |
| Feature | #DEV-23728 | Inventory | You can now see and manage stock locations wherever inventory appears, expand a warehouse row to see its locations, correct a location's quantity in one step, choose which location goods are received to on a purchase order line, and set locations and quantities when creating a product. New location codes can be created on the fly. |
| Feature | #DEV-23727 | Core | Promotions can now have a short promotion number alongside their ID, set up per tenant as a number series. The promotions list shows the number, when a promotion was created and last modified, who created it, and a new indicator column showing markets, stores and active filters at a glance. |
| Feature | #DEV-23709 | Product | The store cost price on a price list item now uses Discount and Discount % fields, the same way cost and customer prices work. The price list Full view has been reorganised into eight columns - product details, cost, store cost, pricing, customer discount, sales forecast, purchase forecast and comments - with the cost currency selectable directly in the cost field and stock shown per store. |
| Feature | #DEV-23704 | Order management | The supplier filter in purchase order search now accepts multiple suppliers at once, so purchase orders from several suppliers can be listed together. |
| Feature | #DEV-23698 | Promotions | Promotion list will now be filtered by selected markets |
| Feature | #DEV-23696 | Api | The public API can now return the orders and internal transfers that currently reserve inventory for a product at a given warehouse — the same information as the reserved-quantity dialog in Omnium. See GET /api/Orders/WithReservedInventory and GET /api/PurchaseOrders/WithReservedInventory. |
| Feature | #DEV-23695 | Core | My Page now has three new tabs, My Orders, My Carts and My Events, giving you a personal overview of your own orders, carts and recent activity. Order and cart lists embedded on customer, project and subscription pages now use page navigation instead of a 'Load more' button. |
| Feature | #DEV-23692 | Core | You can now tag colleagues with @ in comments across Omnium. Mentioned users are notified by email and get a personal 'Mentioned in comments' overview on their profile page and dashboard, where mentions can be filtered and resolved. |
| Feature | #DEV-23688 | Order management | Orders can now receive an internal ID from a dedicated numbering series, separate from the customer-facing order number. Configure it via the new 'Order ID number' option in the tenant number settings — when it isn't set up, order IDs continue to match the order number as before. |
| Feature | #DEV-23660 | Order management | Store staff can now report 'Cannot pick' directly from pick lists. If the stock level is wrong, they can correct the store's inventory on the spot and optionally cancel the order line in the same dialog. |
| Bugfix | #DEV-23650 | Sitoo Connector | Sitoo connector now syncs related products from Omnium, configurable per market. |
| Feature | #DEV-23649 | Core | Customer service cases can now be linked to customers by searching for name, email, or phone number — the same customer search used elsewhere in Omnium. New customers can also be created directly from the dialog. |
| Feature | #DEV-23647 | Inventory | You can now recalculate reserved inventory for a specific list of SKUs via the API, instead of recalculating the whole catalog. Send the SKU IDs to POST /api/Inventory/RecalculateReservedInventory; the recalculation runs in the background. |
| Feature | #DEV-23641 | Payment integration |  |
| Feature | #DEV-23627 | Core | Custom return reports can now include Return Store, aggregated return reasons, and supplier names. Use the return order line report to get supplier name and return reason per line item. |
| Feature | #DEV-23602 | Order management | You can now configure links for order external IDs. Set up a URL template per external ID type in Order Settings, and a button appears next to that ID on the order so you can jump straight to the record in an external system or elsewhere in Omnium. |
| Feature | #DEV-23594 | Product | You can now copy prices from another price list into a price list that is managed by a promotion. Previously this option was disabled for promotion-managed price lists. |
| Feature | #DEV-23579 | Core | The accounting postings list is now paged for easier navigation of large result sets. When generating web-fulfillment postings, a progress bar now shows postings being created in real time instead of a blank spinner, and the list refreshes automatically when it finishes. |
| Feature | #DEV-23556 | Product | Price lists: you can now configure which product properties are automatically copied onto price list items. Add the property keys under Settings → Products → Price Lists, and they will be filled in whenever price list items are enriched with product data. |
| Feature | #DEV-23554 | Cart | The cart PATCH endpoint can now return the updated cart directly in the response. Add returnUpdatedItem=true to the request to get the recalculated cart back, without needing a separate GET call. |
| Feature | #DEV-23544 | Product | Reorder suggestions can now be calculated directly from the product list, using the current search filters to select products and an optional sales period. Calculation progress is reported accurately while running. |
| Feature | #DEV-23531 | Cart | Carts can now be automatically re-validated so that line items priced from an expired, deactivated or deleted price list are re-priced to the current valid price at cart validation and checkout. Price list validity is cached, keeping the check fast even under heavy load. Enabled per tenant via the new priceListPriceValidator cart validator. |
| Feature | #DEV-23529 | Core | You can now configure posting exclusion rules in Accounting settings to keep selected transactions out of accounting postings — for example ignoring all sales and posting only returns — filtered by market, market group, store, store group, order type, order status, or payment method. |
| Feature | #DEV-23526 | Order management | Order status logging now captures status changes from all order update paths, including status updates that don't run the order workflow. Customers using the status log get complete per-shipment status history and handling-time tracking regardless of how an order's status changes. |
| Feature | #DEV-23445 | Core | The date range picker's previous-year shortcuts now select the matching week and month exactly one year earlier, enabling correct year-over-year comparison |
| Feature | #DEV-23422 | Shipment | You can now remove order lines from an existing shipment via the OrderShipments API. An optional flag also removes any shipment left empty after the lines are removed. |
| Feature | #DEV-23420 | Prices | Fixed: Deleting a price on a product now sticks for tenants that join variant prices onto the product — previously the deleted price would reappear after the product reloaded. |
| Feature | #DEV-23392 | EG Connector | Omnium now supports EG/Lindbak gift cards — issue new gift cards, check balances, and redeem or recharge them directly through the EG GiftCard service. |
| Feature | #DEV-23371 | Promotions | Promotion edit: All filters in left column are now grouped by type |
| Feature | #DEV-23337 | Core | Rental revenue can now be posted to a dedicated rental sales account: add a chart-of-accounts entry with the new “Rental sales” category and rental fees will book there instead of the standard sales account. VAT and rental deposits are unaffected. |
| Bugfix | #DEV-23305 | Core | Fixed an issue where unchecking the "Active" switch on a property option value was not saved and reverted to active after reloading. |
| Bugfix | #DEV-23297 | Core | Web-fulfillment sales and VAT for order lines without an explicit tax group are now posted to the correct rate-specific ledger accounts — e.g. 15% lines no longer land on the 25% accounts — by deriving the tax group from the line's VAT rate instead of the tenant default. |
| Feature | #DEV-23289 | Customer | Customer search can now span all stores: when enabled, searching for a customer returns matches from every store, including stores the user doesn't have access to. Note that with this enabled, customer search always covers all stores regardless of which store is selected. Enabled per tenant in customer settings. |
| Feature | #DEV-23288 | Cost Prices | When a price list uses store cost prices, products now receive the discounted store cost price (when one is set) instead of the full store cost price, so store cost figures reflect the agreed discount. |
| Feature | #DEV-23275 | Customer | Added API endpoints to expose configured consent types. Separate endpoints for B2B and B2C. |
| Feature | #DEV-23264 | Order management | Purchase order lines now automatically use the lowest available cost price unless a cost price list is selected, and the product list shows the lowest, regular and standard cost prices with their source price list. |
| Feature | #DEV-23260 | Core | The event log now shows a readable name for the queue behind a batch update (e.g. 'Product enrichment') instead of the internal technical queue identifier, making it easier to see at a glance what triggered an update. |
| Feature | #DEV-23240 | ISA | The POS device settings screen is easier to scan — sections start collapsed and show how many settings are set/locked at a glance, and collapsing a section no longer clears unsaved Home, Navigation, or Cart line edits. Locked settings are now clearly marked, and store/market/order-type values that are no longer valid stay visible instead of appearing blank. |
| Bugfix | #DEV-23221 | Inventory | Fixed an issue where users without access to all stores saw no central warehouse inventory on the product page even when cross-store inventory search was enabled. |
| Feature | #DEV-23219 | Product | The product enrich table's property selector now lets you add product type custom properties — alongside global and built-in properties — and shows custom property names translated. |
| Feature | #DEV-23217 | Voyado Connector | Voyado reward vouchers can now be imported into Omnium in real time via webhook, as an alternative to the file-based import. Vouchers are also automatically reactivated in Voyado when an order is refunded or cancelled. |
| Feature | #DEV-23215 | Core | Scheduled tasks now use a simple schedule picker — choose how often a task runs (daily at a set time, weekly on selected days, every few minutes, and so on) instead of writing cron expressions. The chosen schedule is shown in plain language, and times are in UTC. |
| Feature | #DEV-23211 | Core | Fixed an issue where order lines could disappear from Analytics after an order was updated, keeping analytics reports complete and accurate. |
| Feature | #DEV-23200 | Product | Promotion pickers in product search filters and price-list editing now show whether each promotion is active, upcoming, or expired, and load faster. |
| Feature | #DEV-23122 | Purchase orders | A new API endpoint lets you cancel many purchase order lines on an order in a single request, instead of one call per line. This clears cancellation backlogs for large purchase orders and removes any need to parallelize the calls. |
| Feature | #DEV-22929 | Order management | New 'Remove order line reservations' workflow step that clears reservation info from order lines, marking them as unreserved. This lets reallocation/splitting steps (e.g. 'Try split unreserved order lines') act on lines that were previously reserved. |
| Feature | #DEV-19993 | Voyado Connector | Performance optimization of VoyadoXmlFeed. |

## Release 2026-24

Release date: Jun 30, 2026

### Main focus areas

This release focuses on improving accounting accuracy and financial controls, expanding order management and shipment workflows, enhancing API scalability, and strengthening operational visibility across products, promotions, and integrations. Several fixes also improve analytics accuracy and workflow reliability.

### Key changes and improvements

#### Accounting & Financials

*   Rental deposits are now posted to a dedicated **deposit liability account** rather than sales revenue, with corresponding refund handling for balanced accounting entries.
*   Added accounting option to **split daily WebFulfillment postings by order type and store**, enabling separate accounting for channels such as online sales and Click & Collect.
*   Sitoo bookings can now export **line discounts as separate discount rows**, matching POS campaign presentation.

#### Order Management & Workflow

*   Order splitting workflows now support **OR-based matching**, allowing processing of order lines that match any of multiple categories or properties.
*   Added new **Consolidate shipments** workflow step, enabling automatic merging of shipments destined for the same warehouse and optionally the same shipping method or delivery address.
*   Click & Collect orders that skip multiple status steps now correctly execute **all intermediate workflow actions**, ensuring inventory and payment processing remains consistent.
*   Advanced export settings now allow export-specific properties and configuration options to be set directly when initiating order exports.
*   Added support for asynchronous order status updates through the `ExecuteWorkFlowAsync` option on the UpdateStatus API.

#### API & Integrations

*   Added scroll-based bulk extraction support to the Promotions API:
    *   `POST /api/Promotions/Search/Scroll`
    *   `GET /api/Promotions/Scroll/{id}`
*   Cart Checkout API now supports **selective validator execution**:
    *   Empty validator array disables validation
    *   Specific validator lists execute only selected validators
    *   Omitting validators executes all configured validators
*   Improved error reporting in `Orders/UpdateMany`, which now returns validation details when validation failures occur.
*   **Google Connector:** Performance improvements for XML feed generation.
*   **Sitoo Connector:** Added support for exporting discounts as separate discount lines.

#### Products & Purchase Orders

*   Added role-based permission control for **editing purchase order line cost prices**, enforced across both purchase order and goods reception workflows.
*   Pick lists now display **GTIN values**.
*   Product supplier panels now display **Supplier SKU IDs**.
*   Fixed pinned product behavior so pinned products are included alongside category and brand matches.

#### Analytics & Reporting

*   Fixed analytics calculations for API-imported orders, ensuring:
    *   Profit calculations
    *   Cost calculations
    *   Revenue totals are correctly indexed and reported.

#### Administration & Core Platform

*   Scheduled task editor now includes:
    *   Cron expression validation
    *   Human-readable schedule descriptions
    *   Visual schedule builder
*   Global store filter now supports searching by **store ID** in addition to store name.
*   GUI extensions triggered from detail pages now include record identifiers and types in webhook payloads.

| Type | Issue No | Domain | Description |
| --- | --- | --- | --- |
| Bugfix | #DEV-23183 | Core | Analytics order line sums (profit, totals, and costs) are now calculated correctly for orders imported via the API, which previously could be indexed with stale or uncalculated values. |
| Feature | #DEV-23170 | Core | Rental deposits are now posted to a dedicated deposit-liability account instead of being booked as sales revenue, and deposit refunds are correctly offset — producing balanced accounting entries for rental orders with deposits. |
| Feature | #DEV-23168 | Cart | The cart Checkout API now lets you opt out of validation by sending an empty validators array (\[\]). Omitting the field still runs all configured validators; sending specific validator names runs only those. |
| Feature | #DEV-23156 | Order management | Order-splitting workflows can now match order lines that are in any of several product categories, or that have any of several order-line properties — not just lines matching all of them. This makes it easier to route a broader set of lines to a chosen warehouse or shipment in a single step. |
| Feature | #DEV-23103 | Product | You can now control who is allowed to edit the cost price on purchase order lines. Grant or restrict the 'Purchase order edit line price' permission per role and it is enforced consistently across the purchase order and goods-reception screens. |
| Bugfix | #DEV-23100 | Order management | Orders/UpdateMany now returns a validation error message in the 500 response if that's the cause. This will later be changed to a 400 response. |
| Bugfix | #DEV-23096 | Core | Pinned products are now included in addition to the category/brand matches. |
| Feature | #DEV-23092 | Core | A new accounting setting lets you split the daily web-fulfillment postings per order type per store — e.g. separating online from click-and-collect sales — instead of producing a single combined posting per store. |
| Feature | #DEV-23086 | Shipment | You can now add a 'Consolidate shipments' step to order workflows. It merges shipments going to the same warehouse (and optionally the same shipping method or delivery address) into a single shipment, so orders split across workflow steps don't end up as unnecessary separate shipments. |
| Feature | #DEV-23071 | Api | The Promotions API now supports scroll-based bulk extraction. Use POST /api/Promotions/Search/Scroll to retrieve large promotion result sets in batches, then GET /api/Promotions/Scroll/{id} to fetch each subsequent batch until no scrollId is returned. |
| Feature | #DEV-23069 | Sitoo Connector | Sitoo bookings can now export line discounts as separate discount lines (matching how campaigns appear in Sitoo POS), enabled per market from the Sitoo settings. |
| Feature | #DEV-23068 | Core | Scheduled tasks now have an improved schedule editor: type a cron expression and instantly see a plain-language description with validation, or use the built-in fields (day of week, time of day, day of month, month) to build the schedule visually. |
| Feature | #DEV-23038 | Core | You can now find stores in the global store filter by typing the store ID, in addition to the store name. |
| Feature | #DEV-23035 | Order management | Click & Collect order status changes that skip ahead multiple steps (e.g. New → Picked up and paid) now correctly run the workflow steps for the intermediate statuses, so inventory and payment are processed as expected. |
| Feature | #DEV-23031 | Order management | When exporting an order, you can now open Advanced export settings to add properties to the export initiation and control what each export sends. Each exporter can offer its own configurable options, set directly in the export dialog. |
| Feature | #DEV-23023 | Product | Pick lists now show each item's GTIN, and the product page's Supplier panel now displays the Supplier SKU ID. |
| Feature | #DEV-22933 | Api | The order UpdateStatus API now supports asynchronous processing via a new ExecuteWorkFlowAsync option. When enabled, the request is queued and returns immediately without waiting for the order workflow to complete, giving faster responses for status updates. |
| Feature | #DEV-19992 | Google Connector | Performance optimizations on Google XML feeds. |

## Release 2026-23

Release date: Jun 23, 2026

### Main focus areas

This release focuses on improving price list reliability and product pricing synchronization, enhancing purchase order and inventory workflows, expanding order automation capabilities, and strengthening accounting, reporting, and customer service functionality. Several fixes also improve stability across integrations and inventory management.

### Key changes and improvements

#### Price Lists & Pricing

*   Products can now be automatically **enriched with active price list prices** when saved, ensuring pricing remains synchronized without requiring reactivation of the price list.
*   Force-activating a price list now updates **all products on the list**, including items already marked as active.
*   Added default configuration options for:
    *   Price list type
    *   Store cost pricing when creating new price lists and price list promotions.
*   Fixed an issue where activating a price list and subsequently saving a linked promotion could unintentionally remove generated prices.
*   Fixed patching behavior where updating only the unit price could create unintended discount values.

#### Purchase Orders & Inventory

*   Reorder suggestions now support suppliers managed through **strict assortment rules**, using assortment codes rather than supplier IDs.
*   Purchase order workflows using **Validate on errors** now stop only for actual errors, allowing processing to continue when warnings are present.
*   Inventory CSV imports now support updating:
    *   Inventory quantity
    *   Location
    *   Minimum quantity
    *   Maximum quantity using a unified import format.
*   Fixed an issue where adding products to purchase orders could generate incorrect inventory transactions and phantom inventory records.

#### Order Management & Automation

*   Added support for **property-based order line splitting**, allowing workflow actions to target order lines containing specific properties.
*   Shipment splitting workflows now support a **ShippingMethodName** property.
*   Markets can now define a **default store** that is automatically assigned to new carts when applicable.

#### Reporting & Accounting

*   Inventory transaction reporting now supports:
    *   Filtering by sales or purchase order references
    *   Exporting linked order numbers
    *   Exporting payment invoice references
*   Added accounting setting to defer **WebFulfillment revenue posting until payment capture**, improving financial reconciliation and revenue recognition accuracy.

#### Product Management

*   Rental products are now fully hidden from search results and APIs when the rental feature is disabled, ensuring consistent tenant behavior.

#### Customer Service & Cases

*   Added reusable **case reply templates**, allowing customer service teams to create standardized responses and insert them directly into case replies.

#### Integrations

*   **Sitoo connector:**
    *   Added support for automatically marking partially cancelled Click & Collect orders as ready for pickup once all remaining items have arrived.
    *   Added protection against concurrent product export jobs to improve synchronization reliability.

#### Users & Administration

*   New employees added to shared store users now receive an automatically generated PIN during onboarding, simplifying initial setup while maintaining individual PIN ownership and management.

| Type | Issue No | Domain | Description |
| --- | --- | --- | --- |
| Feature | #DEV-23019 | Product | Rental products are now hidden from product search and API responses when the rental feature is turned off in tenant settings; with it off, even explicit rental lookups return no products instead of unrelated non-rental items. |
| Bugfix | #DEV-23018 | Inventory | Fixed an issue where adding a product to a purchase order could create spurious zero-value "InventoryCount" transactions and phantom inventory records at warehouses that hold no stock. |
| Feature | #DEV-23014 | Sitoo Connector | Sitoo click & collect orders where items are cancelled after partial arrival can now automatically be marked as ready for pickup once all remaining items have arrived in store, via a new workflow action option. |
| Bugfix | #DEV-23011 | Purchase orders | Purchase order workflows with the "Validate on errors" step now proceed when an order only has warnings, halting only on actual errors. |
| Bugfix | #DEV-23001 | Users | When adding a new employee to a shared store user, Omnium now automatically generates a PIN code and shows it once after saving. The employee can change their PIN after first sign-in. Employees can still only see and edit their own PIN. |
| Feature | #DEV-22993 | Cart | Markets can now be configured with a default store. When set, new carts on that market automatically use this store - prioritized over the customer's stores and the default warehouse, while the user's own store selection still wins. |
| Feature | #DEV-22986 | Order management | The 'Try split unreserved order lines' workflow step now supports a new OrderLineHasProperties setting, letting you split out order lines that have a given property key, regardless of its value. |
| Feature | #DEV-22985 | Product | Products can now be automatically enriched with prices from active price lists when they are saved, without re-activating the list. This keeps newly added or updated products in sync with their price list prices, and restores price-list prices that were accidentally cleared. |
| Feature | #DEV-22976 | Sitoo Connector | Sitoo - We now prevent concurrent product export scheduled tasks |
| Feature | #DEV-22952 | Order management | The "Split order lines to be purchased to shipment" workflow step now supports a ShippingMethodName property |
| Bugfix | #DEV-22947 | Promotions | Fixed an issue where prices added by activating a price list could be removed shortly after when saving the linked price list promotion. |
| Feature | #DEV-22942 | Price list | Force-activating a price list now pushes prices to every product on the list, including items already marked as active. |
| Bugfix | #DEV-22939 | Price list | Patching a price list item with only a higher unit price no longer adds a phantom discount - the discounted price now correctly follows the new unit price. |
| Feature | #DEV-22931 | Inventory | The inventory CSV import now lets you choose which field to update - inventory quantity, location, minimum quantity, or maximum quantity - using the same skuId;warehouseCode;value format. |
| Feature | #DEV-22904 | Reports | Inventory transactions can now be filtered by order reference (sales order or purchase order) and exported with linked order number and payment invoice columns, making it easier to reconcile goods movements against your ERP without manual spreadsheet work. |
| Feature | #DEV-22898 | Charts and reporting | Added an accounting setting that holds web-fulfillment bookkeeping until an order is actually paid, so revenue is only posted once a real capture exists instead of when the order is fulfilled. |
| Feature | #DEV-22897 | Purchase orders | Reorder suggestions now honor the strict assortment setting, filtering by the supplier's assortment codes (instead of product supplier ID) so stores see the correct suggestions for suppliers managed via assortment. |
| Feature | #DEV-22893 | Price list | You can now set default values for the list type and store cost price under Price lists, which are automatically applied when creating new price lists and price list promotions. |
| Feature | #DEV-22891 | Cases | You can now create and manage reusable reply templates for cases from a new "Reply templates" tab under Cases, and insert them with one click when replying to a case. |

## Release 2026-22

Release date: Jun 16, 2026

### Main focus areas

This release focuses on improving purchase order planning and cost management, expanding price list capabilities, enhancing inventory and store administration workflows, and refining financial posting and promotion management. Several fixes also improve data integrity across pricing, promotions, and purchase order processes.

### Key changes and improvements

#### Purchase Orders

*   Purchase order product lists now display:
    *   Incoming stock quantities
    *   Quantity sold directly in the list view.
*   Reorder suggestions now account for **incoming purchase orders**, preventing over-ordering of stock already on the way.
*   Purchase order quantities and totals now reflect **cancelled units**, showing:
    *   Remaining quantity
    *   Original quantity (struck through)
    *   Cancelled quantity
*   Purchase orders now validate **minimum and maximum order amounts per supplier**, including products supplied by secondary suppliers.
*   Store cost pricing is now correctly applied when enabled for a market, prioritizing discounted store cost prices where applicable.

#### Price Lists & Cost Pricing

*   Price list item editor now displays:
    *   Profit amount
    *   Margin inline for all cost and price fields, including store cost pricing.
*   Added support for **Enrich mode** in Excel imports for price list items.
*   Products added to price lists now automatically inherit:
    *   Prices
    *   Costs
    *   Standard costs
    *   Store costs from the configured standard price list.
*   Store cost prices and store margins are now visible in price lists when store cost pricing is enabled.
*   Products added through campaigns now preserve their original cost currency.
*   Sticky column headers added to price list tables for improved navigation in large datasets.
*   Fixed API activation workflow to prevent unintended removal of existing promotion and original prices during price list item updates.

#### Promotions & Campaigns

*   Promotions no longer generate duplicate promotional prices when no actual discount is applied.
*   Price list promotions now disable campaign settings that are not applicable to the promotion type.
*   Various usability improvements and UI refinements across promotion and price list workflows.

#### Inventory & Product Management

*   Inventory maximum values can now be edited directly from the product inventory modal.
*   Cart product additions now preserve the tax rate defined on the product price instead of defaulting to the market tax rate.

#### Stores & Configuration

*   Added centralized management of **special opening hours** with:
    *   Global market-level administration
    *   Per-store overrides
*   Warehouse location code validation now supports flexible formats through regex-based validation.
*   Improved mass delete tool reliability and validation feedback.

#### Financials & Accounting

*   Payment methods can now be configured to post returns, VAT adjustments, and refunds back to the **original selling store**, supporting settlement models where transactions are owned by the source store.
*   Click & Collect returns processed at a different store within the same store group now:
    *   Book revenue adjustments against the original purchase store
    *   Automatically transfer goods cost between stores

#### Customer & API

*   Added `AddInternalComment` API endpoint for creating internal comments on private customer records.

| Type | Issue No | Domain | Description |
| --- | --- | --- | --- |
| Feature | #DEV-22880 | Product | The purchase order product list now shows incoming stock ('I bestilling') and quantity sold directly in the list, without opening the inventory dropdown. The reorder suggestion also accounts for incoming purchase orders, so suggested quantities reflect stock already on the way. |
| Feature | #DEV-22877 | Configuration | Fixed the mass delete tool so it no longer gets stuck on "processing" for small batches, and the confirmation count now correctly matches the number of IDs entered regardless of blank lines. |
| Feature | #DEV-22867 | Purchase orders | Purchase order quantity badges and totals now reflect cancelled units, showing the reduced quantity with the original struck through and the cancelled count, in both the purchase order list and order detail views. |
| Feature | #DEV-22866 | Price list | The price list item editor now shows profit amount and margin inline beneath each cost and price field — including store cost pricing — replacing the separate profitability panel for a clearer at-a-glance view. |
| Bugfix | #DEV-22836 | Price list | Fixed an issue where patching price list items through the API (with price list activation) could remove existing promotion and original prices from products and leave the items inactive; affected items are now activated reliably without affecting other prices. |
| Bugfix | #DEV-22834 | Purchase orders | Purchase orders now correctly use a price list's store cost price (preferring the store discounted cost price) when store cost price is enabled for the order's market |
| Feature | #DEV-22825 | Price list | Excel price list item imports now support "Enrich" |
| Feature | #DEV-22802 | Promotions | Minor price list and promotion UI fixes |
| Feature | #DEV-22801 | Core | Payment methods can now be set to book returns — including sales reversal, VAT and refund — to the original order's store instead of the return store, for providers that settle to the selling store. |
| Bugfix | #DEV-22800 | Promotions | Promotions no longer create duplicate, identical promotional prices when a promotion has no actual discount (0% or 0 amount) - only prices that apply a real discount are generated. |
| Feature | #DEV-22785 | Store | Click & collect orders returned at a different store within the same store group are now booked on the original purchase store, with an automatic goods-cost transfer between stores. |
| Feature | #DEV-22784 | Customer | New api endpoint for adding internal comment on private customer: AddInternalComment |
| Feature | #DEV-22783 | Price list | Adding products to a price list campaign from the standard price list now preserves each product's original cost currency, instead of overwriting it with the price list's default cost currency. |
| Feature | #DEV-22778 | Inventory | Adding support for editing inventory max value in product inventory modal. |
| Feature | #DEV-22765 | Promotions | Price list promotions now disable the campaign settings that don't apply to them |
| Feature | #DEV-22764 | Price list | Price lists with store cost pricing enabled now show the store cost price and store margin |
| Feature | #DEV-22763 | stores | Added global special opening hours management with per-store override capability, allowing bulk editing across markets while preserving individual store customizations |
| Feature | #DEV-22761 | Price list | When adding products to a price list, prices and costs, including standard cost and store cost, are now automatically copied from the tenant's configured standard price list. |
| Feature | #DEV-22760 | Cart | Products added to a cart from the Products tab now keep the tax rate defined on the product's price instead of falling back to the market default tax rate. |
| Bugfix | #DEV-22753 | Price list | Adding products to a price list promotion now carries over standard cost and store cost from the standard price list. |
| Feature | #DEV-22745 | Price list | Price list tables now keep their column headers pinned to the top while you scroll, so the column labels stay visible in long lists. |
| Feature | #DEV-22735 | Purchase orders | Purchase orders now check minimum and maximum order amounts per product supplier, not only the order's main supplier. |

## Release 2026-21

Release date: Jun 9, 2026

### Main focus areas

This release focuses on expanding price list management and reporting capabilities, improving promotion discoverability and administration, enhancing inventory and purchase order accuracy, and introducing new API and analytics functionality. Several usability and performance improvements have also been made across core platform components.

### Key changes and improvements

#### Price Lists & Pricing

*   Added **Full Export** functionality, allowing complete export of all price list item properties in a re-importable Excel format.
*   Price list item custom reports can now be generated directly from the price list editor, including tenant-specific custom properties.
*   Excel imports now automatically **backfill missing discount-related fields** from available values.
*   Store cost prices are now preserved when products are added or updated through promotion workflows.
*   Added **Wholesale (Grossist)** field to the price list item editor.
*   Administrators can now **force-deactivate stuck price lists** from the editor context menu.

#### Promotions & Campaigns

*   Promotions can now be searched by:
    *   Primary coupon code
    *   Additional coupon codes
*   Promotion calendar improvements include:
    *   Alternative views based on cost-price and store-cost-price validity dates
    *   Improved campaign grouping visualization
    *   Expand/collapse animations
    *   Better handling of single-day promotions
*   Promotion settings now support a **default rounding policy** that is automatically applied to new promotions.
*   Products affected by a price list promotion can now be viewed directly from the promotion.

#### Purchase Orders & Inventory

*   Purchase order product search now evaluates **in-stock availability based on the purchase order's selected store**, rather than any warehouse.
*   Warehouse location codes now support **flexible formats and lengths**, with validation driven entirely by configured regex rules.

#### Product Management

*   Added a new **required categories filter** that allows filtering products matching categories from multiple category groups simultaneously.
*   Fixed category tree search to correctly honor `excludedProductCategoryIds`, including tenants using product-based category parent relationships.

#### Reports & Analytics

*   ProductSales report now displays inventory values for the **selected store** rather than only the main warehouse.
*   Orders Analytics now displays:
    *   Unique order count
    *   Underlying order line count alongside search results.

#### API & Integrations

*   Added new `POST /api/PropertyOptions/Search` endpoint supporting:
    *   Paging
    *   ID filtering
    *   Group filtering
    *   Free-text search
    *   Date filtering
    *   Active/inactive filtering
*   GUI extension webhooks triggered from detail pages now include **record type and identifier metadata**.

#### Order Management & Returns

*   Added support for **tags on return orders** and tag-based filtering in return workflows.
*   Return creation now falls back to tenant settings when `IsStockUpdated` is not explicitly specified.
*   Improved shipment splitting logic to ensure **bundle/package components remain on the same shipment**.

#### Pricing Configuration

*   Added new **"Round down to nearest"** rounding strategy, allowing prices to always be rounded down to the nearest configured increment.

#### Core Platform

*   Improved version comparison tools with:
    *   Faster loading of large diffs
    *   Better context around changes
    *   Improved display of change-only views

| Type | Issue No | Domain | Description |
| --- | --- | --- | --- |
| Feature | #DEV-22733 | Purchase orders | Purchase order product search now scopes the "only in stock" filter to the order's store, so toggling in-stock shows products actually in stock at that store instead of any warehouse. |
| Feature | #DEV-22731 | Inventory | Warehouse location codes are no longer auto-formatted with separators based on the format example — the example now acts purely as a placeholder hint and the configured regex handles validation, so location codes of varying lengths (e.g. R501 and A6403) can be created. |
| Feature | #DEV-22730 | Product | Categories listed in excludedProductCategoryIds are now correctly excluded from the category tree search results, including for tenants that store category parents on products. |
| Feature | #DEV-22729 | Price list | Store cost price values are now preserved when adding or updating products in a price list through a promotion's Add products tab, instead of being reset to zero. |
| Feature | #DEV-22728 | Reports | The ProductSales report now shows inventory values for the selected store, not only the main warehouse. |
| Feature | #DEV-22711 | Promotions | Promotions can now be found by searching for their coupon code, including any additional coupon codes. |
| Feature | #DEV-22710 | Core | The version-list JSON comparison now shows the surrounding parent structure as context around each change, removes the small vertical gaps in "show changes only" mode, and loads large diffs noticeably faster. |
| Bugfix | #DEV-22709 | Core | GUI extensions triggered from a detail page (purchase order, delivery, cart, or pick list) now include the record's identifier and type in their event/webhook payload. |
| Bugfix | #DEV-22708 | Order management | TrySplitUnreservedOrderLinesToClosestZip - Prevent packages/bundles components from being split to different shipments. |
| Feature | #DEV-22707 | Api | New POST /api/PropertyOptions/Search endpoint with paging and filtering by Ids, Group, free-text Query, CreatedFrom/CreatedTo, and IsActive. Lets API consumers look up a property option by id and avoid the 10000-item cap on the existing GET endpoint. |
| Feature | #DEV-22679 | Product | Products page now has an additional required categories filter that lets you narrow results to products matching categories in both lists at once. |
| Feature | #DEV-22656 | Promotions | Promotion calendar: optionally view promotions by cost-price/store-cost-price dates, clearer campaign grouping with color-coded bars, expand/collapse animation, and readable labels for single-day promotions. |
| Feature | #DEV-22655 | Returns | Creating returns without specifying IsStockUpdated will now fallback to tenant settings |
| Feature | #DEV-22654 | Promotions | Promotion management settings now include a default rounding policy that is automatically pre-filled when creating new promotions. It can still be overridden per promotion. |
| Feature | #DEV-22653 | Prices | New "Round down to nearest" rounding option that always rounds prices down to the nearest configured step, giving customers the benefit of the rounding. Selectable in Rounding settings alongside "Round to nearest" and "Nice rounding". |
| Feature | #DEV-22621 | Price list | Added a new Grossist (Wholesale) column in the price list item edit modal |
| Feature | #DEV-22616 | Price list | Excel import for price list items now back-fills missing discount fields (cost discount %, discount %, discounted cost/price) from the values provided |
| Feature | #DEV-22614 | Price list | Admins can force-deactivate a stuck price list from the context menu on the price list edit page. |
| Feature | #DEV-22613 | Promotions | Products affected by a price list promotion can now be found via the promotion. |
| Feature | #DEV-22612 | Price list | Price lists: you can now create custom reports of the price list item type from the edit price list page, including any tenant-configured price-list custom properties as available columns. |
| Feature | #DEV-22611 | Price list | New "Full export" option in the price list editor that exports all price list item properties as a re-importable Excel file. |
| Feature | #DEV-22606 | Analytics | The Orders Analytics tab now shows the number of unique orders behind each search (with the order line count as a sub-text) |
| Feature | #DEV-22490 | Order management | Adding support for tags on returns and tag filters in return order workflow. |

## Release 2026-20

Release date: Jun 2, 2026

### Main focus areas

This release focuses on advanced pricing and analytics workflows, improved order automation, expanded reporting and tax support, and enhanced scalability for large datasets and enterprise configurations. The release also introduces improvements to campaign management, VAT handling, shipment integrations, and fulfillment performance.

### Key changes and improvements

#### Analytics & Reporting

*   Orders Analytics now includes:
    *   Revenue-over-time trend charts grouped by top dimensions (Brand, Store, SKU, etc.)
    *   Daily/monthly aggregation based on selected period
    *   Order count bar charts per group
*   Added new custom report type for **price list item exports** combining fields from both price lists and line items.

#### Price Lists & Pricing

*   Price list items now support three working modes:
    *   **List view**
    *   **Inline editable Form view**
    *   **Budget view** with planned sales volume and comments
*   Added advanced filtering on the price list edit page, including:
    *   Warnings
    *   Supplier
    *   Brand
    *   Price ranges
*   “Discounted price” field is now directly editable with automatic discount calculations.
*   Price list rows now correctly display:
    *   Configured cost currency
    *   Converted target currency
*   Added support for **per-product VAT rates**, with inheritance and tax-group override support.

#### Promotions & Campaigns

*   Fixed cost-price promotions incorrectly ignoring:
    *   Customer groups
    *   Customer IDs
    *   Customer club settings
    *   Coupon restrictions
    *   Tag conflict filters
*   Promotion save operations now surface **proper error feedback** on failure.
*   Customer club settings are now synchronized between promotions and connected price lists.
*   Fixed support for setting **cost validity dates** on price list promotions.
*   Campaign budget calculations now aggregate revenue from both promotions and price list items.
*   Fixed tag filtering consistency across campaign dashboard views.
*   Campaign detail popup now includes a functional **“Go to campaign”** link.

#### Order Management & Automation

*   Added automation for:
    *   Fully reserved orders
    *   Fully reserved and fully paid orders with due/no delivery date
*   Purchase order list now includes:
    *   Delivery count indicators
    *   Tri-state filtering for delivery assignment status

#### Projects & Returns

*   Claim project product lines now inherit:
    *   Cancellation codes
    *   Return type codes from originating return lines.

#### Product & Configuration

*   Custom property dropdowns now support:
    *   Search
    *   Lazy loading for improved handling of large datasets.
*   Property option groups now support paging for very large value sets (10k+ entries).

#### Performance

*   Improved performance for **WebFulfillment posting and preview generation**.

#### Shipment & Integrations

*   Added support for **nShift Checkout v2** with:
    *   Delivery option widget integration
    *   Pickup point support

| Type | Issue No | Domain | Description |
| --- | --- | --- | --- |
| Feature | #DEV-22607 | Analytics | Orders Analytics now includes a revenue-over-time trend chart with one line per top-20 group (Brand, Store, SKU, etc.) Daily granularity for date ranges up to ~60 days, monthly for longer ranges, plus a new bar chart showing the number of orders per group. |
| Feature | #DEV-22600 | Price list | Price list items can now be viewed in three modes via a toggle: List (existing), Form (inline editable fields for cost, price and discounts with a bulk-apply header), and Budget (planned sales volume + comment) |
| Feature | #DEV-22599 | Price list | Added advanced search on the price list edit page with collapsible filters for warnings, supplier, brand and price range, making it easier to drill into large price lists. |
| Feature | #DEV-22596 | Product | The custom property dropdown now supports search and lazy-loads more values as you scroll, making it usable with large property option groups. |
| Feature | #DEV-22591 | Purchase orders | Purchase order list now shows an icon with delivery count for orders that have one or more deliveries assigned, and a new tri-state filter lets you narrow the list to purchase orders with or without deliveries. |
| Feature | #DEV-22584 | Performance | Performance improvements to WebFulfillment posting and preview |
| Feature | #DEV-22581 | Core | Property option groups settings now supports paging — large groups (10k+ values) can be browsed in full |
| Feature | #DEV-22580 | Price list | Price list item edit modal: the "Discounted price" field is now editable, automatically calculating the discount and discount percentage |
| Bugfix | #DEV-22560 | Promotions | Saving a price list promotion now propagates the "Customer club" toggle to the connected price list, so prices on the list are correctly marked as customer club specific. |
| Feature | #DEV-22514 | Order management | New automation for orders fully reserved with purchase orders |
| Feature | #DEV-22509 | Order management | New order automation for fully reserved, fully paid and delivery date is due or not set |
| Feature | #DEV-22505 | Project | Claim projects: the cancellation-code dropdown on each product line in the customer-service view is now auto-populated from the originating return order line, alongside the existing return reason. |
| Feature | #DEV-22500 | Reports | A new custom report type for price list items is now available - define a custom export with fields from both the price list and its items |
| Bugfix | #DEV-22499 | Campaign | Campaign calendar: the campaign detail floater now shows a working "Go to campaign" link in its header. |
| Feature | #DEV-22498 | Campaign | Fixed tag filter not being applied to the Performance Overview and Charts Dashboard tabs on the Campaigns page. |
| Feature | #DEV-22482 | Product | Products now support a per-product VAT rate that prices inherit when the tenant hasn't configured tax groups. When tax groups are configured, both the tax group and a manual rate are editable on the product, and the accounting settings page now has the VAT rates in a separate tab. |
| Feature | #DEV-22478 | campaign | Campaign budget now sums planned revenue from both the promotion and its price list items, instead of one overriding the other. |
| Feature | #DEV-22477 | Project | Project product lines created from a return now include the return type code from the originating return order line |
| Bugfix | #DEV-22474 | Price list | Price list item rows now display the cost in the configured cost currency (e.g. EUR) with the converted price list currency (e.g. NOK) shown below, matching the edit modal. |
| Bugfix | #DEV-22473 | Promotions | Fixed a bug where setting cost price or store cost price validity dates on a price list promotion failed with an error. |
| Feature | #DEV-22472 | Promotions | Fixed CostPricePromotion ignoring customer group, customer id, customer club, coupon code and tag-conflict filters in the live cart promotion engine. Discounts were previously applied to all customers regardless of the promotion's customer restrictions. |
| Bugfix | #DEV-22471 | Promotions | Promotion edit page now shows an error message when saving fails, instead of leaving the loading dialog stuck on screen. |
| Feature | #DEV-22414 | Prices | Adds a tax-group chart with SAF-T / MVA-koder and a Z-report VAT settlement CSV export for ERPs |
| Feature | #DEV-22325 | Shipment | Added support for nShift Checkout v2 as a shipping provider, enabling delivery option selection via the nShift widget with pickup point support |

## Release 2026-19

Release date: May 27, 2026

### Main focus areas

This release focuses on deeper pricing and promotions flexibility, improved purchase order validation and allocation handling, enhanced project and returns synchronization, and expanded analytics and reporting capabilities. The release also includes multiple usability and data consistency improvements across supplier, inventory, and tenant configuration areas.

### Key changes and improvements

#### Projects & Returns

*   Claim projects can now **synchronize linked returns automatically**, updating matching return lines when project product lines are changed.
*   Claim projects created from returns now include **return reasons** on project product references.
*   Projects created from orders, returns, or purchase orders now retain **originating order or purchase order references** on product lines for improved traceability.

#### Price Lists & Cost Pricing

*   Price list items now support:
    *   **Per-item cost currency and exchange rate overrides**
    *   **Direct editing of discounted cost and store discounted cost**
    *   **Custom properties** with configurable defaults and dedicated properties editor
*   Added support for **separate validity periods** for:
    *   Cost prices
    *   Store cost prices
*   Price list validation workflow improved with:
    *   Proper validation iconography
    *   Automatic bypass when no validators are configured
    *   Improved user feedback
*   Editing deleted-product price list items no longer triggers erroneous “Not found” notifications.
*   Store margin calculations now consistently use **prices excluding VAT**.

#### Promotions

*   Price list promotions now display **cost information** in the Add Products view.
*   Added support for using **store cost price instead of supplier cost price** in cost-price promotions.
*   Editing prices in promotion product lists now preserves the **exact entered value**.
*   Added two new promotion-focused custom report types:
    *   Promotion summary report
    *   Promotion product eligibility report

#### Purchase Orders

*   Purchase orders linked to cost price lists now validate that the **delivery date falls within the valid price period**.
*   Added market-specific setting to **prevent allocations to internal order lines**.
*   ATP calculations now include **SKUs from deleted order lines**.
*   Redesigned product sales list with a **more compact layout**.
*   Fixed issue where filtering purchase orders by order type could trigger search errors.

#### Inventory & Product UI

*   Product list and cart product list now use a **merged price and inventory column** with responsive store label handling.

#### Analytics & Reporting

*   Added new **Insights API endpoints** for aggregated daily KPI retrieval.
*   Introduced generic **accounting export functionality** with:
    *   Configurable chart of accounts
    *   Per-store overrides
    *   Excel export support from Payments

#### Supplier

*   Improved supplier search behavior for short-text queries.
*   Renaming suppliers now automatically updates **linked product supplier names** asynchronously.

#### Tenant Settings & Configuration

*   Property option groups can now allow **inline creation of dropdown values**.
*   Market settings UI improved with support for **default payment methods**.
*   Rounding policy editor now hides irrelevant fields and provides fallback labels when display names are missing.

| Type | Issue No | Domain | Description |
| --- | --- | --- | --- |
| Feature | #DEV-22437 | Project | Claim projects can now keep linked returns in sync: changing a product line on the project automatically adjusts the matching return line |
| Feature | #DEV-22436 | Price list | Price list items can now override the cost currency and exchange rate per item. Exchange rates are auto-fetched when only the currency is provided. |
| Feature | #DEV-22435 | Promotions | Editing the Price column on a price list promotion's Add products tab now keeps the value you enter exactly |
| Feature | #DEV-22434 | Inventory | The price and inventory columns in the product list and cart product list are now merged into a single column. In very narrow side panels the store names auto-hide so the badges still fit. |
| Bugfix | #DEV-22433 | Price list | Butikkmargin% på prislisteelement beregnes nå mot pris eks. mva (matcher leverandørmargin). |
| Feature | #DEV-22432 | Price list | Editing a price list item no longer shows a "Not found" toast when the linked product has been deleted from Omnium |
| Feature | #DEV-22431 | Promotions | Price list promotions now show cost in the Add products tab, sourced from a configurable source price list on the promotion |
| Feature | #DEV-22429 | Purchase orders | Purchase orders linked to a cost price list are now validated to ensure the requested delivery date falls within the price list's valid period |
| Feature | #DEV-22428 | Promotions | Two new custom report types for promotions: a promotion list (one row per promotion) and a promotion product list (one row per eligible product, using the same algorithm as the promotion processors) |
| Bugfix | #DEV-22427 | Core | Rounding policy editor disables irrelevant fields, and policy selector have text fallback if displayname is not given |
| Feature | #DEV-22426 | Product | Price list items can now be edited by entering Discounted cost or Store discounted cost directly |
| Feature | #DEV-22424 | Analytics | Added new Insights endpoints that let analytics partners fetch aggregated daily KPIs |
| Bugfix | #DEV-22394 | Purchase orders | Redesigned the product sales list (used in both the Products tab and the Purchase Order Products view) with a more compact layout |
| Feature | #DEV-22393 | Tenantsettings | Property option groups can now be configured to let users add new dropdown values inline |
| Feature | #DEV-22380 | Price list | Price list Validate now uses a proper icon, skips the validation queue when no validators are configured, and informs the user that no validation will be performed |
| Bugfix | #DEV-22374 | Purchase orders | Fixed the order type filter on the Purchase Orders list, which previously caused searches to fail with an error when an order type was selected. |
| Feature | #DEV-22350 | Price list | Price lists and promotions now support separate validity dates for cost prices and store cost prices |
| Feature | #DEV-22323 | Project | Claim projects created from returns now include the return reason from each return order line on the project product reference |
| Feature | #DEV-22318 | Project | Projects created from orders, returns, or purchase orders now include the originating order ID or purchase order ID on each product reference |
| Feature | #DEV-22317 | Supplier | Fixed supplier search returning all suppliers when searching for short text |
| Feature | #DEV-22316 | Supplier | Renaming a supplier now automatically updates the supplierName on all linked products in the background |
| Feature | #DEV-22315 | Tenantsettings | Market settings UI improvements, and adding default payment method |
| Feature | #DEV-22312 | Purchase orders | New setting for preventing allocations to internal order lines that can be set per market. |
| Bugfix | #DEV-22307 | Purchase orders | ATP calculations now include SKUs from deleted lines |
| Feature | #DEV-22282 | Price list | Price list items now support custom properties with a dedicated Properties tab on the edit modal and configurable default properties in tenant settings |
| Feature | #DEV-22280 | Promotions | Cost price promotions now support an option to use the store cost price instead of the supplier cost price from the price list, configurable via a new toggle in the promotion settings. |
| Feature | #DEV-22161 | Reports | Adds a generic accounting export feature: tenants can now configure a chart of accounts (with per-store override) and pull two new Excel custom reports from the Payments page |

## Release 2026-18

Release date: May 19, 2026

### Main focus areas

This release focuses on improving purchase order accuracy and visibility, expanding event and reporting capabilities, enhancing promotion flexibility, and introducing new configuration and payment functionality.

### Key changes and improvements

#### Purchase Orders

*   Product list purchase order column now shows **store-specific quantities** instead of aggregated totals.
*   Supplier package quantity (**D-pak**) is now visible in:
    *   Product lists
    *   “Add to Purchase Order” modal
*   Added validation to prevent **purchase order lines with zero quantity** from being submitted.
*   Purchase order notifications now support **tag-based filtering**.

#### Projects & Returns

*   Added `DeliveredQuantity` and `CanceledQuantity` fields to project product lines with editable detail panel support.
*   Projects created from orders, returns, or purchase orders now retain **originating order or purchase order references** on product lines for improved traceability.
*   Return status assignment now respects **Condition and shipment delivery type**, enabling more accurate initial return statuses.

#### Promotions

*   Added support for **customer-specific promotions**.
*   Promotions list now supports **sortable column headers**.

#### Events & Reporting

*   Event subscriptions can now be filtered using **custom properties**.
*   Inventory count operations are now **logged as events**.
*   Fixed grouped order analytics so the **“Missing” row correctly isolates records without grouping values**.

#### Inventory & Cart

*   `AddItemToCart` API now supports specifying **fulfillment warehouse per line item**.

#### Payments & Integrations

*   Added new payment provider supporting **capture and credit against B2B customer credit balances**.
*   **Tripletex connector:** Added support for **VAT code mapping per category**.

#### Configuration

*   Added **Property Option Groups** tenant setting for managing reusable dropdown option lists.

| Type | Issue No | Domain | Description |
| --- | --- | --- | --- |
| Feature | #DEV-22313 | Reports | Fixed the "Missing" row in grouped order analytics so it now correctly shows only order lines without a value for the selected grouping property, instead of returning all order lines |
| Feature | #DEV-22258 | Events | Event subscriptions can now be filtered by custom properties |
| Feature | #DEV-22229 | Project | Added DeliveredQuantity and CanceledQuantity fields to project product lines, editable via an expandable details panel |
| Feature | #DEV-22221 | Purchase orders | The "Purchase Orders" column on the product list now correctly shows quantities for the selected store only, instead of showing totals across all stores. |
| Feature | #DEV-22212 | Purchase orders | Supplier package quantity (D-pak) is now visible in product list views and in the "Add to Purchase Order" modal |
| Bugfix | #DEV-22186 | Purchase orders | Purchase orders can now be validated to ensure no order lines have a quantity of zero, preventing invalid lines from being submitted to suppliers. |
| Feature | #DEV-22166 | Returns | Return status assignment now respects the Condition field, automatically selecting the correct initial status based on the order's shipment delivery type (e.g. Pickup vs Delivery). |
| Feature | #DEV-22158 | Configuration | Added Property Option Groups: a new tenant-settings section where admins can manage reusable dropdown value lists |
| Bugfix | #DEV-22135 | Tripletex Connector | Adding support for specifying TripleTex VAT-code per category in Omnium. |
| Feature | #DEV-22110 | Inventory | Events are now logged for inventory count |
| Bugfix | #DEV-22052 | Promotions | Adding support for customer specific promotions. |
| Feature | #DEV-22005 | Purchase orders | Purchase order notifications now supports tags filter. |
| Feature | #DEV-21937 | Cart | Adding support for specifying line item fulfillment warehouse in API-endpoint AddItemToCart. |
| Feature | #DEV-21886 | Payments | Adding new payment provider for capturing and crediting towards B2B-customer credit balance. |
| Feature | #DEV-21672 | Promotions | Sortable column headers on the Promotions list |
| Feature | #DEV-22318 | Project | Projects created from orders, returns, or purchase orders now include the originating order ID or purchase order ID on each product reference |

## Release 2026-17

Release date: May 12, 2026

### Main focus areas

This release focuses on improving data consistency and concurrency handling, enhancing purchase order workflows, and expanding API capabilities for product and pricing operations. It also introduces incremental improvements to filtering, traceability, and payment flexibility.

### Key changes and improvements

#### Purchase Orders

*   “Add to purchase order” picker now **excludes POs in confirmed states**, reducing invalid selections.
*   Purchase order lines created via split now show **reference to originating line** in both editor and overview.
*   Added **tag-based filtering** in purchase order list for improved search and organization.

#### Workflow & Data Integrity

*   Project mutation endpoints are now protected by a **distributed lock**, preventing race conditions and lost updates during concurrent modifications.

#### Product & Pricing API

*   Added `GetNextProductNumber` endpoint for retrieving the **next available product number** from configured generators.
*   Product patch-many endpoint now supports **non-destructive updates to price lists**, preserving existing data during partial updates.

#### Payments

*   **Walley integration:** Added support for **extending payment authorization periods**.

| Type | Issue No | Domain | Description |
| --- | --- | --- | --- |
| Feature | #DEV-22160 | Purchase orders | Purchase order picker - "Add to purchase order" no longer lists POs in confirmed statuses |
| Feature | #DEV-22086 | Purchase orders | Purchase order lines split from another line now display the originating line in the editor and on the line overview |
| Feature | #DEV-22082 | Project | Project mutation endpoints are now protected by a distributed lock, preventing lost updates when multiple users or integrations modify the same project concurrently |
| Feature | #DEV-22068 | Payment integration | Walley: Added support for extending payment authorization time |
| Feature | #DEV-22035 | Purchase orders | Added a tag filter to the purchase order list, allowing users to narrow down purchase orders by their assigned tags. |
| Feature | #DEV-22030 | Product | Added GetNextProductNumber endpoint to retrieve the next product number from the configured number generator |
| Feature | #DEV-22022 | Price list | Campaign price list validation |
| Feature | #DEV-21722 | Product | Adding support for non-destructive patching of price list in product patch many enpoint. |

## Release 2026-16

Release date: May 5, 2026

### Main focus areas

This release focuses on expanding promotions and campaign management capabilities, improving integration flexibility, enhancing order and inventory control, and refining usability across pricing, product, and configuration areas.

### Key changes and improvements

#### Promotions & Campaigns

*   Added **Active/Inactive filter** and improved navigation state retention in promotions list.
*   Campaigns now support:
    *   **Tagging and filtering by tags**
    *   **Per-status scheduling with automatic workflow execution**
*   Introduced tenant setting to **hide promotions/campaigns by tag** in calendar view.
*   Promotions can now **force price generation** even with coupon or order restrictions.
*   Added support for **seeding price lists from existing ones**, with optional promotion creation.
*   Price list items now support **Standard Cost**.

#### Order Management & Purchase Flow

*   New scheduled task for **automatic removal of over-reservations**.
*   Added support for **generic order pickup reminders** across all order types.
*   New public API endpoint to **search sales orders linked to purchase order line reservations**.

#### Product & Pricing

*   Product price details UI improved with **store names, customer/group links, and richer price list context**.

#### Integrations

*   **Front Systems connector:** Inventory exports can now be **restricted to specific stores** via configuration.
*   **Tripletex connector:** Added option to **use prices excluding VAT on invoices**.
*   **Sitoo integration:** Added support for **including/excluding promotion prices**.

#### Payments

*   Nets Easy Paylink now supports **custom payment amounts**.

#### Configuration & Tenant Settings

*   Added **validator management popup** in connector settings.
*   Fixed critical issue where **invalid routing path (full URL)** could prevent system loading.

#### Projects

*   Added **"Hide Returns" toggle** per project type to control visibility of Returns tab in claim workflows.

| Type | Issue No | Domain | Description |
| --- | --- | --- | --- |
| Feature | #DEV-22025 | Project | Project types now have a "Hide Returns" toggle, allowing the Returns tab to be hidden on Claim projects per project type. |
| Feature | #DEV-22024 | Promotions | Promotions list now has an Active/Inactive filter and preserves search state when navigating back from a promotion's details |
| Feature | #DEV-21954 | Front Systems Connector | Front Systems inventory exports can now be restricted to specific stores via the new AllowAllInventoryUpdatesForStoreIds connector setting - warehouses not in the list will only receive inventory updates originating from manual inventory API endpoints. |
| Feature | #DEV-21952 | Configuration | Fixed an issue where entering a full URL in a routing item's Path field would prevent Omnium from loading |
| Feature | #DEV-21951 | Payment integration | You can now add a custom amount when creating a NetsEasy Paylink |
| Feature | #DEV-21921 | Purchase orders | Added a public API endpoint that allows API consumers to search for sales orders with inventory reservations linked to a specific purchase order line item |
| Feature | #DEV-21911 | Tenantsettings | New popup for adding validators in connector settings. |
| Feature | #DEV-21885 | Tripletex Connector | New setting in tripletex connector for using prices excluding VAT on invoices. |
| Feature | #DEV-21877 | Promotions | Added a tenant setting to hide promotions and campaigns with specific tags from the promotion calendar by default |
| Feature | #DEV-21876 | Promotions | Campaigns can now be tagged from the edit modal and filtered by tag on the list page |
| Feature | #DEV-21875 | Promotions | Campaigns now have a per-status date timeline that auto-transitions the campaign (running its workflow) when a scheduled date arrives |
| Feature | #DEV-21874 | Promotions | Price list items now support an optional Standard Cost |
| Feature | #DEV-21873 | Promotions | Promotions can now be configured to force-generate prices even with coupon codes or order type restrictions |
| Feature | #DEV-21872 | Promotions | Users can now seed a new price list from a chosen source "original" price list and optionally create its linked price list promotion in one step |
| Feature | #DEV-21855 | Order management | New sheduled task for removing overreservations |
| Feature | #DEV-21852 | Product | Product price details now display store names, customer/customer group links, and improved price list information instead of basic badges for better clarity. |
| Feature | #DEV-21711 | Order management | Adding support for generic order pickup reminders for all order types. |
| Feature | #DEV-21161 | Price list | Exclude/Include promotion prices flag is enabled in Sitoo integration. |

## Release 2026-15

Release date: Apr 28, 2026

### Main focus areas

This release focuses on strengthening workflow governance and performance, improving inventory visibility and purchase order usability, and expanding API and event capabilities. It also introduces targeted enhancements across product filtering, pricing workflows, and integrations.

### Key changes and improvements

#### Product & Supplier

*   Supplier details page now consolidates **all editable supplier data** in a single view.
*   Product list enhanced with **Promotions filter** for narrowing results based on one or multiple promotions.
*   Fixed issue in `GetCategoryTreeBySearch` API to ensure **correct category filtering**.

#### Inventory

*   Added **central warehouse store pinning**, allowing selected stores to always appear in inventory views regardless of active filters.

#### Purchase Orders

*   Purchase order lines now support **sorting by delivery ID**, including:
    *   Dedicated delivery column
    *   Consistent null value handling
    *   Improved visual clarity for selected and delivered rows

#### Workflow & Access Control

*   Introduced **role-based access control for workflow steps**, enabling restriction of status transitions by user roles.
*   Improved **order processing performance**.

#### API & Events

*   Added **Export cart API endpoint** to trigger cart exports programmatically.
*   Event subscriptions now support **custom include/exclude user filters**.
*   Price list item deletions from the UI are now **captured in the event log**.

#### Price Lists

*   Enabled **direct editing of discount percentage**, allowing percentage-based input in addition to absolute values.

#### Integrations

*   **Sitoo connector:** Promotion names now use **market-specific translations**, improving localization in POS.

#### Pick & Pack

*   Added support for **custom print templates** for pick lists.

| Type | Issue No | Domain | Description |
| --- | --- | --- | --- |
| Feature | #DEV-21870 | Supplier | The supplier Details page now surfaces all editable supplier information |
| Feature | #DEV-21869 | Product | Product list now has a Promotions filter under More filters that lets you search and select one or more promotions to narrow the list to products priced under any of them. |
| Feature | #DEV-21867 | Inventory | A new Store IDs for central warehouses setting lets administrators pin specific stores whose inventory is always displayed as extra rows under the main inventory badge in product lists, regardless of the selected store filter. |
| Feature | #DEV-21866 | Project | Projects: workflow steps now support role-based access control, letting administrators restrict specific status transitions to users in selected roles. |
| Feature | #DEV-21865 | Purchase orders | Purchase order lines can now be sorted by delivery ID, with the delivery shown in its own column, null values consistently grouped when sorting, and improved color contrast for selected and delivered lines. |
| Feature | #DEV-21806 | Sitoo Connector | New Export cart endpoint to trigger cart export through the api |
| Feature | #DEV-21801 | Price list | Price list item deletions made from the GUI are now recorded in the event log. |
| Feature | #DEV-21789 | Events | Event subscription: Setting custom users in eclude/include list in filter. |
| Bugfix | #DEV-21784 | Price list | The discount percentage field on price list items is now editable, allowing users to set a discount by entering a percentage directly instead of only entering an absolute discount amount. |
| Feature | #DEV-21635 | Sitoo Connector | Promotion names synced to Sitoo now use the market-specific translation title when available, ensuring POS staff see the correct localized name for each promotion. |
| Bugfix | #DEV-21554 | Product | Fixed the GetCategoryTreeBySearch endpoint to correctly filter the returned category tree, when using productCategoryIds or exclucedProductCategoryIds |
| Feature | #DEV-20866 | Pick list | Add option to add print custom templates for pick lists |
| Feature | #DEV-20455 | Workflow | Improved performance for order-processing. |

## Release 2026-14

Release date: Apr 21, 2026

### Main focus areas

This release enhances product and pricing workflows, improves purchase order flexibility and inventory visibility, introduces new workflow capabilities, and adds usability improvements across reports, campaigns, and integrations.

### Key changes and improvements

#### Product

*   Added **MainCategoryUpdate event** for product POST/PATCH (separate create vs update events).
*   Added **search in product category selector tree**.
*   Improved **unit price editing** in enrichment view to keep original price in sync.
*   Fixed issue where **variant-specific prices were lost when merging variants**.

#### Price lists & Prices

*   Fixed issue when creating price lists from promotions to correctly include **market group**.
*   Improved **price list column visibility menu** with consistent context menu and checkmarks.
*   Added support for **searching products by productId** when adding to price lists.
*   Fixed JS exception when editing prices before store data loaded.

#### Purchase orders

*   Purchase orders can now be **merged**.
*   Supplier min/max order validations now appear as **warnings instead of errors**.
*   Products tab now shows **inventory per selected warehouse** instead of total.

#### Inventory

*   Inventory popup now supports:
    *   **Sort by distance**
    *   **In-stock filtering**
    *   **Paginated list/search toggle**

#### Workflow & API

*   New workflow step: **Add product to order** (by SKU).
*   New API endpoint for **testing workflow execution on external carts** (no persistence required).

#### Promotions & Campaigns

*   Campaign overview now includes **performance overview and charts**.
*   Promotions now support **per-market translations** for name and description.
*   Improved **promotion search** with partial/wildcard matching.

#### Reports

*   Fixed Excel export so **formulas work correctly** across all report types.

#### Tenant settings & UI

*   GUI extension descriptions now support **rich HTML editing**.

#### Cost prices

*   New setting to **hide cost prices in product list views**.

#### Connectors

*   **Sitoo:** Returns now display seller name in return details.
*   **Tripletex:** Session tokens are now generated automatically when configured.

| Type | Issue No | Domain | Description |
| --- | --- | --- | --- |
| Bugfix | #DEV-21751 | Sitoo Connector | Returns now display the seller's name on the return details panel, mapped automatically from Sitoo POS or assignable manually via the seller selector. |
| Bugfix | #DEV-21746 | Price list | Fixed price list creation from promotions to transfer the promotion's market group to the newly created price list |
| Feature | #DEV-21724 | Product | Added event for MainCategoryUpdate when using PATCH and POST product endpoints (operation id 140113). POST endpoint now triggers separate events for create vs update. |
| Bugfix | #DEV-21717 | Product | Variant specific prices on product level are now kept when merging variants. |
| Feature | #DEV-21716 | Product | Added a search field to the product category selector tree |
| Bugfix | #DEV-21715 | Prices | Fixed an js exception that occurred when editing prices in the product price table before store data had finished loading |
| Feature | #DEV-21692 | Product | When editing a product's unit price in the enrichment view, the original unit price is now automatically kept in sync — matching the same behavior as standard price editing. |
| Feature | #DEV-21671 | Tenantsettings | GUI extension descriptions now support rich HTML editing via a toggle in the settings editor |
| Feature | #DEV-21669 | Purchase orders | Supplier minimum and maximum order amount validations on purchase orders now appear as warnings instead of errors |
| Feature | #DEV-21668 | Inventory | Added sort-by-distance, in-stock filtering, and a paginated list/search view toggle to the inventory popup on product pages |
| Feature | #DEV-21666 | Purchase orders | The Products tab in Purchase Orders now shows inventory for the selected warehouse instead of total inventory across all stores |
| Feature | #DEV-21665 | Cost Prices | New product setting "Hide cost prices in list views" allows administrators to hide the cost price column from product lists |
| Feature | #DEV-21660 | Workflow | Added a new "Add product to order" workflow step that automatically adds a configured product (by SKU ID) to an order |
| Bugfix | #DEV-21655 | Promotions | Promotion search now supports partial/wildcard matching |
| Feature | #DEV-21652 | Workflow | Added a new API endpoint that allows testing workflow execution on externally posted carts without requiring them to be stored in Omnium |
| Feature | #DEV-21651 | Reports | Fixed Excel formula support in custom report exports so that formulas now correctly appear across all report types. |
| Feature | #DEV-21645 | Price list | The price list column visibility menu now uses a consistent context menu with checkmark indicators for toggled columns |
| Feature | #DEV-21644 | Tripletex Connector | Session tokens for Tripletex are now generated automatically when an EmployeeToken connector property is configured, removing the need to manually exchange tokens via external tools. |
| Feature | #DEV-21630 | Purchase orders | Purchase orders can now be merged from one purchase order into another |
| Feature | #DEV-21447 | Price list | Added support for searching products by productId when adding products to a price list, with an option to include an explicit price per product. |
| Feature | #DEV-21425 | Promotions | Campaign overview now features Performance Overview, and Charts |
| Feature | #DEV-20776 | Promotions | Promotions now support per-market name and description translations. |

## Release 2026-13

Release date: Apr 14, 2026

### Main focus areas

This release enhances collaboration in campaigns, improves reporting accuracy, introduces warehouse location management, and adds usability improvements across purchase orders, pricing, and customer filtering.

### Key changes and improvements

#### Promotions

*   Campaigns now support **internal comments**, enabling collaboration, notes, and notifications directly on campaign pages.

#### Inventory

*   Introduced **warehouse location management**, allowing:
    *   Tracking stock at specific physical locations
    *   Transfers between locations
    *   Default picking locations
    *   Validation of fulfillment availability per location

#### Reports

*   Product sales report now includes **inventory value for products with zero sales**.
*   Fixed issue where sales data could be **silently truncated**.

#### Price lists & Prices

*   Price lists now support **inline editing of profit margins**.
*   Product price edits via enrichment list now correctly update the **modified date**.

#### Purchase orders

*   Copying purchase orders now allows:
    *   Selecting **status** for the new copy
    *   Choosing whether to **run workflow**
*   Suppliers can now have **assortment codes** to filter product selection.

#### Customer

*   Added **consent type filtering** for private and business customer lists.

#### Project

*   Projects can now be configured to **allow editing without a contact person**.

#### Tenant settings & UI

*   External iframe pages now receive the **current user object on load**.
*   SMS client settings can now be configured per **market group, market, and store**, with inheritance support.

#### Categories

*   Category creation via scheduled tasks now triggers a **CategoryBatchAddFromScheduledTask event**.

#### Product

*   Fixed filtering in **GetCategoryTreeBySearch** endpoint for included/excluded category IDs.

| Type | Issue No | Domain | Description |
| --- | --- | --- | --- |
| Feature | #DEV-21642 | Promotions | Campaigns now support internal comments, allowing employees to add notes, send notifications, and collaborate directly on campaign pages. |
| Feature | #DEV-21641 | Tenantsettings | External iframe pages now receive the current user object on load |
| Feature | #DEV-21640 | Reports | The product sales report now includes inventory value for products with zero sales and correctly fetches sales data for all product lines without silently truncating results |
| Feature | #DEV-21632 | Prices | When editing a product price via the enrichment list, the price's modified date is now correctly updated to reflect the actual change. |
| Feature | #DEV-21626 | Project | Projects can now be configured to allow editing without requiring a contact person |
| Feature | #DEV-21623 | Purchase orders | When copying a purchase order, users can now select the status for the new copy and choose whether to run the workflow |
| Feature | #DEV-21584 | Customer | Added consent type filtering to private and business customer lists. |
| Feature | #DEV-21579 | Purchase orders | Suppliers can now be configured with assortment codes, which automatically filter the product list when adding items to purchase orders |
| Feature | #DEV-21573 | Price list | Price lists now allow inline editing of profit margin |
| Feature | #DEV-21571 | Categories | Categories created through CreateCategoriesFromBrandScheduledTask or CreateCategoriesFromSeasonScheduledTask noew raise CategoryBatchAddFromScheduledTask event with operation id 398110 . |
| Bugfix | #DEV-21554 | Product | Fixed the GetCategoryTreeBySearch endpoint to correctly filter the returned category tree, when using productCategoryIds or exclucedProductCategoryIds |
| Feature | #DEV-21168 | Notifcation | SMS client settings can now be configured per market group, market, and store, with automatic inheritance from parent levels when no specific configuration is set. |
| Feature | #DEV-21160 | Inventory | Added warehouse location management for inventory, allowing users to track stock at specific physical locations within warehouses, transfer quantities between locations, set default picking locations, and validate order fulfillment availability per location |

## Release 2026-12

Release date: Apr 8, 2026

### Main focus areas

This release enhances inventory and reporting accuracy, expands campaign and promotion management via API, improves purchase order and return workflows, and introduces UI, configuration, and Excel handling improvements.

### Key changes and improvements

#### Inventory

*   Added **ATP enrichment endpoint** to the Public Inventory API.

#### Reports & Analytics

*   Products without a main category now correctly appear in **category-based report filters**.

#### Promotions & Campaigns

*   Campaigns can now be **managed via the public API**.
*   Campaigns now support **fully configurable statuses with workflow execution**.
*   Fixed issue where copying promotions retained external IDs, which could cause conflicts.

#### Orders & Returns

*   Cost tab now separates **product profit from shipping charges**.
*   Return highlighted properties are now visible in:
    *   Returns tab on orders
    *   Return details sidebar
*   Pick list deviations now support **“Reallocate”**, splitting cancelled lines into new shipments routed to another warehouse.

#### Purchase orders & Projects

*   Purchase orders now support creating **claim projects directly from selected line items**.

#### Price lists & Prices

*   Price list items now include **highlighted product custom properties**.
*   PATCH price list items endpoint now supports `enrichWithProductData`.
*   `IsPriceLocked` added to indicate whether a price can be changed, with order lines enriched from product data.

#### Configuration & UI

*   Navigation items with external URLs now support **dynamic placeholders**.
*   Global search now includes **purchase orders** (by number, supplier, reference, or email).
*   New GUI extension areas added for:
    *   Product Edit
    *   Supplier
    *   Private & Business Customer pages
    *   Product list context menu
*   Improved webhook-only extensions with direct execution via confirmation dialog.
*   Fixed tag selection causing JavaScript errors in multiple editors.

#### Excel import/export

*   Fixed issue where large exports could produce **corrupt files**.
*   Added support for importing **nullable integer properties**.

| Type | Issue No | Domain | Description |
| --- | --- | --- | --- |
| Feature | #DEV-21523 | Inventory | ATP Enrichment Endpoint for Public Inventory API |
| Bugfix | #DEV-21512 | Reports | Products without a main category set now correctly appear in category-based report filters in analytics |
| Feature | #DEV-21508 | Promotions | Campaigns can now be managed via the public API |
| Bugfix | #DEV-21479 | Tenantsettings | Bugfix where selecting tags in the tags dropdowns on workflow step, order status, and purchase order status editors would cause a JavaScript error. |
| Feature | #DEV-21477 | Project | Purchase orders now support creating claim projects directly from selected line items |
| Feature | #DEV-21476 | Price list | Price list items now include highlighted product custom properties on the product sub-object |
| Feature | #DEV-21475 | orders | The Cost tab on orders and carts now separates product profit from shipping charges |
| Feature | #DEV-21474 | Returns | Return highlighted properties are now also displayed on the Returns tab when viewing an order and in the Return details sidebar when viewing a single return. |
| Feature | #DEV-21473 | Configuration | Navigation items with external URLs now support dynamic placeholders |
| Feature | #DEV-21455 | Excel import/export | Fixed an issue where certain large Excel exports (e.g. products with sales data) could produce corrupt files containing encoded text instead of valid spreadsheet data. |
| Bugfix | #DEV-21446 | Promotions | Copy promotion now remove external id's to prevent conflict with external systems |
| Feature | #DEV-21445 | Gui | Added new GUI extension tab areas for Product Edit, Supplier, Private Customer, and Business Customer pages, a context menu extension area on product list details, and improved webhook-only extensions to trigger directly with a confirmation dialog instead of showing an empty modal |
| Bugfix | #DEV-21442 | Excel import/export | Added support for importing nullable int properties (e.g. Asset.SortOrder) via Excel import. |
| Feature | #DEV-21437 | Price list | The PATCH price list items endpoint now supports an optional enrichWithProductData query parameter |
| Feature | #DEV-21336 | Pick list | Pick list deviations now support "Reallocate" — cancelled order lines are split into a new shipment and routed to another warehouse instead of being fully cancelled. |
| Feature | #DEV-21209 | Prices | Adds boolean IsPriceLocked to indicate if price can be changed. OrderLine is enriched from product data when item is added to cart. |
| Feature | #DEV-20796 | Promotions | Campaigns now support fully configurable statuses with workflow execution |
| Feature | #DEV-17836 | Configuration | Global search now includes purchase orders, by purchase order number, supplier name, reference number, or supplier email |

## Release 2026-11

Release date: Mar 24, 2026

### Main focus areas

This release introduces CDN configuration support for faster global asset delivery, expands pricing and price list capabilities, improves Voyado integration performance and customer matching, and adds enhancements to cart, notifications, and connector functionality.

### Key changes and improvements

#### Core

*   CDN URL can now be configured directly from the **Omnium UI under Advanced Settings**, allowing tenants to bring their own CDN provider to serve product images and assets with faster global delivery.

#### Price lists

*   Price list items now include a **product sub-object** with `supplierId`, `costCurrency`, and `brand`.

#### Prices

*   Added boolean **`IsPriceLocked`** indicating whether a price can be changed.
*   `OrderLine` is now enriched from product data when items are added to cart.

#### Cart

*   Added **`SalesOrigin`** property to `OmniumOrderLine`.
*   Default value can be configured via `cartSettings`.

#### Voyado Connector

*   Added **delta scheduled task** for product export, exporting only products modified since the previous run to reduce export time and FTP traffic.
*   Added support for **using member number as ID** when importing new customers from Voyado.
*   Added support for **looking up Voyado contacts by member number** in `GetOrCreateCustomerFromOrder`.
*   Added support for **specifying an alternate category tree** in Voyado XML product mapping.

#### Notification

*   Purchase order email notifications can now automatically **attach a custom Excel report** with purchase order line details, configurable directly from the notification template editor.

#### Connectors

*   **Fortnox:** Fixed issue where shipping cost on return orders was posted with incorrect sign.

| Type | Issue No | Domain | Description |
| --- | --- | --- | --- |
| Feature | #DEV-21423 | Core | CDN URL can now be configured directly from the Omnium UI under Advanced Settings, allowing tenants to bring their own CDN provider to serve product images and assets with faster global delivery. |
| Feature | #DEV-21416 | Price list | Price list items now include a product sub-object with supplierId, costCurrency, and brand fields |
| Feature | #DEV-21364 | Voyado Connector | Added a new delta scheduled task for Voyado product data export that only exports products modified since the last run, reducing export time and FTP traffic compared to the existing full export task. |
| Feature | #DEV-21338 | Voyado Connector | Add support for using member number as Id on import of new customers from Voyado. |
| Feature | #DEV-21337 | Voyado Connector | Add support for looking up Voyado contacts by member number in GetOrCreateCustomerFromOrder. |
| Feature | #DEV-21314 | Voyado Connector | Adding support for specifying alternate category tree in Voyado XML product mapping. |
| Bugfix | #DEV-21295 | Fortnox Connector | Fortnox - post shipping cost with correct sign on return orders |
| Feature | #DEV-21209 | Prices | Adds boolean IsPriceLocked to indicate if price can be changed. OrderLine is enriched from product data when item is added to cart. |
| Feature | #DEV-20567 | Cart | Adding property SalesOrigin to OmniumOrderLine. Default value can be set in cartSettings. |
| Feature | #DEV-20521 | Price list | Price list promotions now include a product management UI where users can view calculated prices |
| Feature | #DEV-19779 | Notifcation | Purchase order email notifications can now automatically attach a custom Excel report with purchase order line details, configurable directly from the notification template editor. |

## Release 2026-10

Release date: Mar 17, 2026

### Main focus areas

This release improves return handling and APIs, expands price list flexibility, enhances purchase order usability and validation, and introduces several improvements to product data, cart concurrency handling, and connector integrations.

### Key changes and improvements

#### Returns

*   Highlighted properties are now available for **return orders** in the return order list.
*   Added support for **return errors in the public API**.
*   Return order export workflow steps now support the `ConnectorId` field.

#### Order management

*   Fixed incorrect **profit margin calculation** on the order Cost tab when order-level discounts are applied.

#### Cart

*   Cart recalculation endpoints now detect **concurrent modifications** and automatically retry.
*   If a conflict is detected, the API returns **409 Conflict** instead of silently overwriting changes.

#### Product

*   Improved the **promotion overview list UI** on the product page.
*   Images in non-browser-native formats (such as TIFF and BMP) and external image URLs with query parameters are now supported.
*   `customsCode` is now available on **variant level** in the public API.

#### Price lists

*   Price list items now support **individual tax rate overrides**, eliminating the need for separate price lists when some products use different tax rates.
*   Fixed issue where editing **cost price inline** did not update margin calculations.
*   Added PATCH endpoint for price list items (`/api/priceLists/PatchPriceListItems`).
*   Price list reactivation is now significantly **faster**, recalculating only modified items instead of the entire list.

#### Purchase orders

*   Purchase order line item search is now **always visible** with auto-focus on load and a **Ctrl+Shift+S** keyboard shortcut.
*   Improved **VSL inventory count display** on purchase orders and internal transfers.
*   Purchase order export workflow steps now support the `ConnectorId` field.
*   Added support for **minimum and maximum order amount validation** using supplier-defined values.
*   New validator `purchaseOrderAmountValidator` can be configured via connector settings.

#### API

*   Added new order endpoint **ExistMany** for checking whether multiple orders already exist.
*   Fixed issue in **Orders/AddMany** endpoint so order validation errors are properly returned.

#### Tenant settings

*   Added **create/delete actions** to the routing item tree view.
*   External URL, Component Name, and Path are now editable fields in Authorization settings.

#### Gift cards

*   Added support for **separate AwardIt gift card templates** for email and SMS delivery.
*   Gift card notifications now include **OrderId, Barcode, and QR Code**.
*   Gift cards can now be **filtered by markets**, and the market is included in the API response.

#### Front Systems Connector

*   Added `StandardSizeLabel` connector property for customizing the default size label when products lack a size value.
*   Added support for `IsCreditShipmentDisabled`, allowing control over whether shipments should be credited when returning items in store.

#### Magento Connector

*   Magento product import now **consolidates duplicate prices and properties** from variants to the product level, reducing stored product size for products with many similar variants.

#### Notifications

*   Gift card notifications now support **OrderId, Barcode, and QR Code** fields.

#### Voyado Connector

*   Fixed mapping of **order amount discounts** to receipts in Voyado.

| Type | Issue No | Domain | Description |
| --- | --- | --- | --- |
| Feature | #DEV-21350 | Returns | Highlighted properties now available for return orders in return order list |
| Feature | #DEV-21349 | Returns | Added support for Errors on returns in the public API |
| Bugfix | #DEV-21348 | Order management | Fixed incorrect profit margin calculation on the order Cost tab when order-level discounts are applied |
| Bugfix | #DEV-21347 | Price list | Fixed price list cost price editing where changing the cost inline did not update the margin calculation |
| Feature | #DEV-21346 | Purchase orders | Purchase order line item search is now always visible in the tab row with auto-focus on load and a Ctrl+Shift+S keyboard shortcut. |
| Feature | #DEV-21341 | Api | Adding new order-endpoint ExistMany for checking if orders already exists. |
| Feature | #DEV-21325 | Product | Improved the UI for the promotion overview list on the product page |
| Feature | #DEV-21306 | Price list | Price list items now support individual tax rate overrides, eliminating the need for separate price lists when some products have a different tax rate |
| Feature | #DEV-21296 | Purchase orders | Improved the VSL inventory count display on purchase orders and internal transfers |
| Feature | #DEV-21288 | Giftcard | Added support for separate AwardIt gift card templates for email and SMS delivery methods, allowing different card designs based on distribution type |
| Feature | #DEV-21279 | Cart | Cart recalculate endpoints now detect concurrent modifications and automatically retry, returning a 409 Conflict response instead of silently overwriting changes made by another request. |
| Feature | #DEV-21270 | Tenantsettings | Added create/delete actions to the routing item tree view and exposed External URL, Component Name, and Path as editable fields in the Authorization settings |
| Feature | #DEV-21266 | Product | Images in non-browser-native formats (such as TIFF and BMP) and external image URLs with query parameters are now fully supported |
| Feature | #DEV-21264 | Returns | Return order export workflow steps now support the ConnectorId field |
| Feature | #DEV-21263 | Api | Fix for Orders/AddMany endpoint: Make sure order validation errors are returned to api |
| Feature | #DEV-21262 | Purchase orders | Purchase order export workflow steps now support the ConnectorId field |
| Feature | #DEV-21257 | Price list | Added PATCH endpoint for price list items (PATCH /api/priceLists/PatchPriceListItems) |
| Feature | #DEV-21255 | Notifcation | Added OrderId, Barcode & QR Code to the giftcard notification |
| Feature | #DEV-21252 | Product | Make sure customsCode in available on variant level for public api |
| Feature | #DEV-21235 | Front Systems Connector | Front Systems: Added a new connector property StandardSizeLabel that allows customizing the default size label for products without a size value |
| Feature | #DEV-21015 | Purchase orders | Support min/max amount validation using values set on supplier. If the preferred currency is set on the supplier then this will be used for conversion. |
| Feature | #DEV-21014 | Purchase orders | New validator for min/max amount that can be set on suppliers. Used by adding a connector with name "purchaseOrderAmountValidator". |
| Feature | #DEV-20971 | Magento Connector | Magento: Magento product import now consolidates duplicate prices and properties from variants to the product level, reducing stored product size for products with many variants sharing the same data. |
| Feature | #DEV-20915 | Giftcard | Gift cards can now be filtered by markets when searching, and the market is exposed on the Omnium gift card response. |
| Feature | #DEV-20743 | Price list | Price list re-activation is now significantly faster — when only items have changed on an already-active price list, only the modified items are recalculated and pushed to products instead of processing the entire list. |
| Bugfix | #DEV-20341 | Voyado Connector | Fix mapping of Omnium orderamount discounts to receipts in Voyado. |
| Feature | #DEV-19933 | Front Systems Connector | Front Systems: Now possible to use IsCreditShipmentDisabled so select if shipment should be credited when returning items in store |

## Release 2026-09

Release date: Mar 10, 2026

### Main focus areas

This release improves payment accuracy for return-only orders, enhances product search robustness, introduces new inventory control capabilities including Omnistock, and expands support across purchase orders, customers, and integrations.

### Key changes and improvements

#### Payments

*   Orders with return-only credits now correctly display the **"Paid" badge** and accurate net tax totals, instead of showing a misleading remaining payment amount.

#### Product

*   Property value searches are now **case insensitive**.
*   Improved product search by `ExternalId` to correctly support **special characters**.

#### Inventory

*   Introduced **Omnistock**: allows stores to exclude products from online _ship-from-store_ assortment using configurable exclusion rules (e.g., categories, brands, seasons, promotions, profitability thresholds).
*   Internal transfers are now included when calculating **reserved inventory**.

#### Purchase orders

*   Added support for **store queue exporter**.

#### Campaign

*   Added a detailed **price list item editor modal** with:
    *   Product preview
    *   Price calculation details
    *   Lowest price history

#### Customer

*   Added support for **multiple market IDs** per customer.

#### Voyado Connector

*   Added mapping of `targetUri` in the VoyadoOrderV3 mapper.

## Release 2026-08

Release date: Mar 03, 2026

### Main focus areas

This release introduces advanced sales restrictions on products, expands promotion flexibility (including cost-based promotions and automatic price transitions), improves order insight and workflow traceability, and strengthens API and connector capabilities.

### Key changes and improvements

#### Pick list

*   Added a **shipment-level order status filter** to the "Orders to Pick" view, allowing filtering by shipment status independently from overall order status.

#### Product

*   Added **sales restriction fields** (SalesStartDate, FixedPriceCode, FixedPriceEndDate, DiscountBlocked) available via API and editable in the admin UI.
*   Product completion status is now included in the product API response.
*   Added `excludedProductCategoryIds` to the public Product Search API.
*   Added bulk error handling for selected products.

#### Prices

*   Order lines now include `PriceListItemId`, enabling full traceability of which price list item determined the applied price.

#### Promotions

*   Added support for **automatic conversion of promotion prices to regular prices** after a defined period.
*   Added support for predefined value options on promotion custom properties.
*   Introduced a new **Cost Price Promotion** type that calculates promotional prices based on a product’s cost price from a selected price list with a configurable markup percentage.

#### Order management

*   Added `ShipmentId` to workflow execution result events.
*   Added feature switch to optionally derive main order status from shipment-level status updates.
*   Added a read-only **Product Cost** tab in order view showing cost prices, profit margins, and tax breakdown per order line.
*   Expanded Order Analytics Search endpoints with additional search options and optional totals in invoice search results.

#### Inventory

*   Fixed issue where new inventory batches were created with incorrect purchase prices when adjusting SKUs without active batches.

#### Returns

*   Fixed incorrect workflow warning and shipment status not updating to Returned when multiple returns are created individually for the same order.

#### Purchase orders

*   Added missing fields to purchase order PATCH endpoint (external IDs, notes, color, brand, and components on lines).

#### Store

*   Added support for reading and patching `availableReturnLocations` via the public API.

#### API

*   Added `Phone` field to the public order address model.
*   Added public API endpoint for market groups.

#### Workflow

*   Azure Storage Queue export connectors can now be targeted individually by setting `ConnectorId` on the workflow step.
*   Fixed issue where virtual products were unnecessarily split into separate shipments.

#### Cart

*   It is now possible to remove a customer from cart via the GUI.

#### Project

*   Project search now supports searching by external IDs, address, and postal code.

#### Voyado Connector

*   Added support for multiple markets per customer.
*   Updated return line mapping in VoyadoOrderV3Mapping (returns exported separately).
*   Added mapping of `targetUri` in VoyadoOrderV3 mapper.
*   Added new setting `UseCategoryHierarchyAfterRoot` for FTP product export.
*   Fixed mapping of Omnium order amount discounts to receipts in Voyado.
*   Added support for importing Voyado bonus points via webhooks.

#### Nosto Connector

*   Fixed mapping of multi-value custom list properties.
*   Added support for discontinuing products in Nosto when deactivated in Omnium.

* * *

| Type | Issue No | Domain | Description |
| --- | --- | --- | --- |
| Feature | #DEV-21157 | Pick list | Added a shipment-level order status filter to the "Orders to Pick" view, allowing users to filter by individual shipment statuses independently from the overall order status. |
| Feature | #DEV-21156 | Product | Added sales restriction fields to products (SalesStartDate, FixedPriceCode, FixedPriceEndDate, DiscountBlocked), available via the API and editable in the admin UI, enabling sales channels to enforce embargo dates, fixed-price legislation, and discount blocking |
| Bugfix | #DEV-21147 | Inventory | Fixed an issue where new inventory batches were created with incorrect purchase prices instead of fetching the current cost price from price lists when adjusting inventory for SKUs without active batches |
| Bugfix | #DEV-21146 | Product | Product completion status is now included in the product API response |
| Feature | #DEV-21138 | Prices | Order lines now include a PriceListItemId field that traces exactly which price list item determined the line's price |
| Feature | #DEV-21128 | Voyado Connector | Adding support for multiple markets on customers in Voyado connector. |
| Feature | #DEV-21126 | Purchase orders | Added missing fields to purchase order patch endpoint. This includes fields like external ids and notes on the order and color, brand and components on the lines. |
| Feature | #DEV-21124 | Voyado Connector | In VoyadoOrderV3Mapping we now map returned lines in original order (and without adjusting for returned quantity) as the return order is exported separately. It now follows the same pattern as for the Voyado receipt mapping in the Omnium connector. |
| Feature | #DEV-21123 | Api | Added Phone field to the public order address model, allowing API consumers to read and write a general phone number on order addresses. |
| Bugfix | #DEV-21119 | Returns | Fixed incorrect workflow warning and shipment status not updating to Returned when multiple returns are created individually for the same order. |
| Feature | #DEV-21118 | Store | Added support for reading and patching availableReturnLocations on stores via the public API |
| Feature | #DEV-21107 | Api | Add public API endpoint for market groups. |
| Feature | #DEV-21105 | Order management | Add ShipmentId to workflow execution result events so it's visible which shipment a workflow was executed for. |
| Feature | #DEV-21103 | Project | Project search now finds results when searching by external IDs, address, or postal code. |
| Feature | #DEV-21098 | Product | Added bulk error handling for selected products |
| Feature | #DEV-21097 | Order management | Feature switch added to get the main order status from the order status level as the order head status when shipment order status is updated. |
| Bugfix | #DEV-21090 | Workflow | Fixed an issue where virtual products were unnecessarily split into separate shipments |
| Feature | #DEV-21087 | Product | Added excludedProductCategoryIds to the public Product Search API |
| Feature | #DEV-21083 | Voyado Connector | Adding mapping of targetUri in VoyadoOrderV3-mapper. |
| Feature | #DEV-21071 | Workflow | Azure Storage Queue export connectors can now be targeted individually by setting a ConnectorId on the workflow step |
| Feature | #DEV-21069 | Order management | Added a read-only "Product Cost" tab to the order view that shows cost prices, profit margins, and tax breakdown per order line |
| Feature | #DEV-21056 | voyado | New setting UseCategoryHierarchyAfterRoot that can be set on the voyado exporter for FTP product export. |
| Feature | #DEV-21053 | Promotions | Adding support for automatic conversion of promotion prices to regular prices after a given period. This is useful when there are laws regulating how long a price can be considered a promotion. It will make it easier to set temporary lowered prices spanning a longer timeperiod than the legally allowed limit. |
| Feature | #DEV-21051 | Promotions | Adding support for predefining value options on promotion custom properties. |
| Feature | #DEV-21048 | Cart | Possible to remove customer from cart in GUI |
| Feature | #DEV-21025 | Nosto Connector | Fix mapping of custom list properties with multiple values selected in Nosto mapping. |
| Feature | #DEV-21024 | Nosto Connector | Adding support for discontinuing products in Nosto when they are deactivated in Omnium. |
| Feature | #DEV-20794 | Promotions | New "Cost Price Promotion" type that calculates promotional prices based on a product's cost price from a specified price list with a configurable markup percentage. |
| Feature | #DEV-20729 | orders | Added more search options to the Order Analytics Search endpoints, added optional totals on results from invoice search endpoint |
| Bugfix | #DEV-20341 | Voyado Connector | Fix mapping of Omnium orderamount discounts to receipts in Voyado. |
| Feature | #DEV-16342 | Voyado Connector | Adding support for importing Voyado bonus points via webhooks. |

* * *

## Release 2026-07

Release date: Feb 24, 2026

### Main focus areas

This release enhances search and filtering capabilities across orders, products, and cost prices, expands reporting options, strengthens integrations with Front Systems and Voyado, and improves cart, return, and reservation handling.

### Key changes and improvements

#### Order management

*   Added a **Brand filter** to the Online Orders advanced search, enabling filtering by brand on order line items.
*   The scheduled task **TryReserveOrderlinesScheduledTask** now correctly updates inventory and transactions.

#### Product

*   Public product search API now supports **completion rate filtering**, allowing filtering by:
    *   Completion validity
    *   Percentage range
    *   Specific field completion status
*   Fixed an issue where the **Product Scroll** endpoint ignored the `IsPublished` filter parameter.
*   Added **PATCH endpoints for product categories**.

#### Cart

*   New Cart API endpoint: **RemoveCustomerFromCart**.
    *   Removes all customer-related data (ID, phone, email, address).
    *   Recalculates prices after removal.

#### Returns

*   Returns API now accepts POST requests containing lines with `returnQuantity: 0`.
    *   Such lines are silently filtered out instead of causing the entire request to fail.

#### Reports

*   Added a new custom report type **“ProductSales”**, allowing administrators to build configurable product sales reports with selectable columns.
*   Sales data export report now correctly labels the **COGS** column and includes a new **Inventory Value** column.

#### Cost Prices

*   Cost price search API now supports filtering by **specific store IDs**.

#### Front Systems Connector

*   Added support for exporting **product tax rates as tags** to Front Systems.
    *   Enabled via the `AddTaxRatesAsTags` option.
    *   Creates one tag per country code in the format `{countryCode}_{taxRate}`.

#### Voyado Connector

*   The Voyado product XML feed now logs the **number of exported SKUs**, improving monitoring and transparency.

#### Configuration

*   Improved the **Rounding Settings** page with a cleaner and more compact layout.

#### Notifications

*   Added a **toggle** to allow resending notification templates from workflow.

* * *

| Type | Issue No | Domain | Description |
| --- | --- | --- | --- |
| Feature | #DEV-21062 | Order management | Added a Brand filter to the Online Orders advanced search, allowing users to filter orders by the brand on order line items. |
| Feature | #DEV-21061 | Front Systems Connector | Added support for automatically exporting product tax rates as tags to Front Systems, enabled via the AddTaxRatesAsTags connector option, which adds one tag per country code in the format {countryCode}\_{taxRate}. |
| Feature | #DEV-21045 | Configuration | Improved the Rounding Settings page with a cleaner, more compact layout |
| Feature | #DEV-21042 | Reports | Added a new "ProductSales" custom report type that lets administrators build configurable product sales reports with selectable columns |
| Feature | #DEV-21030 | Cost Prices | Added support for filtering by specific store IDs in the cost price search API endpoint. |
| Feature | #DEV-21028 | Voyado Connector | Log number of exported skus to Voyado in Voyado product xml feed. |
| Feature | #DEV-21022 | Product | Added completion rate filtering to the public product search API, allowing API consumers to filter products by completion validity, percentage range, and specific field completion status. |
| Bugfix | #DEV-21021 | Product | Fixed an issue where the Product Scroll endpoint ignored the IsPublished filter parameter, causing unpublished products to be returned in scroll results. |
| Feature | #DEV-21017 | Cart | Cart API, new endpoint RemoveCustomerFromCart. Removes a customer from cart. This will remove all customer related info like id, phone, e-mail and address. Prices will also be recalculated |
| Feature | #DEV-21012 | Reports | Export with sales data report now correctly labels the COGS column and includes a Inventory Value column |
| Bugfix | #DEV-21003 | Returns | Returns API now accepts POST requests containing lines with returnQuantity: 0, silently filtering them out instead of rejecting the entire request |
| Feature | #DEV-20995 | Notifcation | Toggle to allow resending notification templates from workflow |
| Bugfix | #DEV-20976 | Order management | TryReserveOrderlinesScheduledTask will now update inventory and transactions |
| Feature | #DEV-20974 | Product | Added PATCH endpoints for product categories |

* * *

## Release 2026-06

Release date: Feb 17, 2026

### Main focus areas

This release delivers usability improvements in purchase orders and order management, performance enhancements in integrations, expanded reporting capabilities, and refinements to Voyado, Sitoo, store configuration, and project visibility.

### Key changes and improvements

#### Purchase orders

*   Improved the **GUI extension area dropdown** in admin settings with standardized naming and added descriptive help text for each extension area, making configuration clearer and more consistent.

#### Order management

*   It is now possible to **edit the order completed date** directly from the metadata modal.
*   The workflow step **TryReReserveOpenOrderlines** will no longer consider cancelled orders, improving reservation accuracy and avoiding unnecessary processing.

#### Voyado

*   Voyado Elevate now supports **market and store stock**, expanding the data available for personalization and marketing use cases.
*   Fixed an issue in **Voyado Order v3 tax mapping**, improving data correctness.

#### Sitoo Connector

*   Implemented **performance improvements** to Sitoo product export, reducing execution time and improving scalability.

#### Store

*   Added support for specifying a **reason** on global additional opening hours, improving clarity and auditability of store schedule changes.

#### Reports

*   Added a new custom report type **“OrderError”**, enabling export of detailed order error information (such as key, message, severity, and status) alongside order data for troubleshooting and analysis.

#### Projects

*   Projects found via **ID search** where the user lacks store access are now shown in **read-only mode** (Status and Attachments tabs only) instead of returning an “Access denied” message, improving transparency and usability.

* * *

| Type | Issue No | Domain | Description |
| --- | --- | --- | --- |
| Feature | #DEV-20965 | Purchase orders | Improved the GUI extension area dropdown in admin settings with standardized, consistent naming and added descriptive help text for each area. |
| Feature | #DEV-20954 | Sitoo Connector | Performance improvements to sitoo product export. |
| Feature | #DEV-20939 | Store | Adding support for reason in global additional opening hours. |
| Feature | #DEV-20937 | Order management | Added the ability to edit the order completed date in the metadata modal. |
| Feature | #DEV-20926 | Voyado Connector | Voyado Elevate - Added support for market and store stock |
| Feature | #DEV-20922 | Reports | Added new custom report type "OrderError" for exporting order errors, allowing users to create reports with error details (key, message, severity, status, etc.) alongside order information. |
| Bugfix | #DEV-20916 | Voyado Connector | Fixing error in Voyado Order v3 tax mapping. |
| Feature | #DEV-20913 | Order management | TryReReserveOpenOrderlines will not consider orders that are cancelled anymore. |
| Feature | #DEV-20759 | Project | Projects that users find via ID search but don't have store access to are now displayed in read-only mode (showing only Status and Attachments tabs) instead of returning "Access denied". |

* * *

## Release 2026-05

Release date: Feb 10, 2026

### Main focus areas

This release strengthens product and promotion management, expands workflow configurability, enhances Voyado and Front Systems integrations, and improves usability across notifications, carts, pricing, analytics, and inventory handling.

### Key changes and improvements

#### Product

*   Added **CategoryIdsToRemove** to product patch, allowing removal of categories via API.
*   Mass update UI now supports setting **main category**.
*   Introduced **“Excluded from analytics”** product setting to prevent double-counting (e.g. gift cards).
*   SupplierPackagingUnit added to product and used as default selected unit in purchase orders.
*   Product feed to Voyado is now filtered by **market assortment and connector scope**.

#### Notifications

*   Design templates now support **barcode and QR code generation** from any property, including nested and custom properties.
*   Added **conditional blocks** to show or hide content based on property values.
*   Static values such as URLs are supported.
*   All new options are available via the **Advanced** modal in the template editor.

#### Workflow

*   Added a new **OrderStatus property type** for workflow step configuration with a dropdown of all available statuses.
*   Improved return workflows to only trigger order workflows when the order status actually changes.
*   UpdateOrderStatus return workflow step now supports **custom status values** instead of fixed Returned/PartiallyReturned constants.
*   Added a more flexible approach to **reallocation attempts on order line cancellation**.

#### Voyado

*   Added support for **line item–level custom property mapping** in Voyado order actions.
*   Returns can now be **exported through VoyadoOrderV3Exporter**.
*   Product feed filtering improved based on assortment and scope.
*   Added support for **Voyado Elevate product synchronization** using scheduled tasks.

#### Cart

*   When creating a cart for a customer with multiple stores in the UI, a **store selection popup** is now shown.

#### Promotions

*   Added API support for **creating price list promotions**.
*   Season filter in the promotion module now includes **variant-level seasons**.

#### Inventory and Cost Prices

*   Fixed loading issues and improved UX in the **inventory rules UI**.
*   Internal transfers now set **cost price based on FIFO**.

#### Front Systems Connector

*   Price list synchronization now supports **marketGroupId-level price grouping**.

#### Customer

*   Added a new filter for **private customer relation** in customer search.
*   Fixed an issue with customer creation in **GetOrCreateCustomerFromOrder**.

#### Prices

*   Added **market group ID** to the price edit UI.

#### Analytics

*   Products can now be excluded from analytics by default, improving accuracy for scenarios like gift card sales and redemption.

#### Users

*   Added new **filters** to the user administration list.

#### Purchase Orders

*   Selected units can now be used in purchase orders.
*   **SupplierPackagingUnit** is used as the default unit on purchase order lines when configured.

* * *

| Type | Issue No | Domain | Description |
| --- | --- | --- | --- |
| Feature | #DEV-20899 | Product | Added CategoryIdsToRemove to the product patch. |
| Feature | #DEV-20898 | Notifcation | Design templates - It is now possible to generate barcodes and QR codes from any property. Property paths, nested properties, and custom properties are all supported. Static values such as URLs can also be used. Additionally, conditional blocks have been added, allowing template content to be shown or hidden based on whether a property has a value. All new options are available in the Advanced modal in the template editor. |
| Feature | #DEV-20893 | Workflow | Added a new OrderStatus property type for workflow step configuration that displays a dropdown of all available order statuses. |
| Bugfix | #DEV-20892 | Workflow | Improved return workflow to only trigger order workflow when the order status is actually changed, and added configurable properties to the UpdateOrderStatus return workflow step to allow custom status values instead of the default Returned/PartiallyReturned constants. |
| Feature | #DEV-20891 | Voyado Connector | Adding support for line item level custom props mapping in Voyado order actions. |
| Feature | #DEV-20885 | Product | Mass update - Now possible to set main category from UI |
| Feature | #DEV-20883 | Cart | When creating a cart for a selected customer in the Omnium UI, and the selected customer has multiple stores, you will get a popup to select the store you would like to set on your cart. |
| Feature | #DEV-20880 | Promotions | Adding support for creating price list promotions through API. |
| Bugfix | #DEV-20875 | Inventory | Fixing loading issues and inventory rule UI and adding minor UX improvements. |
| Feature | #DEV-20870 | Voyado Connector | Adding support for exporting returns through VoyadoOrderV3Exporter. |
| Feature | #DEV-20862 | Voyado Connector | Product feed to Voyado will now be filtered based on product market assortment and connector scope. |
| Bugfix | #DEV-20853 | Cost Prices | Internal transfers will now set cost price based on FIFO. |
| Feature | #DEV-20852 | Front Systems Connector | Front Systems: Price list synchronization now support marketGroupId level price grouping |
| Feature | #DEV-20848 | Customer | New filter for private customer relation in customer search. |
| Bugfix | #DEV-20845 | Order management | Fixing issue with customer creation in GetOrCreateCustomerFromOrder. |
| Feature | #DEV-20835 | Prices | Adding market group id to price edit UI. |
| Feature | #DEV-20826 | Analytics | Added a new product setting "Excluded from analytics" that allows products like gift cards to be excluded from sales statistics by default, preventing double-counting when they are both sold and later redeemed as payment. |
| Feature | #DEV-20823 | Users | New filters for user administration list. |
| Feature | #DEV-20792 | Promotions | The season filter in the promotion module now includes seasons set on variant level. |
| Feature | #DEV-20469 | Order management | Adding a more flexible approach to attempting reallocation on cancellation of order lines. |
| Feature | #DEV-19885 | Voyado Elevate | Support for Voyado Elevate product sync using scheduled tasks. |
| Feature | #DEV-19496 | Purchase orders | Selected units can now be used in purchase orders. SupplierPackagingUnit has been added to product which will be used as the default selected unit in purchase orders if set. |

* * *

## Release 2026-04

Release date: Feb 03, 2026

### Main focus areas

This release improves returns handling and order visibility, expands workflow and purchase order automation, enhances Front Systems and Voyado integrations, and adds flexibility to pricing, configuration, and tenant settings.

### Key changes and improvements

#### Returns

*   Added a new **“Returns Only”** section in the order view that displays return line items without a matching original order line. This typically applies to in-store returns or cases where the original order has been deleted or cannot be found.

#### Front Systems Connector

*   Added support for **excluding shipping costs** from websales exported to Front Systems.
*   This is configurable per store using the property `ExcludeFrontShippingCost=true`.

#### Workflow

*   New workflow step that automatically sets **warehouse or store address as the shipment address** for pickup-in-store shipments.
*   Added **Store Group filters** to workflow steps for more granular control.
*   Fixed an issue where **Webhook and Order Export** workflow steps did not correctly resolve connectors; Connector ID can now be used reliably as identifier.

#### API

*   Added a new field for **organizational number** on the billing address.

#### Inventory

*   Inventory badge in the order view now shows **gray instead of red** when available quantity is 0 and the current order has already reserved the inventory.

#### Purchase Orders

*   New setting **“Set ETA from purchase order”** automatically sets delivery ETA based on the Requested Delivery Date from the source purchase order.
*   Purchase order list and details now display **delivered quantity versus ordered quantity** for improved visibility.

#### Configuration

*   Added **Number Options** for Replacement Order Number configuration.

#### Users

*   SCIM synchronization will no longer delete **roles that were added manually** to users in Omnium.

#### Tenant Settings

*   Added more **descriptive help texts** to settings to improve usability and clarity.

#### Price Lists

*   Prices can now be created at **product level** from a price list.
*   Price list items are no longer required to be SKU-specific.

#### Voyado Connector

*   Added support for **extra data on Voyado order actions**.
*   Transitioned to using **embedded order actions** for improved flexibility and consistency.

#### Promotions

*   Added support for **markdown campaigns**, enabling richer and more flexible campaign content.

* * *

| Type | Issue No | Domain | Description |
| --- | --- | --- | --- |
| Feature | #DEV-20817 | Returns | Added 'Returns Only' order line section to order view Display return line items that have no matching order line. This typically occurs for in-store returns or when the original order has been deleted/not found. |
| Feature | #DEV-20813 | Front Systems Connector | Front Systems: Now possible to exclude shipping costs from websales exported to Front Systems. This is configurable per store by adding a property 'ExcludeFrontShippingCost'/true to the store. |
| Feature | #DEV-20805 | Workflow | Added workflow step to automatically set warehouse / store address as shipment address for pickup in store shipments. |
| Feature | #DEV-20800 | Api | New field on the billing address for organizational number. |
| Feature | #DEV-20775 | Inventory | Inventory badge in order view now shows gray instead of red when available quantity is 0, since the current order has already reserved the inventory. |
| Feature | #DEV-20772 | Purchase orders | Added a new setting "Set ETA from purchase order" that automatically sets the Estimated Time of Arrival on deliveries based on the Requested Delivery Date from the source purchase order. |
| Feature | #DEV-20771 | Purchase orders | Purchase order list and details now display delivered quantity versus ordered quantity. |
| Feature | #DEV-20769 | Workflow | Added Store Group filters to Workflow steps. |
| Feature | #DEV-20767 | Configuration | Added Number Options for Replacement Order Number |
| Bugfix | #DEV-20763 | Workflow | Webhook and Order Export workflow steps now support using Connector ID as identifier for getting correct connector. |
| Feature | #DEV-20747 | Users | SCIM will no longer delete roles on users added manually in Omnium. |
| Feature | #DEV-20736 | Tenantsettings | Added descriptive help texts to settings |
| Feature | #DEV-20492 | Price list | Prices can now be created on product level from a price list. An item on a price list is no longer required to be sku specific. |
| Feature | #DEV-20474 | Voyado Connector | Adding support for extra data on Voyado order actions and transitioning to using embedded order actions. |
| Feature | #DEV-19966 | Promotions | Adding support for markdown campaigns. |

* * *

## Release 2026-03

Release date: Jan 27, 2026

### Main focus areas

This release strengthens product management and search capabilities, enhances Voyado integration flexibility, improves inventory valuation accuracy, and introduces new tools for campaign planning and fulfillment reporting. Several fixes also improve robustness across gift cards, customer assortment handling, and payments.

### Key changes and improvements

#### Product

*   Added a new scheduled task **“Create Categories from Brands”** that automatically creates product categories based on brands and assigns products accordingly.
*   Product search now supports searching by **SEO URI(s)** using the new `SeoUris` property.
*   Direct UI navigation (copy/paste URLs) now works correctly for product IDs containing dots (`.`).

#### Voyado Connector

*   New setting to control whether the **GetOrCreateCustomerFromOrder** workflow step should only import customers from Voyado or also create new contacts.
*   Added mapping for **billing address** in the Voyado Order V3 mapper.
*   Fixed customer enrichment issues in the GetOrCreateCustomerFromOrder workflow step towards Voyado.

#### Inventory

*   **Kit inventory value** is now calculated using the actual FIFO-based cost of consumed components, with automatic currency conversion for accurate and traceable valuation.

#### Order Management

*   Creating a **credit shipment** from the GUI now generates a separate event with operationId `216124`.

#### Notifications

*   Added new replacement texts for **conditional notification content** that is shown when specific order property conditions are met.

#### Customer

*   Added support for **customer-specific product assortment filtering**, allowing include/exclude restrictions by product category for both business and private customers.

#### Reports & Analytics

*   Automatic tracking of **order status transitions on shipments** with timestamps and duration metrics has been added.
*   This enables new fulfillment performance reports and charts.

#### Projects

*   Users can now search for projects by **exact project ID** in the UI (read-only), even if the project is not otherwise visible in their project list.

#### Promotions

*   Introduced a new **Campaign Planning** feature for creating, managing, and tracking marketing campaigns.
*   Includes performance analytics, calendar visualization, and integration with promotions.

#### Gift Cards

*   Fixed support for **gift cards with predefined prices**.

#### Payments

*   **Zaver refunds** are now automatically approved.

* * *

| Type | Issue No | Domain | Description |
| --- | --- | --- | --- |
| Feature | #DEV-20737 | Product | Added new scheduled task "Create Categories from Brands" that automatically creates product categories based on product brands and assigns products to their corresponding brand category. |
| Feature | #DEV-20733 | Product | Added support for searching products by SEO URI(s) via the new SeoUris property in product search requests. |
| Feature | #DEV-20720 | Product | Direct UI navigation (copy/paste URLs) now works with product IDs containing dots ("."). |
| Feature | #DEV-20717 | Voyado Connector | Adding setting to Voyado connector for controlling if GetOrCreateCustomerFromOrder workflow step should be able to only import from Voyado or also create a contact. |
| Feature | #DEV-20713 | Voyado Connector | Add mapping for billing address in Voyado Order V3 mapper. |
| Bugfix | #DEV-20712 | Giftcard | Support gift cards with predefined prices. |
| Bugfix | #DEV-20526 | Voyado Connector | Fix for customer enrichment in workflow step GetOrCreateCustomerFromOrder towards Voyado. |
| Feature | #DEV-20509 | Notifcation | New replacement texts for conditional text that is shown if order property condition is met. |
| Feature | #DEV-20507 | Order management | Credit shipment from GUI now add a separate event, with operationId 216124. |
| Feature | #DEV-20503 | Inventory | Kit inventory value is now calculated using the actual FIFO-based cost of all consumed components, with automatic currency conversion, ensuring accurate and traceable inventory valuation. |
| Bugfix | #DEV-20502 | Customer | Added support for customer-specific product assortment filtering by allowing include/exclude product category restrictions on both business and private customers. |
| Feature | #DEV-20500 | Reports | Added automatic tracking of order status transitions on shipments with timestamps and duration metrics, enabling fulfillment performance reports and charts. |
| Feature | #DEV-20496 | Project | Users can now search for projects by exact project ID as read only in the UI, even if the project would otherwise not be visible in their project list. |
| Feature | #DEV-20432 | Promotions | New Campaign Planning feature allows users to create, manage, and track marketing campaigns with performance analytics, calendar visualization, and promotion integration. |
| Feature | #DEV-19642 | Payments | Zaver refunds are automatically approved. |

* * *

## Release 2026-02

Release date: Jan 20, 2026

### Main focus areas

This release improves product search and inventory visibility, adds more flexible workflow and cart configuration options, enhances reporting accuracy, and refines purchase order and promotion handling. Several fixes also improve robustness in payments and reservation views.

### Key changes and improvements

#### Product

*   Product location search now also includes the **LocationOverstock** field.
*   Added a **confirmation warning** when changing SKU ID in product quick edit to prevent breaking inventory and price references.
*   Improved order reservation popup to filter out orders with **delivered** status.

#### Inventory

*   Inventory totals now display **actual negative values**.
*   A **golden yellow badge** indicates when stock exists in some stores even if the total inventory is negative.

#### Orders & Workflow

*   Workflow step **TryReallocateToOtherWarehouse** now supports filtering warehouses using:
    *   `includedWarehouseIds`
    *   `excludedWarehouseIds`
*   This allows more controlled and predictable reallocation behavior.

#### Cart

*   `AddItemToCart` now supports the optional parameter **`allowNoPriceItems`**, enabling products without prices to be added to carts.

#### Events & Webhooks

*   Webhook test results now display **response content** when a webhook test fails, simplifying debugging.
*   Event subscription testing is now more transparent.

#### Payments

*   Fixed issues with **partial capture for Zaver** payments.

#### Charts & Reporting

*   Market filters in reports and charts now correctly include **only orders belonging to the selected markets**, improving reporting accuracy.

#### Purchase Orders

*   Purchase order notifications now support **multiple currencies**.
*   Discounts on order lines and purchase order lines are now displayed using **arrow indicators** instead of text for improved clarity.

#### Promotions

*   When adding products as promotion filters, it is now possible to **filter products by category**.

* * *

| Type | Issue No | Domain | Description |
| --- | --- | --- | --- |
| Feature | #DEV-20499 | Product | Product location search now also searches the LocationOverstock field. |
| Feature | #DEV-20490 | Events | Event subscription testing: Webhook results now displays content when webhook test fails. |
| Feature | #DEV-20482 | orders | Added support for filtering warehouses during order reallocation for workflow step 'TryReallocateToOtherWarehouse' through workflow step properties. New properties are: includedWarehouseIds (comma-separated list of warehouse IDs to consider for reallocation) and excludedWarehouseIds (comma-separated list of warehouse IDs to exclude from reallocation). |
| Feature | #DEV-20481 | Cart | Added a new optional parameter 'allowNoPriceItems' to the AddItemToCart endpoint that enables adding products without prices to carts. |
| Feature | #DEV-20480 | Product | Added confirmation warning when changing SKU ID in product quick edit to prevent accidental changes that could break inventory and price references. |
| Feature | #DEV-20463 | Inventory | Inventory totals now show actual negative values, and a golden yellow badge indicates when stock is available in some stores despite a negative total. |
| Bugfix | #DEV-20461 | Payments | Fix problems with partial capture for Zaver. |
| Feature | #DEV-20450 | Charts and reporting | Market filters in reports and charts now include only orders belonging to the selected markets, rather than all orders from stores associated with those markets. |
| Bugfix | #DEV-20446 | Product | Improved order reservation popup view so that orders with actual delivered status is filtered out. |
| Feature | #DEV-20439 | Purchase orders | Added support for multiple currencies in purchase order notifications. |
| Feature | #DEV-20436 | Purchase orders | Discounts on order lines and purchase order lines are now displayed using arrow indicators instead of text. |
| Feature | #DEV-19582 | Promotions | Filter products based on categories, when adding products as filter on a promotion. |

* * *

## Release 2026-01

Release date: Jan 13, 2026

### Main focus areas

This release expands UI extensibility, strengthens workflow automation, improves purchase order and return handling, enhances customer filtering and enrichment, and adds security and flexibility to payment and authentication flows. Several connector and product fixes improve robustness and data accuracy.

### Key changes and improvements

#### GUI & UI Extensions

*   The UI now supports **custom extension tabs**, including embedding external content via **iframes**.

#### Promotions

*   **Kit Promotions** now support **fixed price** and **fixed amount** rewards.

#### Purchase Orders

*   Import matching improved with support for **Supplier** and **SupplierSku**.
*   **Tags** are now carried over from purchase orders to deliveries.
*   Line item comments are presented more clearly.
*   **Negative discounts** are visually highlighted alongside positive discounts.

#### Workflow

*   **Projects** can now be automatically created from the order workflow when orders include products linked to a project type.
*   New workflow step to **create internal transfers** from order lines that are not reserved.

#### Customer

*   Private and business customer lists now support filtering by **customer group**; the filter also applies to **Excel exports**.
*   Business customer API (`/api/BusinessCustomers/AddOrUpdateMany`) now supports enriching contact information from **privateCustomerId**.

#### Authentication & Security

*   Added **session re-authentication** in the OMS UI. Users are prompted to re-authenticate after exceeding the configured timeout since last login (currently applied to sensitive areas such as administration and user/API management).

#### Product

*   Fixed variant-level search by **SupplierSkuId**, including proper handling of uppercase letters.
*   `PatchProduct` now supports all properties on **ProductUnit**.

#### Returns

*   When creating a return, it is now possible to **select the shipping price**, accommodating hidden fees or adjustments.

#### Payments

*   Support for configuring **custom headers** for webhook payment providers (e.g., authorization headers).
*   Webhook payment requests now include **customerId**.
*   **Klarna/Kustom** integration updated to support new Kustom API URLs.

#### Integrations

**Sitoo Connector**

*   Events originating from the Sitoo order integration now set the correct **SubClassName** and **Source**.

**Voyado Connector**

*   Extended `GetOrCreateCustomerOrderAction` to support customer lookup in Voyado by **email and phone**.

* * *

| Type | Issue No | Domain | Description |
| --- | --- | --- | --- |
| Feature | #DEV-20427 | Gui | The UI now supports custom extension tabs, including the ability to embed external content using iframes. |
| Feature | #DEV-20426 | Promotions | Kit Promotion type now supports fixed price and amount rewards. |
| Feature | #DEV-20425 | Purchase orders | Purchase order improvements: Imports now support matching by Supplier and SupplierSku, tags are carried over from purchase orders to deliveries, line item comments are more clearly presented, and negative discounts are visually highlighted alongside positive discounts. |
| Feature | #DEV-20423 | Workflow | Projects can now be automatically created from the order workflow when an order includes products linked to a project type. |
| Feature | #DEV-20422 | Customer | Private and business customer lists now support filtering by customer group. The filter also applies to Excel exports from these views.ly highlighted alongside positive discounts. |
| Feature | #DEV-20423 | Workflow | Projects can now be automatically created from the order workflow when an order includes products linked to a project type. |
| Feature | #DEV-20422 | Customer | Private and business customer lists now support filtering by customer group. The filter also applies to Excel exports from these views. |
| Feature | #DEV-20415 | Auth | Added support for session re-authentication in the OMS UI. When a user's session exceeds the configured timeout since last login, the user is prompted to re-authenticate. This improves security by ensuring users periodically verify their identity during long sessions. Currently, this is only configured for sensitive areas (administration, user/api management) |
| Feature | #DEV-20400 | Order management | New workflow step for creating internal transfers from order lines that are not reserved |
| Bugfix | #DEV-20399 | Product | Fixed search by SupplierSkuId on variant level, including uppercase letters. |
| Bugfix | #DEV-20372 | Product | PatchProduct now works with all properties on ProductUnit. |
| Feature | #DEV-20368 | Returns | When you create a return you can now choose the shipping price, in case there were hidden fees or similar. |
| Feature | #DEV-20338 | Customer | Adding support for enriching contact information from privateCustomerId in endpoint /api/BusinessCustomers/AddOrUpdateMany. |
| Feature | #DEV-20307 | Payments | Adding support for configuring custom headers for webhook payment provider in Omnium. This can be used for scenarios such as adding auth headers to webhook request. |
| Feature | #DEV-20265 | Payments | Webhook payment: Added customerId to request content |
| Feature | #DEV-20214 | Sitoo Connector | Sitoo integration: Set correct SubClassName and Source for events originating in the Sitoo order integration. |
| Feature | #DEV-20103 | Voyado Connector | Extend GetOrCreateCustomerOrderAction in Omnium to support looking up customer towards Voyado based on email and phone. |
| Feature | #DEV-20009 | Payment integration | Klarna/kustom: Added support for new Kustom api urls. |
