import React, { useEffect, useState } from 'react';
import { Doughnut, Line, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, registerables } from 'chart.js';
import { createClient } from '@supabase/supabase-js';

ChartJS.register(...registerables);

// Conexión a tu Supabase (Datos de tu proyecto)
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
      try {
        const { data, error } = await supabase
          .from('datos_central')
          .select('*');
        
        if (data) {
          setDatos(data);
          setLoading(false);
        }
      } catch (err) {
        console.error("Error:", err);
      }
    };
    fetchData();
    const interval = setInterval(fetchData, 3000);
    return () => clearInterval(interval);
  }, []);

  const tcp = datos.filter(d => d.origen === 'TCP');
  const udp = datos.filter(d => d.origen === 'UDP');

  // Lógica de procesamiento de gráficas (TCP)
  const catCount = tcp.reduce((a, d) => {
    const p = d.contenido.split('|');
    const cat = p[1]?.trim() || 'Varios';
    return {...a, [cat]: (a[cat] || 0) + 1};
  }, {});

  const dataTCP = {
    labels: Object.keys(catCount).slice(0, 5),
    datasets: [{ label: 'Registros', data: Object.values(catCount).slice(0, 5), backgroundColor: [c.pri, c.sec, '#8b5cf6'], borderRadius: 10 }]
  };

  // Lógica de procesamiento de gráficas (UDP)
  const temps = udp.slice(-10).map(d => parseFloat(d.contenido.match(/Temp:(\d+\.\d+)/)?.[1] || 0));
  const dataUDP = {
    labels: temps.map((_, i) => `T-${10-i}`),
    datasets: [{ label: 'Temp °C', data: temps, borderColor: c.sec, backgroundColor: `${c.sec}22`, fill: true }]
  };

  if (loading) return <div style={{height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: c.bg, color: c.pri, fontWeight: 800}}>CONECTANDO A LA NUBE...</div>;

  return (
    <div style={{backgroundColor: c.bg, color: c.txt, minHeight: '100vh', padding: '40px'}}>
      <h1>Monitor de Red (Cloud Vercel)</h1>
      <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px'}}>
        <div style={{background: c.card, padding: '20px', borderRadius: '15px'}}>
           <h3>Tráfico TCP</h3>
           <Bar data={dataTCP} />
        </div>
        <div style={{background: c.card, padding: '20px', borderRadius: '15px'}}>
           <h3>Sensores UDP</h3>
           <Line data={dataUDP} />
        </div>
      </div>
      <div style={{marginTop: '20px'}}>
        <h3>Logs Recientes (Supabase)</h3>
        {datos.slice(-5).reverse().map(d => (
          <div key={d.id} style={{borderBottom: `1px solid ${c.brd}`, padding: '10px'}}>
            {d.origen} | {d.contenido}
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
