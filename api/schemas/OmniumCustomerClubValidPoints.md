# OmniumCustomerClubValidPoints

Class with information about valid points, and expire date

**Fields:**

- `pointAmount`: number (decimal) — Amount of points valid for this periode
- `created`: string (date-time) — When points was generated
- `expireDate`: string (date-time) — When points will expire
- `validFrom`: string (date-time), nullable — Set while the points are pending, and holds the date they become available for usage. These points are counted in the summary's PendingPoints, not in CurrentBalance. Null when the points are already available
- `orderId`: string, nullable — OrderId for this points. Can be empty if manually given
- `skuIds`: List<string>, nullable — ProductIds for this points, Can be empty if manually given
