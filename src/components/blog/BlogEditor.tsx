'use client';

import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import Underline from '@tiptap/extension-underline';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import {
  Bold,
  Heading2,
  Heading3,
  Italic,
  Link2,
  List,
  ListOrdered,
  Minus,
  Quote,
  Underline as UnderlineIcon,
} from 'lucide-react';

import { cn } from '@/lib/utils';

type BlogEditorProps = {
  value: string;
  disabled?: boolean;
  onChange: (payload: { html: string; text: string }) => void;
};

type ToolbarButtonProps = {
  active?: boolean;
  disabled?: boolean;
  label: string;
  onClick: () => void;
  children: React.ReactNode;
};

function ToolbarButton({
  active,
  disabled,
  label,
  onClick,
  children,
}: ToolbarButtonProps) {
  return (
    <button
      type='button'
      aria-label={label}
      title={label}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        'inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-sm transition-colors',
        active
          ? 'border-sky-500 bg-sky-500/20 text-sky-200'
          : 'bg-transparent text-white/70 hover:border-white/25 hover:text-white',
        disabled && 'cursor-not-allowed opacity-50',
      )}
    >
      {children}
    </button>
  );
}

export default function BlogEditor({
  value,
  disabled,
  onChange,
}: BlogEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    editable: !disabled,
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [2, 3],
        },
      }),
      Link.configure({
        openOnClick: false,
        autolink: true,
        defaultProtocol: 'https',
        HTMLAttributes: {
          class: 'text-sky-300 underline decoration-sky-500 underline-offset-4',
          rel: 'noopener noreferrer',
          target: '_blank',
        },
      }),
      Underline,
      Placeholder.configure({
        placeholder:
          'Start with a sharp opening line, then build the story like you would in Medium.',
      }),
    ],
    content: value || '<p></p>',
    editorProps: {
      attributes: {
        class:
          'blog-editor min-h-[420px] rounded-[28px] border border-white/10 bg-zinc-950 px-6 py-5 text-white focus:outline-none',
      },
    },
    onUpdate: ({ editor: currentEditor }) => {
      onChange({
        html: currentEditor.getHTML(),
        text: currentEditor.getText(),
      });
    },
  });

  const handleSetLink = () => {
    if (!editor) return;

    const previousUrl = editor.getAttributes('link').href as string | undefined;
    const url = window.prompt('Paste the URL for this link', previousUrl ?? '');

    if (url === null) return;

    if (!url.trim()) {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    editor
      .chain()
      .focus()
      .extendMarkRange('link')
      .setLink({ href: url.trim() })
      .run();
  };

  return (
    <div className='space-y-3'>
      <div className='flex flex-wrap gap-2 rounded-[24px] border border-white/10 bg-white/[0.04] p-3'>
        <ToolbarButton
          label='Heading 2'
          disabled={!editor || disabled}
          active={editor?.isActive('heading', { level: 2 })}
          onClick={() =>
            editor?.chain().focus().toggleHeading({ level: 2 }).run()
          }
        >
          <Heading2 className='h-4 w-4' />
        </ToolbarButton>
        <ToolbarButton
          label='Heading 3'
          disabled={!editor || disabled}
          active={editor?.isActive('heading', { level: 3 })}
          onClick={() =>
            editor?.chain().focus().toggleHeading({ level: 3 }).run()
          }
        >
          <Heading3 className='h-4 w-4' />
        </ToolbarButton>
        <ToolbarButton
          label='Bold'
          disabled={!editor || disabled}
          active={editor?.isActive('bold')}
          onClick={() => editor?.chain().focus().toggleBold().run()}
        >
          <Bold className='h-4 w-4' />
        </ToolbarButton>
        <ToolbarButton
          label='Italic'
          disabled={!editor || disabled}
          active={editor?.isActive('italic')}
          onClick={() => editor?.chain().focus().toggleItalic().run()}
        >
          <Italic className='h-4 w-4' />
        </ToolbarButton>
        <ToolbarButton
          label='Underline'
          disabled={!editor || disabled}
          active={editor?.isActive('underline')}
          onClick={() => editor?.chain().focus().toggleUnderline().run()}
        >
          <UnderlineIcon className='h-4 w-4' />
        </ToolbarButton>
        <ToolbarButton
          label='Quote'
          disabled={!editor || disabled}
          active={editor?.isActive('blockquote')}
          onClick={() => editor?.chain().focus().toggleBlockquote().run()}
        >
          <Quote className='h-4 w-4' />
        </ToolbarButton>
        <ToolbarButton
          label='Bullet List'
          disabled={!editor || disabled}
          active={editor?.isActive('bulletList')}
          onClick={() => editor?.chain().focus().toggleBulletList().run()}
        >
          <List className='h-4 w-4' />
        </ToolbarButton>
        <ToolbarButton
          label='Numbered List'
          disabled={!editor || disabled}
          active={editor?.isActive('orderedList')}
          onClick={() => editor?.chain().focus().toggleOrderedList().run()}
        >
          <ListOrdered className='h-4 w-4' />
        </ToolbarButton>
        <ToolbarButton
          label='Insert Link'
          disabled={!editor || disabled}
          active={editor?.isActive('link')}
          onClick={handleSetLink}
        >
          <Link2 className='h-4 w-4' />
        </ToolbarButton>
        <ToolbarButton
          label='Insert Divider'
          disabled={!editor || disabled}
          onClick={() => editor?.chain().focus().setHorizontalRule().run()}
        >
          <Minus className='h-4 w-4' />
        </ToolbarButton>
      </div>

      <EditorContent editor={editor} />
    </div>
  );
}
