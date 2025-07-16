import { useState } from 'react'
import Home from './components/home'
import { CartProvider } from "use-shopping-cart";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { ToastContainer } from "react-toastify";
import Login from './components/authentification/login';

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
       </Routes>
      </Router>

 
    </CartProvider>
  )
}

export default App
