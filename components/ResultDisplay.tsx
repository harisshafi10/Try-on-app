
import React from 'react';
import { DownloadIcon } from './icons/DownloadIcon';

interface ResultDisplayProps {
  generatedImageUrl: string | null;
  isLoading: boolean;
}

const SkeletonLoader: React.FC = () => (
    <div className="w-full aspect-square bg-gray-200 dark:bg-gray-700 rounded-2xl animate-pulse"></div>
);

const Placeholder: React.FC = () => (
  <div className="w-full aspect-square bg-gray-50 dark:bg-gray-700/50 rounded-2xl flex flex-col justify-center items-center text-center p-8 border-2 border-dashed border-gray-300 dark:border-gray-600">
    <div className="mb-4">
      <svg className="w-16 h-16 text-gray-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
    </div>
    <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400">Your virtual try-on will appear here</h3>
    <p className="text-gray-500 dark:text-gray-500 mt-2">Upload your photos and click "Try It On" to see the magic happen!</p>
  </div>
);


export const ResultDisplay: React.FC<ResultDisplayProps> = ({ generatedImageUrl, isLoading }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 sm:p-8 space-y-6">
      <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-white">Your New Style</h2>
      
      <div className="w-full aspect-square relative">
        {isLoading && <SkeletonLoader />}
        {!isLoading && !generatedImageUrl && <Placeholder />}
        {generatedImageUrl && (
          <img src={generatedImageUrl} alt="Generated virtual try-on" className="w-full h-full object-cover rounded-2xl shadow-inner" />
        )}
      </div>

      {generatedImageUrl && !isLoading && (
        <a
          href={generatedImageUrl}
          download="virtual-try-on.png"
          className="w-full flex items-center justify-center bg-green-600 text-white font-bold text-lg py-4 px-6 rounded-xl shadow-md hover:bg-green-700 transition-all duration-300 ease-in-out transform hover:scale-105"
        >
          <DownloadIcon className="w-6 h-6 mr-2" />
          Download Image
        </a>
      )}
    </div>
  );
};
