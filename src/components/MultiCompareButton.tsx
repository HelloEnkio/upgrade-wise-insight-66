
import React from 'react';
import { Users } from 'lucide-react';

interface MultiCompareButtonProps {
  className?: string;
  onClick: () => void;
}

const MultiCompareButton = ({ className = "", onClick }: MultiCompareButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center px-4 py-2 text-sm font-medium text-tech-gray-600 hover:text-tech-electric bg-white/50 hover:bg-white/80 backdrop-blur-sm border border-tech-gray-200 hover:border-tech-electric/30 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 ${className}`}
    >
      <Users className="w-4 h-4 mr-2" />
      Compare Multiple Products
    </button>
  );
};

export default MultiCompareButton;
