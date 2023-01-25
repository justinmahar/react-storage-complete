import 'bootstrap/dist/css/bootstrap.css';
import React from 'react';
import { Badge, Button, Card, Form, ListGroup, Spinner } from 'react-bootstrap';
import { DivProps } from 'react-html-props';
import { BrowserStorageOptions } from '../hooks/useBrowserStorage';
import { useLocalStorage } from '../hooks/useLocalStorage';

type StorageHook = typeof useLocalStorage;

export interface LocalStorageExampleProps<T = any> extends DivProps {
  useStorage: StorageHook;
}

/**
 * This is the description for the LocalStorageExample component
 */
export const LocalStorageExample = ({ useStorage, ...props }: LocalStorageExampleProps) => {
  const [prefix, setPrefix] = React.useState('');
  const [prefixEnabled, setPrefixEnabled] = React.useState(false);
  const [prefixSeparator, setPrefixSeparator] = React.useState('.');
  const [shouldInitialize, setShouldInitialize] = React.useState(true);
  const [emitterListenerDisabled, setEmitterListenerDisabled] = React.useState(false);
  const [storageEventListenerDisabled, setStorageEventListenerDisabled] = React.useState(false);

  const storageOptions = React.useMemo(() => {
    const options: BrowserStorageOptions<any> = {};
    if (prefixEnabled) {
      options.prefix = prefix;
    }
    options.prefixSeparator = prefixSeparator;
    options.emitterListenerDisabled = emitterListenerDisabled;
    options.storageEventListenerDisabled = storageEventListenerDisabled;
    options.shouldInitialize = shouldInitialize;
    return options;
  }, [emitterListenerDisabled, prefix, prefixEnabled, prefixSeparator, shouldInitialize, storageEventListenerDisabled]);

  const [storedString, setStoredString, storedStringInitialized, clearStoredString, storedStringPrefixedStorageKey] =
    useStorage<string>('stored-string', undefined, storageOptions);
  const [storedString2] = useStorage<string>('stored-string', undefined, storageOptions);
  const [storedNumber, setStoredNumber, storedNumberInitialized, clearStoredNumber, storedNumberPrefixedStorageKey] =
    useStorage<number>('stored-number', undefined, storageOptions);
  const [
    storedBoolean,
    setStoredBoolean,
    storedBooleanInitialized,
    clearStoredBoolean,
    storedBooleanPrefixedStorageKey,
  ] = useStorage<boolean>('stored-boolean', false, storageOptions);
  const [storedObject, setStoredObject, storedObjectInitialized, clearStoredObject, storedObjectPrefixedStorageKey] =
    useStorage<Record<string, any>>(
      'stored-object',
      {
        str: 'hi',
        num: 123,
        bool: true,
      },
      storageOptions,
    );
  const [storedAny, setStoredAny, storedAnyInitialized, clearStoredAny, storedAnyPrefixedStorageKey] = useStorage<any>(
    'stored-any',
    undefined,
    storageOptions,
  );

  return (
    <div className="d-flex flex-column gap-1">
      <div>
        {!storedStringInitialized && (
          <div>
            <Spinner animation="border" role="status" size="sm" /> Waiting to be initialized
          </div>
        )}
        {storedStringInitialized && (
          <Card>
            <Card.Header>Stored Values</Card.Header>
            <Card.Body className="d-flex flex-column gap-2">
              <div>
                <Form.Label className="d-flex align-items-center gap-2">
                  <h6 className="mb-0">Stored String</h6>{' '}
                  <Badge bg="primary font-monospace">Key: {storedStringPrefixedStorageKey}</Badge>
                </Form.Label>
                <div className="d-flex gap-1">
                  <Form.Control
                    type="text"
                    placeholder="Stored string type"
                    value={storedString ?? ''}
                    onChange={(e) => setStoredString(e.target.value)}
                  />
                  <Button variant="primary" onClick={() => clearStoredString()}>
                    Clear/Reset
                  </Button>
                </div>
                <div className="d-flex flex-column gap-1">
                  <Form.Text className="text-muted">Value: {storedString}</Form.Text>
                  <Form.Text className="text-muted">Second hook value (sync demonstration): {storedString2}</Form.Text>
                </div>
              </div>
              <div>
                <Form.Label className="d-flex align-items-center gap-2">
                  <h6 className="mb-0">Stored Number</h6>{' '}
                  <Badge bg="primary font-monospace">Key: {storedNumberPrefixedStorageKey}</Badge>
                </Form.Label>
                <div className="d-flex gap-1">
                  <Form.Control
                    type="number"
                    placeholder="Stored number type"
                    value={storedNumber ?? ''}
                    onChange={(e) => setStoredNumber(Number.parseInt(e.target.value))}
                  />
                  <Button variant="primary" onClick={() => clearStoredNumber()}>
                    Clear/Reset
                  </Button>
                </div>
                <Form.Text className="text-muted">Value: {storedNumber}</Form.Text>
              </div>
              <div>
                <Form.Label className="d-flex align-items-center gap-2">
                  <h6 className="mb-0">Stored Boolean</h6>{' '}
                  <Badge bg="primary font-monospace">Key: {storedBooleanPrefixedStorageKey}</Badge>
                </Form.Label>
                <div className="d-flex gap-1">
                  <Form.Check
                    label="Stored boolean type"
                    className="user-select-none"
                    id="stored-bool-id"
                    checked={!!storedBoolean}
                    onChange={(e) => setStoredBoolean(e.target.checked)}
                  />
                  <Button variant="primary" onClick={() => clearStoredBoolean()}>
                    Clear/Reset
                  </Button>
                </div>
                <Form.Text className="text-muted">Value: {`${storedBoolean}`}</Form.Text>
              </div>
              <div>
                <Form.Label className="d-flex align-items-center gap-2">
                  <h6 className="mb-0">Stored Object</h6>{' '}
                  <Badge bg="primary font-monospace">Key: {storedObjectPrefixedStorageKey}</Badge>
                </Form.Label>
                <div className="d-flex gap-1">
                  <Form.Control
                    type="text"
                    placeholder="object.str string value"
                    value={storedObject?.str ?? ''}
                    onChange={(e) => setStoredObject({ ...storedObject, str: e.target.value })}
                  />
                  <Form.Control
                    type="number"
                    placeholder="object.num number value"
                    value={storedObject?.num ?? ''}
                    onChange={(e) => setStoredObject({ ...storedObject, num: Number.parseInt(e.target.value) })}
                  />
                  <Form.Check
                    label="object.bool value"
                    className="user-select-none"
                    id="stored-object-bool-id"
                    checked={!!storedObject?.bool}
                    onChange={(e) => setStoredObject({ ...storedObject, bool: e.target.checked })}
                  />
                  <Button variant="primary" onClick={() => clearStoredBoolean()}>
                    Clear/Reset
                  </Button>
                </div>
                <Form.Text className="text-muted">Value: {JSON.stringify(storedObject)}</Form.Text>
              </div>
              <div>
                <Form.Label className="d-flex align-items-center gap-2">
                  <h6 className="mb-0">Stored Any</h6>{' '}
                  <Badge bg="primary font-monospace">Key: {storedAnyPrefixedStorageKey}</Badge>
                </Form.Label>
                <div className="d-flex gap-1">
                  <Form.Control
                    type="text"
                    placeholder="Stored any type"
                    value={storedAny ?? ''}
                    onChange={(e) => setStoredAny(e.target.value)}
                  />
                  <Button variant="primary" onClick={() => clearStoredAny()}>
                    Clear/Reset
                  </Button>
                </div>
                <Form.Text className="text-muted">Value: {storedAny}</Form.Text>
              </div>
            </Card.Body>
          </Card>
        )}
      </div>
      <Card>
        <Card.Header>
          <div className="d-flex flex-column">
            <Form.Check
              inline
              label="Use Prefix"
              className="user-select-none"
              id="prefix-checkbox"
              checked={prefixEnabled}
              onChange={(e) => setPrefixEnabled(e.target.checked)}
            />
            <Form.Text className="text-muted">
              A prefix allows you to scope storage to a namespace of your choosing. For example, you may want to store
              and retrieve settings for multiple authenticated users in the same browser. In that case, you can prefix
              the keys with the user's ID. A few examples are shown below. Try selecting different accounts below and
              changing the stored values.
            </Form.Text>
          </div>
        </Card.Header>
        <Card.Body className="d-flex flex-column gap-1">
          <Form.Group controlId="prefix-group">
            <Form.Control
              type="text"
              placeholder="Enter a prefix"
              value={prefix}
              onChange={(e) => setPrefix(e.target.value)}
            />
          </Form.Group>
          <div className="d-flex flex-wrap gap-1">
            <Button
              variant="outline-primary"
              size="sm"
              onClick={() => {
                setPrefix('abc-123-hank');
                setPrefixEnabled(true);
              }}
            >
              Hank's Account ID
            </Button>
            <Button
              variant="outline-primary"
              size="sm"
              onClick={() => {
                setPrefix('def-456-frank');
                setPrefixEnabled(true);
              }}
            >
              Frank's Account ID
            </Button>
            <Button
              variant="outline-primary"
              size="sm"
              onClick={() => {
                setPrefix('xyz-987-tony');
                setPrefixEnabled(true);
              }}
            >
              Tony's Account ID
            </Button>
            <Button
              variant="outline-primary"
              size="sm"
              onClick={() => {
                setPrefix('');
                setPrefixEnabled(true);
              }}
            >
              Empty Prefix
            </Button>
          </div>
          <div>
            <Form.Label>Prefix Separator</Form.Label>
            <Form.Control
              type="text"
              placeholder="Prefix key separator"
              value={prefixSeparator}
              onChange={(e) => setPrefixSeparator(e.target.value)}
            />
            <Form.Text className="text-muted">
              This separates the prefix from the key. For example, if the separator is <code>.</code>, the prefixed key
              is <code>prefix.keyname</code>.
            </Form.Text>
          </div>
        </Card.Body>
      </Card>
      <ListGroup>
        <ListGroup.Item className="bg-light">
          <div className="d-flex flex-column">
            <Form.Check
              inline
              label="Should Initialize"
              className="user-select-none"
              id="should-init-checkbox"
              checked={shouldInitialize}
              onChange={(e) => setShouldInitialize(e.target.checked)}
            />
            <Form.Text className="text-muted">
              This is useful when your prefix string must be loaded after rendering. For example, you can postpone
              initializing local storage values until a user is logged in and their ID is available to use as the
              prefix.
            </Form.Text>
          </div>
        </ListGroup.Item>
        <ListGroup.Item className="bg-light">
          <div className="d-flex flex-column">
            <Form.Check
              inline
              label="Disable Emitter Listener"
              className="user-select-none"
              id="disable-emitter-checkbox"
              checked={emitterListenerDisabled}
              onChange={(e) => setEmitterListenerDisabled(e.target.checked)}
            />
            <Form.Text className="text-muted">
              The hook will synchronize changes with hooks using the same key in other components via an emitter. You
              can disable this feature if you'd like. To test this, you can see the "Second hook value" below update
              when the stored string changes, and it will no longer update when the Emitter Listener is disabled.
            </Form.Text>
          </div>
        </ListGroup.Item>
        <ListGroup.Item className="bg-light">
          <div className="d-flex flex-column">
            <Form.Check
              inline
              label="Disable Storage Event Listener"
              className="user-select-none"
              id="disable-storage-event-listener-checkbox"
              checked={storageEventListenerDisabled}
              onChange={(e) => setStorageEventListenerDisabled(e.target.checked)}
            />
            <Form.Text className="text-muted">
              The hook will synchronize storage changes made in other tabs via the Window Storage Event API. You can
              disable this feature if you'd like. To test this, you can see any of the values below update when making
              changes in another tab, and they will no longer update when the Storage Event Listener is disabled.
            </Form.Text>
          </div>
        </ListGroup.Item>
      </ListGroup>
    </div>
  );
};
