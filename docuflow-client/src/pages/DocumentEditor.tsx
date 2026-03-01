

import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import api from "../lib/axios";
import { debounce, update } from "lodash";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { 
  Bold, Italic, Strikethrough, Heading1, Heading2, 
  List, ListOrdered, Code, Quote, Undo, Redo 
} from 'lucide-react';
import {TextStyle} from '@tiptap/extension-text-style';
import {FontFamily} from '@tiptap/extension-font-family';

// 1. The MenuBar Component
const MenuBar = ({ editor }: { editor: any }) => {
  if (!editor) {
    return null;
  }

  // A helper function to make our buttons look "active" when clicked
  const getButtonClass = (isActive: boolean) => 
    `p-2 rounded hover:bg-gray-700 transition-colors ${isActive ? 'bg-gray-700 text-blue-400' : 'text-gray-400'}`;

  return (
    <div className="flex flex-wrap items-center gap-1 p-2 bg-gray-800 border-b border-gray-700 rounded-t-lg">
      {/* 1. Basic Formatting */}
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        className={getButtonClass(editor.isActive('bold'))}
        title="Bold"
      >
        <Bold size={16} />
      </button>
      
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        className={getButtonClass(editor.isActive('italic'))}
        title="Italic"
      >
        <Italic size={16} />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleStrike().run()}
        disabled={!editor.can().chain().focus().toggleStrike().run()}
        className={getButtonClass(editor.isActive('strike'))}
        title="Strikethrough"
      >
        <Strikethrough size={16} />
      </button>

      <div className="w-px h-6 bg-gray-700 mx-1"></div> {/* Divider */}

      {/* 2. FONT FAMILY DROPDOWN */}
      <select
        onChange={(e) => {
          if (e.target.value === 'default') {
            editor.chain().focus().unsetFontFamily().run();
          } else {
            editor.chain().focus().setFontFamily(e.target.value).run();
          }
        }}
        className="bg-gray-900 text-gray-400 text-xs border border-gray-700 rounded px-2 py-1 outline-none focus:border-blue-500 transition-colors cursor-pointer"
        title="Font Family"
      >
        <option value="default">Default Font</option>
        <option value="Inter">Inter</option>
        <option value="monospace">Monospace</option>
        <option value="serif">Serif</option>
        <option value="cursive">Cursive</option>
        <option value="Comic Sans MS, Comic Sans">Comic Sans</option>
      </select>

      <div className="w-px h-6 bg-gray-700 mx-1"></div> {/* Divider */}

      {/* 3. Headings */}
      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={getButtonClass(editor.isActive('heading', { level: 1 }))}
        title="Heading 1"
      >
        <Heading1 size={16} />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={getButtonClass(editor.isActive('heading', { level: 2 }))}
        title="Heading 2"
      >
        <Heading2 size={16} />
      </button>

      <div className="w-px h-6 bg-gray-700 mx-1"></div> {/* Divider */}

      {/* 4. Lists & Quotes */}
      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={getButtonClass(editor.isActive('bulletList'))}
        title="Bullet List"
      >
        <List size={16} />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={getButtonClass(editor.isActive('orderedList'))}
        title="Numbered List"
      >
        <ListOrdered size={16} />
      </button>

      <button
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={getButtonClass(editor.isActive('blockquote'))}
        title="Quote"
      >
        <Quote size={16} />
      </button>

      <div className="w-px h-6 bg-gray-700 mx-1"></div> {/* Divider */}

      {/* 5. History (Undo/Redo) */}
      <button
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().chain().focus().undo().run()}
        className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors disabled:opacity-50"
        title="Undo"
      >
        <Undo size={16} />
      </button>

      <button
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().chain().focus().redo().run()}
        className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors disabled:opacity-50"
        title="Redo"
      >
        <Redo size={16} />
      </button>
    </div>
  );
};

