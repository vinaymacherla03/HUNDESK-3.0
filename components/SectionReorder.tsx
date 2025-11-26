

import React, { useRef } from 'react';
import { ResumeSectionKey } from '../types';

interface SectionReorderProps {
  order: ResumeSectionKey[];
  onOrderChange: (newOrder: ResumeSectionKey[]) => void;
  visibility: Record<ResumeSectionKey, boolean>;
  onVisibilityChange: (section: ResumeSectionKey, isVisible: boolean) => void;
  isLoading: boolean;
}

const sectionNames: Record<ResumeSectionKey, string> = {
  summary: 'Summary',
  experience: 'Professional Experience',
  education: 'Education',
  skills: 'Skills',
  certifications: 'Certifications',
  projects: 'Projects',
  awards: 'Awards',
};

const SectionReorder: React.FC<SectionReorderProps> = ({ order, onOrderChange, visibility, onVisibilityChange, isLoading }) => {
  const dragItem = useRef<number | null>(null);
  
  const handleDragStart = (e: React.DragEvent<HTMLLIElement>, index: number) => {
    dragItem.current = index;
    e.dataTransfer.effectAllowed = 'move';
    e.currentTarget.classList.add('bg-primary-50', 'shadow-md', 'ring-2', 'ring-primary');
  };

  const handleDragEnter = (e: React.DragEvent<HTMLLIElement>, index: number) => {
    e.preventDefault();
    if (dragItem.current === null || dragItem.current === index) {
      return;
    }

    const newOrder = [...order];
    const draggedItemContent = newOrder.splice(dragItem.current, 1)[0];
    newOrder.splice(index, 0, draggedItemContent);
    dragItem.current = index;
    onOrderChange(newOrder);
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLLIElement>) => {
     e.preventDefault();
  }

  const handleDragEnd = (e: React.DragEvent<HTMLLIElement>) => {
    dragItem.current = null;
    e.currentTarget.classList.remove('bg-primary-50', 'shadow-md', 'ring-2', 'ring-primary');
  };

  return (
      <ul className="space-y-2">
        {order.map((section, index) => (
          <li
            key={section}
            draggable={!isLoading}
            onDragStart={(e) => !isLoading && handleDragStart(e, index)}
            onDragEnter={(e) => !isLoading && handleDragEnter(e, index)}
            onDragEnd={(e) => !isLoading && handleDragEnd(e)}
            onDragOver={handleDragOver}
            className={`flex items-center justify-between gap-2 p-2.5 rounded-lg border transition-all 
              ${isLoading 
                ? 'bg-slate-100 border-slate-200' 
                : 'bg-white border-slate-200 hover:bg-slate-50'
              }
              ${!visibility[section] ? 'opacity-50' : ''}
            `}
            aria-roledescription={`Draggable item: ${sectionNames[section]}. Current position ${index + 1} of ${order.length}`}
          >
            <div className="flex items-center gap-2.5 flex-grow cursor-grab active:cursor-grabbing">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
              <span className="text-sm font-medium text-slate-700 select-none">{sectionNames[section]}</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                <input 
                    type="checkbox" 
                    checked={visibility[section] ?? true} 
                    onChange={e => onVisibilityChange(section, e.target.checked)} 
                    className="sr-only peer"
                    disabled={isLoading}
                    aria-label={`Toggle visibility of ${sectionNames[section]} section`}
                />
                <div className="w-9 h-5 bg-slate-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </li>
        ))}
      </ul>
  );
};

export default SectionReorder;