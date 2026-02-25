import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Folder, FileText, Plus, RefreshCw, Trash2, ChevronDown, ChevronRight, Search } from 'lucide-react';

interface SidebarProps {
  documents: any[];
  isLoading: boolean;
  onRefresh: () => void;
  onCreateItem: (isFolder: boolean, parentId?: string | null) => void;
  onDeleteItem: (e: React.MouseEvent, id: string) => void;
}

export const Sidebar = ({ documents, isLoading, onRefresh, onCreateItem, onDeleteItem }: SidebarProps) => {
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({});
  
  // Search Bar 
  const [searchQuery, setSearchQuery] = useState('');

  const toggleFolder = (id: string) => {
    setExpandedFolders(prev => ({ ...prev, [id]: !prev[id] }));
  };
  
  // Filter the documents based on the search input 
  const searchResults = documents.filter(doc => 
    doc.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const folders = documents.filter(doc => doc.isFolder);
  const rootDocs = documents.filter(doc => !doc.isFolder && !doc.parentId);

  return (
    <div className="w-64 bg-gray-800 border-r border-gray-700 p-4 flex flex-col">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-blue-400 flex items-center gap-2">
          <span className="p-1 bg-blue-500/20 rounded">📄</span> DocuFlow
        </h1>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="flex items-center justify-between mb-4 px-2">
          <div className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">Workspace</div>
          <button onClick={onRefresh} className="text-gray-500 hover:text-white transition">
            <RefreshCw size={14} className={isLoading ? "animate-spin" : ""} />
          </button>
        </div>
        
        {/* 3. The Search Bar UI (Flexbox Version) */}
        <div className="px-2 mb-4">
          <div className="flex items-center bg-gray-900 border border-gray-700 rounded-md px-3 focus-within:border-blue-500 transition-colors">
            {/* The Icon sits naturally to the left */}
            <Search size={14} className="text-gray-500 flex-shrink-0" />
            
            {/* The Input has NO border of its own, so it blends into the container */}
            <input 
              type="text"
              placeholder="Search docs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent text-sm text-gray-300 pl-2 py-2 outline-none border-none focus:ring-0"
            />
          </div>
        </div>
        
        <div className="space-y-1">
          {/* 4. Conditional Rendering: Are we searching? */}
          {searchQuery ? (
            
            // --- SEARCH VIEW (Flat List) ---
            searchResults.length > 0 ? (
              searchResults.map((doc) => (
                <Link key={doc._id} to={`/api/documents/${doc._id}`} className="group p-2 hover:bg-gray-700 rounded flex items-center justify-between text-gray-300">
                  <div className="flex items-center gap-2 truncate">
                    {doc.isFolder ? <Folder size={14} className="text-blue-400 flex-shrink-0" /> : <FileText size={14} className="text-gray-400 flex-shrink-0" />}
                    <span className="text-sm truncate">{doc.title}</span>
                  </div>
                </Link>
              ))
            ) : (
              <div className="text-center text-gray-500 text-xs mt-4 italic">No matching documents</div>
            )

          ) : (
            // --- NORMAL VIEW (Folders & Roots) ---
            <>
              {/* Folders */}
              {folders.map((folder) => (
                <div key={folder._id} className="flex flex-col">
                  <div 
                    onClick={() => toggleFolder(folder._id)}
                    className="group flex items-center justify-between p-2 hover:bg-gray-700 rounded cursor-pointer text-gray-300"
                  >
                    <div className="flex items-center gap-2 truncate">
                      {expandedFolders[folder._id] ? <ChevronDown size={14}/> : <ChevronRight size={14}/>}
                      <Folder size={16} className="text-blue-400 flex-shrink-0" />
                      <span className="text-sm font-medium truncate">{folder.title}</span>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={(e) => { e.stopPropagation(); onCreateItem(false, folder._id); }} title="Add Doc">
                        <Plus size={14} className="hover:text-blue-400" />
                      </button>
                      <button onClick={(e) => onDeleteItem(e, folder._id)}>
                        <Trash2 size={14} className="hover:text-red-400" />
                      </button>
                    </div>
                  </div>

                  {/* Nested Docs */}
                  {expandedFolders[folder._id] && (
                    <div className="ml-4 pl-2 border-l border-gray-700 space-y-1 mt-1 mb-2">
                      {documents.filter(d => d.parentId === folder._id).map(child => (
                        <Link key={child._id} to={`/api/documents/${child._id}`} className="group flex items-center justify-between p-2 hover:bg-gray-700/50 rounded text-gray-400 text-sm">
                          <div className="flex items-center gap-2 truncate">
                            <FileText size={14} className="flex-shrink-0" />
                            <span className="truncate">{child.title}</span>
                          </div>
                          <Trash2 size={12} className="opacity-0 group-hover:opacity-100 hover:text-red-400" onClick={(e) => onDeleteItem(e, child._id)}/>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {/* Root Docs */}
              {rootDocs.map((doc) => (
                <Link key={doc._id} to={`/api/documents/${doc._id}`} className="group p-2 hover:bg-gray-700 rounded flex items-center justify-between text-gray-300">
                  <div className="flex items-center gap-2 truncate">
                    <FileText size={16} className="text-gray-400 flex-shrink-0" />
                    <span className="text-sm truncate">{doc.title}</span>
                  </div>
                  <button onClick={(e) => onDeleteItem(e, doc._id)} className="opacity-0 group-hover:opacity-100 hover:text-red-400">
                    <Trash2 size={14} />
                  </button>
                </Link>
              ))}
            </>
          )} {/* <--- THIS is the missing bracket that broke everything! */}
        </div>
      </div>
    </div>
  );
};