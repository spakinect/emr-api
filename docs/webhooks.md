---
id: webhooks
title: Webhook Events
sidebar_position: 2
---

# Webhook Events

Spakinect can send webhook notifications to your EMR system when specific events occur. This allows you to receive real-time updates about visits and treatments without polling the API.

> **Note:** To receive webhook events, a location must be subscribed to the EMR using the Location subscription endpoint (`POST /subscriptions`).

---


## Webhook Security

All webhook requests from Spakinect include:

- **Content-Type**: `application/json`
- **User-Agent**: `Spakinect-Webhook/1.0`
- **X-Signature**: HMAC-SHA256 signature (if API key is configured)

### Signature Verification

Spakinect uses **HMAC-SHA256** to sign webhook payloads. The signature is sent in the `X-Signature` header and is generated using your EMR's API key as the secret.

**Important**: Always verify the webhook signature to ensure the request is authentic and hasn't been tampered with.

#### How to Verify the Signature

1. Extract the `X-Signature` header from the incoming request
2. Generate your own signature using:
   - **Algorithm**: HMAC-SHA256
   - **Secret**: Your EMR's API key
   - **Message**: The raw JSON payload body (as a string)
3. Compare your generated signature with the `X-Signature` header
4. If they match, the webhook is authentic

#### How to Get Payload, Signature, and API Key

In your webhook handler, you need to extract three pieces of information:

1. **Payload**: The raw JSON string from the response body
2. **Signature**: The `X-Signature` header value
3. **API Key**: The API key provided by Spakinect when you registered your EMR


**Important Notes:**
- The payload must be the **raw JSON string** (not parsed object) for signature verification
- The signature is sent in the `X-Signature` HTTP header
- The API key is the same key provided by Spakinect when you registered your EMR system
- Store your API key securely (environment variables, secure config, or database)

#### Signature Verification Function

```javascript
const crypto = require('crypto');
 
function verifySignature(payload, signature, apiKey) {
  if (!apiKey || !signature) {
    return false;
  }

  // Convert payload to JSON string if it's an object
  const payloadString = typeof payload === 'string' 
    ? payload 
    : JSON.stringify(payload);
  
  // Generate expected signature
  const expectedSignature = crypto
    .createHmac('sha256', apiKey)
    .update(payloadString)
    .digest('hex');
  
  // Use constant-time comparison to prevent timing attacks
  try {
    return crypto.timingSafeEqual(
      Buffer.from(signature, 'hex'),
      Buffer.from(expectedSignature, 'hex')
    );
  } catch (error) {
    return false;
  }
}
```

Signature verification is **strongly recommended** for production environments.

---

## Supported Events

### 1. Visit Completed (`visit.completed`)

Triggered when a Good Faith Exam (GFE) visit is completed and all treatment decisions have been made.

#### Payload Structure

```json
{
  "event": "visit.completed",
  "timestamp": 1714675200000,
  "success": true,
  "data": {
    "location_id": "loc_12345",
    "gfe_id": "gfe_abc123xyz789",
    "status": "Completed",
    "pdf_link": "https://example-cdn.com/gfe/gfe_abc123xyz789.pdf",
    "requested_treatments": [
      "Botox Injection",
      "Dermal Filler"
    ],
    "approved_treatments": [
      "Botox Injection"
    ],
    "conditionally_approved_treatments": [
      "Dermal Filler"
    ],
    "deferred_treatments": [],
    "patient_details": {
      "name": "Jane Smith",
      "first_name": "Jane",
      "last_name": "Smith",
      "email": "jane.smith@example.com"
    }
  }
}
```

#### Payload Fields

| Field | Type | Description |
|-------|------|-------------|
| `event` | string | Always `"visit.completed"` |
| `timestamp` | integer | Unix timestamp in milliseconds when the event occurred |
| `success` | boolean | Indicates if the data retrieval was successful |
| `data.location_id` | string | The ID of the location where the visit took place |
| `data.gfe_id` | string | Unique identifier for the GFE visit |
| `data.status` | string | Visit status (always `"Completed"` for this event) |
| `data.pdf_link` | string | URL to download the GFE PDF (if available) |
| `data.requested_treatments` | array | List of treatment names originally requested |
| `data.approved_treatments` | array | List of treatment names that were approved |
| `data.conditionally_approved_treatments` | array | List of treatment names with conditional approval |
| `data.deferred_treatments` | array | List of treatment names that were deferred |
| `data.patient_details` | object | Patient information |
| `data.patient_details.name` | string | Patient's full name |
| `data.patient_details.first_name` | string | Patient's first name |
| `data.patient_details.last_name` | string | Patient's last name |
| `data.patient_details.email` | string | Patient's email address |

---
