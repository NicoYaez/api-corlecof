import Link from 'next/link';

export default function HomePage() {
  return (
    <div>
      <h1>CORLECOF</h1>
      <Link href="/crear-ficha">
        <button className="button">Crear ficha</button>
      </Link>
      <Link href="/editar-ficha">
        <button className="button">Editar Ficha</button>
      </Link>
      <Link href="/listar-ficha">
        <button className="button">Listar Ficha</button>
      </Link>
      <Link href="/detalle-ficha">
        <button className="button">Detalle Ficha</button>
      </Link>
      <Link href="/inscribir-alumno">
        <button className="button">Inscribir alumno</button>
      </Link>
      <Link href="/ver-citas-medicas">
        <button className="button">Ver Citas Medicas</button>
      </Link>
    </div>
  );
}
