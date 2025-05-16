// /client/pages/index.js
import { useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";

export default function Login() {
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const router = useRouter();

  const login = async () => {
    try {
      const res = await axios.post("http://localhost:4000/auth/login", {
        correo,
        contrasena,
      });
      localStorage.setItem("usuario", correo);
      router.push("/chat");
    } catch (error) {
      alert("Credenciales inválidas");
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Iniciar sesión</h1>
      <div className="mb-3">
        <input
          type="email"
          className="form-control"
          placeholder="Correo"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
        />
      </div>
      <div className="mb-3">
        <input
          type="password"
          className="form-control"
          placeholder="Contraseña"
          value={contrasena}
          onChange={(e) => setContrasena(e.target.value)}
        />
      </div>
      <div className="d-grid mb-3">
        <button className="btn btn-primary" onClick={login}>
          Entrar
        </button>
      </div>
      <p className="text-center">
        ¿No tienes cuenta? <a href="/register">Regístrate aquí</a>
      </p>
    </div>
  );
}
