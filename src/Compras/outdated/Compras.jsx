// import React, { useState } from 'react';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faPlus, faTimes, faEye, faPen, faTrash } from '@fortawesome/free-solid-svg-icons';
// import './Compras.css';

// const Compras = () => {
//   const [searchTerm, setSearchTerm] = useState('');
//   const [isFormOpen, setIsFormOpen] = useState(false);
  
//   // Datos de ejemplo de compras
//   const [comprasData, setComprasData] = useState([
//     { 
//       id: 'C-001', 
//       proveedor: 'Proveedor A', 
//       fecha: '08/04/2025', 
//       metodo: 'Transferencia',
//       productos: [
//         { id: 1, nombre: 'wilson camera', estado: 'Stipped', cantidad: 4, precio: 2500 },
//         { id: 2, nombre: 'wilson camera', estado: 'Stipped', cantidad: 3, precio: 2500 }
//       ],
//       detalles: ['TAR', 'MAGI'],
//       aquila: ''
//     },
//     { 
//       id: 'C-002', 
//       proveedor: 'Proveedor B', 
//       fecha: '09/04/2025', 
//       metodo: 'Efectivo',
//       productos: [
//         { id: 1, nombre: 'wilson camera', estado: 'Stipped', cantidad: 5, precio: 2500 }
//       ],
//       detalles: ['TAR', 'MAGI'],
//       aquila: ''
//     }
//   ]);

//   // Estado del formulario editable según la imagen
//   const [formData, setFormData] = useState({
//     numeroCompra: '',
//     proveedor: '',
//     fechaCompra: '',
//     metodoPago: '',
//     productos: [
//       { id: 1, nombre: 'wilson camera', estado: 'Stipped', cantidad: 4, precio: 2500 },
//       { id: 2, nombre: 'wilson camera', estado: 'Stipped', cantidad: 3, precio: 2500 },
//       { id: 3, nombre: 'wilson camera', estado: 'Stipped', cantidad: 5, precio: 2500 },
//       { id: 4, nombre: 'wilson camera', estado: 'Stipped', cantidad: 7, precio: 2500 }
//     ],
//     detalles: ['TAR', 'MAGI'],
//     aquila: ''
//   });

//   const filteredCompras = comprasData.filter(compra => 
//     compra.proveedor.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     compra.id.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   const openForm = () => {
//     setIsFormOpen(true);
//     // Resetear formulario al abrir según la imagen
//     setFormData({
//       numeroCompra: '',
//       proveedor: '',
//       fechaCompra: '',
//       metodoPago: '',
//       productos: [
//         { id: 1, nombre: '', estado: '', cantidad: 0, precio: 0 }
//       ],
//       detalles: ['', ''],
//       aquila: ''
//     });
//   };

//   const closeForm = () => setIsFormOpen(false);

//   const handleChange = (e, index = null, field = null) => {
//     const { name, value } = e.target;
    
//     if (index !== null && field === null) {
//       // Cambio en un producto
//       const nuevosProductos = [...formData.productos];
//       nuevosProductos[index][name] = value;
      
//       setFormData({
//         ...formData,
//         productos: nuevosProductos
//       });
//     } else if (field === 'detalles') {
//       // Cambio en los detalles (TAR, MAGI)
//       const nuevosDetalles = [...formData.detalles];
//       nuevosDetalles[index] = value;
      
//       setFormData({
//         ...formData,
//         detalles: nuevosDetalles
//       });
//     } else {
//       // Cambio en otros campos
//       setFormData({...formData, [name]: value});
//     }
//   };

//   const addProducto = () => {
//     const newId = formData.productos.length > 0 ? 
//       Math.max(...formData.productos.map(p => p.id)) + 1 : 1;
    
//     setFormData({
//       ...formData,
//       productos: [...formData.productos, { 
//         id: newId, 
//         nombre: '', 
//         estado: '', 
//         cantidad: 0, 
//         precio: 0 
//       }]
//     });
//   };

//   const removeProducto = (index) => {
//     const nuevosProductos = formData.productos.filter((_, i) => i !== index);
//     setFormData({
//       ...formData,
//       productos: nuevosProductos
//     });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     const nuevaCompra = {
//       id: formData.numeroCompra,
//       proveedor: formData.proveedor,
//       fecha: formData.fechaCompra,
//       metodo: formData.metodoPago,
//       productos: formData.productos,
//       detalles: formData.detalles,
//       aquila: formData.aquila
//     };
    
//     setComprasData([...comprasData, nuevaCompra]);
//     closeForm();
//   };

//   return (
//     <div className="compras-container">
//       <h1>Cyber360 - Compras</h1>
      
