import { useState } from "react";

interface FileUploadProps {
  label?: string;
  onFileSelect: (file: File | null) => void;
}

const FileUpload = ({
  label = "Upload label",
  onFileSelect,
}: FileUploadProps) => {
  const [fileName, setFileName] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file ? file.name : null);
      onFileSelect(file);
    }
  };

  return (
    <div className="flex flex-col w-full gap-3">
      <p className="font-medium text-xl">{label}</p>
      <label
        htmlFor="dropzone-file"
        className="flex flex-col items-center justify-center w-full h-[2.875rem] border rounded-xl cursor-pointer border-pale-200"
      >
        <div className="flex flex-row items-center justify-center text-body gap-2">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M4.75 14.75V16.25C4.75 17.9069 6.09315 19.25 7.75 19.25H16.25C17.9069 19.25 19.25 17.9069 19.25 16.25V14.75"
              stroke="#A6A09B"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M12 14.25V5"
              stroke="#A6A09B"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M8.75 8.25L12 4.75L15.25 8.25"
              stroke="#A6A09B"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <p className={`text-lg ${fileName ? "text-night" : "text-grey"}`}>
            {fileName ? fileName : "Upload a PDF file"}
          </p>
        </div>
        <input
          id="dropzone-file"
          type="file"
          className="hidden"
          onChange={handleFileChange}
        />
      </label>
    </div>
  );
};

export default FileUpload;
