# 2022

Source: https://docs.omnium.no/docs/Releasenotes/releasenotes-5-2022

> Key updates, bug fixes, and improvements for Omnium in 2022, detailed week by week.

#### Release 2022-44

**Release date**: 12-12-2022

| **Type** | **Issue no** | **Description** |
| --- | --- | --- |
| Enhancement | #6491 | Now possible to choose order status and notification template to send when resending notification from order. |

* * *

#### Release 2022-43

**Release date**: 12-06-2022

| **Type** | **Issue no** | **Description** |
| --- | --- | --- |
| Enhancement | #6353 | Can track which partners have rejected a given project. Available only through API (add/remove rejected partners). Can filter projects in search based on rejected by partners. |

* * *

#### Release 2022-42

**Release date**: 11-29-2022

| **Type** | **Issue no** | **Description** |
| --- | --- | --- |
| Enhancement | #6324 | Email and SMS notification results are now displayed in workflow event history and workflow results window. |
| Enhancement | #6333 | Export "Orders with orderlines" from order list now includes cost. |
| Enhancement | #6268 | Added support for configuring buttons on projects for switching to other project types. |
| Enhancement | #6310 | Event log UI has been revamped. |
| Enhancement | #6140 | Shopify integration - Omnium can now create custom collections in Shopify, based on Product categories. |

* * *

#### Release 2022-41

**Release date**: 11-22-2022

| **Type** | **Issue no** | **Description** |
| --- | --- | --- |
| Enhancement | #5925 | Support for change tracking on Customer-objects (versioning). |
| Enhancement | #6146 | Order list in UI: When selecting a market, we now filter based on market id on orders, not only stores. |
| Enhancement | #6139 | Shopify integration: Possible to export customer product properties to meta fields in Shopify. |
| Enhancement | #6267 | New language editor: Possible to search for translation keys. |
| Enhancement | #6123 | Product alert - possible to send notification on inventory change for a product. |

* * *

#### Release 2022-40

**Release date**: 11-15-2022

| **Type** | **Issue no** | **Description** |
| --- | --- | --- |
| Enhancement | #4218 | Product search now supports synonyms. Synonyms can be enabled and added via the Omnium UI. Synonyms will work on all free text fields, such as product name, alternative name, brand, category name, and description. |
| Enhancement | #6117 | Order search now enabled with prefix search on variant SKU field by default. |
| Enhancement | #5946 | Now able to filter on specific order errors in Omnium UI. |
| Enhancement | #6112 | Now possible to drag and drop line items within a shipment to change sort order. |
| Enhancement | #5944 | Now able to mark order errors as solved instead of just removing them. |
| Enhancement | #6028 | Shipment packages information (weight, dimensions) now displayed in Omnium UI. |

* * *

#### Release 2022-39

**Release date**: 11-08-2022

| **Type** | **Issue no** | **Description** |
| --- | --- | --- |
| Enhancement | #5420 | New gadget that shows returns with status "New". |
| Bug | #6081 | Fix for notification preview. Selected tab is now used in preview. |
| Enhancement | #5756 | Customer club member is extended with property SalesPersonId. Can be used if you want to send POS user from signup store. |
| Enhancement | #5759 | Possible for customer service to add a public reply from GUI. |
| Enhancement | #5934 | Added switch for setting store to inactive in UI. |
| Enhancement | #6077 | Added filtering of stores based on zip code ranges. Only stores with a zip code range spanning the filter value will be returned. |

* * *

#### Release 2022-38

**Release date**: 11-01-2022

| **Type** | **Issue no** | **Description** |
| --- | --- | --- |
| Enhancement | #5879 | Magento integration now supports multiple stock sources. |
| Enhancement | #5903 | New UI for managing default return charges. |
| Enhancement | #5757 | Review and rating: Rating link sent to customer is now saved on the rating object. Customer service can then resend the link to customer. |
| Bug | #5835 | No longer possible to get negative price in cart, if order discount was added and total price updated to 0 for all lines in cart. |
| Enhancement | #5904 | Setting for hiding projects without stores from store-users. |
| Enhancement | #5858 | Adding the possibility for splitting a cart line item in two. |
| Enhancement | #5878 | Performance improvement for saving operations for carts, products, stores, and projects. |
| Enhancement | #5914 | Magento integration now handles customer synchronization. |

