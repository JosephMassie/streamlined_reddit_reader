'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { HTMLProps } from 'react';

const queryClient = new QueryClient();

const ReactQueryProvider: React.FC<HTMLProps<HTMLDivElement>> = ({
    children,
}) => {
    return (
        <QueryClientProvider client={queryClient}>
            {children}
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    );
};

export default ReactQueryProvider;
