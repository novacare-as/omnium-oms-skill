# OmniumSearchRatingRequest

Search request for ratings

**Fields:**

- `type`: string, nullable — The object class to get ratings from (e.g. BusinessCustomer, Product, etc)
- `objectId`: string, nullable — The object id to get ratings from (e.g. 12345)
- `parentObjectId`: string, nullable — Parent ID For product ratings this will be product.ParentId. Search for ratings where products share the same parentId
- `marketIds`: List<string>, nullable, max length 250 — List of marketids to filter on
- `storeIds`: List<string>, nullable, max length 1000 — List of storeIds to filter on
- `page`: integer (int32) — Page number, fallback to 1
- `take`: integer (int32) — Number of elements, fallback to 10
- `requiresAttention`: boolean, nullable — Filter on ratings that requires attention by customer service (no value -> all)
- `includeOnlyRatingsWithComments`: boolean, nullable — If true filter on ratings with comments.

**Used directly by endpoints in:**

- [Ratings](../endpoints/ratings.md)
