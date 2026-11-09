# OmniumPaymentReportSearchRequest

Search request object for payment transactions

**Fields:**

- `createdFrom`: string (date-time), nullable — Transaction created date from
- `createdTo`: string (date-time), nullable — Transaction created date to
- `paidFrom`: string (date-time), nullable — Transaction paid date from
- `paidTo`: string (date-time), nullable — Transaction paid date to
- `storeIds`: List<string>, nullable, max length 1000 — Transaction store Ids
- `marketIds`: List<string>, nullable, max length 250 — Transaction market Ids
- `paymentMethodName`: string, nullable — Payment method
- `shipmentMethodName`: string, nullable — Shipment method name

**Used directly by endpoints in:**

- [Orders | Payments](../endpoints/orders/payments.md)
