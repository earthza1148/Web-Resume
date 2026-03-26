import React from 'react';
import { motion } from 'motion/react';
import { Edit2, Trash2, Award, ExternalLink } from 'lucide-react';
import { Certification } from '../types';

interface CertCardProps {
  cert: Certification;
  isEditMode: boolean;
  onEdit: (e: React.MouseEvent) => void;
  onDelete: (e: React.MouseEvent) => void;
}

export const CertCard: React.FC<CertCardProps> = ({ cert, isEditMode, onEdit, onDelete }) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="group relative glass-card rounded-2xl overflow-hidden flex flex-col h-full"
    >
      {/* Image Thumbnail */}
      <div className="relative h-48 w-full bg-gray-100 overflow-hidden flex items-center justify-center">
        {cert.image ? (
          <img
            src={cert.image}
            alt={cert.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <Award className="w-16 h-16 text-gray-300" />
        )}
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-1">
        <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-2">
          {cert.title}
        </h3>
        <p className="text-gray-600 text-sm mb-3">
          {cert.issuer}
        </p>
        <div className="mt-auto flex items-center justify-between">
          <span className="text-sm text-gray-500 font-medium">
            {cert.date}
          </span>
          {cert.link && (
            <a 
              href={cert.link} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-700 flex items-center gap-1 text-sm font-medium transition-colors"
            >
              Verify <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>
      </div>

      {/* Edit Mode Overlay Actions */}
      {isEditMode && (
        <div className="absolute top-4 right-4 z-30 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={onEdit}
            className="p-2 bg-white/90 backdrop-blur-sm border border-gray-200 text-gray-700 hover:text-blue-600 rounded-full shadow-sm transition-all hover:shadow-md"
            title="Edit Certification"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={onDelete}
            className="p-2 bg-white/90 backdrop-blur-sm border border-gray-200 text-gray-700 hover:text-red-600 rounded-full shadow-sm transition-all hover:shadow-md"
            title="Delete Certification"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )}
    </motion.div>
  );
};
