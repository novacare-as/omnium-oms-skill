# Generate Secret Key

Source: https://docs.omnium.no/docs/Order/workflow-steps/enrichment/generate-secret-key

> Generate a cryptographically secure random secret key for secure order lookups without authentication.

## Overview

The **Generate Secret Key** step creates a cryptographically secure random key that can be used to retrieve a specific order by its key. This enables use cases like customer order tracking links, guest checkout order retrieval, and third-party integrations.

## Identifier

| Property | Value |
| --- | --- |
| **Key** | `GenerateSecretKey` |
| **Group** | Enrich |
| **Applicable Statuses** | New |

## Configuration Properties

| Property | Type | Default | Description |
| --- | --- | --- | --- |
| **KeyLength** | int | 16 | Length of the generated key (max: 64 characters) |
| **CharacterSet** | string | `A-Za-z0-9` | Characters to use for key generation |
| **OverwriteExisting** | bool | true | Whether to regenerate if a key already exists |

### Character Set

The default character set includes:

*   Uppercase letters: `ABCDEFGHIJKLMNOPQRSTUVWXYZ`
*   Lowercase letters: `abcdefghijklmnopqrstuvwxyz`
*   Numbers: `0123456789`

You can customize this to exclude ambiguous characters (like `0`, `O`, `l`, `1`) or include special characters.

## Behavior

### What It Does

1.  Checks if the order already has a secret key
2.  If key exists and `OverwriteExisting` is false, skips generation
3.  Validates and constrains `KeyLength` to maximum of 64 characters
4.  Loads custom character set or uses default
5.  Generates cryptographically secure random key
6.  Sets `SecretKey` property on the order
7.  Returns result invisibly (doesn't show in workflow history)

### Prerequisites

None. This step can run on any order.

### Side Effects

*   `Order.SecretKey` property is set
*   Existing key is overwritten if `OverwriteExisting` is true

## Business Cases

### When to Use

*   **Guest order tracking**: Provide customers with a secure link to track orders without login
*   **Email notifications**: Include order lookup links in confirmation emails
*   **Third-party access**: Give partners access to specific orders without full API credentials
*   **Customer service**: Generate secure links for customer support scenarios

### Example Scenarios

**Scenario 1: Standard Generation**

```
Configuration:
- KeyLength: 16
- CharacterSet: (default)
- OverwriteExisting: true

Result: Generates key like "aB3xR9mK2pQw7Vn5"
```

**Scenario 2: Long Key with Custom Characters**

```
Configuration:
- KeyLength: 32
- CharacterSet: ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 (no lowercase)
- OverwriteExisting: true

Result: Generates key like "A3X9M2PQ7VN5B8K4R1Z6Y0C3D7E2F9"
```

**Scenario 3: Preserve Existing Key**

```
Configuration:
- OverwriteExisting: false

Behavior: If order already has a secret key, it won't be regenerated
```

## Using the Secret Key

### In Notifications

The secret key can be used in notification templates via the replacement token:

```json
{ORDER_SECRET_KEY}
```

**Example email template:**

```
Track your order here:
https://yoursite.com/track?key={ORDER_SECRET_KEY}
```

### API Endpoint

Orders can be retrieved using the secret key via the public API:

```
GET /api/orders/secret/{secretKey}
```

**Response:** Returns the full `OmniumOrder` object if the key matches, or 404 if not found.

**Security Note:** This endpoint requires API authentication (Order Read access), the same as other order endpoints. The secret key identifies which order to return rather than replacing authentication.

### In UI

The secret key is visible and editable in the Order Metadata modal in the Omnium Web UI. Administrators can manually regenerate keys if needed.

## Configuration Examples

### Minimal Configuration

```json
{
  "ActionType": "GenerateSecretKey"
}
```

Uses all defaults: 16-character key with alphanumeric characters.

### Custom Length

```json
{
  "ActionType": "GenerateSecretKey",
  "Properties": [
    { "Key": "KeyLength", "Value": "24" }
  ]
}
```

### No Ambiguous Characters

```json
{
  "ActionType": "GenerateSecretKey",
  "Properties": [
    { "Key": "CharacterSet", "Value": "ABCDEFGHJKLMNPQRSTUVWXYZ23456789" }
  ]
}
```

Excludes: `I`, `O`, `0`, `1`, lowercase letters

### Preserve Existing Keys

```json
{
  "ActionType": "GenerateSecretKey",
  "Properties": [
    { "Key": "OverwriteExisting", "Value": "false" }
  ]
}
```

## Error Handling

| Condition | Result | Continues Workflow? |
| --- | --- | --- |
| Key generated | Success (invisible) | Yes |
| Key already exists (OverwriteExisting=false) | Success (invisible, no change) | Yes |
| Invalid configuration | Success (uses defaults) | Yes |

This step always succeeds and never blocks the workflow.

## Best Practices

1.  **Key Length**: Use at least 16 characters for adequate security
2.  **Character Set**: Consider excluding ambiguous characters (`0`, `O`, `l`, `1`) for keys that users might need to type
3.  **Overwrite**: Set `OverwriteExisting` to `false` if you want keys to remain stable after generation
4.  **Notifications**: Always use HTTPS when including secret keys in URLs
5.  **Expiration**: Consider implementing time-based expiration in your application logic if needed

## Related Steps

*   [Set Custom Order Data](set-custom-order-data.md) - Store additional order metadata
*   [Create Order Barcode](create-order-barcode.md) - Generate barcodes for physical tracking

## Related Features

*   [Order API - Get by Secret Key](../../order-api.md#get-order-by-secret-key) - API endpoint documentation
*   [Notification Templates](../notifications/notification.md) - Using ORDER\_SECRET\_KEY in emails
