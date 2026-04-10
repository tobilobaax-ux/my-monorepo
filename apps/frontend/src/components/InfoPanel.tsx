import React from 'react';

interface InfoPanelProps {
 title: string;
 content: string;
}

const InfoPanel: React.FC<InfoPanelProps> = ({ title, content }) => (
 <div className="bg-gray-100 p-6 rounded-lg shadow-md">
   <h3 className="text-lg font-bold mb-2">{title}</h3>
   <p>{content}</p>
 </div>
);

export default InfoPanel;
