import { Link, useParams } from "wouter";
import { articles } from "../data/articles";
import { marked } from "marked";
import DOMPurify from "dompurify";
import { useMemo } from "react";

// Configure marked to not add unnecessary wrappers
marked.use({ gfm: true });

export default function Article() {
  const { slug } = useParams<{ slug: string }>();
  const article = articles.find(a => a.slug === slug && a.published);

  const htmlContent = useMemo(() => {
    if (!article?.content) return "";
    const raw = marked.parse(article.content) as string;
    return DOMPurify.sanitize(raw, {
      ALLOWED_TAGS: [
        "p", "br", "strong", "em", "b", "i", "u", "s",
        "h1", "h2", "h3", "h4", "h5", "h6",
        "ul", "ol", "li",
        "blockquote", "pre", "code",
        "a", "img",
        "hr", "table", "thead", "tbody", "tr", "th", "td",
      ],
      ALLOWED_ATTR: ["href", "src", "alt", "title", "target", "rel"],
      FORCE_BODY: true,
    });
  }, [article?.content]);

  if (!article) {
    return (
      <div className="min-h-[100dvh] bg-background text-foreground p-4 md:p-8 flex justify-center font-mono">
        <div className="max-w-3xl w-full flex flex-col space-y-8">
          <nav className="text-sm" data-testid="breadcrumb-nav">
            ~/ <Link href="/" className="text-primary no-underline hover:underline">Home</Link>{" "}
            / <Link href="/blog" className="text-primary no-underline hover:underline">Blog</Link>{" "}
            / Not Found
          </nav>
          <div className="py-12">
            <h1 className="text-2xl font-sans text-primary">Article not found</h1>
            <p className="mt-4 text-muted-foreground">
              The article you are looking for does not exist or has been removed.
            </p>
            <Link href="/blog" className="mt-8 inline-block text-primary hover:underline">
              ← Back to archive
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] bg-background text-foreground p-4 md:p-8 flex justify-center font-mono">
      <div className="max-w-3xl w-full flex flex-col space-y-8">

        <nav className="text-sm mb-4" data-testid="breadcrumb-nav">
          ~/ <Link href="/" className="text-primary no-underline hover:underline">Home</Link>{" "}
          / <Link href="/blog" className="text-primary no-underline hover:underline">Blog</Link>{" "}
          / {article.title}
        </nav>

        <article className="space-y-8">
          <header className="space-y-4 border-b border-border pb-8">
            <h1 className="text-4xl md:text-5xl font-sans font-bold text-primary tracking-tight" data-testid="article-title">
              {article.title}
            </h1>
            {article.subtitle && (
              <p className="text-xl text-foreground font-sans font-medium" data-testid="article-subtitle">
                {article.subtitle}
              </p>
            )}
            <p className="text-sm text-muted-foreground font-mono" data-testid="article-date">
              {new Date(article.publishedDate).toISOString().split('T')[0]}
            </p>
          </header>

          <div
            className="prose prose-invert prose-p:text-foreground prose-p:font-sans prose-p:leading-relaxed prose-headings:font-sans prose-headings:text-primary prose-a:text-primary max-w-none"
            data-testid="article-content"
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />
        </article>

        <div className="pt-16 pb-8 border-t border-border mt-16">
          <Link href="/blog" className="text-muted-foreground hover:text-foreground no-underline hover:underline">
            ← Back to archive
          </Link>
        </div>

      </div>
    </div>
  );
}
