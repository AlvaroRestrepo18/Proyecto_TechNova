import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Header from './shared/header/header';
import Sidebar from './shared/sidebar/sidebar';
import Users from './usuarios/usuarios';
import Productos from './Productos/Productos';
import Proveedores from './Proveedores/Proveedores';
import Catpro from './catpro/catpro';
import Ventas from './Ventas/ventas';
import Compras from './Compras/Compras';
import Footer from './shared/footer/footer';
import Roles from './roles/roles';
import Login from './acceso/login/login';
import Servicios from './Servicios/servicios';   
import Clientes from './Clientes/clientes';    
import ForgotPassword from './acceso/forgot/forgot';
import ResetPassword from './acceso/reset/resetpassword';
import ModalAlerta from './shared/modals/ModalAlerta';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';

library.add(fas);
import './App.css';

// Importamos el PrivateRoute
import PrivateRoute from './PrivateRoute';

function AppLayout({ children }) {
  const location = useLocation();
  const isAuthPage = ['/login', '/forgot', '/reset'].includes(location.pathname);

  return (
    <div className="app-container">
      {!isAuthPage && <Header />}
      <div className="app-content">
        {!isAuthPage && <Sidebar />}
        <main className={`main-content ${isAuthPage ? 'login-page' : ''}`}>
          {children}
        </main>
      </div>
      {!isAuthPage && <Footer />}
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        {/* Rutas sin layout */}
        <Route path="/login" element={<Login />} />
        <Route path="/forgot" element={<ForgotPassword />} />
        <Route path="/reset" element={<ResetPassword />} />

        {/* Rutas con layout */}
        <Route
          path="*"
          element={
            <AppLayout>
              <ModalAlerta />
              {/* Aquí se definen las rutas principales de la aplicación */}
              <Routes>
                <Route
                  path="/usuarios"
                  element={
                    <PrivateRoute>
                      <Users />
                    </PrivateRoute>
                  }
                />
                <Route path="/Productos" element={<Productos />} />
                <Route path="/Proveedores" element={<Proveedores />} />
                <Route path="/ventas" element={<Ventas />} />
                <Route path="/catpro" element={<Catpro />} />
                <Route path="/Compras" element={<Compras />} />
                <Route path="/Clientes" element={<Clientes />} />   {/* ✅ */}
                <Route path="/Servicios" element={<Servicios />} /> {/* ✅ */}

                <Route
                  path="/roles"
                  element={
                    <PrivateRoute>
                      <Roles />
                    </PrivateRoute>
                  }
                />
                {/* Página raíz ahora apunta a Usuarios */}
                <Route path="/" element={<Users />} />
              </Routes>
            </AppLayout>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
