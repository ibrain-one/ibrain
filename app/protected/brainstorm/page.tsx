'use client';
import React, { useEffect, useRef, useState } from 'react';
import MarkdownIt from 'markdown-it';
import MarkdownEditor from 'react-markdown-editor-lite';
import { HtmlType } from 'react-markdown-editor-lite/cjs/editor/preview';
import 'react-markdown-editor-lite/lib/index.css';
import { useBrainStack } from '@/app/providers/brainstack';
import Button from '@/components/ui/Button';

const mdParser = new MarkdownIt(/* Markdown-it options */);

export default function MicroAppPage() {
  const bstack = useBrainStack();
  const [markdown, setMarkdown] = useState('');
  const editorRef = useRef<MarkdownEditor | null>(null);

  useEffect(() => {
    const unsubscribe = bstack.store.on('content.markdown', (e: any) => {
      setMarkdown(e?.content);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const handleEditorChange = ({ text }: { text: string }) => {
    setMarkdown(text);
  };

  const handleClick = async () => {
    if (editorRef.current) {
      const markdownContent = editorRef.current.getMdValue();

      if ('showSaveFilePicker' in window) {
        try {
          const fileHandle = await (window as any).showSaveFilePicker({
            suggestedName: 'brainstorm_notes.md',
            types: [
              {
                description: 'Markdown Files',
                accept: { 'text/markdown': ['.md'] },
              },
            ],
          });

          const writable = await fileHandle.createWritable();
          await writable.write(markdownContent);
          await writable.close();

          alert('File saved successfully!');
        } catch (err) {
          console.error('Error saving file:', err);
        }
      } else {
        alert('File System Access API is not supported in this browser.');
      }
    }
  };

  return (
    <>
      <h1 className="text-4xl font-bold text-center">
        Brainstorm Page Micro App
      </h1>
      <div className="flex flex-col items-center m-5 h-[80vh]">
        <Button onClick={handleClick}>Save</Button>
        <MarkdownEditor
          ref={editorRef}
          value={markdown}
          onChange={handleEditorChange}
          placeholder="Start writing your brainstorming notes..."
          className="w-full h-[80vh] p-4"
          renderHTML={function (
            text: string
          ): HtmlType | Promise<HtmlType> | (() => HtmlType) {
            return mdParser.render(text);
          }}
        />
      </div>
    </>
  );
}