* * *

#### Release 2022-37

**Release date**: 10-25-2022

| **Type** | **Description** |
| --- | --- |
| Enhancement | Possible to print selected products. |
| Enhancement | Newsletter: possible to write custom unsubscribe messages. |
| Enhancement | New field on stores to flag inactive stores. Inactive stores are hidden by default but can be found through search. |
| Enhancement | Product search: filter on price. |

* * *

#### Release 2022-36

**Release date**: 10-18-2022

| **Type** | **Issue no** | **Description** |
| --- | --- | --- |
| Enhancement | #4920 | New workflow step for validating payment. |
| Enhancement | #5790 | Get user confirmation if prices should be updated when changing requested delivery date on cart from Omnium UI. |
| Enhancement | #5716 | New way of displaying variants. |
| Enhancement | #5697 | Added market and store filters to inventory reports. |

* * *

#### Release 2022-35

**Release date**: 10-12-2022

| **Type** | **Issue no** | **Description** |
| --- | --- | --- |
| Enhancement | #5427 | New view in products to allocate products to orders/orderlines awaiting inventory. |
| Enhancement | #5746 | Export of order list on order level. |
| Enhancement | #5645 | New API endpoint for sending vouchers and linking this to a business customer. |
| Enhancement | #5550 | Private customer list: Default sorting is now created. Possible to change sorting to modified. |
| Enhancement | #5763 | Improvements in iPad view. |
| Bug | #5748 | Fixed bug in project search. |
| Enhancement | #5745 | Possible to set/edit market on B2B customers in GUI. |
| Bug | #5750 | API UpdateStatus did not update orderStatus when workflow is false. |
| Bug | #5661 | Projects: ProjectValue was overwritten on update. Users are now required to add a transaction under Economy, and make the box displaying total value of the project non-editable. |
| Enhancement | #5300 | Header sorting on ratings. |
| Bug | #5667 | Newsletter was resent to recipients that already had received the same newsletter. |

* * *

#### Release 2022-34

**Release date**: 10-04-2022

| **Type** | **Issue no** | **Description** |
| --- | --- | --- |
| Bug | #5730 | Fixed data in private customers export. |
| Enhancement | #5722 | Setting for turning on/off decimal rounding on line item prices. |

* * *

#### Release 2022-33

**Release date**: 09-27-2022

| **Type** | **Issue no** | **Description** |
| --- | --- | --- |
| Enhancement | #5481 | Add support for logging hours on projects (only through API). |
| UI for viewing TimeEntries (logged hours) on projects. |  |  |

* * *

#### Release 2022-32

**Release date**: 09-20-2022

| **Type** | **Issue no** | **Description** |
| --- | --- | --- |
| Bug | #5609 | Reallocation: Exclude certain products and/or product categories from stores. |
| Enhancement | #5506 | Allow reallocation to exclude certain warehouses. |
| Bug | #5576 | Possible to create new customer group in UI. |
| Enhancement | #5534 | Order receipt PDF and invoice PDF: Possible to override document footer on Market. |
| Enhancement | #5551 | UI customer list: ID is now a valid link and it is possible to use "Open in new tab" etc. |
| Enhancement | #5577 | API endpoint privateCustomer/Anonymize now includes delete customer club membership. |

* * *

#### Release 2022-31

**Release date**: 09-13-2022

| **Type** | **Issue no** | **Description** |
| --- | --- | --- |
| Enhancement | #5486 | Now able to filter orders by payment transaction type, payment transaction status, payment transaction date. |
| Enhancement | #5493 | Link to related purchase order in delivery view. |
| Bug | #5459 | API - Fix when updating line item quantity using UpdateCartQuantityByOrderLineId. |
| Bug | #5508 | Resolved rounding issue when returning items part of a 3 for 2 campaign. |

* * *

#### Release 2022-12

**Release date**: 12.20.2022

