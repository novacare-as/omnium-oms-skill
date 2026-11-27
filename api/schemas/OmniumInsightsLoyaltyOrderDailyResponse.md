# OmniumInsightsLoyaltyOrderDailyResponse

Daily order statistics split by customer-club membership for the Insights API.
Member status is captured at the time the order line was indexed, not as of today.
MemberOrders + NonMemberOrders equals TotalOrders from the Orders endpoint.

**Fields:**

- `date`: string, nullable — The day this row covers, formatted as yyyy-MM-dd in the tenant's timezone.
- `storeId`: string, nullable — The internal Omnium store ID.
- `memberOrders`: integer (int32) — Unique orders where Customer.IsCustomerClubMember = true at time of order.
- `memberRevenue`: number (decimal) — Sum of order-line ExtendedPrice (incl. VAT) for member orders.
- `nonMemberOrders`: integer (int32) — Unique orders where Customer.IsCustomerClubMember is false, missing, or no customer is attached (guest orders).
- `nonMemberRevenue`: number (decimal) — Sum of order-line ExtendedPrice (incl. VAT) for non-member and guest orders.

**Used directly by endpoints in:**

- [Insights](../endpoints/insights.md)
