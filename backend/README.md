# SDN Ecommerce Assignment

Khung project Node.js + Express + MongoDB/Mongoose cho bài SDN.

## Collections

- users
- categories
- brands
- products
- carts
- orders
- payments
- shippings

> Đã loại bỏ toàn bộ phần Review và Voucher.

## Install

```bash
npm install
npm start
```

## API base

```txt
http://localhost:9999/api
```

## Main routes

```txt
/api/users
/api/categories
/api/brands
/api/products
/api/carts
/api/orders
/api/payments
/api/shippings
```

## Gợi ý chia việc 5 thành viên

1. User + Address
2. Category + Brand
3. Product + Search/Filter/Pagination
4. Cart + Order
5. Payment + Shipping
