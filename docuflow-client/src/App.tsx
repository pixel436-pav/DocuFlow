import { useState, useEffect } from 'react';
import { Routes, Route, Outlet,Link } from 'react-router-dom';
// 1. We import the helper we just made above
import api from './lib/axios';
import {DocumentEditor} from './pages/DocumentEditor'
import { Folder, FileText, Plus, RefreshCw, Trash2 } from 'lucide-react';

interface Document {
  _id: string;
  title: string;
  isFolder: boolean;
  parentId: string | null;
}

function App() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // --- Function: Create Document ---
  const createDocument = async () => {
    const title = prompt("Enter document name:") || "Untitled Doc"; 

    try {
      // Cleaner call! No 'http://localhost' needed
      const response = await api.post('/documents', {
        title: title,
        isFolder: false, 
        parentId: null   
      });
      setDocuments([...documents, response.data]);
    } catch (error) {
      console.error("Error creating doc:", error);
      alert("Failed to create document");
    }
  };

  // --- Function: Delete Document ---
  const deleteDocument = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation(); // Prevents clicking the row when clicking delete

    if (!confirm("Are you sure you want to delete this?")) return;

    try {
      await api.delete(`/documents/${id}`);
      // Remove the deleted doc from the list on screen
      setDocuments(documents.filter(doc => doc._id !== id));
    } catch (error) {
      console.error("Error deleting doc:", error);
      alert("Failed to delete");
    }
  };

  // --- Function: Fetch Documents ---
  const fetchDocuments = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/documents');
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
              <Link
                key={doc._id}
                to={`/documents/${doc._id}`}
                className='block text-inherit no-underline'
                 >
                <div 
                key={doc._id} 
                className="group p-2 hover:bg-gray-700 rounded cursor-pointer flex items-center justify-between text-gray-300 transition-colors"
              >
                <div className="flex items-center gap-2 truncate">
                  {doc.isFolder ? (
                    <Folder size={16} className="text-blue-400" />
                  ) : (
                    <FileText size={16} className="text-gray-400" />
                  )}
                  <span className="truncate">{doc.title}</span>
                </div>

                {/* The Delete Button (Only shows on hover) */}
                <button 
                  onClick={(e) => deleteDocument(e, doc._id)}
                  className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-500/20 hover:text-red-400 rounded transition-all"
                  title="Delete"
                >
                  <Trash2 size={14} />
                </button>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      
      {/* 1. The wrapper div stays OUTSIDE */}
      <div className="flex-1 flex flex-col bg-gray-900">
        
        {/* 2. Your Header stays OUTSIDE (so it's always visible) */}
        <div className="h-14 border-b border-gray-700 flex items-center justify-between px-6 bg-gray-900">
          <div className="text-gray-400">DocuFlow Workspace</div>
          <button onClick={createDocument} className="bg-blue-600 ...">
            <Plus size={16} /> New Doc
          </button>
        </div>
      
        {/* 3. The Routes block ONLY contains Route components */}
        <Routes>
          <Route 
            path="/" 
            element={
              <div className="flex-1 p-8 flex items-center justify-center text-gray-600">
                <p>Select a file from the sidebar to start editing</p>
              </div>
            } 
          />
          <Route path="/documents/:id" element={<DocumentEditor />} />
        </Routes>
      </div>
     
    </div>
  );
}

export default App;