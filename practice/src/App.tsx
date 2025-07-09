import AboutUs from "./AboutUs.tsx";
import "./App.css";
import CountingState from "./countingState.tsx";
import CreateProduct from "./CreateProduct.tsx";
import EditProduct from "./EditProduct.tsx";
import EditProduct1 from "./EditProduct1.tsx";
import Home from "./Home.tsx";
import Login from "./Login.tsx";
import Fruits from "./message.tsx";
import ProductDetail from "./ProductDetail.tsx";
import ProductLayout from "./ProductLayout.tsx";
import SignUp from "./SignUp.tsx";
import StateManagement from "./StateManagement.tsx";
import UsingProp from "./UsingProp.tsx";
import { BrowserRouter, Routes, Route } from "react-router-dom";

//function App() {
//  return <p>Hello World</p>;
//<UsingProp product={"Computer"}></UsingProp>
//}
function Product() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ProductLayout />}>
          <Route index element={<Home />} />
          <Route path="CreateProduct" element={<CreateProduct />} />
          <Route path="SignUp" element={<SignUp />} />
          <Route path="Login" element={<Login />} />
          <Route path="userUpdate/:id/edit" element={<EditProduct1 />} />
          <Route path="AboutUs" element={<AboutUs />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default Product;
