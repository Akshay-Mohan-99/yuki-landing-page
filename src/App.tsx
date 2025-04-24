import React from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import ContactForm from "./components/ContactForm";
import Footer from "./components/Footer";

function App() {
  return (
    <div className=" font-800 min-h-screen bg-black">
      {/* <Navbar /> */}
      <Hero />
      <ContactForm />
      <Footer />
    </div>
  );
}

export default App;
