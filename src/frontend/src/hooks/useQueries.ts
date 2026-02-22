import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { ProductListing, Transaction, Price, ProductId, TransactionId } from '../backend';
import { Principal } from '@dfinity/principal';
import { ExternalBlob } from '../backend';

export function useGetAllListings() {
  const { actor, isFetching } = useActor();

  return useQuery<ProductListing[]>({
    queryKey: ['listings'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllProductListings();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetListingById(id: string) {
  const { actor, isFetching } = useActor();

  return useQuery<ProductListing | null>({
    queryKey: ['listing', id],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getProductById(id);
    },
    enabled: !!actor && !isFetching && !!id,
  });
}

export function useCreateListing() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      title,
      description,
      price,
      category,
      image,
    }: {
      title: string;
      description: string;
      price: bigint;
      category: string;
      image: ExternalBlob;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createProductListing(title, description, price, category, image);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['listings'] });
    },
  });
}

export function useUpdateListing() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      title,
      description,
      price,
      category,
      image,
    }: {
      id: ProductId;
      title: string;
      description: string;
      price: bigint;
      category: string;
      image: ExternalBlob;
    }) => {
      // Note: Backend doesn't have update method, so we'd need to delete and recreate
      // For now, this is a placeholder
      throw new Error('Update not implemented in backend');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['listings'] });
    },
  });
}

export function useCreateTransaction() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      buyer,
      seller,
      amount,
      commission,
    }: {
      buyer: Principal;
      seller: Principal;
      amount: Price;
      commission: Price;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createTransaction(buyer, seller, amount, commission);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['totalCommission'] });
    },
  });
}

export function useGetMyTransactions() {
  const { actor, isFetching } = useActor();

  return useQuery<Transaction[]>({
    queryKey: ['myTransactions'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMyTransactions();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetAllTransactions() {
  const { actor, isFetching } = useActor();

  return useQuery<Transaction[]>({
    queryKey: ['allTransactions'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllTransactions();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetTotalCommission() {
  const { actor, isFetching } = useActor();

  return useQuery<Price>({
    queryKey: ['totalCommission'],
    queryFn: async () => {
      if (!actor) return BigInt(0);
      return actor.getTotalCommission();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useIsCallerAdmin() {
  const { actor, isFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['isAdmin'],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}
