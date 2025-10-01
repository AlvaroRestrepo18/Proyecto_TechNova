// src/roles/ModulePermissions.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import "../roles.css";
import {
  FiSettings,
  FiKey,
  FiUsers,
  FiShoppingCart,
  FiBox,
  FiTruck,
  FiTag,
  FiTool,
  FiDollarSign,
  FiUser,
} from "react-icons/fi";

// ====================
// Estructura de módulos
// ====================
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
      { name: "Categorías", path: "/catpro", icon: <FiTag /> },
    ],
  },
  {
    title: "Servicios",
    icon: <FiTool />,
    items: [{ name: "Servicios", path: "/servicios", icon: <FiTool /> }],
  },
  {
    title: "Ventas",
    icon: <FiDollarSign />,
    items: [
      { name: "Ventas", path: "/ventas", icon: <FiDollarSign /> },
      { name: "Clientes", path: "/clientesFidelizacion", icon: <FiUser /> },
    ],
  },
];

// ====================
// Helpers
// ====================
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

// ====================
// Component
// ====================
const ModulePermissions = ({
  selectedPermissions = [], // puede ser array de IDs o de objetos
  onPermissionToggle = null,
  isDisabled = false,
  apiUrl = "https://localhost:7228/api/Permisoes",
}) => {
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Helpers para IDs y nombres
  const getPermisoId = (permiso) =>
    permiso?.id ??
    permiso?.Id ??
    permiso?.idPermiso ??
    permiso?.IdPermiso ??
    null;

  const getPermisoName = (permiso) =>
    permiso?.nombre ??
    permiso?.Nombre ??
    permiso?.nombrePermiso ??
    permiso?.NombrePermiso ??
    "(sin nombre)";

  const formatModuleName = (str) =>
    str
      ? str
          .replace(/_/g, " ")
          .split(" ")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ")
      : "";

  const getModuleNameFromPermission = (permName) => {
    if (!permName) return null;
    const norm = normalizeString(permName);
    return moduleMap.get(norm) || null;
  };

  // Fetch permisos del backend
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

  // 🔹 Verificar si un permiso está seleccionado
  const isSelected = (id) => {
    const idStr = String(id);
    return selectedPermissions.some(
      (s) =>
        String(s) === idStr || // array de IDs
        String(
          s?.idPermiso ?? s?.IdPermiso ?? s?.id ?? s?.Id ?? null
        ) === idStr // array de objetos
    );
  };

  // Toggle
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
    if (!module) return acc;
    if (!acc[module]) acc[module] = [];
    acc[module].push(permiso);
    return acc;
  }, {});

  // Render
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
                const key = `${pid}-${normalizeString(pname)}`;
                return (
                  <label
                    key={key}
                    className="module-checkbox"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected(pid)} // 🔹 Aquí se marca si el rol ya tiene ese permiso
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
    </div>
  );
};

export default ModulePermissions;
