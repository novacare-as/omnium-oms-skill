# OmniumProductConditionGroup

An AND/OR group of product conditions in a rule-based promotion. Read a group as "all of these" (And),
"any of these" (Or), "none of these" (Or with negate) or "not all of these" (And with negate).

**Fields:**

- `operator`: [`OmniumProductConditionLogicalOperator`](OmniumProductConditionLogicalOperator.md)
- `negate`: boolean — Inverts the group: the group holds when its conditions do not.
- `conditions`: List<[`OmniumProductCondition`](OmniumProductCondition.md)>, nullable, max length 250 — The conditions of the group.
- `groups`: List<[`OmniumProductConditionGroup`](OmniumProductConditionGroup.md)>, nullable, max length 250 — Groups inside the group, at most 10 levels deep.
