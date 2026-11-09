# Get Access

Source: https://docs.omnium.no/docs/GettingStartedWithAPI/introtoapi

> Request access and set up your account for Omnium API integration.

## Getting Started with Omnium API

Welcome to the Omnium API! This guide will walk you through the steps to integrate Omnium into your system quickly and effectively.

## Request access to Omnium

To begin using Omnium, follow these steps:

1.  **Request access**
    If you're a developer and need access to the API, reach out to a colleague with admin rights to add you to the system. Alternatively, you can send an email to [info@omnium.no](mailto:info@omnium.no) requesting access.

2.  **Receive login details**
    You will receive an email with login credentials for the Omnium GUI and relevant environments.

After logging in, you'll be able to generate API tokens for integration.

## Omnium Environments

Omnium offers different environments for testing, demo, and production use:

| **Environment** | **URL** | **Purpose** |
| --- | --- | --- |
| **Test** | [https://test.omnium.no](https://test.omnium.no) | Use this for testing configurations or new features. |
| **Demo** | [https://demo.omnium.no](https://demo.omnium.no) | Explore Omnium in a demo environment. |
| **Production** | [https://oms.omnium.no](https://oms.omnium.no) | The live system for real-world operations. |

### Swagger API Documentation

Access detailed API documentation for each environment:

| **Environment** | **Swagger/API URL** |
| --- | --- |
| **Test** | [https://apitest.omnium.no](https://apitest.omnium.no) |
| **Production** | [https://api.omnium.no](https://api.omnium.no) |

## Setting Up API Integration

Integrating the Omnium API with your system is straightforward. Follow these steps:

### API Overview

You'll find all endpoints and models available in Omnium's Swagger documentation: [https://api.omnium.no](https://api.omnium.no)

### Authentication

Authentication to Omnium's API is handled by JWTs (JSON Web Tokens) using the Bearer schema.

To create a token, use the token endpoint `POST /api/token`. The `ClientId` and `ClientSecret` can be obtained by creating an API user in the Omnium UI. The token is valid for 10 days, so there should be no need to frequently request new tokens.

Bearer authentication (also called token authentication) is an HTTP authentication scheme that involves security tokens called bearer tokens. The name “Bearer authentication” means “give access to the bearer of this token.” You must send this token in the `Authorization` header when making requests to Omnium's endpoints.

**Authorization header example:**

```
Authorization: Bearer {token}
```

### Generate API Credentials

1.  **Log in to Omnium**: Navigate to `Configuration > Authorization > API Users` in the Omnium GUI.
2.  **Create an API user**: Select the three dots to the right and click "Create API user." Provide a user-friendly, descriptive name for your API user (e.g., `"Inventory Integration"`).
3.  **Save credentials**: Copy the generated `ClientId` and `ClientSecret`. These will only be shown once, so ensure you store them securely.

### Example Code

Here’s an example of how to request a token and use it in your API calls:

```
var client = new HttpClient { BaseAddress = new Uri("https://apitest.omnium.no") };
var formContent = new FormUrlEncodedContent(new[]
{
    new KeyValuePair<string, string>("grant_type", "client_credentials"),
    new KeyValuePair<string, string>("clientId", "YOUR_CLIENT_ID"),
    new KeyValuePair<string, string>("clientSecret", "YOUR_CLIENT_SECRET")
});
var response = await client.PostAsync("/api/token", formContent);
var token = await response.Content.ReadAsStringAsync();
client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
```

### Create a Client

```
var client = _httpClientFactory.CreateClient();
client.BaseAddress = new Uri("https://apitest.omnium.no");
var formContent = new FormUrlEncodedContent(new[]
{
    new KeyValuePair<string, string>("grant_type", "client_credentials"),
    new KeyValuePair<string, string>("clientId", "YOUR_CLIENT_ID"),
    new KeyValuePair<string, string>("clientSecret", "YOUR_CLIENT_SECRET")
});

// Get Token
var response = await client.PostAsync("/api/Token", formContent);
if (!response.IsSuccessStatusCode)
{
    throw new Exception($"Get token failed! Status: {response.StatusCode}");
}
var token = await response.Content.ReadAsStringAsync();

// How to check if token is valid
var jwtHandler = new JwtSecurityTokenHandler();
var jwtToken = jwtHandler.ReadJwtToken(token);
DateTime validToUtc = jwtToken.ValidTo; // UTC date

// Add token to authorization header
client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
```

* * *

## Configuration

The configuration section in the UI serves as the command center for tailoring your platform to meet the unique needs of your business. Here, you have the power to configure essential elements such as languages, markets, orders, customers, and products. Beyond these foundational settings, delve into advanced features that empower you to fine-tune the platform to align seamlessly with your business requirements.

![Image](https://docs.omnium.no/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fconfig.192a42cc.png&w=3840&q=75)

* * *

## Get a Demo Tenant

If you'd like to integrate with Omnium and require a demo tenant, send an email to [info@omnium.no](mailto:info@omnium.no). Our team will create a demo tenant and invite you to get started.
