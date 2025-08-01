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
import ListUsers from './components/admin/users/ListUsers';
import AddUser from './components/admin/users/AddUsers';
import EditUser from './components/admin/users/EditUser';
import ManagerHome from './components/admin/ManagerHome';
import CommercialeRoute from './components/utils/ComercialeRoute';
import ResponsableVenteRoute from './components/utils/ResponsableVenteRoute';
import ManagerRoute from './components/utils/ManagerRoute';
import ResetPasswordPage from './components/authentification/ResetPasswordPage';
import ListeManVentes from './components/admin/ventes/ListeManVentes';
import AddManVente from './components/admin/ventes/addManVente';
import EditManVente from './components/admin/ventes/EditManVente';
import ListManPromesse from './components/admin/promesse/ListManPromesse';
import AddManPromesse from './components/admin/promesse/addManPromesse';
import ListManLeads from './components/admin/leads/ListManLeads';
import AddManLead from './components/admin/leads/addManLead';
import NotFoundPage from './components/utils/NotFoundPage';
import ListeResLeads from './components/responsable_vente/leads/ListResLeads';
import LeadsStats from './components/Dashboard/LeadsStats';
import EditLead from './components/commerciales/commercialeLeads/EditLead';
import EditLeadRes from './components/responsable_vente/leads/EditLeadRes';
import Dashboard from './components/Dashboard/Dashboard';
import EditPromesse from './components/commerciales/commercicalePromesse/EditPromesse';
import EditResPromesse from './components/responsable_vente/promesse/EditResPromesse';
import EditManPromesse from './components/admin/promesse/EditManPromesse';

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

     <Route path="/commerciale" element={<CommercialeRoute element={<CommercialeHome />} />} />
<Route path="/commerciale/leads" element={<CommercialeRoute element={<ListLeads />} />} />
<Route path="/edit-lead/:id" element={<CommercialeRoute element={<EditLead/>} />} />

<Route path="/add-lead" element={<CommercialeRoute element={<AddLead />} />} />
<Route path="/commerciale/promesses" element={<CommercialeRoute element={<ListPromesse />} />} />
<Route path="/add-promesse" element={<CommercialeRoute element={<AddPromesse />} />} />
<Route path="/edit-promesse/:id" element={<CommercialeRoute element={<EditPromesse/>} />} />


<Route path="/commerciale/ventes" element={<CommercialeRoute element={<ListeVentes />} />} />
<Route path="/add-vente" element={<CommercialeRoute element={<AddVente />} />} />
<Route path="/edit-vente/:id" element={<CommercialeRoute element={<EditVente />} />} />

          {/* responsable*/}
       <Route path="/responsable" element={<ResponsableVenteRoute element={<ResponsableHome />} />} />
<Route path="/responsable/ventes" element={<ResponsableVenteRoute element={<ListeResVentes />} />} />
<Route path="/add-vente-res" element={<ResponsableVenteRoute element={<AddResVente />} />} />
<Route path="/edit-vente-res/:id" element={<ResponsableVenteRoute element={<EditResVente />} />} />
<Route path="/responsable/promesses" element={<ResponsableVenteRoute element={<ListResPromesse />} />} />
<Route path="/add-promesse-res" element={<ResponsableVenteRoute element={<AddResPromesse />} />} />
<Route path="/edit-Res-promesse/:id" element={<ResponsableVenteRoute element={<EditResPromesse/>} />} />
<Route path="/add-lead-res" element={<ResponsableVenteRoute element={<AddResLead />} />} />
<Route path="/edit-lead-res/:id" element={<ResponsableVenteRoute element={<EditLeadRes />} />} />
<Route path="/responsable/leads" element={<ResponsableVenteRoute element={<ListeResLeads />} />} />
 
          {/* Manager*/}
          
<Route path="/ManagerPage" element={<ManagerRoute element={<ManagerHome />} />} />
<Route path="/list" element={<ManagerRoute element={<ListUsers />} />} />
<Route path="/add-user" element={<ManagerRoute element={<AddUser />} />} />
<Route path="/edit-user/:id" element={<ManagerRoute element={<EditUser />} />} />
<Route path="/reset-password" element={<ManagerRoute element={<ResetPasswordPage />} />} />

<Route path="/manager/ventes" element={<ManagerRoute element={<ListeManVentes />} />} />
<Route path="/add-vente-man" element={<ManagerRoute element={<AddManVente />} />} />
<Route path="/edit-vente-man/:id" element={<ManagerRoute element={<EditManVente />} />} />

<Route path="/manager/promesses" element={<ManagerRoute element={<ListManPromesse />} />} />
<Route path="/add-promesse-man" element={<ManagerRoute element={<AddManPromesse />} />} />
<Route path="/edit-man-promesse/:id" element={<ManagerRoute element={<EditManPromesse/>} />} />

<Route path="/manager/leads" element={<ManagerRoute element={<ListManLeads />} />} />
<Route path="/add-lead-man" element={<ManagerRoute element={<AddManLead />} />} />

<Route path="/stat" element={<LeadsStats/>}  />

<Route path="/dash" element={<Dashboard/>}  />







<Route path="*" element={<NotFoundPage/>} />





             
       </Routes>
      </Router>

 
    </CartProvider>
  )
}

export default App
