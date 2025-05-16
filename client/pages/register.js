// /client/pages/register.js
import { useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";

export default function Register() {
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const router = useRouter();

  const registrar = async () => {
    try {
      await axios.post("http://localhost:4000/auth/register", { correo, contrasena });
      alert("Registro exitoso. Ya puedes iniciar sesión.");
      router.push("/");
    } catch (error) {
      alert("Error en el registro, verifique los datos.");
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Registro</h1>
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
        <button className="btn btn-success" onClick={registrar}>
          Registrarme
        </button>
      </div>
      <p className="text-center">
        ¿Ya tienes cuenta? <a href="/">Inicia sesión aquí</a>
      </p>
    </div>
  );
}
