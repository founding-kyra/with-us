import React from 'react';
import './Annotation.css';

const Annotation = ({
  top,
  left,
  right,
  bottom,
  title,
  subtitle,
  mode = "dark",
  lineEndX = 50,
  lineEndY = -50,
  horizontalLength = 30,
  textAlign = "left",
  textOffsetX = 5,
  textOffsetY = 0
}) => {
  const finalX = lineEndX + (horizontalLength * (lineEndX >= 0 ? 1 : -1));

  return (
    <div 
      className={`luxury-annotation mode-${mode}`} 
      style={{ 
        top, 
        left, 
        right, 
        bottom,
        color: mode === 'light' ? '#ffffff' : '#1a1a1a'
      }}
    >
      <svg className="anno-svg">
        <polyline 
          points={`0,0 ${lineEndX},${lineEndY} ${finalX},${lineEndY}`} 
          fill="none" stroke="currentColor" strokeWidth="0.5" 
        />
        <circle cx="0" cy="0" r="2.5" fill="none" stroke="currentColor" strokeWidth="0.5" />
        <circle cx="0" cy="0" r="0.8" fill="currentColor" />
        <circle cx={finalX} cy={lineEndY} r="1" fill="currentColor" />
      </svg>
      <div 
        className="anno-text" 
        style={{ 
          transform: `translate(${finalX + textOffsetX - (textAlign === 'right' ? 100 : 0)}px, ${lineEndY + textOffsetY}px)`,
          textAlign: textAlign,
          alignItems: textAlign === 'right' ? 'flex-end' : 'flex-start',
          width: textAlign === 'right' ? '100px' : 'auto',
          left: 0
        }}
      >
        <span className="anno-title">{title}</span>
        {subtitle && <span className="anno-subtitle">{subtitle}</span>}
      </div>
    </div>
  );
};

export default Annotation;
