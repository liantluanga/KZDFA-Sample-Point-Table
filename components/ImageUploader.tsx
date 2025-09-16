import React, { useRef } from 'react';

interface ImageUploaderProps {
  imageUrl: string | null;
  onImageChange: (dataUrl: string | null) => void;
  shape: 'circle' | 'rectangle';
  className?: string;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ imageUrl, onImageChange, shape, className }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onImageChange(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
    event.target.value = ''; // Reset file input
  };

  const shapeClasses = shape === 'circle' ? 'rounded-full' : 'rounded-md';

  return (
    <div
      onClick={handleImageClick}
      className={`cursor-pointer bg-gray-600/50 flex items-center justify-center bg-cover bg-center ${shapeClasses} ${className}`}
      style={{ backgroundImage: imageUrl ? `url(${imageUrl})` : 'none' }}
    >
      {!imageUrl && (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      )}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/png, image/jpeg"
      />
    </div>
  );
};

export default ImageUploader;
