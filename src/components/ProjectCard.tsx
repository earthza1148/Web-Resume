import React from 'react';
import { motion } from 'motion/react';
import { Edit2, Trash2, Image as ImageIcon, Briefcase } from 'lucide-react';
import { Project } from '../types';

interface ProjectCardProps {
  project: Project;
  isEditMode: boolean;
  onClick: () => void;
  onEdit: (e: React.MouseEvent) => void;
  onDelete: (e: React.MouseEvent) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, isEditMode, onClick, onEdit, onDelete }) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="group relative glass-card rounded-2xl overflow-hidden cursor-pointer flex flex-col h-full"
      onClick={onClick}
    >
      {/* Image Thumbnail */}
      <div className="relative h-48 w-full bg-gray-100 overflow-hidden">
        {project.images && project.images.length > 0 ? (
          <img
            src={project.images[0]}
            alt={project.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <Briefcase className="w-12 h-12 opacity-50" />
          </div>
        )}
        
        {/* Image Count Badge */}
        {project.images && project.images.length > 1 && (
          <div className="absolute top-3 left-3 z-20 bg-white/90 backdrop-blur-sm border border-gray-200 text-gray-700 text-xs font-medium px-2 py-1 rounded-md flex items-center gap-1.5 shadow-sm">
            <ImageIcon className="w-3 h-3" />
            {project.images.length}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6 flex-1 flex flex-col">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1 group-hover:text-blue-600 transition-colors">
          {project.title}
        </h3>
        <p className="text-gray-600 text-sm line-clamp-3 mb-4 flex-1">
          {project.description}
        </p>
        
        {/* Tags */}
        {project.tags && project.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-auto">
            {project.tags.slice(0, 3).map((tag, idx) => (
              <span key={idx} className="px-2.5 py-1 bg-gray-100 text-gray-600 text-[11px] font-medium rounded-md">
                {tag}
              </span>
            ))}
            {project.tags.length > 3 && (
              <span className="px-2.5 py-1 bg-gray-50 border border-gray-200 text-gray-500 text-[11px] font-medium rounded-md">
                +{project.tags.length - 3}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Edit Mode Overlay Actions */}
      {isEditMode && (
        <div className="absolute top-3 right-3 z-30 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={onEdit}
            className="p-2 bg-white/90 backdrop-blur-sm border border-gray-200 text-gray-700 hover:text-blue-600 rounded-full shadow-sm transition-all hover:shadow-md"
            title="Edit Project"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={onDelete}
            className="p-2 bg-white/90 backdrop-blur-sm border border-gray-200 text-gray-700 hover:text-red-600 rounded-full shadow-sm transition-all hover:shadow-md"
            title="Delete Project"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )}
    </motion.div>
  );
};
