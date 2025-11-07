import React, { useEffect, useRef } from 'react';
import { Editor, loader, OnMount } from '@monaco-editor/react';
import * as monaco from 'monaco-editor';
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';
import { Play } from 'lucide-react';
import { Button } from '../ui/button';

// @ts-ignore
self.MonacoEnvironment = {
  getWorker(_: any, label: any) {
    return new editorWorker();
  },
};

loader.config({ monaco });

loader.init().then(/* ... */);

interface EditorTabViewProps {
  tabId: string;
  data: string;
  onChange?: (value: string) => void;
}

// Store models and their disposables per tab globally
const modelCache = new Map<
  string,
  {
    model: monaco.editor.ITextModel;
    disposable: monaco.IDisposable;
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
  const { tabId, data, onChange } = props;

  const handleEditorMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;

    let cached = modelCache.get(tabId);
    if (!cached) {
      const model = monaco.editor.createModel(data, 'sql');
      const disposable = model.onDidChangeContent(() => {
        onChange?.(model.getValue());
      });
      cached = { model, disposable };
      modelCache.set(tabId, cached);
    }

    editor.setModel(cached.model);
  };

  useEffect(() => {
    if (!editorRef.current) return;

    let cached = modelCache.get(tabId);
    if (!cached) {
      const model = monaco.editor.createModel(data, 'sql');
      const disposable = model.onDidChangeContent(() => {
        onChange?.(model.getValue());
      });
      cached = { model, disposable };
      modelCache.set(tabId, cached);
    }

    editorRef.current.setModel(cached.model);
  }, [tabId]);

  return (
    <div className='absolute h-full w-full max-w-[100%-78px] overflow-clip'>
      <div className='absolute top-0 left-0 w-full h-8 border-b border-b-border bg-background shadow-sm z-2 flex items-center justify-start px-1 gap-2'>
        <Button variant='icon' size='icon' className='!p-0 !size-6'>
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
