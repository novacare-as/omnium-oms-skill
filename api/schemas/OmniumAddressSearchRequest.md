# OmniumAddressSearchRequest

Search request object for OmniumAddress

**Fields:**

- `purposes`: List<string>, nullable, max length 250 — Address must contain at least one of the supplied purposes
- `zipCodeRanges`: List<[`OmniumZipCodeRange`](OmniumZipCodeRange.md)>, nullable — Zip code of address must be within one of the supplied ranges
