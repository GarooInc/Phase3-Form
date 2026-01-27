import React, { useState, useEffect } from "react";
import UploadBox from "../components/UploadBox";
import DocumentoPromesa from "../components/DocumentoPromesa";
import { useParams } from "react-router-dom";

interface FileUpload {
    file: File | null;
    preview: string | null;
}

const PromesaFirma: React.FC = () => {
    const { id } = useParams();
    const [urlId, setUrlId] = useState<string | null>(null);
    const [nameclient] = useState<string>("");
    const [copied, setCopied] = useState(false);
    const [isExporting, setIsExporting] = useState(false);

    const handleCopyText = () => {
        const docElement = document.querySelector(".documento-promesa");
        if (docElement) {
            const text = (docElement as HTMLElement).innerText;
            navigator.clipboard.writeText(text).then(() => {
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            });
        }
    };

    const handleDownloadPDF = async () => {
        setIsExporting(true);
        const element = document.querySelector(".documento-promesa");
        if (element) {
            try {
                const html2pdf = (await import("html2pdf.js")).default;
                const opt = {
                    margin: 0,
                    filename: `Promesa_${nameclient || "Documento"}.pdf`,
                    image: { type: "jpeg", quality: 0.98 },
                    html2canvas: {
                        scale: 2,
                        useCORS: true,
                        letterRendering: true,
                        backgroundColor: "#ffffff",
                        onclone: (clonedDoc: Document) => {
                            const elements = clonedDoc.querySelectorAll("*");
                            elements.forEach((el) => {
                                const htmlEl = el as HTMLElement;
                                const style = window.getComputedStyle(htmlEl);
                                if (style.color.includes("oklch"))
                                    htmlEl.style.color = "#000000";
                                if (style.backgroundColor.includes("oklch"))
                                    htmlEl.style.backgroundColor =
                                        "transparent";
                            });
                        },
                    },
                    jsPDF: {
                        unit: "mm",
                        format: "a4",
                        orientation: "portrait",
                    },
                };
                await (html2pdf() as any).set(opt).from(element).save();
            } catch (error) {
                console.error("Error al exportar PDF:", error);
            } finally {
                setIsExporting(false);
            }
        } else {
            setIsExporting(false);
        }
    };

    useEffect(() => {
        setUrlId(id || null);
    }, [id]);

    const [files, setFiles] = useState<Record<string, FileUpload>>({
        promesa_firmada: { file: null, preview: null },
    });

    const [dragOver, setDragOver] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleFileChange = (type: string, file: File) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            setFiles((prev) => ({
                ...prev,
                [type]: { file, preview: reader.result as string },
            }));
        };
        reader.readAsDataURL(file);
    };

    const handleDrop = (e: React.DragEvent, type: string) => {
        e.preventDefault();
        setDragOver(null);
        const file = e.dataTransfer.files[0];
        if (file && isValidFile(file)) {
            handleFileChange(type, file);
        }
    };

    const handleDragOver = (e: React.DragEvent, type: string) => {
        e.preventDefault();
        setDragOver(type);
    };

    const handleDragLeave = () => {
        setDragOver(null);
    };

    const isValidFile = (file: File) => {
        const validDocTypes = ["application/pdf"];
        return validDocTypes.includes(file.type);
    };

    const removeFile = (type: string) => {
        setFiles((prev) => ({
            ...prev,
            [type]: { file: null, preview: null },
        }));
    };

    const handleSubmit = async () => {
        if (!urlId) {
            alert(
                "No se pudo obtener el ID de la URL. Por favor, asegúrate de acceder al formulario desde el enlace correcto.",
            );
            return;
        }

        if (files.promesa_firmada.file) {
            setIsSubmitting(true);
            try {
                const formData = new FormData();
                formData.append("promesa_firmada", files.promesa_firmada.file);

                const response = await fetch(
                    `${import.meta.env.VITE_API_URL}/promesafirmada`,
                    {
                        method: "POST",
                        body: formData,
                    },
                );

                const responseData = await response.json().catch(() => ({}));

                if (!response.ok) {
                    throw new Error(
                        responseData.message || "Error en el servidor",
                    );
                }

                console.log("Respuesta del servidor:", responseData);
                alert(
                    "Documento enviado correctamente. Por favor revise su correo electrónico, ya que se le notificará una vez el documento haya sido procesado.",
                );
                setFiles({ promesa_firmada: { file: null, preview: null } });
            } catch (error) {
                console.error("Error al enviar documento:", error);
                const errorMessage =
                    error instanceof Error
                        ? error.message
                        : "Ocurrió un error desconocido";
                alert(`Error al enviar el documento: ${errorMessage}`);
            } finally {
                setIsSubmitting(false);
            }
        } else {
            alert("Por favor, sube el documento requerido");
        }
    };

    const allFilesUploaded = files.promesa_firmada.file;
    const uploadedCount = files.promesa_firmada.file ? 1 : 0;

    return (
        <div className="min-h-screen lg:h-screen bg-white flex flex-col overflow-x-hidden lg:overflow-hidden">
            <style>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 8px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #d1d1d6;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #a1a1a6;
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in {
                    animation: fadeIn 0.8s ease-out forwards;
                }
            `}</style>

            {/* Header con Logo */}
            <div className="w-full bg-white border-b border-gray-200 py-4 flex justify-center items-center z-10 shadow-sm shrink-0">
                <img
                    src="/logo.png"
                    alt="Logo"
                    className="w-44 object-contain"
                />
            </div>

            {/* Contenedor de Secciones */}
            <div className="flex-1 flex flex-col lg:flex-row overflow-y-auto lg:overflow-hidden">
                {/* Sección Izquierda - Documento (60%) */}
                <div className="w-full lg:w-[60%] border-b lg:border-b-0 lg:border-r border-gray-200 bg-[#f5f5f7] flex flex-col relative group shrink-0 lg:shrink">
                    {/* Menú de Navegación Minimalista - SOLO EN PC (lg) */}
                    <div className="hidden lg:flex absolute left-4 top-1/2 -translate-y-1/2 z-20 flex-col items-center gap-1 p-2 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-gray-200 transition-all duration-300">
                        <button
                            onClick={() =>
                                document
                                    .getElementById("inicio")
                                    ?.scrollIntoView({ behavior: "smooth" })
                            }
                            className="p-3 hover:bg-blue-50 rounded-xl transition-colors tooltip tooltip-right"
                            data-tip="Inicio"
                        >
                            <svg
                                className="w-5 h-5 text-[#0033cc]"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M5 11l7-7 7 7M5 19l7-7 7 7"
                                />
                            </svg>
                        </button>

                        <div className="w-8 h-px bg-gray-100 my-1"></div>

                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((num) => (
                            <button
                                key={num}
                                onClick={() => {
                                    const ordinalMap: Record<number, string> = {
                                        1: "primera",
                                        2: "segunda",
                                        3: "tercera",
                                        4: "cuarta",
                                        5: "quinta",
                                        6: "sexta",
                                        7: "septima",
                                        8: "octava",
                                        9: "novena",
                                        10: "decima",
                                        11: "decima-primera",
                                        12: "decima-segunda",
                                    };
                                    document
                                        .getElementById(
                                            `clausula-${ordinalMap[num]}`,
                                        )
                                        ?.scrollIntoView({
                                            behavior: "smooth",
                                        });
                                }}
                                className="w-9 h-9 flex items-center justify-center hover:bg-blue-50 rounded-xl transition-colors text-[10px] font-bold text-gray-500 hover:text-[#0033cc] tooltip tooltip-right"
                                data-tip={`Cláusula ${num}`}
                            >
                                C{num}
                            </button>
                        ))}

                        <div className="w-8 h-px bg-gray-100 my-1"></div>

                        <button
                            onClick={() =>
                                document
                                    .getElementById("firmas")
                                    ?.scrollIntoView({ behavior: "smooth" })
                            }
                            className="p-3 hover:bg-blue-50 rounded-xl transition-colors tooltip tooltip-right"
                            data-tip="Final / Firmas"
                        >
                            <svg
                                className="w-5 h-5 text-[#0033cc]"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M19 13l-7 7-7-7m14-8l-7 7-7-7"
                                />
                            </svg>
                        </button>
                    </div>

                    {/* Botones de Acción - Fijos en móvil, Absolutos en PC */}
                    <div className="fixed lg:absolute right-4 top-4 lg:top-1/2 lg:-translate-y-1/2 z-30 flex flex-col items-center gap-3">
                        <button
                            onClick={handleCopyText}
                            className={`p-3.5 rounded-2xl shadow-lg border transition-all duration-300 tooltip tooltip-left hover:scale-110 active:scale-95 ${copied ? "bg-green-500 text-white border-green-600" : "bg-white text-gray-700 border-gray-200 hover:border-blue-400 hover:text-blue-600"}`}
                            data-tip={
                                copied ? "¡Copiado!" : "Copiar todo el texto"
                            }
                        >
                            {copied ? (
                                <svg
                                    className="w-6 h-6 animate-bounce"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2.5"
                                        d="M5 13l4 4L19 7"
                                    />
                                </svg>
                            ) : (
                                <svg
                                    className="w-6 h-6"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                                    />
                                </svg>
                            )}
                        </button>

                        <button
                            onClick={handleDownloadPDF}
                            disabled={isExporting}
                            className={`p-3.5 rounded-2xl shadow-lg border transition-all duration-300 tooltip tooltip-left hover:scale-110 active:scale-95 ${isExporting ? "bg-blue-100 cursor-not-allowed border-blue-200" : "bg-[#0033cc] text-white border-blue-700 hover:bg-blue-700 shadow-blue-200"}`}
                            data-tip={
                                isExporting
                                    ? "Generando..."
                                    : "Descargar como PDF"
                            }
                        >
                            {isExporting ? (
                                <span className="loading loading-spinner loading-md"></span>
                            ) : (
                                <svg
                                    className="w-6 h-6"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                    />
                                </svg>
                            )}
                        </button>
                    </div>

                    <div className="h-[480px] sm:h-[600px] lg:h-full overflow-auto flex justify-center items-start py-2 lg:py-12 px-1 sm:px-4 scroll-smooth bg-[#f5f5f7]">
                        <div className="transform scale-[0.45] xs:scale-[0.52] sm:scale-[0.7] md:scale-[0.8] lg:scale-[0.8] xl:scale-[0.9] 2xl:scale-100 origin-top transition-all duration-500">
                            <DocumentoPromesa />
                        </div>
                    </div>
                </div>

                {/* Sección Derecha - Formulario (40%) */}
                <div className="w-full lg:w-[40%] bg-white flex flex-col lg:border-l border-gray-100 pb-8 lg:pb-0">
                    <div className="flex-1 overflow-auto custom-scrollbar flex flex-col justify-start lg:justify-center p-6 sm:p-8 lg:p-10 xl:p-16">
                        <div className="max-w-xl w-full mx-auto animate-fade-in">
                            {/* Main Card */}
                            <div className="card bg-base-200 shadow-2xl">
                                <div className="card-body">
                                    <h2 className="card-title md:text-2xl text-xl mb-2 text-white font-bold">
                                        Promesa Firmada {nameclient}
                                    </h2>
                                    <p className="text-base-content/70 mb-6 font-medium">
                                        Por favor, sube la promesa firmada para
                                        completar el proceso:
                                    </p>

                                    <div className="space-y-6">
                                        <UploadBox
                                            type="promesa_firmada"
                                            title="Promesa Firmada"
                                            subtitle="Sube un PDF de la promesa firmada"
                                            acceptedFormats="application/pdf"
                                            fileData={files.promesa_firmada}
                                            dragOver={dragOver}
                                            onFileChange={handleFileChange}
                                            onRemoveFile={removeFile}
                                            onDrop={handleDrop}
                                            onDragOver={handleDragOver}
                                            onDragLeave={handleDragLeave}
                                        />
                                    </div>

                                    {/* Progress */}
                                    <div className="mt-8 mb-6">
                                        <div className="flex items-center justify-between text-sm mb-2">
                                            <span className="font-medium text-gray-700">
                                                Progreso de carga
                                            </span>
                                            <span className="badge badge-outline">
                                                {uploadedCount} de 1
                                            </span>
                                        </div>
                                        <progress
                                            className="progress w-full h-2"
                                            value={uploadedCount}
                                            max="1"
                                        ></progress>
                                    </div>

                                    {/* Submit Button */}
                                    <div className="card-actions justify-end mt-4">
                                        <button
                                            onClick={handleSubmit}
                                            disabled={
                                                !allFilesUploaded ||
                                                isSubmitting
                                            }
                                            className={`btn btn-block ${
                                                allFilesUploaded &&
                                                !isSubmitting
                                                    ? "btn bg-orange-100 text-black hover:bg-orange-200 border-none shadow-md"
                                                    : "btn-disabled bg-gray-200 text-gray-400"
                                            }`}
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <span className="loading loading-spinner loading-xs mr-2"></span>
                                                    Enviando documentos...
                                                </>
                                            ) : allFilesUploaded ? (
                                                "Enviar Documento"
                                            ) : (
                                                "Completa el campo requerido"
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="text-center mt-8">
                                <a
                                    className="text-sm text-black/50 hover:text-black transition-colors"
                                    href="https://redtec.ai/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    &copy; 2024 Redtec. Todos los derechos
                                    reservados.
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PromesaFirma;
