import React from 'react';
import { Editor, loader } from '@monaco-editor/react';
import * as monaco from 'monaco-editor';
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker';
import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker';
import cssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker';
import htmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker';
import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker';
import { Play } from 'lucide-react';
import { Button } from '../ui/button';

// @ts-ignore
self.MonacoEnvironment = {
  getWorker(_: any, label: any) {
    if (label === 'json') {
      return new jsonWorker();
    }
    if (label === 'css' || label === 'scss' || label === 'less') {
      return new cssWorker();
    }
    if (label === 'html' || label === 'handlebars' || label === 'razor') {
      return new htmlWorker();
    }
    if (label === 'typescript' || label === 'javascript') {
      return new tsWorker();
    }
    return new editorWorker();
  },
};

loader.config({ monaco });

loader.init().then(/* ... */);

interface EditorTabViewProps {}

const EditorTabView = (props: EditorTabViewProps) => {
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
        defaultValue='-- Write your SQL query here'
        theme='vs-light'
        options={{
          minimap: { enabled: false },
        }}
      />
    </div>
  );
};

export default EditorTabView;
