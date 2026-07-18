import { useState } from 'react';

export default function EditorArea() {
  const [content, setContent] = useState('');

  return (
    <div className="document-editor-area">
      <textarea
        className="document-editor-area__textarea"
        value={content}
        onChange={(event) => setContent(event.target.value)}
        placeholder="Digite o conteúdo do documento aqui..."
      />
    </div>
  );
}
