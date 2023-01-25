import {
  DEFAULT_BROWSER_STORAGE_OPTIONS,
  BrowserStorageOptions,
  StorageState,
  useBrowserStorage,
} from './useBrowserStorage';

/**
 * Use a session storage item. Use this in a similar fashion to `React.useState()`.
 * @param key The key for the stored item.
 * @param defaultWhenUndefined The default value for the item when it is null in sessionStorage.
 * @param options Options for the stored item, such as: `scope` prefix (default `''`), `scopeKeyDivider` (separates scope from key name, default `.`, ignored when scope is `''`), the `encode` function, and the `decode` function. All are optional.
 * @returns An array of values in the shape: `[state: T | null | undefined, setState: (val: T | null) => void, initialized: boolean, clear: () => void]`. The `initialized` value indicates whether the value has been read from sessionStorage. Will be false when `scope` option is undefined.
 */
export function useSessionStorage<T = any>(
  key: string,
  defaultWhenUndefined: T | null | undefined = undefined,
  options: BrowserStorageOptions<T> = DEFAULT_BROWSER_STORAGE_OPTIONS,
): StorageState<T> {
  return useBrowserStorage<T>(key, defaultWhenUndefined, sessionStorage, options);
}
