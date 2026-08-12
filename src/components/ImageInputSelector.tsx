import React, { useState, useRef } from 'react';
import { Link2, Image as ImageIcon, Upload, X, Check, Eye } from 'lucide-react';

interface ImageInputSelectorProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  required?: boolean;
  darkMode?: boolean;
  multiple?: boolean;
  galleryValues?: string[];
  onGalleryChange?: (urls: string[]) => void;
  helpText?: string;
}

export const ImageInputSelector: React.FC<ImageInputSelectorProps> = ({
  label,
  value,
  onChange,
  placeholder = 'https://...',
  required = false,
  darkMode = false,
  multiple = false,
  galleryValues = [],
  onGalleryChange,
  helpText,
}) => {
  const [inputMode, setInputMode] = useState<'url' | 'gallery'>('url');
  const [urlInput, setUrlInput] = useState('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Single file conversion to Data URL
  const handleSingleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (result) {
          onChange(result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Multiple files conversion for gallery
  const handleMultipleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0 && onGalleryChange) {
      const newUrls: string[] = [...galleryValues];
      let filesProcessed = 0;
      const fileList = Array.from(files) as File[];

      fileList.forEach((file: File) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          const result = event.target?.result as string;
          if (result) {
            newUrls.push(result);
          }
          filesProcessed++;
          if (filesProcessed === fileList.length) {
            onGalleryChange(newUrls);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  // Add single URL to multiple gallery
  const handleAddUrlToGallery = () => {
    if (urlInput.trim() && onGalleryChange) {
      onGalleryChange([...galleryValues, urlInput.trim()]);
      setUrlInput('');
    }
  };

  const handleRemoveGalleryImage = (indexToRemove: number) => {
    if (onGalleryChange) {
      onGalleryChange(galleryValues.filter((_, idx) => idx !== indexToRemove));
    }
  };

  if (multiple) {
    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className={`block font-bold text-xs ${darkMode ? 'text-zinc-200' : 'text-amber-950'}`}>
            {label}
          </label>
          <div className="flex bg-amber-100 dark:bg-zinc-800 p-0.5 rounded-lg text-[10px] font-bold">
            <button
              type="button"
              onClick={() => setInputMode('url')}
              className={`px-2 py-1 rounded-md transition-all flex items-center gap-1 ${
                inputMode === 'url'
                  ? 'bg-[#4A0E17] text-[#D4AF37] shadow'
                  : 'text-zinc-600 dark:text-zinc-400'
              }`}
            >
              <Link2 className="w-3 h-3" />
              <span>Image URL</span>
            </button>
            <button
              type="button"
              onClick={() => setInputMode('gallery')}
              className={`px-2 py-1 rounded-md transition-all flex items-center gap-1 ${
                inputMode === 'gallery'
                  ? 'bg-[#4A0E17] text-[#D4AF37] shadow'
                  : 'text-zinc-600 dark:text-zinc-400'
              }`}
            >
              <ImageIcon className="w-3 h-3" />
              <span>Upload from Gallery</span>
            </button>
          </div>
        </div>

        {inputMode === 'url' ? (
          <div className="space-y-2">
            <div className="flex gap-2">
              <input
                type="url"
                placeholder="https://image-url.com/photo.jpg"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                className={`flex-1 p-2 text-xs rounded-xl border ${
                  darkMode ? 'bg-zinc-800 border-zinc-700 text-white' : 'bg-white border-zinc-300 text-black'
                }`}
              />
              <button
                type="button"
                onClick={handleAddUrlToGallery}
                className="px-3 py-1.5 bg-[#4A0E17] text-[#D4AF37] text-xs font-bold rounded-xl hover:bg-[#6B1423]"
              >
                Add Link
              </button>
            </div>
            {helpText && <p className="text-[10px] text-zinc-500">{helpText}</p>}
          </div>
        ) : (
          <div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleMultipleFiles}
              accept="image/*"
              multiple
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className={`w-full py-2.5 px-3 border-2 border-dashed rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                darkMode
                  ? 'border-zinc-700 hover:border-[#D4AF37] bg-zinc-800/50 text-zinc-200'
                  : 'border-amber-300 hover:border-[#4A0E17] bg-amber-50/60 text-amber-950'
              }`}
            >
              <Upload className="w-4 h-4 text-[#D4AF37]" />
              <span>Choose Photos from Device Gallery</span>
            </button>
            {helpText && <p className="text-[10px] text-zinc-500 mt-1">{helpText}</p>}
          </div>
        )}

        {/* Selected Gallery Thumbnails */}
        {galleryValues.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-1">
            {galleryValues.map((imgUrl, idx) => (
              <div key={idx} className="relative w-12 h-12 rounded-lg border overflow-hidden group border-amber-300 dark:border-zinc-700">
                <img src={imgUrl} alt={`Gallery ${idx}`} className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={() => handleRemoveGalleryImage(idx)}
                  className="absolute top-0.5 right-0.5 bg-rose-600 text-white p-0.5 rounded-full opacity-80 group-hover:opacity-100 hover:bg-rose-700 transition-all"
                  title="Remove image"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Single Image Mode
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className={`block font-bold text-xs ${darkMode ? 'text-zinc-200' : 'text-amber-950'}`}>
          {label} {required && <span className="text-rose-500">*</span>}
        </label>

        {/* Dual Input Mode Switcher Tabs */}
        <div className="flex bg-amber-100 dark:bg-zinc-800 p-0.5 rounded-lg text-[10px] font-bold">
          <button
            type="button"
            onClick={() => setInputMode('url')}
            className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1 ${
              inputMode === 'url'
                ? 'bg-[#4A0E17] text-[#D4AF37] shadow'
                : 'text-zinc-600 dark:text-zinc-400'
            }`}
          >
            <Link2 className="w-3 h-3" />
            <span>Image URL</span>
          </button>
          <button
            type="button"
            onClick={() => setInputMode('gallery')}
            className={`px-2.5 py-1 rounded-md transition-all flex items-center gap-1 ${
              inputMode === 'gallery'
                ? 'bg-[#4A0E17] text-[#D4AF37] shadow'
                : 'text-zinc-600 dark:text-zinc-400'
            }`}
          >
            <ImageIcon className="w-3 h-3" />
            <span>Gallery Upload</span>
          </button>
        </div>
      </div>

      {inputMode === 'url' ? (
        <div className="space-y-2">
          <input
            type="url"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            required={required}
            className={`w-full p-2 text-xs rounded-xl border ${
              darkMode ? 'bg-zinc-800 border-zinc-700 text-white' : 'bg-white border-zinc-300 text-black'
            }`}
          />
        </div>
      ) : (
        <div className="space-y-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleSingleFile}
            accept="image/*"
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className={`w-full py-2.5 px-3 border-2 border-dashed rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
              darkMode
                ? 'border-zinc-700 hover:border-[#D4AF37] bg-zinc-800/50 text-zinc-200'
                : 'border-amber-300 hover:border-[#4A0E17] bg-amber-50/60 text-amber-950'
            }`}
          >
            <Upload className="w-4 h-4 text-[#D4AF37]" />
            <span>Choose Photo from Device Gallery</span>
          </button>
        </div>
      )}

      {/* Image Preview Thumbnail */}
      {value && (
        <div className="flex items-center gap-2 p-1.5 rounded-xl border bg-amber-50/40 dark:bg-zinc-800/40 border-amber-200 dark:border-zinc-700">
          <img src={value} alt="Preview" className="w-10 h-10 object-cover rounded-lg border border-amber-300" />
          <div className="flex-1 min-w-0">
            <span className="text-[10px] font-bold block text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
              <Check className="w-3 h-3" /> Photo Attached
            </span>
            <span className="text-[9px] text-zinc-500 truncate block">
              {value.startsWith('data:') ? 'Gallery Image (Base64)' : value}
            </span>
          </div>
          <button
            type="button"
            onClick={() => onChange('')}
            className="p-1 text-rose-600 hover:bg-rose-100 rounded-lg text-[10px] font-bold"
            title="Clear Image"
          >
            Clear
          </button>
        </div>
      )}

      {helpText && <p className="text-[10px] text-zinc-500">{helpText}</p>}
    </div>
  );
};
