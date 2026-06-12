import { useState, useEffect } from "react";
import { Link } from "wouter";
import { useGetProfile, useListArticles, useListExperience, useListEducation } from "@workspace/api-client-react";
import { adminHeaders } from "../lib/api";
import { useToast } from "@/hooks/use-toast";

type LoginStep = "password" | "totp" | "setup-scan" | "setup-confirm";

interface TotpSetupData {
  qrDataUrl: string;
  secret: string;
}

function LoginBox({ onAuthenticated }: { onAuthenticated: (pw: string) => void }) {
  const [step, setStep] = useState<LoginStep>("password");
  const [password, setPassword] = useState("");
  const [totpCode, setTotpCode] = useState("");
  const [setupData, setSetupData] = useState<TotpSetupData | null>(null);
  const [loading, setLoading] = useState(false);
  const [ipBlocked, setIpBlocked] = useState(false);
  const { toast } = useToast();

  const post = async (path: string, body: object): Promise<{ status: number; data: any }> => {
    const res = await fetch(path, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (res.status === 403) return { status: 403, data: null };
    const data = await res.json();
    return { status: res.status, data };
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { status, data } = await post("/api/auth/verify", { password });
      if (status === 403) { setIpBlocked(true); return; }
      if (!data.ok && data.reason === "invalid_password") {
        toast({ title: "Incorrect password", variant: "destructive" });
        return;
      }
      if (!data.ok && data.reason === "totp_required") {
        setStep("totp");
        return;
      }
      if (data.ok && !data.totpEnabled) {
        const { status: s2, data: setup } = await post("/api/auth/setup-totp", { password });
        if (s2 === 403) { setIpBlocked(true); return; }
        if (s2 !== 200) { toast({ title: "Setup failed", variant: "destructive" }); return; }
        setSetupData({ qrDataUrl: setup.qrDataUrl, secret: setup.secret });
        setStep("setup-scan");
        return;
      }
      if (data.ok) {
        onAuthenticated(password);
        toast({ title: "Logged in" });
      }
    } catch {
      toast({ title: "Network error", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleTotpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { status, data } = await post("/api/auth/verify", { password, totpCode });
      if (status === 403) { setIpBlocked(true); return; }
      if (!data.ok && data.reason === "invalid_totp") {
        toast({ title: "Invalid code — check your authenticator app", variant: "destructive" });
        setTotpCode("");
        return;
      }
      if (data.ok) {
        onAuthenticated(password);
        toast({ title: "Logged in" });
      }
    } catch {
      toast({ title: "Network error", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleSetupConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { status, data } = await post("/api/auth/confirm-totp", { password, totpCode });
      if (status === 403) { setIpBlocked(true); return; }
      if (status !== 200 || !data.ok) {
        toast({ title: "Invalid code — try again", variant: "destructive" });
        setTotpCode("");
        return;
      }
      onAuthenticated(password);
      toast({ title: "2FA set up — you're logged in" });
    } catch {
      toast({ title: "Network error", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  if (ipBlocked) {
    return (
      <div className="min-h-[100dvh] bg-background text-foreground p-4 flex items-center justify-center font-mono">
        <div className="max-w-md w-full p-8 border border-destructive/50 bg-card shadow-xl space-y-4 text-center">
          <div className="text-4xl">⛔</div>
          <h1 className="text-xl font-sans font-bold text-destructive">Access Denied</h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Your IP address is not on the admin allowlist.<br />
            Connect via your configured VPN or update <code className="text-primary">ADMIN_ALLOWED_IPS</code> in your environment secrets.
          </p>
          <Link href="/" className="text-sm text-muted-foreground hover:text-foreground block pt-2">← Back to site</Link>
        </div>
      </div>
    );
  }

  if (step === "setup-scan" && setupData) {
    return (
      <div className="min-h-[100dvh] bg-background text-foreground p-4 flex items-center justify-center font-mono">
        <div className="max-w-md w-full p-8 border border-border bg-card shadow-xl space-y-6">
          <div>
            <h1 className="text-2xl font-sans font-bold text-primary">Set Up 2FA</h1>
            <p className="text-sm text-muted-foreground mt-1">Step 1 of 2 — scan with your authenticator app</p>
          </div>
          <div className="flex flex-col items-center gap-4">
            <img src={setupData.qrDataUrl} alt="TOTP QR Code" className="w-48 h-48 border border-border" />
            <div className="w-full">
              <p className="text-xs text-muted-foreground mb-1">Or enter this key manually:</p>
              <code className="block text-xs bg-muted px-3 py-2 break-all text-primary">{setupData.secret}</code>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">Use Google Authenticator, Authy, 1Password, or any TOTP app.</p>
          <button
            onClick={() => { setTotpCode(""); setStep("setup-confirm"); }}
            className="w-full bg-primary text-primary-foreground font-medium p-2 rounded hover:bg-primary/90 transition-colors"
          >
            I've scanned it →
          </button>
          <div className="text-center">
            <button onClick={() => setStep("password")} className="text-xs text-muted-foreground hover:text-foreground">← Back</button>
          </div>
        </div>
      </div>
    );
  }

  if (step === "setup-confirm") {
    return (
      <div className="min-h-[100dvh] bg-background text-foreground p-4 flex items-center justify-center font-mono">
        <div className="max-w-md w-full p-8 border border-border bg-card shadow-xl space-y-6">
          <div>
            <h1 className="text-2xl font-sans font-bold text-primary">Set Up 2FA</h1>
            <p className="text-sm text-muted-foreground mt-1">Step 2 of 2 — confirm with a code</p>
          </div>
          <form onSubmit={handleSetupConfirm} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground block">6-digit code from your app</label>
              <input
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                value={totpCode}
                onChange={(e) => setTotpCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                placeholder="000000"
                className="w-full bg-input border border-border p-2 text-foreground rounded focus:outline-none focus:ring-1 focus:ring-primary text-center tracking-widest text-lg"
                autoFocus
              />
            </div>
            <button type="submit" disabled={loading || totpCode.length !== 6} className="w-full bg-primary text-primary-foreground font-medium p-2 rounded hover:bg-primary/90 transition-colors disabled:opacity-50">
              {loading ? "Verifying…" : "Confirm & Log In"}
            </button>
          </form>
          <div className="text-center">
            <button onClick={() => setStep("setup-scan")} className="text-xs text-muted-foreground hover:text-foreground">← Back to QR code</button>
          </div>
        </div>
      </div>
    );
  }

  if (step === "totp") {
    return (
      <div className="min-h-[100dvh] bg-background text-foreground p-4 flex items-center justify-center font-mono">
        <div className="max-w-md w-full p-8 border border-border bg-card shadow-xl space-y-6">
          <div>
            <h1 className="text-2xl font-sans font-bold text-primary">Admin Portal</h1>
            <p className="text-sm text-muted-foreground mt-1">Enter your authenticator code</p>
          </div>
          <form onSubmit={handleTotpSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground block">6-digit code</label>
              <input
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                value={totpCode}
                onChange={(e) => setTotpCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                placeholder="000000"
                className="w-full bg-input border border-border p-2 text-foreground rounded focus:outline-none focus:ring-1 focus:ring-primary text-center tracking-widest text-lg"
                autoFocus
                data-testid="input-totp"
              />
            </div>
            <button type="submit" disabled={loading || totpCode.length !== 6} className="w-full bg-primary text-primary-foreground font-medium p-2 rounded hover:bg-primary/90 transition-colors disabled:opacity-50" data-testid="button-totp-submit">
              {loading ? "Verifying…" : "Log In"}
            </button>
          </form>
          <div className="text-center">
            <button onClick={() => { setStep("password"); setTotpCode(""); }} className="text-xs text-muted-foreground hover:text-foreground">← Back</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] bg-background text-foreground p-4 flex items-center justify-center font-mono">
      <div className="max-w-md w-full p-8 border border-border bg-card shadow-xl space-y-6">
        <h1 className="text-2xl font-sans font-bold text-primary">Admin Portal</h1>
        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground block">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              className="w-full bg-input border border-border p-2 text-foreground rounded focus:outline-none focus:ring-1 focus:ring-primary"
              data-testid="input-password"
            />
          </div>
          <button type="submit" disabled={loading} className="w-full bg-primary text-primary-foreground font-medium p-2 rounded hover:bg-primary/90 transition-colors disabled:opacity-50" data-testid="button-login">
            {loading ? "Checking…" : "Continue →"}
          </button>
        </form>
        <div className="pt-4 text-center">
          <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">← Back to site</Link>
        </div>
      </div>
    </div>
  );
}

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const { toast } = useToast();

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (token) setIsAuthenticated(true);
  }, []);

  const handleAuthenticated = (pw: string) => {
    localStorage.setItem("adminToken", pw);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    setIsAuthenticated(false);
    toast({ title: "Logged out" });
  };

  if (!isAuthenticated) {
    return <LoginBox onAuthenticated={handleAuthenticated} />;
  }

  return (
    <div className="min-h-[100dvh] bg-background text-foreground p-4 md:p-8 font-mono flex justify-center">
      <div className="max-w-5xl w-full flex flex-col space-y-8">
        <header className="flex justify-between items-center border-b border-border pb-6">
          <div>
            <nav className="text-sm mb-2 text-muted-foreground">
              Navigation ~/ <Link href="/" className="text-primary hover:underline">Home</Link> / Admin
            </nav>
            <h1 className="text-3xl font-sans font-bold text-primary">Admin Portal</h1>
          </div>
          <button onClick={handleLogout} className="text-sm border border-border px-3 py-1.5 rounded hover:bg-muted/50" data-testid="button-logout">
            Sign out
          </button>
        </header>

        <div className="flex gap-4 border-b border-border/50 pb-px overflow-x-auto">
          {["profile", "articles", "experience", "education"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 font-sans font-medium text-sm whitespace-nowrap border-b-2 transition-colors ${
                activeTab === tab ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
              data-testid={`tab-${tab}`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        <div className="pt-4 pb-12">
          {activeTab === "profile" && <ProfileEditor />}
          {activeTab === "articles" && <ArticlesManager />}
          {activeTab === "experience" && <ExperienceManager />}
          {activeTab === "education" && <EducationManager />}
        </div>
      </div>
    </div>
  );
}

function ProfileEditor() {
  const { data: profile } = useGetProfile();
  const { toast } = useToast();
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    if (profile) setFormData(profile);
  }, [profile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json", ...adminHeaders() },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        toast({ title: "Profile saved successfully" });
      } else {
        toast({ title: "Error saving profile", variant: "destructive" });
      }
    } catch (err) {
      toast({ title: "Network error", variant: "destructive" });
    }
  };

  const handleLinkedInImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const lines = text.split('\n');
      if (lines.length > 1) {
        const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
        const values = lines[1].split(',').map(v => v.trim().replace(/"/g, ''));
        
        const dataMap: Record<string, string> = {};
        headers.forEach((h, i) => { dataMap[h] = values[i]; });

        setFormData((prev: any) => ({
          ...prev,
          name: dataMap['First Name'] && dataMap['Last Name'] ? `${dataMap['First Name']} ${dataMap['Last Name']}` : prev.name,
          title: dataMap['Headline'] || prev.title,
          location: dataMap['Geo Location'] || prev.location,
        }));
        toast({ title: "LinkedIn data imported" });
      }
    };
    reader.readAsText(file);
  };

  const handleRawTextPaste = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    if (!text) return;
    
    // Very basic parsing for pasted text (first line name, second line title, third line location)
    const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
    if (lines.length >= 1) {
      setFormData((prev: any) => ({
        ...prev,
        name: lines[0] || prev.name,
        title: lines[1] || prev.title,
        location: lines[2] || prev.location,
      }));
      toast({ title: "Parsed basic profile info from text" });
    }
  };

  return (
    <div className="space-y-8">
      <form onSubmit={handleSave} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground block">Name</label>
            <input name="name" value={formData.name || ""} onChange={handleChange} className="w-full bg-input border border-border p-2 rounded focus:outline-none focus:ring-1 focus:ring-primary" />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground block">Title / Occupation</label>
            <input name="title" value={formData.title || ""} onChange={handleChange} className="w-full bg-input border border-border p-2 rounded focus:outline-none focus:ring-1 focus:ring-primary" />
          </div>
          <div className="space-y-2 md:col-span-2">
            <label className="text-sm text-muted-foreground block">Bio</label>
            <textarea name="bio" value={formData.bio || ""} onChange={handleChange} rows={4} className="w-full bg-input border border-border p-2 rounded focus:outline-none focus:ring-1 focus:ring-primary font-sans" />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground block">Location</label>
            <input name="location" value={formData.location || ""} onChange={handleChange} className="w-full bg-input border border-border p-2 rounded focus:outline-none focus:ring-1 focus:ring-primary" />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground block">Email</label>
            <input name="email" value={formData.email || ""} onChange={handleChange} className="w-full bg-input border border-border p-2 rounded focus:outline-none focus:ring-1 focus:ring-primary" />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground block">Phone</label>
            <input name="phone" value={formData.phone || ""} onChange={handleChange} className="w-full bg-input border border-border p-2 rounded focus:outline-none focus:ring-1 focus:ring-primary" />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground block">Avatar URL</label>
            <input name="avatarUrl" value={formData.avatarUrl || ""} onChange={handleChange} className="w-full bg-input border border-border p-2 rounded focus:outline-none focus:ring-1 focus:ring-primary" />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground block">GitHub URL</label>
            <input name="githubUrl" value={formData.githubUrl || ""} onChange={handleChange} className="w-full bg-input border border-border p-2 rounded focus:outline-none focus:ring-1 focus:ring-primary" />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground block">LinkedIn URL</label>
            <input name="linkedinUrl" value={formData.linkedinUrl || ""} onChange={handleChange} className="w-full bg-input border border-border p-2 rounded focus:outline-none focus:ring-1 focus:ring-primary" />
          </div>
        </div>
        <div className="pt-4 border-t border-border">
          <button type="submit" className="bg-primary text-primary-foreground font-medium px-6 py-2 rounded hover:bg-primary/90 transition-colors" data-testid="button-save-profile">
            Save Profile
          </button>
        </div>
      </form>

      <div className="border border-border/50 bg-card p-6 rounded space-y-4 mt-8">
        <h3 className="text-lg font-sans font-medium text-foreground">Import from LinkedIn</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Download your LinkedIn data export (Go to Settings → Data Privacy → Get a copy of your data → Request archive). When you receive the email, upload the <code>Profile.csv</code> file here.
        </p>
        <div className="pt-2">
          <input type="file" accept=".csv" onChange={handleLinkedInImport} className="block w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-medium file:bg-primary/10 file:text-primary hover:file:bg-primary/20 transition-colors cursor-pointer" data-testid="input-linkedin-csv" />
        </div>
        <div className="pt-4 border-t border-border/50">
          <p className="text-sm text-muted-foreground leading-relaxed mb-2">
            Or paste raw text from your LinkedIn profile page:
          </p>
          <textarea 
            placeholder="Paste raw text here..."
            onChange={handleRawTextPaste}
            className="w-full bg-input border border-border p-2 rounded focus:outline-none focus:ring-1 focus:ring-primary text-sm"
            rows={4}
          />
        </div>
      </div>
    </div>
  );
}

function ArticlesManager() {
  const { data: articles, refetch } = useListArticles();
  const { toast } = useToast();
  const [editingArticle, setEditingArticle] = useState<any>(null);

  const handleDelete = async (slug: string) => {
    if (!confirm("Are you sure you want to delete this article?")) return;
    try {
      const res = await fetch(`/api/articles/${slug}`, {
        method: "DELETE",
        headers: adminHeaders(),
      });
      if (res.ok) {
        toast({ title: "Article deleted" });
        refetch();
      }
    } catch (err) {
      toast({ title: "Error deleting article", variant: "destructive" });
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const isNew = !editingArticle.id;
    const url = isNew ? "/api/articles" : `/api/articles/${editingArticle.slug}`;
    const method = isNew ? "POST" : "PUT";
    
    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", ...adminHeaders() },
        body: JSON.stringify(editingArticle),
      });
      if (res.ok) {
        toast({ title: "Article saved" });
        setEditingArticle(null);
        refetch();
      } else {
        toast({ title: "Error saving article", variant: "destructive" });
      }
    } catch (err) {
      toast({ title: "Network error", variant: "destructive" });
    }
  };

  if (editingArticle) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center border-b border-border pb-4">
          <h2 className="text-xl font-sans text-primary">Edit Article</h2>
          <button onClick={() => setEditingArticle(null)} className="text-sm text-muted-foreground hover:text-foreground border border-border px-3 py-1 rounded">Cancel</button>
        </div>
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground block">Title</label>
              <input 
                value={editingArticle.title || ""} 
                onChange={(e) => setEditingArticle({...editingArticle, title: e.target.value, slug: editingArticle.slug || e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')})} 
                className="w-full bg-input border border-border p-2 rounded focus:outline-none focus:ring-1 focus:ring-primary" 
                required 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground block">Slug</label>
              <input value={editingArticle.slug || ""} onChange={(e) => setEditingArticle({...editingArticle, slug: e.target.value})} className="w-full bg-input border border-border p-2 rounded focus:outline-none focus:ring-1 focus:ring-primary" required />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm text-muted-foreground block">Subtitle</label>
              <input value={editingArticle.subtitle || ""} onChange={(e) => setEditingArticle({...editingArticle, subtitle: e.target.value})} className="w-full bg-input border border-border p-2 rounded focus:outline-none focus:ring-1 focus:ring-primary" />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground block">Published Date</label>
              <input type="date" value={editingArticle.publishedDate ? new Date(editingArticle.publishedDate).toISOString().split('T')[0] : ""} onChange={(e) => setEditingArticle({...editingArticle, publishedDate: e.target.value})} className="w-full bg-input border border-border p-2 rounded focus:outline-none focus:ring-1 focus:ring-primary" />
            </div>
            <div className="space-y-2 flex items-center pt-8">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={!!editingArticle.published} onChange={(e) => setEditingArticle({...editingArticle, published: e.target.checked})} className="w-5 h-5 rounded border-border bg-input text-primary accent-primary" />
                <span className="text-sm text-foreground">Published</span>
              </label>
            </div>
          </div>
          <div className="space-y-2 pt-4">
            <label className="text-sm text-muted-foreground block">Content (Markdown)</label>
            <textarea 
              value={editingArticle.content || ""} 
              onChange={(e) => setEditingArticle({...editingArticle, content: e.target.value})} 
              rows={16} 
              className="w-full bg-input border border-border p-4 rounded font-mono text-sm leading-relaxed focus:outline-none focus:ring-1 focus:ring-primary" 
            />
          </div>
          <div className="pt-4">
            <button type="submit" className="bg-primary text-primary-foreground font-medium px-6 py-2 rounded hover:bg-primary/90 transition-colors">
              Save Article
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center pb-2">
        <h2 className="text-lg font-sans text-foreground">All Articles</h2>
        <button onClick={() => setEditingArticle({ title: "", content: "", published: false })} className="bg-primary/10 text-primary border border-primary/20 px-3 py-1.5 rounded hover:bg-primary hover:text-primary-foreground text-sm transition-colors" data-testid="button-new-article">
          + New Article
        </button>
      </div>
      
      <div className="border border-border/50 rounded overflow-hidden">
        <table className="w-full text-sm text-left border-collapse">
          <thead>
            <tr className="bg-muted/30 border-b border-border/50 text-muted-foreground">
              <th className="py-3 px-4 font-normal">Title</th>
              <th className="py-3 px-4 font-normal w-32">Date</th>
              <th className="py-3 px-4 font-normal w-24">Status</th>
              <th className="py-3 px-4 font-normal text-right w-32">Actions</th>
            </tr>
          </thead>
          <tbody>
            {(!articles || articles.length === 0) && (
              <tr>
                <td colSpan={4} className="py-8 text-center text-muted-foreground italic">No articles found.</td>
              </tr>
            )}
            {articles && articles.map((article) => (
              <tr key={article.slug} className="border-b border-border/30 hover:bg-muted/10">
                <td className="py-3 px-4 font-sans font-medium">{article.title}</td>
                <td className="py-3 px-4 text-muted-foreground">{article.publishedDate ? new Date(article.publishedDate).toISOString().split('T')[0] : "-"}</td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-0.5 rounded text-xs ${article.published ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'}`}>
                    {article.published ? 'Published' : 'Draft'}
                  </span>
                </td>
                <td className="py-3 px-4 text-right space-x-3">
                  <button onClick={() => setEditingArticle(article)} className="text-secondary hover:underline">Edit</button>
                  <button onClick={() => handleDelete(article.slug)} className="text-destructive hover:underline">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ExperienceManager() {
  const { data: experiences, refetch } = useListExperience();
  const { toast } = useToast();
  const [editingExp, setEditingExp] = useState<any>(null);

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this experience?")) return;
    try {
      const res = await fetch(`/api/experience/${id}`, {
        method: "DELETE",
        headers: adminHeaders(),
      });
      if (res.ok) {
        toast({ title: "Experience deleted" });
        refetch();
      }
    } catch (err) {
      toast({ title: "Error deleting experience", variant: "destructive" });
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const isNew = !editingExp.id;
    const url = isNew ? "/api/experience" : `/api/experience/${editingExp.id}`;
    const method = isNew ? "POST" : "PUT";
    
    // Convert string empty values to null for API
    const data = { ...editingExp };
    if (data.endDate === "") data.endDate = null;
    
    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", ...adminHeaders() },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        toast({ title: "Experience saved" });
        setEditingExp(null);
        refetch();
      } else {
        toast({ title: "Error saving experience", variant: "destructive" });
      }
    } catch (err) {
      toast({ title: "Network error", variant: "destructive" });
    }
  };

  if (editingExp) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center border-b border-border pb-4">
          <h2 className="text-xl font-sans text-primary">{editingExp.id ? "Edit Experience" : "Add Experience"}</h2>
          <button onClick={() => setEditingExp(null)} className="text-sm text-muted-foreground hover:text-foreground border border-border px-3 py-1 rounded">Cancel</button>
        </div>
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground block">Company</label>
              <input value={editingExp.company || ""} onChange={(e) => setEditingExp({...editingExp, company: e.target.value})} className="w-full bg-input border border-border p-2 rounded focus:outline-none focus:ring-1 focus:ring-primary" required />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground block">Role</label>
              <input value={editingExp.role || ""} onChange={(e) => setEditingExp({...editingExp, role: e.target.value})} className="w-full bg-input border border-border p-2 rounded focus:outline-none focus:ring-1 focus:ring-primary" required />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm text-muted-foreground block">Company URL</label>
              <input value={editingExp.companyUrl || ""} onChange={(e) => setEditingExp({...editingExp, companyUrl: e.target.value})} className="w-full bg-input border border-border p-2 rounded focus:outline-none focus:ring-1 focus:ring-primary" />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground block">Start Date</label>
              <input type="month" value={editingExp.startDate || ""} onChange={(e) => setEditingExp({...editingExp, startDate: e.target.value})} className="w-full bg-input border border-border p-2 rounded focus:outline-none focus:ring-1 focus:ring-primary" required />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground block">End Date (leave empty if present)</label>
              <input type="month" value={editingExp.endDate || ""} onChange={(e) => setEditingExp({...editingExp, endDate: e.target.value})} className="w-full bg-input border border-border p-2 rounded focus:outline-none focus:ring-1 focus:ring-primary" />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm text-muted-foreground block">Description</label>
              <textarea value={editingExp.description || ""} onChange={(e) => setEditingExp({...editingExp, description: e.target.value})} rows={3} className="w-full bg-input border border-border p-2 rounded focus:outline-none focus:ring-1 focus:ring-primary" />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground block">Display Order</label>
              <input type="number" value={editingExp.displayOrder || 0} onChange={(e) => setEditingExp({...editingExp, displayOrder: parseInt(e.target.value)})} className="w-full bg-input border border-border p-2 rounded focus:outline-none focus:ring-1 focus:ring-primary" />
            </div>
          </div>
          <div className="pt-4">
            <button type="submit" className="bg-primary text-primary-foreground font-medium px-6 py-2 rounded hover:bg-primary/90 transition-colors">
              Save Experience
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center pb-2">
        <h2 className="text-lg font-sans text-foreground">Experience</h2>
        <button onClick={() => setEditingExp({ company: "", role: "", startDate: "", displayOrder: 0 })} className="bg-primary/10 text-primary border border-primary/20 px-3 py-1.5 rounded hover:bg-primary hover:text-primary-foreground text-sm transition-colors" data-testid="button-new-exp">
          + Add Experience
        </button>
      </div>
      
      <div className="border border-border/50 rounded overflow-hidden">
        <table className="w-full text-sm text-left border-collapse">
          <thead>
            <tr className="bg-muted/30 border-b border-border/50 text-muted-foreground">
              <th className="py-3 px-4 font-normal">Company</th>
              <th className="py-3 px-4 font-normal">Role</th>
              <th className="py-3 px-4 font-normal w-32">Dates</th>
              <th className="py-3 px-4 font-normal text-right w-32">Actions</th>
            </tr>
          </thead>
          <tbody>
            {(!experiences || experiences.length === 0) && (
              <tr>
                <td colSpan={4} className="py-8 text-center text-muted-foreground italic">No experience entries found.</td>
              </tr>
            )}
            {experiences && experiences.map((exp) => (
              <tr key={exp.id} className="border-b border-border/30 hover:bg-muted/10">
                <td className="py-3 px-4 font-sans font-medium">{exp.company}</td>
                <td className="py-3 px-4">{exp.role}</td>
                <td className="py-3 px-4 text-muted-foreground">{exp.startDate} - {exp.endDate || "Present"}</td>
                <td className="py-3 px-4 text-right space-x-3">
                  <button onClick={() => setEditingExp(exp)} className="text-secondary hover:underline">Edit</button>
                  <button onClick={() => handleDelete(exp.id)} className="text-destructive hover:underline">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function EducationManager() {
  const { data: educations, refetch } = useListEducation();
  const { toast } = useToast();
  const [editingEdu, setEditingEdu] = useState<any>(null);

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this education entry?")) return;
    try {
      const res = await fetch(`/api/education/${id}`, {
        method: "DELETE",
        headers: adminHeaders(),
      });
      if (res.ok) {
        toast({ title: "Education entry deleted" });
        refetch();
      }
    } catch (err) {
      toast({ title: "Error deleting education", variant: "destructive" });
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const isNew = !editingEdu.id;
    const url = isNew ? "/api/education" : `/api/education/${editingEdu.id}`;
    const method = isNew ? "POST" : "PUT";
    
    // Convert string empty values to null for API
    const data = { ...editingEdu };
    if (data.endDate === "") data.endDate = null;
    
    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", ...adminHeaders() },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        toast({ title: "Education saved" });
        setEditingEdu(null);
        refetch();
      } else {
        toast({ title: "Error saving education", variant: "destructive" });
      }
    } catch (err) {
      toast({ title: "Network error", variant: "destructive" });
    }
  };

  if (editingEdu) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center border-b border-border pb-4">
          <h2 className="text-xl font-sans text-primary">{editingEdu.id ? "Edit Education" : "Add Education"}</h2>
          <button onClick={() => setEditingEdu(null)} className="text-sm text-muted-foreground hover:text-foreground border border-border px-3 py-1 rounded">Cancel</button>
        </div>
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground block">Institution</label>
              <input value={editingEdu.institution || ""} onChange={(e) => setEditingEdu({...editingEdu, institution: e.target.value})} className="w-full bg-input border border-border p-2 rounded focus:outline-none focus:ring-1 focus:ring-primary" required />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground block">Degree / Field of Study</label>
              <input value={editingEdu.degree || ""} onChange={(e) => setEditingEdu({...editingEdu, degree: e.target.value})} className="w-full bg-input border border-border p-2 rounded focus:outline-none focus:ring-1 focus:ring-primary" required />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground block">Start Date</label>
              <input type="month" value={editingEdu.startDate || ""} onChange={(e) => setEditingEdu({...editingEdu, startDate: e.target.value})} className="w-full bg-input border border-border p-2 rounded focus:outline-none focus:ring-1 focus:ring-primary" required />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground block">End Date (leave empty if present)</label>
              <input type="month" value={editingEdu.endDate || ""} onChange={(e) => setEditingEdu({...editingEdu, endDate: e.target.value})} className="w-full bg-input border border-border p-2 rounded focus:outline-none focus:ring-1 focus:ring-primary" />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm text-muted-foreground block">Description (Optional)</label>
              <textarea value={editingEdu.description || ""} onChange={(e) => setEditingEdu({...editingEdu, description: e.target.value})} rows={3} className="w-full bg-input border border-border p-2 rounded focus:outline-none focus:ring-1 focus:ring-primary" />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground block">Display Order</label>
              <input type="number" value={editingEdu.displayOrder || 0} onChange={(e) => setEditingEdu({...editingEdu, displayOrder: parseInt(e.target.value)})} className="w-full bg-input border border-border p-2 rounded focus:outline-none focus:ring-1 focus:ring-primary" />
            </div>
          </div>
          <div className="pt-4">
            <button type="submit" className="bg-primary text-primary-foreground font-medium px-6 py-2 rounded hover:bg-primary/90 transition-colors">
              Save Education
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center pb-2">
        <h2 className="text-lg font-sans text-foreground">Education</h2>
        <button onClick={() => setEditingEdu({ institution: "", degree: "", startDate: "", displayOrder: 0 })} className="bg-primary/10 text-primary border border-primary/20 px-3 py-1.5 rounded hover:bg-primary hover:text-primary-foreground text-sm transition-colors" data-testid="button-new-edu">
          + Add Education
        </button>
      </div>
      
      <div className="border border-border/50 rounded overflow-hidden">
        <table className="w-full text-sm text-left border-collapse">
          <thead>
            <tr className="bg-muted/30 border-b border-border/50 text-muted-foreground">
              <th className="py-3 px-4 font-normal">Institution</th>
              <th className="py-3 px-4 font-normal">Degree</th>
              <th className="py-3 px-4 font-normal w-32">Dates</th>
              <th className="py-3 px-4 font-normal text-right w-32">Actions</th>
            </tr>
          </thead>
          <tbody>
            {(!educations || educations.length === 0) && (
              <tr>
                <td colSpan={4} className="py-8 text-center text-muted-foreground italic">No education entries found.</td>
              </tr>
            )}
            {educations && educations.map((edu) => (
              <tr key={edu.id} className="border-b border-border/30 hover:bg-muted/10">
                <td className="py-3 px-4 font-sans font-medium">{edu.institution}</td>
                <td className="py-3 px-4">{edu.degree}</td>
                <td className="py-3 px-4 text-muted-foreground">{edu.startDate} - {edu.endDate || "Present"}</td>
                <td className="py-3 px-4 text-right space-x-3">
                  <button onClick={() => setEditingEdu(edu)} className="text-secondary hover:underline">Edit</button>
                  <button onClick={() => handleDelete(edu.id)} className="text-destructive hover:underline">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
