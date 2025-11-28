import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Footer } from '../Footer';
import { describe, it, expect } from 'vitest';

describe('Footer', () => {
    it('renders the brand name', () => {
        render(
            <BrowserRouter>
                <Footer />
            </BrowserRouter>
        );
        expect(screen.getByRole('heading', { name: /StepStyle/i })).toBeInTheDocument();
    });

    it('renders navigation links', () => {
        render(
            <BrowserRouter>
                <Footer />
            </BrowserRouter>
        );
        expect(screen.getByText('Inicio')).toBeInTheDocument();
        expect(screen.getByText('Productos')).toBeInTheDocument();
    });

    it('renders copyright with current year', () => {
        render(
            <BrowserRouter>
                <Footer />
            </BrowserRouter>
        );
        const currentYear = new Date().getFullYear();
        expect(screen.getByText((content) => content.includes(`© ${currentYear}`))).toBeInTheDocument();
    });
});
