import React from "react";

function ProductDetail() {
  const computers = [
    {
      productName: "Dell OptiPlex 7090",
      productDescription:
        "Business desktop with Intel Core i7, 16GB RAM, and 512GB SSD",
      price: 899.99,
      quantity: 10,
      inStock: true,
    },
    {
      productName: 'Apple MacBook Pro 14"',
      productDescription:
        "Laptop with M2 Pro chip, 16GB unified memory, 1TB SSD",
      price: 1999.99,
      quantity: 5,
      inStock: true,
    },
    {
      productName: "Lenovo ThinkPad X1 Carbon Gen 11",
      productDescription:
        "Ultralight business laptop with Intel Evo i7 and 32GB RAM",
      price: 1799.0,
      quantity: 7,
      inStock: true,
    },
    {
      productName: "HP Spectre x360",
      productDescription:
        "2-in-1 convertible laptop with touchscreen and Intel i7",
      price: 1399.99,
      quantity: 8,
      inStock: true,
    },
    {
      productName: "ASUS ROG Strix G16",
      productDescription: "Gaming laptop with Intel i9, RTX 4070, and 1TB SSD",
      price: 1795.0,
      quantity: 4,
      inStock: true,
    },
    {
      productName: "Apple Mac Mini (M2)",
      productDescription: "Compact desktop computer with M2 chip and 512GB SSD",
      price: 699.0,
      quantity: 6,
      inStock: true,
    },
    {
      productName: "Acer Aspire TC",
      productDescription: "Entry-level desktop with AMD Ryzen 5 and 256GB SSD",
      price: 499.99,
      quantity: 12,
      inStock: true,
    },
    {
      productName: "MSI Trident 3",
      productDescription: "Compact gaming desktop with Intel i7 and RTX 3060",
      price: 1099.0,
      quantity: 3,
      inStock: true,
    },
    {
      productName: "Raspberry Pi 4 Model B",
      productDescription:
        "Mini computer with 8GB RAM and microSD storage support",
      price: 75.0,
      quantity: 20,
      inStock: true,
    },
    {
      productName: "Dell PowerEdge T40",
      productDescription:
        "Entry-level server for small business, Intel Xeon E-2224G",
      price: 729.0,
      quantity: 2,
      inStock: false,
    },
  ];
  return (
    <div>
      <h1>List of Available Products by Name</h1>
      <ul>
        {computers.map((prod, key) => (
          <li key={key}>{prod.productName}</li>
        ))}
      </ul>
    </div>
  );
}
export default ProductDetail;
