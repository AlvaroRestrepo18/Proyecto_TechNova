import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faStar, faSearch } from '@fortawesome/free-solid-svg-icons';
import Clientes from './Clientes';
import Fidelizacion from './Fidelizacion';
import './ClientesFidelizacion.css'; // Si aún contiene estilos únicos

const ClientesFidelizacion = () => {
  const [activeTab, setActiveTab] = useState('clientes');
  const [clientesData, setClientesData] = useState([
    {
      id: '1',
      nombre: 'Juan',
      apellido: 'Pérez',
      tipoDoc: 'CC',
      documento: 123456789,
      fechaNac: '1990-05-15',
      celular: 3001234567,
      correo: 'juan@example.com',
      direccion: 'Calle 123',
      activo: true,
    },
    {
      id: '2',
      nombre: 'María',
      apellido: 'Gómez',
      tipoDoc: 'CE',
      documento: 987654321,
      fechaNac: '1985-10-20',
      celular: 3109876543,
      correo: 'maria@example.com',
      direccion: 'Carrera 45',
      activo: true,
    },
  ]);

  return (
    <div className="page-container">
      <div className="tabs">
        <button
          className={`tab-button ${activeTab === 'clientes' ? 'active' : ''}`}
          onClick={() => setActiveTab('clientes')}
        >
          <FontAwesomeIcon icon={faUsers} /> Clientes
        </button>
        <button
          className={`tab-button ${activeTab === 'fidelizacion' ? 'active' : ''}`}
          onClick={() => setActiveTab('fidelizacion')}
        >
          <FontAwesomeIcon icon={faStar} /> Fidelización
        </button>
      </div>

      <div className="search-input-container">
        
        <input
          type="text"
          placeholder={
            activeTab === 'clientes'
              ? 'Buscar por nombre, apellido o documento'
              : 'Buscar por documento o nombre de cliente'
          }
          className="search-input"
        />
      </div>

      <div className="tab-content">
        {activeTab === 'clientes' ? (
          <Clientes clientesData={clientesData} setClientesData={setClientesData} />
        ) : (
          <Fidelizacion clientesData={clientesData} />
        )}
      </div>
    </div>
  );
};

export default ClientesFidelizacion;
