"use client";

import { useState } from "react";
import { fetchImportCSV } from "@/services/serverApi";
import { ImportReport } from "@/types";
import Loader from "@/components/ui/Loader";
import { Upload, CheckCircle, AlertTriangle, FileText } from "lucide-react";

export default function AdminPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [report, setReport] = useState<ImportReport | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setReport(null);

    if (!file) {
      setError("Please select a file first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setIsUploading(true);

    try {
      const result = await fetchImportCSV(formData);
      setReport(result);
      setFile(null);
      // Reset file input
      const fileInput = document.querySelector<HTMLInputElement>('input[type="file"]');
      if (fileInput) fileInput.value = "";
    } catch (err: any) {
      setError(err.message || "File upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-semibold text-gray-900 mb-2">Data Import</h1>
      <p className="text-sm text-gray-500 mb-8">
        Upload a tab-separated CSV file to import product catalog data.
      </p>

      {/* Upload Card */}
      <form onSubmit={handleUpload}>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-[#24408e]/40 transition-colors">
          <Upload className="mx-auto mb-3 text-gray-400" size={32} />

          {file ? (
            <div className="flex items-center justify-center gap-2 mb-4">
              <FileText size={16} className="text-[#24408e]" />
              <span className="text-sm font-medium text-gray-700">{file.name}</span>
              <span className="text-xs text-gray-400">
                ({(file.size / 1024).toFixed(1)} KB)
              </span>
            </div>
          ) : (
            <p className="text-sm text-gray-500 mb-4">
              Choose a .csv file or drag it here
            </p>
          )}

          <input
            type="file"
            accept=".csv"
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-[#24408e]/10 file:text-[#24408e] hover:file:bg-[#24408e]/20 file:cursor-pointer file:transition-colors"
            onChange={(event) => {
              const selectedFile = event.target.files?.[0];
              if (selectedFile) {
                setFile(selectedFile);
                setError(null);
                setReport(null);
              }
            }}
          />
        </div>

        <button
          type="submit"
          disabled={isUploading || !file}
          className="mt-4 w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#24408e] text-white text-sm font-medium rounded-md hover:bg-[#1d3472] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isUploading ? (
            <>
              <Loader size="sm" />
              Importing...
            </>
          ) : (
            <>
              <Upload size={16} />
              Upload & Import
            </>
          )}
        </button>
      </form>

      {/* Error Banner */}
      {error && (
        <div className="mt-6 flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
          <AlertTriangle className="text-red-500 shrink-0 mt-0.5" size={18} />
          <div>
            <p className="text-sm font-medium text-red-800">Import failed</p>
            <p className="text-sm text-red-600 mt-1">{error}</p>
          </div>
        </div>
      )}

      {/* Import Report */}
      {report && (
        <div className="mt-6 border border-gray-200 rounded-lg overflow-hidden">
          <div className="flex items-center gap-2 p-4 bg-green-50 border-b border-green-200">
            <CheckCircle className="text-green-600" size={18} />
            <span className="text-sm font-medium text-green-800">Import completed</span>
          </div>
          <div className="p-4 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Rows processed</span>
              <span className="font-medium text-gray-900">{report.rowsProcessed}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Rows failed</span>
              <span className={`font-medium ${report.rowsFailed > 0 ? "text-red-600" : "text-gray-900"}`}>
                {report.rowsFailed}
              </span>
            </div>
            {report.errors.length > 0 && (
              <div className="mt-3 pt-3 border-t border-gray-100">
                <p className="text-xs font-medium text-gray-500 mb-2">Errors:</p>
                <ul className="space-y-1">
                  {report.errors.slice(0, 10).map((err, i) => (
                    <li key={i} className="text-xs text-red-600 bg-red-50 rounded px-2 py-1">
                      {err}
                    </li>
                  ))}
                  {report.errors.length > 10 && (
                    <li className="text-xs text-gray-400">
                      ...and {report.errors.length - 10} more errors
                    </li>
                  )}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
