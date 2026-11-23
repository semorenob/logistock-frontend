import { Outlet } from "react-router";
import Footer from "../components/Footer";
import NavBar from "../components/NavBar";

export default function RootLayout() {
    return (
        <div className="min-h-screen flex flex-col">
            <NavBar />
            <main className="grow">
                <Outlet /> {/* acá va el contenido */}
            </main>
            <Footer />
        </div>
    )
}