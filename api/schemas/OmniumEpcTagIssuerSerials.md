# OmniumEpcTagIssuerSerials

Numeric serials of one issuer, e.g. the single tags of a cluster result that carry its company prefix.

**Fields:**

- `companyPrefix`: string, nullable — The issuer's company prefix; empty for tags without one.
- `serials`: List<integer (int64)>, nullable — Numeric serials of the issuer's tags.
