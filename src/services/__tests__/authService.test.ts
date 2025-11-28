import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { authService } from '../authService';
import axios from 'axios';
import axiosInstance from '../../config/axiosConfig';

// Mock axios and axiosInstance
vi.mock('axios');
vi.mock('../../config/axiosConfig', () => ({
    default: {
        post: vi.fn(),
        get: vi.fn(),
        put: vi.fn(),
        delete: vi.fn(),
    },
}));

describe('authService', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        // Mock localStorage
        const localStorageMock = (() => {
            let store: Record<string, string> = {};
            return {
                getItem: vi.fn((key: string) => store[key] || null),
                setItem: vi.fn((key: string, value: string) => {
                    store[key] = value.toString();
                }),
                removeItem: vi.fn((key: string) => {
                    delete store[key];
                }),
                clear: vi.fn(() => {
                    store = {};
                }),
            };
        })();
        Object.defineProperty(window, 'localStorage', {
            value: localStorageMock,
        });
    });

    describe('login', () => {
        it('should login successfully and store tokens', async () => {
            const mockResponse = {
                data: {
                    token: 'fake-token',
                    refreshToken: 'fake-refresh-token',
                    userId: 1,
                    email: 'test@example.com',
                    nombre: 'Test User',
                    rol: 'CLIENTE',
                    run: '12345678-9',
                    telefono: '123456789',
                    genero: 'M',
                    fechaNacimiento: '1990-01-01',
                    region: 'Metropolitana',
                    comuna: 'Santiago',
                    direccion: 'Calle Falsa 123',
                    fechaRegistro: '2023-01-01',
                },
            };

            (axios.post as any).mockResolvedValue(mockResponse);

            const credenciales = { email: 'test@example.com', contrasena: 'password' };
            const result = await authService.login(credenciales);

            expect(axios.post).toHaveBeenCalledWith(expect.stringContaining('/api/v1/auth/login'), {
                email: credenciales.email,
                password: credenciales.contrasena,
            });

            expect(localStorage.setItem).toHaveBeenCalledWith('token', 'fake-token');
            expect(localStorage.setItem).toHaveBeenCalledWith('refreshToken', 'fake-refresh-token');
            expect(result.email).toBe('test@example.com');
            expect(result.rol).toBe('cliente');
        });

        it('should throw error on invalid credentials', async () => {
            const mockError = {
                response: {
                    status: 401,
                },
            };
            (axios.post as any).mockRejectedValue(mockError);

            const credenciales = { email: 'wrong@example.com', contrasena: 'wrongpass' };

            await expect(authService.login(credenciales)).rejects.toThrow('Credenciales inválidas');
        });
    });

    describe('logout', () => {
        it('should logout and clear tokens', async () => {
            (axiosInstance.post as any).mockResolvedValue({});

            await authService.logout();

            expect(axiosInstance.post).toHaveBeenCalledWith(expect.stringContaining('/api/v1/auth/logout'));
            expect(localStorage.removeItem).toHaveBeenCalledWith('token');
            expect(localStorage.removeItem).toHaveBeenCalledWith('refreshToken');
        });
    });
});
