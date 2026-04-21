import React, { Suspense } from 'react';
import { componentRegistry } from './registry';

interface ComponentRendererProps {
  type: string;
  props?: any;
}

const ComponentRenderer: React.FC<ComponentRendererProps> = ({ type, props }) => {
  const Component = componentRegistry[type];

  if (!Component) {
    console.warn(`Component type "${type}" not found in registry.`);
    return null;
  }

  return (
    <Suspense fallback={<div className="h-20 animate-pulse bg-gray-50 rounded-3xl" />}>
      <Component {...props} />
    </Suspense>
  );
};

export default ComponentRenderer;
