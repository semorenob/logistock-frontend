import { request } from './clienteApi';

// el rol va fijo en cliente: nadie puede autoproclamarse administrador al registrarse
export const registrar = ({ nombre, email, password }) =>
  request('/auth/register', { metodo: 'POST', cuerpo: { nombre, email, password, rol: 'CLIENTE' } });

// inicia sesion y devuelve el token
export const iniciarSesion = ({ email, password }) =>
  request('/auth/login', { metodo: 'POST', cuerpo: { email, password } });
