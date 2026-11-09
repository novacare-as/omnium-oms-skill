# Customer Club

Source: https://docs.omnium.no/docs/Customer/customer-club

> This guide explains the customer club functionality in Omnium. It covers both private and business customers, as well as how to use features like the Customer Club, track points, and update customer profiles. The API allows you to handle customer interactions efficiently.

## Customer Club — Feature Overview

The **Customer Club** in Omnium (requires an additional license) provides a loyalty and membership framework designed to enhance customer engagement and reward repeat purchases. When enabled, it offers:

### Key Capabilities

*   **Membership management**

    *   Create approved or pending memberships
    *   Track and update consents
    *   Access customer segmentation features
    *   Support for newsletters (additional license required)
*   **Bonus point system**

    *   Earn points on purchases
    *   Use points as a payment method via the BonusPoints provider
    *   Award **sign-up points** to new customers
    *   Support birthday points and point-expiration rules
*   **Checkout and cart logic**

    *   Automatic evaluation of membership status and consents
    *   Promotion and campaign compatibility even when Customer Club is disabled (limited functionality)

### API & Integration Features

*   Endpoints to create, update, and delete memberships
*   Access to customer point balances for payment flows
*   Support for pending memberships that can later be completed via a consent-approval flow

### Automated Notifications

*   Membership completion (for pending members)
*   Birthday points
*   Points expiring soon
*   Current point balance updates

### Workflow Integration

*   Workflow steps for calculating, earning, canceling, and capturing bonus points
*   Payment authorization and capture using the BonusPoints payment provider

## API Usage

*   If the **Customer Club** is enabled, use the **Customer Club Member** API endpoints to manage membership data.
*   If the feature is disabled, the `isCustomerClubMember` attribute in the customer data is used to check membership status. This provides limited functionality but still supports promotions and campaigns.

## Customer Club Model

For more details on the Customer Club structure, refer to the [Omnium Customer Club Member Model](https://api.omnium.no/documentation/index.html#/model-OmniumCustomerClubMember).

#### Customer Club Api

*   [Add approved member](https://api.omnium.no/documentation/index.html#/Customers%20%7C%20B2C/PrivateCustomersAddNewCustomerClubMemberWithConsentList). Use this when the customer is able to read and approve consents.
*   [Add pending member](https://api.omnium.no/documentation/index.html#/Customers%20%7C%20B2C/PrivateCustomersAddNewPendingCustomerClubMember). Use this if the customer is in a physical store and cannot approve consents online. This endpoint adds a pending membership. The customer can earn bonus points, but cannot use them until the consents are approved. Set up a notification in Omnium of type "CustomerClub-complete-membership". In this notification, you can send the customer an SMS with a link to your website where they can log in and approve consents.
*   [Update consents](https://api.omnium.no/documentation/index.html#/Customers%20%7C%20B2C/PrivateCustomersUpdateCustomerClubMemberConsentList). Update consents to "approved" or change consent preferences
*   [Delete membership](https://api.omnium.no/documentation/index.html#/Customers%20%7C%20B2C/PrivateCustomersRemoveCustomerClubMember). Delete the customer club membership. The private customer object is not deleted — only the customer club membership object and all related bonus points are removed.

#### Customer Club Notifications

*   CustomerClub-complete-membership: As described above, this can be used to send the customer a link for approving consents online. If configured, it will be triggered when using the Add pending membership endpoint.
*   CustomerClub-birthday-points: If birthday points are configured in the settings, this notification will be triggered on the customer’s birthday. It requires the **CustomerClubBirthdayScheduledTask** to be configured.
*   CustomerClub-points-expire: Based on the setting **Notification threshold for points expiration**, this notification sends the customer an email with details about bonus points that are about to expire. Require the **CustomerClubExpireSoonNotificationScheduledTask** to be configured.
*   CustomerClub-points-balance: Gives the customer a email with it's bonus point balance. Settings used for this is **Lowest point balance** (min balance before sending notification) and **Minimun days between notifications** (how often should the customer get this notification).

#### Bonus points and workflow steps

##### Earn bonus points

Make sure to configure setting for **Default bonus level** and **Days in which points are valid**

*   Customer Club - Calculate new points on hold: This workflow step should be added to your first order status. It calculates the bonus points the customer will earn for the order.
*   Customer Club - Move from on hold to earned points: This workflow step should be added to your status when order is completed. It moves points on hold to earned.
*   Customer Club - Cancel new points on hold: This workflow step should be added to your status when order is completed and on canceled status. It cancels all points earned on items that will not be shipped.

##### Use bonus points as payment

*   Configure a bonus point payment provider: Add a new payment provider in settings. Use the Provider: **BonusPoints** and set also **BonusPoints** as payment method name. In your checkout on the ecom site, use [Get customer club member](https://api.omnium.no/documentation/index.html#/Customers%20%7C%20B2C/PrivateCustomersGetCustomerClubMember). If customer is a member, you can use the **currentBalance** for payment.

*   [Add payment](https://api.omnium.no/documentation/index.html#/Carts%20%7C%20Checkout/CartAddPaymentToCart). Set **paymentMethodName** to "BonusPoints" and **TransactionType** to "AwaitingAuthorization". Here is a example:

```json
{
    "amount": 89,
    "paymentMethodName": "BonusPoints",
    "status": "Processed",
    "transactionId": "eac499a4-71e6-4217-a9f8-73c860a6b027",
    "transactionType": "AwaitingAuthorization",
    "created": "2025-08-22T11:30:27.717+00:00"
}
```

*   Add workflow step **Authorize payment** on your first order status as the first step. This will check the customers point balance and change the payment to "Authorization".
*   The **BonusPoints** payment provider acts as a standard payment provider like Klarna, Adyen etc. So if you have added workflow step "Capture payment", bonus points will be capture when order is completed. Same for credit.

* * *
