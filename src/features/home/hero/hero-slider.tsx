"use client";
import { IntrinsicImage } from "@/components/media/intrinsic-image";
import { ArrowLink } from "@/components/ui/arrow-link";
import { HeroHighlights } from "./hero-highlights";
import { heroSlides as slides } from "./hero-slides";
import { useHeroSlider } from "./use-hero-slider";
export function HeroSlider() {
  const { slide, setSlide, paused, setPaused, heroRef, setVideoDurations } =
    useHeroSlider();
  return (
    <section className="voi-hero" ref={heroRef} aria-label="Знакомство с ВОЙ">
      <div className="voi-hero-background" aria-hidden="true">
        {slides.map((s, i) => (
          <div
            key={s.href}
            className={`voi-slide ${i === slide ? "active" : ""}`}
          >
            {s.video ? (
              <video
                src={s.video}
                poster={s.image}
                autoPlay={!paused && i === slide}
                muted
                loop
                playsInline
                preload="metadata"
                onLoadedMetadata={(e) => {
                  const length = e.currentTarget.duration;
                  setVideoDurations((previous) => {
                    const next = [...previous];
                    next[i] =
                      Number.isFinite(length) && length > 0
                        ? Math.min(length, 15)
                        : 6;
                    return next;
                  });
                }}
                ref={(el) => {
                  if (el) {
                    if (paused || i !== slide) el.pause();
                    else void el.play().catch(() => {});
                  }
                }}
              />
            ) : (
              <IntrinsicImage src={s.image} alt="" />
            )}
          </div>
        ))}
      </div>
      <div className="voi-hero-top">
        <div className="voi-hero-content-stack">
          {slides.map((item, i) => (
            <div
              key={item.href}
              className={"voi-hero-content " + (i === slide ? "active" : "")}
              aria-hidden={i !== slide}
              inert={i !== slide}
            >
              {i === 0 ? (
                <h1>{item.title}</h1>
              ) : (
                <h2 className="voi-slide-title">{item.title}</h2>
              )}
              <ArrowLink href={item.href}>{item.link}</ArrowLink>
            </div>
          ))}
        </div>
        <HeroHighlights />
      </div>
      <div className="voi-thumbs">
        {slides.map((s, i) => (
          <button
            key={s.href}
            onClick={() => setSlide(i)}
            aria-label={`Слайд ${i + 1}: ${s.caption}`}
            aria-pressed={slide === i}
            className={slide === i ? "active" : ""}
          >
            <i className="voi-thumb-progress" aria-hidden="true" />
            <figure>
              <IntrinsicImage src={s.image} alt="" />
            </figure>
            <span>
              <small>0{i + 1}</small>
              {s.caption}
            </span>
          </button>
        ))}
        <div className="voi-thumb-line" />
        <button
          className="voi-pause"
          onClick={() => setPaused(!paused)}
          aria-label={paused ? "Продолжить слайдер" : "Приостановить слайдер"}
        >
          {paused ? "▷" : "Ⅱ"}
        </button>
      </div>
    </section>
  );
}
