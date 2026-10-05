import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, Clock, ShieldCheck } from "lucide-react";
import Footer from "@/components/Footer";
import LearnBlocks from "@/components/LearnBlocks";
import Navbar from "@/components/Navbar";
import SEO from "@/components/SEO";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function LearnArticle() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [state, setState] = useState("loading");

  useEffect(() => {
    setState("loading");
    fetch(`${API}/learn/${slug}`)
      .then((response) => {
        if (!response.ok) throw new Error("not found");
        return response.json();
      })
      .then((data) => { setPost(data); setState("ok"); })
      .catch(() => setState("error"));
  }, [slug]);

  const faqSchema = post?.faqs?.length ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: post.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  } : null;

  return (
    <>
      {post && (
        <SEO
          title={post.title}
          description={post.meta_description}
          path={`/learn/${post.slug}`}
          image={post.image.url}
          imageAlt={post.image.alt}
          type="article"
          jsonLd={faqSchema || {
            "@context": "https://schema.org",
            "@type": "Article",
            headline: post.title,
            description: post.meta_description,
            datePublished: post.date,
            author: { "@type": "Person", name: "Jai Butchers" },
          }}
        />
      )}
      <Navbar />
      <main className="mx-auto max-w-4xl px-6 pb-24 pt-32" data-testid="learn-article-page">
        <Link to="/learn" className="inline-flex items-center gap-2 text-sm text-zinc-400 transition-colors hover:text-white" data-testid="learn-back-link">
          <ArrowLeft className="h-4 w-4" /> All guides
        </Link>

        {state === "loading" && <p className="mt-16 text-zinc-500" data-testid="learn-article-loading">Loading guide…</p>}
        {state === "error" && <p className="mt-16 text-zinc-300" data-testid="learn-article-error">This guide could not be found.</p>}

        {state === "ok" && post && (
          <article className="mt-8" data-testid={`learn-article-${post.slug}`}>
            <p className="text-xs font-semibold uppercase text-cyan-300">{post.category}</p>
            <h1 className="mt-4 font-display text-4xl font-black leading-tight sm:text-5xl lg:text-6xl" data-testid="learn-article-heading">{post.heading}</h1>
            <div className="mt-5 flex flex-wrap items-center gap-4 text-sm text-zinc-500">
              <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" /> {post.read_time} min read</span>
              <time dateTime={post.date}>{post.date}</time>
              <span>By Jai Butchers</span>
            </div>
            <figure className="mt-9 overflow-hidden border border-white/10 bg-black">
              <div className="aspect-[16/9]">
                <img src={post.image.url} alt={post.image.alt} width={post.image.width} height={post.image.height} className="h-full w-full object-cover" />
              </div>
              <figcaption className="px-4 py-3 text-xs text-zinc-500">{post.image.alt}. Photo: {post.image.credit}.</figcaption>
            </figure>
            <div className="my-9 flex items-start gap-3 border-l-2 border-fuchsia-400 bg-fuchsia-400/[0.05] p-5 text-sm text-zinc-300" data-testid="learn-article-disclaimer">
              <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-fuchsia-300" />
              <p>Confirm privacy wording with your solicitor. This is education, not personalised legal or tax advice. No attack strings are published here.</p>
            </div>

            <LearnBlocks blocks={post.content} />

            {!!post.faqs?.length && (
              <section className="mt-14" data-testid="learn-faq-section">
                <h2 className="font-display text-xl font-bold">FAQ</h2>
                <div className="mt-5 divide-y divide-white/10 border-y border-white/10">
                  {post.faqs.map((faq) => (
                    <div key={faq.question} className="py-5">
                      <h3 className="font-semibold text-white">{faq.question}</h3>
                      <p className="mt-2 text-zinc-400">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            <nav className="mt-14 border-t border-white/10 pt-8" aria-label="Related guides" data-testid="learn-internal-links">
              <h2 className="font-display text-xl font-bold">Keep learning</h2>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {post.internal_links.map((link) => (
                  <Link key={link.path} to={link.path} className="flex items-center justify-between border border-white/10 bg-white/[0.02] p-4 text-sm text-zinc-300 transition-colors hover:border-cyan-300/40 hover:text-white" data-testid={`learn-related-${link.path.split("/").pop()}`}>
                    {link.label}<ArrowRight className="h-4 w-4 shrink-0 text-cyan-300" />
                  </Link>
                ))}
              </div>
            </nav>
          </article>
        )}
      </main>
      <Footer />
    </>
  );
}