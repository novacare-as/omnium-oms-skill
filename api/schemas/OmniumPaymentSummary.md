# OmniumPaymentSummary

Payment summary report

**Fields:**

- `paymentDate`: string (date-time) — Payment date
- `orderStoreId`: string, nullable — Order store id
- `paymentMethod`: string, nullable — payment method
- `totalInclVat`: number (decimal) — Total incl VAT
- `totalExclVat`: number (decimal) — Total excl VAT
- `totalCreditedInclVat`: number (decimal) — Total credited incl VAT
- `totalCreditedExclVat`: number (decimal) — Total credited excl VAT
- `taxRates`: List<[`OmniumPaymentSummaryTaxRate`](OmniumPaymentSummaryTaxRate.md)>, nullable — Total captured and credited per tax rate
