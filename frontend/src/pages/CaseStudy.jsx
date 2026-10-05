import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, ExternalLink, Quote, AlertCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import Reveal from "@/components/Reveal";
import NeonButton from "@/components/NeonButton";
import GradientText from "@/components/GradientText";
import { getProject, PROJECTS } from "@/data/portfolio";
import { track } from "@/lib/analytics";

const CaseStudy = () => {
  const { slug } = useParams();
  const project = getProject(slug);

  useEffect(() => {
    if (project) track("carousel_view", { project: project.id, source: "case-study" });
  }, [project]);

  if (!project) {
    return (
      <>
        <Navbar />
        <main className="mx-auto max-w-3xl px-6 pb-24 pt-40 text-center" data-testid="case-study-not-found">
          <h1 className="font-display text-2xl font-bold">Project not found</h1>
          <p className="mt-3 text-zinc-400">Browse the full showcase instead.</p>
          <div className="mt-8">
            <NeonButton href="/#work" testId="case-study-back-cta">See Our Work</NeonButton>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const cs = project.caseStudy;
  const others = PROJECTS.filter((p) => p.id !== project.id).slice(0, 2);

  return (
    <>
      <SEO
        title={`Case Study: ${project.name} — ${project.type}`}
        description={`${project.tagline}. ${project.description}`}
        path={`/work/${project.id}`}
        image={project.image.url}
        imageAlt={project.image.alt}
        type="article"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "CaseStudy",
          name: `${project.name} — ${project.type} case study`,
          description: project.description,
          image: project.image.url,
          author: { "@type": "Organization", name: "HoneyPot Studio" },
          about: { "@type": "WebSite", name: project.name },
        }}
      />
      <Navbar />
      <main className="mx-auto max-w-4xl px-6 pb-24 pt-32" data-testid="case-study-page">
        <Link
          to="/#work"
          className="inline-flex items-center gap-2 text-sm text-zinc-400 transition-colors hover:text-white"
          data-testid="case-study-back-link"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Back to our work
        </Link>

        <Reveal className="mt-8 flex flex-wrap items-center gap-3">
          <span className="rounded-full border border-fuchsia-500/40 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-fuchsia-300">
            {project.type}
          </span>
          {project.url && (
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-300 transition-colors hover:text-white"
              data-testid="case-study-live-link"
            >
              Visit live site <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
            </a>
          )}
        </Reveal>

        <Reveal as="h1" testId="case-study-title" className="mt-4 font-display text-4xl font-black tracking-tight sm:text-5xl">
          {project.name}
        </Reveal>
        <Reveal delay={0.05} className="mt-3 text-lg text-cyan-300">
          {project.tagline}
        </Reveal>

        <figure className="mt-10">
          <div className="overflow-hidden rounded-2xl border border-white/10 shadow-[0_0_60px_rgba(138,43,226,0.2)]">
            <img
              src={project.image.url}
              alt={project.image.alt}
              title={`${project.name} — ${project.type} case study by HoneyPot Studio`}
              width={project.image.width}
              height={project.image.height}
              loading="eager"
              decoding="async"
              className="max-h-[32rem] w-full object-cover object-top"
            />
          </div>
          <figcaption className="mt-2 text-xs text-zinc-600">{project.image.alt}</figcaption>
        </figure>

        <div className="mt-12 space-y-12">
          <Reveal testId="case-study-overview">
            <h2 className="font-display text-2xl font-bold">
              The <GradientText>project</GradientText>
            </h2>
            <p className="mt-4 leading-relaxed text-zinc-300">{cs.overview}</p>
          </Reveal>

          <Reveal testId="case-study-challenge">
            <h2 className="font-display text-2xl font-bold">
              The <GradientText>challenge</GradientText>
            </h2>
            <p className="mt-4 leading-relaxed text-zinc-300">{cs.challenge}</p>
          </Reveal>

          <Reveal testId="case-study-built">
            <h2 className="font-display text-2xl font-bold">
              What we <GradientText>built</GradientText>
            </h2>
            <ul className="mt-4 space-y-3">
              {cs.built.map((item) => (
                <li key={item} className="flex items-start gap-3 text-zinc-300">
                  <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-fuchsia-400" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
            <div className="mt-6 flex flex-wrap gap-2">
              {cs.stack.map((tech) => (
                <span key={tech} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-zinc-400">
                  {tech}
                </span>
              ))}
            </div>
          </Reveal>

          <Reveal testId="case-study-results">
            <h2 className="font-display text-2xl font-bold">
              The <GradientText>results</GradientText>
            </h2>
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
              {cs.results.map((r) => (
                <div key={r.label} className="hp-shimmer-card p-6 text-center">
                  <p className="font-display text-3xl font-black hp-gradient-text">{r.value}</p>
                  <p className="mt-2 text-xs uppercase tracking-wider text-zinc-400">{r.label}</p>
                </div>
              ))}
            </div>
            {cs.results.some((r) => r.placeholder) && (
              <p className="mt-4 flex items-start gap-2 rounded-lg border border-cyan-400/20 bg-cyan-400/5 p-4 text-xs text-zinc-500" data-testid="case-study-results-disclaimer">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-cyan-400" aria-hidden="true" />
                Results for this project are being compiled from live analytics
                and will be published here shortly — we don't inflate numbers.
              </p>
            )}
          </Reveal>

          <Reveal testId="case-study-quote">
            {cs.quote ? (
              <blockquote className="rounded-2xl border border-white/10 bg-white/[0.02] p-8">
                <Quote className="h-6 w-6 text-fuchsia-400" aria-hidden="true" />
                <p className="mt-4 text-lg italic leading-relaxed text-zinc-200">"{cs.quote.text}"</p>
                <footer className="mt-4 text-sm text-zinc-500">— {cs.quote.author}</footer>
              </blockquote>
            ) : (
              <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-8 text-center" data-testid="case-study-quote-placeholder">
                <Quote className="mx-auto h-6 w-6 text-zinc-600" aria-hidden="true" />
                <p className="mt-4 text-sm text-zinc-500">
                  Client testimonial coming soon — ask us about working with{" "}
                  {project.name} and we'll share what they told us directly.
                </p>
              </div>
            )}
          </Reveal>
        </div>

        <div className="mt-16 rounded-2xl border border-white/10 bg-white/[0.02] p-8 text-center">
          <h2 className="font-display text-xl font-bold">
            Want results like <GradientText>{project.name}?</GradientText>
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-zinc-400">
            Tell us what you're building — straight pricing, no lock-in, you
            own everything.
          </p>
          <div className="mt-6">
            <NeonButton href="/#contact" testId="case-study-cta" trackLabel={`case-study-${project.id}`}>
              Start a Project
            </NeonButton>
          </div>
        </div>

        {others.length > 0 && (
          <div className="mt-16" data-testid="case-study-more">
            <h2 className="font-display text-xl font-bold">More from the studio</h2>
            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
              {others.map((p) => (
                <Link key={p.id} to={`/work/${p.id}`} data-testid={`case-study-more-${p.id}`}>
                  <div className="hp-shimmer-card group overflow-hidden">
                    <img
                      src={p.image.url}
                      alt={p.image.alt}
                      width={p.image.width}
                      height={p.image.height}
                      loading="lazy"
                      decoding="async"
                      className="h-40 w-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="p-5">
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-fuchsia-300">{p.type}</p>
                      <h3 className="mt-1 font-display text-base font-bold">{p.name}</h3>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
};

export default CaseStudy;
