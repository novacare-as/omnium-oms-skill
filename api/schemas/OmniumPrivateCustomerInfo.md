# OmniumPrivateCustomerInfo

GDPR response object, containing user personal info (order, customer and project information)

**Fields:**

- `orders`: List<[`OmniumOrder`](OmniumOrder.md)>, nullable, max length 1000 — Customer orders
- `privateCustomer`: [`OmniumPrivateCustomer`](OmniumPrivateCustomer.md)
- `projects`: List<[`OmniumProject`](OmniumProject.md)>, nullable, max length 1000 — Customer projects
- `customerClubMember`: [`OmniumCustomerClubMember`](OmniumCustomerClubMember.md)

**Used directly by endpoints in:**

- [Customers | B2C](../endpoints/customers/b2c.md)
