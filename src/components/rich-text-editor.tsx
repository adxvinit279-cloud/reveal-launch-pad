import { useCallback, useEffect } from "react";
import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Link } from "@tiptap/extension-link";
import { Image } from "@tiptap/extension-image";
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableCell } from "@tiptap/extension-table-cell";
import { TableHeader } from "@tiptap/extension-table-header";
import { Button } from "@/components/ui/button";
import {
  Bold, Italic, List, ListOrdered, Quote, Link as LinkIcon,
  Image as ImageIcon, Heading2, Heading3, Heading4, Table as TableI, Undo, Redo,
} from "lucide-react";
import { uploadMedia } from "@/lib/upload";
import { toast } from "sonner";

type Props = { value: string; onChange: (html: string) => void; restricted?: boolean; minHeight?: number };

export function RichTextEditor({ value, onChange, restricted = false, minHeight = 420 }: Props) {
  const editor = useEditor({
    extensions: [
      restricted ? StarterKit.configure({ heading: false }) : StarterKit,
      Link.configure({ openOnClick: false, HTMLAttributes: { rel: "noopener noreferrer", target: "_blank" } }),
      Image.configure({ HTMLAttributes: { class: "rounded-xl my-4 max-w-full h-auto" } }),
      Table.configure({ resizable: false }),
      TableRow, TableHeader, TableCell,
    ],
    content: value || "",
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: {
        style: `min-height:${minHeight}px`,
        class:
          "prose max-w-none rounded-b-xl border-x border-b border-border bg-background p-4 text-foreground/90 focus:outline-none [&_h2]:font-display [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:mt-6 [&_h3]:font-display [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:mt-5 [&_h4]:font-display [&_h4]:font-semibold [&_h4]:mt-4 [&_p]:mt-3 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_blockquote]:border-l-4 [&_blockquote]:border-primary [&_blockquote]:pl-4 [&_blockquote]:italic [&_a]:text-primary [&_a]:underline [&_table]:w-full [&_table]:border [&_table]:border-border [&_th]:border [&_th]:border-border [&_th]:bg-secondary [&_th]:p-2 [&_td]:border [&_td]:border-border [&_td]:p-2",
      },
    },
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) editor.commands.setContent(value || "", { emitUpdate: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor]);

  const addImage = useCallback(async () => {
    if (!editor) return;
    const input = document.createElement("input");
    input.type = "file"; input.accept = "image/*";
    input.onchange = async () => {
      const file = input.files?.[0]; if (!file) return;
      try {
        const url = await uploadMedia(file, "blog");
        editor.chain().focus().setImage({ src: url }).run();
      } catch (e) { toast.error((e as Error).message); }
    };
    input.click();
  }, [editor]);

  const addLink = useCallback(() => {
    if (!editor) return;
    const prev = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("Link URL", prev ?? "https://");
    if (url === null) return;
    if (url === "") { editor.chain().focus().extendMarkRange("link").unsetLink().run(); return; }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }, [editor]);

  if (!editor) return null;

  return (
    <div>
      <Toolbar editor={editor} onImage={addImage} onLink={addLink} restricted={restricted} />
      <EditorContent editor={editor} />
    </div>
  );
}

function Toolbar({ editor, onImage, onLink, restricted }: { editor: Editor; onImage: () => void; onLink: () => void; restricted?: boolean }) {
  const btn = (active: boolean) =>
    `inline-flex h-8 items-center gap-1 rounded-md px-2 text-xs font-medium transition ${active ? "bg-primary text-primary-foreground" : "bg-secondary hover:bg-secondary/80 text-foreground"}`;
  return (
    <div className="flex flex-wrap gap-1 rounded-t-xl border border-border bg-card p-2">
      <button type="button" className={btn(editor.isActive("heading", { level: 2 }))} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}><Heading2 className="h-3.5 w-3.5" />H2</button>
      <button type="button" className={btn(editor.isActive("heading", { level: 3 }))} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}><Heading3 className="h-3.5 w-3.5" />H3</button>
      <button type="button" className={btn(editor.isActive("heading", { level: 4 }))} onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}><Heading4 className="h-3.5 w-3.5" />H4</button>
      <button type="button" className={btn(editor.isActive("bold"))} onClick={() => editor.chain().focus().toggleBold().run()}><Bold className="h-3.5 w-3.5" /></button>
      <button type="button" className={btn(editor.isActive("italic"))} onClick={() => editor.chain().focus().toggleItalic().run()}><Italic className="h-3.5 w-3.5" /></button>
      <button type="button" className={btn(editor.isActive("bulletList"))} onClick={() => editor.chain().focus().toggleBulletList().run()}><List className="h-3.5 w-3.5" /></button>
      <button type="button" className={btn(editor.isActive("orderedList"))} onClick={() => editor.chain().focus().toggleOrderedList().run()}><ListOrdered className="h-3.5 w-3.5" /></button>
      <button type="button" className={btn(editor.isActive("blockquote"))} onClick={() => editor.chain().focus().toggleBlockquote().run()}><Quote className="h-3.5 w-3.5" /></button>
      <button type="button" className={btn(editor.isActive("link"))} onClick={onLink}><LinkIcon className="h-3.5 w-3.5" /></button>
      <button type="button" className={btn(false)} onClick={onImage}><ImageIcon className="h-3.5 w-3.5" />Image</button>
      <button type="button" className={btn(false)} onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}><TableI className="h-3.5 w-3.5" />Table</button>
      <span className="mx-1 w-px bg-border" />
      <button type="button" className={btn(false)} onClick={() => editor.chain().focus().undo().run()}><Undo className="h-3.5 w-3.5" /></button>
      <button type="button" className={btn(false)} onClick={() => editor.chain().focus().redo().run()}><Redo className="h-3.5 w-3.5" /></button>
      <span className="ml-auto flex items-center gap-1 text-xs text-muted-foreground">
        <Button type="button" size="sm" variant="ghost" className="h-7 px-2 text-xs" onClick={() => editor.chain().focus().setParagraph().run()}>¶ Paragraph</Button>
      </span>
    </div>
  );
}