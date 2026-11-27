# Newsletter

Source: https://docs.omnium.no/docs/Customer/newsletter

> Unsubscription process and setup for newsletters

### Unsubscription Process

Omnium simplifies the unsubscription process for customers by offering a one-click solution that doesn't require them to log into their account. This solution is implemented by importing a JS and CSS file from Omnium into your website. When a customer requests to unsubscribe, an event listener will trigger the unsubscription module.

To customize the unsubscribe module, you can modify the default CSS file from Omnium. Simply replace the provided file with your own CSS file to match your website’s design. The default text in the unsubscription box is available in multiple languages, including English, Norwegian, Swedish, Danish, and German. You can further personalize this text via tenant settings in Omnium (see setup instructions below).

![Image](https://docs.omnium.no/_next/image?url=%2F_next%2Fstatic%2Fmedia%2FunsubscribeModule.ae4bbecc.png&w=3840&q=75)

Unsubscribing from the customer club will permanently delete the user's membership data, including all associated benefits, bonuses, and rewards.

* * *

### Setup Instructions

Follow these steps to enable and configure the unsubscription module on your website:

#### 1\. Configure webSiteUrls in Tenant Settings

To ensure the unsubscribe module works, you must configure one or more `webSiteUrls` in the tenant settings within Omnium. The steps are as follows:

*   When a customer clicks the unsubscribe link in the newsletter, they will be redirected to the website associated with their account.
*   A pop-up window will appear on that website, offering the option to unsubscribe from the customer club.
*   If no specific market is linked to the customer, or if the `webSiteUrl` is not configured for the customer's market, the system will fallback to the default market's `webSiteUrl` (configured with `isDefaultMarket=true`).

#### 2\. Add webSiteUrls to CORS Settings

After completing step 1, Omnium will need to add the configured `webSiteUrls` to the CORS settings. Once you've set up the URLs, please contact Omnium support to finalize this configuration.

#### 3\. Insert Required Code into Your Website

Each of the websites specified in step 1 must include the following two lines of code in their HTML header:

```
<link rel="stylesheet" href="https://cdnomnium.azureedge.net/customerClubUnsubscription/omniumUnsubscribeToCustomerClub.css" asp-append-version="true" />
<script type="text/javascript" src="https://cdnomnium.azureedge.net/customerClubUnsubscription/omniumUnsubscribeToCustomerClub.js"></script>
```

This code will load the necessary JavaScript and CSS files from Omnium, enabling the unsubscription module.

#### 4\. Create a Newsletter with the Unsubscribe Link

In your newsletter, include the placeholder `{NEWSLETTER_UNSUBSCRIBE_URL}` for the unsubscribe link. This placeholder will be replaced dynamically with the appropriate unsubscribe URL when the newsletter is sent.

#### 5\. (Optional) Customize the Unsubscribe Message

You can personalize the unsubscribe message and add additional languages by modifying the `unsubscribeMessage` property in the customer club settings. The `unsubscribeMessage` contains a list of key-value pairs, where each key represents a language code, and the value is the corresponding message.

##### Example:

```json
{
    "customerClubSettings": {
        "unsubscribeMessage": [
            {
                "key": "en",
                "value": "Are you sure you want to unsubscribe? All your cash points will be lost!"
            },
            {
                "key": "no",
                "value": "Er du sikker? Alle dine cash points vil gå tapt!"
            }
        ]
    }
}
```
