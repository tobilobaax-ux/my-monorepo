import { Component, ErrorInfo, ReactNode } from 'react';
import { Typography } from '@mui/material';

interface Props {
  children: ReactNode;
  fallback?: string;
}

interface State {
  hasError: boolean;
}

class ChatErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ChatWidget Error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="fixed bottom-6 right-6 p-4 bg-white rounded-lg shadow-lg border border-red-100 z-50">
          <Typography variant="body2" className="text-gray-500">
            {this.props.fallback || "Something went wrong. Try again."}
          </Typography>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ChatErrorBoundary;
