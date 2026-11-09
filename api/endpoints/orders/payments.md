# Orders | Payments

Source: https://api.omnium.no/documentation

> Payments

Generated from the Omnium OpenAPI spec by `scripts/sync-api.ts` — do not edit by hand.
Common conventions and standard error responses (429, 500) are in `api/_INDEX.md`.

---

## `POST /api/Orders/{orderId}/AddPayments`

**Add new payments to an existing order. Will overwrite payments with matching Id, and add payments where no exiting payment with matching Id exists. NB! Payments with Id null will always be appended to payment list.**

Operation ID: `OrdersAddPayments`

Sample request for adding payments to an order:

     POST /api/orders/EPIC000001/AddPayments
     {
	        "payments": [
		        {
			        "amount": 100.0,
			        "authorizationCode": "123456",
			        "customerName": "John Doe",
			        "id": "abc123",
		    	    "paymentMethodName": "Klarna",
		    	    "paymentType": "Invoice",
		    	    "status": "Processed",
		        	"transactionId": "xyz789",
		        	"transactionType": "Authorization",
		        	"properties": [
			    	    {
			    		    "key": "Property1",
			    		    "value": "Value1"
			       	    },
			    	    {
			       		    "key": "Property2",
			    		    "value": "Value2"
			    	    }
		    	    ],
			        "paidDate": "2021-10-01T00:00:00Z",
			        "created": "2021-09-01T00:00:00Z",
			        "isManuallyAdded": false,
			        "comment": "Payment for order #123",
			        "internalReference": "123",
			        "reason": "Payment for order #123"
		        }
	        ]
     }

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `orderId` | path | string | Yes | The ID of the existing order. (Required) |

**Request body:** List<[`OmniumPayment`](../../schemas/OmniumPayment.md)> — A list of payments to add to the order. (Required)

**Responses:**

- 200: [`OmniumOrder`](../../schemas/OmniumOrder.md) — The payments were added to the order, and the updated order is returned.
- 400: string — The order ID or payments are invalid.
- 404: string — The order does not exist.
- 409: [`ProblemDetails`](../../schemas/ProblemDetails.md) — Conflict

---

## `PUT /api/Orders/{orderId}/AddPayments`

**Add new payments to an existing order. Will overwrite payments with matching Id, and add payments where no exiting payment with matching Id exists. NB! Payments with Id null will always be appended to payment list.**

Operation ID: `OrdersAddPaymentToOrder` · **Deprecated**

Sample request for adding payments to an order:

     PUT /api/orders/EPIC000001/AddPayments
     {
	        "payments": [
		        {
			        "amount": 100.0,
			        "authorizationCode": "123456",
			        "customerName": "John Doe",
			        "id": "abc123",
		    	    "paymentMethodName": "Klarna",
		    	    "paymentType": "Invoice",
		    	    "status": "Processed",
		        	"transactionId": "xyz789",
		        	"transactionType": "Authorization",
		        	"properties": [
			    	    {
			    		    "key": "Property1",
			    		    "value": "Value1"
			       	    },
			    	    {
			       		    "key": "Property2",
			    		    "value": "Value2"
			    	    }
		    	    ],
			        "paidDate": "2021-10-01T00:00:00Z",
			        "created": "2021-09-01T00:00:00Z",
			        "isManuallyAdded": false,
			        "comment": "Payment for order #123",
			        "internalReference": "123",
			        "reason": "Payment for order #123"
		        }
	        ]
     }

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `orderId` | path | string | Yes | The ID of the existing order. (Required) |

**Request body:** List<[`OmniumPayment`](../../schemas/OmniumPayment.md)> — A list of payments to add to the order. (Required)

**Responses:**

- 200: [`OmniumOrder`](../../schemas/OmniumOrder.md) — The payments were added to the order, and the updated order is returned.
- 400: string — The order ID or payments are invalid.
- 404: string — The order does not exist.
- 409: [`ProblemDetails`](../../schemas/ProblemDetails.md) — Conflict

---

## `PUT /api/Orders/{orderId}/PutPayments`

**Set payments on an existing order. Will overwrite full list of payments**

Operation ID: `OrdersPutPaymentsOnOrder`

