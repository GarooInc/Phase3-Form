import React, { useState } from 'react';
import UploadBox from './components/UploadBox';

interface FileUpload {
  file: File | null;
  preview: string | null;
}

const DocumentUploadForm: React.FC = () => {
  const [files, setFiles] = useState<{
    frontal: FileUpload;
    trasera: FileUpload;
    recibo: FileUpload;
  }>({
    frontal: { file: null, preview: null },
    trasera: { file: null, preview: null },
    recibo: { file: null, preview: null }
  });

  const [dragOver, setDragOver] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileChange = (type: 'frontal' | 'trasera' | 'recibo', file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setFiles(prev => ({
        ...prev,
        [type]: { file, preview: reader.result as string }
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent, type: 'frontal' | 'trasera' | 'recibo') => {
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

  const removeFile = (type: 'frontal' | 'trasera' | 'recibo') => {
    setFiles(prev => ({
      ...prev,
      [type]: { file: null, preview: null }
    }));
  };

  const handleSubmit = async () => {
    if (files.frontal.file && files.trasera.file && files.recibo.file) {
      setIsSubmitting(true);
      try {
        const formData = new FormData();
        formData.append('frontal', files.frontal.file);
        formData.append('trasera', files.trasera.file);
        formData.append('recibo', files.recibo.file);

        const response = await fetch(import.meta.env.VITE_API_URL, {
          method: 'POST',
          body: formData
        });

        if (response.ok) {
          alert('Documentos enviados correctamente');
        } else {
          alert('Error al enviar los documentos. Por favor, intenta de nuevo.');
        }
      } catch (error) {
        console.error('Error al enviar documentos:', error);
        alert('Error al enviar los documentos. Por favor, intenta de nuevo.');
      } finally {
        setIsSubmitting(false);
      }
    } else {
      alert('Por favor, sube todos los documentos requeridos');
    }
  };

  const allFilesUploaded = files.frontal.file && files.trasera.file && files.recibo.file;
  const uploadedCount = Object.values(files).filter(f => f.file).length;

  return (
    <div className="min-h-screen bg-white p-6">
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
              Documentos de Identificación
            </h2>
            <p className="text-base-content/70 mb-6">
              Por favor, sube los siguientes documentos para completar tu registro
            </p>

            <div className="space-y-6">
              <UploadBox
                type="frontal"
                title="Imagen Frontal del Documento de Identificación (DPI ó Pasaporte)"
                subtitle="Sube una foto clara del frente de tu documento de identidad"
                acceptedFormats="image/png,image/jpeg,image/jpg"
                fileData={files.frontal}
                dragOver={dragOver}
                onFileChange={handleFileChange}
                onRemoveFile={removeFile}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
              />

              <UploadBox
                type="trasera"
                title="Imagen Trasera del Documento de Identificación (DPI ó Pasaporte)"
                subtitle="Sube una foto clara del reverso de tu documento de identidad"
                acceptedFormats="image/png,image/jpeg,image/jpg"
                fileData={files.trasera}
                dragOver={dragOver}
                onFileChange={handleFileChange}
                onRemoveFile={removeFile}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
              />

              <UploadBox
                type="recibo"
                title="Recibo de Servicios"
                subtitle="Sube una imagen o PDF de un recibo de servicios reciente (luz ó agua)"
                acceptedFormats="image/png,image/jpeg,image/jpg,application/pdf"
                fileData={files.recibo}
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
                <span className="badge badge-outline ">{uploadedCount} de 3</span>
              </div>
              <progress 
                className="progress progress w-full " 
                value={uploadedCount} 
                max="3"
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
                  'Enviar Documentos'
                ) : (
                  'Completa todos los campos requeridos'
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
  );
};

export default DocumentUploadForm;