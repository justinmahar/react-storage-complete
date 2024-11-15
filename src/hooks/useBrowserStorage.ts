import React from 'react';
import EventEmitter from 'events';
import { Subs } from 'react-sub-unsub';
import { useClientReady } from './useClientReady';

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

  const clientReady = useClientReady();
  const [initialized, setInitialized] = React.useState(!!opts.shouldInitialize);

  const hookUuid = React.useRef(uuid());

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

  // If the scope, key, storage, or opts.shouldInitialize change, decode and set the value, and set it as initialized.
  React.useEffect(() => {
    const currentEncodedState = state && opts.encode ? opts.encode(state) : undefined;
    if (opts.shouldInitialize && clientReady) {
      const newEncodedValue = storage[scopedStorageKey];
      if (currentEncodedState !== newEncodedValue) {
        setState(getDecodedValue());
      }
      setInitialized(true);
    } else {
      const newEncodedValue = defaultValue && opts.encode ? opts.encode(defaultValue) : undefined;
      if (currentEncodedState !== newEncodedValue) {
        setState(defaultValue);
      }
      // When there's no scope, set as not initialized
      setInitialized(false);
    }
  }, [getDecodedValue, opts.shouldInitialize, defaultValue, scopedStorageKey, clientReady]);

  // Sync with all hook instances through an emitter
  React.useEffect(() => {
    const subs = new Subs();
    if (!opts.emitterDisabled) {
      const changeEventListener = (changedKey: string, storageArea: Storage, sourceUuid: string) => {
        if (scopedStorageKey === changedKey && storage === storageArea && hookUuid.current !== sourceUuid) {
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
      if (opts.shouldInitialize && clientReady) {
        try {
          if (opts.encode && opts.decode && typeof value !== 'undefined') {
            const encodedState = state ? opts.encode(state) : undefined;
            const encodedValue = opts.encode(value);
            // Only set the state if the encoded value is different.
            if (encodedState !== encodedValue) {
              try {
                // Ensure we can decode it, too
                opts.decode(encodedValue);
                setState(value);
                storage[scopedStorageKey] = encodedValue;
                if (!opts.emitterDisabled) {
                  storageEventEmitter.emit(EMITTER_CHANGE_EVENT_NAME, scopedStorageKey, storage, hookUuid.current);
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
                  encodedValue,
                  'This value could not be decoded properly. Try 1) checking the value, 2) checking your decoder, or 3) if using the default decoder (which uses JSON.parse), try specifying your own.',
                );
              }
            }
          }
          if (typeof value === 'undefined' && typeof state !== 'undefined') {
            setState(defaultValue);
            delete storage[scopedStorageKey];
            if (!opts.emitterDisabled) {
              storageEventEmitter.emit(EMITTER_CHANGE_EVENT_NAME, scopedStorageKey, storage, hookUuid.current);
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
    [opts, scopedStorageKey, state, storage, clientReady],
  );

  const clear = React.useCallback(() => {
    setStateCombined(undefined);
  }, [setStateCombined]);

  return [state, setStateCombined, initialized, clear, scopedStorageKey];
}

export type StorageEncoder<T> = (value: T | null) => string | null;
export type StorageDecoder<T> = (itemString: string | null) => T | null;

export function defaultEncode<T>(value: T | null): string | null {
  return value !== null ? JSON.stringify(value) : null;
}

export function defaultDecode<T>(itemString: string | null): T | null {
  return itemString !== null ? JSON.parse(itemString) : null;
}

export const EMITTER_CHANGE_EVENT_NAME = 'change';
export const storageEventEmitter = new EventEmitter();
storageEventEmitter.setMaxListeners(100);

// Source: https://stackoverflow.com/questions/105034/how-do-i-create-a-guid-uuid
const uuid = () => {
  let d = new Date().getTime(); //Timestamp
  let d2 = (typeof performance !== 'undefined' && performance.now && performance.now() * 1000) || 0; //Time in microseconds since page-load or 0 if unsupported
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    let r = Math.random() * 16; //random number between 0 and 16
    if (d > 0) {
      //Use timestamp until depleted
      r = (d + r) % 16 | 0;
      d = Math.floor(d / 16);
    } else {
      //Use microseconds since page-load if supported
      r = (d2 + r) % 16 | 0;
      d2 = Math.floor(d2 / 16);
    }
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
};
