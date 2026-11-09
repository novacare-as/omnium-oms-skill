# OmniumRelatedProduct

Representing a collection of related product items by a given key. A key could be "Siblings", "Accessories", etc

**Fields:**

- `key`: string, nullable — Key describing relation. E.g. "Siblings", "Accessories", etc...
- `translateKey`: string, nullable — TranslateKey used for translation in UI (but could of course also be used in your application)
- `relatedProductItems`: List<[`OmniumRelatedProductItem`](OmniumRelatedProductItem.md)>, nullable, max length 250 — Products related
