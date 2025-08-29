
import React, { useCallback } from 'react';
import { UploadIcon } from './icons/UploadIcon';

interface ImageUploaderProps {
  id: string;
  label: string;
  onImageSelect: (file: File) => void;
  imagePreviewUrl: string | null;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ id, label, onImageSelect, imagePreviewUrl }) => {
  
  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      onImageSelect(event.target.files[0]);
    }
  }, [onImageSelect]);

  return (
    <div className="flex flex-col items-center space-y-3">
      <h3 className="font-semibold text-lg text-gray-700 dark:text-gray-300">{label}</h3>
      <label htmlFor={id} className="relative w-full aspect-square bg-gray-50 dark:bg-gray-700/50 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 flex flex-col justify-center items-center text-center p-4 cursor-pointer hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-gray-700 transition-colors duration-300">
        {imagePreviewUrl ? (
          <img src={imagePreviewUrl} alt={`${label} preview`} className="absolute inset-0 w-full h-full object-cover rounded-lg" />
        ) : (
          <div className="space-y-2 text-gray-500 dark:text-gray-400">
            <UploadIcon className="w-10 h-10 mx-auto" />
            <p className="font-medium">Click to upload</p>
            <p className="text-xs">PNG, JPG, WEBP</p>
          </div>
        )}
        <input 
          id={id} 
          type="file" 
          className="sr-only" 
          accept="image/png, image/jpeg, image/webp"
          onChange={handleFileChange}
        />
      </label>
    </div>
  );
};
