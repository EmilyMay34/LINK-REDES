import React, { useEffect, useState } from 'react';
import { Doughnut, Line, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, registerables } from 'chart.js';
import { createClient } from '@supabase/supabase-js';

ChartJS.register(...registerables);

// Configuración directa a tu base de datos de la captura
const supabase = createClient(
  "https://fodbwpaeodiweaatzmxw.supabase.co", 
  "sb_publishable_JK0VaywyUg5Q89xQRZQ6qQ_KD_UxdsH"
);

const App = () => {
  const [datos, setDatos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [vista, setVista] = useState('dashboard');
  const [tema, setTema] = useState('oscuro'); 

  const c = tema === 'oscuro' 
    ? { pri: '#ec4899', sec: '#0ea5e9', bg: '#0b0f1a', side: '#111827', card: '#1f2937', txt: '#f8fafc', brd: '#374151' }
    : { pri: '#db2777', sec: '#0284c7', bg: '#f8fafc', side: '#ffffff', card: '#ffffff', txt: '#1e293b', brd: '#e2e8f0' };

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
        .from('datos_central') // La tabla que vi en tu imagen
        .select('*');
      
      if (!error && data) {
        setDatos(data);
        setLoading(false);
      }
    };
    fetchData();
    const interval = setInterval(fetchData, 3000);
    return () => clearInterval(interval);
  }, []);

  // Filtrado de datos según tu captura
  const tcp = datos.filter(d => d.origen === 'TCP');
  const udp = datos.filter(d => d.origen === 'UDP');

  // ... (Aquí sigue el resto de tu lógica de gráficas que ya tenías)
  return (
    <div style={{backgroundColor: c.bg, color: c.txt, minHeight: '100vh', padding: '20px'}}>
        <h1>Monitor de Red (Cloud)</h1>
        {loading ? <p>Cargando datos desde Supabase...</p> : (
            <p>Datos detectados: {datos.length} registros</p>
        )}
        {/* Aquí se renderizan tus gráficas */}
    </div>
  );
};

export default App;
