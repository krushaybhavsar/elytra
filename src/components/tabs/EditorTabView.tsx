import React, { useEffect, useRef, useState } from 'react';
import { Editor, loader, OnMount } from '@monaco-editor/react';
import * as monaco from 'monaco-editor';
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';
import { Play } from 'lucide-react';
import { Button } from '../ui/button';
import { dataSource } from '@/services/service.config';
import ResizablePanel from '../ui/resizable-panel';
import { QueryResult } from '@/model/DatabaseModel';
import { LoadingView } from '../LoadingView';
import { TypographyP } from '../ui/typography';

// @ts-ignore
self.MonacoEnvironment = {
  getWorker(_: any, label: any) {
    return new editorWorker();
  },
};

loader.config({ monaco });

loader.init();

interface EditorTabViewProps {
  tabId: string;
  connectionId: string;
  data: string;
  onChange?: (value: string) => void;
  onTabDataChange?: (tabId: string, value: string) => void;
}

const modelCache = new Map<
  string,
  {
    model: monaco.editor.ITextModel;
    disposable: monaco.IDisposable;
    tabId: string;
  }
>();

export const cleanupEditorModel = (tabId: string) => {
  const cached = modelCache.get(tabId);
  if (cached) {
    cached.disposable.dispose();
    cached.model.dispose();
    modelCache.delete(tabId);
  }
};

const EditorTabView = (props: EditorTabViewProps) => {
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const onChangeRef = useRef(props.onChange);
  const onTabDataChangeRef = useRef(props.onTabDataChange);
  const { tabId, data, onChange, onTabDataChange } = props;
  const [loadingResult, setLoadingResult] = useState(false);
  const [queryResult, setQueryResult] = useState<QueryResult>();
  const [panelHeight, setPanelHeight] = useState(0);
  const PANEL_EXPAND_THRESHOLD = 50;
  const PANEL_EXPAND_HEIGHT = 375;

  useEffect(() => {
    onChangeRef.current = onChange;
    onTabDataChangeRef.current = onTabDataChange;
  }, [onChange, onTabDataChange]);

  const handleEditorMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;
    let cached = modelCache.get(tabId);
    if (!cached) {
      const modelTabId = tabId;
      const model = monaco.editor.createModel(data, 'sql');
      const disposable = model.onDidChangeContent(() => {
        const value = model.getValue();
        if (onTabDataChangeRef.current) {
          onTabDataChangeRef.current(modelTabId, value);
        } else {
          onChangeRef.current?.(value);
        }
      });
      cached = { model, disposable, tabId: modelTabId };
      modelCache.set(tabId, cached);
    }
    editor.setModel(cached.model);
  };

  useEffect(() => {
    if (!editorRef.current) return;
    let cached = modelCache.get(tabId);
    if (!cached) {
      const modelTabId = tabId;
      const model = monaco.editor.createModel(data, 'sql');
      const disposable = model.onDidChangeContent(() => {
        const value = model.getValue();
        if (onTabDataChangeRef.current) {
          onTabDataChangeRef.current(modelTabId, value);
        } else {
          onChangeRef.current?.(value);
        }
      });
      cached = { model, disposable, tabId: modelTabId };
      modelCache.set(tabId, cached);
    }

    editorRef.current.setModel(cached.model);
  }, [tabId]);

  const handleRunSqlQuery = async () => {
    if (!editorRef.current) return;
    setLoadingResult(true);
    const value = editorRef.current.getValue();
    dataSource
      .executeQuery(props.connectionId, value)
      .then((res) => {
        setQueryResult(res);
        if (panelHeight < PANEL_EXPAND_THRESHOLD) {
          setPanelHeight(PANEL_EXPAND_HEIGHT);
        }
      })
      .finally(() => {
        setLoadingResult(false);
      });
  };

  return (
    <div className='absolute h-full w-full max-w-[100%-78px] overflow-clip flex flex-col'>
      <div className='flex-shrink-0 h-8 border-b border-b-border bg-background shadow-sm z-2 flex items-center justify-start px-1 gap-2'>
        <Button variant='icon' size='icon' className='!p-0 !size-6' onClick={handleRunSqlQuery}>
          <Play className='size-4' />
        </Button>
      </div>
      <div className='flex-1 min-h-0'>
        <Editor
          className='h-full'
          defaultLanguage='sql'
          theme='vs-light'
          onMount={handleEditorMount}
          options={{
            minimap: { enabled: false },
          }}
        />
      </div>
      <ResizablePanel
        axis='y'
        resizeHandles={['n']}
        initialHeight={0}
        minHeight={0}
        maxHeight={500}
        showThumb={true}
        className='w-full border-t-[1px] border-border flex-shrink-0'
        height={panelHeight}
        onHeightChange={setPanelHeight}
      >
        <div className='w-full h-full flex flex-col overflow-hidden'>
          {loadingResult ? (
            <LoadingView />
          ) : !queryResult ? (
            <div className='w-full h-full flex items-center justify-center'>
              <TypographyP>Execute a query to see results here.</TypographyP>
            </div>
          ) : queryResult.success ? (
            <div className='w-full h-full overflow-auto'>
              {JSON.stringify(queryResult.result, null, 2)}
            </div>
          ) : (
            <div className='w-full h-full flex items-center justify-center'>
              <div className='p-8 bg-warning/10  rounded-md'>
                <TypographyP className='text-warning-foreground'>
                  {queryResult.message || 'Unknown error occurred.'}
                </TypographyP>
              </div>
            </div>
          )}
        </div>
      </ResizablePanel>
    </div>
  );
};

export default EditorTabView;
