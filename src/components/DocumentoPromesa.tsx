import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const DocumentoPromesa: React.FC = () => {
  const { id } = useParams();
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    if (id) {
      fetch('https://agentsprod.redtec.ai/webhook/promesa-document', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      })
        .then(response => response.json())
        .then(jsonData => {
          setData(jsonData);
        })
        .catch(error => {
          console.error('Error fetching document data:', error);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getVal = (key: string, fallback: string = '_______') => {
    return data && data[key] ? data[key] : fallback;
  };

  return (
    <div className="documento-promesa bg-white p-8 overflow-auto" style={{ maxHeight: '100vh' }}>
      <style>{`
        .documento-promesa {
          font-family: 'Arial', 'Helvetica', sans-serif;
          font-size: 11pt;
          line-height: 1.5;
          color: #000;
          max-width: 21.59cm;
          margin: 0 auto;
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
        
        .highlight-yellow {
          background-color: #FFFF00;
          padding: 1px 3px;
        }
        
        .highlight-blue {
          background-color: #00B0F0;
          color: #000;
          padding: 1px 3px;
        }
        
        .highlight-red {
          background-color: #FF0000;
          color: #fff;
          padding: 1px 3px;
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
        PROMESA DE COMPRAVENTA<br />
        APARTAMENTO {getVal('Apartamento')}<br />
        COMPLEJO DE APARTAMENTOS "BRAVANTE"
      </div>

      {/* Contenido Principal */}
      <div className="section-spacing">
        <p>
          Yo, <span className="party-name">VENANCIO GÓMEZ</span> (único apellido), quien declaro ser de cincuenta y cinco
          años de edad, casado, Contador Público y Auditor, guatemalteco, de este domicilio, me identifico con el
          Documento Personal de Identificación -DPI- con Código Único de Identificación -CUI- dos mil quinientos
          cuarenta, setenta y nueve mil doscientos veintinueve, mil cuatrocientos uno (2540 79229 1401), extendido por
          el Registro Nacional de las Personas de la República de Guatemala, comparezco en mi calidad de <span
            className="party-name">ADMINISTRADOR ÚNICO Y REPRESENTANTE LEGAL</span> de la entidad <span
              className="party-name">BRAVANTE, SOCIEDAD ANÓNIMA</span> calidad que acredito con mi nombramiento como tal
          contenido en el acta notarial autorizada en esta ciudad el veintisiete de octubre de dos mil veinticinco, por
          la Notaria Lilian Elizabeth Azurdia Pérez de Quiroz, el cual se encuentra debidamente inscrito en el
          Registro Mercantil General de la República de Guatemala bajo el número de registro ochocientos doce mil
          veintisiete (812027), folio quinientos cuarenta y cuatro (544), del libro ochocientos cincuenta y tres (853)
          de Auxiliares de Comercio, entidad en adelante referida simple e indistintamente como <span
            className="party-name">"LA PARTE PROMITENTE VENDEDORA"</span> o <span className="party-name">"LA PROMITENTE
              VENDEDORA"</span>;
        </p>

        <p>
          Yo, <span className="highlight-yellow">{getVal('Nombre')}</span>, quien declaro ser de <span
            className="highlight-yellow">{getVal('Edad')}</span> años de edad, <span className="highlight-yellow">{getVal('EstadoCivil')}</span>,
          <span className="highlight-yellow">{getVal('Profesion')}</span>, guatemalteco, de este domicilio, me identifico con el
          Documento Personal de Identificación -DPI-, con Código Único de Identificación -CUI- número <span
            className="highlight-yellow">{getVal('DPI')}</span> (), extendido por el Registro Nacional de las Personas de
          la República de Guatemala; en adelante referido simple e indistintamente como <span className="party-name">"LA
            PARTE PROMITENTE COMPRADORA"</span>, <span className="party-name">"LOS PROMITENTES COMPRADORES"</span> o
          <span className="party-name">"EL PROMITENTE COMPRADOR"</span>.
        </p>

        <p>
          Los comparecientes, en las calidades con que actuamos de forma voluntaria manifestamos ser de los datos de
          identificación y generales aquí consignados, hallarnos en el libre ejercicio de nuestros derechos civiles,
          tener suficientes facultades para el otorgamiento de este acto, por lo que otorgamos <span
            className="party-name">CONTRATO DE PROMESA DE COMPRAVENTA DE BIENES INMUEBLES Y BIEN MUEBLE (ACCIÓN)</span>
          contenido en las siguientes cláusulas:
        </p>
      </div>

      {/* Cláusula Primera */}
      <div className="section-spacing">
        <p>
          <span className="clause-title">PRIMERA: ANTECEDENTES.</span> Yo, <span className="party-name">VENANCIO GÓMEZ</span>
          (único apellido), en representación de la entidad <span className="party-name">BRAVANTE, SOCIEDAD
            ANÓNIMA</span>, manifiesto que mi representada, está desarrollando la construcción del Proyecto de
          Apartamentos denominado <span className="party-name">"BRAVANTE"</span> ubicado en Finca Cumbres de Vista
          Hermosa, Zona 5 del municipio de Santa Catarina Pinula, departamento de Guatemala, a quien de acá en
          adelante denominaremos "El Proyecto". El Proyecto contará con dos torres de nueve niveles cada una, más
          cuatro sótanos, y estará distribuido de la siguiente forma: <span className="bold">a) Cuatro niveles de
            sótanos</span> los cuales serán utilizados para estacionamientos de vehículos, distribuidos así: <span
              className="bold">i) Sótano uno:</span> El cual quedará a nivel de calle, este será utilizado para
          estacionamiento de vehículos de propietarios y visitas. <span className="bold">ii) Sótanos dos, tres y
            cuatro:</span> Estos son subterráneos los tres, pero por temas de topografía, el sótano dos quedará en
          algún área a nivel de calle, y será utilizado exclusivamente para el estacionamiento de vehículos de los
          propietarios de los apartamentos del edificio, así como bodegas en los sótanos
        </p>
      </div>

      {/* Continuación de Cláusula Primera */}
      <div className="section-spacing">
        <p>
          uno, dos y cuatro; y parqueos para motos en el sótano cuatro. y <span className="bold">b) Del primero hasta el
            noveno nivel,</span> los cuales serán destinados exclusivamente a apartamentos para vivienda y áreas de
          circulación peatonal, áreas de servicio y soporte a los mismos. El <span className="bold">Proyecto</span> tiene
          planificado contar con aproximadamente noventa y cinco (95) unidades de apartamentos, es decir, cuarenta y
          siete (47) unidades de apartamentos en la torre número uno y cuarenta y ocho (48) unidades de apartamentos
          en la torre número dos, pudiendo variar el número de apartamentos en más o menos diez apartamentos, a
          criterio de la Promitente Vendedora. El <span className="bold">Proyecto</span> contará además con lo siguiente:
          <span className="bold">a)</span> Cuatro elevadores en total, dos por cada torre. <span className="bold">b)</span>
          Servicio de agua. El agua será suministrada por pozo externo el Edificio, propiedad de la entidad
          SERVIBOSQUES, SOCIEDADA ANÓNIMA. Así mismo, el edificio contará con cisterna de concreto. Es relevante
          mencionar que el agua de dicho pozo no será potable, por lo que la <span className="bold">Promitente
            Compradora</span> deberá potabilizar el agua para su consumo. <span className="bold">c)</span> La
          electricidad será suministrada por la Empresa Eléctrica de Guatemala, Sociedad Anónima, siendo la Promitente
          Compradora la responsable de la contratación y pago de su servicio en forma directa para su apartamento, y
          el edificio contará con una planta eléctrica de emergencia para suministro de energía a áreas comunes, los
          cuales son pasillos, elevadores y lobby del edificio. <span className="bold">d)</span> Contará con gabinetes con
          extintores de incendios en cada nivel. <span className="bold">e)</span> Sistema de control de acceso en ingreso
          vehicular. Circuito cerrado en áreas comunes y lobbies. <span className="bold">f)</span> Tuberías para las
          instalaciones eléctricas, hidráulicas, sanitarias y otras debidamente ocultas, con sus respectivas cajas y
          placas correspondientes a dichos servicios, a ubicarse en pasillos y áreas de los apartamentos, en sótanos
          las mismas serán expuestas. <span className="bold">g)</span> Sistema de drenajes pluviales y aguas negras, así
          como planta de tratamiento de aguas residuales de uso ordinario. Los Edificios podrán denominarse de la
          siguiente forma, para la torre número uno <span className="bold">"IGNEA"</span>, y para la torre número dos
          <span className="bold">"ETEREA"</span>, los cuales serán sometidos al régimen de propiedad horizontalmente
          dividida y su respectivo reglamento, así como estarán sujetos a las servidumbres que la promitente vendedora
          considere para el proyecto, y del cual formarán parte, entre otros: El apartamento <span
            className="highlight-yellow">_____ (__)</span> Torre <span className="highlight-yellow">_______</span>, ubicado en el
          nivel <span className="highlight-yellow">_____ (___)</span> del Complejo; <span className="highlight-red">las _____ ( )
            plazas de estacionamiento identificadas con los números:</span>
        </p>

        <div className="letter-list" style={{ listStyleType: 'none' }}>
          <div className="letter-item"><span className="highlight-red">o _______ (___), ubicada en el sótano número: _________
            (__);</span></div>
          <div className="letter-item"><span className="highlight-red">o _______ (___), ubicada en el sótano número: _________
            (__);</span></div>
          <div className="letter-item"><span className="highlight-red">o _______ (___), ubicada en el sótano número: _________
            (__);</span></div>
          <div className="letter-item"><span className="highlight-red">o _______ (___), ubicada en el sótano número: _________
            (__);</span></div>
        </div>
      </div>

      <div className="section-spacing">
        <p>
          y las <span className="highlight-red">____ (__)</span> bodegas, identificadas con los números:
        </p>
        <div className="letter-list" style={{ listStyleType: 'none' }}>
          <div className="letter-item"><span className="highlight-red">o _______ (___), ubicada en el sótano número: _________
            (__);</span></div>
          <div className="letter-item"><span className="highlight-red">o _______ (___), ubicada en el sótano número: _________
            (__);</span></div>
          <div className="letter-item"><span className="highlight-red">o _______ (___), ubicada en el sótano número: _________
            (__);</span></div>
        </div>

        <p>
          así como el título de acción correspondiente y relacionado al proyecto. La denominación de dicho complejo
          podrá variar al constituirse el referido Régimen.
        </p>
      </div>

      {/* Cláusula Segunda */}
      <div className="section-spacing">
        <p>
          <span className="clause-title">SEGUNDA: PROMESA DE COMPRAVENTA.</span> LA PARTE PROMITENTE VENDEDORA, <span
            className="highlight-yellow">manifiesto que por el presente instrumento prometo vender a {getVal('Nombre')}</span>
          los bienes indicados en la cláusula que antecede, que se describen así: <span className="bold">a)</span> El
          apartamento identificado como Apartamento <span className="highlight-yellow">{getVal('Apartamento')}</span> Torre <span
            className="highlight-yellow">{getVal('Torre')}</span>, ubicado en el nivel <span className="highlight-yellow">{getVal('Nivel')}</span>
          del Complejo; apartamento que consta de <span
            className="highlight-yellow">{getVal('Habitaciones')}</span> habitaciones, <span className="highlight-yellow">{getVal('DescripcionApartamento', '________________________________________________________________________')}</span>
        </p>

        <p>
          Y contará con un área aproximada de <span className="highlight-yellow">______________</span> metros cuadrados
          (<span className="highlight-yellow">____</span> m2) de construcción; <span className="highlight-red">b) ____ plazas
            de estacionamiento identificadas con los números ____________ (_____), __________ (____), __________(___) y ____________ (___),
            los cuales están ubicados en los sótanos ____(___), ____(___) y _____(____), y cuentan con un área aproximada de _______ metros cuadrados
            (___ m2); c) Una terraza o balcón , con un área aproximada de __________ punto _______ y un metros cuadrados
            (____.__ m2); y d)</span> El bien mueble (acción) de la entidad relacionada y pertinente al proyecto.
        </p>

        <p>
          Los acabados y equipamiento estándar con los que contará el apartamento son los siguientes:
        </p>

        <div style={{ marginLeft: 0 }}>
          <p style={{ marginBottom: '5px' }}>- Acabado alisado en paredes y cielos más pintura blanca;</p>
          <p style={{ marginBottom: '5px' }}>- Piso de madera de ingeniería en habitaciones;</p>
          <p style={{ marginBottom: '5px' }}>-Azulejo de porcelanato, colocados en área de piso, paredes de duchas y
            respaldo de artefactos;</p>
          <p style={{ marginBottom: '5px' }}>- Mamparas de vidrio en duchas de baño, según diseño;</p>
          <p style={{ marginBottom: '5px' }}>- Puertas lisas enchapadas en madera con marcos completos;</p>
          <p style={{ marginBottom: '5px' }}>- Cerradura principal tipo manija satinadas y chapa digital;</p>
          <p style={{ marginBottom: '5px' }}>- Cerraduras tipo manija satinadas;</p>
          <p style={{ marginBottom: '5px' }}>- Zócalo de PVC imitación madera de diez centímetros (10cm.);</p>
          <p style={{ marginBottom: '5px' }}>- Ventanería de aluminio línea europea con vidrio laminado para aislamiento
            acústico, de ocho milímetros (8mm);</p>
          <p style={{ marginBottom: '5px' }}>- Inodoros "one piece" doble descarga;</p>
          <p style={{ marginBottom: '5px' }}>- Grifería cromada en duchas;</p>
          <p style={{ marginBottom: '5px' }}>- Lavamanos blanco con grifo cromado y gabinete de melamina;</p>
          <p style={{ marginBottom: '5px' }}>- Gabinetes de cocina en melamina con top de cuarzo, según diseño;</p>
          <p style={{ marginBottom: '5px' }}>- Lavatrastos inoxidable con grifo cromado;</p>
          <p style={{ marginBottom: '5px' }}>- Closets completos en melamina, según diseño;</p>
          <p style={{ marginBottom: '5px' }}>- Luminarias empotra bables en cielo Led, según diseño eléctrico;</p>
          <p style={{ marginBottom: '5px' }}>- Placas de interruptores y tomacorrientes blancas;</p>
          <p style={{ marginBottom: '5px' }}>- Calentador de agua eléctrico;</p>
        </div>

        <p style={{ marginTop: '15px' }}>
          Los adquirentes tendrán derecho a utilizar las áreas o amenidades comunes con las que contará el proyecto
          "Bravante".
        </p>

        <p>
          El inmueble ofrecido en este compromiso de compraventa, soportará las servidumbres que se detallan en el
          Régimen de Propiedad Horizontal que BRAVANTE, SOCIEDAD ANÓNIMA, ha definido con el objeto de darle armonía,
          orden y uniformidad al proyecto, principalmente en cuanto al uso de áreas comunes, reglas de convivencia y
          cuotas que se fijen.
        </p>

        <p>
          Manifestamos las partes que aceptamos que el área de los bienes objeto de este contrato podrá variar en más
          o menos hasta en un dos por ciento (2%).
        </p>
      </div>

      {/* Continuación - Página 4 */}
      <div className="section-spacing">
        <p>
          Es convenido por las partes que la promesa de compraventa constituye una obligación conjunta, en el
          entendido que LA PARTE PROMITENTE VENDEDORA no cumple si no vende todos los bienes inmuebles y el bien
          mueble (acción) antes mencionados y la PARTE PROMITENTE COMPRADORA tampoco cumple si no compra todos los
          bienes inmuebles y el bien mueble (acción) antes mencionados en su conjunto. La PARTE PROMITENTE COMPRADORA
          prometo comprar dichos bienes inmuebles y bien mueble (acción) en su conjunto, y ambas partes manifestamos
          que la promesa de compraventa y la compraventa futura, están sujetas a las estipulaciones y condiciones que
          se expresan en este contrato.
        </p>
      </div>

      {/* Cláusula Tercera */}
      <div className="section-spacing">
        <p>
          <span className="clause-title">TERCERA:</span> La promesa de compraventa que se otorga en este acto se sujetará
          a las estipulaciones siguientes: <span className="bold">I) PRECIO:</span> El precio total de la compraventa de
          los bienes prometidos en venta descritos en la cláusula que antecede es de <span
            className="highlight-yellow">{getVal('PrecioLetras')} DÓLARES DE LOS ESTADOS UNIDOS DE NORTE AMÉRICA (USD.
            {getVal('PrecioNumeros')})</span>, el cual incluye el IMPUESTO AL VALOR AGREGADO y el IMPUESTO DEL TIMBRE
          correspondiente; para lo cual en su momento se podrán redactar dos documentos, el de la compraventa de
          inmuebles y el de la compraventa de mueble (acción), cada uno con su precio correspondiente. <span
            className="bold">II) VARIACIÓN DEL PRECIO.</span> Manifiesto como la Promitente Compradora que acepto de
          forma expresa que en caso de nuevas leyes que regulen nuevos impuestos relacionados con el objeto de este
          contrato y su respectiva construcción o se aumenten los existentes, acepto que en esa misma medida y
          proporción se aumentará el valor de los bienes prometidos en venta, siempre que se acredite fehacientemente
          el aumento en que dichas disposiciones han afectado al precio pactado, aceptando consecuentemente dicha
          variación como valor a cancelar de los bienes objeto de esta promesa, cuyo pago se hará conforme y en
          conjunto al precio antes establecido y según lo que se establece en el presente contrato. <span
            className="bold">III) MONEDA DE PAGO:</span> Las partes libre y expresamente pactamos que el precio de este
          contrato se pague en Dólares de los Estados Unidos de Norte América. No obstante, la PARTE PROMITENTE
          COMPRADORA, mediante previa autorización por escrito de la PARTE PROMITENTE VENDEDORA, podrá efectuar el
          pago en Quetzales, para cuyo efecto la PARTE PROMITENTE COMPRADORA autorizó a la PROMITENTE VENDEDORA a
          aplicar la tasa de cambio referencial para la VENTA de dólares de los Estados Unidos de América que publique
          el Banco Agromercantil de Guatemala, Sociedad Anónima, el día en que deba efectuarse el pago. <span
            className="bold">IV) FORMA DE PAGO.</span> LA PARTE PROMITENTE COMPRADORA pagare el valor de los bienes
          prometidos en venta de la siguiente forma:
        </p>

        <p>
          <span className="bold">a)</span> Un primer pago por la cantidad de <span className="highlight-yellow">{getVal('ReservaLetras')}
            DÓLARES DE LOS ESTADOS UNIDOS DE NORTE AMÉRICA (USD. {getVal('ReservaNumeros')})</span> en concepto de reserva, que Yo,
          la parte Promitente Vendedora manifiesto que tengo recibido a mi entera satisfacción.
        </p>

        <p>
          <span className="bold">b)</span> Un segundo pago por la cantidad total de <span
            className="highlight-yellow">{getVal('SegundoPagoLetras')} DÓLARES DE LOS ESTADOS UNIDOS DE NORTE AMÉRICA (USD.
            {getVal('SegundoPagoNumeros')})</span>, que la parte Promitente Compradora entregará mediante <span className="highlight-red">{getVal('CantidadPagosLetras')} ({getVal('CantidadPagosNumeros')}) pagos a la Promitente Vendedora, de la siguiente forma:</span>
        </p>

        <p>
          <span className="highlight-red">1) El día {getVal('Pago1_Dia', '____')} de {getVal('Pago1_Mes', '_________')} de 202{getVal('Pago1_Anio', '_')}, la cantidad de {getVal('Pago1_Monto', '______')} Dólares de los Estados Unidos de Norte América (USD.{getVal('Pago1_Monto_Num', '_______')}).</span>
        </p>

        <p>
          <span className="highlight-red">2) El día {getVal('Pago2_Dia', '___')} de {getVal('Pago2_Mes', '_______')} de 202{getVal('Pago2_Anio', '_')}, la cantidad de {getVal('Pago2_Monto', '______')} Dólares de los Estados Unidos de Norte América (USD.{getVal('Pago2_Monto_Num', '_______')}).</span>
        </p>

        <p>
          <span className="highlight-red">3) El día {getVal('Pago3_Dia', '___')} de {getVal('Pago3_Mes', '_______')} de 202{getVal('Pago3_Anio', '_')}, la cantidad de {getVal('Pago3_Monto', '______')} Dólares de los Estados Unidos de Norte América (USD.{getVal('Pago3_Monto_Num', '_______')}).</span>
        </p>

        <p style={{ marginTop: '15px' }}>
          y c) Un último pago por la cantidad de <span className="highlight-red">{getVal('UltimoPagoLetras')} DOLARES DE LOS ESTADOS UNIDOS DE NORTE AMÉRICA (USD.{getVal('UltimoPagoNumeros')})</span> que Yo, LA PARTE PROMITENTE COMPRADORA deberé pagar a
          LA PARTE PROMITENTE VENDEDORA a más tardar al vencimiento del plazo de la presente promesa; pago que Yo, LA
          PARTE PROMITENTE COMPRADORA realizaré con los fondos que me serán desembolsados en virtud de un crédito
          hipotecario que gestionaré ante un Banco del sistema nacional para la adquisición de los bienes objeto de este
          contrato. Es una condición para el cumplimiento de la presente promesa que al momento de otorgarse la
          escritura de compraventa respectiva esté pagado el total del valor de los bienes objeto de este contrato
          conforme lo aquí pactado. <span className="bold">V) LUGAR DE PAGO.</span> LA PARTE PROMITENTE COMPRADORA deberé
          efectuar los pagos en las oficinas de LA PARTE PROMITENTE VENDEDORA, ubicadas en Boulevard Rafael Landívar,
          10-05, zona 16, Paseo Cayalá, Edificio D-1, 2do. Nivel, Guatemala, Guatemala, las cuales son del
          conocimiento de la Parte Promitente Compradora, sin necesidad de cobro o requerimiento alguno, o de
          cualquier forma o en cualquier otra dirección que me comunique en su momento y por escrito la PROMITENTE
          VENDEDORA, o por medio de transferencia bancaria, a la cuenta de la PROMITENTE VENDEDORA. Los pagos los
          deberé efectuar la parte promitente compradora en días y horas hábiles. En el caso que el día de pago fuere
          un día inhábil, el pago lo efectuaré la parte promitente compradora el día hábil siguiente. <span
            className="bold">VI) MORA.</span> Si existe atraso en efectuar cualquiera de los pagos antes indicados en la
          forma y plazo aquí acordados, LA PARTE PROMITENTE COMPRADORA reconozco y me obligo a pagar a la PARTE
          PROMITENTE VENDEDORA un interés del TRES por ciento (3 %) mensual sobre el saldo vencido calculado a partir
          del día siguiente en que debió efectuarse el pago hasta la fecha en que efectivamente se realice el pago
          adeudado. Asimismo, por cada cheque rechazado la PARTE PROMITENTE COMPRADORA me obligo a cancelar la
          cantidad de QUINIENTOS QUETZALES EXACTOS (Q. 500.00) en concepto de gastos administrativos generados por tal
          hecho. <span className="bold">VII) DE LOS GRAVÁMENES.</span> LA PARTE PROMITENTE VENDEDORA traspasaré los bienes
          libres de gravámenes, limitaciones y/o anotaciones, salvo aquellas que fueren necesarios para el proyecto a
          desarrollar, tales como las servidumbres y régimen de propiedad horizontal y su respectivo reglamento al
          cual estará sometido el Edificio al que pertenecen los bienes objeto de este contrato. <span
            className="bold">VIII) GASTOS.</span> Los honorarios profesionales, gastos y aranceles de registro en que se
          incurra para el presente contrato y la futura compraventa correrán por cuenta de LA PARTE PROMITENTE
          COMPRADORA, los cuales no se encuentran incluidos dentro del valor de la compraventa prometida; estos
          deberán ser cancelados en su totalidad al momento de la formalización de la compraventa prometida en este
          documento. A partir de la fecha de suscripción del contrato de compraventa prometido, serán a cargo
          exclusivo de LA PARTE PROMITENTE COMPRADORA los gastos correspondientes a Impuesto Único Sobre Inmuebles
          (IUSI), impuestos inmobiliarios, territoriales y cualquier otro impuesto, o arbitrio en general no
          especificado aquí o cualquier otro que se cree en el futuro, aplicables a los bienes objeto de este contrato,
          así como mantenimiento y gastos comunes de los bienes objeto de esta promesa que fije el propietario o administración
          del edificio, de igual manera, LA PARTE PROMITENTE COMPRADORA me obligo desde ya a pagar los montos correspondientes
          al mantenimiento mensual los cuales corresponderán a la Administración propia de BRAVANTE o bien quien ejerza la
          administración del mismo. Dicho monto está sujeto a cambio según lo considere la Administración de los Condominios.
          <span className="bold">IX) HONORARIOS Y GASTOS.</span> Los honorarios notariales y gastos de inscripción que causen
          este documento y la futura compraventa, correrán por cuenta de la PARTE PROMITENTE COMPRADORA, los cuales No se
          encuentran incluidos dentro del monto de la compraventa prometida, debiendo ser LA PARTE PROMITENTE VENDEDORA quien
          designe el Notario que autorice todos los documentos y escrituras públicas relacionadas directa o indirectamente
          con el presente contrato. El precio aquí pactado No incluye los gastos y honorarios correspondientes a la
          autorización del presente contrato y la compraventa prometida. La PARTE PROMITENTE COMPRADORA renuncio expresamente
          a mi derecho de elección del notario autorizante de la escritura de compraventa definitiva y/o de cualquier otro
          documento o escritura pública relacionada directa o indirectamente con el presente contrato, y acepto al notario
          designado por la PARTE PROMITENTE VENDEDORA. <span className="bold">X) PLAZO.</span> El plazo del presente contrato
          de Promesa de Compraventa es de <span className="highlight-yellow">{getVal('PlazoMesesLetras')} ({getVal('PlazoMesesNumeros')})</span> meses. <span className="bold">XI) ENTREGA.</span>
          La entrega y recepción de los bienes objeto de la presente promesa de compraventa se realizará al momento de la
          firma de la escritura traslativa de dominio en la fecha aquí pactada, es decir, a la fecha del vencimiento del
          plazo del presente contrato, lo cuál sería en el mes de <span className="highlight-yellow">{getVal('MesEntrega')} de dos mil veintiocho ({getVal('AnioEntrega', '2028')})</span>.
          No obstante, las partes podremos suscribir el contrato prometido antes de la fecha aquí indicada si ambas partes
          así lo acordaremos y estuviéremos en posibilidad de hacerlo. La PARTE PROMITENTE COMPRADORA tendré por recibido
          a mi entera satisfacción los bienes a partir de ese momento. La PARTE PROMITENTE COMPRADORA seré la única y exclusiva
          responsable por pérdidas materiales, o por los daños y perjuicios que sufra ésta, sus empleados, familiares, o
          personas individuales que habiten el inmueble, a partir que reciba el apartamento por parte de la PARTE
          PROMITENTE VENDEDORA. No obstante lo aquí pactado, las partes de común acuerdo pactamos que la entrega de los
          bienes y el plazo del presente contrato podrá diferirse por un plazo de ocho meses adicionales y posteriores a
          la fecha de entrega antes establecida, sin responsabilidad para la PARTE PROMITENTE VENDEDORA. Estos plazos son
          sin perjuicios de atraso por caso fortuito o fuerza mayor que afecte el cumplimiento y siempre que la parte
          promitente compradora cumpla con todas y cada una de mis obligaciones y con efectuar los pagos en las fechas
          indicadas. El plazo puede ser prorrogable por mutuo acuerdo de las partes. Asimismo, pactamos las partes que en
          caso de imposibilidad al desarrollo del presente proyecto en virtud de retraso excesivo de las autorizaciones
          gubernamentales respectivas, LA PARTE PROMITENTE VENDEDORA, deberé notificar tal acontecimiento a la PARTE
          PROMITENTE COMPRADORA y deberé devolver el cien por ciento (100%) del monto efectivamente recibido sumado a un
          interés anual del tres por ciento (3%) en concepto de daños y perjuicios, calculado de la siguiente forma: Por
          cada pago recibido por LA PARTE PROMITENTE VENDEDORA y efectivamente disponible, a partir de ese día se calculará
          el interés, el cual no será capitalizable; calculándose el intereses sobre cada pago efectivamente recibido;
          sujeto al plazo y forma que se estipula más adelante en este contrato, renunciando desde ya LA PARTE PROMITENTE
          COMPRADORA a cualquier otro reclamo judicial o extrajudicial por tal concepto. <span className="bold">XII) REGIMEN DE PROPIEDAD HORIZONTAL.</span>
          LA PARTE PROMITENTE COMPRADORA declaro estar enterada y desde ya acepto que los bienes que por este acto prometo
          comprar serán destinados únicamente para vivienda familiar, asimismo, que dichos bienes estarán sometidos a
          Régimen de Propiedad Horizontal, y por lo tanto, acepto desde ya cumplir con el mismo y con los reglamentos y
          demás normas legales del mismo, así como, con los reglamentos y normas del “CONDOMINIO BRAVANTE”, dado que los
          inmuebles prometidos en venta se encuentran dentro del perímetro del mismo; y en especial, con las obligaciones
          de pagos de cuotas de mantenimientos y condiciones para la reventa o alquiler de los inmuebles, los cuales son
          de mi conocimiento. <span className="bold">XIII) PLANOS Y CAMBIOS EN LA CONSTRUCCIÓN:</span> LA PARTE PROMITENTE
          COMPRADORA declaro expresamente que conozco y acepto los planos de distribución interna de ambientes así como
          acabados, distribución, diseño y no podré solicitar que se hagan modificaciones o adiciones a los planos y
          especificaciones antes mencionados, salvo que éstas fueran aprobadas previamente por LA PARTE PROMITENTE
          VENDEDORA y que el valor de las modificaciones o adiciones, sea pagado en su totalidad por mí como LA PARTE
          PROMITENTE COMPRADORA, antes de que se lleven a cabo las mismas. Así mismo LA PROMITENTE VENDEDORA, me reservo
          el derecho de realizar nuevos cambios en las especificaciones contenidas en este contrato si así conviene a la
          arquitectura, estructura y funcionamiento del proyecto, o si fuera necesario porque algún elemento o material
          no puede obtenerse en cantidad suficiente dentro del periodo de construcción, o que dicho cambio sea requerido
          por alguna autoridad estatal, municipal o administrativa. <span className="bold">XIV) DE LA ACCIÓN.</span> LA PARTE
          PROMITENTE COMPRADORA declaro estar de acuerdo que el bien mueble (acción) que por el presente acto se me
          promete vender, que sea de una entidad de carácter mercantil y/o civil indistintamente, o bien, la misma
          se relacione tanto a la administración del proyecto antes relacionado o a las áreas comunes indistintamente;
          todo lo anterior a elección y según disposición de la PARTE PROMITENTE VENDEDORA.
        </p>
      </div>

      {/* Cláusula Cuarta */}
      <div className="section-spacing">
        <p>
          <span className="clause-title">CUARTA: TERMINACIÓN ANTICIPADA.</span> Sin perjuicio de otros derechos que
          correspondan a LA PARTE PROMITENTE VENDEDORA conforme este contrato, la PARTE PROMITENTE VENDEDORA podrá
          resolver en cualquier momento el presente contrato, sin necesidad de declaración judicial previa o
          posterior, y dar por terminado en forma anticipada el mismo sin responsabilidad de mi parte, si LA PARTE
          PROMITENTE COMPRADORA no cumple con una sola de sus obligaciones de pago en la fecha, monto y forma aquí
          pactados, dicho incumplimiento constituirá una condición resolutoria expresa de este contrato. En caso
          ocurra el hecho constitutivo de la condición resolutoria expresa, La PARTE PROMITENTE VENDEDORA tengo el
          derecho de disponer de los bienes objetos de este contrato en cualquier forma y podré negociar, prometer en
          venta, vender o ceder los mismos a un tercero, sin que haya necesidad que preceda orden o resolución
          judicial o autorización alguna de LA PARTE PROMITENTE COMPRADORA, procediéndose de conformidad con lo
          expuesto en las cláusulas subsiguientes especialmente lo relacionado al cumplimiento del pago
          indemnizatorio. Este contrato también podrá darse por terminado por decisión unilateral de la PARTE
          PROMITENTE VENDEDORA, o de la parte PROMITENTE COMPRADORA, sin necesidad de justificar causa alguna, pero en
          todo caso, las partes se obligan al cumplimiento del pago indemnizatorio regulado en las cláusulas
          siguientes. De igual manera, en caso que la PARTE PROMITENTE COMPRADORA, durante el plazo del presente
          contrato fuere sujeto de procesos judiciales de cualquier índole o naturaleza que conlleve la posibilidad de
          concluir con sentencia alguna de índole condenatoria que afecte mi libertad y/o capacidad de pago, por el
          presente acto confiero facultad especial a LA PARTE PROMITENTE VENDEDORA para resolver el presente contrato
          sin responsabilidad indemnizatoria y/o legal alguna sujetándome al procedimiento de devolución de los montos
          dados en concepto de enganche, según lo estipulado en el presente contrato en cuanto a la forma y plazo.
        </p>
      </div>

      {/* Cláusula Quinta */}
      <div className="section-spacing">
        <p>
          <span className="clause-title">QUINTA: CLAUSULA INDEMNIZATORIA DE LA PARTE PROMITENTE VENDEDORA.</span> Las
          partes renunciamos expresamente a la aplicación del artículo un mil cuatrocientos cuarenta y dos (1,442) del
          Código Civil vigente, de manera que los pagos recibidos a cuenta del precio no constituirán el equivalente a
          los daños y perjuicios, ni la PARTE PROMITENTE VENDEDORA estaré en la obligación de restituir el doble de lo
          que hubiese recibido. En relación a daños y perjuicios resultantes de la inejecución a falta de cumplimiento
          del contrato, las partes manifestamos que se regulará la relación contractual de conformidad con lo que se
          establece en ésta y la siguiente cláusula. El incumplimiento o el retardo en el cumplimiento por parte de
          PROMITENTE VENDEDORA, se regirá por las estipulaciones siguientes, pero cobrarán efecto, sí y solo sí la
          PARTE PROMITENTE COMPRADORA he cumplido a cabalidad y en tiempo con mis obligaciones de pago. Si la Parte
          Vendedora decido resolver el presente contrato sin justificar causa alguna o sin haber sido motivado por la
          condición resolutoria expresa, deberé devolver a la parte PROMITENTE COMPRADORA los montos recibidos a
          cuenta del precio del apartamento sumado a un interés anual del tres por ciento (3%) en concepto de daños y
          perjuicios, en un plazo no mayor, de seis (6) meses a partir de la fecha que se le notifique a la parte
          PROMITENTE COMPRADORA, calculado de la siguiente forma: Por cada pago recibido por LA PARTE PROMITENTE
          VENDEDORA y efectivamente disponible, a partir de ese día se calculará el interés, el cual no será
          capitalizable; calculándose el intereses sobre cada pago efectivamente recibido.
        </p>
      </div>

      {/* Cláusula Sexta */}
      <div className="section-spacing">
        <p>
          <span className="clause-title">SEXTA: CLÁUSULA INDEMNIZATORIA DE LA PARTE PROMITENTE COMPRADORA.</span> En caso
          de incumplimiento por parte de LA PARTE PROMITENTE COMPRADORA, dará derecho A LA PARTE PROMITENTE VENDEDORA
          a proceder de la siguiente forma: 1) a dar por concluida la negociación sin ningún tipo de procedimiento
          posterior y 2) cobrar por concepto de indemnización y perjuicios, los siguientes montos en los siguientes
          casos:
        </p>
        <div className="indented">
          <p>
            A. Desistir de la compra, encontrándose ya en trámite de análisis de crédito, o por ser denegado por la
            entidad Bancaria o Financiera, DIEZ MIL DOLARES DE LOS ESTADOS UNIDOS DE NORTE AMERICA. (UDS.10,000.00).
          </p>
          <p>
            B. El cinco por ciento (5%) del valor total de la compraventa pactada en la promesa de compraventa de
            bienes inmuebles y mueble (acción) por desistir de la compra encontrándose el expediente ya aprobado por
            cualquier entidad bancaria o financiera.
          </p>
          <p>
            C. El cinco por ciento (5%) del valor total de la compraventa pactada en la promesa de compraventa de
            bienes inmuebles y mueble (acción) más un fee de CINCO MIL DOLARES DE LOS ESTADOS UNIDOS DE NORTE
            AMERICA (UDS.5,000.00), por desistir de la compra después de haber pedido cambios y mejoras en el
            inmueble y estos se hubieran ya realizado, siendo No reintegrable el monto pagado por las mejoras ya
            realizadas.
          </p>
          <p>
            D. En compras de contado, se penalizará de la siguiente forma:
          </p>
          <div style={{ marginLeft: '20px' }}>
            <p>
              I. Por desistimiento después de haber firmado la promesa de compraventa de bienes inmuebles y
              muebles acción, se penalizará con un cinco por ciento (5%), del valor de lo prometido en
              compraventa.
            </p>
            <p>
              II. El cinco por ciento (5%) del valor total de la compraventa pactada en la promesa de compraventa de
              bienes inmuebles y mueble (acción) más un fee de CINCO MIL DOLARES DE LOS ESTADOS UNIDOS DE NORTE
              AMERICA (UDS.5,000.00), por desistir de la compra después de haber pedido cambios y mejoras en el
              inmueble y estos se hubieran ya realizado, siendo No reintegrable el monto pagado por las mejoras ya
              realizadas.
            </p>
          </div>
        </div>
        <p>
          El desistimiento por cualquier otra razón no contemplada en los presentes incisos será revisado directamente
          por el Consejo Administrativo de la entidad vendedora, quien asignará la penalización en relación a la causa
          del desistimiento, acordando desde ya que en ningún caso podrá ser menor de CUATRO MIL DOLARES DE LOS ESTADOS
          UNIDOS DE NORTE AMERICA (UDS.4,000.00).
        </p>
        <p>
          En todos los casos anteriores, la penalización se descontará directamente del monto del enganche o reserva
          que el cliente hubiera cancelado a la fecha del desistimiento, acordando las partes que el plazo para el
          reintegro del saldo a favor DE LA PARTE PROMITENTE COMPRADORA, deberá realizarse en un plazo no mayor a seis
          (6) meses, a partir de la fecha del desistimiento o aplicación de la penalización.
        </p>
      </div>

      {/* Cláusula Séptima */}
      <div className="section-spacing">
        <p>
          <span className="clause-title">SÉPTIMA: CESIÓN DE DERECHOS.</span> LA PARTE PROMITENTE COMPRADORA no podré
          negociar, ceder, enajenar, o de cualquier otra forma disponer de las obligaciones o derechos que adquiere en
          este contrato, salvo que cuente con la aprobación previa y por escrito de LA PARTE PROMITENTE VENDEDORA. LA
          PARTE PROMITENTE VENDEDORA, por mi parte, quedo en libertad de negociar, ceder, o enajenar los derechos y
          obligaciones que adquiero en este contrato, parcial o totalmente, dando posterior aviso a LA PARTE
          PROMITENTE COMPRADORA.
        </p>
      </div>

      {/* Cláusula Octava */}
      <div className="section-spacing">
        <p>
          <span className="clause-title">OCTAVA: PREEMINENCIA DEL PRESENTE CONTRATO.</span> EI PROMITENTE COMPRADOR Y EL
          PROMITENTE VENDEDOR manifestamos que el texto del contrato contenido en el presente documento privado,
          prevalecerá sobre cualquier otro documento o acuerdo, cotización, oral o escrito, respecto del objeto del
          presente contrato. Por consiguiente, los documentos que hubieren sido firmados con anterioridad por nosotros
          los otorgantes, carecerán de validez en todo lo que fueren contradictorios, incongruentes, estipulen
          condiciones distintas a lo pactado en este documento privado o que aparecieren contrarias a las intenciones
          de las partes contratantes. Continuamos manifestando ambas partes que cualquier modificación, adhesión o
          anexo al presente contrato para que se considere parte integrante del mismo, debe de constar por escrito y
          firmado por ambas partes.
        </p>
      </div>

      {/* Cláusula Novena */}
      <div className="section-spacing">
        <p>
          <span className="clause-title">NOVENA: LUGAR PARA RECIBIR NOTIFICACIONES.</span> Para todos los efectos legales
          que correspondan, las partes contratantes señalamos como lugares para recibir toda clase de notificaciones,
          citaciones y emplazamientos, las direcciones: <span className="bold">a)</span> LA PARTE PROMITENTE COMPRADORA,
          la ubicada en <span className="highlight-yellow">{getVal('Direccion')}</span>, departamento de Guatemala; y, <span
            className="bold">b)</span> La PARTE PROMITENTE VENDEDORA, la ubicada en el Boulevard Rafael Landívar, diez
          guión cero cinco (10-05), zona dieciséis (16), Paseo Cayalá, Edificio D uno (D1) oficina doscientos dos
          (202) segundo nivel, del Municipio de Guatemala, Departamento de Guatemala. Cualquier cambio de dirección de
          cualquiera de las partes deberá avisarse por escrito con acuse de recepción a la otra, y en tanto no se
          haga, se tendrán por bien hechas las notificaciones, citaciones y emplazamientos que se efectúen en los
          lugares indicados.
        </p>
      </div>

      {/* Cláusula Décima */}
      <div className="section-spacing">
        <p>
          <span className="clause-title">DÉCIMA: CONFIDENCIALIDAD.</span> LA PARTE PROMITENTE COMPRADORA me obligo a
          mantener bajo estricta confidencialidad toda la información que en virtud del presente contrato le fuera
          suministrada por la PARTE PROMITENTE VENDEDORA, así como deberé mantener bajo esta misma reserva el texto de
          este contrato.
        </p>
      </div>

      {/* Cláusula Décima Primera */}
      <div className="section-spacing">
        <p>
          <span className="clause-title">DÉCIMA PRIMERA: CLAUSULA COMPROMISORIA.</span> Las partes contratantes convenimos
          en que de producirse cualquier controversia, conflicto o disputa entre nosotras, derivada directa o
          indirectamente de este contrato, de su interpretación y/o de su ejecución o cumplimiento, se resolverá en la
          forma siguiente: <span className="bold">a)</span> Mediante la vía directa, con o sin intermediación de un
          conciliador; <span className="bold">b)</span> De no ser posible la solución por la vía directa dentro de los
          tres meses siguientes de suscitado el conflicto, ambas partes renunciamos expresamente al fuero de nuestro
          domicilio y jurisdicción, y a la competencia de los tribunales de justicia de Guatemala, y mediante esta
          cláusula compromisoria acordamos desde ya someter la controversia, conflicto o disputa a un Arbitraje de
          Equidad de conformidad con el Reglamento de Conciliación y Arbitraje del <span className="bold">CENAC (Centro de
            Conciliación y Arbitraje de la Cámara de Comercio de Guatemala),</span> el cual las partes contratantes
          aceptamos desde ahora en forma irrevocable.
        </p>
        <p>
          Acordamos los contratantes que desde ya autorizamos al <span className="bold">CENAC</span> para que nombre al
          árbitro de conformidad con su reglamento, así mismo, acordamos que el arbitraje, se llevará a cabo en la
          Ciudad de Guatemala, en idioma español, y se decidirá por un solo árbitro. Adicionalmente, acordamos las
          partes contratantes que el <span className="bold">CENAC</span> será la institución encargada de administrar los
          procedimientos de conciliación y arbitraje según sea el caso, de conformidad
        </p>
        <p>
          con su normativa. El laudo arbitral no se podrá impugnar, y las partes aceptamos desde ya que constituirá
          título ejecutivo suficiente, perfecto y eficaz.
        </p>
      </div>

      {/* Cláusula Décima Segunda */}
      <div className="section-spacing">
        <p>
          <span className="clause-title">DÉCIMA SEGUNDA: ACEPTACIÓN:</span> En los términos expuestos y en las calidades
          con las que actuamos, los comparecientes declaramos la plena conformidad y aceptación con el contenido
          íntegro del presente contrato y luego de haberlo leído y bien enterados de su contenido, objeto, validez y
          efectos legales, lo ratificamos, aceptamos y firmamos, sin reserva alguna, el <span
            className="highlight-red">{getVal('FechaFirmaDia', '____')} de {getVal('FechaFirmaMes', '______________')} de dos mil veinte{getVal('FechaFirmaAnio', '_____')}</span>, quedando contenido el mismo
          en cuatro (4) hojas de papel bond, impresas en su lado anverso y reverso.
        </p>
      </div>

      {/* Firmas del Contrato */}
      <div style={{ marginTop: '50px' }}>
        <div className="signature-line"></div>
        <div className="signature-line"></div>
      </div>

      {/* Acta de Legalización */}
      <div className="section-spacing" style={{ marginTop: '40px' }}>
        <p>
          En la Ciudad de Guatemala el <span className="highlight-red">{getVal('FechaLegalizacionDia', '____')} de {getVal('FechaLegalizacionMes', '____')} de dos mil veinte{getVal('FechaLegalizacionAnio', '___')}</span>, Yo, el infrascrito Notario hago constar que las DOS
          firmas que anteceden calzan en un Contrato de Promesa de Compraventa de Bienes Inmuebles y Bien Mueble
          (Acción), y son auténticas por haber sido puestas en mi presencia el día de hoy por: <span className="bold">a)
            VENANCIO GÓMEZ</span> (único apellido), quien se identifica con el Documento Personal de Identificación
          -DPI- con Código Único de Identificación -CUI- dos mil quinientos cuarenta, setenta y nueve mil doscientos
          veintinueve, mil cuatrocientos uno (2540 79229 1401), extendido por el Registro Nacional de las Personas de
          la República de Guatemala, quien comparece en su calidad de <span className="bold">ADMINISTRADOR ÚNICO Y
            REPRESENTANTE LEGAL</span> de la entidad <span className="bold">BRAVANTE, SOCIEDAD ANÓNIMA</span> calidad
          que acredita con su nombramiento como tal contenido en el acta notarial autorizada en esta ciudad el
          veintisiete de octubre de dos mil veinticinco, por la Notaria Lilian Elizabeth Azurdia Pérez de Quiroz, el
          cual se encuentra debidamente inscrito en el Registro Mercantil General de la República de Guatemala bajo el
          número de registro ochocientos doce mil veintisiete (812027), folio quinientos cuarenta y cuatro (544), del
          libro ochocientos cincuenta y tres (853) de Auxiliares de Comercio; y <span className="bold">b) <span
            className="highlight-yellow">{getVal('Nombre')}</span></span>, quien se identifica con el
          Documento Personal de Identificación -DPI-, con Código Único de Identificación -CUI- número <span
            className="highlight-yellow">{getVal('DPI')} ({getVal('DPI_Letras')})</span> extendido por el Registro
          Nacional de las Personas de la República de Guatemala; quienes vuelven a firmar la presente acta, ante el
          infrascrito Notario quien de todo lo relacionado Doy Fe.
        </p>
      </div>

      {/* Firmas de Legalización */}
      <div style={{ marginTop: '60px' }}>
        <div className="signature-line"></div>
        <div className="signature-line"></div>

        <p style={{ textAlign: 'left', fontWeight: 'bold', marginTop: '30px', marginBottom: '40px' }}>ANTE MÍ:</p>
      </div>
    </div>
  );
};

export default DocumentoPromesa;
