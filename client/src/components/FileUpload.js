import React, { useState, useRef } from 'react';
import { Upload, X, Image, File, Video, CheckCircle, AlertCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '../services/api';

const FileUpload = ({ 
  onUpload, 
  multiple = false, 
  accept = 'image/*,video/*,application/*',
  maxSize = 10, // MB
  className = '',
  type = 'general' // 'general', 'profile', 'project'
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    handleFiles(files);
  };

  const validateFile = (file) => {
    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      toast.error(`File ${file.name} is too large. Maximum size is ${maxSize}MB.`);
      return false;
    }

    // Check file type
    const allowedTypes = accept.split(',');
    const isValidType = allowedTypes.some(type => {
      if (type.includes('*')) {
        return file.type.startsWith(type.replace('/*', '/'));
      }
      return file.type === type;
    });

    if (!isValidType) {
      toast.error(`File type ${file.type} is not allowed.`);
      return false;
    }

    return true;
  };

  const handleFiles = async (files) => {
    const validFiles = files.filter(validateFile);
    
    if (validFiles.length === 0) return;

    if (!multiple && validFiles.length > 1) {
      toast.error('Only one file can be uploaded at a time.');
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      validFiles.forEach(file => {
        formData.append(multiple ? 'files' : 'file', file);
      });

      const endpoint = type === 'profile' ? '/api/upload/profile-picture' : 
                      multiple ? '/api/upload/multiple' : '/api/upload/single';

      const response = await api.post(endpoint, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const uploadedData = response.data.data;
      const newFiles = Array.isArray(uploadedData) ? uploadedData : [uploadedData];

      setUploadedFiles(prev => [...prev, ...newFiles]);
      
      if (onUpload) {
        onUpload(multiple ? newFiles : newFiles[0]);
      }

      toast.success(`Successfully uploaded ${newFiles.length} file(s)!`);
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const removeFile = (index) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const getFileIcon = (file) => {
    if (file.format && file.format.startsWith('image')) return <Image className="w-4 h-4" />;
    if (file.format && file.format.startsWith('video')) return <Video className="w-4 h-4" />;
    return <File className="w-4 h-4" />;
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 cursor-pointer ${
          isDragging
            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
            : 'border-gray-300 dark:border-gray-600 hover:border-primary-400 dark:hover:border-primary-500'
        } ${uploading ? 'opacity-50 pointer-events-none' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple={multiple}
          accept={accept}
          onChange={handleFileSelect}
          className="hidden"
        />
        
        <div className="space-y-4">
          <div className="mx-auto w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
            {uploading ? (
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            ) : (
              <Upload className="w-8 h-8 text-gray-400" />
            )}
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {uploading ? 'Uploading...' : 'Drop files here or click to upload'}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {multiple ? 'Upload multiple files' : 'Upload a single file'} • Max {maxSize}MB
            </p>
          </div>
        </div>
      </div>

      {/* Uploaded Files */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-gray-900 dark:text-white">
            Uploaded Files ({uploadedFiles.length})
          </h4>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {uploadedFiles.map((file, index) => (
              <div
                key={index}
                className="relative bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-3"
              >
                {/* File Preview */}
                {file.format && file.format.startsWith('image') ? (
                  <img
                    src={file.url}
                    alt={file.public_id}
                    className="w-full h-24 object-cover rounded-md mb-2"
                  />
                ) : (
                  <div className="w-full h-24 bg-gray-100 dark:bg-gray-700 rounded-md flex items-center justify-center mb-2">
                    {getFileIcon(file)}
                  </div>
                )}

                {/* File Info */}
                <div className="space-y-1">
                  <p className="text-xs font-medium text-gray-900 dark:text-white truncate">
                    {file.public_id}
                  </p>
                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                    <span>{file.format?.toUpperCase()}</span>
                    <span>{formatFileSize(file.size)}</span>
                  </div>
                  {file.width && file.height && (
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {file.width} × {file.height}
                    </p>
                  )}
                </div>

                {/* Remove Button */}
                <button
                  onClick={() => removeFile(index)}
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>

                {/* Success Indicator */}
                <div className="absolute top-2 left-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Error State */}
      {uploadedFiles.length === 0 && !uploading && (
        <div className="text-center text-sm text-gray-500 dark:text-gray-400">
          <AlertCircle className="w-4 h-4 mx-auto mb-1" />
          No files uploaded yet
        </div>
      )}
    </div>
  );
};

export default FileUpload;
