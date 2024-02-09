import React from 'react';
import { DEFAULT_BROWSER_STORAGE_OPTIONS, StorageOptions, StorageState, useBrowserStorage } from './useBrowserStorage';

/**
 * Access a `localStorage` item. Use this in a similar fashion to `React.useState()`.
 *
 * See the [documentation](https://justinmahar.github.io/react-storage-complete/?path=/story/hooks-uselocalstorage--docs).
 *
 * Examples:
 *
 * ```jsx
 * const [value, setValue] = useLocalStorage('key');
 * const [value, setValue] = useLocalStorage('key', 'Default');
 * const [value, setValue, initialized, clear, prefixedKey] = useLocalStorage('key', 'Default', {
 *   prefix: 'my-namespace',
 * });
 * ```
 *
 * @param key The key for the stored item.
 * @param defaultWhenUndefined The default value for the item when it is undefined in `localStorage`.
 * @param options Options for the stored item. See the [documentation](https://justinmahar.github.io/react-storage-complete/?path=/story/hooks-uselocalstorage--docs#props) for more.
 * @returns The storage state. See the [documentation](https://justinmahar.github.io/react-storage-complete/?path=/story/hooks-uselocalstorage--docs#return) for details.
 */
export function useLocalStorage<T = any>(
  key: string,
  defaultWhenUndefined: T | null | undefined = undefined,
  options: StorageOptions<T> = DEFAULT_BROWSER_STORAGE_OPTIONS,
): StorageState<T> {
  const storage = React.useMemo(() => (typeof localStorage !== 'undefined' ? localStorage : ({} as Storage)), []);
  return useBrowserStorage<T>(key, defaultWhenUndefined, storage, options);
}
