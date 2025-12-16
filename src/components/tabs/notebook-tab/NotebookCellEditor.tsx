import { Editor, OnMount } from '@monaco-editor/react';
import React, { useRef, useEffect } from 'react';
import * as monaco from 'monaco-editor';
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';
import { loader } from '@monaco-editor/react';

// @ts-ignore
self.MonacoEnvironment = {
  getWorker(_: any, label: any) {
    return new editorWorker();
  },
};

loader.config({ monaco });
loader.init();

interface NotebookCellEditorProps {
  cellData: string;
  onCellDataChange?: (value: string) => void;
  height?: number;
}

const NotebookCellEditor = (props: NotebookCellEditorProps) => {
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const onChangeRef = useRef(props.onCellDataChange);
  const isInternalChangeRef = useRef(false);

  useEffect(() => {
    onChangeRef.current = props.onCellDataChange;
  }, [props.onCellDataChange]);

  useEffect(() => {
    if (editorRef.current && !isInternalChangeRef.current) {
      const currentValue = editorRef.current.getValue();
      if (currentValue !== props.cellData) {
        editorRef.current.setValue(props.cellData || '');
      }
    }
    isInternalChangeRef.current = false;
  }, [props.cellData]);

  const handleEditorMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;
    editor.setValue(props.cellData || '');
  };

  const handleEditorChange = (value: string | undefined) => {
    isInternalChangeRef.current = true;
    if (onChangeRef.current) {
      onChangeRef.current(value || '');
    }
  };

  return (
    <div className='relative flex w-full max-w-[calc(100%-0.01px)] rounded-sm overflow-hidden'>
      <Editor
        width={'100%'}
        height={props.height || 150}
        defaultLanguage='sql'
        theme='vs-light'
        onMount={handleEditorMount}
        onChange={handleEditorChange}
        options={{
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          fontSize: 13,
          lineNumbers: 'on',
          wordWrap: 'on',
          automaticLayout: true,
        }}
      />
    </div>
  );
};

export default NotebookCellEditor;
