import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import api from './lib/axios';
import { DocumentEditor } from './pages/DocumentEditor'
import { Sidebar } from './components/Sidebar'; // Import your new component
import { Plus, FolderPlus } from 'lucide-react';

function App() {
  const [documents, setDocuments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Unified Create function
  const createItem = async (isFolder: boolean = false, parentId: string | null = null) => {
    const type = isFolder ? "folder" : "document";
    const title = prompt(`Enter ${type} name:`) || `Untitled ${type}`;
    try {
      const response = await api.post('/api/documents', { title, isFolder, parentId });
      setDocuments(prev => [...prev, response.data]);
    } catch (error) {
      console.error(error);
    }
  };

  const deleteItem = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    e.preventDefault();
    if (!confirm("Are you sure?")) return;
    try {
      await api.delete(`/api/documents/${id}`);
      setDocuments(prev => prev.filter(doc => doc._id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  const fetchDocuments = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/api/documents');
      setDocuments(response.data);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchDocuments(); }, []);

  return (
    <div className="flex h-screen bg-gray-900 text-white font-sans">
      {/* 1. Uses the new Sidebar component */}
      <Sidebar 
        documents={documents} 
        isLoading={isLoading} 
        onRefresh={fetchDocuments} 
        onCreateItem={createItem} 
        onDeleteItem={deleteItem}
      />

      <div className="flex-1 flex flex-col bg-gray-900">
        <div className="h-14 border-b border-gray-700 flex items-center justify-between px-6 bg-gray-800/50">
          <div className="text-gray-400 text-sm font-medium">DocuFlow Workspace</div>
          <div className="flex gap-2">
             <button onClick={() => createItem(true)} className="flex items-center gap-2 px-3 py-1.5 bg-gray-700 hover:bg-gray-600 rounded text-xs">
              <FolderPlus size={14} /> New Folder
            </button>
            <button onClick={() => createItem(false)} className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 rounded text-xs font-bold">
              <Plus size={14} /> New Doc
            </button>
          </div>
        </div>
      
        <Routes>
          <Route path="/" element={<div className="flex-1 flex items-center justify-center text-gray-600 italic"><p>Select a file to start editing</p></div>} />
          <Route path="/api/documents/:id" element={<DocumentEditor />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;