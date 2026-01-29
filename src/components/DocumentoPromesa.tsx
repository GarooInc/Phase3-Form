import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

interface Comprador {
    Nombre?: string;
    DPI?: string;
    DPI_Letras?: string;
    EstadoCivil?: string;
    Profesion?: string;
    Edad_Numeros?: number;
    Edad_Letras?: string;
    Nacionalidad?: string;
    Direccion?: string;
}

interface Proyecto {
    total_unidades?: string;
    total_unidades_numeros?: string;
    unidades_torre1?: string;
    unidades_torre1_numeros?: string;
    unidades_torre2?: string;
    unidades_torre2_numeros?: string;
    variacion_unidades?: string;
    numero_elevadores?: string;
    elevadores_por_torre?: string;
    fuente_agua?: string;
    entidad_agua?: string;
    tipo_cisterna?: string;
    agua_potable?: string;
    tratamiento_agua?: string;
    entidad_electrica?: string;
    planta_emergencia?: string;
    sistema_seguridad?: string;
    sistema_acceso?: string;
    sistema_vigilancia?: string;
    sistema_drenaje?: string;
    planta_tratamiento?: string;
    nombre_torre1?: string;
    nombre_torre2?: string;
}

interface Pago {
    pago?: string;
    fecha?: string;
    value?: string;
}

interface Estacionamiento {
    Numero?: string;
    Numero_Letras?: string;
    Sotano?: string;
    Sotano_Letras?: string;
}

interface Bodega {
    Numero?: string;
    Numero_Letras?: string;
    Sotano?: string;
    Sotano_Letras?: string;
}

interface WebhookData {
    Compradores?: Comprador[];
    proyecto?: Proyecto;
    Descripcion_del_Inmueble?: {
        Apartamento?: string;
        Torre?: string;
        Nivel?: string;
        Habitaciones?: string;
        DescripcionApartamento?: string;
        AreaConstruccionLetras?: string;
        AreaConstruccionNumeros?: number;
        ParqueosDescripcion?: string;
        BodegasDescripcion?: string;
        TerrazaBalconAreaLetras?: string;
        TerrazaBalconAreaNumeros?: number;
        Estacionamientos?: Estacionamiento[];
        Bodegas?: Bodega[];
    };
    Condiciones_Economicas?: {
        PrecioLetras?: string;
        PrecioNumeros?: number;
        ReservaLetras?: string;
        ReservaNumeros?: number;
        SegundoPagoLetras?: string;
        SegundoPagoNumeros?: number;
        CantidadPagosLetras?: string;
        CantidadPagosNumeros?: number;
        TercerPagoLetras?: string;
        TercerPagoNumeros?: number;
    };
    Pagos?: Pago[];
    Liquidacion_Final_y_Plazos?: {
        PlazoMesesLetras?: string;
        PlazoMesesNumeros?: number;
        MesEntrega?: string;
        AnioEntrega?: number;
        UltimoPagoLetras?: string;
        UltimoPagoNumeros?: number;
    };
    Datos_de_Notificacion_y_Cierre?: {
        Direccion?: string;
        FechaFirmaDia?: number;
        FechaFirmaMes?: string;
        FechaFirmaAnio?: number;
        FechaLegalizacionDia?: number;
        FechaLegalizacionMes?: string;
        FechaLegalizacionAnio?: number;
    };
}

interface ApiResponse {
    status?: string;
    data?: WebhookData;
}

