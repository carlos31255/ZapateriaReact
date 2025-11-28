import axios from 'axios';

const API_URL = 'http://localhost:8081/api/v1/contacto';

export interface ContactoData {
    nombre: string;
    correo: string;
    comentario: string;
}

export const contactService = {
    enviarMensaje: async (data: ContactoData) => {
        const response = await axios.post(API_URL, data);
        return response.data;
    }
};
