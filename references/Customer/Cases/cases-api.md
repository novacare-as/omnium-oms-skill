# API Reference

Source: https://docs.omnium.no/docs/Customer/Cases/cases-api

> Public API endpoints for managing cases — create, search, update, assign, change status, and delete.

## Endpoints

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/api/cases/{id}` | Get a case by ID |
| `POST` | `/api/cases` | Create a new case |
| `PUT` | `/api/cases` | Full update of a case |
| `PATCH` | `/api/cases` | Partial update (only non-null fields are applied) |
| `DELETE` | `/api/cases/{id}` | Delete a case (soft delete) |
| `POST` | `/api/cases/search` | Search cases with filters and pagination |
| `POST` | `/api/cases/{id}/assignto` | Assign a case to a user |
| `POST` | `/api/cases/{id}/changestatus` | Change the status of a case |

All endpoints require authentication. Read endpoints require case read access, while write operations (create, update, assign, delete) require case admin access.

## OmniumCase Model

The full case model returned by GET and search endpoints:

| Field | Type | Description |
| --- | --- | --- |
| `Id` | string | Unique case identifier |
| `CaseNumber` | string | Human-readable case number |
| `Subject` | string | Case title |
| `Description` | string | Case description |
| `Status` | string | Current status |
| `Priority` | string | Current priority |
| `Source` | string | Case origin (Email, Phone, Web, etc.) |
| `AssignedToUserId` | string | Assigned agent's user ID |
| `AssignedToName` | string | Assigned agent's display name |
| `CustomerId` | string | Linked customer ID |
| `CustomerName` | string | Customer display name |
| `CustomerEmail` | string | Customer email address |
| `Tags` | string\[\] | List of tags |
| `RelatedOrders` | string\[\] | Linked order IDs |
| `RelatedCustomers` | string\[\] | Linked customer IDs |
| `RelatedProjects` | string\[\] | Linked project IDs |
| `RelatedCarts` | string\[\] | Linked cart IDs |
| `RelatedSkuIds` | string\[\] | Related SKU IDs |
| `RelatedProductIds` | string\[\] | Related product IDs |
| `Participants` | OmniumCaseParticipant\[\] | Case participants |
| `CaseNotes` | OmniumComment\[\] | Public case notes (visible to customer) |
| `InternalNotes` | OmniumComment\[\] | Internal notes (staff only) |
| `Properties` | OmniumPropertyItem\[\] | Custom properties |
| `CaseStatusLog` | OmniumCaseStatusLogItem\[\] | Status change history |
| `FollowUpDate` | DateTime? | Follow-up reminder date |
| `ResolvedDate` | DateTime? | When the case was resolved |
| `ClosedDate` | DateTime? | When the case was closed |
| `LastCommentDate` | DateTime? | Date of the last comment (UTC) |
| `LastCommenterName` | string | Name of the last commenter |
| `CommentCount` | int | Total number of comments |
| `Created` | DateTime | Creation timestamp (UTC) |
| `Changed` | DateTime | Last modification timestamp (UTC) |
| `MarketId` | string | Market ID |
| `MarketGroupId` | string | Market group ID |

### OmniumCaseParticipant

| Field | Type | Description |
| --- | --- | --- |
| `Name` | string | Participant display name |
| `Email` | string | Participant email |
| `CustomerId` | string | Optional linked customer ID |
| `Role` | string | Role in the case |

### OmniumCaseStatusLogItem

| Field | Type | Description |
| --- | --- | --- |
| `Status` | string | Status name |
| `Timestamp` | DateTime | When the status was set |
| `DurationSincePreviousMs` | long? | Milliseconds since the previous status change (null for the first status) |

## OmniumCasePatch Model

Use PATCH for partial updates. Only non-null fields are applied:

| Field | Type | Description |
| --- | --- | --- |
| `Id` | string | **Required.** Case ID to update |
| `Subject` | string | Updated subject |
| `Description` | string | Updated description |
| `Status` | string | Updated status |
| `Priority` | string | Updated priority |
| `Source` | string | Updated source |
| `AssignedToUserId` | string | Updated assigned agent's user ID |
| `AssignedToName` | string | Updated assigned agent's display name |
| `CustomerName` | string | Updated customer name |
| `CustomerEmail` | string | Updated customer email |
| `CustomerId` | string | Updated customer ID |
| `Tags` | string\[\] | Updated tags |
| `RelatedOrders` | string\[\] | Updated related order IDs |
| `RelatedCustomers` | string\[\] | Updated related customer IDs |
| `RelatedProjects` | string\[\] | Updated related project IDs |
| `RelatedCarts` | string\[\] | Updated related cart IDs |
| `RelatedSkuIds` | string\[\] | Updated related SKU IDs |
| `RelatedProductIds` | string\[\] | Updated related product IDs |
| `Participants` | OmniumCaseParticipant\[\] | Updated participants |
| `Properties` | OmniumPropertyItem\[\] | Updated custom properties |
| `FollowUpDate` | DateTime? | Updated follow-up date |
| `MarketId` | string | Updated market ID |
| `MarketGroupId` | string | Updated market group ID |

Use PATCH for most updates. It's safer — you won't accidentally clear fields you didn't intend to change. See the [PATCH patterns section](../../GettingStartedWithAPI/api-developer-guide.md#updating-resources-patch) in the API Developer Guide for details.

## OmniumCaseSearchRequest

| Field | Type | Description |
| --- | --- | --- |
| `SearchText` | string | Free-text search across case number, subject, description, customer name |
| `Status` | string | Filter by status |
| `Priority` | string | Filter by priority |
| `AssignedToUserId` | string | Filter by assigned user |
| `Tags` | string\[\] | Filter by tags |
| `CustomerId` | string | Filter by linked customer |
| `OrderId` | string | Filter by linked order |
| `DateFrom` | DateTime? | Cases created after this date |
| `DateTo` | DateTime? | Cases created before this date |
| `SortOrder` | string | Sort field and direction |
| `Page` | int | Page number (zero-based) |
| `Take` | int | Results per page (default: 20) |
| `IncludeDeleted` | bool | Include soft-deleted cases |

### Sort Options

| Value | Description |
| --- | --- |
| `CreatedAscending` / `CreatedDescending` | Sort by creation date |
| `ChangedAscending` / `ChangedDescending` | Sort by last modified date |
| `StatusAscending` / `StatusDescending` | Sort by status |
| `PriorityAscending` / `PriorityDescending` | Sort by priority |
| `SubjectAscending` / `SubjectDescending` | Sort by subject |
| `CustomerNameAscending` / `CustomerNameDescending` | Sort by customer name |
| `AssignedToNameAscending` / `AssignedToNameDescending` | Sort by assignee name |
| `FollowUpDateAscending` / `FollowUpDateDescending` | Sort by follow-up date |

## Code Examples

### Create a Case

```
POST /api/cases
Content-Type: application/json

