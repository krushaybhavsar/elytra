import React, { useEffect, useRef } from 'react';
import { Editor, loader, OnMount } from '@monaco-editor/react';
import * as monaco from 'monaco-editor';
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';
import { Play } from 'lucide-react';
import { Button } from '../ui/button';
import { toast } from 'sonner';
import { dataSource } from '@/services/service.config';

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

    dataSource.executeQuery(props.connectionId, value).then((res) => {
      if (res.success) {
        toast.success(JSON.stringify(res.result));
      } else {
        toast.error(`Failed to execute query: ${res.message}`, { duration: 5000 });
      }
    });
  };

  return (
    <div className='absolute h-full w-full max-w-[100%-78px] overflow-clip'>
      <div className='absolute top-0 left-0 w-full h-8 border-b border-b-border bg-background shadow-sm z-2 flex items-center justify-start px-1 gap-2'>
        <Button variant='icon' size='icon' className='!p-0 !size-6' onClick={handleRunSqlQuery}>
          <Play className='size-4' />
        </Button>
      </div>
      <Editor
        className='mt-8'
        defaultLanguage='sql'
        theme='vs-light'
        onMount={handleEditorMount}
        options={{
          minimap: { enabled: false },
        }}
      />
    </div>
  );
};

export default EditorTabView;
