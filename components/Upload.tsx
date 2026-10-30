import { AlertCircle, CheckCircle2, ImageIcon, UploadIcon } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { useOutletContext } from "react-router";
import {
  PROGRESS_INTERVAL_MS,
  PROGRESS_STEP,
  REDIRECT_DELAY_MS,
} from "../lib/constants";

interface UploadProps {
  onComplete?: (base64Data: string) => void;
}

const MAX_FILE_SIZE_BYTES = 50 * 1024 * 1024; // 50MB
const ALLOWED_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp"];

/**
 * Checks if the binary buffer starts with valid magic bytes for JPEG, PNG, or WebP.
 */
const isValidImageBinary = (buffer: ArrayBuffer): boolean => {
  if (buffer.byteLength < 12) return false;
  const bytes = new Uint8Array(buffer);

  // JPEG: FF D8 FF
  const isJpeg = bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  if (isJpeg) return true;

  // PNG: 89 50 4E 47 0D 0A 1A 0A
  const isPng =
    bytes[0] === 0x89 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x4e &&
    bytes[3] === 0x47 &&
    bytes[4] === 0x0d &&
    bytes[5] === 0x0a &&
    bytes[6] === 0x1a &&
    bytes[7] === 0x0a;
  if (isPng) return true;

  // WebP: RIFF .... WEBP
  const isWebp =
    bytes[0] === 0x52 &&
    bytes[1] === 0x49 &&
    bytes[2] === 0x46 &&
    bytes[3] === 0x46 && // "RIFF"
    bytes[8] === 0x57 &&
    bytes[9] === 0x45 &&
    bytes[10] === 0x42 &&
    bytes[11] === 0x50; // "WEBP"
  if (isWebp) return true;

  return false;
};

const Upload = ({ onComplete }: UploadProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [progress, setProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fileReaderRef = useRef<FileReader | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const redirectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const base64DataRef = useRef<string | null>(null);
  const hasCompletedRef = useRef(false);

  const { isSignedIn } = useOutletContext<AuthContext>();

  useEffect(() => {
    return () => {
      if (fileReaderRef.current) {
        fileReaderRef.current.abort();
        fileReaderRef.current = null;
      }
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
      if (redirectTimeoutRef.current) {
        clearTimeout(redirectTimeoutRef.current);
        redirectTimeoutRef.current = null;
      }
    };
  }, []);

  // Effect handles single-run completion transition when progress reaches 100
  useEffect(() => {
    if (progress >= 100 && !hasCompletedRef.current) {
      hasCompletedRef.current = true;

      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }

      redirectTimeoutRef.current = setTimeout(() => {
        if (base64DataRef.current) {
          onComplete?.(base64DataRef.current);
        }
      }, REDIRECT_DELAY_MS);
    }
  }, [progress, onComplete]);

  const validateFileBasics = (selectedFile: File): string | null => {
    if (selectedFile.size > MAX_FILE_SIZE_BYTES) {
      return "File size exceeds the 50 MB limit.";
    }

    const hasValidExtension = ALLOWED_EXTENSIONS.some((ext) =>
      selectedFile.name.toLowerCase().endsWith(ext)
    );

    if (!hasValidExtension) {
      return "Unsupported file type. Please upload a JPG, PNG, or WebP image.";
    }

    return null;
  };

  const processFile = (selectedFile: File) => {
    if (!isSignedIn) return;

    // Reset previous error
    setErrorMessage(null);

    const initialError = validateFileBasics(selectedFile);
    if (initialError) {
      setErrorMessage(initialError);
      return;
    }

    if (fileReaderRef.current) {
      fileReaderRef.current.abort();
    }

    // Step 1: Read initial slice to inspect magic bytes binary content
    const headerSlice = selectedFile.slice(0, 16);
    const headerReader = new FileReader();

    headerReader.onload = () => {
      const buffer = headerReader.result as ArrayBuffer;
      if (!isValidImageBinary(buffer)) {
        setErrorMessage(
          "Invalid or corrupt image content. Please upload a valid JPG, PNG, or WebP file."
        );
        return;
      }

      // Step 2: Content is valid, now proceed to start upload progress & read full DataURL
      hasCompletedRef.current = false;
      base64DataRef.current = null;
      setFile(selectedFile);
      setProgress(0);

      const fullReader = new FileReader();
      fileReaderRef.current = fullReader;

      fullReader.onload = () => {
        if (fileReaderRef.current !== fullReader) return;

        base64DataRef.current = fullReader.result as string;

        if (progressIntervalRef.current) {
          clearInterval(progressIntervalRef.current);
        }

        progressIntervalRef.current = setInterval(() => {
          setProgress((prev) => Math.min(100, prev + PROGRESS_STEP));
        }, PROGRESS_INTERVAL_MS);
      };

      fullReader.readAsDataURL(selectedFile);
    };

    headerReader.readAsArrayBuffer(headerSlice);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isSignedIn) return;
    setIsDragging(true);
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isSignedIn) return;
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (!isSignedIn) return;

    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles && droppedFiles.length > 0) {
      processFile(droppedFiles[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isSignedIn) return;

    const selectedFiles = e.target.files;
    if (selectedFiles && selectedFiles.length > 0) {
      processFile(selectedFiles[0]);
    }
    // Reset input value so re-selecting the same file also triggers onChange
    e.target.value = "";
  };

  return (
    <div className="upload">
      {!file ? (
        <>
          <div
            className={`dropzone ${isDragging ? "is-dragging" : ""}`}
            onDragOver={handleDragOver}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <input
              type="file"
              className="drop-input"
              accept=".jpg,.jpeg,.png,.webp"
              disabled={!isSignedIn}
              onChange={handleChange}
            />

            <div className="drop-content">
              <div className="drop-icon">
                <UploadIcon size={20} />
              </div>
              <p>
                {isSignedIn
                  ? "Click to upload or just drag and drop"
                  : "Sign in or Sign up with Puter to upload"}
              </p>
              <p className="help">Maximum file size 50 MB.</p>
            </div>
          </div>

          {errorMessage && (
            <div className="mt-3 flex items-center justify-center gap-2 text-xs font-medium text-red-500">
              <AlertCircle size={14} className="shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}
        </>
      ) : (
        <div className="upload-status">
          <div className="status-content">
            <div className="status-icon">
              {progress === 100 ? (
                <CheckCircle2 className="check" />
              ) : (
                <ImageIcon className="image" />
              )}
            </div>

            <h3>{file.name}</h3>

            {/* Progress bar */}
            <div className="progress">
              <div className="bar" style={{ width: `${progress}%` }} />

              <p className="status-text">
                {progress < 100 ? "Analyzing Floor Plan..." : "Redirecting..."}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Upload;
