<script lang="ts">
  import { z } from 'zod';

  import bookJSON from './assets/book.json' with { type: 'json' };

  const bookSchema = z.strictObject({
    title: z.string(),
    author: z.string(),
    chapters: z
      .array(
        z.strictObject({
          title: z.string(),
          content: z.string(),
        }),
      )
      .transform((entries) =>
        entries.map((entry, index) => ({
          ...entry,
          id: `chapter-${index + 1}`,
        })),
      ),
  });
  const { data: book } = bookSchema.safeParse(bookJSON);
  const isSupportingScrollStateQueries = CSS.supports('container-type: scroll-state');
</script>

<header class="masthead">
  <h1 class="title">Scroll state queries</h1>
</header>
<nav class="table-of-contents" aria-label="Table of contents">
  <ol class="navlist" role="list">
    {#each book?.chapters as chapter}
      <li><a class="navlink" href={`#${chapter.id}`}>{chapter.title}</a></li>
    {/each}
  </ol>
</nav>
<main>
  {#if !isSupportingScrollStateQueries}
    <div role="alert" class="alert-message">
      Scroll state queries are not supported in this browser.
    </div>
  {/if}
  {#each book?.chapters as chapter}
    <section class="chapter" id={chapter.id}>
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
    font-size: 2.5rem;
  }

  main {
    counter-reset: section;
  }

  .alert-message {
    margin-block-end: 1rem;
    color: var(--color-secondary);
  }

  .chapter {
    counter-increment: section;
  }

  .chapter-header {
    position: sticky;
    inset-block-start: 1px; /* workaround for anchor links */
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
    background: var(--color-primary);

    /* :stuck */
    @container chapter-header scroll-state(stuck: top) {
      background: var(--color-primary-active);
    }

    &:after {
      content: counter(section, upper-roman);
      margin-inline-start: auto;
      color: var(--color-background);
    }
  }

  .chapter-content {
    margin-block-start: 1rem;
    margin-block-end: 2rem;
  }

  .table-of-contents {
    display: none;
    position: fixed;
    inset-block-start: 1rem;
    inset-inline-end: 1rem;
    inline-size: 225px;

    @media (width >= 1250px) {
      display: block;
    }
  }

  .navlist {
    margin: 0;
    list-style-type: upper-roman;
    scroll-target-group: auto;

    ::marker {
      font-size: 0.75rem;
      padding-right: 1rem;
    }
  }

  .navlink {
    color: var(--color-text);

    &:is(:hover, :focus-visible) {
      color: var(--color-primary);
    }

    &:target-current {
      color: var(--color-primary-active);
    }
  }
</style>
