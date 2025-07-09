import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SignUpSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

const SignUp = () => {
  const navigate = useNavigate(); //

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <h2 className="text-center mb-4">Sign Up</h2>
          <Formik
            initialValues={{ name: "", email: "", password: "" }}
            validationSchema={SignUpSchema}
            onSubmit={async (
              values,
              { resetForm, setSubmitting, setStatus }
            ) => {
              try {
                const res = await axios.post(
                  "http://127.0.0.1:5000/signUp-form",
                  values
                );
                setStatus({ success: res.data.message });
                setSubmitting(false);

                // Optional: wait briefly before navigating
                setTimeout(() => {
                  navigate("/");
                }, 500);

                resetForm();
              } catch (err: any) {
                setStatus({
                  error: err.response?.data?.error || "Signup failed",
                });
                setSubmitting(false);
              }
            }}
          >
            {({ isSubmitting, status }) => (
              <Form>
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">
                    Name
                  </label>
                  <Field name="name" type="text" className="form-control" />
                  <ErrorMessage
                    name="name"
                    component="div"
                    className="text-danger"
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    Email
                  </label>
                  <Field name="email" type="email" className="form-control" />
                  <ErrorMessage
                    name="email"
                    component="div"
                    className="text-danger"
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="password" className="form-label">
                    Password
                  </label>
                  <Field
                    name="password"
                    type="password"
                    className="form-control"
                  />
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="text-danger"
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-100"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Sign Up"}
                </button>

                {status?.success && (
                  <div className="alert alert-success mt-3" role="alert">
                    {status.success}
                  </div>
                )}

                {status?.error && (
                  <div className="alert alert-danger mt-3" role="alert">
                    {status.error}
                  </div>
                )}
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
