import React, { useEffect, useState } from 'react';
import { Doughnut, Line, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, registerables } from 'chart.js';
import { createClient } from '@supabase/supabase-js';

ChartJS.register(...registerables);

const supabase = createClient(
  "https://fodbwpaeodiweaatzmxw.supabase.co",
  "sb_publishable_JK0VaywyUg5Q89xQRZQ6qQ_KD_UxdsH"
);

export default function App() {
  const [datos, setDatos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data, error } = await supabase.from('datos_central').select('*');
        if (data) setDatos(data);
        setLoading(false);
      } catch (e) { console.error(e); }
    };
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div style={{padding: '50px', textAlign: 'center', color: '#ec4899'}}>CONECTANDO A SUPABASE...</div>;

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', backgroundColor: '#0b0f1a', color: 'white', minHeight: '100vh' }}>
      <h1>Dashboard en la Nube</h1>
      <p>Registros totales: {datos.length}</p>
      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
        {datos.slice(-5).map(d => (
          <div key={d.id} style={{ background: '#1f2937', padding: '15px', borderRadius: '10px', border: '1px solid #374151' }}>
            <strong>{d.origen}</strong>: {d.contenido}
          </div>
        ))}
      </div>
    </div>
  );
}
