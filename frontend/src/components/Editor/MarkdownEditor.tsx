import React, { useState } from 'react';
import { Input } from 'antd';

const { TextArea } = Input;

interface MarkdownEditorProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  rows?: number;
}

const MarkdownEditor: React.FC<MarkdownEditorProps> = ({
  value,
  onChange,
  placeholder,
  rows = 12,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange?.(e.target.value);
  };

  return (
    <div>
      <TextArea
        value={value}
        onChange={handleChange}
        placeholder={placeholder || '# 标题\n\n在此输入内容...\n\n**支持 Markdown 语法**'}
        rows={rows}
        style={{ fontFamily: 'monospace', fontSize: 14 }}
      />
      <div style={{ marginTop: 8, fontSize: 12, color: '#999' }}>
        支持语法：# 标题 | **粗体** | *斜体* | - 列表 | [链接](url)
      </div>
    </div>
  );
};

export default MarkdownEditor;