export const DocumentEditor = ({ onDocumentUpdate }: { onDocumentUpdate?: (doc: any) => void }) => {
  const { id } = useParams();
  const [document, setDocument] = useState<any>(null);
  // Status can be 'idle', 'saving', or 'saved'
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("saved");
  const [folders, setFolders] = useState<any[]>([]);
  
  useEffect(() => {
    const fetchFolder = async () => {
      try {
        const response = await api.get('/api/documents');
        setFolders(response.data.filter((d:any)=>d.isFolder))
      } catch (error) {
        console.error("Failed to Fetch Document ", error)
        
      }
    };
    fetchFolder();
  },[])
  
  const editor = useEditor({
    extensions: [StarterKit,TextStyle,FontFamily],
    content: '',
    // this editor class gives it a bit of padding and maked it looks like a page
    editorProps: {
      attributes: {
        class: 'prose prose-invert max-w-none focus:outline-none min-h-[500px] p-4',
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      handleChange("content",html)
    }
  })

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
// this push data into tiptap when it arrives
useEffect(() => {
  if (!editor || !document) return;

  // We force Tiptap to load the new text from the database.
      // The fallback || "" ensures it doesn't crash if the document is completely blank.
      editor.commands.setContent(document.content || "");
      
    // The magic is here: We ONLY run this effect when the specific document._id changes.
    // This means it fires exactly once every time you click a different document in the sidebar!
    }, [document?._id, editor]);
  
  
// The Debounced save function 
  
  const debouncedSave = useCallback(
    debounce(async (updateDoc) => {
      
     
      setSaveStatus("saving");
      try {
        const response = await api.put(`/api/documents/${updateDoc._id}`, {
          title: updateDoc.title,
          content: updateDoc.content,
          parentId: updateDoc.parentId
        });
        setSaveStatus("saved");
        if (onDocumentUpdate) {
          onDocumentUpdate(response.data)
        }
      } catch (error) {
        console.error("Auto-Save failed", error);
        setSaveStatus("idle");
      }
    }, 1500), 
    []
  );

  // 3. Centralized Change Handler
  const handleChange = (field: string, value: string | null) => {
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
          
          {/* --- HEADER SECTION --- */}
          <div className="flex justify-between items-start mb-6">
            <div className="flex-1">
              <input
                type="text"
                value={document.title}
                onChange={(e) => handleChange("title", e.target.value)}
                className="bg-transparent text-4xl font-bold outline-none border-none w-full text-white placeholder-gray-700 mb-2"
                placeholder="Untitled Document"
              />
              
              <div className="flex items-center gap-4">
                <p className="text-gray-600 text-xs font-mono">DOC_ID: {id}</p>
                
                {/* The "Move to Folder" Dropdown */}
                <select 
                  value={document.parentId || ""} 
                  onChange={(e) => handleChange("parentId", e.target.value || null)}
                  className="bg-gray-800 text-xs text-gray-400 border border-gray-700 rounded px-2 py-1 outline-none focus:border-blue-500 transition-colors cursor-pointer"
                >
                  <option value="">📁 Root Workspace</option>
                  {folders.map(f => (
                    f._id !== document._id && (
                      <option key={f._id} value={f._id}>
                        ↳ Move to {f.title}
                      </option>
                    )
                  ))}
                </select>
              </div>
            </div>
  
            {/* --- STATUS INDICATOR --- */}
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-gray-800/50 border border-gray-700 mt-2">
              <div className={`w-2 h-2 rounded-full ${
                saveStatus === "saving" ? "bg-blue-400 animate-ping" : "bg-green-500"
              }`} />
              <span className="text-[10px] font-bold uppercase tracking-tighter text-gray-400">
                {saveStatus === "saving" ? "Saving..." : "Synced"}
              </span>
            </div>
          </div>
  
          <hr className="border-gray-800 mb-8" />
          
          {/* --- TIPTAP EDITOR SURFACE --- */}
          <div className="bg-gray-800/50 rounded-lg border border-gray-700 shadow-2xl flex flex-col min-h-[500px]">
            
            <MenuBar editor={editor} />
            
            <div className="flex-1 p-4 overflow-y-auto cursor-text" onClick={() => editor?.commands.focus()}>
              <EditorContent editor={editor}/>
            </div>
            
          </div>
          
        </div>
      </div>
    ); 
  };