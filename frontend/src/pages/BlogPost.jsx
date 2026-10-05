import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Clock } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import Reveal from "@/components/Reveal";
import NeonButton from "@/components/NeonButton";
import GradientText from "@/components/GradientText";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const BlogPost = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [state, setState] = useState("loading");

  useEffect(() => {
    setState("loading");
    fetch(`${API}/posts/${slug}`)
      .then((r) => {
        if (!r.ok) throw new Error("not found");
        return r.json();
      })
      .then((data) => {
        setPost(data);
        setState("ok");
      })
      .catch(() => setState("error"));
  }, [slug]);

  return (
    <>
      {post && (
        <SEO
          title={post.title}
          description={post.excerpt}
          path={`/blog/${post.slug}`}
          image={post.image.url}
          imageAlt={post.image.alt}
          type="article"
          jsonLd={{
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: post.title,
            description: post.excerpt,
            datePublished: post.date,
            author: { "@type": "Organization", name: "HoneyPot Studio" },
            image: post.image.url,
          }}
        />
      )}
      <Navbar />
      <main className="mx-auto max-w-3xl px-6 pb-24 pt-32">
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 text-sm text-zinc-400 transition-colors hover:text-white"
          data-testid="blog-post-back-link"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" /> All articles
        </Link>

        {state === "loading" && (
          <p className="mt-16 text-center text-zinc-500" data-testid="blog-post-loading">Loading article…</p>
        )}

        {state === "error" && (
          <div className="mt-16 text-center" data-testid="blog-post-error">
            <h1 className="font-display text-2xl font-bold">Article not found</h1>
            <p className="mt-3 text-zinc-400">It may have moved — browse all articles instead.</p>
          </div>
        )}

        {state === "ok" && post && (
          <article data-testid="blog-post-article">
            <Reveal as="h1" testId="blog-post-title" className="mt-8 font-display text-3xl font-black leading-tight tracking-tight sm:text-4xl">
              {post.title}
            </Reveal>
            <Reveal delay={0.05} className="mt-4 flex items-center gap-3 text-sm text-zinc-500">
              <span className="rounded-full border border-cyan-400/40 px-3 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-cyan-300">
                {post.category}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5" aria-hidden="true" /> {post.read_time} min read
              </span>
              <time dateTime={post.date}>{post.date}</time>
            </Reveal>

            <figure className="mt-8">
              <img
                src={post.image.url}
                alt={post.image.alt}
                title={post.title}
                width={post.image.width}
                height={post.image.height}
                loading="eager"
                decoding="async"
                className="w-full rounded-2xl border border-white/10"
              />
              <figcaption className="mt-2 text-xs text-zinc-600">{post.image.alt}</figcaption>
            </figure>

            <div className="mt-10 space-y-6" data-testid="blog-post-content">
              {post.content.map((block, i) =>
                block.type === "h2" ? (
                  <h2 key={i} className="pt-4 font-display text-xl font-bold text-white">
                    {block.text}
                  </h2>
                ) : (
                  <p key={i} className="leading-relaxed text-zinc-300">
                    {block.text}
                  </p>
                )
              )}
            </div>

            <div className="mt-14 rounded-2xl border border-white/10 bg-white/[0.02] p-8 text-center">
              <h2 className="font-display text-xl font-bold">
                Want this handled <GradientText>for you?</GradientText>
              </h2>
              <p className="mx-auto mt-3 max-w-md text-sm text-zinc-400">
                Digital marketing from $399/mo, social media management from
                $449/mo. One studio, straight reporting.
              </p>
              <div className="mt-6">
                <NeonButton href="/#contact" testId="blog-post-cta" trackLabel={`blog-cta-${post.slug}`}>
                  Start a Project
                </NeonButton>
              </div>
            </div>
          </article>
        )}
      </main>
      <Footer />
    </>
  );
};

export default BlogPost;
