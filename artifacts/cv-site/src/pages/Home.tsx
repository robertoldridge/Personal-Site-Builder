import { Link } from "wouter";

export default function Home() {
  return (
    <div className="min-h-[100dvh] bg-background text-foreground p-4 md:p-12 flex justify-center">
      <div className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16 pt-8">
        
        {/* Left Column - Bio */}
        <aside className="md:col-span-5 space-y-6">
          <header className="space-y-4">
            <h1 className="text-4xl md:text-5xl tracking-tight" data-testid="text-name">
              Your Name
            </h1>
            <p className="text-xl font-sans font-medium text-foreground" data-testid="text-title">
              Developer / Researcher / Thinker
            </p>
          </header>

          <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border border-border mt-8 mb-6 bg-muted/50 flex items-center justify-center">
            {/* Using a placeholder visual or avatar initials if image is missing */}
            <span className="text-4xl font-sans text-muted-foreground" data-testid="img-avatar-placeholder">
              YN
            </span>
          </div>

          <div className="prose prose-invert prose-p:text-foreground prose-p:leading-relaxed" data-testid="text-bio">
            <p>
              Welcome to my homepage. I am a developer based in San Francisco. I spend my time thinking about software, writing, and how technology shapes our lives. This site collects my writing, projects, and other things worth sharing.
            </p>
          </div>
          
          <nav className="pt-8" data-testid="nav-menu">
            <table className="w-full border-collapse border border-border text-left font-sans text-base">
              <tbody>
                <tr className="border-b border-border">
                  <th className="py-2 px-3 border-r border-border font-medium w-1/3">
                    <Link href="#blog" className="no-underline hover:underline" data-testid="link-nav-blog">Blog</Link>
                  </th>
                  <td className="py-2 px-3 text-muted-foreground text-sm">Occasional essays and notes</td>
                </tr>
                <tr className="border-b border-border">
                  <th className="py-2 px-3 border-r border-border font-medium">
                    <Link href="#projects" className="no-underline hover:underline" data-testid="link-nav-projects">Projects</Link>
                  </th>
                  <td className="py-2 px-3 text-muted-foreground text-sm">Things I have made and maintain</td>
                </tr>
                <tr className="border-b border-border">
                  <th className="py-2 px-3 border-r border-border font-medium">
                    <Link href="#about" className="no-underline hover:underline" data-testid="link-nav-about">About</Link>
                  </th>
                  <td className="py-2 px-3 text-muted-foreground text-sm">More about me</td>
                </tr>
                <tr>
                  <th className="py-2 px-3 border-r border-border font-medium">
                    <Link href="#contact" className="no-underline hover:underline" data-testid="link-nav-contact">Contact</Link>
                  </th>
                  <td className="py-2 px-3 text-muted-foreground text-sm">Get in touch</td>
                </tr>
              </tbody>
            </table>
          </nav>
        </aside>

        {/* Right Column - Content */}
        <main className="md:col-span-7 space-y-12">
          
          <section id="blog" className="space-y-6">
            <h2 className="text-2xl border-b border-border pb-2 inline-block">Recent Writings</h2>
            
            <ul className="space-y-6">
              <li className="space-y-1">
                <Link href="#" className="font-sans font-medium text-lg leading-tight" data-testid="link-writing-1">
                  On Building Things That Last
                </Link>
                <p className="text-muted-foreground text-sm">Why craftsmanship still matters in the age of AI</p>
              </li>
              
              <li className="space-y-1">
                <Link href="#" className="font-sans font-medium text-lg leading-tight" data-testid="link-writing-2">
                  The Case for Plain Text
                </Link>
                <p className="text-muted-foreground text-sm">Complexity is a cost most people do not account for</p>
              </li>
              
              <li className="space-y-1">
                <Link href="#" className="font-sans font-medium text-lg leading-tight" data-testid="link-writing-3">
                  Notes on Deep Work
                </Link>
                <p className="text-muted-foreground text-sm">How I structure my days to think clearly</p>
              </li>
              
              <li className="space-y-1">
                <Link href="#" className="font-sans font-medium text-lg leading-tight" data-testid="link-writing-4">
                  Why I Write Online
                </Link>
                <p className="text-muted-foreground text-sm">Writing is thinking made public</p>
              </li>
              
              <li className="space-y-1">
                <Link href="#" className="font-sans font-medium text-lg leading-tight" data-testid="link-writing-5">
                  Tools I Use
                </Link>
                <p className="text-muted-foreground text-sm">A living document of software, hardware, and practices I rely on</p>
              </li>
            </ul>
            
            <div className="pt-4">
              <Link href="#" className="secondary-link font-sans text-sm" data-testid="link-all-posts">View all archives →</Link>
            </div>
          </section>

          <section id="projects" className="space-y-6 pt-8 border-t border-border">
            <h2 className="text-2xl border-b border-border pb-2 inline-block">Selected Projects</h2>
            
            <ul className="space-y-6">
              <li className="space-y-1">
                <Link href="#" className="font-sans font-medium text-lg leading-tight" data-testid="link-project-1">
                  Minimalist Writer
                </Link>
                <p className="text-muted-foreground text-sm">A distraction-free writing environment built on raw web technologies.</p>
              </li>
              <li className="space-y-1">
                <Link href="#" className="font-sans font-medium text-lg leading-tight" data-testid="link-project-2">
                  System Stats Daemon
                </Link>
                <p className="text-muted-foreground text-sm">A lightweight, highly-optimized daemon for monitoring server health.</p>
              </li>
            </ul>
          </section>

          <footer className="pt-16 pb-8 border-t border-border mt-16 text-muted-foreground text-sm font-sans flex justify-between items-center" data-testid="footer">
            <p>&copy; {new Date().getFullYear()} Your Name.</p>
            <p>
              <Link href="#" className="text-muted-foreground hover:text-foreground no-underline hover:underline">RSS</Link>
              <span className="mx-2">·</span>
              <Link href="#" className="text-muted-foreground hover:text-foreground no-underline hover:underline">Source</Link>
            </p>
          </footer>

        </main>
      </div>
    </div>
  );
}
