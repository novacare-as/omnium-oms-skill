# Fortnox

Source: https://docs.omnium.no/docs/plugins/ERP/Fortnox

> Learn about our Fortenox integration

## Fortnox

Omnium provides a standardized integration with Fortnox. This includes creation of orders/invoices, customers, products/articles, suppliers and deliveries. The integration also offers logic for specifying "sales account" on orders depending on sales country, whcich allows for easy handling of international sales. One order/invoice is created in Fortnox per shipment in Omnium. Customers and products related to the order is created in the same operation if they do not already exist in Fortnox.

### Setup

The Fortnox integration can be configured under "Configuration->Settings->Integrations->Connectors".

An example of a setup might look like this:

```json
{
    "name": "fortnox",
    "type": "erp",
    "host": "https://apps.fortnox.se",
    "token": "***",
    "username": "***",
    "password": "***",
    "isAuthenticatedManually": false,
    "timeOut": "00:00:00",
    "implementations": [
        "IDeliveryExporter", //Allows for exporting of deliveries using button on delivery view.
        "IPaymentExporter" //Triggered by the workflowstep "ExportPayments", or by button on order view.
    ],
    "properties": [
        {
            "key": "isAuthorized", //Controlled by GUI under Configuration->Integrations->Fortnox. Don't touch
            "value": "false"
        },
        {
            "key": "isActive", //Controlled by GUI under Configuration->Integrations->Fortnox. Don't touch
            "value": "true"
        },
        {
            "key": "KlarnaInStore", //Omnium payment method name
            "value": "1", //Value not relevant, except for the optional posiblity of having this value correspond with an account, supplier or payment method in Fortnox. Not standard.
            "keyGroup": "FortnoxPaymentMethods" //If order/shipment has payments not found in property with this keygroup, it won't be exported
        },
        {
            "key": "Internal_PayInStore",
            "value": "2",
            "keyGroup": "FortnoxPaymentMethods"
        },
        {
            "key": "Internal_Faktura",
            "value": "3",
            "keyGroup": "FortnoxPaymentMethods"
        },
        {
            "key": "CostCenter", //Cost center is a field on orders in Fortnox
            "value": "1"
        },
        {
            "key": "OnlyExportORder", //Without this setting, we try to create invoice as well. Recommended if you do not know what you are doing.
            "value": "true"
        },
        {
            "key": "ShipmentArticleNumber", //If this is set, we will create an orderline for the shipment costs using the article number in Fortnox, instead of using a field on the order.
            "value": "actualShipmentArticleNumberInFortnox" // See https://support.fortnox.se/produkthjalp/fakturering/momssatser-pa-frakt-och-expeditionsavgifter
        },
        {
            "key": "NO", //Country code on shipment or customer.
            "value": "3061", //Sales account number in Fortnox.
            "keyGroup": "SalesAccounts"
        },
        {
            "key": "SE",
            "value": "3062",
            "keyGroup": "SalesAccounts"
        },
        {
            "key": "SetSalesAccountNumbers", //Activation of SalesAccounts. If this is not set, standard sales account is used by Fortnox.
            "value": "true"
        }
    ],
    "disableStandardErrorPolicy": false,
    "enabledForMarkets": [
        null
    ],
    "disabledForMarkets": []
}
```

To authorize the integration, go to "Configuration->Settings->Integrations->Fortnox".
