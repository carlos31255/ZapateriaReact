import axios from 'axios';
import type { UsuarioAutenticado, CredencialesLogin, DatosRegistro, UsuarioBackend } from '../types';

const API_URL = import.meta.env.VITE_API_USUARIO_URL;

export const authService = {
    login: async (credenciales: CredencialesLogin): Promise<UsuarioAutenticado> => {
        // 1. Buscar usuario por email
        const response = await axios.get<UsuarioBackend>(`${API_URL}/usuarios/buscar`, {
            params: { email: credenciales.email }
        });

        const usuarioBackend = response.data;

        // 2. Verificar contraseña (LOCALMENTE - INSEGURO, SOLO PARA PROTOTIPO)
        // En producción esto debe hacerse en el backend
        if (usuarioBackend.persona.passHash !== credenciales.contrasena) {
            throw new Error('Contraseña incorrecta');
        }

        // 3. Mapear a UsuarioAutenticado
        return {
            id: usuarioBackend.idPersona.toString(),
            run: usuarioBackend.persona.rut,
            nombre: `${usuarioBackend.persona.nombre} ${usuarioBackend.persona.apellido}`,
            email: usuarioBackend.persona.email,
            rol: usuarioBackend.rol.nombreRol.toLowerCase() as any,
            genero: '', // No disponible en backend actual
            fechaNacimiento: '', // No disponible
            region: '', // Pendiente de implementar
            comuna: usuarioBackend.persona.idComuna ? usuarioBackend.persona.idComuna.toString() : '',
            direccion: `${usuarioBackend.persona.calle || ''} ${usuarioBackend.persona.numeroPuerta || ''}`.trim(),
            telefono: usuarioBackend.persona.telefono,
            fechaRegistro: usuarioBackend.persona.fechaRegistro,
            logueado: true,
            idPersonaBackend: usuarioBackend.idPersona
        };
    },

    register: async (datos: DatosRegistro): Promise<void> => {
        try {
            // 1. Crear Persona
            const personaData = {
                nombre: datos.nombre,
                apellido: '', // El formulario actual solo tiene nombre completo, habría que separarlo o ajustar
                rut: datos.run,
                telefono: datos.telefono,
                email: datos.email,
                idComuna: parseInt(datos.comuna) || null,
                calle: datos.direccion,
                numeroPuerta: '', // No está en el formulario simple
                username: datos.email.split('@')[0], // Generar username temporal
                passHash: datos.contrasena, // En producción: NO enviar pass en plano para guardar en persona
                fechaRegistro: new Date().toISOString(),
                estado: 'activo'
            };

            // Separar nombre y apellido si es posible
            const nombreParts = datos.nombre.split(' ');
            if (nombreParts.length > 1) {
                personaData.nombre = nombreParts[0];
                personaData.apellido = nombreParts.slice(1).join(' ');
            }

            const responsePersona = await axios.post(`${API_URL}/personas`, personaData);
            const nuevaPersona = responsePersona.data;

            // 2. Crear Usuario
            // Necesitamos el ID del rol 'cliente'. Asumimos que es 2 (1 admin, 2 cliente) o lo buscamos
            // Por simplicidad para este prototipo, hardcodeamos idRol=2
            const usuarioData = {
                persona: nuevaPersona,
                rol: { idRol: 2 } // Asumiendo rol cliente
            };

            await axios.post(`${API_URL}/usuarios`, usuarioData);

        } catch (error) {
            console.error('Error en registro:', error);
            throw error;
        }
    }
};
