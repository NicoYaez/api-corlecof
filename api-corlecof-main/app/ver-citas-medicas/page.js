// app/ver-citas-medicas/page.js
import Link from 'next/link';

export default function VerCitasMedicas() {
  return (
    <div>
      <h1>CORLECOF</h1>
      <Link href="/cancelar-cita">
        <button className="button">Cancelar Cita</button>
      </Link>
      <Link href="/inicio-hora-medica">
        <button className="button">Inicio Hora Medica</button>
      </Link>
      <Link href="/finalizar-hora-medica">
        <button className="button">Finalizar Hora Medica</button>
      </Link>
      <Link href="/cancelar-hora-medica">
        <button className="button">Cancelar Hora Medica</button>
      </Link>
    </div>
  );
}
