import React, { useState, ChangeEvent, FormEvent } from "react";
import axios from "axios";
const api = axios.create({
  baseURL: "http://localhost:8000",
});

function App(): JSX.Element {
  type ApiResponse = {
    Name: string;
    "Scientific Name": string;
    Population: number;
    "Extinction Status": string;
    Type: string;
    Diet: string;
    Location: string;
    Facts: string[];
  };

  const [file, setFile] = useState<File | null>(null);
  const [responseText, setResponseText] = useState<ApiResponse | null>(null);

  const [imageUrl, setImageUrl] = useState<string>("");

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files ? event.target.files[0] : null;
    setFile(selectedFile);
    if (selectedFile) {
      const url = URL.createObjectURL(selectedFile);
      setImageUrl(url);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!file) {
      return;
    }

    console.log(22);
    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await api.post("/uploadfile/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log(response.data);
      console.log(22);
      setResponseText(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h1
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "10vh",
          fontSize: "4rem",
          fontWeight: "bold",
          textShadow: "2px 2px 4px #000000",
          color: "#ffffff",
          background: "linear-gradient(180deg, #a26d40 0%, #f9c59e 100%)",
          borderRadius: "10px",
          boxShadow: "2px 2px 4px #000000",
        }}
      >
        Bear Type Identification and Bear Fact
      </h1>

      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <input type="file" onChange={handleFileChange} />
        <button type="submit">Upload</button>
      </form>
      {imageUrl && (
        <img
          src={imageUrl}
          alt="Selected file"
          style={{ width: 200, height: 200 }}
        />
      )}
      {responseText && (
        <div>
          <h2>{responseText.Name}</h2>
          <p>Scientific Name: {responseText["Scientific Name"]}</p>
          <p>Population: {responseText.Population}</p>
          <p>Extinction Status: {responseText["Extinction Status"]}</p>
          <p>Type: {responseText.Type}</p>
          <p>Diet: {responseText.Diet}</p>
          <p>Location: {responseText.Location}</p>
          <h3>Facts:</h3>
          {responseText.Facts && (
            <ul>
              {responseText.Facts.map((fact, index) => (
                <li key={index}>{fact}</li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
