## 1. Overview

This document provides detailed information about the "Visit Completion" webhook. This webhook is designed to notify external systems, such as an Electronic Medical Record (EMR) system, whenever a patient's visit is marked as complete in our system.

By subscribing to this webhook, you can automate workflows, update patient records, and trigger other processes in your system in real-time.

## 2. When is the webhook sent?

The webhook is triggered automatically whenever a visit's status changes to `completed`. This includes scenarios where a Good Faith Examination (GFE) is finalized and treatment decisions have been made.

The event name for this webhook is `visit.completed`.

## 3. Payload Structure

The webhook is sent as an HTTP POST request with a JSON payload. The payload contains detailed information about the completed visit.

### Payload Fields

| Field | Type | Description |
| --- | --- | --- |
| `event` | String | The name of the event. Always `visit.completed`. |
| `timestamp` | Number | The Unix timestamp (in milliseconds) when the event was generated. |
| `success` | Boolean | Indicates if the webhook call is part of a successful operation. Always `true`. |
| `data` | Object | A container for the visit-specific data. |

### The `data` Object

| Field | Type | Description |
| --- | --- | --- |
| `gfe_id` | String | The unique identifier for the visit/GFE. |
| `location_id` | String | The identifier for the location where the visit occurred. |
| `status` | String | The final status of the visit. Will be `completed`. |
| `pdf_link` | String | A URL to the PDF summary of the visit, if available. |
| `requested_treatments` | Array of Strings | A list of treatment names that were initially requested for the visit. |
| `approved_treatments` | Array of Strings | A list of treatment names that were approved by the provider. |
| `conditionally_approved_treatments` | Array of Strings | A list of treatment names that were approved with conditions. |
| `deferred_treatments` | Array of Strings | A list of treatment names that were deferred for a later decision. |
| `patient_details` | Object | An object containing the patient's information. |

### The `patient_details` Object

| Field | Type | Description |
| --- | --- | --- |
| `name` | String | The patient's full name. |
| `first_name` | String | The patient's first name. |
| `last_name` | String | The patient's last name. |
| `email` | String | The patient's email address. |

### Example Payload

```json
{
  "event": "visit.completed",
  "timestamp": 1678886400000,
  "success": true,
  "data": {
    "gfe_id": "vis_12345abcde",
    "location_id": "loc_67890fghij",
    "status": "completed",
    "pdf_link": "https://example.com/path/to/visit-summary.pdf",
    "requested_treatments": [
      "Botox",
      "Dermal Filler"
    ],
    "approved_treatments": [
      "Botox"
    ],
    "conditionally_approved_treatments": [],
    "deferred_treatments": [
      "Dermal Filler"
    ],
    "patient_details": {
      "name": "Jane Doe",
      "first_name": "Jane",
      "last_name": "Doe",
      "email": "jane.doe@example.com"
    }
  }
}
```

## 4. Headers

Your webhook endpoint will receive the following HTTP headers with each request:

| Header | Value | Description |
| --- | --- | --- |
| `Content-Type` | `application/json` | The media type of the request body. |
| `User-Agent` | `Spakinect-Webhook/1.0` | Identifies the client sending the webhook. |
| `X-Signature` | `[signature]` | A security signature to verify the authenticity of the request. See below for details. |

### Example Headers

```
Content-Type: application/json
User-Agent: Spakinect-Webhook/1.0
X-Signature: a1b2c3d4e5f6...
```

## 5. Verifying the Signature

To ensure that the webhook request was sent from our system and has not been tampered with, you must verify the `X-Signature` header.

The signature is a **HMAC-SHA256** hash generated using your unique `api_key` as the secret key and the raw JSON payload as the message. The `api_key` can be found in your EMR configuration within our system.

### Signature Verification Steps:

1.  **Get the `X-Signature` from the header.**
2.  **Get the raw request body.** It is crucial to use the raw, unmodified request body. Do not parse and re-stringify the JSON, as this can alter the byte representation and cause a signature mismatch.
3.  **Compute your own signature.** Using the `HMAC-SHA256` algorithm, create a hash of the raw request body using your `api_key` as the secret. The resulting hash should be in hexadecimal format.
4.  **Compare the signatures.** Compare the signature from the header with the one you just computed. If they match, the webhook is authentic.

### Example Verification in Node.js

```javascript
const crypto = require('crypto');

function verifyWebhookSignature(payloadString, receivedSignature, apiKey) {
  if (!apiKey) {
    throw new Error('API key is required for signature verification');
  }

  // Generate the expected signature
  const expectedSignature = crypto
    .createHmac('sha256', apiKey)
    .update(payloadString)
    .digest('hex');

  // Securely compare the two signatures
  return crypto.timingSafeEqual(
    Buffer.from(receivedSignature, 'hex'),
    Buffer.from(expectedSignature, 'hex')
  );
}

// Example usage within an Express.js endpoint
// Make sure to use a middleware that provides the raw body (e.g., bodyParser with a verify function)
const express = require('express');
const app = express();

// Use JSON middleware, but capture the raw body
app.use(express.json({
  verify: (req, res, buf) => {
    req.rawBody = buf.toString();
  }
}));

app.post('/webhook-endpoint', (req, res) => {
  const receivedSignature = req.get('X-Signature');
  const apiKey = 'YOUR_EMR_API_KEY'; // Retrieve your secret API key securely

  try {
    const isValid = verifyWebhookSignature(req.rawBody, receivedSignature, apiKey);

    if (isValid) {
      console.log('✅ Signature is valid. Processing webhook...');
      // Process the webhook payload (req.body)
      res.status(200).send('Webhook received');
    } else {
      console.warn('⚠️ Invalid signature.');
      res.status(403).send('Invalid signature');
    }
  } catch (error) {
    console.error('❌ Error verifying signature:', error.message);
    res.status(400).send('Signature verification failed');
  }
});
```

## 6. Best Practices

-   **Respond Quickly:** Your endpoint should respond to the webhook with a `2xx` status code as quickly as possible. Acknowledging receipt before performing complex processing prevents timeouts. You can process the data asynchronously in a background job.
-   **Secure Your Endpoint:** Use HTTPS for your webhook endpoint to protect the data in transit.
-   **Verify the Signature:** Always verify the `X-Signature` to protect against malicious or tampered payloads.
-   **Handle Retries:** Our system will attempt to redeliver a webhook if your endpoint fails to respond with a `2xx` status. Your system should be designed to handle potential duplicate events gracefully (idempotency). You can use the `gfe_id` to de-duplicate events.
-   **Securely Store Your `api_key`:** Treat your `api_key` as a password. Do not expose it in client-side code or commit it to version control.
