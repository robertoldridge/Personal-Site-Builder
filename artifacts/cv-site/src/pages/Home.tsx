import { Link } from "wouter";
import { profile } from "../data/profile";
import { articles } from "../data/articles";
import { projects } from "../data/projects";
import { experience } from "../data/experience";
import { education } from "../data/education";

const publishedArticles = articles
  .filter(a => a.published)
  .sort((a, b) => new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime())
  .slice(0, 8);

function getInitials(name: string) {
  return name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase() || "?";
}

export default function Home() {
  return (
    <div className="min-h-[100dvh] bg-background text-foreground p-4 md:p-8 flex justify-center font-mono">
      <div className="max-w-6xl w-full flex flex-col space-y-12">

        <nav className="text-sm mb-4" data-testid="breadcrumb-nav">
          ~/ <Link href="/" className="text-foreground no-underline hover:underline">Home</Link>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">

          {/* Left Column */}
          <aside className="lg:col-span-4 space-y-10">
            <header className="space-y-3">
              <h1 className="text-4xl md:text-5xl tracking-tight text-primary font-bold font-sans" data-testid="text-name">
                {profile.name || "Your Name"}
              </h1>
              <p className="text-lg font-sans font-medium text-foreground" data-testid="text-title">
                {profile.title}
              </p>
            </header>

            {/* Avatar */}
            <div className="w-28 h-28 md:w-36 md:h-36 rounded-full overflow-hidden border border-border bg-muted/50 flex items-center justify-center">
              {profile.avatarUrl ? (
                <img
                  src={profile.avatarUrl}
                  alt={profile.name}
                  className="w-full h-full object-cover"
                  data-testid="img-avatar"
                />
              ) : (
                <span className="text-3xl font-sans text-muted-foreground" data-testid="img-avatar-placeholder">
                  {getInitials(profile.name)}
                </span>
              )}
            </div>

            {/* Bio */}
            <p className="text-foreground leading-relaxed font-sans text-sm" data-testid="text-bio">
              {profile.bio}
            </p>

            {/* About table */}
            <section id="about" className="space-y-4">
              <h2 className="text-xl border-b border-border pb-2 font-sans">About</h2>
              <table className="w-full text-sm text-left border-collapse" data-testid="table-personal-info">
                <tbody>
                  <tr className="border-b border-border/50">
                    <th className="py-2 pr-4 font-normal text-muted-foreground whitespace-nowrap w-2/5">Name</th>
                    <td className="py-2">{profile.name}</td>
                  </tr>
                  <tr className="border-b border-border/50">
                    <th className="py-2 pr-4 font-normal text-muted-foreground whitespace-nowrap">Occupation</th>
                    <td className="py-2">{profile.title}</td>
                  </tr>
                  {profile.location && (
                    <tr className="border-b border-border/50">
                      <th className="py-2 pr-4 font-normal text-muted-foreground whitespace-nowrap">Location</th>
                      <td className="py-2">{profile.location}</td>
                    </tr>
                  )}
                  {experience.length > 0 && (
                    <tr className="border-b border-border/50">
                      <th className="py-2 pr-4 font-normal text-muted-foreground whitespace-nowrap">Employer</th>
                      <td className="py-2">
                        {experience[0].companyUrl ? (
                          <a href={experience[0].companyUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                            {experience[0].company}
                          </a>
                        ) : experience[0].company}
                      </td>
                    </tr>
                  )}
                  {education.length > 0 && (
                    <tr>
                      <th className="py-2 pr-4 font-normal text-muted-foreground whitespace-nowrap">Education</th>
                      <td className="py-2">{education[0].degree}, {education[0].institution}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </section>

            {/* Contact table */}
            {(profile.email || profile.phone || profile.githubUrl || profile.linkedinUrl) && (
              <section className="space-y-4">
                <h2 className="text-xl border-b border-border pb-2 font-sans">Contact</h2>
                <table className="w-full text-sm text-left border-collapse" data-testid="table-contact">
                  <tbody>
                    {profile.email && (
                      <tr className="border-b border-border/50">
                        <th className="py-2 pr-4 font-normal text-muted-foreground whitespace-nowrap w-2/5">Email</th>
                        <td className="py-2">
                          <a href={`mailto:${profile.email}`} className="text-primary hover:underline">
                            {profile.email}
                          </a>
                        </td>
                      </tr>
                    )}
                    {profile.phone && (
                      <tr className="border-b border-border/50">
                        <th className="py-2 pr-4 font-normal text-muted-foreground whitespace-nowrap">Phone</th>
                        <td className="py-2">{profile.phone}</td>
                      </tr>
                    )}
                    {profile.githubUrl && (
                      <tr className="border-b border-border/50">
                        <th className="py-2 pr-4 font-normal text-muted-foreground whitespace-nowrap">GitHub</th>
                        <td className="py-2">
                          <a href={profile.githubUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                            View profile ↗
                          </a>
                        </td>
                      </tr>
                    )}
                    {profile.linkedinUrl && (
                      <tr>
                        <th className="py-2 pr-4 font-normal text-muted-foreground whitespace-nowrap">LinkedIn</th>
                        <td className="py-2">
                          <a href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                            View profile ↗
                          </a>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </section>
            )}

            {/* Navigation */}
            <nav className="pt-2" data-testid="nav-menu">
              <table className="w-full border-collapse border border-border text-left font-sans text-sm">
                <tbody>
                  <tr className="border-b border-border">
                    <th className="py-2 px-3 border-r border-border font-medium w-2/5">
                      <Link href="/blog" className="no-underline hover:underline text-primary" data-testid="link-nav-blog">Blog</Link>
                    </th>
                    <td className="py-2 px-3 text-muted-foreground">Occasional essays and notes</td>
                  </tr>
                  <tr className="border-b border-border">
                    <th className="py-2 px-3 border-r border-border font-medium">
                      <a href="#projects" className="no-underline hover:underline text-primary" data-testid="link-nav-projects">Projects</a>
                    </th>
                    <td className="py-2 px-3 text-muted-foreground">Things I have made</td>
                  </tr>
                  <tr>
                    <th className="py-2 px-3 border-r border-border font-medium">
                      <a href="#about" className="no-underline hover:underline text-primary" data-testid="link-nav-about">About</a>
                    </th>
                    <td className="py-2 px-3 text-muted-foreground">Background and contact</td>
                  </tr>
                </tbody>
              </table>
            </nav>
          </aside>

          {/* Right Column */}
          <main className="lg:col-span-8 space-y-14">

            {/* Recent writing */}
            <section id="notes" className="space-y-6">
              <div className="flex justify-between items-end border-b border-border pb-2">
                <h2 className="text-2xl font-sans mb-0">Writing</h2>
                <Link href="/blog" className="text-sm text-muted-foreground hover:text-foreground no-underline hover:underline">
                  Archive →
                </Link>
              </div>
              {publishedArticles.length === 0 ? (
                <p className="text-muted-foreground text-sm">No articles yet.</p>
              ) : (
                <table className="w-full text-sm text-left border-collapse" data-testid="table-notes">
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
              )}
            </section>

            {/* Projects */}
            <section id="projects" className="space-y-6">
              <h2 className="text-2xl border-b border-border pb-2 font-sans">Selected Projects</h2>
              {projects.length === 0 ? (
                <p className="text-muted-foreground text-sm">No projects listed yet.</p>
              ) : (
                <table className="w-full text-sm text-left border-collapse" data-testid="table-projects">
                  <thead>
                    <tr className="border-b border-border text-muted-foreground">
                      <th className="py-2 pr-4 font-normal w-1/4">Name</th>
                      <th className="py-2 pr-4 font-normal">Description</th>
                      <th className="py-2 font-normal text-right w-20">Link</th>
                    </tr>
                  </thead>
                  <tbody>
                    {projects.map((project, i) => (
                      <tr key={i} className="border-b border-border/50 hover:bg-muted/20">
                        <td className="py-3 pr-4">
                          <span className="font-medium">{project.name}</span>
                          {project.tags.length > 0 && (
                            <span className="flex gap-1 mt-1 flex-wrap">
                              {project.tags.map(tag => (
                                <span key={tag} className="text-xs text-muted-foreground border border-border/50 px-1.5 py-0.5 rounded-sm">
                                  {tag}
                                </span>
                              ))}
                            </span>
                          )}
                        </td>
                        <td className="py-3 pr-4 text-muted-foreground">{project.description}</td>
                        <td className="py-3 text-right">
                          {project.url ? (
                            <a href={project.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline whitespace-nowrap">
                              View ↗
                            </a>
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </section>

          </main>
        </div>

        <footer className="pt-12 pb-8 border-t border-border mt-8 text-muted-foreground text-sm font-mono" data-testid="footer">
          <p>~ {new Date().getFullYear()} {profile.name}.</p>
        </footer>

      </div>
    </div>
  );
}
