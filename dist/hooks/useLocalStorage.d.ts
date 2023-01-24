import { BrowserStorageOptions, StorageState } from './useBrowserStorage';
/**
 * Use a local storage item. Use this in a similar fashion to `React.useState()`.
 * @param key The key for the stored item.
 * @param defaultWhenNull The default value for the item when it is null in localStorage.
 * @param options Options for the stored item, such as: `prefix` prefix (default `''`), `prefixDivider` (separates prefix from key name, default `.`, ignored when prefix is `''`), the `encode` function, and the `decode` function. All are optional.
 * @returns An array of values in the shape: `[state: T | null, setState: (val: T | null) => void, initialized: boolean, clear: () => void, prefixdStorageKey: boolean]`. The `initialized` value indicates whether the value has been read from localStorage. Will be false when `prefix` option is undefined.
 */
export declare function useLocalStorage<T = any>(key: string, defaultWhenNull?: T | null, options?: BrowserStorageOptions<T>): StorageState<T>;
