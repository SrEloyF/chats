// /client/pages/chat.js
import { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import axios from "axios";
import { useRouter } from "next/router";

const socket = io("http://localhost:4000");

export default function Chat() {
  const router = useRouter();
  const [usuario, setUsuario] = useState("");
  const [destinatario, setDestinatario] = useState("");
  const [usuarios, setUsuarios] = useState([]);
  const [mensajes, setMensajes] = useState([]);
  const [nuevoMensaje, setNuevoMensaje] = useState("");
  const chatRef = useRef(null);

  // Obtener usuario actual y lista de contactos
  useEffect(() => {
    const user = localStorage.getItem("usuario");
    if (!user) {
      router.push("/");
      return;
    }
    setUsuario(user);

    // Obtener lista de usuarios (excluyendo el actual)
    axios
      .get(`http://localhost:4000/users/${user}`)
      .then((res) => {
        setUsuarios(res.data.map((u) => u.correo));
      })
      .catch((err) => console.error("Error obteniendo usuarios:", err));

    // Registrar al usuario en Socket.IO
    socket.emit("registrarUsuario", user);
  }, [router]);

  // Manejar mensajes recibidos en tiempo real
  useEffect(() => {
    const handleMensaje = (msg) => {
      setMensajes(prev => {
        // Filtrar mensaje temporal si existe
        const mensajesFiltrados = prev.filter(m => m._id !== msg._idTemp);
        // Evitar duplicados del servidor
        if (!mensajesFiltrados.some(m => m._id === msg._id)) {
          return [...mensajesFiltrados, msg];
        }
        return mensajesFiltrados;
      });
      scrollToBottom();
    };

    socket.on("mensaje", handleMensaje);
    return () => socket.off("mensaje", handleMensaje);
  }, []);

  // Cargar historial de mensajes al seleccionar un usuario
  const seleccionarUsuario = async (dest) => {
    setDestinatario(dest);
    try {
      const res = await axios.get("http://localhost:4000/mensajes", {
        params: { usuario1: usuario, usuario2: dest }
      });
      setMensajes(res.data);
      scrollToBottom();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // Enviar mensaje
  const enviar = () => {
    if (!nuevoMensaje.trim() || !destinatario) return;
    
    const idTemp = Date.now().toString();
    const mensajeObj = {
      _id: idTemp, // ID temporal único
      emisor: usuario,
      receptor: destinatario,
      contenido: nuevoMensaje,
      fecha: new Date().toISOString(),
      _idTemp: idTemp // Marcar como temporal
    };

    socket.emit("mensaje", mensajeObj);
    
    // Optimistic update con ID temporal
    setMensajes(prev => [...prev, mensajeObj]);
    setNuevoMensaje("");
    scrollToBottom();
  };

  const cerrarSesion = () => {
    localStorage.removeItem("usuario");
    router.push("/");
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      if (chatRef.current) {
        chatRef.current.scrollTop = chatRef.current.scrollHeight;
      }
    }, 100);
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Chat - Usuario: {usuario}</h2>
        <button className="btn btn-danger" onClick={cerrarSesion}>
          Cerrar sesión
        </button>
      </div>

      <div className="mb-3">
        <label>Conversar con:</label>
        <select
          className="form-select"
          onChange={(e) => seleccionarUsuario(e.target.value)}
          value={destinatario}
        >
          <option value="">-- Selecciona --</option>
          {usuarios.map((u) => (
            <option key={u} value={u}>
              {u}
            </option>
          ))}
        </select>
      </div>

      <div
        className="border rounded p-3 mb-3 bg-light"
        style={{ height: "400px", overflowY: "auto" }}
        ref={chatRef}
      >
        <ul className="list-unstyled">
          {mensajes.map((msg) => (
            <li
              key={msg._id || Math.random()}
              className={`mb-2 d-flex ${
                msg.emisor === usuario ? "justify-content-end" : "justify-content-start"
              }`}
            >
              <span
                className={`px-3 py-2 rounded ${
                  msg.emisor === usuario ? "bg-primary text-white" : "bg-secondary text-white"
                }`}
              >
                {msg.contenido}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="input-group">
        <input
          type="text"
          className="form-control"
          placeholder="Escribe un mensaje..."
          value={nuevoMensaje}
          onChange={(e) => setNuevoMensaje(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && enviar()}
        />
        <button className="btn btn-success" onClick={enviar}>
          Enviar
        </button>
      </div>
    </div>
  );
}
