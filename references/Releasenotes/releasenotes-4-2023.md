# 2023

Source: https://docs.omnium.no/docs/Releasenotes/releasenotes-4-2023

> Key updates, bug fixes, and improvements for Omnium in 2023, detailed week by week.

#### Release 2023-80

**Release date**: 13 Dec 2023

| **Type** | **Issue no** | **Description** |
| --- | --- | --- |
| Enhancement | #10535 | Notifications - Possible to create notification templates for orders, order comments, customer comments, and project comments. Templates can be configured for each market or market group. |
| Enhancement | #10733 | Stores - Added date planner to stores for storing separate dates. |
| Enhancement | #10637 | Orders - New workflow step for verifying that an order has any payments (disregarding payment amount). |
| Enhancement | #10644 | Orders - New workflow step for tagging an order with the payment method name. |
| Enhancement | #10668 | Inventory - Labels virtual inventory transactions in UI. |
| Enhancement | #10705 | Users - Tag users with no access to highlight missing access rights. |

* * *

#### Release 2023-79

**Release date**: 05 Dec 2023

| **Type** | **Issue no** | **Description** |
| --- | --- | --- |
| Enhancement | #10508 | Inventory - User interface for unallocated inventory for Virtual Stock Locations. |
| Enhancement | #9990 | Inventory - Unallocated inventory for Virtual Stock Locations. |
| Enhancement | #10322 | Inventory - New rule engine for automatic allocation of inventory to virtual warehouses. |
| Enhancement | #10286 | Inventory - User interface for creating inventory rules for virtual stock locations. |
| Enhancement | #9979 | Inventory - Add support for virtual inventory for Virtual Stock Locations. |
| Enhancement | #10615 | Inventory - Dynamic inventory rules for dynamic redistribution of inventory between virtual warehouses. |
| Enhancement | #9986 | Purchase orders - Add support for virtual inventory allocations on purchase orders. |
| Enhancement | #10356 | Purchase orders - API goods reception for purchase orders with virtual inventory allocations. |
| Enhancement | #10153 | Cart - Possible to select customer relations delivery and billing address in cart. |
| Enhancement | #10421 | Cart - Possible to select different unit of measurement in cart from GUI and API. |
| Enhancement | #10457 | Cart - New endpoint added for adding personal discount coupons to cart with unique coupon id. |
| Enhancement | #10599 | Orders - Order properties now searchable in GUI. |
| Enhancement | #9984 | Orders - Inventory reservations for Virtual Stock Locations. |
| Enhancement | #10368 | TimeSpan is now described/mapped as a string("00:00:00") in OpenAPI doc. This makes it possible to deserialize TimeSpan properties. |

* * *

#### Release 2023-78

**Release date**: 03 Nov 2023

| **Type** | **Issue no** | **Description** |
| --- | --- | --- |
| Enhancement | #8149 | Cart - New endpoint addManyItemsToCart in public API. |
| Enhancement | #10175 | Projects - Added terms to project type which will be visible on project print. |
| Enhancement | #10177 | Projects - Project type setting for hiding progress bar. |
| Enhancement | #10265 | Click and collect - Customer pickup date now visible in UI on click and collect orders. |
| Enhancement | #10287 | Tags settings - Validation of invalid characters added to UI. |
| Enhancement | #10293 | Products - Improved sorting of variants by sizes. Added support for more varieties of sizes. |

* * *

#### Release 2023-77

**Release date**: 24 Oct 2023

| **Type** | **Issue no** | **Description** |
| --- | --- | --- |
| Enhancement | #10033 | Analytics - Remember selected filters. |
| Enhancement | #10103 | Project list - Preview comments on project. |
| Enhancement | #10069 | Product - Update selector for related products. |

* * *

#### Release 2023-76

**Release date**: 17 Oct 2023

| **Type** | **Issue no** | **Description** |
| --- | --- | --- |
| Bug | #8985 | Tenant settings - Fix cache issue for markets. |
| Enhancement | #9895 | Products - Display custom product languages in language selector. |
| Enhancement | #9924 | Orders - Mass remove errors from orders based on error type. |
| Enhancement | #10001 | Voyado integration - Improved error handling on order export errors. It is now possible to separate the errors based on type. |
| Enhancement | #10051 | Roles - Deleted roles are removed from all entities. |
| Enhancement | #10070 | Analytics - New filter for promotions. |
| Enhancement | #10062 | Projects - Show when a project customer has multiple projects. |
| Enhancement | #10069 | Projects - Add pagination to project invoices. |

