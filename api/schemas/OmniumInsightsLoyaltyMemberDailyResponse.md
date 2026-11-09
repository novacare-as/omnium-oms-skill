# OmniumInsightsLoyaltyMemberDailyResponse

Daily new-member registrations for the Insights API.
Store granularity uses the first entry of Customer.StoreIds; customers with an empty StoreIds list
emit StoreId = null and are filtered out when a storeId query parameter is provided.

**Fields:**

- `date`: string, nullable — The day this row covers, formatted as yyyy-MM-dd in the tenant's timezone.
- `storeId`: string, nullable — The internal Omnium store ID (first entry of Customer.StoreIds).
- `newMembers`: integer (int32) — New members with MemberSince on this day.

**Used directly by endpoints in:**

- [Insights](../endpoints/insights.md)
