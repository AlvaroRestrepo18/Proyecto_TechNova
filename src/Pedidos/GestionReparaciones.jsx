import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClipboardList, faMoneyBill, faSearch } from '@fortawesome/free-solid-svg-icons';
import Pedidos from './Pedidos';
import Abonos from './Abonos';
import './GestionReparaciones.css';

const GestionReparaciones = () => {
  const [activeTab, setActiveTab] = useState('pedidos');
  const [pedidos, setPedidos] = useState([]);
  const [abonos, setAbonos] = useState([]);
  const [clientes, setClientes] = useState([]);

  useEffect(() => {
    // Cargar datos iniciales
    const mockClientes = [
      { cedula: '123456789', nombre: 'Juan Pérez' },
      { cedula: '987654321', nombre: 'María García' },
    ];
    
    const mockPedidos = [
      {
        id: 1,
        clienteCedula: '123456789',
        estado: 'Activo',
        prioridad: true,
        fecha: '2023-05-15',
        fechaReparacion: '2023-05-20',
        fechaEstimada: '2023-05-25',
        detallesDanio: 'Pantalla rota',
        detallesSolucion: 'Se reemplazó la pantalla',
        tipoReparacion: true,
        valor: 250000
      },
      {
        id: 2,
        clienteCedula: '987654321',
        estado: 'Activo',
        prioridad: false,
        fecha: '2023-06-01',
        fechaReparacion: '',
        fechaEstimada: '2023-06-10',
        detallesDanio: 'Batería no carga',
        detallesSolucion: '',
        tipoReparacion: false,
        valor: 120000
      }
    ];
    
    const mockAbonos = [
      {
        id: 1,
        numeroAbono: 101,
        numeroPedido: 1,
        fechaAbono: '2023-05-16',
        totalPedido: 250000,
        loQueDebe: 150000,
        abonado: 100000,
        estado: 'activo'
      }
    ];
    
    setClientes(mockClientes);
    setPedidos(mockPedidos);
    setAbonos(mockAbonos);
  }, []);

  const handleCreatePedido = (nuevoPedido) => {
    const newId = pedidos.length > 0 ? Math.max(...pedidos.map(p => p.id)) + 1 : 1;
    const newPedido = {
      id: newId,
      ...nuevoPedido,
      estado: 'Activo'
    };
    setPedidos([...pedidos, newPedido]);
    alert('Pedido creado exitosamente');
  };

  const handleEditPedido = (pedidoActualizado) => {
    const updatedPedidos = pedidos.map(p => 
      p.id === pedidoActualizado.id ? pedidoActualizado : p
    );
    setPedidos(updatedPedidos);
    alert('Pedido actualizado exitosamente');
  };

  const handleToggleEstado = (id) => {
    const updatedPedidos = pedidos.map(p => {
      if (p.id === id) {
        const newEstado = p.estado === 'Activo' ? 'Inactivo' : 'Activo';
        return {...p, estado: newEstado};
      }
      return p;
    });
    setPedidos(updatedPedidos);
  };

  const handleAnularPedido = (id) => {
    const updatedPedidos = pedidos.map(p => 
      p.id === id ? {...p, estado: 'Anulado'} : p
    );
    setPedidos(updatedPedidos);
    alert('Pedido anulado exitosamente');
  };

  const handleCreateAbono = (nuevoAbono) => {
    const newId = abonos.length > 0 ? Math.max(...abonos.map(a => a.id)) + 1 : 1;
    const newAbono = {
      id: newId,
      ...nuevoAbono,
      estado: 'activo'
    };
    setAbonos([...abonos, newAbono]);
    alert('Abono creado exitosamente');
  };

  const handleAnularAbono = (id) => {
    const updatedAbonos = abonos.map(a => 
      a.id === id ? {...a, estado: 'anulado'} : a
    );
    setAbonos(updatedAbonos);
    alert('Abono anulado exitosamente');
  };

  const handleShowAbono = (pedido) => {
    // Implementar lógica para mostrar el abono relacionado con el pedido
  };

  return (
    <div className="gestion-reparaciones">
      <h1>Gestión de Reparaciones</h1>
      
      <div className="tabs">
        <button
          className={`tab-button ${activeTab === 'pedidos' ? 'active' : ''}`}
          onClick={() => setActiveTab('pedidos')}
        >
          <FontAwesomeIcon icon={faClipboardList} /> Pedidos
        </button>
        <button
          className={`tab-button ${activeTab === 'abonos' ? 'active' : ''}`}
          onClick={() => setActiveTab('abonos')}
        >
          <FontAwesomeIcon icon={faMoneyBill} /> Abonos
        </button>
      </div>

      <div className="search-input-container">
        <input
          type="text"
          placeholder={
            activeTab === 'pedidos'
              ? 'Buscar por cliente o detalles del pedido'
              : 'Buscar por número de abono o cliente'
          }
          className="search-input"
        />
      </div>

      <div className="tab-content">
        {activeTab === 'pedidos' ? (
          <Pedidos 
            pedidos={pedidos}
            clientes={clientes}
            onCreate={handleCreatePedido}
            onEdit={handleEditPedido}
            onDelete={handleAnularPedido}
            onToggleEstado={handleToggleEstado}
            onShowAbono={handleShowAbono}
          />
        ) : (
          <Abonos 
            abonos={abonos} 
            pedidos={pedidos}
            onCreate={handleCreateAbono}
            onAnular={handleAnularAbono}
          />
        )}
      </div>
    </div>
  );
};

export default GestionReparaciones;
