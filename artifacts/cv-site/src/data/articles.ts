// ============================================================
// EDIT YOUR ARTICLES / BLOG POSTS HERE
// ============================================================
// Articles are shown in reverse-chronological order on the Blog page.
// The 8 most recent published articles also appear on the homepage.
//
// ADDING A NEW ARTICLE:
//   1. Copy one of the blocks below.
//   2. Give it a unique `slug` (URL-safe, e.g. "my-new-post").
//   3. Set `published: true` when ready to go live (false = draft, not shown).
//   4. Write the article content in Markdown inside the `content` field.
//      You can use headings (##), bold (**text**), links ([text](url)), etc.

export const articles = [
  {
    slug: "on-building-things-that-last",
    title: "On Building Things That Last",
    subtitle: "Why craftsmanship still matters in the age of AI",
    // Format: "YYYY-MM-DD"
    publishedDate: "2024-03-15",
    published: true,
    content: `## On Building Things That Last

There is a certain satisfaction in making something that endures. Not because it is rigid, but because it is honest — built for the problem at hand, not for the impression it makes.

Software has a peculiar relationship with time. The things we call "legacy" are often simply the things that worked well enough that nobody bothered replacing them. Legacy is just success wearing old clothes.

### The temptation of the new

Every generation of developers inherits tools and systems they did not choose. The temptation is to rebuild — to impose your understanding on the problem, to make it feel clean and modern. This temptation is not always wrong, but it is almost always overestimated.

Before you refactor, ask: what problem is this code actually solving? Not the problem as stated in the ticket, but the real problem — the edge case that never made it into the docs, the constraint that was obvious to whoever wrote this five years ago.

### What makes something last?

Things that last tend to share a few properties:

- They do one thing and do it well
- They make their assumptions explicit
- They fail loudly rather than silently
- They are boring in the best possible sense

Boring software is software that does exactly what you expect. It does not surprise you. It does not require you to hold a mental model of its internals to use it safely.

### A closing thought

The goal is not to write code that impresses other developers. The goal is to write code that solves a problem so completely that the problem stops being interesting.

That is what lasts.`,
  },

  {
    slug: "the-case-for-plain-text",
    title: "The Case for Plain Text",
    subtitle: "Complexity is a cost most people do not account for",
    publishedDate: "2024-01-20",
    published: true,
    content: `## The Case for Plain Text

Every format is a bet on the future. When you choose a format for your data, you are betting that the tools to read it will still exist, still be affordable, and still be willing to open your files in ten years.

Plain text almost always wins that bet.

### What plain text gives you

Plain text is readable without any software beyond a basic text editor. It is searchable with tools that have existed for decades. It compresses well. It diffs cleanly. It works with every version control system ever made.

Most importantly: plain text does not rot. A \`.txt\` file written in 1985 opens perfectly today.

### The complexity cost

Every layer of abstraction you add has a maintenance cost. That cost is easy to underestimate when the abstraction is new and exciting. It becomes clearer five years later, when the tool that generates it has changed its format, the company behind it has pivoted, or you have simply forgotten how it all worked.

The question to ask before adding complexity is not "does this make things better now?" but "will I be able to understand this in three years, alone, at 11pm?"

### Practical notes

- Notes: plain markdown files in a folder
- Writing: plain markdown, compiled to HTML at build time
- Data: CSV for anything tabular; JSON for anything structured
- Configuration: TOML or YAML with strict schemas

This is not dogma. Databases exist for good reasons. But the default should be plain text, and the burden of proof should be on the complexity.`,
  },

  {
    slug: "why-i-write-online",
    title: "Why I Write Online",
    subtitle: "Writing is thinking made public",
    publishedDate: "2023-11-05",
    published: true,
    content: `## Why I Write Online

Writing is how I find out what I think. This is not a metaphor — until I write something down, I genuinely do not know whether I believe it. The act of choosing words forces a precision that thinking alone does not.

Publishing that writing adds a second constraint: someone else might read it. That possibility changes how carefully I choose my words.

### The embarrassment filter

The knowledge that someone might read what I write is the most effective quality filter I have found. If I am embarrassed to publish something, it usually means one of two things: either I do not actually believe it, or I have not thought it through carefully enough.

Both of those are useful signals.

### What writing teaches you

Writing regularly teaches you that most of what feels profound in your head is obvious or confused on paper. This is not a discouraging discovery — it is a productive one. It means you can find the actually interesting parts by eliminating the rest.

The posts that have taken me longest to write are almost always the ones where I was trying to rescue a feeling of insight that I never quite managed to earn.

### A practical note

I do not write to build an audience. I write because the thinking is useful to me, and because occasionally someone finds it useful too. That ordering matters — if I wrote primarily to be read, I would write differently, and probably worse.`,
  },

  // To add a new article, copy the block below and fill it in:
  // {
  //   slug: "my-new-article",            // URL: /blog/my-new-article
  //   title: "My New Article",
  //   subtitle: "A subtitle for the article",
  //   publishedDate: "2025-01-01",
  //   published: true,                    // set to false to keep as draft
  //   content: `## My New Article
  //
  // Write your article here in Markdown...
  //
  // ### A Heading
  //
  // More content.`,
  // },
];
