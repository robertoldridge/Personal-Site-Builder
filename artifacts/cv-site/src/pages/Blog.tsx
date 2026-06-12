import { Link } from "wouter";
import { articles } from "../data/articles";

const publishedArticles = articles
  .filter(a => a.published)
  .sort((a, b) => new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime());

export default function Blog() {
  return (
    <div className="min-h-[100dvh] bg-background text-foreground p-4 md:p-8 flex justify-center font-mono">
      <div className="max-w-4xl w-full flex flex-col space-y-12">

        <nav className="text-sm mb-4" data-testid="breadcrumb-nav">
          ~/ <Link href="/" className="text-primary no-underline hover:underline">Home</Link> / Blog
        </nav>

        <section className="space-y-6">
          <h1 className="text-3xl border-b border-border pb-2 inline-block font-sans font-bold text-primary">Archive</h1>

          {publishedArticles.length === 0 ? (
            <p className="text-muted-foreground text-sm pt-4">No articles yet.</p>
          ) : (
            <div className="overflow-x-auto pt-6">
              <table className="w-full text-sm text-left border-collapse" data-testid="table-archive">
                <thead>
                  <tr className="border-b border-border text-muted-foreground">
                    <th className="py-2 pr-4 font-normal w-28">Date</th>
                    <th className="py-2 font-normal">Title</th>
                  </tr>
                </thead>
                <tbody>
                  {publishedArticles.map((article) => (
                    <tr key={article.slug} className="border-b border-border/50 hover:bg-muted/20 group">
                      <td className="py-3 pr-4 text-muted-foreground whitespace-nowrap text-xs">
                        {new Date(article.publishedDate).toISOString().split('T')[0]}
                      </td>
                      <td className="py-3">
                        <Link
                          href={`/blog/${article.slug}`}
                          className="font-sans font-medium text-base text-foreground no-underline group-hover:underline"
                        >
                          {article.title}
                        </Link>
                        {article.subtitle && (
                          <span className="block text-xs text-muted-foreground mt-0.5">{article.subtitle}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <div className="pt-8 border-t border-border">
          <Link href="/" className="text-muted-foreground hover:text-foreground no-underline hover:underline">
            ← Back to home
          </Link>
        </div>

      </div>
    </div>
  );
}
