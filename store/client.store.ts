import { create } from "zustand";
import { clientService } from "@/services/client.service";
import type { ClientData } from "@/types/client.types";

interface ClientState {
  clients: ClientData[];
  isLoading: boolean;
  isError: boolean;
  hasFetched: boolean;
  fetchClients: () => Promise<void>;
  refetchClients: () => Promise<void>;
}

// Large limit so the dropdown has the full list rather than one paginated page.
const CLIENT_STORE_LIMIT = 1000;

export const useClientStore = create<ClientState>((set, get) => ({
  clients: [],
  isLoading: false,
  isError: false,
  hasFetched: false,

  fetchClients: async () => {
    if (get().hasFetched || get().isLoading) return;

    set({ isLoading: true, isError: false });
    try {
      const response = await clientService.getClients({ limit: CLIENT_STORE_LIMIT });
      set({
        clients: response.data.data,
        isLoading: false,
        hasFetched: true,
      });
    } catch {
      set({ isLoading: false, isError: true, hasFetched: false });
    }
  },

  refetchClients: async () => {
    set({ isLoading: true, isError: false });
    try {
      const response = await clientService.getClients({ limit: CLIENT_STORE_LIMIT });
      set({
        clients: response.data.data,
        isLoading: false,
        hasFetched: true,
      });
    } catch {
      set({ isLoading: false, isError: true });
    }
  },
}));