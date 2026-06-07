import { Link } from "wouter";
import { useListArticles } from "@workspace/api-client-react";
import * as fallbackData from "../data/content";

export default function Blog() {
  const { data: apiArticles } = useListArticles();
  
  const articles = apiArticles && apiArticles.length > 0 ? apiArticles : fallbackData.articles;
  const publishedArticles = articles.filter(a => a.published).sort((a, b) => {
    return new Date(b.publishedDate ?? 0).getTime() - new Date(a.publishedDate ?? 0).getTime();
  });

  return (
    <div className="min-h-[100dvh] bg-background text-foreground p-4 md:p-8 flex justify-center font-mono">
      <div className="max-w-4xl w-full flex flex-col space-y-12">
        <nav className="text-sm mb-4" data-testid="breadcrumb-nav">
          Navigation ~/ <Link href="/" className="text-primary no-underline hover:underline">Home</Link> / Blog
        </nav>

        <section className="space-y-6">
          <h1 className="text-3xl border-b border-border pb-2 inline-block font-sans font-bold text-primary">Archive</h1>
          
          <div className="overflow-x-auto pt-6">
            <table className="w-full text-sm text-left border-collapse" data-testid="table-archive">
              <thead>
                <tr className="border-b border-border text-muted-foreground">
                  <th className="py-2 pr-4 font-normal w-32">Date</th>
                  <th className="py-2 pr-4 font-normal">Title</th>
                  <th className="py-2 font-normal text-right w-24">Link</th>
                </tr>
              </thead>
              <tbody>
                {publishedArticles.map((article) => (
                  <tr key={article.slug} className="border-b border-border/50 hover:bg-muted/20 group">
                    <td className="py-3 pr-4 text-muted-foreground whitespace-nowrap">
                      {article.publishedDate ? new Date(article.publishedDate).toISOString().split('T')[0] : ""}
                    </td>
                    <td className="py-3 pr-4">
                      <Link href={`/blog/${article.slug}`} className="font-sans font-medium text-base text-foreground no-underline group-hover:underline">
                        {article.title}
                      </Link>
                    </td>
                    <td className="py-3 text-right">
                      <Link href={`/blog/${article.slug}`} className="inline-block bg-primary/10 text-primary border border-primary/20 px-2 py-1 rounded hover:bg-primary hover:text-primary-foreground transition-colors">
                        Read →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <div className="pt-8 border-t border-border">
          <Link href="/" className="text-muted-foreground hover:text-foreground">← Back to home</Link>
        </div>
      </div>
    </div>
  );
}
