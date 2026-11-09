# OmniumZReport

Represents a Z-Report, a financial summary report generated when closing a cash register or POS terminal.
Contains sales, returns, payment methods, and cash management information for a specific register period.

**Fields:**

- `zreportId`: string, nullable — Unique identifier for this Z-Report.
- `zReportNumber`: integer (int64), nullable — The register's running Z-Report number. Null for reports from a connected POS system that does not number them.
- `companyName`: string, nullable — Name of the company operating the store.
- `storeId`: string, nullable — Unique identifier of the store where this report was generated.
- `storeName`: string, nullable — Name of the store where this report was generated.
- `registerId`: string, nullable — Unique identifier of the register (cash register/POS terminal) that generated this report.
- `dateCreated`: string (date-time) — Date and time when the Z-Report was created/generated.
- `vatNumber`: string, nullable — VAT registration number or company identifier used for tax purposes.
- `user`: string, nullable — Name of the staff member who operated the register or generated this report.
- `address`: [`OmniumAddress`](OmniumAddress.md)
- `currencyCode`: string, nullable — Primary currency code for this register (ISO 4217 three-letter code, e.g., "USD", "EUR", "SEK").
- `comment`: string, nullable — Optional comment or notes entered by staff when closing the register.
- `discountSales`: List<[`OmniumDiscountSale`](OmniumDiscountSale.md)>, nullable — Discounts applied to sales transactions during this register period.
- `discountRefunds`: List<[`OmniumDiscountRefund`](OmniumDiscountRefund.md)>, nullable — Discounts applied to return/refund transactions during this register period.
- `productGroupings`: List<[`OmniumProductGroupings`](OmniumProductGroupings.md)>, nullable — Sales grouped by product category or product group. A product group with items at several VAT rates is listed once per rate, each entry stating its rate in VatValue.
- `productGroupRefunds`: List<[`OmniumProductGroupRefund`](OmniumProductGroupRefund.md)>, nullable — Refunds/returns grouped by product category or product group. A product group with items at several VAT rates is listed once per rate, each entry stating its rate in VatValue.
- `vatGroups`: List<[`OmniumVatGroup`](OmniumVatGroup.md)>, nullable — Sales grouped by VAT rate or tax code.
- `vatGroupRefunds`: List<[`OmniumVatGroupRefund`](OmniumVatGroupRefund.md)>, nullable — Refunds/returns grouped by VAT rate or tax code.
- `receiptCount`: integer (int32) — Total number of receipts printed during this register period.
- `drawerOpenings`: integer (int32) — Number of times the cash drawer was manually opened (excluding automatic openings during transactions).
- `sales`: [`OmniumZReportTotal`](OmniumZReportTotal.md)
- `salesTotalNet`: number (decimal) — The net sales amount (excluding VAT/tax).
- `salesItemsCount`: integer (int32) — Total number of individual items sold (not transactions, but actual product units).
- `returns`: [`OmniumZReportTotal`](OmniumZReportTotal.md)
- `refundTotalNet`: number (decimal) — The net refund amount (excluding VAT/tax).
- `refundItemsCount`: integer (int32) — Total number of individual items refunded (not transactions, but actual product units).
- `grandZReportTotal`: [`OmniumZReportTotal`](OmniumZReportTotal.md)
- `grandTotalSales`: number (decimal) — The total gross money value for all sales.
- `grandTotalRefund`: number (decimal) — The total gross money value for all refunds.
- `roundOff`: number (decimal) — Rounding adjustment applied to transactions (e.g., for cash payments that need rounding to nearest coin).
- `summarySalesTax`: number (decimal) — Total sales tax/VAT amount in the summary.
- `summaryRoundOff`: number (decimal) — Total rounding adjustments in the summary.
- `summarySubtotal`: number (decimal) — Subtotal amount before tax and rounding adjustments.
- `salesTaxesSales`: List<object>, nullable — Detailed sales tax breakdown for sales transactions (format varies by POS system).
- `salesTaxesRefund`: List<object>, nullable — Detailed sales tax breakdown for refund transactions (format varies by POS system).
- `currencyConversions`: List<[`OmniumCurrencyConversions`](OmniumCurrencyConversions.md)>, nullable — Foreign currency conversion details for registers handling multiple currencies.
- `payments`: List<[`OmniumZReportPayment`](OmniumZReportPayment.md)>, nullable — Payment methods used for sales transactions during this register period.
- `paymentRefunds`: List<[`OmniumPaymentRefund`](OmniumPaymentRefund.md)>, nullable — Payment methods used for refund transactions during this register period.
- `salesType`: [`OmniumSalesType`](OmniumSalesType.md)
- `practice`: [`OmniumPractice`](OmniumPractice.md)
- `cashManagement`: [`OmniumCashManagement`](OmniumCashManagement.md)

**Used directly by endpoints in:**

- [POS | Reports](../endpoints/pos/reports.md)
