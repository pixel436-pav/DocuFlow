import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import api from "../lib/axios";
import { debounce } from "lodash";

export const DocumentEditor = () => {
  const { id } = useParams();
  const [document, setDocument] = useState<any>(null);
  // Status can be 'idle', 'saving', or 'saved'
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("saved");

  // 1. Fetch document from API
  useEffect(() => {
    const getDocument = async () => {
      try {
        const response = await api.get(`/api/documents/${id}`);
        setDocument(response.data);
      } catch (error) {
        console.error("Failed to fetch document", error);
      }
    };
    if (id) getDocument();
  }, [id]);

  // 2. The Debounced save function 
  // We wrap the debounce ITSELF in useCallback
  const debouncedSave = useCallback(
    debounce(async (updateDoc) => {
      setSaveStatus("saving");
      try {
        await api.put(`/api/documents/${updateDoc._id}`, {
          title: updateDoc.title,
          content: updateDoc.content,
        });
        setSaveStatus("saved");
      } catch (error) {
        console.error("Auto-Save failed", error);
        setSaveStatus("idle");
      }
    }, 1500), 
    []
  );

  // 3. Centralized Change Handler
  const handleChange = (field: string, value: string) => {
    if (!document) return;
    
    // Update local state for instant UI feedback
    const updated = { ...document, [field]: value };
    setDocument(updated);
    
    // Trigger the debounced API call
    setSaveStatus("saving");
    debouncedSave(updated);
  };

  if (!document) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-900 text-gray-500">
        <div className="animate-pulse">Loading DocuFlow Workspace...</div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-gray-900 text-white p-8 overflow-y-auto">
      <div className="max-w-4xl mx-auto w-full">
        
        {/* Header Section */}
        <div className="flex justify-between items-start mb-6">
          <div className="flex-1">
            <input
              type="text"
              value={document.title}
              onChange={(e) => handleChange("title", e.target.value)}
              className="bg-transparent text-4xl font-bold outline-none border-none w-full text-white placeholder-gray-700"
              placeholder="Untitled Document"
            />
            <p className="text-gray-600 text-xs mt-2 font-mono">DOC_ID: {id}</p>
          </div>

          {/* Status Indicator */}
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-gray-800/50 border border-gray-700">
            <div className={`w-2 h-2 rounded-full ${
              saveStatus === "saving" ? "bg-blue-400 animate-ping" : "bg-green-500"
            }`} />
            <span className="text-[10px] font-bold uppercase tracking-tighter text-gray-400">
              {saveStatus === "saving" ? "Saving..." : "Synced"}
            </span>
          </div>
        </div>

        <hr className="border-gray-800 mb-8" />

        {/* The Workspace Area */}
        <textarea
          value={document.content || ""}
          onChange={(e) => handleChange("content", e.target.value)}
          placeholder="Start typing your brilliance here..."
          className="w-full h-[65vh] bg-transparent border-none outline-none resize-none text-lg leading-relaxed text-gray-300 placeholder-gray-700"
        />
        
      </div>
      </div>
      ); // This closes the return
      }; // This closes the DocumentEditor component 