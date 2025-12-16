import React, { useEffect, useMemo, useRef } from 'react';
import { EditorView, basicSetup } from 'codemirror';
import { sql } from '@codemirror/lang-sql';
import { oneDark } from '@codemirror/theme-one-dark';
import { keymap } from '@codemirror/view';
import { defaultKeymap } from '@codemirror/commands';

interface NotebookCellEditorProps {
  cellData: string;
  onCellDataChange?: (value: string) => void;
  height?: number;
}

const NotebookCellEditor = (props: NotebookCellEditorProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const viewRef = useRef<EditorView | null>(null);
  const onChangeRef = useRef(props.onCellDataChange);

  useEffect(() => {
    onChangeRef.current = props.onCellDataChange;
  }, [props.onCellDataChange]);

  const extensions = useMemo(() => {
    return [
      basicSetup,
      sql(),
      keymap.of(defaultKeymap),
      EditorView.updateListener.of((update) => {
        if (update.docChanged && onChangeRef.current) {
          onChangeRef.current(update.state.doc.toString());
        }
      }),
      oneDark,
      EditorView.theme({
        '&': { height: `${props.height || 150}px` },
        '.cm-content': { fontSize: '13px' },
      }),
    ];
  }, [props.height]);

  useEffect(() => {
    if (!containerRef.current || viewRef.current) return;
    viewRef.current = new EditorView({
      doc: props.cellData || '',
      extensions,
      parent: containerRef.current,
    });
  }, [extensions, props.cellData]);

  useEffect(() => {
    const view = viewRef.current;
    if (!view) return;
    const current = view.state.doc.toString();
    if (current !== props.cellData) {
      view.dispatch({
        changes: { from: 0, to: current.length, insert: props.cellData || '' },
      });
    }
  }, [props.cellData]);

  useEffect(() => {
    const view = viewRef.current;
    return () => {
      if (view) view.destroy();
      viewRef.current = null;
    };
  }, []);

  return (
    <div className='relative flex w-full max-w-[calc(100%-0.01px)] rounded-sm overflow-hidden'>
      <div ref={containerRef} className='w-full' />
    </div>
  );
};

export default NotebookCellEditor;
