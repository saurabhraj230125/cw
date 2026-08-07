"use client";

import { useState, useEffect, useMemo } from "react";
import { 
  BookOpen, FileText, Upload, Loader2, Link2, FileUp, 
  Trash2, Folder, FolderOpen, ChevronRight, ChevronDown, Search 
} from "lucide-react";
import { getBatches } from "../../actions/batch-actions";
import { getBranchAcademics, uploadStudyMaterialAction, deleteStudyMaterialAction } from "../../actions/academic-actions";

export default function StudyMaterialPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [batches, setBatches] = useState<any[]>([]);
  const [materials, setMaterials] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Smart Folder States
  const [expandedBatches, setExpandedBatches] = useState<Record<string, boolean>>({});
  const [expandedTypes, setExpandedTypes] = useState<Record<string, boolean>>({});

  // Form State
  const [matBatch, setMatBatch] = useState("");
  const [matTitle, setMatTitle] = useState("");
  const [matType, setMatType] = useState("DPP");
  const [matFile, setMatFile] = useState<File | null>(null); 

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setIsLoading(true);
    try {
      const [fetchedBatches, academics] = await Promise.all([
        getBatches(),
        getBranchAcademics()
      ]);
      setBatches(fetchedBatches);
      setMaterials(academics.materials);
      
      // Auto-expand the first batch if available
      if (fetchedBatches.length > 0 && academics.materials.length > 0) {
        setExpandedBatches({ [academics.materials[0].batch_name]: true });
      }
    } catch (error) {
      console.error("Failed to load materials");
    } finally {
      setIsLoading(false);
    }
  }

  const handleUploadMaterial = async () => {
    if (!matBatch || !matTitle || !matFile) return alert("Select a batch, title, and file.");
    setIsSaving(true);
    try {
      const formData = new FormData();
      formData.append("batch_name", matBatch);
      formData.append("title", matTitle);
      formData.append("document_type", matType);
      formData.append("file", matFile);

      await uploadStudyMaterialAction(formData);
      setMatTitle(""); setMatFile(null);
      
      const fileInput = document.getElementById("file-upload") as HTMLInputElement;
      if (fileInput) fileInput.value = "";
      
      // Auto-expand the folder they just uploaded to
      setExpandedBatches(prev => ({ ...prev, [matBatch]: true }));
      setExpandedTypes(prev => ({ ...prev, [`${matBatch}-${matType}`]: true }));
      
      await loadData();
    } catch (err: any) { alert(err.message); } 
    finally { setIsSaving(false); }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"? This cannot be undone.`)) return;
    
    setDeletingId(id);
    try {
      await deleteStudyMaterialAction(id);
      await loadData(); // Refresh the list
    } catch (error: any) {
      alert("Failed to delete: " + error.message);
    } finally {
      setDeletingId(null);
    }
  };

  const toggleBatchFolder = (batchName: string) => {
    setExpandedBatches(prev => ({ ...prev, [batchName]: !prev[batchName] }));
  };

  const toggleTypeFolder = (batchName: string, type: string) => {
    const key = `${batchName}-${type}`;
    setExpandedTypes(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // ==========================================
  // DEEP ORGANIZATION: Grouping logic
  // ==========================================
  const groupedMaterials = useMemo(() => {
    const filtered = materials.filter(m => m.title.toLowerCase().includes(searchQuery.toLowerCase()));
    const groups: Record<string, Record<string, any[]>> = {};

    filtered.forEach(mat => {
      if (!groups[mat.batch_name]) groups[mat.batch_name] = {};
      const type = mat.document_type || "Uncategorized";
      if (!groups[mat.batch_name][type]) groups[mat.batch_name][type] = [];
      groups[mat.batch_name][type].push(mat);
    });

    return groups;
  }, [materials, searchQuery]);

  if (isLoading) return <div className="min-h-screen bg-erp-bg flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-cw-blue" /></div>;

  return (
    <main className="min-h-screen bg-erp-bg font-sans flex flex-col pb-10">
      <div className="bg-white border-b border-erp-border shrink-0 shadow-sm px-6 py-4 flex justify-between items-center z-10 relative">
        <h2 className="text-erp-lg text-gray-900 font-bold uppercase tracking-wide flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-cw-blue" /> Study Materials & DPPs
        </h2>
      </div>

      <div className="flex-1 p-6 max-w-[1400px] mx-auto w-full grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* LEFT: UPLOAD FORM */}
        <div className="xl:col-span-1">
          <div className="bg-white border border-erp-border rounded-erp shadow-sm p-6 space-y-5 sticky top-6">
            <h3 className="text-erp-md font-bold text-gray-800 uppercase border-b border-erp-borderLight pb-2">Upload New Material</h3>
            
            <div className="space-y-1.5">
              <label className="text-erp-sm font-bold text-gray-700">Target Batch <span className="text-cw-red">*</span></label>
              <select value={matBatch} onChange={e => setMatBatch(e.target.value)} className="w-full border border-erp-border p-2 focus:border-cw-blue outline-none shadow-inner rounded-sm bg-white cursor-pointer">
                <option value="">-- Select Target Batch --</option>
                {batches.map(b => <option key={b.id} value={b.name}>{b.name}</option>)}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-erp-sm font-bold text-gray-700">Material Title <span className="text-cw-red">*</span></label>
              <input type="text" value={matTitle} onChange={e => setMatTitle(e.target.value)} placeholder="e.g. Thermodynamics DPP 04" className="w-full border border-erp-border p-2 focus:border-cw-blue shadow-inner outline-none rounded-sm" />
            </div>

            <div className="space-y-1.5">
              <label className="text-erp-sm font-bold text-gray-700">Folder Category</label>
              <select value={matType} onChange={e => setMatType(e.target.value)} className="w-full border border-erp-border p-2 focus:border-cw-blue outline-none shadow-inner rounded-sm bg-white cursor-pointer">
                <option value="DPP">Daily Practice Problem (DPP)</option>
                <option value="Class Notes">Class Notes / PDF</option>
                <option value="Formula Sheet">Formula Sheet</option>
                <option value="Mock Test PDF">Mock Test PDF</option>
              </select>
            </div>

            <div className="space-y-1.5 pt-2">
              <label className="text-erp-sm font-bold text-gray-700">Attach Document (PDF/Image) <span className="text-cw-red">*</span></label>
              <label htmlFor="file-upload" className={`w-full border-2 border-dashed rounded-erp flex flex-col items-center justify-center p-6 cursor-pointer transition-all ${matFile ? 'border-cw-green bg-pastel-greenBg' : 'border-gray-300 hover:border-cw-blue hover:bg-pastel-blueBg'}`}>
                <FileUp className={`w-8 h-8 mb-2 ${matFile ? 'text-cw-green' : 'text-gray-400'}`} />
                <span className="text-erp-sm font-bold text-gray-600 text-center">
                  {matFile ? <span className="text-cw-green">{matFile.name}</span> : "Click to browse or drag file here"}
                </span>
                <input id="file-upload" type="file" accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" onChange={(e) => setMatFile(e.target.files ? e.target.files[0] : null)} className="hidden" />
              </label>
            </div>

            <button onClick={handleUploadMaterial} disabled={isSaving || !matBatch || !matFile} className="w-full bg-cw-blue text-white py-2.5 font-bold rounded-erp mt-4 hover:bg-cw-blueDark flex justify-center items-center gap-2 shadow-erp-button disabled:opacity-50 transition-colors">
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />} 
              {isSaving ? "Uploading to Cloud..." : "Upload & Organize"}
            </button>
          </div>
        </div>

        {/* RIGHT: SMART FOLDER SYSTEM */}
        <div className="xl:col-span-2">
          <div className="bg-white border border-erp-border rounded-erp shadow-sm overflow-hidden min-h-[600px] flex flex-col">
            
            {/* Vault Header & Search */}
            <div className="bg-erp-header px-5 py-4 border-b border-erp-border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h3 className="text-erp-md font-bold text-gray-800 uppercase tracking-wide">Cloud Drive Vault</h3>
                <p className="text-[11px] text-gray-500 font-bold">{materials.length} Files Organized by Batch</p>
              </div>
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input 
                  type="text" 
                  placeholder="Search files..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 border border-erp-border rounded-sm text-sm outline-none focus:border-cw-blue shadow-inner"
                />
              </div>
            </div>

            {/* Folder Explorer */}
            <div className="flex-1 overflow-y-auto bg-gray-50/30 p-4">
              {Object.keys(groupedMaterials).length === 0 ? (
                <div className="text-center py-20 text-gray-400 font-medium flex flex-col items-center gap-2">
                  <FolderOpen className="w-12 h-12 opacity-20" />
                  {searchQuery ? "No files match your search." : "The vault is empty. Upload your first material."}
                </div>
              ) : (
                <div className="space-y-3">
                  {Object.entries(groupedMaterials).map(([batchName, types]) => {
                    const isBatchExpanded = expandedBatches[batchName];
                    const batchFileCount = Object.values(types).flat().length;

                    return (
                      <div key={batchName} className="bg-white border border-erp-border rounded-erp overflow-hidden shadow-sm transition-all">
                        
                        {/* Batch Folder Header */}
                        <div 
                          onClick={() => toggleBatchFolder(batchName)}
                          className="px-4 py-3 bg-gray-50 hover:bg-pastel-blueBg/50 border-b border-transparent cursor-pointer flex items-center justify-between group"
                        >
                          <div className="flex items-center gap-3">
                            {isBatchExpanded ? <FolderOpen className="w-5 h-5 text-cw-blue" /> : <Folder className="w-5 h-5 text-cw-blue" />}
                            <h4 className="font-bold text-gray-800 uppercase tracking-wide">{batchName}</h4>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-[10px] font-bold text-gray-500 bg-gray-200 px-2 py-0.5 rounded-sm">{batchFileCount} files</span>
                            {isBatchExpanded ? <ChevronDown className="w-4 h-4 text-gray-400" /> : <ChevronRight className="w-4 h-4 text-gray-400" />}
                          </div>
                        </div>

                        {/* Document Type Sub-Folders */}
                        {isBatchExpanded && (
                          <div className="p-2 pl-6 bg-white border-t border-erp-borderLight space-y-2">
                            {Object.entries(types).map(([type, files]) => {
                              const folderKey = `${batchName}-${type}`;
                              const isTypeExpanded = expandedTypes[folderKey];

                              return (
                                <div key={type} className="rounded-sm border border-transparent">
                                  <div 
                                    onClick={() => toggleTypeFolder(batchName, type)}
                                    className="px-3 py-2 flex items-center justify-between hover:bg-gray-50 cursor-pointer rounded-sm"
                                  >
                                    <div className="flex items-center gap-2">
                                      <ChevronRight className={`w-3.5 h-3.5 text-gray-400 transition-transform ${isTypeExpanded ? 'rotate-90' : ''}`} />
                                      <Folder className="w-4 h-4 text-gray-500" />
                                      <span className="font-bold text-sm text-gray-700">{type}</span>
                                    </div>
                                    <span className="text-[10px] font-bold text-gray-400">{files.length} items</span>
                                  </div>

                                  {/* Actual Files */}
                                  {isTypeExpanded && (
                                    <div className="pl-10 pr-2 py-1 space-y-1 border-l-2 border-gray-100 ml-4 mt-1">
                                      {files.map(file => (
                                        <div key={file.id} className="flex items-center justify-between p-2 hover:bg-pastel-blueBg rounded-sm group transition-colors border border-transparent hover:border-pastel-blueBorder">
                                          <div className="flex items-center gap-3 overflow-hidden">
                                            <FileText className="w-4 h-4 text-cw-blue shrink-0" />
                                            <span className="font-bold text-sm text-gray-800 truncate">{file.title}</span>
                                          </div>
                                          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <a 
                                              href={file.file_url} 
                                              target="_blank" 
                                              rel="noopener noreferrer" 
                                              className="p-1.5 text-gray-500 hover:text-cw-blue hover:bg-white rounded-sm transition-colors"
                                              title="View Document"
                                            >
                                              <Link2 className="w-4 h-4" />
                                            </a>
                                            {deletingId === file.id ? (
                                              <Loader2 className="w-4 h-4 animate-spin text-cw-red p-1.5" />
                                            ) : (
                                              <button 
                                                onClick={() => handleDelete(file.id, file.title)}
                                                className="p-1.5 text-gray-400 hover:text-cw-red hover:bg-pastel-redBg rounded-sm transition-colors"
                                                title="Delete File"
                                              >
                                                <Trash2 className="w-4 h-4" />
                                              </button>
                                            )}
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}