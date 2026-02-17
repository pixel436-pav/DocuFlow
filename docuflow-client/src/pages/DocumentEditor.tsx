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
  
  if (!document) {
    return <div className="p-8 text-gray-500 ">loading Document...</div>
  }
    
  
  return (
      <div className="text-white p-8">
        {/* SUCCESS: We now show the real title from the server! */}
        <h1 className="text-3xl font-bold">{document.title}</h1>
        <p className="text-gray-400 mt-2 text-sm italic">Database ID: {id}</p>
        
        <div className="mt-10 p-4 border border-gray-700 rounded bg-gray-800">
           <p className="text-gray-300">
             {document.content || "This document is empty. Start writing soon!"}
           </p>
        </div>
      </div>
    );
  
}