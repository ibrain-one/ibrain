'use client';
import React, { useState } from 'react';
import MarkdownIt from 'markdown-it';
import MarkdownEditor from 'react-markdown-editor-lite';
import { HtmlType } from 'react-markdown-editor-lite/cjs/editor/preview';
import 'react-markdown-editor-lite/lib/index.css';

const mdParser = new MarkdownIt(/* Markdown-it options */);

export default function MicroAppPage() {
  const [markdown, setMarkdown] = useState('');

  const handleEditorChange = ({ text }: { text: string }) => {
    setMarkdown(text);
  };

  return (
    <>
      <h1 className="text-4xl font-bold text-center">
        Brainstorm Page Micro App
      </h1>
      <div className="flex flex-col items-center m-5 h-[80vh]">
        <MarkdownEditor
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
