import React, { useState, useEffect } from 'react';
import UploadBox from '../components/UploadBox';
import { useParams } from 'react-router-dom';

interface FileUpload {
  file: File | null;
  preview: string | null;
}

const Promesa: React.FC = () => {
  const { id } = useParams();
  const [typePerson, setTypePerson] = useState<number>(0);
  const [urlId, setUrlId] = useState<string | null>(null);
  const [nameclient, setName] = useState<string>('');
  const [contado, setContado] = useState<boolean>(false);

  useEffect(() => {
    setUrlId(id || null);

    const formData = new FormData();
    formData.append('id', id || '');

    if (id) {
      fetch(`${import.meta.env.VITE_API_URL}/bravantegetusers`, {
        method: 'POST',
        body: formData,
      })
        .then(response => response.json())
        .then(data => {
          setName(data.Nombre || '');
        })
        .catch(error => {
          console.error('Error al verificar el usuario:', error);
        });
    }

  }, [id]);

  const [files, setFiles] = useState<Record<string, FileUpload>>({
    carta_investigacion: { file: null, preview: null },
    ive: { file: null, preview: null },
    dpi_replegal: { file: null, preview: null },
    nombramiento_replegal: { file: null, preview: null },
    rtu_replegal: { file: null, preview: null },
    rtu_pjuridica: { file: null, preview: null },
    escritura_empresa: { file: null, preview: null },
    patente_sociedad: { file: null, preview: null },
    patente_empresa: { file: null, preview: null },
    recibo_replegal: { file: null, preview: null },
    recibo_empresa: { file: null, preview: null },
    estados_financieros: { file: null, preview: null },
    rtu_individual: { file: null, preview: null },
    recibo_individual: { file: null, preview: null },
    carta_ingresos: { file: null, preview: null },
    estado_cuenta1: { file: null, preview: null },
    estado_cuenta2: { file: null, preview: null },
    estado_cuenta3: { file: null, preview: null },
  });

  const [dragOver, setDragOver] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileChange = (type: string, file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setFiles(prev => ({
        ...prev,
        [type]: { file, preview: reader.result as string }
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleCheckboxChange = () => {
    setContado(!contado);
  };

  const handleDrop = (e: React.DragEvent, type: string) => {
    e.preventDefault();
    setDragOver(null);
    const file = e.dataTransfer.files[0];
    if (file && isValidFile(file, type)) {
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

  const isValidFile = (file: File, type: string) => {
    const validImageTypes = ['image/png', 'image/jpeg', 'image/jpg'];
    const validDocTypes = [...validImageTypes, 'application/pdf'];

    if (type === 'recibo') {
      return validDocTypes.includes(file.type);
    }
    return validImageTypes.includes(file.type);
  };

  const removeFile = (type: string) => {
    setFiles(prev => ({
      ...prev,
      [type]: { file: null, preview: null }
    }));
  };

  const handleSubmit = async () => {
    if (!urlId) {
      alert('No se pudo obtener el ID de la URL. Por favor, asegúrate de acceder al formulario desde el enlace correcto.');
      return;
    }

    if (allFilesUploaded) {
      setIsSubmitting(true);
      try {
        const formData = new FormData();
        Object.entries(files).forEach(([key, fileUpload]) => {
          if (fileUpload.file) {
            formData.append(key, fileUpload.file);
          }
        });
        formData.append('type_person', typePerson.toString());
        formData.append('id', urlId);

        const response = await fetch(`${import.meta.env.VITE_API_URL}/promesa`, {
          method: 'POST',
          body: formData,
        });

        const responseData = await response.json().catch(() => ({}));

        if (!response.ok) {
          throw new Error(responseData.message || 'Error en el servidor');
        }

        alert('Documentos enviados correctamente. Por favor revise su correo electrónico, ya que se le notificará una vez los documentos hayan sido procesados.');
        const resetFiles: Record<string, FileUpload> = {
          carta_investigacion: { file: null, preview: null },
          ive: { file: null, preview: null },
          dpi_replegal: { file: null, preview: null },
          nombramiento_replegal: { file: null, preview: null },
          rtu_replegal: { file: null, preview: null },
          rtu_pjuridica: { file: null, preview: null },
          escritura_empresa: { file: null, preview: null },
          patente_sociedad: { file: null, preview: null },
          patente_empresa: { file: null, preview: null },
          recibo_replegal: { file: null, preview: null },
          recibo_empresa: { file: null, preview: null },
          estados_financieros: { file: null, preview: null },
          rtu_individual: { file: null, preview: null },
          recibo_individual: { file: null, preview: null },
          carta_ingresos: { file: null, preview: null },
          estado_cuenta1: { file: null, preview: null },
          estado_cuenta2: { file: null, preview: null },
          estado_cuenta3: { file: null, preview: null }
        };
        setFiles(resetFiles);
        setContado(false);

      } catch (error) {
        console.error('Error al enviar documentos:', error);
        const errorMessage = error instanceof Error
          ? error.message
          : 'Ocurrió un error desconocido';
        alert(`Error al enviar los documentos: ${errorMessage}`);
      } finally {
        setIsSubmitting(false);
      }
    } else {
      alert('Por favor, sube todos los documentos requeridos');
    }
  };

  const allFilesUploaded = typePerson === 0
    ? files.carta_investigacion.file &&
    files.dpi_replegal.file &&
    files.nombramiento_replegal.file &&
    files.ive.file &&
    files.rtu_replegal.file &&
    files.rtu_pjuridica.file &&
    files.escritura_empresa.file &&
    files.patente_sociedad.file &&
    files.patente_empresa.file &&
    files.recibo_replegal.file &&
    files.recibo_empresa.file &&
    (contado ? files.estados_financieros.file : true)
    : files.rtu_individual.file &&
    files.recibo_individual.file &&
    files.carta_ingresos.file &&
    files.estado_cuenta1.file &&
    files.estado_cuenta2.file &&
    files.estado_cuenta3.file;
  const uploadedCount = typePerson === 0
    ? [
      files.carta_investigacion,
      files.ive,
      files.rtu_replegal,
      files.rtu_pjuridica,
      files.escritura_empresa,
      files.patente_sociedad,
      files.patente_empresa,
      files.recibo_replegal,
      files.recibo_empresa,
      contado ? files.estados_financieros : null
    ].filter(f => f && f.file).length
    : [
      files.carta_investigacion,
      files.ive,
      files.rtu_individual,
      files.recibo_individual,
      files.carta_ingresos,
      files.estado_cuenta1,
      files.estado_cuenta2,
      files.estado_cuenta3
    ].filter(f => f.file).length;

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-block">
            <img
              src="/logo.png"
              alt="Logo"
              className=" w-40 object-contain"
            />
          </div>
        </div>

        <div className="card bg-base-200 shadow-2xl">
          <div className="card-body">
            <h2 className="card-title md:text-2xl text-xl mb-2">
              Documentos de Promesa de {nameclient}
            </h2>
            <p className="text-base-content/70 mb-6">
              Por favor, sube los siguientes documentos para completar el proceso de promesa:
            </p>

            <div>
              <label className="cursor-pointer flex items-center gap-3 mb-4">
                Eres persona jurídica ó individual?
              </label>
              <div className='flex gap-4'>
                <input type="radio" name="radio-1" className="radio" checked={typePerson === 0} onChange={() => setTypePerson(0)} />
                <label className="cursor-pointer flex items-center gap-3">
                  Persona Jurídica
                </label>
                <input type="radio" name="radio-1" className="radio" checked={typePerson === 1} onChange={() => setTypePerson(1)} />
                <label className="cursor-pointer flex items-center gap-3">
                  Persona Individual
                </label>
              </div>
            </div>
            {typePerson === 0 && (
              <div className="space-y-6 mt-4">
                <UploadBox
                  type="dpi_replegal"
                  title="Imagen del DPI del representante legal"
                  subtitle="Sube una foto clara del documento de identidad"
                  acceptedFormats="image/png,image/jpeg,image/jpg"
                  fileData={files.dpi_replegal}
                  dragOver={dragOver}
                  onFileChange={handleFileChange}
                  onRemoveFile={removeFile}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                />

                <UploadBox
                  type="nombramiento_replegal"
                  title="Nombramiento del representante legal"
                  subtitle="Sube un PDF del nombramiento del representante legal"
                  acceptedFormats="application/pdf"
                  fileData={files.nombramiento_replegal}
                  dragOver={dragOver}
                  onFileChange={handleFileChange}
                  onRemoveFile={removeFile}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                />

                <UploadBox
                  type="carta_investigacion"
                  title="Carta de Investigación firmada por el representante legal"
                  subtitle="Sube un PDF de la carta de investigación"
                  acceptedFormats="application/pdf"
                  fileData={files.carta_investigacion}
                  dragOver={dragOver}
                  onFileChange={handleFileChange}
                  onRemoveFile={removeFile}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                />

                <UploadBox
                  type="ive"
                  title="IVE"
                  subtitle="Sube un pdf del IVE adjunto"
                  formatPdfUrl='/docs/ive.xlsx'
                  acceptedFormats="application/pdf"
                  fileData={files.ive}
                  dragOver={dragOver}
                  onFileChange={handleFileChange}
                  onRemoveFile={removeFile}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                />

                <UploadBox
                  type="rtu_replegal"
                  title="RTU actualizado del representante legal"
                  subtitle="Sube un pdf del RTU del representante legal"
                  acceptedFormats="application/pdf"
                  fileData={files.rtu_replegal}
                  dragOver={dragOver}
                  onFileChange={handleFileChange}
                  onRemoveFile={removeFile}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                />

                <UploadBox
                  type="rtu_pjuridica"
                  title="RTU actualizado de la persona jurídica"
                  subtitle="Sube un pdf del RTU de la persona jurídica"
                  acceptedFormats="application/pdf"
                  fileData={files.rtu_pjuridica}
                  dragOver={dragOver}
                  onFileChange={handleFileChange}
                  onRemoveFile={removeFile}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                />

                <UploadBox
                  type="escritura_empresa"
                  title="Escritura de la constitución de la empresa"
                  subtitle="Sube un pdf de la escritura de la empresa"
                  acceptedFormats="application/pdf"
                  fileData={files.escritura_empresa}
                  dragOver={dragOver}
                  onFileChange={handleFileChange}
                  onRemoveFile={removeFile}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                />

                <UploadBox
                  type="patente_sociedad"
                  title="Patente de la sociedad"
                  subtitle="Sube un pdf de la patente de la sociedad"
                  acceptedFormats="application/pdf"
                  fileData={files.patente_sociedad}
                  dragOver={dragOver}
                  onFileChange={handleFileChange}
                  onRemoveFile={removeFile}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                />

                <UploadBox
                  type="patente_empresa"
                  title="Patente de la empresa"
                  subtitle="Sube un pdf de la patente de la empresa"
                  acceptedFormats="application/pdf"
                  fileData={files.patente_empresa}
                  dragOver={dragOver}
                  onFileChange={handleFileChange}
                  onRemoveFile={removeFile}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                />

                <UploadBox
                  type="recibo_replegal"
                  title="Recibo de servicios del representante legal"
                  subtitle="Sube un pdf del recibo de servicios del representante legal"
                  acceptedFormats="application/pdf"
                  fileData={files.recibo_replegal}
                  dragOver={dragOver}
                  onFileChange={handleFileChange}
                  onRemoveFile={removeFile}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                />

                <UploadBox
                  type="recibo_empresa"
                  title="Recibo de servicios de la empresa"
                  subtitle="Sube un pdf del recibo de servicios de la empresa"
                  acceptedFormats="application/pdf"
                  fileData={files.recibo_empresa}
                  dragOver={dragOver}
                  onFileChange={handleFileChange}
                  onRemoveFile={removeFile}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                />


                <fieldset className="fieldset bg-base-100 border-base-300 rounded-box w-64 border p-4">
                  <legend className="fieldset-legend">Es al contado?</legend>
                  <label className="label">
                    <input type="checkbox" className="toggle" onChange={handleCheckboxChange} checked={contado} />
                    <span className="label-text ml-2">Sí, es al contado</span>
                  </label>
                </fieldset>

                {
                  contado && (
                    <UploadBox
                      type="estados_financieros"
                      title="Estados Financieros"
                      subtitle="Sube un PDF de los estados financieros"
                      acceptedFormats="application/pdf"
                      fileData={files.estados_financieros}
                      dragOver={dragOver}
                      onFileChange={handleFileChange}
                      onRemoveFile={removeFile}
                      onDrop={handleDrop}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                    />
                  )
                }
              </div>
            )}
            {typePerson === 1 && (
              <div className="space-y-6 mt-4">

                <UploadBox
                  type="carta_investigacion"
                  title="Carta de Investigación firmada por el representante legal"
                  subtitle="Sube un PDF de la carta de investigación"
                  acceptedFormats="application/pdf"
                  fileData={files.carta_investigacion}
                  dragOver={dragOver}
                  onFileChange={handleFileChange}
                  onRemoveFile={removeFile}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                />

                <UploadBox
                  type="ive"
                  title="IVE"
                  subtitle="Sube un pdf del IVE adjunto"
                  formatPdfUrl='/docs/ive.xlsx'
                  acceptedFormats="application/pdf"
                  fileData={files.ive}
                  dragOver={dragOver}
                  onFileChange={handleFileChange}
                  onRemoveFile={removeFile}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                />

                <UploadBox
                  type="rtu_individual"
                  title="RTU actualizado"
                  subtitle="Sube un pdf del RTU actualizado"
                  acceptedFormats="application/pdf"
                  fileData={files.rtu_individual}
                  dragOver={dragOver}
                  onFileChange={handleFileChange}
                  onRemoveFile={removeFile}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                />

                <UploadBox
                  type="recibo_individual"
                  title="Recibo de servicios"
                  subtitle="Sube un pdf del recibo de servicios reciente"
                  acceptedFormats="application/pdf"
                  fileData={files.recibo_individual}
                  dragOver={dragOver}
                  onFileChange={handleFileChange}
                  onRemoveFile={removeFile}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                />

                <UploadBox
                  type="carta_ingresos"
                  title="Carta de ingresos"
                  subtitle="Sube un pdf de la carta de ingresos"
                  acceptedFormats="application/pdf"
                  fileData={files.carta_ingresos}
                  dragOver={dragOver}
                  onFileChange={handleFileChange}
                  onRemoveFile={removeFile}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                />

                <UploadBox
                  type="estado_cuenta1"
                  title="Estado de cuenta 1"
                  subtitle="Sube un pdf del primer estado de cuenta"
                  acceptedFormats="application/pdf"
                  fileData={files.estado_cuenta1}
                  dragOver={dragOver}
                  onFileChange={handleFileChange}
                  onRemoveFile={removeFile}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                />
                <UploadBox
                  type="estado_cuenta2"
                  title="Estado de cuenta 2"
                  subtitle="Sube un pdf del segundo estado de cuenta"
                  acceptedFormats="application/pdf"
                  fileData={files.estado_cuenta2}
                  dragOver={dragOver}
                  onFileChange={handleFileChange}
                  onRemoveFile={removeFile}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                />
                <UploadBox
                  type="estado_cuenta3"
                  title="Estado de cuenta 3"
                  subtitle="Sube un pdf del tercer estado de cuenta"
                  acceptedFormats="application/pdf"
                  fileData={files.estado_cuenta3}
                  dragOver={dragOver}
                  onFileChange={handleFileChange}
                  onRemoveFile={removeFile}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                />
              </div>
            )}

            <div className="mt-8 mb-6">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="font-medium">Progreso de carga</span>
                <span className="badge badge-outline ">{uploadedCount} de {typePerson === 0 ? (contado ? 10 : 9) : 8}</span>
              </div>
              <progress
                className="progress progress w-full "
                value={uploadedCount}
                max="4"
              ></progress>
            </div>

            <div className="card-actions justify-end mt-4">
              <button
                onClick={handleSubmit}
                disabled={!allFilesUploaded || isSubmitting}
                className={`btn btn-block ${allFilesUploaded && !isSubmitting
                  ? 'btn bg-orange-100 text-black'
                  : 'btn-disabled'
                  }`}
              >
                {isSubmitting ? (
                  <>
                    <span className="loading loading-spinner loading-xs"></span>
                    Enviando documentos...
                  </>
                ) : allFilesUploaded ? (
                  'Enviar Documentos'
                ) : (
                  'Completa todos los campos requeridos'
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="text-center mt-8">
          <a className="text-sm text-black/70" href="https://redtec.ai/" target="_blank" rel="noopener noreferrer">
            &copy; 2024 Redtec. Todos los derechos reservados.
          </a>
        </div>
      </div>
    </div>
  );
};

export default Promesa;