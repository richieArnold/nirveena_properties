import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import { useState } from "react";

const BlogEditor = ({ content, setContent }) => {
  const [linkUrl, setLinkUrl] = useState("");

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: false,
        orderedList: false,
        listItem: false,
        heading: { levels: [1, 2] },
      }),
      Link.configure({
        openOnClick: true,
      }),
    ],
    content: content || "",
    onUpdate: ({ editor }) => {
      setContent(editor.getHTML());
    },
  });

  if (!editor) return null;

  const addLink = () => {
    if (!linkUrl) return;

    editor
      .chain()
      .focus()
      .extendMarkRange("link")
      .setLink({ href: linkUrl })
      .run();

    setLinkUrl("");
  };

  const removeLink = () => {
    editor.chain().focus().unsetLink().run();
  };

  return (
    <div className="border rounded-lg bg-white">

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2 border-b p-2 bg-gray-50">

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`px-2 py-1 border rounded text-sm ${
            editor.isActive("bold") ? "bg-gray-200" : ""
          }`}
        >
          Bold
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`px-2 py-1 border rounded text-sm ${
            editor.isActive("italic") ? "bg-gray-200" : ""
          }`}
        >
          Italic
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`px-2 py-1 border rounded text-sm ${
            editor.isActive("heading", { level: 1 }) ? "bg-gray-200" : ""
          }`}
        >
          H1
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`px-2 py-1 border rounded text-sm ${
            editor.isActive("heading", { level: 2 }) ? "bg-gray-200" : ""
          }`}
        >
          H2
        </button>

        {/* Link Input */}
        <input
          type="text"
          placeholder="Paste link..."
          value={linkUrl}
          onChange={(e) => setLinkUrl(e.target.value)}
          className="border px-2 py-1 text-sm rounded"
        />

        <button
          type="button"
          onClick={addLink}
          className="px-2 py-1 border rounded text-sm bg-blue-500 text-white"
        >
          Add Link
        </button>

        <button
          type="button"
          onClick={removeLink}
          className="px-2 py-1 border rounded text-sm"
        >
          Remove Link
        </button>

      </div>

      {/* Editor */}
      <div className="p-4 min-h-[250px]">
        <EditorContent editor={editor} />
      </div>

    </div>
  );
};

export default BlogEditor;