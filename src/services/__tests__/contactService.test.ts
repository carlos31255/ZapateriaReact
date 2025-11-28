import { describe, it, expect, vi, beforeEach } from 'vitest';
import { contactService } from '../contactService';
import axios from 'axios';

// Mock axios
vi.mock('axios', () => ({
    default: {
        post: vi.fn(),
    },
}));

describe('contactService', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('enviarMensaje', () => {
        it('should send a contact message', async () => {
            const mockResponse = { success: true, message: 'Mensaje enviado' };
            const contactData = {
                nombre: 'Juan Pérez',
                correo: 'juan@example.com',
                comentario: 'Test message'
            };
            (axios.post as any).mockResolvedValue({ data: mockResponse });

            const result = await contactService.enviarMensaje(contactData);

            expect(axios.post).toHaveBeenCalledWith('http://localhost:8081/api/v1/contacto', contactData);
            expect(result).toEqual(mockResponse);
        });
    });
});
