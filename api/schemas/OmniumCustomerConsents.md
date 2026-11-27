# OmniumCustomerConsents

A single entry in a batch consent request: the customer to update and the consents to add for that customer.

**Fields:**

- `customerId`: string, nullable — Id of the customer the consents should be added to.
- `consents`: List<[`OmniumConsent`](OmniumConsent.md)>, nullable — Consents to add for the customer. Existing consents of the same type are updated.

**Used directly by endpoints in:**

- [Customers | B2C](../endpoints/customers/b2c.md)
