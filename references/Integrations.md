# Integrations

Source: https://docs.omnium.no/docs/Integrations

> Learn how to synchronize data with Omnium using delta queries, events, queues, and other integration patterns.

Omnium offers versatile integration pathways for technical users, providing flexibility and efficiency in data synchronization. Delta queries within the API present a powerful means to selectively retrieve only the data that has changed since a specified timestamp, optimizing data transfer and reducing redundancy. For real-time responsiveness, users can leverage event-driven integration by listening to events emitted by Omnium. This approach ensures instant updates as changes occur within the system.

Alternatively, for a queue-based approach, users can read from queues, allowing for a decoupled and asynchronous data flow. These integration methods cater to the diverse needs of technical workflows, offering precision, real-time capabilities, and adaptability for seamless data interaction with Omnium.

* * *

## In this section

*   [Connectors](Integrations/connectors.md) — Overview of connector types and how to configure them
*   [Data In](Integrations/data-in.md) — Best practices for importing data into Omnium
*   [Data Out](Integrations/data-out.md) — Best practices for exporting data from Omnium
*   [Events & Webhooks](Integrations/events.md) — Real-time event-driven integration and webhook subscriptions
*   [Delta Queries](Integrations/delta.md) — Retrieve only data that changed since a given timestamp
*   [Scrolling / Pagination](Integrations/scrolling.md) — Efficiently paginate through large result sets
*   [Queues](Integrations/queues.md) — Asynchronous, decoupled data flow via queue-based integration
*   [GUI Export & Import](Integrations/gui-export-import.md) — Manual data transfer via JSON and Excel in the Omnium UI
*   [Troubleshooting](Integrations/troubleshooting.md) — Common HTTP errors, integration issues, and step-by-step debugging guides
