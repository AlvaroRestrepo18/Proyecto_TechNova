import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faChartLine, 
  faBox, 
  faMoneyBillWave, 
  faCalendarAlt,
  faClock,
  faLaptop
} from '@fortawesome/free-solid-svg-icons'; // Iconos individuales
import Chart from 'react-apexcharts';
import './dashboard.css';
// Luego usas los iconos así:
<FontAwesomeIcon icon={faChartLine} className="card-icon" />

const Dashboard = () => {
  // Datos para gráficos
  const ventasOptions = {
    chart: {
      id: 'ventas-chart',
      toolbar: {
        show: false
      }
    },
    xaxis: {
      categories: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun']
    }
  };

  const ventasSeries = [{
    name: 'Ventas',
    data: [3000, 4000, 3500, 5000, 4900, 6000]
  }];

  const serviciosOptions = {
    labels: ['Servicio A', 'Servicio B', 'Servicio C', 'Servicio D'],
    colors: ['#008FFB', '#00E396', '#FEB019', '#FF4560']
  };

  const serviciosSeries = [44, 55, 13, 33];

  return (
    <div className="dashboard-content">
      <h1 className="dashboard-title">Ganancias Dashboard</h1>
      
      {/* Primera fila: Resumen de ganancias */}
      <div className="dashboard-row">
        <div className="dashboard-card large">
          <div className="card-header">
            <faChartLine className="card-icon" />
            <h3>Ganancias de las ventas</h3>
            <div className="time-filters">
              <button className="active">Día</button>
              <button className="active">Semana</button>
              <button className="active">Mes</button>
              <button className="active">Año</button>
            </div>
          </div>
          <Chart
            options={ventasOptions}
            series={ventasSeries}
            type="area"
            height={250}
          />
        </div>
      </div>

      {/* Segunda fila: Servicios y equipos */}
      <div className="dashboard-row">
        <div className="dashboard-card">
          <div className="card-header">
            <faBox className="card-icon" />
            <h3>Servicios más vendidos</h3>
          </div>
          <Chart
            options={serviciosOptions}
            series={serviciosSeries}
            type="donut"
            height={250}
          />
        </div>

        <div className="dashboard-card">
          <div className="card-header">
            <faMoneyBillWave className="card-icon" />
            <h3>Ganancias por Equipos</h3>
          </div>
          <div className="stats-grid">
            <div className="stat-item">
              <span className="stat-label">Comisiones</span>
              <span className="stat-value">$2,450</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Comités</span>
              <span className="stat-value">$1,890</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Commerciales</span>
              <span className="stat-value">$3,120</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tercera fila: Tiempos de uso */}
      <div className="dashboard-row">
        <div className="dashboard-card large">
          <div className="card-header">
            <faClock className="card-icon" />
            <h3>Tiempos de uso de comedias y equipos</h3>
            <div className="time-filters">
              <button className="active">Día</button>
              <button className="active">Semana</button>
              <button className="active">Mes</button>
              <button className="active">Año</button>
            </div>
          </div>
          <div className="table-container">
            <table className="dashboard-table">
              <thead>
                <tr>
                  <th>Pedefee</th>
                  <th>Fecha</th>
                  <th>Mínimo</th>
                  <th>Número</th>
                  <th>Sistema</th>
                  <th>Tipo</th>
                  <th>Código</th>
                  <th>Dados</th>
                </tr>
              </thead>
              <tbody>
                {[...Array(5)].map((_, i) => (
                  <tr key={i}>
                    <td>Dato {i+1}</td>
                    <td>01/0{i+1}/2023</td>
                    <td>{i+2} hrs</td>
                    <td>#{i+1}00{i+1}</td>
                    <td>Sistema {i+1}</td>
                    <td>Tipo {i+1}</td>
                    <td>COD-00{i+1}</td>
                    <td>{i+2} dados</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;