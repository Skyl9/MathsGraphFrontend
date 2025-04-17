import React from 'react';
import DOMPurify from 'dompurify';

interface HtmlFieldProps {
  title: string;
  content: string;
  onEdit?: () => void;
  editable?: boolean;
}

const HtmlField: React.FC<HtmlFieldProps> = ({ title, content}) => {
  return (
    <div className="node-wrapper">
      <div className="field-title">{title} :</div>
      <div 
        className="field-content" 
        dangerouslySetInnerHTML={{
          __html: DOMPurify.sanitize(content || "")
        }} 
      />

    </div>
  );
};

export default HtmlField;