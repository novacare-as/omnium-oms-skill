# OmniumCustomerClubPointsSummary

Summary for customer club member. Balance, used points, reserved points etc

**Fields:**

- `currentBalance`: number (decimal) — Points available for usage
- `newPointsOnHold`: number (decimal) — Points created by orders that are not prosessed
- `pendingPoints`: number (decimal) — Points that are earned but not yet available for usage, because the accrual is delayed until the return window has passed. Not included in CurrentBalance
- `reservedPoints`: number (decimal) — Used points by orders that are not prosessed
- `totalIssuedPoints`: number (decimal) — Total issued points for this member
- `usedPoints`: number (decimal) — Total points used for this member
- `expiredPoints`: number (decimal) — Points that has expired, and can not be used any more
