import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Clock } from "lucide-react";
import Reveal from "@/components/Reveal";
import ShimmerCard from "@/components/ShimmerCard";
import { track } from "@/lib/analytics";
import GradientText from "@/components/GradientText";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const BlogPreview = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetch(`${API}/posts`)
      .then((r) => r.json())
      .then((data) => setPosts((data.posts || []).slice(0, 4)))
      .catch(() => setPosts([]));
  }, []);

  if (!posts.length) return null;

  return (
    <section className="mx-auto max-w-7xl px-6 py-24" data-testid="blog-preview-section">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <Reveal as="h2" testId="blog-heading" className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
            Straight answers from <GradientText>the blog</GradientText>
          </Reveal>
          <Reveal delay={0.1} className="mt-4 max-w-2xl text-zinc-400">
            Short, honest reads on digital marketing and social media — what
            works, what doesn't, and what we'd do with our own money.
          </Reveal>
        </div>
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 text-sm font-semibold text-fuchsia-400 transition-colors hover:text-cyan-300"
          data-testid="blog-view-all-link"
        >
          All articles <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2">
        {posts.map((post) => (
          <Link
            key={post.slug}
            to={`/blog/${post.slug}`}
            onClick={() => track("blog_open", { slug: post.slug, source: "home" })}
            data-testid={`blog-card-${post.slug}`}
            aria-label={`Read article: ${post.title}`}
          >
            <ShimmerCard className="group flex h-full flex-col">
              <div className="relative h-52 overflow-hidden">
                <img
                  src={post.image.url}
                  alt={post.image.alt}
                  title={post.title}
                  width={post.image.width}
                  height={post.image.height}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <span className="absolute left-4 top-4 rounded-full bg-black/70 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-cyan-300 backdrop-blur">
                  {post.category}
                </span>
              </div>
              <div className="flex flex-1 flex-col p-6">
                <h3 className="font-display text-lg font-bold leading-snug">{post.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-zinc-400">{post.excerpt}</p>
                <p className="mt-4 flex items-center gap-2 text-xs text-zinc-500">
                  <Clock className="h-3.5 w-3.5" aria-hidden="true" /> {post.read_time} min read · {post.date}
                </p>
              </div>
            </ShimmerCard>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default BlogPreview;
