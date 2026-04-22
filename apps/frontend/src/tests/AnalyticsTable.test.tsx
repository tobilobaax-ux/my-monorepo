import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import AnalyticsTable from '../components/admin/AnalyticsTable';
import '@testing-library/jest-dom';

describe('AnalyticsTable Component', () => {
  const mockData = [
    { label: '/home', count: 150 },
    { label: '/about', count: 30 }
  ];

  it('renders table headers and data rows correctly', () => {
    render(
      <AnalyticsTable 
        title="Page Traffic" 
        headers={["Page", "Views"]} 
        data={mockData}
      />
    );
    
    expect(screen.getByText("Page Traffic")).toBeInTheDocument();
    expect(screen.getByText("Page")).toBeInTheDocument();
    expect(screen.getByText("Views")).toBeInTheDocument();
    expect(screen.getByText("/home")).toBeInTheDocument();
    expect(screen.getByText("150")).toBeInTheDocument();
  });

  it('displays empty state message when no data is provided', () => {
    render(<AnalyticsTable title="Empty Table" headers={["H"]} data={[]} />);
    expect(screen.getByText(/No data recorded/i)).toBeInTheDocument();
  });
});
