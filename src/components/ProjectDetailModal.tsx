import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ExternalLink, ChevronLeft, ChevronRight, Briefcase } from 'lucide-react';
import { Project } from '../types';

interface ProjectDetailModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({ project, isOpen, onClose }) => {
  const [currentImageIdx, setCurrentImageIdx] = useState(0);

  if (!isOpen || !project) return null;

  const nextImage = () => {
    setCurrentImageIdx((prev) => (prev + 1) % project.images.length);
  };

  const prevImage = () => {
    setCurrentImageIdx((prev) => (prev - 1 + project.images.length) % project.images.length);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"
        />
        
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          className="relative w-full max-w-5xl max-h-[90vh] bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row border border-gray-100"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 p-2 bg-white/80 hover:bg-gray-100 border border-gray-200 text-gray-600 hover:text-gray-900 rounded-full backdrop-blur-md transition-all shadow-sm"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Image Gallery Section */}
          <div className="w-full md:w-3/5 bg-gray-50 relative flex items-center justify-center min-h-[300px] md:min-h-full border-b md:border-b-0 md:border-r border-gray-200">
            {project.images && project.images.length > 0 ? (
              <>
                <img
                  src={project.images[currentImageIdx]}
                  alt={`${project.title} - ${currentImageIdx + 1}`}
                  className="max-w-full max-h-[50vh] md:max-h-[90vh] object-contain"
                />
                
                {project.images.length > 1 && (
                  <>
                    <button
                      onClick={(e) => { e.stopPropagation(); prevImage(); }}
                      className="absolute left-4 p-2 bg-white/80 hover:bg-white border border-gray-200 text-gray-700 rounded-full backdrop-blur-md transition-all shadow-sm"
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); nextImage(); }}
                      className="absolute right-4 p-2 bg-white/80 hover:bg-white border border-gray-200 text-gray-700 rounded-full backdrop-blur-md transition-all shadow-sm"
                    >
                      <ChevronRight className="w-6 h-6" />
                    </button>
                    
                    {/* Dots indicator */}
                    <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2">
                      {project.images.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={(e) => { e.stopPropagation(); setCurrentImageIdx(idx); }}
                          className={`h-1.5 rounded-full transition-all ${
                            idx === currentImageIdx ? 'bg-blue-600 w-6' : 'bg-gray-300 w-2 hover:bg-gray-400'
                          }`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </>
            ) : (
              <div className="text-gray-400 flex flex-col items-center">
                <Briefcase className="w-16 h-16 mb-4 opacity-50" />
                <p className="text-sm font-medium">No Visual Assets</p>
              </div>
            )}
          </div>

          {/* Details Section */}
          <div className="w-full md:w-2/5 p-6 md:p-8 overflow-y-auto custom-scrollbar flex flex-col bg-white">
            <div className="flex items-center gap-2 mb-2 text-blue-600 text-sm font-semibold tracking-wide uppercase">
              <Briefcase className="w-4 h-4" />
              <span>Project Details</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              {project.title}
            </h2>
            
            <div className="flex flex-wrap gap-2 mb-8">
              {project.tags?.map((tag, idx) => (
                <span key={idx} className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-md">
                  {tag}
                </span>
              ))}
            </div>

            <div className="prose prose-gray max-w-none mb-8 flex-1">
              <p className="text-gray-600 whitespace-pre-wrap leading-relaxed">
                {project.description}
              </p>
            </div>

            {project.link && (
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-auto inline-flex items-center justify-center gap-2 w-full py-3.5 px-4 bg-gray-900 hover:bg-gray-800 text-white rounded-xl font-medium transition-all shadow-sm"
              >
                Visit Project
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
