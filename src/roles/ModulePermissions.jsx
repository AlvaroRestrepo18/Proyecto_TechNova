// src/roles/ModulePermissions.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Roles.css";
import { FiSettings, FiKey, FiUsers, FiShoppingCart, FiBox, FiTruck, FiTag, FiTool, FiClock, FiServer, FiDollarSign, FiShoppingBag, FiUser, FiPieChart } from "react-icons/fi";

// Tu estructura de módulos
const menuSections = [
  {
    title: "Configuración",
    icon: <FiSettings />,
    items: [
      { name: "Roles", path: "/roles", icon: <FiKey /> },
      { name: "Usuarios", path: "/usuarios", icon: <FiUsers /> },
    ],
  },
  {
    title: "Compras",
    icon: <FiShoppingCart />,
    items: [
      { name: "Compras", path: "/compras", icon: <FiShoppingCart /> },
      { name: "Productos", path: "/productos", icon: <FiBox /> },
      { name: "Proveedores", path: "/proveedores", icon: <FiTruck /> },
      { name: "Categoría de productos", path: "/catpro", icon: <FiTag /> },
    ],
  },
  {
    title: "Servicios",
    icon: <FiTool />,
    items: [
      { name: "Servicios", path: "/servicios", icon: <FiTool /> },
      { name: "Categoría de servicios", path: "/catser", icon: <FiTag /> },
      { name: "Tiempos", path: "/tiempos", icon: <FiClock /> },
      { name: "Equipos", path: "/equipos", icon: <FiServer /> },
    ],
  },
  {
    title: "Ventas",
    icon: <FiDollarSign />,
    items: [
      { name: "Ventas", path: "/ventas", icon: <FiDollarSign /> },
      { name: "Pedidos", path: "/gestionReparaciones", icon: <FiShoppingBag /> },
      { name: "Clientes", path: "/clientesFidelizacion", icon: <FiUser /> },
    ],
  },
  {
    title: "Dashboard",
    icon: <FiPieChart />,
    items: [{ name: "Dashboard", path: "/dashboard", icon: <FiPieChart /> }],
  },
];

// Helpers para normalizar strings y hacer matching
const normalizeString = (str) =>
  str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "")
    .replace(/_/g, "");

const buildModuleMap = (sections) => {
  const map = new Map();
  sections.forEach(({ title, items }) => {
    items.forEach(({ name }) => {
      map.set(normalizeString(name), title);
    });
  });
  return map;
};

const moduleMap = buildModuleMap(menuSections);

const ModulePermissions = ({
  selectedPermissions = [],
  onPermissionToggle = null,
  isDisabled = false,
  apiUrl = "https://cyber360-api.onrender.com/api/permisos",
}) => {
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Obtener id y nombre del permiso
  const getPermisoId = (permiso) =>
    permiso?.id ?? permiso?.Id ?? permiso?.id_permiso ?? null;

  const getPermisoName = (permiso) =>
    permiso?.nombre ?? permiso?.Nombre ?? permiso?.nombre_permiso ?? "(sin nombre)";

  // Capitalizar nombres para mostrar (separar espacios y capitalizar)
  const formatModuleName = (str) => {
    if (!str) return "";
    return str
      .replace(/_/g, " ")
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  // Encontrar módulo del permiso
  const getModuleNameFromPermission = (permName) => {
    if (!permName) return "Otros";
    const norm = normalizeString(permName);
    return moduleMap.get(norm) || "Otros";
  };

  // Cargar permisos de API
  useEffect(() => {
    const fetchPermissions = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data } = await axios.get(apiUrl);
        if (Array.isArray(data)) {
          setPermissions(data);
        } else {
          console.warn("Respuesta inesperada de /api/permisos:", data);
          setPermissions([]);
        }
      } catch (err) {
        console.error("Error al obtener permisos:", err);
        setError("No se pudieron cargar los permisos");
        setPermissions([]);
      } finally {
        setLoading(false);
      }
    };
    fetchPermissions();
  }, [apiUrl]);

  // Determinar si un permiso está seleccionado
  const isSelected = (id) => {
    const idStr = String(id);
    return selectedPermissions.some((s) => String(s) === idStr);
  };

  // Manejar toggle de permiso
  const handleToggle = (id, name) => {
    if (typeof onPermissionToggle === "function") {
      try {
        onPermissionToggle(id, name);
      } catch (e) {
        console.warn("onPermissionToggle lanzó un error:", e);
      }
    }
  };

  // Agrupar permisos por módulo
  const groupedPermissions = permissions.reduce((acc, permiso) => {
    const pname = getPermisoName(permiso);
    const module = getModuleNameFromPermission(pname);
    if (!acc[module]) acc[module] = [];
    acc[module].push(permiso);
    return acc;
  }, {});

  if (loading) {
    return (
      <div className="modules-container">
        <h3>Permisos disponibles</h3>
        <p>Cargando permisos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="modules-container">
        <h3>Permisos disponibles</h3>
        <p style={{ color: "red" }}>{error}</p>
      </div>
    );
  }

  return (
    <div className="modules-container">
      <h3>Permisos disponibles</h3>
      {menuSections.map(({ title }) => {
        const permisos = groupedPermissions[title] || [];
        if (permisos.length === 0) return null;
        return (
          <div key={title} className="module-group">
            <h4>{title}</h4>
            <div className="modules-grid">
              {permisos.map((permiso, index) => {
                const pid = getPermisoId(permiso) ?? `permiso-${index}`;
                const pname = getPermisoName(permiso);
                const key = `${pid}-${String(pname).replace(/\s+/g, "_")}`;
                return (
                  <label
                    key={key}
                    className="module-checkbox"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected(pid)} 
                      onChange={() => handleToggle(pid, pname)}
                      disabled={isDisabled}
                    />
                    {formatModuleName(pname)}
                  </label>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* Mostrar permisos que no coinciden en "Otros" */}
      {groupedPermissions["Otros"] && groupedPermissions["Otros"].length > 0 && (
        <div className="module-group">
          <h4>Otros</h4>
          <div className="modules-grid">
            {groupedPermissions["Otros"].map((permiso, index) => {
              const pid = getPermisoId(permiso) ?? `permiso-otros-${index}`;
              const pname = getPermisoName(permiso);
              const key = `${pid}-${String(pname).replace(/\s+/g, "_")}`;
              return (
                <label
                  key={key}
                  className="module-checkbox"
                  onClick={(e) => e.stopPropagation()}
                >
                  <input
                    type="checkbox"
                    checked={isSelected(pid)}
                    onChange={() => handleToggle(pid, pname)}
                    disabled={isDisabled}
                  />
                  {formatModuleName(pname)}
                </label>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default ModulePermissions;
