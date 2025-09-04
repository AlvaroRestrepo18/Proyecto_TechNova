// import React, { useState } from 'react';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faPlus, faTimes, faEye, faPen, faTrash } from '@fortawesome/free-solid-svg-icons';
// import './Proveedores.css';

// const Proveedores = () => {
//   const [searchTerm, setSearchTerm] = useState('');
//   const [isFormOpen, setIsFormOpen] = useState(false);
  
//   // Datos de ejemplo
//   const equipmentData = [
//     { id: '111-22-11', name: 'Juan Pérez', value: 'juan@email.com', phone: '3001234567' },
//     { id: '111-22-12', name: 'María Gómez', value: 'maria@email.com', phone: '3002345678' },
//     { id: '111-22-13', name: 'Carlos López', value: 'carlos@email.com', phone: '3003456789' },
//   ];

//   // Estado del formulario editable
//   const [formData, setFormData] = useState({
//     proveedorId: '',
//     nombre: '',
//     correo: '',
//     celular: '',
//     estado: 'activo',
//   });

//   const filteredEquipment = equipmentData.filter(equipo => 
//     equipo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     equipo.id.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const openForm = () => {
//     setIsFormOpen(true);
//     // Resetear formulario al abrir
//     setFormData({
//       proveedorId: '',
//       nombre: '',
//       correo: '',
//       celular: '',
//       estado: 'activo',
//     });
//   };

//   const closeForm = () => setIsFormOpen(false);

//   const handleChange = (e, index = null) => {
//     const { name, value } = e.target;
    
//     if (index !== null) {
//       const nuevosComponentes = [...formData.componentes];
//       nuevosComponentes[index] = value;
//       setFormData({...formData, componentes: nuevosComponentes});
//     } else {
//       setFormData({...formData, [name]: value});
//     }
//   };

//   return (
//     <div className="equipment-container">
//       <h1>Cyber360 - Proveedores</h1>
      
//       <div className="section-divider"></div>
      
//       <div className="search-container">
//         <input
//           type="text"
//           placeholder="Buscar proveedor"
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           className="search-input"
//         />
//       </div>
      
//       <div className="equipment-id-section">
//         <h3>Proveedor id</h3>
//         <p>Nombre proveedor</p>
//       </div>

//       <div className="create-header">
//         <button className="create-button" onClick={openForm}>
//           <FontAwesomeIcon icon={faPlus} /> Crear
//         </button>
//       </div>
      
//       <div className="table-container">
//         <table className="equipment-table">
//           <thead>
//             <tr>
//               <th>Documento</th>
//               <th>Nombre</th>
//               <th>Correo</th>
//               <th>Celular</th>
//               <th className='Action'>Acciones</th>
//             </tr>
//           </thead>
//           <tbody>
//             {filteredEquipment.map((equipo, index) => (
//               <tr key={index}>
//                 <td>{equipo.id}</td>
//                 <td>{equipo.name}</td>
//                 <td>{equipo.value}</td>
//                 <td>{equipo.phone}</td>
//                 <td>
//                   <button className="icon-button" title="Ver">
//                     <FontAwesomeIcon icon={faEye} />
//                   </button>
//                   <button className="icon-button" title="Editar">
//                     <FontAwesomeIcon icon={faPen} />
//                   </button>
//                   <button className="icon-button" title="Eliminar">
//                     <FontAwesomeIcon icon={faTrash} />
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {/* Modal de formulario */}
//       {isFormOpen && (
//         <div className="modal-overlay" onClick={closeForm}>
//           <div className="modal-content" onClick={e => e.stopPropagation()}>
//             <div className="modal-header">
//               <h2>Crear Nuevo Proveedor</h2>
//               <button className="close-button" onClick={closeForm}>
//                 <FontAwesomeIcon icon={faTimes} />
//               </button>
//             </div>

//             <div className="form-body">
//               <div className="form-group">
//                 <label>ID del Proveedor:</label>
//                 <input
//                   type="text"
//                   name="proveedorId"
//                   value={formData.proveedorId}
//                   onChange={handleChange}
//                   placeholder="PR-001"
//                 />
//               </div>

//               <div className="form-group">
//                 <label>Nombre:</label>
//                 <input
//                   type="text"
//                   name="nombre"
//                   value={formData.nombre}
//                   onChange={handleChange}
//                   placeholder="Nombre del proveedor"
//                 />
//               </div>

//               <div className="form-group">
//                 <label>Correo:</label>
//                 <input
//                   type="email"
//                   name="correo"
//                   value={formData.correo}
//                   onChange={handleChange}
//                   placeholder="correo@ejemplo.com"
//                 />
//               </div>

//               <div className="form-group">
//                 <label>Celular:</label>
//                 <input
//                   type="text"
//                   name="celular"
//                   value={formData.celular}
//                   onChange={handleChange}
//                   placeholder="3001234567"
//                 />
//               </div>

//               <div className="form-group">
//                 <label>Estado:</label>
//                 <select
//                   name="estado"
//                   value={formData.estado}
//                   onChange={handleChange}
//                 >
//                   <option value="activo">Activo</option>
//                   <option value="inactivo">Inactivo</option>
//                   <option value="mantenimiento">En mantenimiento</option>
//                 </select>
//               </div>

             
              

//               <div className="form-actions">
//                 <button className="cancel-button" onClick={closeForm}>
//                   Cancelar
//                 </button>
//                 <button className="submit-button" onClick={closeForm}>
//                   Crear
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Proveedores;
