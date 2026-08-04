<script setup>
import { TextAlign } from '@tiptap/extension-text-align'
import { StarterKit } from '@tiptap/starter-kit'
import {
  EditorContent,
  useEditor,
} from '@tiptap/vue-3'

const editor = useEditor({
  content: `
    <h1>Welcome to Tiptap Editor! 🎉</h1>
    <p>
      This is a feature-rich text editor built with Tiptap. Try out the formatting options in the toolbar above.
    </p>
    <h2>Features include:</h2>
    <ul>
      <li>Text formatting (bold, italic, strike-through)</li>
      <li>Headings (H1, H2)</li>
      <li>Lists (bullet and numbered)</li>
      <li>Code blocks</li>
      <li>Text alignment</li>
      <li>Undo/Redo</li>
    </ul>
    <p>
      Start typing here or try out the various formatting options above! ✨
    </p>
  `,
  extensions: [
    StarterKit,
    TextAlign.configure({
      types: [
        'heading',
        'paragraph',
      ],
    }),
  ],
})

// Cleanup
onBeforeUnmount(() => {
  editor.value?.destroy()
})
</script>

<template>
  <VCard title="Tiptap Editor">
    <VDivider />
    <!-- 👉 Editor Toolbar -->
    <div class="editor-toolbar d-flex flex-wrap gap-3 pt-2 px-5">
      <div class="d-flex flex-wrap gap-1">
        <VBtn
          :class="{ 'text-primary': editor?.isActive('heading', { level: 1 }) }"
          variant="tonal"
          icon
          rounded
          size="small"
          @click="editor?.chain().focus().toggleHeading({ level: 1 }).run()"
        >
          <VIcon icon="mdi-format-header-1" />
        </VBtn>

        <VBtn
          :class="{ 'text-primary': editor?.isActive('heading', { level: 2 }) }"
          variant="tonal"
          icon
          rounded
          size="small"
          @click="editor?.chain().focus().toggleHeading({ level: 2 }).run()"
        >
          <VIcon
            icon="mdi-format-header-2"
            size="20"
          />
        </VBtn>

        <VBtn
          :class="{ 'text-primary': editor?.isActive('bold') }"
          variant="tonal"
          icon
          rounded
          size="small"
          @click="editor?.chain().focus().toggleBold().run()"
        >
          <VIcon icon="mdi-format-bold" />
        </VBtn>

        <VBtn
          :class="{ 'text-primary': editor?.isActive('italic') }"
          variant="tonal"
          icon
          rounded
          size="small"
          @click="editor?.chain().focus().toggleItalic().run()"
        >
          <VIcon icon="mdi-format-italic" />
        </VBtn>

        <VBtn
          :class="{ 'text-primary': editor?.isActive('strike') }"
          variant="tonal"
          icon
          rounded
          size="small"
          @click="editor?.chain().focus().toggleStrike().run()"
        >
          <VIcon icon="mdi-format-strikethrough" />
        </VBtn>

        <VBtn
          :class="{ 'text-primary': editor?.isActive('code') }"
          variant="tonal"
          icon
          rounded
          size="small"
          @click="editor?.chain().focus().toggleCode().run()"
        >
          <VIcon icon="mdi-code-tags" />
        </VBtn>
      </div>

      <div class="d-flex flex-wrap gap-1">
        <VBtn
          variant="tonal"
          icon
          rounded
          size="small"
          :class="{ 'text-primary': editor?.isActive('bulletList') }"
          @click="editor?.chain().focus().toggleBulletList().run()"
        >
          <VIcon icon="mdi-format-list-bulleted" />
        </VBtn>

        <VBtn
          variant="tonal"
          icon
          rounded
          size="small"
          :class="{ 'text-primary': editor?.isActive('orderedList') }"
          @click="editor?.chain().focus().toggleOrderedList().run()"
        >
          <VIcon icon="mdi-format-list-numbered" />
        </VBtn>

        <VBtn
          variant="tonal"
          icon
          rounded
          size="small"
          :class="{ 'text-primary': editor?.isActive('codeBlock') }"
          @click="editor?.chain().focus().toggleCodeBlock().run()"
        >
          <VIcon icon="mdi-code-block-tags" />
        </VBtn>
      </div>

      <div class="d-flex flex-wrap gap-1">
        <VBtn
          variant="tonal"
          icon
          rounded
          size="small"
          :class="{ 'text-primary': editor?.isActive({ textAlign: 'left' }) }"
          @click="editor?.chain().focus().setTextAlign('left').run()"
        >
          <VIcon icon="mdi-format-align-left" />
        </VBtn>

        <VBtn
          variant="tonal"
          icon
          rounded
          size="small"
          :class="{ 'text-primary': editor?.isActive({ textAlign: 'center' }) }"
          @click="editor?.chain().focus().setTextAlign('center').run()"
        >
          <VIcon icon="mdi-format-align-middle" />
        </VBtn>

        <VBtn
          variant="tonal"
          icon
          rounded
          size="small"
          :class="{ 'text-primary': editor?.isActive({ textAlign: 'right' }) }"
          @click="editor?.chain().focus().setTextAlign('right').run()"
        >
          <VIcon icon="mdi-format-align-right" />
        </VBtn>

        <VBtn
          variant="tonal"
          icon
          rounded
          size="small"
          :class="{ 'text-primary': editor?.isActive({ textAlign: 'justify' }) }"
          @click="editor?.chain().focus().setTextAlign('justify').run()"
        >
          <VIcon icon="mdi-format-align-justify" />
        </VBtn>
      </div>

      <div class="d-flex flex-wrap gap-1">
        <VBtn
          variant="tonal"
          icon
          rounded
          size="small"
          @click="editor?.chain().focus().undo().run()"
        >
          <VIcon icon="mdi-undo" />
        </VBtn>

        <VBtn
          variant="tonal"
          icon
          rounded
          size="small"
          @click="editor?.chain().focus().redo().run()"
        >
          <VIcon icon="mdi-redo" />
        </VBtn>
      </div>
    </div>

    <VCardText>
      <!-- 👉 Editor Content -->
      <EditorContent
        :editor="editor"
        class="editor-content"
      />
    </VCardText>
  </VCard>
</template>

<style lang="scss">
.editor-toolbar {
  border-block-end: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  padding-block-end: 0.5rem;
}

.editor-content {
  .ProseMirror {
    min-block-size: 300px;
    outline: none;
    padding-inline: 0;

    > * + * {
      margin-block-start: 0.75em;
    }

    ul,
    ol {
      padding-block: 0;
      padding-inline: 1rem;
    }

    h1 {
      font-size: 2em;
      font-weight: bold;
      line-height: 1.1;
    }

    h2 {
      font-size: 1.5em;
      font-weight: bold;
      line-height: 1.1;
    }

    code {
      padding: 0.25rem;
      border-radius: 0.25rem;
      background-color: rgba(#616161, 0.1);
      color: #616161;
    }

    pre {
      border-radius: 0.5rem;
      background: #0d0d0d;
      color: #fff;
      padding-block: 0.75rem;
      padding-inline: 1rem;

      code {
        padding: 0;
        background: none;
        color: inherit;
        font-size: 0.8rem;
      }
    }

    img {
      block-size: auto;
      max-inline-size: 100%;
    }

    blockquote {
      border-inline-start: 2px solid rgba(#0d0d0d, 0.1);
      padding-inline-start: 1rem;
    }

    hr {
      border: none;
      border-block-start: 2px solid rgba(#0d0d0d, 0.1);
      margin-block: 2rem;
      margin-inline: 0;
    }
  }
}
</style>