//       <div className="section-divider"></div>
      
//       <div className="search-container">
//         <input
//           type="text"
//           placeholder="Buscar Compras"
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           className="search-input"
//         />
//       </div>
      
//       <div className="compras-id-section">
//         <h3>Número de compra</h3>
//         <p>Nombre del proveedor</p>
//       </div>

//       <div className="create-header">
//         <button className="create-button" onClick={openForm}>
//           <FontAwesomeIcon icon={faPlus} /> Crear
//         </button>
//       </div>
      
//       <div className="table-container">
//         <table className="compras-table">
//           <thead>
//             <tr>
//               <th>Número compra</th>
//               <th>Proveedor</th>
//               <th>Fecha compra</th>
//               <th>Método pago</th>
//               <th className='Action'>Acciones</th>
//             </tr>
//           </thead>
//           <tbody>
//             {filteredCompras.map((compra, index) => (
//               <tr key={index}>
//                 <td>{compra.id}</td>
//                 <td>{compra.proveedor}</td>
//                 <td>{compra.fecha}</td>
//                 <td>{compra.metodo}</td>
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

//       {/* Modal de formulario para crear nueva compra - Actualizado según la imagen */}
//       {isFormOpen && (
//         <div className="modal-overlay" onClick={closeForm}>
//           <div className="modal-content" onClick={e => e.stopPropagation()}>
//             <div className="modal-header">
//               <h2>Crear</h2>
//               <button className="close-button" onClick={closeForm}>
//                 <FontAwesomeIcon icon={faTimes} />
//               </button>
//             </div>

//             <form className="form-body" onSubmit={handleSubmit}>
//               <h3>Numero Compra</h3>
              
//               {/* Campos superiores según la imagen */}
//               <div className="form-grid">
//                 <div className="form-group">
//                   <input
//                     type="text"
//                     name="numeroCompra"
//                     value={formData.numeroCompra}
//                     onChange={handleChange}
//                     placeholder="Numero de compra"
//                     required
//                   />
//                 </div>

//                 <div className="form-group">
//                   <input
//                     type="text"
//                     name="proveedor"
//                     value={formData.proveedor}
//                     onChange={handleChange}
//                     placeholder="Nombre proveedor"
//                     required
//                   />
//                 </div>

//                 <div className="form-group">
//                   <input
//                     type="text"
//                     name="fechaCompra"
//                     value={formData.fechaCompra}
//                     onChange={handleChange}
//                     placeholder="fecha de compra"
//                     required
//                   />
//                 </div>

//                 <div className="form-group">
//                   <input
//                     type="text"
//                     name="metodoPago"
//                     value={formData.metodoPago}
//                     onChange={handleChange}
//                     placeholder="Método de pago"
//                     required
//                   />
//                 </div>
//               </div>

//               <div className="section-divider"></div>

//               {/* Tabla de productos según la imagen */}
//               <h3>Detalle compra</h3>
              
//               <table className="products-table">
//                 <thead>
//                   <tr>
//                     <th>ID</th>
//                     <th>Venture produce</th>
//                     <th>Contador</th>
//                     <th>Precio</th>
//                     <th>Acciones</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {formData.productos.map((prod, index) => (
//                     <tr key={index}>
//                       <td>{prod.id}</td>
//                       <td>
//                         <input
//                           type="text"
//                           name="nombre"
//                           value={prod.nombre}
//                           onChange={(e) => handleChange(e, index)}
//                           placeholder="Venture produce"
//                           required
//                         />
//                       </td>
//                       <td>
//                         <input
//                           type="text"
//                           name="estado"
//                           value={prod.estado}
//                           onChange={(e) => handleChange(e, index)}
//                           placeholder="Contador"
//                           required
//                         />
//                       </td>
//                       <td>
//                         <input
//                           type="numero"
//                           name="precio"
//                           value={prod.precio}
//                           onChange={(e) => handleChange(e, index)}
//                           placeholder="Precio"
//                           required
//                         />
//                       </td>
//                       <td>
//                         <button 
//                           type="button" 
//                           className="icon-button"
//                           onClick={() => removeProducto(index)}
//                           title="Eliminar"
//                         >
//                           <FontAwesomeIcon icon={faTrash} />
//                         </button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>

//               <button 
//                 type="button" 
//                 className="add-button"
//                 onClick={addProducto}
//               >
//                 <FontAwesomeIcon icon={faPlus} /> Agregar Producto
//               </button>

            
             
//               <div className="form-actions">
//                 <button type="button" className="cancel-button" onClick={closeForm}>
//                   Cancelar
//                 </button>
//                 <button type="submit" className="submit-button">
//                   Guardar Compra
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Compras;