import React, { useEffect, useRef, useState } from 'react';
import { Editor, loader, OnMount } from '@monaco-editor/react';
import * as monaco from 'monaco-editor';
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';
import { Play } from 'lucide-react';
import { Button } from '../ui/button';
import { dataSource } from '@/services/service.config';
import { QueryResult } from '@/model/DatabaseModel';
import QueryResultPanel from './QueryResultPanel';
import { splitSqlStatements } from '@/utils/sql-utils';

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

export interface StatementData {
  index: number;
  loading: boolean;
  statement: string;
  result?: QueryResult;
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
  const [panelHeight, setPanelHeight] = useState(0);
  // const [queryResults, setQueryResults] = useState<QueryResult[]>([]);
  const [statementData, setStatementData] = useState<StatementData[]>([]);
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
    const value = editorRef.current.getValue();
    const statements = splitSqlStatements(value);
    if (statements.length === 0) return;

    setStatementData(
      statements.map((statement, index) => ({
        index,
        loading: true,
        statement,
      })),
    );

    if (statements.length > 0 && panelHeight < PANEL_EXPAND_THRESHOLD) {
      setPanelHeight(PANEL_EXPAND_HEIGHT);
    }

    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      const res = await dataSource.executeQuery(props.connectionId, statement);
      setStatementData((prev) =>
        prev.map((item) => (item.index === i ? { ...item, loading: false, result: res } : item)),
      );
    }
  };

  return (
    <div className='absolute h-full w-full max-w-[100%-78px] overflow-clip flex flex-col'>
      <div className='flex-shrink-0 h-8 border-b border-b-border bg-background shadow-sm z-2 flex items-center justify-start px-1 gap-2'>
        <Button variant='ghost' size='icon' className='!p-0 !size-6' onClick={handleRunSqlQuery}>
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
      <QueryResultPanel
        panelHeight={panelHeight}
        onPanelHeightChange={setPanelHeight}
        statementData={statementData}
      />
    </div>
  );
};

export default EditorTabView;
