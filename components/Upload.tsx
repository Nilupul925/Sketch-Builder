import { CheckCircle2, ImageIcon, UploadIcon } from "lucide-react";
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
const ALLOWED_FILE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];
const ALLOWED_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp"];

const Upload = ({ onComplete }: UploadProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [progress, setProgress] = useState(0);

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

  const validateFile = (selectedFile: File): boolean => {
    const isExtensionValid = ALLOWED_EXTENSIONS.some((ext) =>
      selectedFile.name.toLowerCase().endsWith(ext)
    );
    const isMimeValid = ALLOWED_FILE_TYPES.includes(selectedFile.type);

    if (!isExtensionValid && !isMimeValid) {
      return false;
    }

    if (selectedFile.size > MAX_FILE_SIZE_BYTES) {
      return false;
    }

    return true;
  };

  const processFile = (selectedFile: File) => {
    if (!isSignedIn) return;

    if (!validateFile(selectedFile)) {
      return;
    }

    hasCompletedRef.current = false;
    base64DataRef.current = null;
    setFile(selectedFile);
    setProgress(0);

    if (fileReaderRef.current) {
      fileReaderRef.current.abort();
    }

    const reader = new FileReader();
    fileReaderRef.current = reader;

    reader.onload = () => {
      // Guard against callbacks firing after reader was replaced or unmounted
      if (fileReaderRef.current !== reader) return;

      base64DataRef.current = reader.result as string;

      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }

      progressIntervalRef.current = setInterval(() => {
        setProgress((prev) => Math.min(100, prev + PROGRESS_STEP));
      }, PROGRESS_INTERVAL_MS);
    };

    reader.readAsDataURL(selectedFile);
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
