export default function Footer() {
    return (
        <footer className="w-full px-6 py-6 bg-cyan-950 text-white">
            <div className="max-w-7xl mx-auto flex flex-col items-center justify-between gap-4">
                <div className="flex flex-col items-center gap-1">
                    <span className="font-bold text-base">LogiStock</span>
                    <span className="text-xs">
                        &copy; 2026 LogiStock. Todos los derechos reservados.
                    </span>
                </div>
            </div>
        </footer>
    )
}