const DocumentoPromesa: React.FC = () => {
    const { id } = useParams();
    const [data, setData] = useState<WebhookData | null>(null);

    useEffect(() => {
        if (id) {
            fetch("https://agentsprod.redtec.ai/webhook/promesa-document", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id }),
            })
                .then(async (response) => {
                    if (!response.ok) {
                        throw new Error(
                            `HTTP error! status: ${response.status}`,
                        );
                    }

                    const text = await response.text();

                    if (!text || text.trim() === "") {
                        console.error("Respuesta vacía del webhook");
                        throw new Error("Respuesta vacía del servidor");
                    }

                    try {
                        return JSON.parse(text);
                    } catch (e) {
                        console.error("Error parsing JSON:", e);
                        console.error("Texto recibido:", text);
                        throw new Error("Respuesta inválida del servidor");
                    }
                })
                .then((jsonData: ApiResponse) => {
                    let payload: WebhookData | null = null;
                    if (jsonData && typeof jsonData === "object") {
                        if (jsonData.data) {
                            payload = jsonData.data;
                        } else if (jsonData.status === "success") {
                            payload = jsonData as unknown as WebhookData;
                        }
                    }

                    if (payload) {
                        if (!payload.proyecto) {
                            payload.proyecto = {
                                total_unidades: "noventa y cinco",
                                total_unidades_numeros: "95",
                                unidades_torre1: "cuarenta y siete",
                                unidades_torre1_numeros: "47",
                                unidades_torre2: "cuarenta y ocho",
                                unidades_torre2_numeros: "48",
                                variacion_unidades: "diez",
                                numero_elevadores: "cuatro",
                                elevadores_por_torre: "dos",
                                fuente_agua: "pozo externo el Edificio",
                                entidad_agua: "SERVIBOSQUES, SOCIEDA ANÓNIMA",
                                tipo_cisterna: "cisterna de concreto",
                                agua_potable: "no será potable",
                                tratamiento_agua: "potabilizar el agua",
                                entidad_electrica:
                                    "Empresa Eléctrica de Guatemala, Sociedad Anónima",
                                planta_emergencia:
                                    "una planta eléctrica de emergencia",
                                sistema_seguridad:
                                    "gabinetes con extintores de incendios",
                                sistema_acceso: "Sistema de control de acceso",
                                sistema_vigilancia: "Circuito cerrado",
                                sistema_drenaje:
                                    "Sistema de drenajes pluviales y aguas negras",
                                planta_tratamiento:
                                    "planta de tratamiento de aguas residuales de uso ordinario",
                                nombre_torre1: "IGNEA",
                                nombre_torre2: "ETEREA",
                            };
                        }
                        setData(payload);
                    }
                })
                .catch((error) =>
                    console.error("Error fetching document data:", error),
                );
        }
    }, [id]);

    const getVal = <T,>(
        path: string,
        fallback: T = "[DATO_FALTANTE]" as unknown as T,
    ): T => {
        if (!data) return fallback;
        const keys = path.split(".");
        let value: unknown = data;
        for (const key of keys) {
            if (value && typeof value === "object" && key in value) {
                value = (value as Record<string, unknown>)[key];
            } else {
                return fallback;
            }
        }
        return (value as T) ?? fallback;
    };

    const getComprador = (
        index: number,
        field: keyof Comprador,
        fallback: string = `[COMPRADOR_${index + 1}_${field.toUpperCase()}]`,
    ) => {
        const compradores = getVal<Comprador[]>("Compradores", []);
        if (compradores[index] && compradores[index][field]) {
            return compradores[index][field] as string;
        }
        return fallback;
    };

    const getDireccionComprador = () => {
        const direccion = getVal<string>(
            "Datos_de_Notificacion_y_Cierre.Direccion",
            "15 Calle 2-00 Zona 10, Ciudad de Guatemala",
        );
        return direccion;
    };

    const getFechaLegalizacion = () => {
        const dia = getVal<number>(
            "Datos_de_Notificacion_y_Cierre.FechaLegalizacionDia",
            0,
        );
        const mes = getVal<string>(
            "Datos_de_Notificacion_y_Cierre.FechaLegalizacionMes",
            "[MES_LEGALIZACION]",
        );
        const anio = getVal<number>(
            "Datos_de_Notificacion_y_Cierre.FechaLegalizacionAnio",
            0,
        );

        if (dia !== 0 && mes !== "[MES_LEGALIZACION]" && anio !== 0) {
            const anioStr = anio.toString();
            const anioProc =
                anioStr === "2026"
                    ? "veintiséis"
                    : anioStr === "2025"
                        ? "veinticinco"
                        : anioStr.length === 4
                            ? anioStr.slice(-2)
                            : anioStr;
            return { dia: dia.toString(), mes, anio: anioProc };
        }

        return { dia: "23", mes: "enero", anio: "veintiséis" };
    };

    const getFechaFirma = () => {
        const dia = getVal<number>(
            "Datos_de_Notificacion_y_Cierre.FechaFirmaDia",
            0,
        );
        const mes = getVal<string>(
            "Datos_de_Notificacion_y_Cierre.FechaFirmaMes",
            "[MES_FIRMA]",
        );
        const anio = getVal<number>(
            "Datos_de_Notificacion_y_Cierre.FechaFirmaAnio",
            0,
        );

        if (dia !== 0 && mes !== "[MES_FIRMA]" && anio !== 0) {
            const anioStr = anio.toString();
            const anioProc =
                anioStr === "2026"
                    ? "veintiséis"
                    : anioStr === "2025"
                        ? "veinticinco"
                        : anioStr.length === 4
                            ? anioStr.slice(-2)
                            : anioStr;
            return { dia: dia.toString(), mes, anio: anioProc };
        }

        return { dia: "25", mes: "enero", anio: "veintiséis" };
    };

    const numberToWords = (num: number): string => {
        const units = [
            "",
            "uno",
            "dos",
            "tres",
            "cuatro",
            "cinco",
            "seis",
            "siete",
            "ocho",
            "nueve",
        ];
        const teens = [
            "diez",
            "once",
            "doce",
            "trece",
            "catorce",
            "quince",
            "dieciséis",
            "diecisiete",
            "dieciocho",
            "diecinueve",
        ];
        const tens = [
            "",
            "",
            "veinte",
            "treinta",
            "cuarenta",
            "cincuenta",
            "sesenta",
            "setenta",
            "ochenta",
            "noventa",
        ];
        const hundreds = [
            "",
            "ciento",
            "doscientos",
            "trescientos",
            "cuatrocientos",
            "quinientos",
            "seiscientos",
            "setecientos",
            "ochocientos",
            "novecientos",
        ];

        if (num === 0) return "cero";
        if (num === 100) return "cien";
        if (num <= 9) return units[num];
        if (num <= 19) return teens[num - 10];
        if (num <= 29)
            return num === 20 ? "veinte" : "veinti" + units[num - 20];
        if (num <= 99)
            return (
                tens[Math.floor(num / 10)] +
                (num % 10 !== 0 ? " y " + units[num % 10] : "")
            );
        if (num <= 999)
            return (
                hundreds[Math.floor(num / 100)] +
                (num % 100 !== 0 ? " " + numberToWords(num % 100) : "")
            );
        return num.toString();
    };

    const getPlazoMeses = () => {
        const plazoLetras = getVal<string>(
            "Liquidacion_Final_y_Plazos.PlazoMesesLetras",
            "[PLAZO_LETRAS]",
        );
        const plazoNumeros = getVal<number>(
            "Liquidacion_Final_y_Plazos.PlazoMesesNumeros",
            0,
        );

        if (plazoLetras !== "[PLAZO_LETRAS]" && plazoNumeros !== 0) {
            return { letras: plazoLetras, numeros: plazoNumeros.toString() };
        }

        const pagos = getVal<Pago[]>("Pagos", []);
        if (pagos.length > 0) {
            const lastPago = pagos[pagos.length - 1];
            if (lastPago.fecha) {
                const currentDate = new Date();
                const lastPaymentDate = new Date(lastPago.fecha);
                const monthsDiff =
                    (lastPaymentDate.getFullYear() -
                        currentDate.getFullYear()) *
                    12 +
                    (lastPaymentDate.getMonth() - currentDate.getMonth());
                const diff = monthsDiff > 0 ? monthsDiff : 22;
                return {
                    letras: numberToWords(diff).toLowerCase(),
                    numeros: diff.toString(),
                };
            }
        }
        return { letras: "veintidós", numeros: "22" };
    };

    const getMesEntrega = () => {
        const mesEntrega = getVal<string>(
            "Liquidacion_Final_y_Plazos.MesEntrega",
            "[MES_ENTREGA]",
        );
        const anioEntrega = getVal<number>(
            "Liquidacion_Final_y_Plazos.AnioEntrega",
            0,
        );

        if (mesEntrega !== "[MES_ENTREGA]" && anioEntrega !== 0) {
            return `${mesEntrega} de ${anioEntrega}`;
        }
        const pagos = getVal<Pago[]>("Pagos", []);
        if (pagos.length > 0) {
            const lastPago = pagos[pagos.length - 1];
            if (lastPago.fecha) {
                const lastDate = new Date(lastPago.fecha);
                const meses = [
                    "enero",
                    "febrero",
                    "marzo",
                    "abril",
                    "mayo",
                    "junio",
                    "julio",
                    "agosto",
                    "septiembre",
                    "octubre",
                    "noviembre",
                    "diciembre",
                ];
                const mes = meses[lastDate.getMonth()];
                return `${mes} del año ${lastDate.getFullYear()}`;
            }
        }
        return "diciembre del año 2027";
    };

    const getSaldoFinal = () => {
        const letras = getVal<string>(
            "Condiciones_Economicas.TercerPagoLetras",
            "[SALDO_LETRAS]",
        );
        const numeros = getVal<number>(
            "Condiciones_Economicas.TercerPagoNumeros",
            0,
        );

        if (letras !== "[SALDO_LETRAS]" && numeros !== 0 && letras && numeros) {
            return {
                letras,
                numeros: numeros.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                }),
            };
        }

        const saldoFin = getVal<number>(
            "Condiciones_Economicas.SaldoFinanciar",
            0,
        );
        if (saldoFin) {
            const val = saldoFin;
            const text = numberToWords(Math.floor(val));
            return {
                letras: text,
                numeros: val.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                }),
            };
        }

        const precioRaw = getVal<number>(
            "Condiciones_Economicas.PrecioNumeros",
            0,
        );
        const reservaRaw = getVal<number>(
            "Condiciones_Economicas.ReservaNumeros",
            0,
        );
        const segundoRaw = getVal<number>(
            "Condiciones_Economicas.SegundoPagoNumeros",
            0,
        );

        if (precioRaw > 0) {
            const saldo = precioRaw - reservaRaw - segundoRaw;
            return {
                letras: numberToWords(Math.floor(saldo)),
                numeros: saldo.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                }),
            };
        }

        return { letras: "[SALDO_LETRAS]", numeros: "[SALDO_NUMEROS]" };
    };

    return (
        <div className="documento-promesa">
            <style>{`

        .documento-promesa {
          font-family: 'Arial', 'Helvetica', sans-serif;
          font-size: 11pt;
          line-height: 1.5;
          color: #000;
          width: 210mm;
          max-width: 95vw;
          min-height: 297mm;
          margin: 20px auto;
          background-color: #ffffff !important;
          color: #000000 !important;
          padding: 25mm 20mm;
          box-sizing: border-box;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1) !important;
          border: 1px solid rgba(0,0,0,0.05);
        }

        @media (max-width: 768px) {
          .documento-promesa {
            width: 210mm;
            max-width: 100%;
            padding: 10mm 10mm;
            margin: 5px auto;
          }
        }

        

        .document-title {

          text-align: center;

          font-weight: bold;

          font-size: 12pt;

          margin-bottom: 25px;

          line-height: 1.4;

        }

        

        p {

          text-align: justify;

          margin-bottom: 15px;

          text-indent: 0;

        }

        

        .clause-title {

          font-weight: bold;

          text-decoration: underline;

          display: inline;

        }

        

        .dynamic-data,
        .highlight-yellow,
        .highlight-blue,
        .highlight-red {
          font-weight: 700;
          color: #0033cc; /* Azul cobalto vibrante y profesional */
          background: transparent;
          padding: 0;
          text-decoration: underline;
          text-underline-offset: 2px;
          text-decoration-thickness: 1px;
        }

        

        .party-name {

          font-weight: bold;

        }

        

        .bold {

          font-weight: bold;

        }

        

        .letter-list {

          margin-left: 20px;

        }

        

        .letter-item {

          margin-bottom: 8px;

        }

        

        .section-spacing {

          margin-top: 15px;

          margin-bottom: 15px;

        }

        

        .indented {

          margin-left: 20px;

        }

        

        .signature-line {

          width: 350px;

          border-bottom: 1px solid black;

          margin-bottom: 50px;

        }

      `}</style>

            {/* Título del Documento */}
            <div className="document-title">
                <div
                    id="inicio"
                    style={{
                        fontSize: "14pt",
                        fontWeight: "bold",
                        textAlign: "center",
                        marginBottom: "20px",
                    }}
                >
                    CONTRATO DE PROMESA DE COMPRAVENTA
                </div>

                <div
                    style={{
                        fontSize: "12pt",
                        textAlign: "center",
                        marginBottom: "5px",
                    }}
                >
                    APARTAMENTO{" "}
                    <span className="dynamic-data">
                        {getVal("Descripcion_del_Inmueble.Apartamento")}
                    </span>
                </div>

                <div
                    style={{
                        fontSize: "12pt",
                        textAlign: "center",
                        marginBottom: "5px",
                    }}
                >
                    TORRE{" "}
                    <span className="dynamic-data">
                        {getVal("Descripcion_del_Inmueble.Torre")}
                    </span>
                </div>

                <div
                    style={{
                        fontSize: "10pt",
                        textAlign: "center",
                        fontStyle: "italic",
                    }}
                >
                    COMPLEJO DE APARTAMENTOS "BRAVANTE"
                </div>
            </div>

            <div className="section-spacing">
                <p>
                    Yo, VENANCIO GÓMEZ (único apellido), quien declaro ser de
                    cincuenta y cinco años de edad, casado, Contador Público y
                    Auditor , guatemalteco, de este domicilio, me identifico con
                    el Documento Personal de Identificación -DPI- con Código
                    Único de Identificación -CUI- dos mil quinientos cuarta,
                    setenta y nueve mil doscientos veintinueve, mil
                    cuatrocientos uno (2540 79229 1401), extendido por el
                    Registro Nacional de las Personas de la República de
                    Guatemala, comparezco en mi calidad de{" "}
                    <span className="bold">
                        ADMINISTRADOR ÚNICO Y REPRESENTANTE LEGAL
                    </span>{" "}
                    de la entidad{" "}
                    <span className="bold">BRAVANTE, SOCIEDAD ANÓNIMA</span>{" "}
                    calidad que acredita con mi nombramiento como tal contenido
                    en el acta notarial autorizada en esta ciudad el veintisiete
                    de octubre de dos mil veinticinco , por la Notaria Lilian
                    Elizabeth Azurdia Pérez de Quiroz , el cual se encuentra
                    debidamente inscrito en el Registro Mercantil General de la
                    República de Guatemala bajo el número de registro
                    ochocientos doce mil veintisiete (812027) , folio quinientos
                    cuarenta y cuatro (544) , del libro ochocientos cincuenta y
                    tres (853) de Auxiliares de Comercio, entidad en adelante
                    referida simple e indistintamente como{" "}
                    <span className="party-name">
                        "LA PARTE PROMITENTE VENDEDORA"
                    </span>{" "}
                    o{" "}
                    <span className="party-name">
                        "LA PROMITENTE VENDEDORA"
                    </span>
                    ;
                </p>

                <p>
                    {(() => {
                        const compradores = getVal<Comprador[]>(
                            "Compradores",
                            [],
                        );
                        if (compradores.length > 1) {
                            return (
                                <>
                                    <span className="bold">NOSOTROS: </span>
                                    {compradores.map((c, idx) => (
                                        <React.Fragment key={idx}>
                                            <span className="bold">
                                                {idx === 0
                                                    ? "I)"
                                                    : idx === 1
                                                        ? "II)"
                                                        : `${idx + 1})`}{" "}
                                            </span>
                                            <span className="highlight-yellow">
                                                {c.Nombre}
                                            </span>
                                            , quien declaro ser de{" "}
                                            <span className="highlight-yellow">
                                                {c.Edad_Letras}
                                            </span>{" "}
                                            de edad,{" "}
                                            <span className="highlight-yellow">
                                                {c.EstadoCivil}
                                            </span>
                                            ,{" "}
                                            <span className="highlight-yellow">
                                                {c.Profesion}
                                            </span>{" "}
                                            , guatemalteco, de este domicilio,
                                            me identifico con el Documento
                                            Personal de Identificación -DPI-,
                                            con Código Único de Identificación
                                            -CUI- número{" "}
                                            <span className="highlight-yellow">
                                                {c.DPI}
                                            </span>{" "}
                                            (
                                            <span className="highlight-yellow">
                                                {c.DPI_Letras}
                                            </span>
                                            ), extendido por el Registro
                                            Nacional de las Personas de la
                                            República de Guatemala
                                            {idx < compradores.length - 1
                                                ? ". y "
                                                : ""}
                                        </React.Fragment>
                                    ))}
                                    ; en adelante referido simple e
                                    indistintamente como{" "}
                                    <span className="party-name">
                                        "LA PARTE PROMITENTE COMPRADORA"
                                    </span>
                                    ,{" "}
                                    <span className="party-name">
                                        "LOS PROMITENTES COMPRADORES"
                                    </span>{" "}
                                    o{" "}
                                    <span className="party-name">
                                        "EL PROMITENTE COMPRADOR"
                                    </span>
                                    .
                                </>
                            );
                        } else {
                            return (
                                <>
                                    Yo,{" "}
                                    <span className="highlight-yellow">
                                        {getComprador(0, "Nombre")}
                                    </span>
                                    , quien declaro ser de{" "}
                                    <span className="highlight-yellow">
                                        {getComprador(0, "Edad_Letras")}
                                    </span>{" "}
                                    de edad,{" "}
                                    <span className="highlight-yellow">
                                        {getComprador(0, "EstadoCivil")}
                                    </span>
                                    ,{" "}
                                    <span className="highlight-yellow">
                                        {getComprador(0, "Profesion")}
                                    </span>
                                    , guatemalteco, de este domicilio, me
                                    identifico con el Documento Personal de
                                    Identificación -DPI-, con Código Único de
                                    Identificación -CUI- número{" "}
                                    <span className="highlight-yellow">
                                        {getComprador(0, "DPI")}
                                    </span>{" "}
                                    (
                                    <span className="highlight-yellow">
                                        {getComprador(0, "DPI_Letras")}
                                    </span>
                                    ), extendido por el Registro Nacional de las
                                    Personas de la República de Guatemala; en
                                    adelante referido simple e indistintamente
                                    como{" "}
                                    <span className="party-name">
                                        "LA PARTE PROMITENTE COMPRADORA"
                                    </span>{" "}
                                    o{" "}
                                    <span className="party-name">
                                        "EL PROMITENTE COMPRADOR"
                                    </span>
                                    .
                                </>
                            );
                        }
                    })()}
                </p>

                <p>
                    Los comparecientes, en las calidades con que actuamos de
                    forma voluntaria manifestamos ser de los datos de
                    identificación y generales aquí consignados, hallarnos en el
                    libre ejercicio de nuestros derechos civiles, tener
                    suficientes facultades para el otorgamiento de este acto,
                    por lo que otorgamos{" "}
                    <span className="party-name">
                        CONTRATO DE PROMESA DE COMPRAVENTA DE BIENES INMUEBLES Y
                        BIEN MUEBLE (ACCIÓN)
                    </span>{" "}
                    contenido en las siguientes cláusulas:
                </p>
            </div>

            <div id="clausula-primera" className="section-spacing">
                <p>
                    <span className="clause-title">PRIMERA: ANTECEDENTES.</span>{" "}
                    Yo, VENANCIO GÓMEZ (único apellido), en representación de la
                    entidad BRAVANTE, SOCIEDAD ANÓNIMA (SOCIEDAD ANÓNIMA),
                    manifiesto que mi representada, está desarrollando la
                    construcción del Proyecto de Apartamentos denominado{" "}
                    BRAVANTE ubicado en Finca Cumbres de Vista Hermosa, Zona 5
                    del municipio de Santa Catarina Pinula, departamento de
                    Guatemala, a quien de acá en adelante denominaremos "El
                    Proyecto". El Proyecto contará con dos torres de nueve
                    niveles cada una, más cuatro sótanos, y estará distribuido
                    de la siguiente forma:{" "}
                    <span className="bold">a) cuatro niveles de sótanos</span>{" "}
                    los cuales serán utilizados para estacionamientos de
                    vehículos, distribuidos así:{" "}
                    <span className="bold">i) Sótano uno:</span> El cual quedará
                    a nivel de calle, este será utilizado para estacionamiento
                    de vehículos de propietarios y visitas.{" "}
                    <span className="bold">
                        ii) Sótanos dos, tres y cuatro:
                    </span>{" "}
                    Estos son subterráneos los tres, pero por temas de
                    topografía, el sótano dos quedará en algún área a nivel de
                    calle, y será utilizado exclusivamente para el
                    estacionamiento de vehículos de los propietarios de los
                    apartamentos del edificio, así como bodegas en los sótanos
                    uno, dos y cuatro; y parqueos para motos en el sótano
                    cuatro. y{" "}
                    <span className="bold">
                        b) Del primero hasta el noveno nivel,
                    </span>{" "}
                    los cuales serán destinados exclusivamente a apartamentos
                    para vivienda y áreas de circulación peatonal, áreas de
                    servicio y soporte a los mismos. El{" "}
                    <span className="bold">Proyecto</span> tiene planificado
                    contar con aproximadamente{" "}
                    {getVal("proyecto.total_unidades", "[TOTAL_UNIDADES]")} (
                    {getVal(
                        "proyecto.total_unidades_numeros",
                        "[TOTAL_UNIDADES_NUMEROS]",
                    )}
                    ) unidades de apartamentos, es decir,{" "}
                    {getVal("proyecto.unidades_torre1", "[UNIDADES_TORRE1]")} (
                    {getVal(
                        "proyecto.unidades_torre1_numeros",
                        "[UNIDADES_TORRE1_NUMEROS]",
                    )}
                    ) unidades de apartamentos en la torre número uno y{" "}
                    {getVal("proyecto.unidades_torre2", "[UNIDADES_TORRE2]")} (
                    {getVal(
                        "proyecto.unidades_torre2_numeros",
                        "[UNIDADES_TORRE2_NUMEROS]",
                    )}
                    ) unidades de apartamentos en la torre número dos, pudiendo
                    variar el número de apartamentos en más o menos{" "}
                    {getVal(
                        "proyecto.variacion_unidades",
                        "[VARIACION_UNIDADES]",
                    )}{" "}
                    apartamentos, a criterio de la Promitente Vendedora. El{" "}
                    <span className="bold">Proyecto</span> contará además con lo
                    siguiente: <span className="bold">a)</span>{" "}
                    {getVal(
                        "proyecto.numero_elevadores",
                        "[NUMERO_ELEVADORES]",
                    )}{" "}
                    elevadores en total,{" "}
                    {getVal(
                        "proyecto.elevadores_por_torre",
                        "[ELEVADORES_POR_TORRE]",
                    )}{" "}
                    por cada torre. <span className="bold">b)</span> Servicio de
                    agua. El agua será suministrada por{" "}
                    {getVal("proyecto.fuente_agua", "[FUENTE_AGUA]")}, propiedad
                    de la entidad{" "}
                    {getVal("proyecto.entidad_agua", "[ENTIDAD_AGUA]")}. Así
                    mismo, el edificio contará con{" "}
                    {getVal("proyecto.tipo_cisterna", "[TIPO_CISTERNA]")}. Es
                    relevante mencionar que el agua de dicho pozo{" "}
                    {getVal("proyecto.agua_potable", "[AGUA_POTABLE]")}, por lo
                    que la <span className="bold">Promitente Compradora</span>{" "}
                    deberá{" "}
                    {getVal("proyecto.tratamiento_agua", "[TRATAMIENTO_AGUA]")}{" "}
                    para su consumo. <span className="bold">c)</span> La
                    electricidad será suministrada por la{" "}
                    {getVal(
                        "proyecto.entidad_electrica",
                        "[ENTIDAD_ELECTRICA]",
                    )}
                    , siendo la Promitente Compradora la responsable de la
                    contratación y pago de su servicio en forma directa para su
                    apartamento, y el edificio contará con{" "}
                    {getVal(
                        "proyecto.planta_emergencia",
                        "[PLANTA_EMERGENCIA]",
                    )}{" "}
                    para suministro de energía a áreas comunes, los cuales son
                    pasillos, elevadores y lobby del edificio.{" "}
                    <span className="bold">d)</span> Contará con{" "}
                    {getVal("proyecto.sistema_security", "[SISTEMA_SEGURIDAD]")}{" "}
                    en cada nivel. <span className="bold">e)</span>{" "}
                    {getVal("proyecto.sistema_acceso", "[SISTEMA_ACCESO]")} en
                    ingreso vehicular.{" "}
                    {getVal(
                        "proyecto.sistema_vigilancia",
                        "[SISTEMA_VIGILANCIA]",
                    )}{" "}
                    en áreas comunes y lobbies. <span className="bold">f)</span>{" "}
                    Tuberías para las instalaciones eléctricas, hidráulicas,
                    sanitarias y otras debidamente ocultas, con sus respectivas
                    cajas y placas correspondientes a dichos servicios, a
                    ubicarse en pasillos y áreas de los apartamentos, en sótanos
                    las mismas serán expuestas. <span className="bold">g)</span>{" "}
                    {getVal("proyecto.sistema_drenaje", "[SISTEMA_DRENAJE]")},
                    así como{" "}
                    {getVal(
                        "proyecto.planta_tratamiento",
                        "[PLANTA_TRATAMIENTO]",
                    )}
                    . Los Edificios podrán denominarse de la siguiente forma,
                    para la torre número uno{" "}
                    <span className="bold">
                        "{getVal("proyecto.nombre_torre1", "[NOMBRE_TORRE1]")}"
                    </span>
                    , y para la torre número dos{" "}
                    <span className="bold">
                        "{getVal("proyecto.nombre_torre2", "[NOMBRE_TORRE2]")}"
                    </span>
                    , los cuales serán sometidos al régimen de propiedad
                    horizontalmente dividida y su respectivo reglamento, así
                    como estarán sujetos a las servidumbres que la promitente{" "}
                    vendedora considere para el proyecto, y del cual formarán
                    parte, entre otros: El apartamento{" "}
                    <span className="highlight-yellow">
                        {getVal("Descripcion_del_Inmueble.Apartamento")}
                    </span>{" "}
                    Torre{" "}
                    <span className="highlight-yellow">
                        {getVal("Descripcion_del_Inmueble.Torre")}
                    </span>
                    , ubicado en el nivel{" "}
                    <span className="highlight-yellow">
                        {getVal("Descripcion_del_Inmueble.Nivel")}
                    </span>{" "}
                    del Complejo;{" "}
                    <span className="highlight-red">
                        las{" "}
                        {(() => {
                            const ests = getVal<Estacionamiento[]>(
                                "Descripcion_del_Inmueble.Estacionamientos",
                                [],
                            );
                            const count = Array.isArray(ests) ? ests.length : 0;
                            return numberToWords(count).toUpperCase();
                        })()}{" "}
                        (
                        {(() => {
                            const ests = getVal<Estacionamiento[]>(
                                "Descripcion_del_Inmueble.Estacionamientos",
                                [],
                            );
                            return Array.isArray(ests) ? ests.length : 0;
                        })()}
                        ) plazas de estacionamiento identificadas con los
                        números:
                    </span>
                </p>

                {(() => {
                    const estacionamientos = getVal<Estacionamiento[]>(
                        "Descripcion_del_Inmueble.Estacionamientos",
                        [],
                    );

                    if (
                        !Array.isArray(estacionamientos) ||
                        estacionamientos.length === 0
                    )
                        return null;

                    return (
                        <div style={{ marginLeft: "20px", marginTop: "10px" }}>
                            {estacionamientos.map(
                                (p: Estacionamiento, idx: number) => (
                                    <p
                                        key={idx}
                                        style={{
                                            margin: "5px 0",
                                            textIndent: "0",
                                        }}
                                    >
                                        o){" "}
                                        <span className="highlight-red">
                                            {p.Numero_Letras ??
                                                "[NUMERO_LETRAS_ESTACIONAMIENTO]"}
                                        </span>{" "}
                                        (
                                        <span className="highlight-red">
                                            {p.Numero ??
                                                "[NUMERO_ESTACIONAMIENTO]"}
                                        </span>
                                        ), ubicada en el sótano número:{" "}
                                        <span className="highlight-red">
                                            {p.Sotano_Letras ??
                                                "[SOTANO_LETRAS_ESTACIONAMIENTO]"}
                                        </span>{" "}
                                        (
                                        <span className="highlight-red">
                                            {p.Sotano ??
                                                "[SOTANO_ESTACIONAMIENTO]"}
                                        </span>
                                        );
                                    </p>
                                ),
                            )}
                        </div>
                    );
                })()}

                <p style={{ marginTop: "15px" }}>
                    y las{" "}
                    <span className="highlight-red">
                        {(() => {
                            const bodegas = getVal<Bodega[]>(
                                "Descripcion_del_Inmueble.Bodegas",
                                [],
                            );
                            return numberToWords(bodegas.length).toUpperCase();
                        })()}
                    </span>{" "}
                    (
                    <span className="highlight-red">
                        {(() => {
                            const bodegas = getVal<Bodega[]>(
                                "Descripcion_del_Inmueble.Bodegas",
                                [],
                            );
                            return bodegas.length;
                        })()}
                    </span>
                    ) bodegas, identificadas con los números:
                </p>

                {(() => {
                    const bodegas = getVal<Bodega[]>(
                        "Descripcion_del_Inmueble.Bodegas",
                        [],
                    );

                    if (!Array.isArray(bodegas) || bodegas.length === 0)
                        return null;

                    return (
                        <div style={{ marginLeft: "20px", marginTop: "10px" }}>
                            {bodegas.map((b: Bodega, idx: number) => (
                                <p
                                    key={idx}
                                    style={{ margin: "5px 0", textIndent: "0" }}
                                >
                                    o){" "}
                                    <span className="highlight-red">
                                        {b.Numero_Letras ??
                                            "[NUMERO_LETRAS_BODEGA]"}
                                    </span>{" "}
                                    (
                                    <span className="highlight-red">
                                        {b.Numero ?? "[NUMERO_BODEGA]"}
                                    </span>
                                    ), ubicada en el sótano número:{" "}
                                    <span className="highlight-red">
                                        {b.Sotano_Letras ??
                                            "[SOTANO_LETRAS_BODEGA]"}
                                    </span>{" "}
                                    (
                                    <span className="highlight-red">
                                        {b.Sotano ?? "[SOTANO_BODEGA]"}
                                    </span>
                                    );
                                </p>
                            ))}
                        </div>
                    );
                })()}

                <p style={{ marginTop: "15px" }}>
                    así como el título de acción correspondiente y relacionado
                    al proyecto. La denominación de dicho complejo podrá variar
                    al constituirse el referido Régimen.
                </p>
            </div>

            <div id="clausula-segunda" className="section-spacing">
                <p>
                    <span className="clause-title">
                        SEGUNDA: PROMESA DE COMPRAVENTA.
                    </span>{" "}
                    LA PARTE PROMITENTE VENDEDORA, manifiesto que por el
                    presente instrumento prometo vender a{" "}
                    <span className="highlight-yellow">
                        {getComprador(0, "Nombre")}
                    </span>{" "}
                    los bienes indicados en la cláusula que antecede, que se
                    describen así: <span className="bold">a)</span> El
                    apartamento identificado como Apartamento{" "}
                    <span className="highlight-yellow">
                        {getVal("Descripcion_del_Inmueble.Apartamento")}
                    </span>{" "}
                    Torre{" "}
                    <span className="highlight-yellow">
                        {getVal("Descripcion_del_Inmueble.Torre")}
                    </span>
                    , ubicado en el nivel{" "}
                    <span className="highlight-yellow">
                        {getVal("Descripcion_del_Inmueble.Nivel")}
                    </span>{" "}
                    del Complejo; apartamento que consta de{" "}
                    <span className="highlight-yellow">
                        {getVal("Descripcion_del_Inmueble.Habitaciones")}
                    </span>{" "}
                    habitaciones,{" "}
                    <span className="highlight-yellow">
                        {getVal(
                            "Descripcion_del_Inmueble.DescripcionApartamento",
                            "[DESCRIPCION_APARTAMENTO]",
                        )}
                    </span>
                </p>

                <p>
                    Y contará con un área aproximada de{" "}
                    <span className="highlight-yellow">
                        {getVal(
                            "Descripcion_del_Inmueble.AreaConstruccionLetras",
                        )}
                    </span>{" "}
                    (
                    <span className="highlight-yellow">
                        {getVal(
                            "Descripcion_del_Inmueble.AreaConstruccionNumeros",
                        )}
                    </span>{" "}
                    m2) de construcción; <span className="bold">b)</span>{" "}
                    <span className="highlight-red">
                        {getVal(
                            "Descripcion_del_Inmueble.ParqueosDescripcion",
                            "[DESCRIPCION_PARQUEOS]",
                        )}
                    </span>
                    ; <span className="bold">c)</span> Una terraza o balcón, con
                    un área aproximada de{" "}
                    <span className="highlight-red">
                        {getVal(
                            "Descripcion_del_Inmueble.TerrazaBalconAreaLetras",
                            "[AREA_TERRAZA_LETRAS]",
                        )}
                    </span>{" "}
                    (
                    <span className="highlight-red">
                        {getVal(
                            "Descripcion_del_Inmueble.TerrazaBalconAreaNumeros",
                            "[AREA_TERRAZA_NUMEROS]",
                        )}
                    </span>{" "}
                    m2); y <span className="bold">d)</span>
                    El bien mueble (acción) de la entidad relacionada y
                    pertinente al proyecto.
                </p>

                <p>
                    Los acabados y equipamiento estándar con los que contará el
                    apartamento son los siguientes:
                </p>

                <div style={{ marginLeft: "20px" }}>
                    <p style={{ margin: "3px 0", textIndent: "0" }}>
                        - Acabado alisado en paredes y cielos más pintura
                        blanca;
                    </p>

                    <p style={{ margin: "3px 0", textIndent: "0" }}>
                        - Piso de madera de ingeniería en habitaciones;
                    </p>

                    <p style={{ margin: "3px 0", textIndent: "0" }}>
                        - Azulejo de porcelanato, colocados en área de piso,
                        paredes de duchas y respaldo de artefactos;
                    </p>

                    <p style={{ margin: "3px 0", textIndent: "0" }}>
                        - Mamparas de vidrio en duchas de baño, según diseño;
                    </p>

                    <p style={{ margin: "3px 0", textIndent: "0" }}>
                        - Puertas lisas enchapadas en madera con marcos
                        completos;
                    </p>

                    <p style={{ margin: "3px 0", textIndent: "0" }}>
                        - Cerradura principal tipo manija satinadas y chapa
                        digital;
                    </p>

                    <p style={{ margin: "3px 0", textIndent: "0" }}>
                        - Cerraduras tipo manija satinadas;
                    </p>

                    <p style={{ margin: "3px 0", textIndent: "0" }}>
                        - Zócalo de PVC imitación madera de diez centímetros
                        (10cm.);
                    </p>

                    <p style={{ margin: "3px 0", textIndent: "0" }}>
                        - Ventanería de aluminio línea europea con vidrio
                        laminado para aislamiento acústico, de ocho milímetros
                        (8mm);
                    </p>

                    <p style={{ margin: "3px 0", textIndent: "0" }}>
                        - Inodoros "one piece" doble descarga;
                    </p>

                    <p style={{ margin: "3px 0", textIndent: "0" }}>
                        - Grifería cromada en duchas;
                    </p>

                    <p style={{ margin: "3px 0", textIndent: "0" }}>
                        - Lavamanos blanco con grifo cromado y gabinete de
                        melamina;
                    </p>

                    <p style={{ margin: "3px 0", textIndent: "0" }}>
                        - Gabinetes de cocina en melamina con top de cuarzo,
                        según diseño;
                    </p>

                    <p style={{ margin: "3px 0", textIndent: "0" }}>
                        - Lavatrastos inoxidable con grifo cromado;
                    </p>

                    <p style={{ margin: "3px 0", textIndent: "0" }}>
                        - Closets completos en melamina, según diseño;
                    </p>

                    <p style={{ margin: "3px 0", textIndent: "0" }}>
                        - Luminarias empotrables en cielo Led, según diseño
                        eléctrico;
                    </p>

                    <p style={{ margin: "3px 0", textIndent: "0" }}>
                        - Placas de interruptores y tomacorrientes blancas;
                    </p>

                    <p style={{ margin: "3px 0", textIndent: "0" }}>
                        - Calentador de agua eléctrico;
                    </p>
                </div>

                <p style={{ marginTop: "15px" }}>
                    Los adquirentes tendrán derecho a utilizar las áreas o
                    amenidades comunes con las que contará el proyecto
                    "Bravante".
                </p>

                <p>
                    El inmueble ofrecido en este compromiso de compraventa,
                    soportará las servidumbres que se detallan en el Régimen de
                    Propiedad Horizontal que BRAVANTE, SOCIEDAD ANÓNIMA, ha
                    definido con el objeto de darle armonía, orden y uniformidad
                    al proyecto, principalmente en cuanto al uso de áreas
                    comunes, reglas de convivencia y cuotas que se fijen.
                </p>

                <p>
                    Manifestamos las partes que aceptamos que el área de los
                    bienes objeto de este contrato podrá variar en más o menos
                    hasta en un dos por ciento (2%).
                </p>
            </div>

            {/* Continuación - Página 4 */}

            <div className="section-spacing">
                <p>
                    Es convenido por las partes que la promesa de compraventa
                    constituye una obligación conjunta, en el entendido que LA
                    PARTE PROMITENTE VENDEDORA no cumple si no vende todos los
                    bienes inmuebles y el bien mueble (acción) antes mencionados
                    y la PARTE PROMITENTE COMPRADORA tampoco cumple si no compra
                    todos los bienes inmuebles y el bien mueble (acción) antes
                    mencionados en su conjunto. La PARTE PROMITENTE COMPRADORA
                    prometo comprar dichos bienes inmuebles y bien mueble
                    (acción) en su conjunto, y ambas partes manifestamos que la
                    promesa de compraventa y la compraventa futura, están
                    sujetas a las estipulaciones y condiciones que se expresan
                    en este contrato.
                </p>
            </div>

            <div id="clausula-tercera" className="section-spacing">
                <p>
                    <span className="clause-title">TERCERA:</span> La promesa de
                    compraventa que se otorga en este acto se sujetará a las
                    estipulaciones siguientes:{" "}
                    <span className="bold">I) PRECIO:</span> El precio total de
                    la compraventa de los bienes prometidos en venta descritos
                    en la cláusula que antecede es de{" "}
                    <span className="highlight-yellow">
                        {getVal<string>(
                            "Condiciones_Economicas.PrecioLetras",
                            "[PRECIO_LETRAS]",
                        ).replace(/\s*quetzales\s*$/i, "")}
                    </span>{" "}
                    quetzales (Q.{" "}
                    <span className="highlight-yellow">
                        {getVal(
                            "Condiciones_Economicas.PrecioNumeros",
                            "[PRECIO_NUMEROS]",
                        )}
                    </span>
                    ) , el cual incluye el IMPUESTO AL VALOR AGREGADO y el
                    IMPUESTO DEL TIMBRE correspondiente; para lo cual en su
                    momento se podrán redactar dos documentos, el de la
                    compraventa de inmuebles y el de la compraventa de mueble
                    (acción), cada uno con su precio correspondiente.{" "}
                    <span className="bold">II) VARIACIÓN DEL PRECIO.</span>{" "}
                    Manifiesto como la Promitente Compradora que acepto de forma
                    expresa que en caso de nuevas leyes que regulen nuevos
                    impuestos relacionados con el objeto de este contrato y su
                    respectiva construcción o se aumenten los existentes, acepto
                    que en esa misma medida y proporción se aumentará el valor
                    de los bienes prometidos en venta, siempre que se acredite
                    fehacientemente el aumento en que dichas disposiciones han
                    afectado al precio pactado, aceptando consecuentemente dicha
                    variación como valor a cancelar de los bienes objeto de esta
                    promesa, cuyo pago se hará conforme y en conjunto al precio
                    antes establecido y según lo que se establece en el presente
                    contrato. <span className="bold">III) FORMA DE PAGO.</span>{" "}
                    LA PARTE PROMITENTE COMPRADORA pagará el valor de los bienes
                    prometidos en venta de la siguiente forma:
                </p>

                <p>
                    <span className="bold">a)</span> Un primer pago por la
                    cantidad de{" "}
                    <span className="highlight-yellow">
                        {getVal<string>(
                            "Condiciones_Economicas.ReservaLetras",
                            "[RESERVA_LETRAS]",
                        ).replace(/\s*quetzales\s*$/i, "")}
                    </span>{" "}
                    quetzales (Q.{" "}
                    <span className="highlight-yellow">
                        {getVal(
                            "Condiciones_Economicas.ReservaNumeros",
                            "[RESERVA_NUMEROS]",
                        )}
                    </span>
                    ) en concepto de reserva, que Yo, la parte Promitente
                    Vendedora manifiesto que tengo recibido a mi entera
                    satisfacción.
                </p>

                <p>
                    <span className="bold">b)</span> Un segundo pago por la
                    cantidad total de{" "}
                    <span className="highlight-yellow">
                        {getVal<string>(
                            "Condiciones_Economicas.SegundoPagoLetras",
                            "[SEGUNDO_PAGO_LETRAS]",
                        ).replace(/\s*quetzales\s*$/i, "")}
                    </span>{" "}
                    quetzales (Q.{" "}
                    <span className="highlight-yellow">
                        {getVal(
                            "Condiciones_Economicas.SegundoPagoNumeros",
                            "[SEGUNDO_PAGO_NUMEROS]",
                        )}
                    </span>
                    ) , que la parte Promitente Compradora entregará mediante{" "}
                    <span className="highlight-red">
                        {getVal(
                            "Condiciones_Economicas.CantidadPagosLetras",
                            "veintidós",
                        )}
                    </span>{" "}
                    (
                    <span className="highlight-red">
                        {getVal(
                            "Condiciones_Economicas.CantidadPagosNumeros",
                            "22",
                        )}
                    </span>
                    ) pagos a la Promitente Vendedora, de la siguiente forma:
                </p>

                <div style={{ marginLeft: "20px" }}>
                    {(() => {
                        const pagos = getVal<Pago[]>("Pagos", []);

                        if (!Array.isArray(pagos) || pagos.length === 0)
                            return null;

                        const meses = [
                            "enero",
                            "febrero",
                            "marzo",
                            "abril",
                            "mayo",
                            "junio",
                            "julio",
                            "agosto",
                            "septiembre",
                            "octubre",
                            "noviembre",
                            "diciembre",
                        ];

                        return pagos.map((p: Pago, idx: number) => {
                            if (!p.fecha || !p.value) return null;

                            const fecha = new Date(p.fecha);
                            const dia = fecha.getDate();
                            const mes = meses[fecha.getMonth()];
                            const anio = fecha.getFullYear();

                            const valorNum = parseFloat(p.value);
                            const valorTexto = numberToWords(
                                Math.floor(valorNum),
                            );

                            return (
                                <p
                                    key={idx}
                                    style={{ margin: "5px 0", textIndent: "0" }}
                                >
                                    {idx + 1}) El día{" "}
                                    <span className="highlight-red">{dia}</span>{" "}
                                    de{" "}
                                    <span className="highlight-red">{mes}</span>{" "}
                                    del año{" "}
                                    <span className="highlight-red">
                                        {anio}
                                    </span>
                                    , la cantidad de{" "}
                                    <span className="highlight-red">
                                        {valorTexto}
                                    </span>{" "}
                                    (Q.{" "}
                                    <span className="highlight-red">
                                        {valorNum.toLocaleString("en-US", {
                                            minimumFractionDigits: 2,
                                            maximumFractionDigits: 2,
                                        })}
                                    </span>
                                    );
                                </p>
                            );
                        });
                    })()}
                </div>

                <p style={{ marginTop: "15px" }}>
                    <span className="bold">c)</span> El saldo del precio total
                    de la compraventa, es decir la cantidad de{" "}
                    <span className="highlight-yellow">
                        {getSaldoFinal().letras.replace(
                            /\s*quetzales\s*$/i,
                            "",
                        )}
                    </span>{" "}
                    quetzales (Q.{" "}
                    <span className="highlight-yellow">
                        {getSaldoFinal().numeros}
                    </span>
                    ) , será pagado por la PARTE PROMITENTE COMPRADORA, el día
                    en que se otorgue la escritura pública de compraventa
                    definitiva de los bienes inmuebles y el bien mueble (acción)
                    objeto de este contrato y se haga entrega de los mismos.{" "}
                    <span className="bold">V) PLAZO:</span>
                    El plazo para el otorgamiento de la escritura pública de
                    compraventa respectiva será de{" "}
                    <span className="highlight-yellow">
                        {getPlazoMeses().letras} ({getPlazoMeses().numeros})
                    </span>{" "}
                    meses contados a partir del día siguiente de la firma del
                    presente contrato, es decir, el día{" "}
                    <span className="highlight-yellow">{getMesEntrega()}</span>,
                    fecha en la cual LA PARTE PROMITENTE VENDEDORA deberá tener
                    concluida la construcción del apartamento objeto de este
                    contrato y debidamente entregado a la PARTE PROMITENTE
                    COMPRADORA, quien deberá haber cumplido con todas y cada una
                    de las obligaciones aquí estipuladas a su cargo.
                </p>
            </div>

            <div id="clausula-cuarta" className="section-spacing">
                <p>
                    <span className="clause-title">
                        CUARTA: TERMINACIÓN ANTICIPADA.
                    </span>{" "}
                    Sin perjuicio de otros derechos que correspondan a LA PARTE
                    PROMITENTE VENDEDORA conforme este contrato, la PARTE
                    PROMITENTE VENDEDORA podrá resolver en cualquier momento el
                    presente contrato, sin necesidad de declaración judicial
                    previa o posterior, y dar por terminado en forma anticipada
                    el mismo sin responsabilidad de mi parte, si LA PARTE
                    PROMITENTE COMPRADORA no cumple con una sola de sus
                    obligaciones de pago en la fecha, monto y forma aquí
                    pactados, dicho incumplimiento constituirá una condición
                    resolutoria expresa de este contrato. En caso ocurra el
                    hecho constitutivo de la condición resolutoria expresa, La
                    PARTE PROMITENTE VENDEDORA tengo el derecho de disponer de
                    los bienes objetos de este contrato en cualquier forma y
                    podré negociar, prometer en venta, vender o ceder los mismos
                    a un tercero, sin que haya necesidad que preceda orden o
                    resolución judicial o autorización alguna de LA PARTE
                    PROMITENTE COMPRADORA, procediéndose de conformidad con lo
                    expuesto en las cláusulas subsiguientes especialmente lo
                    relacionado al cumplimiento del pago indemnizatorio. Este
                    contrato también podrá darse por terminado por decisión
                    unilateral de la PARTE PROMITENTE VENDEDORA, o de la parte
                    PROMITENTE COMPRADORA, sin necesidad de justificar causa
                    alguna, pero en todo caso, las partes se obligan al
                    cumplimiento del pago indemnizatorio regulado en las
                    cláusulas siguientes. De igual manera, en caso que la PARTE
                    PROMITENTE COMPRADORA, durante el plazo del presente
                    contrato fuere sujeto de procesos judiciales de cualquier
                    índole o naturaleza que conlleve la posibilidad de concluir
                    con sentencia alguna de índole condenatoria que afecte mi
                    libertad y/o capacidad de pago, por el presente acto
                    confiero facultad especial a LA PARTE PROMITENTE VENDEDORA
                    para resolver el presente contrato sin responsabilidad
                    indemnizatoria y/o legal alguna sujetándome al procedimiento
                    de devolución de los montos dados en concepto de enganche,
                    según lo estipulado en el presente contrato en cuanto a la
                    forma y plazo.
                </p>
            </div>

            <div id="clausula-quinta" className="section-spacing">
                <p>
                    <span className="clause-title">
                        QUINTA: CLAUSULA INDEMNIZATORIA DE LA PARTE PROMITENTE
                        VENDEDORA.
                    </span>{" "}
                    Las partes renunciamos expresamente a la aplicación del
                    artículo un mil cuatrocientos cuarenta y dos (1,442) del
                    Código Civil vigente, de manera que los pagos recibidos a
                    cuenta del precio no constituirán el equivalente a los daños
                    y perjuicios, ni la PARTE PROMITENTE VENDEDORA estaré en la
                    obligación de restituir el doble de lo que hubiese recibido.
                    En relación a daños y perjuicios resultantes de la
                    inejecución a falta de cumplimiento del contrato, las partes
                    manifestamos que se regulará la relación contractual de
                    conformidad con lo que se establece en ésta y la siguiente
                    cláusula. El incumplimiento o el retardo en el cumplimiento
                    por parte de PROMITENTE VENDEDORA, se regirá por las
                    estipulaciones siguientes, pero cobrarán efecto, sí y solo
                    sí la PARTE PROMITENTE COMPRADORA he cumplido a cabalidad y
                    en tiempo con mis obligaciones de pago. Si la Parte
                    Vendedora decido resolver el presente contrato sin
                    justificar causa alguna o sin haber sido motivado por la
                    condición resolutoria expresa, deberé devolver a la parte
                    PROMITENTE COMPRADORA los montos recibidos a cuenta del
                    precio del apartamento sumado a un interés anual del tres
                    por ciento (3%) en concepto de daños y perjuicios, en un
                    plazo no mayor, de seis (6) meses a partir de la fecha que
                    se le notifique a la parte PROMITENTE COMPRADORA, calculado
                    de la siguiente forma: Por cada pago recibido por LA PARTE
                    PROMITENTE VENDEDORA y efectivamente disponible, a partir de
                    ese día se calculará el interés, el cual no será
                    capitalizable; calculándose el intereses sobre cada pago
                    efectivamente recibido.
                </p>
            </div>

            <div id="clausula-sexta" className="section-spacing">
                <p>
                    <span className="clause-title">
                        SEXTA: CLÁUSULA INDEMNIZATORIA DE LA PARTE PROMITENTE
                        COMPRADORA.
                    </span>{" "}
                    En caso de incumplimiento por parte de LA PARTE PROMITENTE
                    COMPRADORA, dará derecho A LA PARTE PROMITENTE VENDEDORA a
                    proceder de la siguiente forma: 1) a dar por concluida la
                    negociación sin ningún tipo de procedimiento posterior y 2)
                    cobrar por concepto de indemnización y perjuicios, los
                    siguientes montos en los siguientes casos:
                </p>

                <div className="indented">
                    <p>
                        A. Desistir de la compra, encontrándose ya en trámite de
                        análisis de crédito, o por ser denegado por la entidad
                        Bancaria o Financiera, DIEZ MIL DOLARES DE LOS ESTADOS
                        UNIDOS DE NORTE AMERICA. (UDS.10,000.00).
                    </p>

                    <p>
                        B. El cinco por ciento (5%) del valor total de la
                        compraventa pactada en la promesa de compraventa de
                        bienes inmuebles y mueble (acción) por desistir de la
                        compra encontrándose el expediente ya aprobado por
                        cualquier entidad bancaria o financiera.
                    </p>

                    <p>
                        C. El cinco por ciento (5%) del valor total de la
                        compraventa pactada en la promesa de compraventa de
                        bienes inmuebles y mueble (acción) más un fee de CINCO
                        MIL DOLARES DE LOS ESTADOS UNIDOS DE NORTE AMERICA
                        (UDS.5,000.00), por desistir de la compra después de
                        haber pedido cambios y mejoras en el inmueble y estos se
                        hubieran ya realizado, siendo No reintegrable el monto
                        pagado por las mejoras ya realizadas.
                    </p>

                    <p>
                        D. En compras de contado, se penalizará de la siguiente
                        forma:
                    </p>

                    <div style={{ marginLeft: "20px" }}>
                        <p>
                            I. Por desistimiento después de haber firmado la
                            promesa de compraventa de bienes inmuebles y muebles
                            acción, se penalizará con un cinco por ciento (5%),
                            del valor de lo prometido en compraventa.
                        </p>

                        <p>
                            II. El cinco por ciento (5%) del valor total de la
                            compraventa pactada en la promesa de compraventa de
                            bienes inmuebles y mueble (acción) más un fee de
                            CINCO MIL DOLARES DE LOS ESTADOS UNIDOS DE NORTE
                            AMERICA (UDS.5,000.00), por desistir de la compra
                            después de haber pedido cambios y mejoras en el
                            inmueble y estos se hubieran ya realizado, siendo No
                            reintegrable el monto pagado por las mejoras ya
                            realizadas.
                        </p>
                    </div>
                </div>

                <p>
                    El desistimiento por cualquier otra razón no contemplada en
                    los presentes incisos será revisado directamente por el
                    Consejo Administrativo de la entidad vendedora, quien
                    asignará la penalización en relación a la causa del
                    desistimiento, acordando desde ya que en ningún caso podrá
                    ser menor de CUATRO MIL DOLARES DE LOS ESTADOS UNIDOS DE
                    NORTE AMERICA (UDS.4,000.00).
                </p>

                <p>
                    En todos los casos anteriores, la penalización se descontará
                    directamente del monto del enganche o reserva que el cliente
                    hubiera cancelado a la fecha del desistimiento, acordando
                    las partes que el plazo para el reintegro del saldo a favor
                    DE LA PARTE PROMITENTE COMPRADORA, deberá realizarse en un
                    plazo no mayor a seis (6) meses, a partir de la fecha del
                    desistimiento o aplicación de la penalización.
                </p>
            </div>

            <div id="clausula-septima" className="section-spacing">
                <p>
                    <span className="clause-title">
                        SÉPTIMA: CESIÓN DE DERECHOS.
                    </span>{" "}
                    LA PARTE PROMITENTE COMPRADORA no podré negociar, ceder,
                    enajenar, o de cualquier otra forma disponer de las
                    obligaciones o derechos que adquiere en este contrato, salvo
                    que cuente con la aprobación previa y por escrito de LA
                    PARTE PROMITENTE VENDEDORA. LA PARTE PROMITENTE VENDEDORA,
                    por mi parte, quedo en libertad de negociar, ceder, o
                    enajenar los derechos y obligaciones que adquiero en este
                    contrato, parcial o totalmente, dando posterior aviso a LA
                    PARTE PROMITENTE COMPRADORA.
                </p>
            </div>

            <div id="clausula-octava" className="section-spacing">
                <p>
                    <span className="clause-title">
                        OCTAVA: PREEMINENCIA DEL PRESENTE CONTRATO.
                    </span>{" "}
                    EI PROMITENTE COMPRADOR Y EL PROMITENTE VENDEDOR
                    manifestamos que el texto del contrato contenido en el
                    presente documento privado, prevalecerá sobre cualquier otro
                    documento o acuerdo, cotización, oral o escrito, respecto
                    del objeto del presente contrato. Por consiguiente, los
                    documentos que hubieren sido firmados con anterioridad por
                    nosotros los otorgantes, carecerán de validez en todo lo que
                    fueren contradictorios, incongruentes, estipulen condiciones
                    distintas a lo pactado en este documento privado o que
                    aparecieren contrarias a las intenciones de las partes
                    contratantes. Continuamos manifestando ambas partes que
                    cualquier modificación, adhesión o anexo al presente
                    contrato para que se considere parte integrante del mismo,
                    debe de constar por escrito y firmado por ambas partes.
                </p>
            </div>

            <div id="clausula-novena" className="section-spacing">
                <p>
                    <span className="clause-title">
                        NOVENA: LUGAR PARA RECIBIR NOTIFICACIONES.
                    </span>{" "}
                    Para todos los efectos legales que correspondan, las partes
                    contratantes señalamos como lugares para recibir toda clase
                    de notificaciones, citaciones y emplazamientos, las
                    direcciones: <span className="bold">a)</span> LA PARTE
                    PROMITENTE COMPRADORA, la ubicada en{" "}
                    <span className="highlight-yellow">
                        {getDireccionComprador()}
                    </span>
                    , departamento de Guatemala; y,{" "}
                    <span className="bold">b)</span> La PARTE PROMITENTE
                    VENDEDORA, la ubicada en el Boulevard Rafael Landívar, diez
                    guión cero cinco (10-05), zona dieciséis (16), Paseo Cayalá,
                    Edificio D uno (D1) oficina doscientos dos (202) segundo
                    nivel, del Municipio de Guatemala, Departamento de
                    Guatemala. Cualquier cambio de dirección de cualquiera de
                    las partes deberá avisarse por escrito con acuse de
                    recepción a la otra, y en tanto no se haga, se tendrán por
                    bien hechas las notificaciones, citaciones y emplazamientos
                    que se efectúen en los lugares indicados.
                </p>
            </div>

            <div id="clausula-decima" className="section-spacing">
                <p>
                    <span className="clause-title">
                        DÉCIMA: CONFIDENCIALIDAD.
                    </span>{" "}
                    LA PARTE PROMITENTE COMPRADORA me obligo a mantener bajo
                    estricta confidencialidad toda la información que en virtud
                    del presente contrato le fuera suministrada por la PARTE
                    PROMITENTE VENDEDORA, así como deberé mantener bajo esta
                    misma reserva el texto de este contrato.
                </p>
            </div>

            <div id="clausula-decima-primera" className="section-spacing">
                <p>
                    <span className="clause-title">
                        DÉCIMA PRIMERA: CLAUSULA COMPROMISORIA.
                    </span>{" "}
                    Las partes contratantes convenimos en que de producirse
                    cualquier controversia, conflicto o disputa entre nosotras,
                    derivada directa o indirectamente de este contrato, de su
                    interpretación y/o de su ejecución o cumplimiento, se
                    resolverá en la forma siguiente:{" "}
                    <span className="bold">a)</span> Mediante la vía directa,
                    con o sin intermediación de un conciliador;{" "}
                    <span className="bold">b)</span> De no ser posible la
                    solución por la vía directa dentro de los tres meses
                    siguientes de suscitado el conflicto, ambas partes
                    renunciamos expresamente al fuero de nuestro domicilio y
                    jurisdicción, y a la competencia de los tribunales de
                    justicia de Guatemala, y mediante esta cláusula
                    compromisoria acordamos desde ya someter la controversia,
                    conflicto o disputa a un Arbitraje de Equidad de conformidad
                    con el Reglamento de Conciliación y Arbitraje del{" "}
                    <span className="bold">
                        CENAC (Centro de Conciliación y Arbitraje de la Cámara
                        de Comercio de Guatemala),
                    </span>{" "}
                    el cual las partes contratantes aceptamos desde ahora en
                    forma irrevocable.
                </p>

                <p>
                    Acordamos los contratantes que desde ya autorizamos al{" "}
                    <span className="bold">CENAC</span> para que nombre al
                    árbitro de conformidad con su reglamento, así mismo,
                    acordamos que el arbitraje, se llevará a cabo en la Ciudad
                    de Guatemala, en idioma español, y se decidirá por un solo
                    árbitro. Adicionalmente, acordamos las partes contratantes
                    que el <span className="bold">CENAC</span> será la
                    institución encargada de administrar los procedimientos de
                    conciliación y arbitraje según sea el caso, de conformidad
                </p>

                <p>
                    con su normativa. El laudo arbitral no se podrá impugnar, y
                    las partes aceptamos desde ya que constituirá título
                    ejecutivo suficiente, perfecto y eficaz.
                </p>
            </div>

            <div id="clausula-decima-segunda" className="section-spacing">
                <p>
                    <span className="clause-title">
                        DÉCIMA SEGUNDA: ACEPTACIÓN:
                    </span>{" "}
                    En los términos expuestos y en las calidades con las que
                    actuamos, los comparecientes declaramos la plena conformidad
                    y aceptación con el contenido íntegro del presente contrato
                    y luego de haberlo leído y bien enterados de su contenido,
                    objeto, validez y efectos legales, lo ratificamos, aceptamos
                    y firmamos, sin reserva alguna, el{" "}
                    <span className="highlight-red">{getFechaFirma().dia}</span>{" "}
                    de{" "}
                    <span className="highlight-red">{getFechaFirma().mes}</span>{" "}
                    de dos mil{" "}
                    <span className="highlight-red">
                        {getFechaFirma().anio}
                    </span>
                    , quedando contenido el mismo en cuatro (4) hojas de papel
                    bond, impresas en su lado anverso y reverso.
                </p>
            </div>

            {/* Firmas del Contrato */}

            {/* Firmas del Contrato */}
            <div id="firmas" style={{ marginTop: "100px" }}>
                {(() => {
                    const compradores = getVal<Comprador[]>("Compradores", []);
                    // Lista de firmantes: Vendedor + Compradores
                    const firmantes = [
                        { label: "POR LA PARTE VENDEDORA" },
                        ...compradores.map(() => ({
                            label: "POR LA PARTE COMPRADORA",
                        })),
                    ];

                    // Agrupar en filas de 2
                    const rows = [];
                    for (let i = 0; i < firmantes.length; i += 2) {
                        rows.push(firmantes.slice(i, i + 2));
                    }

                    return rows.map((row, rowIndex) => (
                        <div
                            key={rowIndex}
                            style={{
                                display: "flex",
                                justifyContent:
                                    row.length === 1
                                        ? "center"
                                        : "space-between",
                                marginBottom: "50px",
                            }}
                        >
                            {row.map((firmante, colIndex) => (
                                <div key={colIndex} style={{ width: "45%" }}>
                                    <div
                                        style={{
                                            width: "100%",
                                            borderBottom: "1px solid black",
                                        }}
                                    ></div>
                                    <p
                                        style={{
                                            textAlign: "center",
                                            fontSize: "9pt",
                                            marginTop: "5px",
                                        }}
                                    >
                                        {firmante.label}
                                    </p>
                                </div>
                            ))}
                        </div>
                    ));
                })()}
            </div>

            <div className="section-spacing" style={{ marginTop: "40px" }}>
                <p>
                    En la Ciudad de Guatemala el{" "}
                    <span className="highlight-red">
                        {getFechaLegalizacion().dia}
                    </span>{" "}
                    de{" "}
                    <span className="highlight-red">
                        {getFechaLegalizacion().mes}
                    </span>{" "}
                    de dos mil{" "}
                    <span className="highlight-red">
                        {getFechaLegalizacion().anio}
                    </span>
                    , Yo, el infrascrito Notario hago constar que las{" "}
                    {(() => {
                        const compradores = getVal<Comprador[]>(
                            "Compradores",
                            [],
                        );
                        const count = compradores.length + 1;
                        return count === 2 ? "DOS" : "TRES";
                    })()}{" "}
                    firmas que anteceden calzan en un Contrato de Promesa de
                    Compraventa de Bienes Inmuebles y Bien Mueble (Acción), y
                    son auténticas por haber sido puestas en mi presencia el día
                    de hoy por: <span className="bold">a) VENANCIO GÓMEZ</span>{" "}
                    (único apellido), quien se identifica con el Documento
                    Personal de Identificación -DPI- con Código Único de
                    Identificación -CUI- dos mil quinientos cuarenta, setenta y
                    nueve mil doscientos veintinueve, mil cuatrocientos uno
                    (2540 79229 1401), extendido por el Registro Nacional de las
                    Personas de la República de Guatemala, quien comparece en su
                    calidad de{" "}
                    <span className="bold">
                        ADMINISTRADOR ÚNICO Y REPRESENTANTE LEGAL
                    </span>{" "}
                    de la entidad{" "}
                    <span className="bold">BRAVANTE, SOCIEDAD ANÓNIMA</span>{" "}
                    calidad que acredita con su nombramiento como tal contenido
                    en el acta notarial autorizada en esta ciudad el veintisiete
                    de octubre de dos mil veinticinco, por la Notaria Lilian
                    Elizabeth Azurdia Pérez de Quiroz, el cual se encuentra
                    debidamente inscrito en el Registro Mercantil General de la
                    República de Guatemala bajo el número de registro
                    ochocientos doce mil veintisiete (812027), folio quinientos
                    cuarenta y cuatro (544), del libro ochocientos cincuenta y
                    tres (853) de Auxiliares de Comercio; y
                </p>

                {(() => {
                    const compradores = getVal<Comprador[]>("Compradores", []);
                    if (!Array.isArray(compradores)) return null;

                    return compradores.map((c: Comprador, idx: number) => (
                        <p key={idx} style={{ marginTop: "10px" }}>
                            <span className="bold">
                                {String.fromCharCode(98 + idx)}){" "}
                                <span className="highlight-yellow">
                                    {c.Nombre ??
                                        `[NOMBRE_COMPRADOR_${idx + 1}]`}
                                </span>
                            </span>
                            , quien se identifica con el Documento Personal de
                            Identificación -DPI-, con Código Único de
                            Identificación -CUI- número{" "}
                            <span className="highlight-yellow">
                                {c.DPI_Letras ?? `[DPI_LETRAS_${idx + 1}]`} (
                                {c.DPI ?? `[DPI_NUMEROS_${idx + 1}]`})
                            </span>{" "}
                            extendido por el Registro Nacional de las Personas
                            de la República de Guatemala;
                            {idx === compradores.length - 1
                                ? " quienes vuelven a firmar la presente acta, ante el infrascrito Notario quien de todo lo relacionado Doy Fe."
                                : ""}
                        </p>
                    ));
                })()}
            </div>

            <div style={{ marginTop: "80px" }}>
                {(() => {
                    const compradores = getVal<Comprador[]>("Compradores", []);
                    // Total de firmas: 1 Vendedor + N Compradores
                    const totalFirmas = 1 + compradores.length;

                    // Agrupar en filas de 2
                    const rows = [];
                    // Creamos un array dummy para iterar
                    const firmasArray = Array(totalFirmas).fill(null);

                    for (let i = 0; i < firmasArray.length; i += 2) {
                        rows.push(firmasArray.slice(i, i + 2));
                    }

                    return rows.map((row, rowIndex) => (
                        <div
                            key={rowIndex}
                            style={{
                                display: "flex",
                                justifyContent:
                                    row.length === 1
                                        ? "center"
                                        : "space-between",
                                marginBottom: "60px",
                            }}
                        >
                            {row.map((_, colIndex) => (
                                <div key={colIndex} style={{ width: "45%" }}>
                                    <div
                                        style={{
                                            width: "100%",
                                            borderBottom: "1px solid black",
                                        }}
                                    ></div>
                                </div>
                            ))}
                        </div>
                    ));
                })()}

                <div
                    style={{
                        marginTop: "40px",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                    }}
                >
                    <p
                        style={{
                            fontWeight: "bold",
                            fontSize: "11pt",
                            marginBottom: "40px",
                        }}
                    >
                        ANTE MÍ:
                    </p>
                </div>
            </div>
        </div>
    );
};

export default DocumentoPromesa;
