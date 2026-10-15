import { gsap } from "gsap";
const i = (fn) => fn;
const I = { xs: 743 };
const U = (v, min, max) => Math.min(max, Math.max(min, v));
const buildOrbitController = i((e) => {
  const t = gsap,
    E = gsap.context(() => {}, e.value),
    q = gsap.matchMedia();
  let y = null,
    h = null,
    _ = null,
    d = null,
    a = null,
    m = null,
    z = null,
    Y = null,
    S = null,
    v = 0,
    T = null;
  const u = 120,
    R = { $page: { slug: "home" } },
    L = { time: 1 },
    V = { time: 1 };
  let M = i(() => {}, "hoverSpeedUp"),
    k = i(() => {}, "scrollSpeedUp");
  const C = i((r, s, g) => {
      const x = "linear",
        P = "blur(4px)",
        $ = "power1.in",
        O = "2.5vw",
        o = "-7.5vw";
      {
        s.set(r, { scale: 0.85 });
        s.set(r.querySelectorAll(".orbit-item-inner"), {
          y: O,
          filter: P,
          opacity: 0,
        });
        if (R.$page.slug !== "quiz") {
          q.add(`(min-width: ${I.xs + 1}px)`, () => {
            s.to(r, { scale: 2.05, duration: 12, ease: x }, 0);
          });
          q.add(`(max-width: ${I.xs}px)`, () => {
            s.to(r, { scale: 2.05 * 1.25, duration: 12, ease: x }, 0);
          });
        } else {
          q.add(`(min-width: ${I.xs + 1}px)`, () => {
            s.to(r, { scale: 2.05, duration: 12, ease: x }, 0);
          });
          q.add(`(max-width: ${I.xs}px)`, () => {
            s.to(r, { scale: 2.05 * 1.25, duration: 12, ease: x }, 0);
          });
        }
        s.to(
          r.querySelectorAll(".orbit-item-inner"),
          { y: o, duration: 12, ease: $ },
          0,
        );
        s.to(
          r.querySelectorAll(".orbit-item-inner"),
          {
            filter: "blur(0px)",
            opacity: 1,
            duration: 12 / 6,
            ease: $,
            clearProps: "filter, opacity",
          },
          0,
        );
        g.to(r, { rotate: "-360deg", duration: u, ease: "none" }, 0);
        g.to(
          r.querySelectorAll(".orbit-product-wrap"),
          { rotate: "360deg", duration: u, ease: "none" },
          0,
        );
      }
    }, "setRingMotion"),
    j = i(() => {
      {
        M();
        Y?.play();
      }
      const r = { deltaY: 0 },
        s = 0.5;
      {
        S?.kill();
        S = t.timeline({
          paused: !0,
          onUpdate: i(() => {
            k(r);
          }, "onUpdate"),
        });
        S.to(r, {
          deltaY: -70 / 2,
          duration: 0.75 * s,
          ease: "power1.inOut",
        });
        S.to(r, { deltaY: 100 / 2, duration: 1.25 * s, ease: "linear" });
        S.to(r, { deltaY: 0, duration: 5 * s, ease: "linear" });
        S.play();
      }
    }, "packExpand"),
    ae = i(() => {
      if (!e.value) return;
      const r = t.timeline({ paused: !0 });
      {
        r.to(e.value.querySelector(".bg-wrap"), {
          scale: 0.935,
          duration: 4,
          ease: "power1.out",
        });
        r.to(e.value.querySelector(".bg-wrap"), {
          scale: 1,
          duration: 6,
          ease: "power1.in",
        });
      }
      const s = { progress: 0 };
      t.to(s, {
        progress: 1,
        duration: 1.875,
        ease: "power1.inOut",
        onUpdate: i(() => {
          r.progress(s.progress);
        }, "onUpdate"),
      });
    }, "pulse"),
    W = i(() => {
      E.add(() => {
        {
          y = t.timeline({ paused: !0, repeat: -1 });
          h = t.timeline({ paused: !0, repeat: -1 });
          _ = t.timeline({ paused: !0, repeat: -1 });
          d = t.timeline({ paused: !0, repeat: -1 });
          a = t.timeline({ paused: !0, repeat: -1 });
          m = t.timeline({ paused: !0, repeat: -1 });
          z = t.timeline({ paused: !0 });
          Y = t.timeline({ paused: !0 });
        }
        const r = e.value.querySelector(".inner-inner-ring"),
          s = e.value.querySelector(".inner-ring"),
          g = e.value.querySelector(".outer-ring");
        {
          t.set(
            e.value.querySelectorAll(
              ".outer-ring, .inner-ring, .inner-inner-ring",
            ),
            { willChange: "scale" },
          );
          t.set(e.value.querySelectorAll(".orbit-item-inner"), {
            willChange: "filter, opacity, transform",
          });
          t.set(e.value.querySelectorAll(".orbit-product-wrap"), {
            willChange: "rotate",
          });
          C(r, d, y);
          C(s, a, h);
          C(g, m, _);
          z.fromTo(
            e.value.querySelectorAll(".bg-wrap"),
            { scale: 0.1 },
            { scale: 0.92, ease: "power2.out", duration: 3 },
            0,
          );
          z.from(
            e.value.querySelectorAll(".bg-wrap"),
            {
              opacity: 0,
              ease: "power3.inOut",
              duration: 3.5,
              clearProps: "opacity",
            },
            0,
          );
          Y.to(e.value.querySelector(".bg-wrap"), {
            scale: 1,
            ease: "power1.inOut",
            duration: 2.5 * 0.775,
          });
        }
      });
    }, "setup"),
    Z = i(() => {
      for (let c = 0; c < 75 / 2; c++)
        setTimeout(() => {
          k({ deltaY: 75 * (c / (75 / 2)) });
        }, 25 * c);
      for (let c = 0; c < 75 / 2; c++)
        setTimeout(
          () => {
            k({ deltaY: 75 * ((75 / 2 - c) / (75 / 2)) });
          },
          25 * c + 25 * (75 / 2),
        );
    }, "quickSpeedUp"),
    J = i(() => {
      E.add(() => {
        const r = e.value.querySelector(".inner-inner-ring"),
          s = e.value.querySelector(".inner-ring"),
          g = e.value.querySelector(".outer-ring"),
          c = r.querySelectorAll(".orbit-product"),
          f = s.querySelectorAll(".orbit-product"),
          ee = g.querySelectorAll(".orbit-product"),
          x = 10,
          P = [];
        c.forEach((o, p) => {
          const n = t.timeline({ paused: !0, repeat: -1 }),
            D = (p * 360) / 14,
            A = 1 - (Math.abs(D) % 180) / 180;
          {
            n.to(o, { rotate: x, duration: u / 8, ease: "none" });
            n.to(o, { rotate: 0, duration: u / 8, ease: "none" });
            n.to(o, { rotate: -x, duration: u / 8, ease: "none" });
            n.to(o, { rotate: 0, duration: u / 8, ease: "none" });
            n.progress(A);
            n.play();
            P.push(n);
          }
        });
        const $ = [];
        f.forEach((o, p) => {
          const n = t.timeline({ paused: !0, repeat: -1 }),
            A = 1 - ((((((p % 14) * 360) / 14 + 90) % 180) / 180 + 0.33) % 1);
          {
            n.to(o, { rotate: -x, duration: u / 8, ease: "none" });
            n.to(o, { rotate: 0, duration: u / 8, ease: "none" });
            n.to(o, { rotate: x, duration: u / 8, ease: "none" });
            n.to(o, { rotate: 0, duration: u / 8, ease: "none" });
            n.progress(A);
            n.play();
            $.push(n);
          }
        });
        const O = [];
        {
          ee.forEach((o, p) => {
            const n = t.timeline({ paused: !0, repeat: -1 }),
              D = (p * 360) / 14,
              A = 1 - (((Math.abs(D) % 180) / 180 + 0.66) % 1);
            {
              n.to(o, { rotate: x, duration: u / 8, ease: "none" });
              n.to(o, { rotate: 0, duration: u / 8, ease: "none" });
              n.to(o, { rotate: -x, duration: u / 8, ease: "none" });
              n.to(o, { rotate: 0, duration: u / 8, ease: "none" });
              n.progress(A);
              n.play();
              O.push(n);
            }
          });
          h.progress(0.33);
          _.progress(0.66);
          y.play();
          h.play();
          _.play();
          a.progress(0.33);
          m.progress(0.66);
          d.play();
          a.play();
          m.play();
          z.play();
          T = i(() => {
            const o = { time: L.time + V.time };
            {
              y.timeScale(1 + o.time * (1 - d.progress()) * (1 - d.progress()));
              h.timeScale(1 + o.time * (1 - a.progress()) * (1 - a.progress()));
              _.timeScale(1 + o.time * (1 - m.progress()) * (1 - m.progress()));
              P.forEach((p) => {
                p.timeScale(
                  1 + o.time * (1 - d.progress()) * (1 - d.progress()),
                );
              });
              $.forEach((p) => {
                p.timeScale(
                  1 + o.time * (1 - a.progress()) * (1 - a.progress()),
                );
              });
              O.forEach((p) => {
                p.timeScale(
                  1 + o.time * (1 - m.progress()) * (1 - m.progress()),
                );
              });
            }
          }, "updateSpeed");
          M = i(() => {
            t.to(L, {
              time: 24,
              duration: 0.5,
              ease: "power1.inOut",
              overwrite: !0,
              onUpdate: i(() => {
                T(L);
              }, "onUpdate"),
              onComplete: i(() => {
                t.to(L, {
                  time: 0,
                  duration: 1,
                  ease: "power1.out",
                  overwrite: !0,
                  delay: 0.66,
                  onUpdate: i(() => {
                    T(L);
                  }, "onUpdate"),
                });
              }, "onComplete"),
            });
          }, "hoverSpeedUp");
          k = i((o) => {
            if (!e.value) return;
            const p = parseFloat(e.value.dataset.scrollMultiplier) || 1;
            v += (o.deltaY / window.innerHeight) * 0.0075 * p;
          }, "scrollSpeedUp");
          t.ticker.add(K);
        }
      });
    }, "init"),
    K = i(() => {
      const g = d.progress() + U(v * t.ticker.deltaRatio(120), -0.0225, 0.0225),
        c = a.progress() + U(v * t.ticker.deltaRatio(120), -0.0225, 0.0225),
        f = m.progress() + U(v * t.ticker.deltaRatio(120), -0.0225, 0.0225);
      {
        if (g > 0) {
          d.progress(g % 1);
        } else {
          d.progress((1 - Math.abs(g)) % 1);
        }
        if (c > 0) {
          a.progress(c % 1);
        } else {
          a.progress((1 - Math.abs(c)) % 1);
        }
        if (f > 0) {
          m.progress(f % 1);
        } else {
          m.progress((1 - Math.abs(f)) % 1);
        }
        V.time = 1 + U(v * t.ticker.deltaRatio(120), -0.0225, 0.0225) * 1e3;
        T();
        if (v > 0) {
          v = Math.max(1e-4, v * 0.93);
        } else {
          v = Math.min(-1e-4, v * 0.93);
        }
      }
    }, "updater"),
    X = i(() => {
      {
        if (document.querySelector("#orbit-catalog-link")) {
          document
            .querySelector("#orbit-catalog-link")
            .addEventListener("mouseenter", M);
          document
            .querySelector("#orbit-catalog-link")
            .addEventListener("click", j);
        }
        document.querySelectorAll(".progress-btn").forEach((r) => {
          r.addEventListener("click", Z);
        });
        window.addEventListener("wheel", k);
      }
    }, "setEventListeners"),
    oe = i(() => {
      {
        t.ticker.remove(K);
        S?.kill();
        if (document.querySelector("#orbit-catalog-link")) {
          document
            .querySelector("#orbit-catalog-link")
            .removeEventListener("mouseenter", M);
          document
            .querySelector("#orbit-catalog-link")
            .removeEventListener("click", j);
        }
        document.querySelectorAll(".progress-btn").forEach((r) => {
          r.removeEventListener("click", Z);
        });
        window.removeEventListener("wheel", k);
      }
    }, "removeEventListeners");
  return {
    mount: () => {
      W();
      J();
      X();
    },
    destroy: () => {
      oe();
      q.revert();
      E.revert();
      t.killTweensOf(L);
      t.killTweensOf(V);
    },
    packExpand: j,
    pulse: ae,
  };
}, "useMotion");
export { buildOrbitController as createProductOrbitMotion };
