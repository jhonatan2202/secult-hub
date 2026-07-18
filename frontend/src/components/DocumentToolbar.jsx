const toolbarButtons = [
  { label: 'B', style: 'bold' },
  { label: 'I', style: 'italic' },
  { label: 'U', style: 'underline' },
  { label: 'A', style: 'font' },
  { label: '12', style: 'size' },
  { label: 'C', style: 'color' },
  { label: '⟲', style: 'align' },
  { label: '•', style: 'list' },
  { label: '1.', style: 'numbered' },
  { label: '⊞', style: 'table' },
  { label: '🖼', style: 'image' },
  { label: '🔗', style: 'link' },
  { label: '↺', style: 'undo' },
  { label: '↻', style: 'redo' }
];

export default function DocumentToolbar() {
  return (
    <div className="document-toolbar" role="toolbar" aria-label="Ferramentas do editor">
      {toolbarButtons.map((button) => (
        <button key={button.style} type="button" className="document-toolbar__button" title={button.style}>
          {button.label}
        </button>
      ))}
    </div>
  );
}