| Type | Issue no | Description |
| --- | --- | --- |
| Enhancement | #4457 | Now able to merge products via the Omnium UI. |
| Enhancement | #4497 | Added endpoint PatchMany for multiple product patches. |
| Enhancement | #4475 | Showing payment status in order information in GUI: Authorized, Captured, Partially captured, etc. |
| Enhancement | #4499 | Possible to suppress notifications for single carts / orders throughout the order process. |
| Enhancement | #4462 | Now able to specify custom username/user id with request header "X-Actor-Name" for API requests. |
| Enhancement | #4530 | Magento integration improvements. |
| Enhancement | #4503 | Improved payment view. |
| Enhancement | #4461 | Project search improvements. |
| Hotfix | #4571 | Project numbers now shown in project list. |
| Hotfix | #4627 | Deleted customers will be deleted from customer segments. |

* * *

#### Release 2022-11

**Release date**: 03.22.2022

| Type | Issue no | Description |
| --- | --- | --- |
| Enhancement | #4385 | Improved project free text search relevance. |
| Hotfix | #4373 | Possible to allocate separate purchase order line items to warehouse. Makes it possible to have multiple warehouses on the same delivery. Also added possibility to split purchase order line items in GUI. |
| Hotfix | #4379 | Vision Point integration improvements. |

* * *

#### Release 2022-10

**Release date**: 03.15.2022

| Type | Issue no | Description |
| --- | --- | --- |
| Enhancement | #4350 | Ensure API is always returning the latest version when an update has recently been made. |

* * *

#### Release 2022-09

**Release date**: 03.08.2022

| Type | Issue no | Description |
| --- | --- | --- |
| Bug | #4349 | Fixed store select validation |
| Enhancement |  | Jetshop integration |
| Enhancement | #4340 | Unique payment terms by customer |
| Bug | #4352 | TripleTex invoice rounding issue |

* * *

#### Release 2022-08

**Release date**: 03.01.2022

| Type | Issue no | Description |
| --- | --- | --- |
|  |  |  |

* * *

#### Release 2022-07

**Release date**: 02.22.2022

| Type | Issue no | Description |
| --- | --- | --- |
| Enhancement | #4311 | Store page, possible to render map without Omnium styling. |

* * *

#### Release 2022-06

**Release date**: 02.15.2022

| Type | Issue no | Description |
| --- | --- | --- |
| Enhancement | #4267 | Version list improvements |
| Enhancement | #4268 | Global search wild card relevancy and wild card improvements, Global search performance improvements |
| Enhancement | #4279 | Additional configurable gift card settings |
| Enhancement | #4276 | Ongoing integration - Order sync |
| Enhancement | #4253 | inRiver import: Map resource metafiles: AssetType to Omnium AssetType and ResourceName to Omnium asset name. |
| Enhancement | #4282 | D365 integration improvements |
| Bug | #4284 | Fix in order line reports |

* * *

#### Release 2022-05

**Release date**: 02.09.2022

| Type | Issue no | Description |
| --- | --- | --- |
| Enhancement | #4174 | Ongoing integration - purchase order sync |
| Enhancement | #4244 | Event log for customer club member |
| Enhancement | #4178 | Customer club: Reminder sms |
| Enhancement | #4235 | Possible to search for ratings with market filter |
| Bug |  | Lindbak integration issues |

* * *

#### Release 2022-04

**Release date**: 02.04.2022

| Type | Issue no | Description |
| --- | --- | --- |
| Enhancement | #4221 | D365 integration improvements |
| Enhancement | #4160 | Order filter for expected delivery date on order lines |
| Bug | #4220 | Minor product category GUI fix |
| Enhancement | #4067 | Upgrade to .NET 6 |

* * *

#### Release 2022-03

**Release date**: 01.31.2022

| Type | Issue no | Description |
| --- | --- | --- |
| Enhancement | #4198 | Order list UI improvements |
| Enhancement | #4208 | Updating category properties will now be synchronized to products |

* * *

#### Release 2022-02

**Release date**: 01.18.2022

| Type | Issue no | Description |
| --- | --- | --- |
| Enhancement | #4150 | Improved handling of returned replacement orders |
| Enhancement | #3655 | Monthly customer club member PDF report available |

* * *

#### Release 2022-01

**Release date**: 01.11.2022

| Type | Issue no | Description |
| --- | --- | --- |
| Enhancement | #3933 | Improvements in customer club member report |
| Enhancement | #4136 | Advanced facets |
| Enhancement | #4139 | New features for NexStep integration |
| Enhancement | #4140 | Explicitly remove products without any valid prices for store, market and market group ID |
