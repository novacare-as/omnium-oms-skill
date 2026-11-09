# OmniumCartTemplateSearchRequestModel

Cart templates search request

**Fields:**

- `take`: integer (int32) — Number of items to fetch. Defaults to 10
- `page`: integer (int32) — Current page (for paging). Defaults to 1
- `query`: string, nullable — Free text query
- `cartTemplateId`: string, nullable — Filter by cart template ID
- `cartTemplateName`: string, nullable — Filter by cart template name
- `salesPersonId`: string, nullable — Filter by sales person Id
- `createdFrom`: string (date-time), nullable — Filter by creation from date
- `createdTo`: string (date-time), nullable — Filter by creation to date

**Used directly by endpoints in:**

- [Carts | Templates](../endpoints/carts/templates.md)
