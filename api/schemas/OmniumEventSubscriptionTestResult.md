# OmniumEventSubscriptionTestResult

Outcome of delivering a single test event to a subscription's destination.

**Fields:**

- `isSuccess`: boolean — True when the destination accepted the test event.
- `message`: string, nullable — Human readable summary of what happened.
- `errorMessage`: string, nullable — Why the delivery failed. Null when Omnium.Public.Events.Models.OmniumEventSubscriptionTestResult.IsSuccess is true.
- `responseContent`: string, nullable — Raw body returned by the destination, when it returned one.

**Used directly by endpoints in:**

- [Settings | Event Subscriptions](../endpoints/settings/event-subscriptions.md)
