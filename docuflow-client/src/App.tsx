import { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import api from './lib/axios';
import { DocumentEditor } from './pages/DocumentEditor';
import { Sidebar } from './components/Sidebar';
import { Plus, FolderPlus } from 'lucide-react';
import Login from './pages/Login'; //  Import your new Login page
import { useAuth } from './context/AuthContext'; //  Import your Brain

function App() {
  // 1. Ask the Global Brain if we are logged in
  const { token, loading } = useAuth(); 

  const [documents, setDocuments] = useState<any[]>([]);
  const [isDocsLoading, setIsDocsLoading] = useState(false); // Renamed to avoid clashing with Auth loading

  // Unified Create function
  const createItem = async (isFolder: boolean = false, parentId: string | null = null) => {
    const type = isFolder ? "folder" : "document";
    const title = prompt(`Enter ${type} name:`) || `Untitled ${type}`;
    try {
      const response = await api.post('/documents', { title, isFolder, parentId }); // Make sure URL matches backend exactly!
      setDocuments(prev => [...prev, response.data]);
    } catch (error) {
      console.error(error);
    }
  };
  
  const renameItem = async (e: React.MouseEvent, id: string, currentTitle: string) => {
    e.stopPropagation();
    e.preventDefault();
    
    const newTitle = prompt("Rename to:", currentTitle);
    if (!newTitle || newTitle === currentTitle) return;
  
    try {
      const response = await api.put(`/documents/${id}`, { title: newTitle });
      setDocuments(prev => prev.map(doc => doc._id === id ? response.data : doc));
    } catch (error) {
      console.error("Rename failed", error);
    }
  };

  const deleteItem = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    e.preventDefault();
    if (!confirm("Are you sure?")) return;
    try {
      await api.delete(`/documents/${id}`);
      setDocuments(prev => prev.filter(doc => doc._id !== id));
    } catch (error) {
      console.error(error);
    }
  };
  
  const handleDocumentUpdate = (updatedDoc: any) => {
      setDocuments(prev => prev.map(doc => doc._id === updatedDoc._id ? updatedDoc : doc));
  };

  const fetchDocuments = async () => {
    setIsDocsLoading(true);
    try {
      const response = await api.get('/documents'); // Make sure URL matches backend exactly
      setDocuments(response.data);
    } catch (error) {
       console.error("Failed to fetch documents", error);
    } finally {
      setIsDocsLoading(false);
    }
  };

  //  2. ONLY fetch documents if the user actually has a token!
  useEffect(() => { 
    if (token) {
      fetchDocuments(); 
    }
  }, [token]);

  // 3. Show a blank screen while the Brain checks localStorage
  if (loading) {
    return <div className="flex h-screen items-center justify-center bg-gray-900 text-white">Loading...</div>;
  }

  //  4. THE BOUNCER UI: If no token, ONLY show the Login page (hide Sidebar!)
  if (!token) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        {/* If they try to go anywhere else, force them to login */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    );
  }

  // 5. IF LOGGED IN: Show the beautiful DocuFlow Dashboard
  return (
    <div className="flex h-screen bg-gray-900 text-white font-sans">
      <Sidebar 
        onRenameItem={renameItem}
        documents={documents} 
        isLoading={isDocsLoading} 
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
          {/* If they are logged in and try to go to /login, redirect back home */}
          <Route path="/login" element={<Navigate to="/" />} />
          <Route path="/" element={<div className="flex-1 flex items-center justify-center text-gray-600 italic"><p>Select a file to start editing</p></div>} />
          <Route path="/api/documents/:id" element={<DocumentEditor onDocumentUpdate={handleDocumentUpdate} />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;