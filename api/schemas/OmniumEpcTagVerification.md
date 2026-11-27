# OmniumEpcTagVerification

Outcome of a physical verification (spot check) of a tag: whether the tagged item was found and
confirmed as the store's own stock, when, where and by which device.

**Fields:**

- `status`: string, nullable — Well-known values: Confirmed (located, store's own stock), Rejected (located, not the store's stock), NotFound (could not be located). Custom values are allowed.
- `date`: string (date-time), nullable — When the check was done.
- `storeId`: string, nullable — Store where the check was done.
- `deviceId`: string, nullable — The device used for the check.
- `note`: string, nullable — Free-text remark from the person doing the check.
