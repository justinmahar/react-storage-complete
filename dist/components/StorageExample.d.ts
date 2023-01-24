/// <reference types="react" />
import 'bootstrap/dist/css/bootstrap.css';
import { DivProps } from 'react-html-props';
import { useLocalStorage } from '../hooks/useLocalStorage';
type StorageHook = typeof useLocalStorage;
export interface LocalStorageExampleProps<T = any> extends DivProps {
    useStorage: StorageHook;
}
/**
 * This is the description for the LocalStorageExample component
 */
export declare const LocalStorageExample: ({ useStorage, ...props }: LocalStorageExampleProps) => JSX.Element;
export {};
