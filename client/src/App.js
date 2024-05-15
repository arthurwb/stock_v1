import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./css/app.css";

import AboutUs from "./AboutUs";
import Data from "./Data";
import OptionData from "./OptionData";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Data />} />
          <Route path="/data/:option" element={<OptionData />} /> 
          <Route path="/about-us" element={<AboutUs />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
