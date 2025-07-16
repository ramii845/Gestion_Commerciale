import { useState } from 'react'
import Home from './components/home'
import { CartProvider } from "use-shopping-cart";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { ToastContainer } from "react-toastify";
import Login from './components/authentification/login';
import CommercialeHome from './components/commerciales/commercileHome';
import ListLeads from './components/commerciales/commercialeLeads/ListLeads';

function App() {
  const [count, setCount] = useState(0)

  return (
    
   <CartProvider>
            <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <Router>
        <Routes>
          <Route path="/" element={<Login/>} />
          <Route path="/commerciale" element={<CommercialeHome/>} />
          <Route path="/commerciale/leads" element={<ListLeads/>} />
       </Routes>
      </Router>

 
    </CartProvider>
  )
}

export default App