{
  "Subject": "Order arrived damaged",
  "Description": "Customer reports that package was visibly damaged on arrival. Items inside may be affected.",
  "Priority": "High",
  "Source": "Phone",
  "CustomerEmail": "customer@example.com",
  "Tags": ["Shipping", "Product Issue"],
  "RelatedOrders": ["ORD-10542"]
}
```

### Search Cases

```
POST /api/cases/search
Content-Type: application/json

{
  "SearchText": "damaged",
  "Status": "New",
  "Priority": "High",
  "SortOrder": "CreatedDescending",
  "Page": 0,
  "Take": 20
}
```

Response:

```json
{
  "Result": [
    {
      "Id": "abc123",
      "CaseNumber": "CS-1042",
      "Subject": "Order arrived damaged",
      "Status": "New",
      "Priority": "High",
      "CustomerName": "Jane Smith",
      "Created": "2026-03-15T10:30:00Z"
    }
  ],
  "TotalHits": 1
}
```

### Partial Update (PATCH)

```
PATCH /api/cases
Content-Type: application/json

{
  "Id": "abc123",
  "Priority": "Critical",
  "Tags": ["Shipping", "Product Issue", "Escalated"]
}
```

### Assign a Case

```
POST /api/cases/abc123/assignto?userId=user-456&userName=John%20Agent
```

### Change Status

```
POST /api/cases/abc123/changestatus?status=In%20Progress
```

## Swagger Documentation

For the full interactive API reference including request/response schemas, see the Swagger documentation available at your Omnium API instance: `/swagger`.
