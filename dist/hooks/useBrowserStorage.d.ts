/// <reference types="node" />
import EventEmitter from 'events';
export interface BrowserStorageOptions<T> {
    prefix?: string;
    prefixSeparator?: string;
    shouldInitialize?: boolean;
    emitterListenerDisabled?: boolean;
    storageEventListenerDisabled?: boolean;
    encode?: StorageEncoder<T>;
    decode?: StorageDecoder<T>;
}
export declare const DEFAULT_BROWSER_STORAGE_OPTIONS: BrowserStorageOptions<any>;
export type StorageState<T> = [T | null, (val: T | null | undefined) => void, boolean, () => void, string];
export declare function useBrowserStorage<T = any>(key: string, defaultWhenNull: T | null, storage: Storage, options?: BrowserStorageOptions<T>): StorageState<T>;
export type StorageEncoder<T> = (value: T | null) => string | null;
export type StorageDecoder<T> = (itemString: string | null) => T | null;
export declare function defaultEncode<T>(value: T | null): string | null;
export declare function defaultDecode<T>(itemString: string | null): T | null;
export declare const EMITTER_CHANGE_EVENT_NAME = "change";
export declare const storageEventEmitter: EventEmitter;
