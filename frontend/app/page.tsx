"use client";

import { useEffect, useState } from "react";
import {api} from "@/services/api"; // Change this path if needed

export default function Home() {
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

    // Must match upload.single("doc") in Express
    formData.append("doc", file);

    try {
      const response = await api.post("/upload", formData);

      console.log(response.data);

      alert("File uploaded successfully");
    } catch (error) {
      console.error(error);

      alert("File upload failed");
    }
  };

  return (
    <>
      <form onSubmit={handleUpload}>
        <input
          type="file"
          name="doc"
          onChange={(event) => {
            const selectedFile = event.target.files?.[0];

            if (selectedFile) {
              setFile(selectedFile);
            }
          }}
        />

        <button type="submit">
          Upload
        </button>
      </form>
    </>
  );
}
