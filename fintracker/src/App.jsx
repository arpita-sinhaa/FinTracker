import { useState } from 'react'
import './App.css'
import Header from "./components/Header"
import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import search from './assets/search.svg';
import transactions from './assets/transactions.svg';
import user from './assets/user.svg';
import Dashboard from './pages/Dashboard';
import Signup from './pages/Signup';
import {ToastContainer, toast} from "react-toastify";


function App() {
  return (
    <> <ToastContainer/>
     <Router>
      <Routes>
        <Route path="/" element={<Signup/>} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
    </>
  )
}

export default App
