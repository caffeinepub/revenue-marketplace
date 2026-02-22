import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface ProductListing {
    id: ProductId;
    title: string;
    description: string;
    seller: Principal;
    timestamp: Time;
    category: string;
    image: ExternalBlob;
    price: bigint;
}
export type TransactionId = bigint;
export type Time = bigint;
export type Price = bigint;
export type ProductId = string;
export interface UserProfile {
    name: string;
}
export interface Transaction {
    id: TransactionId;
    commission: Price;
    seller: Principal;
    timestamp: Time;
    buyer: Principal;
    amount: Price;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createProductListing(title: string, description: string, price: Price, category: string, image: ExternalBlob): Promise<ProductId>;
    createTransaction(buyer: Principal, seller: Principal, amount: Price, commission: Price): Promise<TransactionId>;
    getAllProductListings(): Promise<Array<ProductListing>>;
    getAllTransactions(): Promise<Array<Transaction>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getMyTransactions(): Promise<Array<Transaction>>;
    getProductById(id: ProductId): Promise<ProductListing | null>;
    getProductListingsSorted(sortBy: string): Promise<Array<ProductListing>>;
    getTotalCommission(): Promise<Price>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    productListingExists(id: ProductId): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    transactionExists(transactionId: TransactionId): Promise<boolean>;
}
