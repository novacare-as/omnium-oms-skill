# Stores

Source: https://docs.omnium.no/docs/Stores

> Introduction to stores in Omnium

## Stores in Omnium

![Image](https://docs.omnium.no/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fstores.c57568a2.png&w=3840&q=75)

In Omnium, a **Store** represents any physical or virtual location associated with your business, such as:

*   Physical stores
*   Web shops
*   Warehouses
*   Other departments

Stores are used to:

1.  **Restrict Access**: Control access to orders, carts, customers and other entites in Omnium.
2.  **Track sales**: Orders are always connected to a store in Omnium, which represents the sales channel where the order originated.
3.  **Manage Inventory**: Represent locations that can hold inventory. An order will reduce the inventory of the warehouse that ships/delivers an item.
4.  **Control product assorment**: Products in Omnium can contain a list of stores where the products are available. Assortments can be managed at store level in the Omnium UI.

* * *

## In this section

*   [API Reference](Stores/store-api.md) — Create, update, and search stores via the API
*   [Configuration](Stores/store-config.md) — Store settings, store groups, roles, and default properties
*   [Stores, Markets & Warehouses](Stores/stores-markets-warehouses.md) — How the unified store entity, markets, and warehouses connect

* * *

## Creating Stores

There are multiple ways to create a store in Omnium:

1.  **Create in GUI**: Use the graphical interface to manually add a store.
2.  **Import/Export in GUI**: Import or export store data directly via the GUI.
3.  **Import through API**: Programmatically create stores using Omnium's API.

* * *

## The Store Model

For more details on store properties and the model see the [Store model documentation](https://api.omnium.no/documentation/index.html#/model-OmniumStore).

### Warehouses (stock locations)

An important property on the store object is **IsWarehouse**. This flag is used to indicate whether a store is also a stock location and can hold inventory. Below are some common use cases for stores and how this flag is combined with it:

| Use case | IsWarehouse | Description |
| --- | --- | --- |
| ECOM site | false | A pure digital sales channel that does not have its own stock but has available warehouses that it can ship from. |
| Physical store | true | A physical store is both a sales channel and have its own inventory. |
| Central warehouse | true | A pure warehouse that is not a sales channel, but service i.e. ECOM-orders og Pick-up-in-store. |

### Store Availability

There are several availability options on stores used:

1.  **Markets**: Used to control which markets a store is available in. A store may be available in multiple markets.
2.  **Available warehouses**: Specifies which warehouses (stock locations) is available for a given store. Is used to control which warehouses an order can be reallocated to. Used for instance with ECOM and Ship-From-Store orders where Omnium handles allocation of orders to a warehouse that can service the order.
3.  **Zip ranges**: Used to specify which zip-codes a store can service. Is used with reallocation workflows to restrict which warehouses ship to which locations.

### Metadata

The Store model in Omnium has support for storing a variety of metadata about a store:

*   Opening hours
*   Employees
*   Payment info

* * *

## Assortments

Omnium provides multiple ways to manage product assortments. One method is to use **product categories** in combination with **stores**.

### Controlling Assortments via the Edit Store UI

In the **Omnium Edit Store** interface, you can define the assortment for a store by selecting which **product categories** to include or exclude. When a category is assigned to a store:

*   The store's ID is added to the **store list** of each product within that category.
*   This information can then be used by the **frontend** to determine whether a product should be available in a specific store.

### Performance Consideration

Be aware: In setups with a **large number of stores**, this method may increase the size of individual **product documents**, which can negatively impact performance.

* * *

## Access control

When managing users in Omnium, you can specify which stores each user should have access to. A user will not be able to access data associated to stores outside of the user's permissions.
