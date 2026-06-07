import { Link } from "wouter";
import { useGetProfile, useListArticles, useListProjects, useListExperience, useListEducation } from "@workspace/api-client-react";
import * as fallbackData from "../data/content";

export default function Home() {
  const { data: apiProfile } = useGetProfile();
  const { data: apiArticles } = useListArticles();
  const { data: apiProjects } = useListProjects();
  const { data: apiExperience } = useListExperience();
  const { data: apiEducation } = useListEducation();

  const profile = apiProfile && Object.keys(apiProfile).length > 0 && apiProfile.name ? apiProfile : fallbackData.profile;
  const articles = apiArticles && apiArticles.length > 0 ? apiArticles : fallbackData.articles;
  const projects = apiProjects && apiProjects.length > 0 ? apiProjects : fallbackData.projects;
  const experience = apiExperience && apiExperience.length > 0 ? apiExperience : fallbackData.experience;
  const education = apiEducation && apiEducation.length > 0 ? apiEducation : fallbackData.education;

  const publishedArticles = articles.filter(a => a.published).slice(0, 8);

  const getInitials = (name: string) => {
    return name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase() || "YN";
  };

  return (
    <div className="min-h-[100dvh] bg-background text-foreground p-4 md:p-8 flex justify-center font-mono">
      <div className="max-w-6xl w-full flex flex-col space-y-12">
        <nav className="text-sm mb-4" data-testid="breadcrumb-nav">
          Navigation ~/ <Link href="/" className="text-foreground no-underline hover:underline">Home</Link>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
          {/* Left Column */}
          <aside className="lg:col-span-5 space-y-10">
            <header className="space-y-4">
              <h1 className="text-4xl md:text-5xl tracking-tight text-primary font-bold font-sans" data-testid="text-name">
                {profile.name || "Your Name"}
              </h1>
              <p className="text-xl font-sans font-medium text-foreground" data-testid="text-title">
                {profile.title || "Developer / Researcher / Thinker"}
              </p>
            </header>

            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border border-border bg-muted/50 flex items-center justify-center">
              {profile.avatarUrl ? (
                <img src={profile.avatarUrl} alt={profile.name ?? ""} className="w-full h-full object-cover" data-testid="img-avatar" />
              ) : (
                <span className="text-4xl font-sans text-muted-foreground" data-testid="img-avatar-placeholder">
                  {getInitials(profile.name ?? "")}
                </span>
              )}
            </div>

            <div className="prose prose-invert prose-p:text-foreground prose-p:leading-relaxed font-sans" data-testid="text-bio">
              <p>{profile.bio || fallbackData.profile.bio}</p>
            </div>
            
            <section id="about" className="space-y-6">
              <h2 className="text-2xl border-b border-border pb-2 inline-block font-sans">About</h2>
              
              <div className="flex flex-col md:flex-row gap-8">
                <table className="w-full text-sm text-left border-collapse" data-testid="table-personal-info">
                  <tbody>
                    <tr className="border-b border-border/50">
                      <th className="py-2 pr-4 font-normal text-muted-foreground whitespace-nowrap w-1/3">Name</th>
                      <td className="py-2">{profile.name}</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <th className="py-2 pr-4 font-normal text-muted-foreground whitespace-nowrap">Occupation</th>
                      <td className="py-2">{profile.title}</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <th className="py-2 pr-4 font-normal text-muted-foreground whitespace-nowrap">Location</th>
                      <td className="py-2">{profile.location}</td>
                    </tr>
                    <tr className="border-b border-border/50">
                      <th className="py-2 pr-4 font-normal text-muted-foreground whitespace-nowrap">Employer</th>
                      <td className="py-2">
                        {experience.length > 0 ? (
                           experience[0].companyUrl ? (
                             <a href={experience[0].companyUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{experience[0].company}</a>
                           ) : experience[0].company
                        ) : "N/A"}
                      </td>
                    </tr>
                    <tr>
                      <th className="py-2 pr-4 font-normal text-muted-foreground whitespace-nowrap">Education</th>
                      <td className="py-2">
                        {education.length > 0 ? `${education[0].degree}, ${education[0].institution}` : "N/A"}
                      </td>
                    </tr>
                  </tbody>
                </table>

                <table className="w-full text-sm text-left border-collapse" data-testid="table-contact">
                  <tbody>
                    {profile.email && (
                      <tr className="border-b border-border/50">
                        <th className="py-2 pr-4 font-normal text-muted-foreground whitespace-nowrap w-1/3">Email</th>
                        <td className="py-2"><a href={`mailto:${profile.email}`} className="text-primary hover:underline">Send Mail</a></td>
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
                        <td className="py-2"><a href={profile.githubUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">github.com</a></td>
                      </tr>
                    )}
                    {profile.linkedinUrl && (
                      <tr>
                        <th className="py-2 pr-4 font-normal text-muted-foreground whitespace-nowrap">LinkedIn</th>
                        <td className="py-2"><a href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">linkedin.com</a></td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>

            <nav className="pt-4" data-testid="nav-menu">
              <table className="w-full border-collapse border border-border text-left font-sans text-sm">
                <tbody>
                  <tr className="border-b border-border">
                    <th className="py-2 px-3 border-r border-border font-medium w-1/3">
                      <Link href="/blog" className="no-underline hover:underline text-primary" data-testid="link-nav-blog">Blog</Link>
                    </th>
                    <td className="py-2 px-3 text-muted-foreground">Occasional essays and notes</td>
                  </tr>
                  <tr className="border-b border-border">
                    <th className="py-2 px-3 border-r border-border font-medium">
                      <Link href="#projects" className="no-underline hover:underline text-primary" data-testid="link-nav-projects">Projects</Link>
                    </th>
                    <td className="py-2 px-3 text-muted-foreground">Things I have made and maintain</td>
                  </tr>
                  <tr className="border-b border-border">
                    <th className="py-2 px-3 border-r border-border font-medium">
                      <Link href="#about" className="no-underline hover:underline text-primary" data-testid="link-nav-about">About</Link>
                    </th>
                    <td className="py-2 px-3 text-muted-foreground">More about me</td>
                  </tr>
                  <tr>
                    <th className="py-2 px-3 border-r border-border font-medium">
                      <Link href="/admin" className="no-underline hover:underline text-primary" data-testid="link-nav-contact">Admin</Link>
                    </th>
                    <td className="py-2 px-3 text-muted-foreground">Content management portal</td>
                  </tr>
                </tbody>
              </table>
            </nav>
            
            <section id="projects" className="space-y-6 pt-4">
              <h2 className="text-2xl border-b border-border pb-2 inline-block font-sans">Selected Projects</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left border-collapse" data-testid="table-projects">
                  <thead>
                    <tr className="border-b border-border text-muted-foreground">
                      <th className="py-2 pr-4 font-normal">Name</th>
                      <th className="py-2 pr-4 font-normal">Description</th>
                      <th className="py-2 font-normal text-right">Link</th>
                    </tr>
                  </thead>
                  <tbody>
                    {projects.map((project, i) => (
                      <tr key={i} className="border-b border-border/50 hover:bg-muted/20">
                        <td className="py-3 pr-4 font-medium">{project.name}</td>
                        <td className="py-3 pr-4 text-muted-foreground">{project.description}</td>
                        <td className="py-3 text-right">
                          {project.url ? (
                            <a href={project.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">View ↗</a>
                          ) : "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </aside>

          {/* Right Column - Content */}
          <main className="lg:col-span-7 space-y-12">
            
            <section id="notes" className="space-y-6">
              <div className="flex justify-between items-end border-b border-border pb-2">
                <h2 className="text-2xl inline-block font-sans mb-0">Notes</h2>
                <Link href="/blog" className="text-sm text-muted-foreground hover:text-foreground no-underline hover:underline">/ Archive →</Link>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left border-collapse" data-testid="table-notes">
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

          </main>
        </div>
        
        <footer className="pt-16 pb-8 border-t border-border mt-16 text-muted-foreground text-sm font-mono flex justify-between items-center" data-testid="footer">
          <p>~ {new Date().getFullYear()} {profile.name}.</p>
        </footer>
      </div>
    </div>
  );
}
