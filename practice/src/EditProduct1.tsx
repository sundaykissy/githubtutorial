import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Formik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { Form as AntForm, Input, Button, Typography, message } from "antd";

const { Title } = Typography;

function EditProduct1() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [initialValues, setInitialValues] = useState({
    id: 0,
    name: "",
    description: "",
    price: "",
  });

  useEffect(() => {
    axios
      .get("http://127.0.0.1:5000/get-data")
      .then((response) => {
        const product = response.data.find(
          (p: any) => p.id === parseInt(id || "")
        );
        if (product) {
          setInitialValues({
            id: product.id,
            name: product.name,
            description: product.description,
            price: product.price,
          });
        } else {
          message.error("Product not found");
          navigate("/");
        }
      })
      .catch((error) => {
        console.error("Error fetching product:", error);
        message.error("Failed to fetch product");
      });
  }, [id, navigate]);

  const validationSchema = Yup.object({
    id: Yup.number().positive("ID must be positive").required("ID is required"),
    name: Yup.string().required("Name is required"),
    description: Yup.string().required("Description is required"),
    price: Yup.number()
      .typeError("Must be a number")
      .positive("Price must be positive")
      .required("Price is required"),
  });

  const handleSubmit = (values: any) => {
    axios
      .put(`http://127.0.0.1:5000/productUpdate/${id}`, values)
      .then(() => {
        message.success("Product updated successfully");
        navigate("/CreateProduct");
      })
      .catch((error) => {
        console.error("Update failed:", error);
        message.error("Failed to update product");
      });
  };

  return (
    <div style={{ maxWidth: 600, margin: "auto", paddingTop: 40 }}>
      <Title level={3}>Edit Product</Title>
      <Formik
        enableReinitialize
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ handleSubmit, handleChange, values, errors, touched }) => (
          <AntForm layout="vertical" onFinish={handleSubmit}>
            <AntForm.Item
              label="ID"
              validateStatus={touched.id && errors.id ? "error" : ""}
              help={touched.id && errors.id}
            >
              <Input
                name="id"
                value={values.id}
                onChange={handleChange}
                disabled
              />
            </AntForm.Item>

            <AntForm.Item
              label="Product Name"
              validateStatus={touched.name && errors.name ? "error" : ""}
              help={touched.name && errors.name}
            >
              <Input name="name" value={values.name} onChange={handleChange} />
            </AntForm.Item>

            <AntForm.Item
              label="Description"
              validateStatus={
                touched.description && errors.description ? "error" : ""
              }
              help={touched.description && errors.description}
            >
              <Input
                name="description"
                value={values.description}
                onChange={handleChange}
              />
            </AntForm.Item>

            <AntForm.Item
              label="Price"
              validateStatus={touched.price && errors.price ? "error" : ""}
              help={touched.price && errors.price}
            >
              <Input
                name="price"
                value={values.price}
                onChange={handleChange}
              />
            </AntForm.Item>

            <Button type="primary" htmlType="submit">
              Update Product
            </Button>
          </AntForm>
        )}
      </Formik>
    </div>
  );
}

export default EditProduct1;
