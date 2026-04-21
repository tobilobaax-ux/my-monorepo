import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import AnalyticsCard from '../components/admin/AnalyticsCard';
import '@testing-library/jest-dom';

describe('AnalyticsCard Component', () => {
  it('renders label, value, and description correctly', () => {
    render(
      <AnalyticsCard 
        label="Total Users" 
        value={500} 
        description="Active this month" 
        icon={<span>Icon</span>}
      />
    );
    
    expect(screen.getByText("Total Users")).toBeInTheDocument();
    expect(screen.getByText("500")).toBeInTheDocument();
    expect(screen.getByText("Active this month")).toBeInTheDocument();
    expect(screen.getByText("Icon")).toBeInTheDocument();
  });

  it('formats large numbers correctly', () => {
    render(
      <AnalyticsCard 
        label="Impressions" 
        value={1500} 
        description="Views" 
        icon={null}
      />
    );
    expect(screen.getByText("1,500")).toBeInTheDocument();
  });
});
