
import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { ImageUploader } from './components/ImageUploader';
import { ResultDisplay } from './components/ResultDisplay';
import { generateVirtualTryOn } from './services/geminiService';
import { SparklesIcon } from './components/icons/SparklesIcon';

const App: React.FC = () => {
  const [userImage, setUserImage] = useState<File | null>(null);
  const [outfitImage, setOutfitImage] = useState<File | null>(null);
  const [userImagePreview, setUserImagePreview] = useState<string | null>(null);
  const [outfitImagePreview, setOutfitImagePreview] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleUserImageSelect = useCallback((file: File) => {
    setUserImage(file);
    if (userImagePreview) URL.revokeObjectURL(userImagePreview);
    setUserImagePreview(URL.createObjectURL(file));
  }, [userImagePreview]);

  const handleOutfitImageSelect = useCallback((file: File) => {
    setOutfitImage(file);
    if (outfitImagePreview) URL.revokeObjectURL(outfitImagePreview);
    setOutfitImagePreview(URL.createObjectURL(file));
  }, [outfitImagePreview]);

  const handleGenerateClick = async () => {
    if (!userImage || !outfitImage) {
      setError('Please upload both your photo and an outfit photo.');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);

    try {
      const resultImageUrl = await generateVirtualTryOn(userImage, outfitImage);
      setGeneratedImage(resultImageUrl);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen text-gray-800 dark:text-gray-200 antialiased">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          
          {/* Input Section */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 sm:p-8 space-y-8">
            <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white">Create Your Look</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ImageUploader 
                id="user-photo" 
                label="Your Photo" 
                onImageSelect={handleUserImageSelect} 
                imagePreviewUrl={userImagePreview}
              />
              <ImageUploader 
                id="outfit-photo" 
                label="Outfit Photo" 
                onImageSelect={handleOutfitImageSelect}
                imagePreviewUrl={outfitImagePreview}
              />
            </div>
            {error && <p className="text-red-500 text-center">{error}</p>}
            <button
              onClick={handleGenerateClick}
              disabled={isLoading || !userImage || !outfitImage}
              className="w-full flex items-center justify-center bg-indigo-600 text-white font-bold text-lg py-4 px-6 rounded-xl shadow-md hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:shadow-none transition-all duration-300 ease-in-out transform hover:scale-105"
            >
              {isLoading ? 'Generating...' : (
                <>
                  <SparklesIcon className="w-6 h-6 mr-2" />
                  Try It On
                </>
              )}
            </button>
          </div>

          {/* Output Section */}
          <ResultDisplay generatedImageUrl={generatedImage} isLoading={isLoading} />
          
        </div>
      </main>
    </div>
  );
};

export default App;
