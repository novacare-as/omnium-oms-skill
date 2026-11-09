# Product

Source: https://docs.omnium.no/docs/Product

> Introduction to products in Omnium

## Product modeling and variations in Omnium

This section provides an overview of how to model products and handle variations in the Omnium system. It covers product types, including single SKUs, products with variants, siblings, and package products. It also includes key considerations and best practices for managing product variations efficiently to ensure optimal performance and clarity.

![Image](https://docs.omnium.no/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fproducts.7aacc5a6.png&w=3840&q=75)

* * *

## In this section

*   [API Reference](https://docs.omnium.no/docs/Product/api-reference) — Search, create, update, and manage products via the API
*   [Configuration](Product/configuration.md) — Product settings, product types, and completion rates
*   [Assortment](Product/product-assortment.md) — Control product visibility across stores, markets, and customers
*   [Local Products](Product/local-products.md) — Store-specific assortments with localized editing and access control
*   [Categories](Product/product-categories.md) — Hierarchical organization, multi-language support, and automatic creation
*   [Assets](Product/product-assets.md) — Product images, documents, and media with automatic resizing and CDN delivery
*   [Components](Product/product-components.md) — Packages, bundles, and kits combining multiple products
*   [Gift Cards](Product/giftcards.md) — Technical configuration and API usage for buying and paying with gift cards
*   [Container Deposits](Product/container-deposits.md) — Deposit (pant) lines that follow the product through carts, orders, returns and reports
*   [Identifiers](Product/product-identifiers.md) — Understanding Id, ProductId, SkuId, ParentId, and VariantParentId

* * *

## Product types and variations

### Single SKU

*   A product that represents a single **Stock Keeping Unit (SKU)**.
*   No variations or series (e.g., no multiple colors or sizes).

**Example**: Individual bicycle pedals.

![Image](https://docs.omnium.no/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fproductsingleskus.2be4a178.png&w=3840&q=75)

* * *

### Product with variants

*   Contains variations such as **size** or **color**.
*   Includes a list of SKUs referred to as variants.
*   Pricing is often set at the parent level but can also differ for each variant.
*   **Recommendation**: Vary by only one property (e.g., size OR color).

![Image](https://docs.omnium.no/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fproductswithvariants.30229d5d.png&w=3840&q=75)

* * *

### Sibling products

*   Can be **Single SKUs** or **Products with Variants**.
*   Share the same **Parent ID**, connecting them as a series.
*   Commonly used in **fashion** to display variations (e.g., colors).

**Example**: Jerseys in different colors with sizes as variants. ![Image](https://docs.omnium.no/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fproductsiblings.28e89374.png&w=3840&q=75)

* * *

### Other product variations

*   **Package Products**: Products that include multiple components.
*   **Products with Options**: Allow users to customize certain features (e.g., engraved text).

* * *

## Product Languages

In Omnium, product languages are configured through the **Omnium configuration page**. Each language version of a product is represented as a separate product using a language-based ID convention. For example:

*   `yellow_tennis_sock_no` (Norwegian)
*   `yellow_tennis_sock_en` (English)
*   `yellow_tennis_sock_se` (Swedish)

### Market Configuration

Markets are configured with a `productContentLanguage`, defining which language versions should be used. Language versions that share the same `ProductId` are grouped together in the UI. **Inheritance** can be configured so updates in one language automatically apply to others.

* * *

## Key considerations for product modeling

### Managing Variants

*   **Limit Variants**: Avoid products with more than 50 variants. If necessary, reconsider your product model.
*   **Data Duplication**: Keep shared information at the product level to avoid duplication.
*   **Performance**: Variants are stored within the product document, so each variant update affects the entire product. Variants are not individually searchable.

### Sibling Products

Are siblings by convention, by sharing the same **ParentId**. Can be setup to inherit properties from each other.
**Example Use Case**: For a t-shirt in 10 colors and 5 sizes, create 10 sibling products (one for each color) with 5 size variants each (Instead of a single product with 50 variants!).

#### Example structure:

Product 1: **Yellow shirt**

*   **ID**: shirt-yellow\_no
*   **ProductId**: shirt-yellow
*   **ParentId**: shirt
*   Variants: Sizes S, M, L

Product 2: **Blue shirt**

*   **ID**: shirt-blue\_no
*   **ProductId**: shirt-blue
*   **ParentId**: shirt
*   Variants: Sizes S, M, L

... and so on

### Best practices

*   **Centralize Data**: Store most information at the product level. Only variant-specific data should be stored in variants.
*   **Use Null Values**: Avoid empty strings and empty collections; use `null` instead.
*   **Focus on Simplicity**: Create multiple focused products rather than overly complex ones.
*   **Avoid Unused Custom Properties**: Use product types for editable properties in the UI.
*   **Avoid "Monster Products"**

### Handling "Monster Products" 👹

> Monster products" refer to products that have become excessively large due to too many variants, properties, or other factors. These large products can negatively impact performance and storage efficiency. An example would be a product with more 100+ variants and with a huge amount of custom properties, prices and cateogories stored on each variant.

*   **Reduce Variant Numbers**: Limit the number of variants for each product. If a product has too many variants with unique pricing or properties per variant, organizing them as **sibling products** is a much more suitable approach.
*   **Centralize Shared Data**: Avoid data duplication by keeping common information at the product level. Store only variant-specific data within the variants.

* * *

## Industry-specific examples

### Electronics

*   **Scenario**: A smartphone with different storage capacities and colors.
*   **Recommendation**: Separate products by storage (e.g., "Smartphone 64GB" and "Smartphone 128GB") with color variants.

### Footwear

*   **Scenario**: Shoes available in multiple colors and sizes.
*   **Recommendation**: Separate products by color (e.g., "Red Sneakers" and "Blue Sneakers") with size and width as variants.

### Appliances

*   **Scenario**: Washing machines with different load capacities and energy ratings.
*   **Recommendation**: Separate products by load capacity (e.g., "7kg Washing Machine" and "10kg Washing Machine") with energy rating variants.

* * *

## Product Assortment

Omnium provides multiple mechanisms to control which products are visible in different stores, markets, and to specific customers. For comprehensive documentation on all assortment options, see [Product Assortment](Product/product-assortment.md).

Key assortment mechanisms include:

*   **Store/Market IDs** - Direct assignment of products to stores and markets
*   **Assortment Codes** - Time-based groupings for seasonal and customer-specific catalogs
*   **Store Categories** - Automatic assignment based on product categories configured on stores
*   **Price-Based Assortment** - Automatic assignment based on price store/market data
*   **Customer Categories** - Customer-specific category restrictions for B2B scenarios

* * *
