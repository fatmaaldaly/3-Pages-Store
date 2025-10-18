import { QueryClient } from '@tanstack/react-query';
import { Persister, persistQueryClient } from '@tanstack/react-query-persist-client';
import { MMKV } from 'react-native-mmkv';

const storage = new MMKV();

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
    },
  },
});

// Custom MMKV persister
const persister: Persister = {
  persistClient: async (client) => {
    storage.set('reactQueryCache', JSON.stringify(client));
  },
  restoreClient: async () => {
    const cached = storage.getString('reactQueryCache');
    return cached ? JSON.parse(cached) : null;
  },
  removeClient: async () => {
    storage.delete('reactQueryCache');
  },
};

// Automatically persist/hydrate
persistQueryClient({
  queryClient,
  persister,
  maxAge: 1000 * 60 * 60, 
});

