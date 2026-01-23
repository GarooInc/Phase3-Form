import React, { useState, useEffect } from 'react';
import UploadBox from '../components/UploadBox';
import DocumentoPromesa from '../components/DocumentoPromesa';
import { useParams } from 'react-router-dom';


interface FileUpload {
  file: File | null;
  preview: string | null;
}

const PromesaFirma: React.FC = () => {
  const { id } = useParams();
  const [urlId, setUrlId] = useState<string | null>(null);
  const [nameclient, setName] = useState<string>('');


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
    promesa_firmada: { file: null, preview: null }
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
    const validDocTypes = ['application/pdf'];
    return validDocTypes.includes(file.type);
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

    if (files.promesa_firmada.file) {
      setIsSubmitting(true);
      try {
        const formData = new FormData();
        formData.append('promesa_firmada', files.promesa_firmada.file);
        formData.append('id', urlId);

        const response = await fetch(`${import.meta.env.VITE_API_URL}/promesafirmada`, {
          method: 'POST',
          body: formData,
        });

        const responseData = await response.json().catch(() => ({}));
        
        if (!response.ok) {
          throw new Error(responseData.message || 'Error en el servidor');
        }

        console.log('Respuesta del servidor:', responseData);
        alert('Documento enviado correctamente. Por favor revise su correo electrónico, ya que se le notificará una vez el documento haya sido procesado.');
        setFiles({ promesa_firmada: { file: null, preview: null } });
        
      } catch (error) {
        console.error('Error al enviar documento:', error);
        const errorMessage = error instanceof Error 
          ? error.message 
          : 'Ocurrió un error desconocido';
        alert(`Error al enviar el documento: ${errorMessage}`);
      } finally {
        setIsSubmitting(false);
      }
    } else {
      alert('Por favor, sube el documento requerido');
    }
  };

  const allFilesUploaded = files.promesa_firmada.file;
  const uploadedCount = files.promesa_firmada.file ? 1 : 0;

  return (
    <div className="min-h-screen bg-white flex">
      {/* Sección Izquierda - Documento */}
      <div className="w-1/2 border-r border-gray-300 overflow-hidden">
        <div className="h-full overflow-auto">
          <DocumentoPromesa />
        </div>
      </div>

      {/* Sección Derecha - Formulario */}
      <div className="w-1/2 p-6 overflow-auto">
        <div className="max-w-3xl mx-auto">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-block">
              <img 
                src="/logo.png"
                alt="Logo" 
                className=" w-40 object-contain" 
              />
            </div>
          </div>

          {/* Main Card */}
          <div className="card bg-base-200 shadow-2xl">
            <div className="card-body">
              <h2 className="card-title md:text-2xl text-xl mb-2">
                Promesa Firmada de {nameclient}
              </h2>
              <p className="text-base-content/70 mb-6">
                Por favor, sube la promesa firmada para completar el proceso:
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
                  <span className="font-medium">Progreso de carga</span>
                  <span className="badge badge-outline ">{uploadedCount} de 1</span>
                </div>
                <progress 
                  className="progress progress w-full " 
                  value={uploadedCount} 
                  max="1"
                ></progress>
              </div>

              {/* Submit Button */}
              <div className="card-actions justify-end mt-4">
                <button
                  onClick={handleSubmit}
                  disabled={!allFilesUploaded || isSubmitting}
                  className={`btn btn-block ${
                    allFilesUploaded && !isSubmitting
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
                    'Enviar Documento'
                  ) : (
                    'Completa el campo requerido'
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-8">
            <a className="text-sm text-black/70" href="https://redtec.ai/" target="_blank" rel="noopener noreferrer">
              &copy; 2024 Redtec. Todos los derechos reservados.
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromesaFirma;