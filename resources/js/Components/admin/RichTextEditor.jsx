import StarterKit from '@tiptap/starter-kit';
import { EditorContent, useEditor } from '@tiptap/react';
import { Bold, Heading2, Italic, List, ListOrdered, Redo2, Undo2 } from 'lucide-react';
import { useEffect } from 'react';

export default function RichTextEditor({ value = '', onChange, label, error }) {
    const editor = useEditor({
        extensions: [StarterKit],
        content: value,
        editorProps: { attributes: { class: 'min-h-56 px-4 py-3 focus:outline-none prose prose-slate max-w-none dark:prose-invert' } },
        onUpdate: ({ editor: instance }) => onChange(instance.getHTML()),
    });

    useEffect(() => {
        if (editor && editor.getHTML() !== value) editor.commands.setContent(value || '', { emitUpdate: false });
    }, [editor, value]);

    const controls = [
        [Bold, () => editor?.chain().focus().toggleBold().run(), editor?.isActive('bold')],
        [Italic, () => editor?.chain().focus().toggleItalic().run(), editor?.isActive('italic')],
        [Heading2, () => editor?.chain().focus().toggleHeading({ level: 2 }).run(), editor?.isActive('heading', { level: 2 })],
        [List, () => editor?.chain().focus().toggleBulletList().run(), editor?.isActive('bulletList')],
        [ListOrdered, () => editor?.chain().focus().toggleOrderedList().run(), editor?.isActive('orderedList')],
        [Undo2, () => editor?.chain().focus().undo().run(), false],
        [Redo2, () => editor?.chain().focus().redo().run(), false],
    ];

    return (
        <div>
            <span className="admin-label">{label}</span>
            <div className="mt-1 overflow-hidden rounded-lg border border-border bg-surface focus-within:ring-2 focus-within:ring-navy-500">
                <div className="flex flex-wrap gap-1 border-b border-border bg-bg p-2">
                    {controls.map(([Icon, action, active], index) => (
                        <button key={index} type="button" onClick={action} className={`rounded p-2 ${active ? 'bg-navy-900 text-white dark:bg-navy-600' : 'text-muted hover:bg-surface hover:text-text'}`}>
                            <Icon className="size-4" />
                        </button>
                    ))}
                </div>
                <EditorContent editor={editor} />
            </div>
            {error ? <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p> : null}
        </div>
    );
}
