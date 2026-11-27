# OmniumRating

Class for rating other entities, like products, customers, stores, etc

**Fields:**

- `id`: string, nullable — Rating ID
- `parentId`: string, nullable — Parent rating ID
- `date`: string (date-time) — Rated date
- `value`: integer (int32) — Rating score
- `type`: string, nullable — Rating type (E.g. Customer, Product, etc)
- `objectId`: string, nullable — ID of the object being evaluated (Partner ID, Product ID, etc)
- `parentObjectId`: string, nullable — Parent ID For product ratings this will be product.ParentId and can be used to set rating count and average for all products sharing the same parentId.
- `skuId`: string, nullable — SkuId of the object being evaluated (if product rating)
- `objectName`: string, nullable — Name of the object being evaluated (Product name, project name etc)
- `raterName`: string, nullable — Name of the rater
- `raterDisplayName`: string, nullable — Name of the rater. To be used on website. Can be only first name if DisplayOnlyFirstName is true. Else it will be same as RaterName
- `displayOnlyFirstName`: boolean — Display only firstname. To be used on website if user wants to be anonymous
- `raterId`: string, nullable — Rater ID (typical customer ID)
- `comment`: string, nullable — Rating comment
- `storeId`: string, nullable — Store ID
- `marketId`: string, nullable — Market ID
- `properties`: List<[`OmniumPropertyItem`](OmniumPropertyItem.md)>, nullable, max length 250 — Custom properties for any other rating info
- `imageUrl`: string, nullable — Product image
- `attentionRequired`: boolean, nullable — Requires attention by customer service
- `ratingReply`: [`OmniumRatingReply`](OmniumRatingReply.md)

**Used directly by endpoints in:**

- [Ratings](../endpoints/ratings.md)
