export default function NavBar() {
    return(
        <header className="w-full px-6 py-4 bg-cyan-950 text-white">
            <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
                {/* marca */}
                <div className="flex flex-col">
                    <span className="font-bold text-lg">Logistock</span>
                    <span className="text-xs">Retail &amp; Tecnología</span>
                </div>

                {/* botones */}
                <nav className="flex flex-wrap items-center gap-3">
                    <button type="button">Inicio</button>
                    <button type="button">Catálogo</button>
                    <button type="button">Ofertas</button>
                    <button type="button">Carrito</button>
                </nav>
            </div>
        </header>
    )
}