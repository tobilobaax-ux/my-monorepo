import React, { useEffect, useState } from 'react';
import DynamicRenderer from '../components/DynamicRenderer';
import Modal from '../components/Modal';
import { trackEvent, EVENTS } from '../utils/analytics';

interface DashboardConfig {
 id: number;
 componentType: string;
 title: string;
 description?: string;
 content?: string;
 onClickType?: string;
}

const Dashboard: React.FC = () => {
 const [sections, setSections] = useState<DashboardConfig[]>([]);
 const [modalOpen, setModalOpen] = useState(false);
 const [modalContent, setModalContent] = useState({ title: '', content: '' });

 useEffect(() => {
   import('../config/dashboard.json').then((data) => setSections(data.default));
 }, []);

 const handleSectionClick = (section: DashboardConfig) => {
   if (section.onClickType === 'modal') {
     trackEvent(EVENTS.MODAL_OPEN, {
       component: 'Dashboard',
       title: section.title,
     });
     setModalContent({ title: section.title, content: section.description || '' });
     setModalOpen(true);
   }
 };

 return (
   <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
     {sections.map((section) => (
       <DynamicRenderer
         key={section.id}
         componentName={section.componentType}
         props={{
           ...section,
           onClick: () => handleSectionClick(section),
         }}
       />
     ))}

     <Modal
       open={modalOpen}
       onClose={() => setModalOpen(false)}
       title={modalContent.title}
       content={modalContent.content}
     />
   </div>
 );
};

export default Dashboard;
