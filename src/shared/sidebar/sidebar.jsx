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
  FiDollarSign
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
      { name: 'Gestion de compras', path: '/compras', icon: <FiShoppingCart /> },
      { name: 'Gestion de productos', path: '/productos', icon: <FiBox /> },
      { name: 'Gestion de  proveedores', path: '/proveedores', icon: <FiTruck /> },
      { name: 'Gestion de categorías', path: '/catpro', icon: <FiTag /> }
    ]
  },
  {
    title: "Ventas",
    icon: <FiDollarSign />,
    items: [
      { name: 'Gestion de ventas', path: '/ventas', icon: <FiDollarSign /> }
    ]
  }
];

const Sidebar = () => {
  const [openSections, setOpenSections] = useState({
    configuración: false,
    compras: false,
    ventas: false
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
