import { useCallback } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination, Keyboard, A11y, EffectCoverflow } from "swiper/modules";
import { ExternalLink, ChevronLeft, ChevronRight } from "lucide-react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-coverflow";

import Reveal from "@/components/Reveal";
import { PROJECTS } from "@/data/portfolio";
import { track } from "@/lib/analytics";
import GradientText from "@/components/GradientText";

const Showcase = () => {
  const onSlideChange = useCallback((swiper) => {
    const project = PROJECTS[swiper.realIndex % PROJECTS.length];
    track("carousel_view", { project: project.id });
  }, []);

  return (
    <section id="work" className="relative scroll-mt-28 overflow-hidden border-y border-white/5 bg-[#070707] py-24" data-testid="showcase-section">
      <div className="pointer-events-none absolute left-1/2 top-0 h-72 w-[42rem] -translate-x-1/2 rounded-full bg-purple-600/15 blur-[120px]" aria-hidden="true" />

      <div className="mx-auto max-w-7xl px-6">
        <Reveal as="h2" testId="showcase-heading" className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
          Work we're <GradientText>proud to show</GradientText>
        </Reveal>
        <Reveal delay={0.1} className="mt-4 max-w-2xl text-zinc-400">
          Real builds from the studio — swipe, drag or use the arrows. Every
          site is responsive, SEO-ready and built on infrastructure the client
          owns.
        </Reveal>
      </div>

      <div className="relative mx-auto mt-14 max-w-7xl px-6">
        <Swiper
          modules={[Autoplay, Navigation, Pagination, Keyboard, A11y, EffectCoverflow]}
          effect="coverflow"
          grabCursor
          centeredSlides
          loop
          slidesPerView={1.15}
          breakpoints={{
            768: { slidesPerView: 1.6 },
            1100: { slidesPerView: 2.1 },
          }}
          coverflowEffect={{ rotate: 12, stretch: 0, depth: 220, modifier: 1, slideShadows: false }}
          autoplay={{ delay: 4500, pauseOnMouseEnter: true, disableOnInteraction: false }}
          pagination={{ clickable: true, el: ".hp-swiper-pagination" }}
          navigation={{ prevEl: ".hp-swiper-prev", nextEl: ".hp-swiper-next" }}
          keyboard={{ enabled: true }}
          a11y={{ enabled: true }}
          onSlideChange={onSlideChange}
          className="!pb-4"
          data-testid="showcase-carousel"
        >
          {PROJECTS.map((project) => (
            <SwiperSlide key={project.id} data-testid={`showcase-slide-${project.id}`}>
              {({ isActive }) => (
                <article
                  className={`hp-shimmer-card flex h-full flex-col transition-opacity duration-300 ${isActive ? "opacity-100" : "opacity-50"}`}
                >
                  {/* browser chrome frame */}
                  <div className="flex items-center gap-2 border-b border-white/10 bg-black/60 px-4 py-2.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-fuchsia-500/80" aria-hidden="true" />
                    <span className="h-2.5 w-2.5 rounded-full bg-purple-500/80" aria-hidden="true" />
                    <span className="h-2.5 w-2.5 rounded-full bg-cyan-400/80" aria-hidden="true" />
                    <span className="ml-3 truncate rounded bg-white/5 px-3 py-0.5 text-[11px] text-zinc-500">
                      {project.url ? project.url.replace("https://", "") : `${project.id}.com.au`}
                    </span>
                  </div>
                  <div className="relative max-h-72 overflow-hidden">
                    <img
                      src={project.image.url}
                      alt={project.image.alt}
                      title={`${project.name} — ${project.type} built by HoneyPot Studio`}
                      width={project.image.width}
                      height={project.image.height}
                      loading="lazy"
                      decoding="async"
                      className="h-72 w-full object-cover object-top transition-transform duration-700 hover:scale-[1.03]"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="font-display text-lg font-bold">{project.name}</h3>
                      <span className="rounded-full border border-fuchsia-500/40 px-3 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-fuchsia-300">
                        {project.type}
                      </span>
                    </div>
                    <p className="mt-1 text-sm font-medium text-cyan-300">{project.tagline}</p>
                    <p className="mt-3 flex-1 text-sm leading-relaxed text-zinc-400">{project.description}</p>
                    <div className="mt-4 flex flex-wrap items-center gap-2">
                      {project.tags.map((tag) => (
                        <span key={tag} className="rounded bg-white/5 px-2.5 py-1 text-[11px] text-zinc-400">
                          {tag}
                        </span>
                      ))}
                      {project.url && (
                        <a
                          href={project.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="ml-auto inline-flex items-center gap-1.5 text-xs font-semibold text-fuchsia-400 transition-colors hover:text-cyan-300"
                          data-testid={`showcase-visit-${project.id}`}
                        >
                          Live website preview <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                        </a>
                      )}
                    </div>
                  </div>
                </article>
              )}
            </SwiperSlide>
          ))}
        </Swiper>

        <div className="mt-8 flex items-center justify-center gap-6">
          <button
            className="hp-swiper-prev flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-zinc-300 transition-all hover:border-fuchsia-500 hover:text-fuchsia-400"
            aria-label="Previous project"
            data-testid="showcase-prev-button"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <div className="hp-swiper-pagination flex items-center gap-2" data-testid="showcase-pagination" />
          <button
            className="hp-swiper-next flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-zinc-300 transition-all hover:border-cyan-400 hover:text-cyan-300"
            aria-label="Next project"
            data-testid="showcase-next-button"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Showcase;
