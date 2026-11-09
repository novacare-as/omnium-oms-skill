# OmniumAllocationResult

What the engine decided. The plans are shared by every ranking; a profile contributes an order
over them rather than a different set, so one call can answer several policies at once.

**Fields:**

- `requestId`: string, nullable — Identifies this run in the logs
- `outcome`: string, nullable — Simulated, NoFeasiblePlan, PartialPlanOnly, SkippedNotEnabled, SkippedNothingToAllocate or SkippedVslUnsupported
- `primaryProfileKey`: string, nullable — The profile that decided the selected plan
- `selectedPlan`: [`OmniumAllocationPlan`](OmniumAllocationPlan.md)
- `plans`: List<[`OmniumAllocationPlan`](OmniumAllocationPlan.md)>, nullable, max length 100 — Every feasible plan, in generation order. Rankings reference them by plan id
- `rankings`: List<[`OmniumAllocationRanking`](OmniumAllocationRanking.md)>, nullable, max length 10 — One ordered list per requested profile, the primary profile first
- `unallocatableLines`: List<[`OmniumAllocationUnallocatableLine`](OmniumAllocationUnallocatableLine.md)>, nullable, max length 500 — Lines no warehouse could serve, each with the reasons why
- `trace`: List<[`OmniumAllocationTraceEntry`](OmniumAllocationTraceEntry.md)>, nullable, max length 2000 — Only present when the request asked for it
- `configurationVersion`: string, nullable — The configuration this decision was made against, so a result can be traced back
- `totalMs`: integer (int64) — How long the engine took, in milliseconds

**Used directly by endpoints in:**

- [Allocation](../endpoints/allocation.md)
