# Generic Concepts

Source: https://docs.omnium.no/docs/configuration/generic

> This page provides an overview of generic concepts in Omnium, such as External IDs,properties and more.

## External IDs

External IDs are added to most Omnium models, making it possible to identify the entity across multiple systems. An order could get an ID from the commerce platform, another ID when created in the ERP system, and another from the accounting system. The ID given by any front-end or back-end system should be added to the key-value list of external IDs.

An external ID is searchable in Omnium, making it easy for customer service to find orders no matter what ID they are provided with.

Key benefits of adding external IDs to the ExternalIds-property:

*   External IDs as a common property on orders, customers, etc.
*   Key-value list separates IDs from multiple systems
*   Searchable in Omnium

## Properties

Most models in Omnium contain a property with a list of property items:

*   Orders
*   Order lines
*   Customers
*   Stores

The property list is a key-value collection for storing custom properties. There are no type requirements, so any value can be stored in custom properties.

The list is available to modify through the API or in the user interface.

## Date Time Formats

Dates in Omnium are always in UTC format in ISO-8601 format. UTC, or Universal Time Coordinated, is the most commonly referred to time standard.

Date and time example:

```
2020-01-24T09:25:29Z
```

## Comments

Many models in Omnium have a collection of OmniumComment. They are used for storing either public or internal comments on the object.

| Property | Type | Description | Information |
| --- | --- | --- | --- |
| Id | string | Comment ID |  |
| Created | [DateTime](https://docs.omnium.no/docs/configuration/api/generic?id=date-time-formats) | Comment created date |  |
| CustomerId | string | Comment customer ID |  |
| Detail | string | Comment main content |  |
| Title | string | Comment header |  |
| Type | string | Comment type |  |
| LineItemId | string | Optional line item reference |  |
| Creator | string | Name of comment creator |  |
| Attachments | [List<OmniumFileInfo>](https://docs.omnium.no/docs/configuration/api/generic?id=file-info) | List of attachments |  |

## File info

| Property | Type | Description |
| --- | --- | --- |
| Name | string | File name |
| Url | string | File url |
| Created | [DateTime](https://docs.omnium.no/docs/configuration/api/generic?id=date-time-formats) | Date created |
| Modified | [DateTime](https://docs.omnium.no/docs/configuration/api/generic?id=date-time-formats) | Date modified |
| ContentType | string | File type, e.g. image/jpg |
| Length | long | File size in bytes |
