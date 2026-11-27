# Products | Categories

Source: https://api.omnium.no/documentation

> Product category information.

Generated from the Omnium OpenAPI spec by `scripts/sync-api.ts` — do not edit by hand.
Common conventions and standard error responses (429, 500) are in `api/_INDEX.md`.

---

## `GET /api/ProductCategories/{categoryId}`

**Get product category. Language code has to be specified, either in the id or in the language parameter. If not default value will be used.**

Operation ID: `ProductCategoriesGetCategory`

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `categoryId` | path | string | Yes | ID or categoryId, i.e. the id with or without language code ("123" or "123_no"). |
| `language` | query | string | No | Language code. If language code is not given in the id ("123"), then language code should be set ("no"). If language code is neither given in the id nor here, the category in default product language will be returned. |

**Responses:**

- 200: [`OmniumProductCategory`](../../schemas/OmniumProductCategory.md) — Category found and returned
- 400: string — Category ID is not valid
- 404: string — Category not found

---

## `PATCH /api/ProductCategories/{categoryId}`

**Patch a product category - update only values in request**

Operation ID: `ProductCategoriesPatchCategory`

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `categoryId` | path | string | Yes | Category ID to patch (id including language, e.g. "123_no") |

**Request body:** [`OmniumProductCategoryPatch`](../../schemas/OmniumProductCategoryPatch.md) — Patch request containing fields to update

**Responses:**

- 200: [`OmniumProductCategoryUpdateResult`](../../schemas/OmniumProductCategoryUpdateResult.md) — Product category updated successfully
- 400: string — Patch request is invalid
- 404: string — Product category not found

---

## `DELETE /api/ProductCategories/{categoryId}`

**Deletes a product category from the OMS**

Operation ID: `ProductCategoriesDelete`

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `categoryId` | path | string | Yes | ID of the category to delete (id including language) |

**Responses:**

- 200: Product category deleted
- 400: string — Product category ID is invalid
- 404: string — Product category does not exist

---

## `GET /api/ProductCategories`

**Get product categories. Returns all categories in all languages.**

Operation ID: `ProductCategoriesGetCategories`

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `pageSize` | query | integer (int32) | No | Number of items. Max page size is 1000 |
| `page` | query | integer (int32) | No | Page |
| `isMainCategory` | query | boolean | No | Optional. True returns only categories marked as main categories, false returns only categories that are not. Omit to return all categories |

**Responses:**

- 200: [`OmniumProductCategoryOmniumSearchResult`](../../schemas/OmniumProductCategoryOmniumSearchResult.md) — Categories found and returned
- 400: string — Search error

---

## `POST /api/ProductCategories`

**Add a new product category to the OMS**

Operation ID: `ProductCategoriesPost`

**Request body:** [`OmniumProductCategory`](../../schemas/OmniumProductCategory.md) — Product category to be added to the OMS. CategoryId is required. If language is not given, default product language will be set.

**Responses:**

- 201: Product category created
- 400: string — Product category is invalid

---

## `PUT /api/ProductCategories`

**Put a product category to the OMS, CAUTION: overwriting existing product category**

Operation ID: `ProductCategoriesPut`

**Request body:** [`OmniumProductCategory`](../../schemas/OmniumProductCategory.md) — Product category to be put to the OMS

**Responses:**

- 200: Product category updated
- 400: string — Product category is invalid

---

## `GET /api/ProductCategories/GetCategoryTree`

**Get product category tree**

Operation ID: `ProductCategoriesGetCategoryTree`

**Responses:**

- 200: List<[`OmniumProductCategoryTreeViewModel`](../../schemas/OmniumProductCategoryTreeViewModel.md)> — Product category tree found and returned
- 400: Search error
- 404: string — Not Found

---

## `POST /api/ProductCategories/GetCategoryTreeBySearch`

**Get product category tree by product search**

Operation ID: `ProductCategoriesGetCategoryTreeBySearch`

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `rootCategoryId` | query | string | No |  |

**Request body:** [`OmniumProductSearchRequest`](../../schemas/OmniumProductSearchRequest.md)

**Responses:**

- 200: List<[`OmniumProductCategoryTreeViewModel`](../../schemas/OmniumProductCategoryTreeViewModel.md)> — Product category tree found and returned
- 400: Search error
- 404: [`ProblemDetails`](../../schemas/ProblemDetails.md) — Not Found

---

## `GET /api/ProductCategories/{parentId}/SubCategories`

**Retrieves all immediate subcategories for a given parent category from the category index.**

Operation ID: `ProductCategoriesGetSubCategories`

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `parentId` | path | string | Yes | The ID of the parent category. For example, use the root category ID to fetch top-level categories. If the root category is not defined, you can pass "rootCategoryId" to retrieve the top-level categories. |
| `language` | query | string | No | Language code, e.g. no, en |

**Responses:**

- 200: List<[`OmniumProductCategory`](../../schemas/OmniumProductCategory.md)> — Sub categories found and returned
- 400: string — Parent ID is invalid

---

## `POST /api/ProductCategories/AddMany`

**Add many product categories to the OMS**

Operation ID: `ProductCategoriesAddMany`

**Request body:** List<[`OmniumProductCategory`](../../schemas/OmniumProductCategory.md)> — Product categories to be added to the OMS

**Responses:**

- 201: Product categories created
- 400: string — Product categories are invalid

---

## `PATCH /api/ProductCategories/PatchMany`

**Patch many product categories - update only values in request**

Operation ID: `ProductCategoriesPatchMany`

**Request body:** List<[`OmniumProductCategoryPatch`](../../schemas/OmniumProductCategoryPatch.md)> — List of patch requests. Id or CategoryId with Language is required to identify each category.

**Responses:**

- 200: [`OmniumProductCategoryUpdateResult`](../../schemas/OmniumProductCategoryUpdateResult.md) — Product categories updated successfully
- 400: string — Patch request is invalid

---

## `POST /api/ProductCategories/ScrollSearch`

**Scroll search categories. The response will contain a Scroll ID which can be used with the Scroll endpoint to fetch all remaining items. We accept max take size 10 000. Fallback to 5000 if greater than max, or not set**

Operation ID: `ProductCategoriesScrollSearch`

**Request body:** [`OmniumProductCategorySearchRequest`](../../schemas/OmniumProductCategorySearchRequest.md)

**Responses:**

- 200: [`OmniumProductCategoryOmniumSearchResult`](../../schemas/OmniumProductCategoryOmniumSearchResult.md) — Categories found and returned
- 400: [`ProblemDetails`](../../schemas/ProblemDetails.md) — Search error

---

## `GET /api/ProductCategories/Scroll/{id}`

**Scroll product categories is used to get a large amount of categories.**

Operation ID: `ProductCategoriesScroll`

The scroll Id can be obtained from a standard search request that supports scrolling.
           Scrolling is not intended for real time user requests, but rather for processing large amounts of data.

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `id` | path | string | Yes | The scroll id is passed on the request the next batch of data from the original request. |

**Responses:**

- 200: [`OmniumProductCategoryOmniumResult`](../../schemas/OmniumProductCategoryOmniumResult.md) — Success

---

## `PUT /api/Products/ProductCategories`

**Add product categories to products by IDs**

Operation ID: `ProductsAddCategoriesToProducts`

**Request body:** List<[`OmniumProductCategoryRelationsRequest`](../../schemas/OmniumProductCategoryRelationsRequest.md)>

**Responses:**

- 200: [`OmniumProductUpdateResult`](../../schemas/OmniumProductUpdateResult.md) — Success
- 204: Product categories added successfully
- 400: string — Request is invalid
