import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import './sidebar.css';
import { 
  FiSettings, 
  FiUsers, 
  FiKey, 
  FiShoppingCart, 
  FiBox, 
  FiTruck,
  FiTag,
  FiTool,
  FiClock,
  FiServer,
  FiDollarSign,
  FiShoppingBag,
  FiUser,
  FiPieChart
} from 'react-icons/fi';

const menuSections = [
  {
    title: "Configuración",
    icon: <FiSettings />,
    items: [
      { name: 'Roles', path: '/roles', icon: <FiKey /> },
      { name: 'Usuarios', path: '/usuarios', icon: <FiUsers /> },
    ]
  },
  {
    title: "Compras",
    icon: <FiShoppingCart />,
    items: [
      { name: 'Compras', path: '/compras', icon: <FiShoppingCart /> },
      { name: 'Productos', path: '/productos', icon: <FiBox /> },
      { name: 'Proveedores', path: '/proveedores', icon: <FiTruck /> },
      { name: 'Categorías de producto', path: '/catpro', icon: <FiTag /> }
    ]
  },
  {
    title: "Servicios",
    icon: <FiTool />,
    items: [
      { name: 'Servicios', path: '/servicios', icon: <FiTool /> },
      { name: 'Categoría de servicios', path: '/catser', icon: <FiTag /> },
      { name: 'Tiempos', path: '/tiempos', icon: <FiClock /> },
      { name: 'Equipos', path: '/equipos', icon: <FiServer /> }
    ]
  },
  {
    title: "Ventas",
    icon: <FiDollarSign />,
    items: [
      { name: 'Ventas', path: '/ventas', icon: <FiDollarSign /> },
      { name: 'Pedidos', path: '/gestionReparaciones', icon: <FiShoppingBag /> },
      { name: 'Clientes', path: '/clientesFidelizacion', icon: <FiUser /> }
    ]
  },
  {
    title: "Dashboard",
    icon: <FiPieChart />,
    items: [
      { name: 'Dashboard', path: '/dashboard', icon: <FiPieChart /> }
    ]
  }
];

const Sidebar = () => {
  const [openSections, setOpenSections] = useState({
    configuración: false,
    compras: false,
    ventas: false,
    servicios: false,
    dashboard: false
  });

  const toggleSection = (section) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
    <aside className="app-sidebar">
      {menuSections.map((section, index) => (
        <div key={index} className="sidebar-section">
          <div 
            className="sidebar-section-title"
            onClick={() => toggleSection(section.title.toLowerCase())}
          >
            <span className="section-icon">{section.icon}</span>
            {section.title}
          </div>
          <ul className={`submenu ${openSections[section.title.toLowerCase()] ? 'open' : ''}`}>
            {section.items.map((item, itemIndex) => (
              <li key={itemIndex}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) => 
                    `menu-item ${isActive ? 'active' : ''}`
                  }
                >
                  <span className="item-icon">{item.icon}</span>
                  {item.name}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </aside>
  );
};

export default Sidebar;
export { menuSections };