import { useState, useEffect } from 'react';
import axios from 'axios';
import { Folder, FileText, Plus, RefreshCw } from 'lucide-react';

// 1. Define what a Document looks like
interface Document {
  _id: string;
  title: string;
  isFolder: boolean;
  parentId: string | null;
}

function App() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // --- NEW: Function to Create a Document ---
  const createDocument = async () => {
    const title = prompt("Enter document name:") || "Untitled Doc" 
   

    try {
      const response = await axios.post('http://localhost:3001/documents', {
        title: title,
        isFolder: false, 
        parentId: null   
      });
      // Add the new document to our list immediately
      setDocuments([...documents, response.data]);
    } catch (error) {
      console.error("Error creating doc:", error);
      alert("Failed to create document");
    }
  };
  // -------------------------------------------

  const fetchDocuments = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('http://localhost:3001/documents');
      setDocuments(response.data);
    } catch (error) {
      console.error("Error fetching docs:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  return (
    <div className="flex h-screen bg-gray-900 text-white font-sans">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 border-r border-gray-700 p-4 flex flex-col">
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-400 flex items-center gap-2">
            <span className="p-1 bg-blue-500/20 rounded">📄</span> DocuFlow
          </h1>
        </div>
        
        {/* Document List */}
        <div className="flex-1 overflow-y-auto">
          <div className="flex items-center justify-between mb-2 px-2">
            <div className="text-gray-400 text-xs font-bold uppercase tracking-wider">
              Documents
            </div>
            <button onClick={fetchDocuments} className="text-gray-500 hover:text-white transition">
              <RefreshCw size={14} className={isLoading ? "animate-spin" : ""} />
            </button>
          </div>

          <div className="space-y-1">
            {documents.length === 0 && !isLoading && (
              <div className="text-gray-500 text-sm px-2 italic">No documents yet...</div>
            )}
            
            {documents.map((doc) => (
              <div key={doc._id} className="p-2 hover:bg-gray-700 rounded cursor-pointer flex items-center gap-2 text-gray-300 transition-colors">
                {doc.isFolder ? (
                  <Folder size={16} className="text-blue-400" />
                ) : (
                  <FileText size={16} className="text-gray-400" />
                )}
                <span className="truncate">{doc.title}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col bg-gray-900">
        <div className="h-14 border-b border-gray-700 flex items-center justify-between px-6 bg-gray-900">
          <div className="text-gray-400">Select a document to view</div>
          
          {/* --- UPDATED: The Button now runs createDocument --- */}
          <button 
            onClick={createDocument} 
            className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-colors"
          >
            <Plus size={16} /> New Doc
          </button>
          {/* -------------------------------------------------- */}
          
        </div>
        <div className="flex-1 p-8 flex items-center justify-center text-gray-600">
          <p>Select a file from the sidebar to start editing</p>
        </div>
      </div>
    </div>
  );
}

export default App;