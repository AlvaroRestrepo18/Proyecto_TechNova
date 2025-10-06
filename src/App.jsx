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
import Servicios from './Servicios/Servicios';
import Clientes from './Clientes/clientes';
import ForgotPassword from './acceso/forgot/forgot';
import ResetPassword from './acceso/reset/resetpassword';
import ModalAlerta from './shared/modals/ModalAlerta';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import './App.css';

// FontAwesome icons
library.add(fas);

// Importar el PrivateRoute
import PrivateRoute from './PrivateRoute';

// 📦 Componente que maneja el layout principal
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

// 🚀 App principal con rutas
function App() {
  return (
    <Router>
      <Routes>
        {/* 🔓 Rutas públicas */}
        <Route path="/login" element={<Login />} />
        <Route path="/forgot" element={<ForgotPassword />} />
        <Route path="/reset" element={<ResetPassword />} />

        {/* 🔒 Rutas protegidas con layout */}
        <Route
          path="*"
          element={
            <AppLayout>
              <ModalAlerta />
              <Routes>
                {/* ✅ TODAS las rutas protegidas por PrivateRoute */}
                <Route
                  path="/usuarios"
                  element={
                    <PrivateRoute>
                      <Users />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/roles"
                  element={
                    <PrivateRoute>
                      <Roles />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/Productos"
                  element={
                    <PrivateRoute>
                      <Productos />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/Proveedores"
                  element={
                    <PrivateRoute>
                      <Proveedores />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/ventas"
                  element={
                    <PrivateRoute>
                      <Ventas />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/catpro"
                  element={
                    <PrivateRoute>
                      <Catpro />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/Compras"
                  element={
                    <PrivateRoute>
                      <Compras />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/Clientes"
                  element={
                    <PrivateRoute>
                      <Clientes />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/Servicios"
                  element={
                    <PrivateRoute>
                      <Servicios />
                    </PrivateRoute>
                  }
                />

                {/* Página raíz → Usuarios */}
                <Route
                  path="/"
                  element={
                    <PrivateRoute>
                      <Users />
                    </PrivateRoute>
                  }
                />
              </Routes>
            </AppLayout>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
