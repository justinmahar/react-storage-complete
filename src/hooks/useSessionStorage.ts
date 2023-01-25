import { DEFAULT_BROWSER_STORAGE_OPTIONS, StorageOptions, StorageState, useBrowserStorage } from './useBrowserStorage';

/**
 * Access a `sessionStorage` item. Use this in a similar fashion to `React.useState()`.
 *
 * See the [documentation](https://justinmahar.github.io/react-storage-complete/?path=/story/hooks-usesessionstorage--page).
 *
 * Examples:
 *
 * ```jsx
 * const [value, setValue] = useSessionStorage('key');
 * const [value, setValue] = useSessionStorage('key', 'Default');
 * const [value, setValue, initialized, clear, prefixedKey] = useSessionStorage('key', 'Default', {
 *   prefix: 'my-namespace',
 * });
 * ```
 *
 * @param key The key for the stored item.
 * @param defaultWhenUndefined The default value for the item when it is undefined in `sessionStorage`.
 * @param options Options for the stored item. See the [documentation](https://justinmahar.github.io/react-storage-complete/?path=/story/hooks-usesessionstorage--page#props) for more.
 * @returns The storage state. See the [documentation](https://justinmahar.github.io/react-storage-complete/?path=/story/hooks-usesessionstorage--page#return) for details.
 */
export function useSessionStorage<T = any>(
  key: string,
  defaultWhenUndefined: T | null | undefined = undefined,
  options: StorageOptions<T> = DEFAULT_BROWSER_STORAGE_OPTIONS,
): StorageState<T> {
  return useBrowserStorage<T>(key, defaultWhenUndefined, sessionStorage, options);
}
