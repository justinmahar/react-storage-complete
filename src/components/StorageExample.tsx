import 'bootstrap/dist/css/bootstrap.css';
import React from 'react';
import { Badge, Button, Card, Form, ListGroup, Spinner } from 'react-bootstrap';
import { DivProps } from 'react-html-props';
import { BrowserStorageOptions, StorageState } from '../hooks/useBrowserStorage';
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

  const [s, setS] = useLocalStorage('h');

  const storageOptions = React.useMemo(() => {
    const options: BrowserStorageOptions<any> = {};
    if (prefixEnabled) {
      options.prefix = prefix;
    }
    options.prefixSeparator = prefixSeparator;
    // options.storageEventListenerDisabled = true;
    // options.emitterListenerDisabled = true;
    options.shouldInitialize = shouldInitialize;
    return options;
  }, [prefix, prefixEnabled, prefixSeparator, shouldInitialize]);

  const [storedString, setStoredString, storedStringInitialized, clearStoredString, storedStringPrefixdStorageKey] =
    useStorage<string>('stored-string', null, storageOptions);
  const [storedString2] = useStorage<string>('stored-string', null, storageOptions);
  const [storedNumber, setStoredNumber, storedNumberInitialized, clearStoredNumber, storedNumberPrefixdStorageKey] =
    useStorage<number>('stored-number', null, storageOptions);
  const [
    storedBoolean,
    setStoredBoolean,
    storedBooleanInitialized,
    clearStoredBoolean,
    storedBooleanPrefixdStorageKey,
  ] = useStorage<boolean>('stored-boolean', false, storageOptions);
  const [storedObject, setStoredObject, storedObjectInitialized, clearStoredObject, storedObjectPrefixdStorageKey] =
    useStorage<Record<string, any>>(
      'stored-object',
      {
        str: 'hi',
        num: 123,
        bool: true,
      },
      storageOptions,
    );
  const [storedAny, setStoredAny, storedAnyInitialized, clearStoredAny, storedAnyPrefixdStorageKey] = useStorage<any>(
    'stored-any',
    null,
    storageOptions,
  );

  return (
    <div className="d-flex flex-column gap-1">
      <Card>
        <Card.Header>
          <Form.Check
            inline
            label="Use Prefix"
            id="prefix-checkbox"
            checked={prefixEnabled}
            onChange={(e) => setPrefixEnabled(e.target.checked)}
          />
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
              variant="primary"
              onClick={() => {
                setPrefix('abc-123-hank');
                setPrefixEnabled(true);
              }}
            >
              Hank's Account
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                setPrefix('def-456-frank');
                setPrefixEnabled(true);
              }}
            >
              Frank's Account
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                setPrefix('xyz-987-tony');
                setPrefixEnabled(true);
              }}
            >
              Tony's Account
            </Button>
            <Button
              variant="primary"
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
              This separates the prefix from the key. For example, if the separator is <code>.</code>, the prefixd key
              is <code>user-id.keyname</code>.
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
      </ListGroup>
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
                  <Badge bg="primary font-monospace">Key: {storedStringPrefixdStorageKey}</Badge>
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
                  <Form.Text className="text-muted">Second hook value (shows syncing): {storedString2}</Form.Text>
                </div>
              </div>
              <div>
                <Form.Label className="d-flex align-items-center gap-2">
                  <h6 className="mb-0">Stored Number</h6>{' '}
                  <Badge bg="primary font-monospace">Key: {storedNumberPrefixdStorageKey}</Badge>
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
                  <Badge bg="primary font-monospace">Key: {storedBooleanPrefixdStorageKey}</Badge>
                </Form.Label>
                <div className="d-flex gap-1">
                  <Form.Check
                    label="Stored boolean type"
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
                  <Badge bg="primary font-monospace">Key: {storedObjectPrefixdStorageKey}</Badge>
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
                  <Badge bg="primary font-monospace">Key: {storedAnyPrefixdStorageKey}</Badge>
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
    </div>
  );
};
