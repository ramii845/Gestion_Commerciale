import { useState } from 'react'
import Home from './components/home'
import { CartProvider } from "use-shopping-cart";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { ToastContainer } from "react-toastify";
import Login from './components/authentification/login';
import CommercialeHome from './components/commerciales/commercileHome';
import ListLeads from './components/commerciales/commercialeLeads/ListLeads';
import AddLead from './components/commerciales/commercialeLeads/AddLead';
import ListPromesse from './components/commerciales/commercicalePromesse/ListPromesse';
import AddPromesse from './components/commerciales/commercicalePromesse/AddPromesse';
import ListeVentes from './components/commerciales/commercialeVente/ListeVents';
import AddVente from './components/commerciales/commercialeVente/AddVente';

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
 <Route path='/add-lead' element={<AddLead/>} />
<Route path='/commerciale/promesses' element={<ListPromesse/>} />
 <Route path='/add-promesse' element={<AddPromesse/>} />
 <Route path='/commerciale/ventes' element={<ListeVentes/>} />
 <Route path='/add-vente' element={<AddVente/>} />

 
          
       </Routes>
      </Router>

 
    </CartProvider>
  )
}

export default App
