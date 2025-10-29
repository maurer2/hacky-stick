<script lang="ts">
  import { z } from 'zod';

  import bookJSON from './assets/book.json' with { type: 'json' };

  export const bookSchema = z.strictObject({
    title: z.string(),
    author: z.string(),
    chapters: z.array(
      z.object({
        title: z.string(),
        content: z.string(),
      }),
    ),
  });
  const { data: book } = bookSchema.safeParse(bookJSON);
  const isSupportingScrollStateQueries = CSS.supports('container-type: scroll-state');
</script>

<header class="masthead">
  <h1 class="title">Scroll state queries</h1>
</header>

<main>
  {#if !isSupportingScrollStateQueries}
    <div role="alert" class="alert-message">
      Scroll state queries are not supported in this browser.
    </div>
  {/if}

  {#each book?.chapters as chapter}
    <section class="chapter">
      <header class="chapter-header">
        <h2 class="chapter-title">{chapter.title}</h2>
      </header>
      <p class="chapter-content">{chapter.content}</p>
    </section>
  {:else}
    <p>No data found.</p>
  {/each}
</main>

<style>
  .masthead {
    display: flow-root;
  }

  .title {
    margin-block-start: 0;
  }

  main {
    counter-reset: section;
  }

  .alert-message {
    margin-block-end: 1rem;
    color: #dcdcaa;
  }

  .chapter {
    counter-increment: section;
  }

  .chapter-header {
    position: sticky;
    inset-block-start: 0;
    container-type: scroll-state;
    container-name: chapter-header;
  }

  .chapter-title {
    display: flex;
    margin-block: 0;
    padding-block: 0.5rem;
    padding-inline: 0.5rem;
    gap: 1rem;
    font-size: 1.25rem;
    background: #267f99;

    /* :stuck */
    @container chapter-header scroll-state(stuck: top) {
      background: #098658;
    }

    &:after {
      content: counter(section);
      margin-inline-start: auto;
    }
  }

  .chapter-content {
    margin-block-start: 1rem;
    margin-block-end: 2rem;
  }
</style>
