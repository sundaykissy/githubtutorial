import React, { useState } from "react";
import axios from "axios";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";

const LoginSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().required("Password is required"),
});

const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  return (
    <div style={{ maxWidth: "400px", margin: "auto", padding: "2rem" }}>
      <Formik
        initialValues={{ email: "", password: "" }}
        validationSchema={LoginSchema}
        onSubmit={async (values, { setSubmitting, setStatus }) => {
          setError("");
          setLoading(true);
          try {
            await axios.post("http://localhost:5000/login-form", values, {
              withCredentials: true,
            });
            setStatus({ success: "Login successful!" });
            window.location.href = "/CreateProduct";
          } catch (err: any) {
            setError(err.response?.data?.message || "Login failed");
          } finally {
            setSubmitting(false);
            setLoading(false);
          }
        }}
      >
        {({ isSubmitting, status }) => (
          <Form>
            <h3>Login</h3>
            <div className="mb-3">
              <label htmlFor="email">Email</label>
              <Field name="email" type="email" className="form-control" />
              <ErrorMessage
                name="email"
                component="div"
                className="text-danger"
              />
            </div>

            <div className="mb-3">
              <label htmlFor="password">Password</label>
              <Field name="password" type="password" className="form-control" />
              <ErrorMessage
                name="password"
                component="div"
                className="text-danger"
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary w-100"
              disabled={isSubmitting || loading}
            >
              {isSubmitting || loading ? "Logging in..." : "Login"}
            </button>

            {status?.success && (
              <div className="alert alert-success mt-3">{status.success}</div>
            )}
            {error && <div className="alert alert-danger mt-3">{error}</div>}
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default LoginForm;
