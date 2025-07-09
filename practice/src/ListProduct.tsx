import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function ListProduct() {
  const [showForm, setShowForm] = useState(false);
  const [product, setProduct] = useState({
    id: 0,
    name: "",
    description: "",
    price: "",
  });
  const [productList, setProductList] = useState([]);

  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    getUsers();
  }, []);

  function getUsers() {
    axios.get("http://127.0.0.1:5000/get-data").then(function (response) {
      console.log(response.data);
      setProductList(response.data);
    });
  }

  const deleteUser = (id: number) => {
    axios
      .delete(`http://127.0.0.1:5000/userdelete/${id}`)
      .then(function (response) {
        console.log(response.data);
        getUsers();
      });
    alert("Successfully Deleted");
  };

  const toggleForm = () => {
    setShowForm((prev) => !prev);
    setSubmitted(false); // reset message when form toggled
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/submit-form", product);
      setProduct({ id: 0, name: "", description: "", price: "" });
      //fetchData(); // Refresh list after submission
      setSubmitted(true);
      setProduct({ id: 0, name: "", description: "", price: "" }); // reset form
    } catch (err) {
      console.error("Error submitting form:", err);
    }
  };

  return (
    <div>
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
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {productList.map((prod, key) => (
                  <tr key={key}>
                    <td>{product.name}</td>
                    <td>{product.description}</td>
                    <td>{product.price}</td>

                    <td>
                      <Link
                        to={`user/${product.id}/edit`}
                        className="btn btn-success"
                        style={{ marginRight: "10px" }}
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => deleteUser(product.id)}
                        className="btn btn-danger"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ListProduct;
