import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";

function EditProduct() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [initialValues, setInitialValues] = useState({
    name: "",
    description: "",
    price: "",
  });

  useEffect(() => {
    axios
      .get(`http://127.0.0.1:5000/get-data`)
      .then((response) => {
        const product = response.data.find(
          (p: any) => p.id === parseInt(id || "")
        );
        if (product) {
          setInitialValues({
            name: product.name,
            description: product.description,
            price: product.price,
          });
        } else {
          alert("Product not found");
          navigate("/");
        }
      })
      .catch((error) => {
        console.error("Error fetching product:", error);
      });
  }, [id, navigate]);

  const validationSchema = Yup.object({
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
        alert("Product updated successfully");
        navigate("/CreateProduct");
      })
      .catch((error) => {
        console.error("Update failed:", error);
        alert("Failed to update product");
      });
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "600px" }}>
      <h3>Edit Product</h3>
      <Formik
        enableReinitialize
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            <div className="mb-3">
              <label className="form-label">Product Name</label>
              <Field name="name" className="form-control" />
              <ErrorMessage
                name="name"
                component="div"
                className="text-danger"
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Description</label>
              <Field name="description" className="form-control" />
              <ErrorMessage
                name="description"
                component="div"
                className="text-danger"
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Price</label>
              <Field name="price" className="form-control" />
              <ErrorMessage
                name="price"
                component="div"
                className="text-danger"
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              Update Product
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default EditProduct;