Sample request for setting payments to an order:

     PUT /api/orders/EPIC000001/PutPayments
     {
	        "payments": [
		        {
			        "amount": 100.0,
			        "authorizationCode": "123456",
			        "customerName": "John Doe",
			        "id": "abc123",
		    	    "paymentMethodName": "Klarna",
		    	    "paymentType": "Invoice",
		    	    "status": "Processed",
		        	"transactionId": "xyz789",
		        	"transactionType": "Authorization",
		        	"properties": [
			    	    {
			    		    "key": "Property1",
			    		    "value": "Value1"
			       	    },
			    	    {
			       		    "key": "Property2",
			    		    "value": "Value2"
			    	    }
		    	    ],
			        "paidDate": "2021-10-01T00:00:00Z",
			        "created": "2021-09-01T00:00:00Z",
			        "isManuallyAdded": false,
			        "comment": "Payment for order #123",
			        "internalReference": "123",
			        "reason": "Payment for order #123"
		        }
	        ]
     }

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `orderId` | path | string | Yes | The ID of the existing order. (Required) |

**Request body:** List<[`OmniumPayment`](../../schemas/OmniumPayment.md)> — A list of payments to set on the order. (Required)

**Responses:**

- 200: [`OmniumOrder`](../../schemas/OmniumOrder.md) — The payments were set on the order.
- 400: string — The order ID or payments are invalid.
- 404: string — The order does not exist.
- 409: [`ProblemDetails`](../../schemas/ProblemDetails.md) — Conflict

---

## `GET /api/Orders/{orderId}/GetPaymentOptions`

**Get valid payment options for a order.**

Operation ID: `OrdersGetPaymentOptions`

Based on order market, this will return valid payment options. If order has storeId we will also filter on store

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `orderId` | path | string | Yes | Order id |

**Responses:**

- 200: List<[`OmniumPaymentOption`](../../schemas/OmniumPaymentOption.md)> — A list of payment options
- 400: string — Bad Request
- 404: string — Order or payment options not found

---

## `POST /api/Orders/{orderId}/CreditPayment`

**Credit (refund) a payment on an order through the payment provider.**

Operation ID: `OrdersCreditPayment`

The credit is sent to the payment provider identified by paymentMethodName, and the resulting
credit transaction is added to the order's payment list. The result is returned even when the
provider rejects the credit - check success and errorMessage in the response.

Use lineItemIds to credit specific order lines (for providers that support line-level refunds,
and to distribute the credited amount on the order lines), or shipmentId to credit shipping cost
for a specific shipment. Both can be omitted when crediting an amount only.

Sample request:

    POST /api/orders/EPIC000001/CreditPayment
    {
        "paymentMethodName": "Vipps",
        "transactionId": "xyz789",
        "amount": 100.0,
        "comment": "Refund for damaged item",
        "reason": "Damaged item",
        "storeId": "STORE-1",
        "lineItemIds": [ "lineItem-1" ]
    }

| Param | In | Type | Required | Description |
|-------|----|------|----------|-------------|
| `orderId` | path | string | Yes | The ID of the order to credit. (Required) |

**Request body:** [`OmniumCreditPaymentRequest`](../../schemas/OmniumCreditPaymentRequest.md) — The credit request. PaymentMethodName and TransactionId are required.

**Responses:**

- 200: [`OmniumCreditPaymentResult`](../../schemas/OmniumCreditPaymentResult.md) — The credit was processed, and the result from the payment provider is returned.
- 400: string — The request is invalid, or no payment provider was found.
- 404: string — The order does not exist.
- 409: [`ProblemDetails`](../../schemas/ProblemDetails.md) — Conflict

---

## `POST /api/PaymentReport`

**Get payment report with payment transactions**

Operation ID: `PaymentReportSearchPaymentTransactions`

**Request body:** [`OmniumPaymentReportSearchRequest`](../../schemas/OmniumPaymentReportSearchRequest.md) — Search request

**Responses:**

- 200: [`OmniumPaymentTransactionOmniumSearchResult`](../../schemas/OmniumPaymentTransactionOmniumSearchResult.md) — Search successful, returning payment transactions
- 400: string — Search request invalid

---

## `POST /api/PaymentReport/SearchPaymentTransactionsByDateAndPaymentMethod`

**Get payment report aggregated by date, store and payment method**

Operation ID: `PaymentReportSearchPaymentTransactionsByDateAndPaymentMethod`

**Request body:** [`OmniumPaymentReportSearchRequest`](../../schemas/OmniumPaymentReportSearchRequest.md) — Search request

**Responses:**

- 200: [`OmniumPaymentSummaryOmniumSearchResult`](../../schemas/OmniumPaymentSummaryOmniumSearchResult.md) — Search successful, returning payment transactions
- 400: string — Search request invalid
