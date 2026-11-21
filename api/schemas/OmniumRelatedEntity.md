# OmniumRelatedEntity

A typed link from a cart or order to another entity it depends on, e.g. an order added to a POS sale
("PaysFor") and, on that order, the POS order that paid for it ("PaidBy").

**Fields:**

- `type`: string, nullable — How the linked entity relates to this one, e.g. "PaysFor" or "PaidBy"
- `entity`: string, nullable — Kind of entity referenced, e.g. "Order"
- `id`: string, nullable — ID of the referenced entity
- `reference`: string, nullable — Human readable reference, e.g. the order number, for display without loading the entity
- `created`: string (date-time), nullable — When the link was created
