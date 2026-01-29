import { Routes, Route, Navigate } from "react-router-dom";
import Cierre from "../pages/Cierre";
import Promesa from "../pages/Promesa";
import PromesaFirma from "../pages/PromesaFirma";
import Comprobante from "../pages/Comprobante";
import App from "../App";

const AppRouter = () => {
    return (
        <Routes>
            <Route path="/" element={<App />} />
            <Route path="/:id" element={<App />} />
            <Route path="/promesa/:id" element={<Promesa />} />
            <Route path="/promesafirma/:id" element={<PromesaFirma />} />
            <Route path="/comprobante/:id/:cuota" element={<Comprobante />} />
            <Route path="/cierre/:id" element={<Cierre />} />
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
};

export default AppRouter;
