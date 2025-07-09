import React from "react";

type ProductProps = {
  product: String;
};

function UsingProp({ product }: ProductProps) {
  return <p>You chose the product {product}</p>;
}

export default UsingProp;
