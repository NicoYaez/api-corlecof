import './globals.css';

export const metadata = {
  title: 'CORLECOF',
  description: 'Aplicación de gestión de citas médicas',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
