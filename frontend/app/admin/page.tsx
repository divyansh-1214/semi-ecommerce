"use client";

import { useEffect, useState } from "react";
import { api } from "@/services/api"; // Change this path if needed

export default function AdminPage() {
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    api
      .get("/")
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const handleUpload = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!file) {
      alert("Please select a file");
      return;
    }

    const formData = new FormData();

    // Must match upload.single("file") in Express
    formData.append("file", file);

    try {
      const response = await api.post("/api/import", formData);

      console.log(response.data);

      alert("File uploaded successfully");
    } catch (error: any) {
      console.error(error);
      const errorMessage = error.response?.data?.error || "File upload failed";
      alert(errorMessage);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Admin Data Import</h1>
      <form onSubmit={handleUpload} className="space-y-4">
        <input
          type="file"
          name="doc"
          accept=".csv"
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          onChange={(event) => {
            const selectedFile = event.target.files?.[0];
            if (selectedFile) {
              setFile(selectedFile);
            }
          }}
        />

        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          Upload
        </button>
      </form>
    </div>
  );
}
