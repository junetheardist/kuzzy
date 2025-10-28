import React from 'react';
import { UploadCloud } from 'lucide-react';

interface FileUploadProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export const FileUpload = React.forwardRef<HTMLInputElement, FileUploadProps>(({ label, ...props }, ref) => {
  const id = React.useId();
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
        <div className="space-y-1 text-center">
          <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
          <div className="flex text-sm text-gray-600">
            <label htmlFor={id} className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none">
              <span>Upload a file</span>
              <input id={id} ref={ref} type="file" className="sr-only" {...props} />
            </label>
            <p className="pl-1">or drag and drop</p>
          </div>
          <p className="text-xs text-gray-500">PNG, JPG, PDF up to 10MB</p>
        </div>
      </div>
    </div>
  );
});

FileUpload.displayName = 'FileUpload';