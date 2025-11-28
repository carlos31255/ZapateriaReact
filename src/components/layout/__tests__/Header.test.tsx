import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Header } from '../Header';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as AuthContext from '../../../context/AuthContext';
import * as CartContext from '../../../context/CartContext';

// Mock hooks
vi.mock('../../../context/AuthContext', () => ({
    useAuth: vi.fn(),
}));

vi.mock('../../../context/CartContext', () => ({
    useCart: vi.fn(),
}));

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

describe('Header', () => {
    const mockCerrarSesion = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();

        // Default mocks
        (CartContext.useCart as any).mockReturnValue({
            carrito: { cantidadTotal: 0 },
        });
    });

    it('renders logo and navigation links', () => {
        (AuthContext.useAuth as any).mockReturnValue({
            usuario: null,
            estaAutenticado: false,
            cerrarSesionUsuario: mockCerrarSesion,
        });

        render(
            <BrowserRouter>
                <Header />
            </BrowserRouter>
        );

        expect(screen.getByText('StepStyle')).toBeInTheDocument();
        expect(screen.getByText('Inicio')).toBeInTheDocument();
        expect(screen.getByText('Productos')).toBeInTheDocument();
    });

    it('shows login/register buttons when not authenticated', () => {
        (AuthContext.useAuth as any).mockReturnValue({
            usuario: null,
            estaAutenticado: false,
            cerrarSesionUsuario: mockCerrarSesion,
        });

        render(
            <BrowserRouter>
                <Header />
            </BrowserRouter>
        );

        expect(screen.getByText('Ingresar')).toBeInTheDocument();
        expect(screen.getByText('Registrarse')).toBeInTheDocument();
        expect(screen.queryByText('Cerrar Sesión')).not.toBeInTheDocument();
    });

    it('shows user menu when authenticated', () => {
        (AuthContext.useAuth as any).mockReturnValue({
            usuario: { nombre: 'Juan Perez' },
            estaAutenticado: true,
            cerrarSesionUsuario: mockCerrarSesion,
        });

        render(
            <BrowserRouter>
                <Header />
            </BrowserRouter>
        );

        expect(screen.getByText('Juan')).toBeInTheDocument();
        expect(screen.queryByText('Ingresar')).not.toBeInTheDocument();
    });

    it('shows cart badge when items exist', () => {
        (AuthContext.useAuth as any).mockReturnValue({
            usuario: null,
            estaAutenticado: false,
            cerrarSesionUsuario: mockCerrarSesion,
        });

        (CartContext.useCart as any).mockReturnValue({
            carrito: { cantidadTotal: 5 },
        });

        render(
            <BrowserRouter>
                <Header />
            </BrowserRouter>
        );

        expect(screen.getByText('5')).toBeInTheDocument();
    });

    it('calls logout and navigates on logout click', async () => {
        (AuthContext.useAuth as any).mockReturnValue({
            usuario: { nombre: 'Juan Perez' },
            estaAutenticado: true,
            cerrarSesionUsuario: mockCerrarSesion,
        });

        render(
            <BrowserRouter>
                <Header />
            </BrowserRouter>
        );

        const logoutButton = screen.getByRole('button', { name: /cerrar sesión/i });
        fireEvent.click(logoutButton);

        expect(mockCerrarSesion).toHaveBeenCalled();

        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith('/login', expect.objectContaining({
                state: expect.objectContaining({ tipo: 'success' }),
                replace: true
            }));
        });
    });
});
