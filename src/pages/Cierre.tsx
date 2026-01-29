import React, { useState, useEffect } from 'react';
import UploadBox from '../components/UploadBox';
import { useParams } from 'react-router-dom';

interface FileUpload {
  file: File | null;
  preview: string | null;
}

const Cierre: React.FC = () => {
  const { id } = useParams();
  const [urlId, setUrlId] = useState<string | null>(null);
  const [nameclient, setName] = useState<string>('');
  const [autorizacionesEspeciales, setAutorizacionesEspeciales] = useState<boolean>(false);

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
    cheque: { file: null, preview: null },
    formato_apartado: { file: null, preview: null },
    contrato: { file: null, preview: null }
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

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAutorizacionesEspeciales(e.target.checked);
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

    if (files.cheque.file && files.formato_apartado.file && files.contrato.file) {
      setIsSubmitting(true);
      try {
        const formData = new FormData();
        formData.append('cheque', files.cheque.file);
        formData.append('formato_apartado', files.formato_apartado.file);
        formData.append('contrato', files.contrato.file);
        formData.append('autorizaciones_especiales', autorizacionesEspeciales ? '1' : '0');
        formData.append('id', urlId);

        const response = await fetch(`${import.meta.env.VITE_API_URL}/cierre`, {
          method: 'POST',
          body: formData,
        });

        const responseData = await response.json().catch(() => ({}));

        if (!response.ok) {
          throw new Error(responseData.message || 'Error en el servidor');
        }

        alert('Documentos enviados correctamente. Por favor revise su correo electrónico, ya que se le notificará una vez los documentos hayan sido procesados.');
        const resetFiles: Record<string, FileUpload> = {
          cheque: { file: null, preview: null },
          formato_apartado: { file: null, preview: null },
          contrato: { file: null, preview: null }
        };
        setFiles(resetFiles);
        setAutorizacionesEspeciales(false);

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

  const allFilesUploaded = files.cheque.file && files.formato_apartado.file && files.contrato.file;
  const uploadedCount = Object.values(files).filter(f => f.file).length + (autorizacionesEspeciales ? 1 : 0);

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
              Documentos de Cierre de {nameclient}
            </h2>
            <p className="text-base-content/70 mb-6">
              Por favor, sube los siguientes documentos para completar el proceso de cierre:
            </p>

            <div className="space-y-6">
              <UploadBox
                type="cheque"
                title="Imagen del cheque"
                subtitle="Sube una foto clara del cheque"
                acceptedFormats="image/png,image/jpeg,image/jpg"
                fileData={files.cheque}
                dragOver={dragOver}
                onFileChange={handleFileChange}
                onRemoveFile={removeFile}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
              />

              <UploadBox
                type="formato_apartado"
                title="Formato de Apartado"
                subtitle="Sube una imagen o PDF del formato de apartado"
                acceptedFormats="image/png,image/jpeg,image/jpg,application/pdf"
                fileData={files.formato_apartado}
                dragOver={dragOver}
                onFileChange={handleFileChange}
                onRemoveFile={removeFile}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
              />

              <UploadBox
                type="contrato"
                title="Contrato"
                subtitle="Sube una imagen o PDF del contrato"
                acceptedFormats="image/png,image/jpeg,image/jpg,application/pdf"
                fileData={files.contrato}
                dragOver={dragOver}
                onFileChange={handleFileChange}
                onRemoveFile={removeFile}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
              />
            </div>

            <fieldset className="fieldset bg-base-100 border-base-300 rounded-box w-64 border p-4">
              <legend className="fieldset-legend">Hay autorizaciones especiales?</legend>
              <label className="label">
                <input type="checkbox" className="toggle" onChange={handleCheckboxChange} checked={autorizacionesEspeciales} />
                <span className="label-text ml-2">Sí, hay autorizaciones especiales</span>
              </label>
            </fieldset>

            <div className="mt-8 mb-6">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="font-medium">Progreso de carga</span>
                <span className="badge badge-outline ">{uploadedCount} de 4</span>
              </div>
              <progress
                className=" progress w-full "
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

export default Cierre;