// CreateProduct.tsx with proper auth-controlled visibility
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Formik, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

interface Product {
  id: number;
  name: String;
  description: String;
  price: String;
}

function CreateProduct() {
  const [showForm, setShowForm] = useState(false);
  const [showList, setShowList] = useState(false);
  const [product, setProduct] = useState({
    id: 0,
    name: "",
    description: "",
    price: "",
  });
  const [productList, setProductList] = useState<Product[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    getProducts();
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const res = await axios.get("http://localhost:5000/protected", {
        withCredentials: true,
      });
      setIsAuthenticated(true);
    } catch {
      setIsAuthenticated(false);
    } finally {
      setAuthChecked(true);
      getProducts();
    }
  };

  const getProducts = () => {
    axios.get("http://127.0.0.1:5000/get-data").then((response) => {
      setProductList(response.data);
    });
  };

  const toggleForm = () => {
    setShowForm((prev) => !prev);
    setSubmitted(false);
  };

  const toggleList = () => {
    setShowList((prev) => !prev);
  };

  const deleteUser = (id: number) => {
    axios
      .delete(`http://127.0.0.1:5000/userdelete/${id}`, {
        withCredentials: true,
      })
      .then(() => {
        getProducts();
        alert("Successfully Deleted");
      });
  };

  const logout = () => {
    document.cookie = "token=; Max-Age=0; path=/;";
    setIsAuthenticated(false);
    alert("You have been logged out.");
  };

  if (!authChecked) return <div>Loading...</div>;

  return (
    <div className="container pt-5">
      <div className="text-center">
        <h1>Product Overview</h1>
        <p>
          {isAuthenticated && (
            <button className="btn btn-warning me-2" onClick={logout}>
              Logout
            </button>
          )}
          {isAuthenticated && (
            <button className="btn btn-primary me-2" onClick={toggleForm}>
              {showForm ? "Cancel" : "Add Product"}
            </button>
          )}
          <button className="btn btn-primary" onClick={toggleList}>
            {showList ? "Cancel" : "List Product"}
          </button>
        </p>
      </div>

      {showForm && isAuthenticated && (
        <div className="card mx-auto" style={{ maxWidth: "500px" }}>
          <div className="card-body">
            <h5 className="card-title">Add a New Product</h5>
            <Formik
              initialValues={{ id: "", name: "", description: "", price: "" }}
              validationSchema={Yup.object({
                id: Yup.number()
                  .required("ID is required")
                  .positive("ID must be positive"),
                name: Yup.string().required("Name is required"),
                description: Yup.string(),
                price: Yup.number()
                  .required("Price is required")
                  .positive("Price must be positive"),
              })}
              onSubmit={async (values, { resetForm }) => {
                try {
                  await axios.post(
                    "http://localhost:5000/submit-form",
                    values,
                    { withCredentials: true }
                  );
                  getProducts();
                  setSubmitted(true);
                  resetForm();
                } catch (err) {
                  console.error("Error submitting form:", err);
                }
              }}
            >
              {({ handleSubmit, isSubmitting }) => (
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label">Product ID</label>
                    <Field type="number" name="id" className="form-control" />
                    <ErrorMessage
                      name="id"
                      component="div"
                      className="text-danger"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Product Name</label>
                    <Field type="text" name="name" className="form-control" />
                    <ErrorMessage
                      name="name"
                      component="div"
                      className="text-danger"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Description</label>
                    <Field
                      type="text"
                      name="description"
                      className="form-control"
                    />
                    <ErrorMessage
                      name="description"
                      component="div"
                      className="text-danger"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Price</label>
                    <Field
                      type="number"
                      name="price"
                      className="form-control"
                    />
                    <ErrorMessage
                      name="price"
                      component="div"
                      className="text-danger"
                    />
                  </div>
                  <button
                    type="submit"
                    className="btn btn-success"
                    disabled={isSubmitting}
                  >
                    Submit
                  </button>
                </form>
              )}
            </Formik>
            {submitted && (
              <div className="alert alert-success mt-3">
                Product added successfully!
              </div>
            )}
          </div>
        </div>
      )}

      {showList && (
        <div className="container h-100">
          <div className="row h-100">
            <div className="col-12">
              <h1>List Products</h1>
              <table className="table table-bordered table-striped">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Price</th>
                    {isAuthenticated && <th>Actions</th>}
                  </tr>
                </thead>
                <tbody>
                  {productList.map((prod, key) => (
                    <tr key={key}>
                      <td>{prod.id}</td>
                      <td>{prod.name}</td>
                      <td>{prod.description}</td>
                      <td>{prod.price}</td>
                      {isAuthenticated && (
                        <td>
                          <Link
                            to={`/userUpdate/${prod.id}/edit`}
                            className="btn btn-success me-2"
                          >
                            Edit
                          </Link>
                          <button
                            onClick={() => deleteUser(prod.id)}
                            className="btn btn-danger"
                          >
                            Delete
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CreateProduct;
