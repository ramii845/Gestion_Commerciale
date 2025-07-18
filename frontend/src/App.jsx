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
import EditVente from './components/commerciales/commercialeVente/EditVente';
import ResponsableHome from './components/responsable_vente/responsableHome';
import ListeResVentes from './components/responsable_vente/Ventes/ListeResVentes';
import AddResVente from './components/responsable_vente/Ventes/addResVente';
import EditResVente from './components/responsable_vente/Ventes/EditResVente';
import ListResPromesse from './components/responsable_vente/promesse/ListResPromesse';
import AddResPromesse from './components/responsable_vente/promesse/addResPromesse';
import AddResLead from './components/responsable_vente/leads/addResLead';

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

          {/* Commerciale */}

          <Route path="/commerciale" element={<CommercialeHome/>} />
          <Route path="/commerciale/leads" element={<ListLeads/>} />
 <Route path='/add-lead' element={<AddLead/>} />
<Route path='/commerciale/promesses' element={<ListPromesse/>} />
 <Route path='/add-promesse' element={<AddPromesse/>} />
 <Route path='/commerciale/ventes' element={<ListeVentes/>} />
 <Route path='/add-vente' element={<AddVente/>} />
 <Route path='/edit-vente/:id' element={<EditVente/>} />
 
          {/* responsable*/}
          <Route path="/responsable" element={<ResponsableHome/>} />
           <Route path='/responsable/ventes' element={<ListeResVentes/>} />
            <Route path='/add-vente-res' element={<AddResVente/>} />
            <Route path='/edit-vente-res/:id' element={<EditResVente/>} />
            <Route path='/responsable/promesses' element={<ListResPromesse/>} />
             <Route path='/add-promesse-res' element={<AddResPromesse/>} />
             <Route path="/responsable/leads" element={<ListLeads/>} />
 <Route path='/add-lead-res' element={<AddResLead/>} />
             
       </Routes>
      </Router>

 
    </CartProvider>
  )
}

export default App
