/* eslint-disable react/prop-types */
import React, { useState, useEffect, Suspense } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import NotFound from "./Routes/NotFound/NotFound";
import "./index.css";
import Procedure from "./Routes/Procedure/Procedure";
import Footer from "./components/Footer";
import Searched from "./Routes/Searched/Searched";
import FeedbackSection from "./components/FeedbackSection";

// Lazy load your route components
const Home = React.lazy(() => import("./Routes/Home/Home"));
const Register = React.lazy(() => import("./Routes/Manage/Register/Register"));
const Login = React.lazy(() => import("./Routes/Manage/Login/Login"));
const Nav = React.lazy(() => import("./Routes/Navbar/Nav"));
const Create = React.lazy(() => import("./Routes/Create/Create"));
const Search = React.lazy(() => import("./Routes/Search/Search"));
const Product = React.lazy(() => import("./Routes/Product/Product"));
const Contact = React.lazy(() => import("./Routes/Contact/Contact"));
const ChatBox = React.lazy(() => import("./Routes/ChatBox/ChatBox"));

export const UserContext = React.createContext();

function App({ location }) {
  const [loading,setLoading] = useState(false);
  const [company, setCompany] = useState(() => {
    const storedCompany = localStorage.getItem("company");
    try {
      // Check if storedCompany is valid JSON before parsing
      return storedCompany ? JSON.parse(storedCompany) : { gmail: "", password: "" };
    } catch (error) {
      console.error("Error parsing storedCompany:", error);
      // If parsing fails, return the default value
      return { gmail: "", password: "" };
    }
  });
  
  const [status, setStatus] = useState("");
  location = useLocation();

  useEffect(() => {
    setTimeout(() => {
      setStatus("");
    }, 2000);
  }, [status]);

  useEffect(() => {
    localStorage.setItem("company", JSON.stringify(company));
  }, [company]);

  function clearUp(){
    localStorage.clear();
  }

  useEffect(() => {
    if (location.pathname === "/logout") {
      setCompany({ gmail: "", password: "" });
    }
  }, [location.pathname, setCompany]);



  const theStates = {
    company, setCompany, status, setStatus,loading,setLoading
  }



  return (
    <section className="bg-black flex flex-col justify-center items-center w-full">
      <UserContext.Provider value={theStates}>
        <Suspense fallback={<div>Loading...</div>}>
          <Nav />
          <Search />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/search/:item" element={<Searched />} />
            <Route path="/procedure" element={<Procedure />} />
            <Route path="/product/:id" element={<Product />} />
            {company && company.gmail && <Route path="/create" element={<Create />} />}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <FeedbackSection />
        </Suspense>
      </UserContext.Provider>
      <Footer />
    </section>
  );
}

export default App;
