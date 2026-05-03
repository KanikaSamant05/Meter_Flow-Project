import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api';
import toast from 'react-hot-toast';

export function useApis(params = {}) {
  return useQuery({
    queryKey: ['apis', params],
    queryFn: async () => (await api.get('/apis', { params })).data.data,
  });
}

export function useApi(id) {
  return useQuery({
    queryKey: ['apis', id],
    queryFn: async () => (await api.get(`/apis/${id}`)).data.data,
    enabled: !!id,
  });
}

export function useCreateApi() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data) => api.post('/apis', data).then(r => r.data.data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['apis'] }); toast.success('API created successfully'); },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to create API'),
  });
}

export function useUpdateApi() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }) => api.patch(`/apis/${id}`, data).then(r => r.data.data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['apis'] }); toast.success('API updated'); },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to update API'),
  });
}

export function useDeleteApi() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id) => api.delete(`/apis/${id}`),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['apis'] }); toast.success('API deleted'); },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to delete API'),
  });
}

export function useApiKeys(apiId) {
  return useQuery({
    queryKey: ['keys', apiId],
    queryFn: async () => (await api.get(`/apis/${apiId}/keys`)).data.data,
    enabled: !!apiId,
  });
}

export function useAllKeys() {
  return useQuery({
    queryKey: ['keys'],
    queryFn: async () => (await api.get('/keys')).data.data,
  });
}

export function useGenerateKey() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ apiId, ...data }) => api.post(`/apis/${apiId}/keys`, data).then(r => r.data.data),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ['keys', vars.apiId] });
      qc.invalidateQueries({ queryKey: ['keys'] });
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to generate key'),
  });
}

export function useRevokeKey() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (keyId) => api.delete(`/keys/${keyId}`).then(r => r.data.data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['keys'] }); toast.success('Key revoked'); },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to revoke key'),
  });
}