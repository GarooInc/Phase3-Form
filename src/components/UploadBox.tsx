import React from 'react';
import { IoCloudUpload } from "react-icons/io5";
import { MdDeleteOutline } from "react-icons/md";
import { FaFilePdf } from "react-icons/fa";

interface FileUpload {
  file: File | null;
  preview: string | null;
}

interface UploadBoxProps {
  type: string;
  title: string;
  subtitle: string;
  acceptedFormats: string;
  fileData: FileUpload;
  dragOver: string | null;
  formatPdfUrl?: string;
  belowSubtitleLinkText?: string;
  belowSubtitleLinkHref?: string;
  belowSubtitleLinkOnClick?: () => void;
  onFileChange: (type: string, file: File) => void;
  onRemoveFile: (type: string) => void;
  onDrop: (e: React.DragEvent, type: string) => void;
  onDragOver: (e: React.DragEvent, type: string) => void;
  onDragLeave: () => void;
}

const UploadBox: React.FC<UploadBoxProps> = ({
  type,
  title,
  subtitle,
  acceptedFormats,
  fileData,
  dragOver,
  formatPdfUrl,
  belowSubtitleLinkText,
  belowSubtitleLinkHref,
  belowSubtitleLinkOnClick,
  onFileChange,
  onRemoveFile,
  onDrop,
  onDragOver,
  onDragLeave,
}) => {
  const isImage = fileData.file?.type.startsWith('image/');
  const isPDF = fileData.file?.type === 'application/pdf';

  return (
    <div className="form-control w-full">
      <label className=" max-w-full">
        <span className="label-text font-semibold text-white w-full">
          {title} <span className="text-error">*</span>
        </span>
      </label>
      <p className="text-xs text-base-content/60 mb-3">
        {subtitle}
        {formatPdfUrl && (
          <>
            {' - '}
            <a
              href={formatPdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-300 hover:text-green-400 underline font-medium"
            >
              Descargar formato
            </a>
          </>
        )}
      </p>

      {belowSubtitleLinkText && (belowSubtitleLinkHref || belowSubtitleLinkOnClick) && (
        <a
          href={belowSubtitleLinkHref || "#"}
          onClick={(e) => {
            if (belowSubtitleLinkOnClick) {
              e.preventDefault();
              belowSubtitleLinkOnClick();
            }
          }}
          target={belowSubtitleLinkHref ? "_blank" : undefined}
          rel={belowSubtitleLinkHref ? "noopener noreferrer" : undefined}
          className="text-xs text-green-300 hover:text-green-400 underline font-medium mb-3 inline-block"
        >
          {belowSubtitleLinkText}
        </a>
      )}

      {!fileData.file ? (
        <div
          onDrop={(e) => onDrop(e, type)}
          onDragOver={(e) => onDragOver(e, type)}
          onDragLeave={onDragLeave}
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-all cursor-pointer ${dragOver === type
              ? 'border-warning bg-warning/10'
              : 'border-base-300 hover:border-white hover:bg-base-200'
            }`}
        >
          <input
            type="file"
            id={`file-${type}`}
            accept={acceptedFormats}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) onFileChange(type, file);
            }}
            className="hidden"
          />
          <label htmlFor={`file-${type}`} className="cursor-pointer">
            <IoCloudUpload className="mx-auto mb-4 h-12 w-12 text-base-content/50" />
            <p className="text-sm mb-1">
              <span className="text-green-300 font-semibold">Haz clic para seleccionar</span> o arrastra el archivo aquí
            </p>
            <p className="text-xs text-base-content/50">
              Formatos: {acceptedFormats.replace(/image\//g, '').replace(/application\//g, '').toUpperCase()}
            </p>
          </label>
        </div>
      ) : (
        <div className="alert alert-success shadow-lg bg-gray-100 border-none relative">
          <div className="flex items-start justify-between w-full">
            <div className="flex items-start gap-3 flex-1 min-w-0">
              {isImage && fileData.preview ? (
                <img
                  src={fileData.preview}
                  alt="Preview"
                  className="h-16 w-16 object-cover rounded-lg"
                />
              ) : isPDF ? (
                <div className="h-16 w-16  flex items-center justify-center">
                  <FaFilePdf className="h-10 w-10 text-gray-600" />
                </div>
              ) : null}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 text-gray-600">
                  <p className="text-sm font-medium truncate text-gray-600">
                    {fileData.file.name}
                  </p>
                </div>
                <p className="text-xs opacity-80 text-gray-600">
                  {(fileData.file.size / 1024).toFixed(2)} KB
                </p>
              </div>
            </div>
            <button
              onClick={() => onRemoveFile(type)}
              className="btn btn-circle btn-ghost btn-sm ml-2 flex-shrink-0 absolute top-2 right-2"
              aria-label="Eliminar archivo"
            >
              <MdDeleteOutline className="h-6 w-6 text-error" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadBox;