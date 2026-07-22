// hooks/use-client.ts

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { clientService } from "@/services/client.service";
import { getErrorMessage } from "@/lib/axios";
import type {
  CreateClientPayload,
  UpdateClientPayload,
  GetClientsParams,
} from "@/types/client.types";
import { useRouter } from "next/navigation";

export const CLIENTS_QUERY_KEY = "clients"; 

export function useClients(params: GetClientsParams = {}) {
  return useQuery({
    queryKey: [CLIENTS_QUERY_KEY, params],
    queryFn: () => clientService.getClients(params),
  });
}

export function useCreateClient() {
  const queryClient = useQueryClient();
  const router = useRouter()
  return useMutation({
    mutationFn: (payload: CreateClientPayload) => clientService.createClient(payload),
    onSuccess: () => {
      toast.success("تم إضافة العميل بنجاح");
      queryClient.invalidateQueries({ queryKey: [CLIENTS_QUERY_KEY] });
      router.push('/dashboard/clients')
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "حدث خطأ أثناء إضافة العميل"));
    },
  });
}

export function useUpdateClient() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateClientPayload }) =>
      clientService.updateClient(id, payload),
    onSuccess: () => {
      toast.success("تم تحديث بيانات العميل بنجاح");
      queryClient.invalidateQueries({ queryKey: [CLIENTS_QUERY_KEY] });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "حدث خطأ أثناء تحديث بيانات العميل"));
    },
  });
}

export function useDeleteClient() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => clientService.deleteClient(id),
    onSuccess: () => {
      toast.success("تم حذف العميل بنجاح");
      queryClient.invalidateQueries({ queryKey: [CLIENTS_QUERY_KEY] });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "حدث خطأ أثناء حذف العميل"));
    },
  });
}