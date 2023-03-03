import React from 'react';
import EventEmitter from 'events';
import { Subs } from 'react-sub-unsub';

export interface StorageOptions<T> {
  prefix?: string;
  prefixSeparator?: string;
  shouldInitialize?: boolean;
  emitterDisabled?: boolean;
  storageEventListenerDisabled?: boolean;
  encode?: StorageEncoder<T>;
  decode?: StorageDecoder<T>;
}

export const DEFAULT_BROWSER_STORAGE_OPTIONS: StorageOptions<any> = {
  prefix: undefined,
  prefixSeparator: '.',
  shouldInitialize: true,
  emitterDisabled: false,
  storageEventListenerDisabled: false,
  encode: defaultEncode,
  decode: defaultDecode,
};

export type StorageState<T> = [T | null | undefined, (val: T | null | undefined) => void, boolean, () => void, string];

export function useBrowserStorage<T = any>(
  key: string,
  defaultWhenUndefined: T | null | undefined,
  storage: Storage,
  options: StorageOptions<T> = DEFAULT_BROWSER_STORAGE_OPTIONS,
): StorageState<T> {
  const opts = React.useMemo(() => {
    return { ...DEFAULT_BROWSER_STORAGE_OPTIONS, ...options };
  }, [
    options.prefix,
    options.prefixSeparator,
    options.shouldInitialize,
    options.emitterDisabled,
    options.storageEventListenerDisabled,
  ]); // Don't include `options` or the encoders, they may change on every render
  const [initialized, setInitialized] = React.useState(!!opts.shouldInitialize);

  const scopedStorageKey = React.useMemo(
    () => `${opts.prefix ? `${opts.prefix}${opts.prefixSeparator}` : ''}${key}`,
    [key, opts.prefix, opts.prefixSeparator],
  );

  const defaultValue = React.useMemo(() => defaultWhenUndefined, []); // Don't include defaultWhenUndefined, it may change on every render

  const getDecodedValue = React.useCallback(() => {
    let val = defaultValue;
    if (opts.shouldInitialize && typeof storage !== 'undefined' && opts.decode) {
      try {
        const storedRawVal = storage[scopedStorageKey];
        val = typeof storedRawVal === 'undefined' ? defaultValue : opts.decode(storedRawVal);
      } catch (e) {
        console.error(
          'Error while decoding stored value for key:',
          scopedStorageKey,
          'Error:',
          e,
          'Value was:',
          storage[scopedStorageKey],
          'This value could not be decoded properly. Try 1) checking the value, 2) checking your decoder, or 3) if using the default decoder (which uses JSON.parse), try specifying your own.',
        );
      }
    }
    return val;
  }, [defaultValue, opts, scopedStorageKey, storage]);

  const [state, setState] = React.useState(getDecodedValue());

  // If the scope, key, storage, or options, change, decode and set the value, and set it as initialized.
  React.useEffect(() => {
    if (opts.shouldInitialize) {
      setState(getDecodedValue());
      setInitialized(true);
    } else {
      // When there's no scope, set as not initialized
      setState(defaultValue);
      setInitialized(false);
    }
  }, [getDecodedValue, opts.shouldInitialize, defaultValue, scopedStorageKey]);

  // Sync with all hook instances through an emitter
  React.useEffect(() => {
    const subs = new Subs();
    if (!opts.emitterDisabled) {
      const changeEventListener = (changedKey: string, storageArea: Storage) => {
        if (scopedStorageKey === changedKey && storage === storageArea) {
          try {
            setState(getDecodedValue());
          } catch (e) {
            console.error(e);
          }
        }
      };
      subs.subscribeEvent(storageEventEmitter, EMITTER_CHANGE_EVENT_NAME, changeEventListener);
    }
    return subs.createCleanup();
  }, [getDecodedValue, opts.emitterDisabled, storage, scopedStorageKey]);

  // Sync with other open browser tabs via Window Storage Events
  // See: https://developer.mozilla.org/en-US/docs/Web/API/Window/storage_event
  React.useEffect(() => {
    const subs = new Subs();
    if (!opts.storageEventListenerDisabled) {
      const storageEventListener = (e: StorageEvent) => {
        if (e.storageArea === storage) {
          const changedKey = e.key;
          if (scopedStorageKey === changedKey) {
            try {
              setState(getDecodedValue());
            } catch (e) {
              console.error(e);
            }
          }
        }
      };
      subs.subscribeDOMEvent(window, 'storage', storageEventListener);
    }
    return subs.createCleanup();
  }, [getDecodedValue, opts.storageEventListenerDisabled, scopedStorageKey, storage]);

  const setStateCombined = React.useCallback(
    (value: T | null | undefined) => {
      if (opts.shouldInitialize) {
        try {
          if (opts.encode && opts.decode && typeof value !== 'undefined') {
            const encoded = opts.encode(value);
            try {
              // Ensure we can decode it, too
              opts.decode(encoded);
              setState(value);
              storage[scopedStorageKey] = encoded;
              if (!opts.emitterDisabled) {
                storageEventEmitter.emit(EMITTER_CHANGE_EVENT_NAME, scopedStorageKey, storage);
              }
            } catch (e) {
              console.error(
                'Error while testing decoding during set operation:',
                scopedStorageKey,
                'Error:',
                e,
                'Value was:',
                value,
                'Could not decode after encoded as:',
                encoded,
                'This value could not be decoded properly. Try 1) checking the value, 2) checking your decoder, or 3) if using the default decoder (which uses JSON.parse), try specifying your own.',
              );
            }
          }
          if (typeof value === 'undefined') {
            setState(null);
            delete storage[scopedStorageKey];
            if (!opts.emitterDisabled) {
              storageEventEmitter.emit(EMITTER_CHANGE_EVENT_NAME, scopedStorageKey, storage);
            }
          }
        } catch (e) {
          console.error(
            'Error while encoding:',
            scopedStorageKey,
            'Error:',
            e,
            'Bad value was:',
            value,
            'This value could not be encoded properly. Try 1) checking the value as you may have provided a value that the encoder could not convert to a string, 2) checking your encoder, or 3) if using the default encoder (which uses JSON.stringify), try specifying your own.',
          );
        }
      }
    },
    [opts, scopedStorageKey, storage],
  );

  const clear = React.useCallback(() => {
    setStateCombined(undefined);
  }, [setStateCombined]);

  return [state, setStateCombined, initialized, clear, scopedStorageKey];
}

export type StorageEncoder<T> = (value: T | null) => string | null;
export type StorageDecoder<T> = (itemString: string | null) => T | null;

export function defaultEncode<T>(value: T | null): string | null {
  return value !== null && typeof value !== 'undefined' ? JSON.stringify(value) : null;
}

export function defaultDecode<T>(itemString: string | null): T | null {
  return itemString !== null && typeof itemString !== 'undefined' ? JSON.parse(itemString) : null;
}

export const EMITTER_CHANGE_EVENT_NAME = 'change';
export const storageEventEmitter = new EventEmitter();
storageEventEmitter.setMaxListeners(100);
