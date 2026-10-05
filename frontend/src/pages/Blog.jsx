import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Clock, ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import Reveal from "@/components/Reveal";
import ShimmerCard from "@/components/ShimmerCard";
import { track } from "@/lib/analytics";
import GradientText from "@/components/GradientText";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    fetch(`${API}/posts`)
      .then((r) => r.json())
      .then((data) => setPosts(data.posts || []))
      .catch(() => setPosts([]))
      .finally(() => setLoading(false));
  }, []);

  const categories = ["All", ...new Set(posts.map((p) => p.category))];
  const visible = filter === "All" ? posts : posts.filter((p) => p.category === filter);

  return (
    <>
      <SEO
        title="Blog — Digital Marketing & Social Media, Explained Straight"
        description="Short, honest reads on digital marketing, SEO, Google Ads and social media management for Australian small businesses."
        path="/blog"
      />
      <Navbar />
      <main className="mx-auto max-w-7xl px-6 pb-24 pt-32">
        <Reveal as="h1" testId="blog-page-heading" className="font-display text-4xl font-black tracking-tighter sm:text-5xl">
          The <GradientText>Blog</GradientText>
        </Reveal>
        <Reveal delay={0.1} className="mt-4 max-w-2xl text-zinc-400">
          No fluff, no jargon — what actually works in digital marketing and
          social media for small businesses.
        </Reveal>

        <div className="mt-8 flex flex-wrap gap-3" data-testid="blog-category-filters">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              data-testid={`blog-filter-${cat.toLowerCase().replace(/[^a-z]+/g, "-")}`}
              className={`rounded-full border px-4 py-1.5 text-xs font-semibold uppercase tracking-wider transition-all ${
                filter === cat
                  ? "border-fuchsia-500 bg-fuchsia-500/15 text-fuchsia-300"
                  : "border-white/15 text-zinc-400 hover:border-white/40 hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <p className="mt-16 text-center text-zinc-500" data-testid="blog-loading">Loading articles…</p>
        ) : (
          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2" data-testid="blog-grid">
            {visible.map((post) => (
              <Link
                key={post.slug}
                to={`/blog/${post.slug}`}
                onClick={() => track("blog_open", { slug: post.slug, source: "blog" })}
                data-testid={`blog-list-card-${post.slug}`}
              >
                <ShimmerCard className="group flex h-full flex-col">
                  <div className="relative h-56 overflow-hidden">
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
                    <h2 className="font-display text-lg font-bold leading-snug">{post.title}</h2>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-zinc-400">{post.excerpt}</p>
                    <p className="mt-4 flex items-center justify-between text-xs text-zinc-500">
                      <span className="flex items-center gap-2">
                        <Clock className="h-3.5 w-3.5" aria-hidden="true" /> {post.read_time} min read · {post.date}
                      </span>
                      <ArrowRight className="h-4 w-4 text-fuchsia-400" aria-hidden="true" />
                    </p>
                  </div>
                </ShimmerCard>
              </Link>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
};

export default Blog;
