import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../lib/axios";

export const DocumentEditor = () => {
  const { id } = useParams();
  const [document, setDocument] = useState<any>(null);
  
  useEffect(() => {
    const getDocument = async () => {
      
      try {
        const response = await api.get(`/documents/${id}`)
        
        setDocument(response.data)
        
        
      }
      catch (error) {
        console.error("Failed to fetch document", error)
        
        
      }
    }
    getDocument();
  }
    ,
   
    [id])
  
  const saveDocument = async () => {
    try {
      
      api.put(`/documents/${id}`, {
        title: document.title,
        content: document.content
      })
      
    }
    catch (error) {
      console.error("Error in saving th document: ", error);
      alert("Failed to save the changes.");
      
    }
  }
  
  
  if (!document) {
    return <div className="p-8 text-gray-500 ">loading Document...</div>
  }
    

  return (
    <div className="flex-1 flex flex-col bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto w-full">
        {/* Title Area */}
        <input 
          type="text"
          value={document.title}
          onChange={(e) => setDocument({ ...document, title: e.target.value })}
          className="bg-transparent text-4xl font-bold outline-none border-none w-full mb-4"
        />
        
        <p className="text-gray-500 text-sm mb-8">ID: {id}</p>
  
        <button onClick={saveDocument}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow-lg transition">
          Save
        </button>
        
        {/* The Workspace Area */}
        <textarea
          value={document.content || ""}
          onChange={(e) => setDocument({ ...document, content: e.target.value })}
          placeholder="Start typing your brilliance here..."
          className="w-full h-[60vh] bg-transparent border-none outline-none resize-none text-lg leading-relaxed text-gray-200"
        />
      </div>
    </div>
  );
  
}