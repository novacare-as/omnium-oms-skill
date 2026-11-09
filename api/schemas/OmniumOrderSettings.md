# OmniumOrderSettings

**Fields:**

- `shouldOrderStoreIdBeSavedOnCustomer`: boolean
- `shouldOrderMarketIdBeSavedOnCustomer`: boolean
- `shouldOrderExternalIdsBeSavedOnCustomer`: boolean
- `shouldCustomerExternalIdsBeSavedOnOrder`: boolean
- `shouldOrderPropertiesBeSavedOnCustomer`: boolean
- `shouldCustomerPropertiesBeSavedOnOrder`: boolean
- `isOrderCalculatorRunOnImport`: boolean
- `giftCardTemplate`: string, nullable
- `giftCardSku`: string, nullable
- `giftCardCompletedStatus`: string, nullable
- `defaultExchangeTerms`: string, nullable
- `returnSettings`: [`OmniumReturnSettings`](OmniumReturnSettings.md)
- `replacementSettings`: [`OmniumReplacementSettings`](OmniumReplacementSettings.md)
- `showOrderTotalsExTax`: boolean
- `showOrderLinesExTax`: boolean
- `uneditableExternalIDs`: boolean
- `availableManualWorkflowSteps`: List<[`OmniumOrderWorkflowStep`](OmniumOrderWorkflowStep.md)>, nullable, max length 250
- `defaultReplacementOrderType`: string, nullable — If set, replacement orders that are created will get this type. If not set, the type will be inherited from the order that was replaced
- `tagSettings`: List<[`OmniumTagSettings`](OmniumTagSettings.md)>, nullable, max length 250
- `includedOrderTypesForRevenueStats`: List<string>, nullable, max length 250 — If set, these order types will be included in key numbers, average order values and revenue stats. If not set, default order types 'Pos' and 'Online' will be used.
- `useStatsOrderQueues`: boolean — If set, orders will be copied to statsOrders
- `orderLineSettings`: [`OmniumOrderLineSettings`](OmniumOrderLineSettings.md)
- `isInvoiceOriginal`: boolean

**Used directly by endpoints in:**

- [Settings](../endpoints/settings.md)