* * *

* * *

#### Release 2023-54

**Release date**: 07 Mar 2023

| **Type** | **Issue no** | **Description** |
| --- | --- | --- |
| Enhancement | #4908 | Newsletter A/B testing functionality added to the newsletter module. |
| Enhancement | #7383 | Size / color / brand available on copy of receipt. |
| Enhancement | #7387 | Size / Color now visible in product alert GUI. New report available for all product alert requests in report center. |
| Enhancement | #7391 | API - Support for including product description in product search result. |
| Enhancement | #7402 | Shipping method now visible in Picklist. |
| Enhancement | #7416 | Log event when externalId is set on customers through UI. |
| Enhancement | #7430 | Chart for revenue added under category statistics. |
| Enhancement | #7440 | If IsUsePickupCode setting is set on ClickAndCollect setting, a large pickup code (last 4 digits of order number) is displayed on Click and collect order print. |
| Bugfix | #7427 | Fix of quantum discount when there are several order lines with the same product variant. |

* * *

#### Release 2023-53

**Release date**: 01 Mar 2023

| **Type** | **Issue no** | **Description** |
| --- | --- | --- |
| Enhancement | #7249 | Better access control on Stores. Limit editing options on stores for non-admin users. |
| Enhancement | #7252 | Support for uploading attachments on business customers and setting a logo. |

* * *

#### Release 2023-52

**Release date**: 21 Feb 2023

| **Type** | **Issue no** | **Description** |
| --- | --- | --- |
| Enhancement | #6563 | Free text search for ratings in UI. |
| Enhancement | #7057 | UI for tasks on project parts and project change orders. |
| Enhancement | #7197 | Jetshop integration: Support import of products from Jetshop to Omnium. |
| Enhancement | #5012 | New queue system for improved newsletter send out. |

* * *

#### Release 2023-51

**Release date**: 14 Feb 2023

| **Type** | **Issue no** | **Description** |
| --- | --- | --- |
| Enhancement | #7174 | New endpoint for updating customer number on customer and all customer orders. |
| Enhancement | #7135 | Better control over which content is displayed on different project types. All tabs and components can be configured to be hidden. |
| Enhancement | #6978 | Updated Copy of receipt layout. Order lines are sorted per shipment, canceled order lines are marked with strikethrough. |
| Enhancement | #7127 | Added store roles. Roles can be added through store configuration and selected in edit store. |
| Enhancement | #6355 | Settings to control displayed sender of chat notifications on projects. |
| Bugfix | #6355 | Fixed incorrect number of sent notifications (SMS) in workflow summary. |

* * *

#### Release 2023-50

**Release date**: 07 Feb 2023

| **Type** | **Issue no** | **Description** |
| --- | --- | --- |
| Enhancement | #7054 | Now able to create API users within Omnium's UI. API user access level can be set on store level, market level, and on type level (product, order, inventory) and with read or write access. |

* * *

#### Release 2023-49

**Release date**: 31 Jan 2023

| **Type** | **Issue no** | **Description** |
| --- | --- | --- |
| Enhancement | #6541 | New Project workflow step setting for completing a project on the step. |
| Enhancement | #6977 | New project export including project form data. |
| Enhancement | #6976 | Support for sorting project search result on ProjectNumber when searching through API. |

* * *

#### Release 2023-48

**Release date**: 18 Jan 2023

| **Type** | **Issue no** | **Description** |
| --- | --- | --- |
| Enhancement | #6766 | Shipment gets canceled when all order lines are canceled. |
| Enhancement | #6796 | API - Splits OmniumProduct for product and variant. Can now choose to show properties in just one of the models, and we can do specific mapping for each of them. |

* * *

#### Release 2023-47

**Release date**: 18 Jan 2023

| **Type** | **Issue no** | **Description** |
| --- | --- | --- |
| Enhancement | #6766 | Shipment gets canceled when all order lines are canceled. |
| Enhancement | #6796 | API - Splits OmniumProduct for product and variant. Can now choose to show properties in just one of the models, and we can do specific mapping for each of them. |

* * *

#### Release 2023-46

**Release date**: 10 Jan 2023

| **Type** | **Issue no** | **Description** |
| --- | --- | --- |
| Enhancement | #6491 | Now possible to choose order status and notification template to send when resending notification from order. |

* * *
