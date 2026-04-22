import React, { Suspense } from 'react';
import { componentRegistry } from './registry';

interface DynamicRendererProps {
  componentName: string;
  props?: any;
}

const DynamicRenderer: React.FC<DynamicRendererProps> = ({ componentName, props }) => {
  const Component = componentRegistry[componentName];

  if (!Component) {
    return (
      <div className="p-4 border border-dashed border-red-200 rounded-xl text-red-500 text-xs font-bold uppercase">
        Component "{componentName}" not found in registry
      </div>
    );
  }

  return (
    <Suspense fallback={<div className="h-40 bg-gray-50 rounded-3xl animate-pulse" />}>
      <Component {...props} />
    </Suspense>
  );
};

export default DynamicRenderer;
