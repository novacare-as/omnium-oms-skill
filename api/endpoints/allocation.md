# Allocation

Source: https://api.omnium.no/documentation

> Ask the allocation engine where an order or basket should ship from, without changing anything.

Generated from the Omnium OpenAPI spec by `scripts/sync-api.ts` — do not edit by hand.
Common conventions and standard error responses (429, 500) are in `api/_INDEX.md`.

---

## `POST /api/Allocation/Simulate`

**Work out where an order or basket should ship from. Nothing is written: the order, the cart and inventory are all left as they are.**

Operation ID: `AllocationSimulate`

Send exactly one subject: {orderId} or {cartId} for something already in Omnium, or
{order} or {cart} for a basket that is not. A checkout normally sends the basket.

The primary profile decides {selectedPlan} and is always the first ranking: the order's or
cart's {requestedAllocationProfileKey}, otherwise the default profile in the allocation
settings for the market and sales store, otherwise {Balanced}. Name more {profileKeys}
to get more rankings from one run, after the primary one: the plans are worked out once and each
profile only contributes an order over them, so asking for three costs little more than asking
for one.

Set {trigger} to {Reallocation} to answer as a reallocation would, so the rules scoped to
reallocation take part. It defaults to {InitialAllocation}.

A checkout that already holds its own availability can pass it as {inventoryOverrides} and
skip Omnium's inventory read.

**Request body:** [`OmniumAllocationSimulationRequest`](../schemas/OmniumAllocationSimulationRequest.md)

**Responses:**

- 200: [`OmniumAllocationResult`](../schemas/OmniumAllocationResult.md) — Success
- 400: Bad Request
- 404: Not Found
