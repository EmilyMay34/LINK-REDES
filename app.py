from flask import Flask, jsonify
from flask_cors import CORS
from supabase import create_client

app = Flask(__name__)
CORS(app) # Esto permite que React se conecte sin errores

# Usa tus credenciales de la Fase 2
SUPABASE_URL = "https://fodbwpaeodiweaatzmxw.supabase.co" 
SUPABASE_KEY = "eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZvZGJ3cGFlb2Rpd2VhYXR6bXh3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg0Mjg3MDgsImV4cCI6MjA5NDAwNDcwOH0"
supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

@app.route('/api/datos', methods=['GET'])
def obtener_datos():
    # Consulta SQL a la tabla donde los agentes guardaron todo
    try:
        res = supabase.table("datos_central").select("*").execute()
        return jsonify(res.data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
