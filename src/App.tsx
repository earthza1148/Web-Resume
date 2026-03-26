import React, { useState, useEffect, useRef } from 'react';
import { Lock, Unlock, Plus, Briefcase, Award, LayoutGrid, CloudUpload, CloudCheck, GripHorizontal } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Project, Certification } from './types';
import { ProjectCard } from './components/ProjectCard';
import { ProjectDetailModal } from './components/ProjectDetailModal';
import { ProjectFormModal } from './components/ProjectFormModal';
import { CertCard } from './components/CertCard';
import { CertFormModal } from './components/CertFormModal';
import { PasswordModal } from './components/PasswordModal';
import { ConfirmModal } from './components/ConfirmModal';

const WORKER_URL = 'https://projects-certificate.earth7137.workers.dev';

export default function App() {
  // Load from localStorage IMMEDIATELY for instant speed
  const [projects, setProjects] = useState<Project[]>(() => {
    const saved = localStorage.getItem('portfolio_projects');
    return saved ? JSON.parse(saved) : [];
  });
  const [certs, setCerts] = useState<Certification[]>(() => {
    const saved = localStorage.getItem('portfolio_certs');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [isEditMode, setIsEditMode] = useState(false);
  const [activeTab, setActiveTab] = useState<'projects' | 'certs'>('projects');
  const [isSaving, setIsSaving] = useState(false);
  const isInitialLoad = useRef(true);

  // Modals & Selection State
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [showCertForm, setShowCertForm] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [editingCert, setEditingCert] = useState<Certification | null>(null);
  const [itemToDelete, setItemToDelete] = useState<{ id: string, type: 'project' | 'cert' } | null>(null);

  // Drag State
  const [draggedItemIndex, setDraggedItemIndex] = useState<number | null>(null);

  // Background Sync from Cloudflare Worker
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${WORKER_URL}/api/data`);
        if (response.ok) {
          const data = await response.json();
          if (data.projects) {
            setProjects(data.projects);
            localStorage.setItem('portfolio_projects', JSON.stringify(data.projects));
          }
          if (data.certs) {
            setCerts(data.certs);
            localStorage.setItem('portfolio_certs', JSON.stringify(data.certs));
          }
        }
      } catch (error) {
        console.error('Background sync failed:', error);
      } finally {
        isInitialLoad.current = false;
      }
    };
    fetchData();
  }, []);

  // Save to Worker (Debounced)
  useEffect(() => {
    if (isInitialLoad.current) return;
    
    // Always keep local storage in sync
    localStorage.setItem('portfolio_projects', JSON.stringify(projects));
    localStorage.setItem('portfolio_certs', JSON.stringify(certs));

    const saveData = async () => {
      setIsSaving(true);
      try {
        await fetch(`${WORKER_URL}/api/save`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ projects, certs })
        });
      } catch (error) {
        console.error('Save failed:', error);
      } finally {
        setTimeout(() => setIsSaving(false), 800);
      }
    };
    
    const timer = setTimeout(saveData, 1000);
    return () => clearTimeout(timer);
  }, [projects, certs]);

  // Handle Drag & Reorder for Grid
  const moveItem = (dragIndex: number, hoverIndex: number) => {
    if (activeTab === 'projects') {
      const newProjects = [...projects];
      const draggedProject = newProjects[dragIndex];
      newProjects.splice(dragIndex, 1);
      newProjects.splice(hoverIndex, 0, draggedProject);
      setProjects(newProjects);
    } else {
      const newCerts = [...certs];
      const draggedCert = newCerts[dragIndex];
      newCerts.splice(dragIndex, 1);
      newCerts.splice(hoverIndex, 0, draggedCert);
      setCerts(newCerts);
    }
  };

  const handleToggleEditMode = () => {
    if (isEditMode) {
      setIsEditMode(false);
    } else {
      setShowPasswordModal(true);
    }
  };

  const handleSaveProject = (projectData: Omit<Project, 'id' | 'createdAt'>) => {
    if (editingProject) {
      setProjects(prev => prev.map(p => p.id === editingProject.id ? { ...p, ...projectData } : p));
    } else {
      const newProject: Project = { ...projectData, id: crypto.randomUUID(), createdAt: Date.now() };
      setProjects(prev => [newProject, ...prev]);
    }
    setShowProjectForm(false);
    setEditingProject(null);
  };

  const handleSaveCert = (certData: Omit<Certification, 'id' | 'createdAt'>) => {
    if (editingCert) {
      setCerts(prev => prev.map(c => c.id === editingCert.id ? { ...c, ...certData } : c));
    } else {
      const newCert: Certification = { ...certData, id: crypto.randomUUID(), createdAt: Date.now() };
      setCerts(prev => [newCert, ...prev]);
    }
    setShowCertForm(false);
    setEditingCert(null);
  };

  const handleDeleteConfirm = () => {
    if (itemToDelete) {
      if (itemToDelete.type === 'project') {
        setProjects(prev => prev.filter(p => p.id !== itemToDelete.id));
      } else {
        setCerts(prev => prev.filter(c => c.id !== itemToDelete.id));
      }
      setItemToDelete(null);
      setShowConfirmModal(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans selection:bg-blue-100 relative">
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
              <LayoutGrid className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-gray-900 hidden sm:block">Portfolio</h1>
            
            <div className="ml-4 flex items-center gap-1.5 text-xs font-medium">
              {isSaving ? (
                <div className="flex items-center gap-1.5 text-blue-600">
                  <CloudUpload className="w-4 h-4 animate-bounce" />
                  <span className="hidden xs:inline">Syncing...</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-green-600">
                  <CloudCheck className="w-4 h-4" />
                  <span className="hidden xs:inline">Synced</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {isEditMode && (
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={() => {
                  if (activeTab === 'projects') {
                    setEditingProject(null);
                    setShowProjectForm(true);
                  } else {
                    setEditingCert(null);
                    setShowCertForm(true);
                  }
                }}
                className="flex items-center gap-2 px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium rounded-lg transition-all shadow-sm"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Add {activeTab === 'projects' ? 'Project' : 'Certification'}</span>
              </motion.button>
            )}
            
            <button
              onClick={handleToggleEditMode}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all border ${
                isEditMode 
                  ? 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100' 
                  : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
              }`}
            >
              {isEditMode ? (
                <>
                  <Unlock className="w-4 h-4" />
                  <span className="hidden sm:inline">Lock</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span className="hidden sm:inline">Edit</span>
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 min-h-[calc(100vh-4rem)] flex flex-col">
        <div className="flex justify-center mb-10">
          <div className="inline-flex bg-gray-200/50 p-1 rounded-xl relative">
            <button
              onClick={() => setActiveTab('projects')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-all z-10 ${
                activeTab === 'projects' ? 'text-gray-900' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Briefcase className="w-4 h-4" />
              Projects
            </button>
            <button
              onClick={() => setActiveTab('certs')}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-all z-10 ${
                activeTab === 'certs' ? 'text-gray-900' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Award className="w-4 h-4" />
              Certifications
            </button>
            <motion.div
              className="absolute bg-white shadow-sm rounded-lg top-1 bottom-1"
              initial={false}
              animate={{
                left: activeTab === 'projects' ? '4px' : 'calc(50% + 2px)',
                right: activeTab === 'projects' ? 'calc(50% + 2px)' : '4px',
              }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            />
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className="flex-1"
          >
            <motion.div 
              layout 
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
            >
              {activeTab === 'projects' ? (
                projects.length === 0 ? (
                  <div className="col-span-full flex flex-col items-center justify-center text-center py-20">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Briefcase className="w-8 h-8 text-gray-400" />
                    </div>
                    <h2 className="text-2xl font-semibold text-gray-900 mb-2">No Projects Yet</h2>
                    {isEditMode && (
                      <button
                        onClick={() => {
                          setEditingProject(null);
                          setShowProjectForm(true);
                        }}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-xl transition-all shadow-sm"
                      >
                        <Plus className="w-5 h-5" />
                        Add Project
                      </button>
                    )}
                  </div>
                ) : (
                  projects.map((project, index) => (
                    <motion.div
                      layout
                      key={project.id}
                      draggable={isEditMode}
                      onDragStart={() => setDraggedItemIndex(index)}
                      onDragOver={(e) => {
                        e.preventDefault();
                        if (draggedItemIndex === null || draggedItemIndex === index) return;
                        moveItem(draggedItemIndex, index);
                        setDraggedItemIndex(index);
                      }}
                      onDragEnd={() => setDraggedItemIndex(null)}
                      className={`relative group ${draggedItemIndex === index ? 'opacity-40' : 'opacity-100'}`}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    >
                      {isEditMode && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20 bg-gray-900 text-white p-1 rounded-full cursor-move shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                          <GripHorizontal className="w-4 h-4" />
                        </div>
                      )}
                      <ProjectCard
                        project={project}
                        isEditMode={isEditMode}
                        onClick={() => {
                          setSelectedProject(project);
                          setShowDetailModal(true);
                        }}
                        onEdit={(e) => {
                          e.stopPropagation();
                          setEditingProject(project);
                          setShowProjectForm(true);
                        }}
                        onDelete={(e) => {
                          e.stopPropagation();
                          setItemToDelete({ id: project.id, type: 'project' });
                          setShowConfirmModal(true);
                        }}
                      />
                    </motion.div>
                  ))
                )
              ) : (
                certs.length === 0 ? (
                  <div className="col-span-full flex flex-col items-center justify-center text-center py-20">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Award className="w-8 h-8 text-gray-400" />
                    </div>
                    <h2 className="text-2xl font-semibold text-gray-900 mb-2">No Certifications Yet</h2>
                    {isEditMode && (
                      <button
                        onClick={() => {
                          setEditingCert(null);
                          setShowCertForm(true);
                        }}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-xl transition-all shadow-sm"
                      >
                        <Plus className="w-5 h-5" />
                        Add Certification
                      </button>
                    )}
                  </div>
                ) : (
                  certs.map((cert, index) => (
                    <motion.div
                      layout
                      key={cert.id}
                      draggable={isEditMode}
                      onDragStart={() => setDraggedItemIndex(index)}
                      onDragOver={(e) => {
                        e.preventDefault();
                        if (draggedItemIndex === null || draggedItemIndex === index) return;
                        moveItem(draggedItemIndex, index);
                        setDraggedItemIndex(index);
                      }}
                      onDragEnd={() => setDraggedItemIndex(null)}
                      className={`relative group ${draggedItemIndex === index ? 'opacity-40' : 'opacity-100'}`}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    >
                      {isEditMode && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20 bg-gray-900 text-white p-1 rounded-full cursor-move shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                          <GripHorizontal className="w-4 h-4" />
                        </div>
                      )}
                      <CertCard
                        cert={cert}
                        isEditMode={isEditMode}
                        onEdit={(e) => {
                          e.stopPropagation();
                          setEditingCert(cert);
                          setShowCertForm(true);
                        }}
                        onDelete={(e) => {
                          e.stopPropagation();
                          setItemToDelete({ id: cert.id, type: 'cert' });
                          setShowConfirmModal(true);
                        }}
                      />
                    </motion.div>
                  ))
                )
              )}
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Modals */}
      <PasswordModal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
        onSuccess={() => {
          setShowPasswordModal(false);
          setIsEditMode(true);
        }}
      />

      <ProjectFormModal
        isOpen={showProjectForm}
        initialData={editingProject}
        onClose={() => {
          setShowProjectForm(false);
          setEditingProject(null);
        }}
        onSave={handleSaveProject}
      />

      <CertFormModal
        isOpen={showCertForm}
        initialData={editingCert}
        onClose={() => {
          setShowCertForm(false);
          setEditingCert(null);
        }}
        onSave={handleSaveCert}
      />

      <ProjectDetailModal
        isOpen={showDetailModal}
        project={selectedProject}
        onClose={() => {
          setShowDetailModal(false);
          setTimeout(() => setSelectedProject(null), 300);
        }}
      />

      <ConfirmModal
        isOpen={showConfirmModal}
        title="Confirm Deletion"
        message={`Are you sure you want to delete this ${itemToDelete?.type}? This action cannot be undone.`}
        onConfirm={handleDeleteConfirm}
        onCancel={() => {
          setShowConfirmModal(false);
          setItemToDelete(null);
        }}
      />
    </div>
  );
}
