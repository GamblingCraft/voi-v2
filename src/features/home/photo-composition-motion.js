import { gsap as j } from "gsap";
const o = (fn) => fn;
const Z = o((t, n, s) => Math.min(s, Math.max(n, t)), "clamp"),
  et = o((t, n) => t + Math.random() * (n - t), "randomRange"),
  // Keep VOI's smaller cutouts clustered around the central pack.
  // These radii also position rope anchors, so images and lines stay aligned.
  Ut = 0.62,
  _t = [0.78, 1.05],
  jt = [Math.PI / 4, (Math.PI * 3) / 4],
  Mt = 0.8,
  Zt = 6,
  Jt = 6,
  It = o((t) => {
    if (t <= 0) return { innerCount: 0, outerCount: 0 };
    if (t === 1) return { innerCount: 0, outerCount: 1 };
    const n = Math.min(t, Zt);
    return { innerCount: Math.min(Math.max(0, t - n), Jt), outerCount: n };
  }, "getPhotosGridRingCounts"),
  Kt = o(
    ({
      pointsInRing: t,
      totalSpan: n,
      ringRadius: s = 0,
      itemSizes: a = [],
      spreadToEdges: i = 0,
    }) => {
      if (!t || n <= 0) return [];
      if (!a.length || !s) {
        if (t === 1) return [n * 0.5];
        const x = Z(i, 0, 1),
          b = n / t,
          Y = n / (t - 1);
        return Array.from({ length: t }, (W, I) => {
          const M = (I + 0.5) * b,
            V = I * Y;
          return M + (V - M) * x;
        });
      }
      const e = n / (t * 2.4),
        r = a.map((x) => {
          const b = (Math.max(0, x) * 0.5) / s;
          return Z(b, 0, e);
        }),
        f = r.reduce((x, b) => x + b, 0),
        d = Math.max(0, (n - f * 2) / t),
        g = [];
      let E = r[0] + d * 0.5;
      for (let x = 0; x < t; x++) {
        g.push(E % n);
        const b = x + 1;
        if (!(b >= t)) {
          E += r[x] + d + r[b];
        }
      }
      return g;
    },
    "getRingLocalOffsets",
  ),
  Qt = o((t, n) => {
    let s = t;
    for (let a = 0; a < n.length; a++) {
      const i = n[a];
      if (s <= i.span || a === n.length - 1)
        return i.start + Math.min(s, i.span);
      s -= i.span;
    }
    return 0;
  }, "mapOffsetToSegments"),
  Rt = o(
    ({
      pointsInRing: t,
      ringSegments: n,
      ringRadius: s = 0,
      itemSizes: a = [],
      spreadToEdges: i = 0,
    }) => {
      if (!t || !n.length) return [];
      const e = n.reduce((f, d) => f + d.span, 0);
      return e <= 0
        ? []
        : Kt({
            pointsInRing: t,
            totalSpan: e,
            ringRadius: s,
            itemSizes: a,
            spreadToEdges: i,
          }).map((f) => {
            const d = (e - f) % e;
            return Qt(d, n);
          });
    },
    "getRingAngles",
  ),
  te = o(
    ({
      pointsInRing: t,
      topStart: n,
      topEnd: s,
      bottomStart: a,
      bottomEnd: i,
      tau: e,
    }) => {
      if (!t) return [];
      const r = Math.ceil(t / 2),
        f = Math.max(0, t - r),
        d = [
          { start: s, span: Math.max(0, e - s) },
          { start: 0, span: Math.max(0, a) },
        ].filter((b) => b.span > 0),
        g = [{ start: i, span: Math.max(0, n - i) }].filter((b) => b.span > 0),
        E = Rt({ pointsInRing: r, ringSegments: d, spreadToEdges: Mt }),
        x = Rt({ pointsInRing: f, ringSegments: g, spreadToEdges: Mt });
      return [...E, ...x];
    },
    "getOuterOnlyRingAngles",
  ),
  ee = o((t = 40) => {
    const n = Math.max(24, Math.floor(t));
    return {
      offsets: Array.from({ length: n + 1 }, () => 0),
      velocities: Array.from({ length: n + 1 }, () => 0),
    };
  }, "createRopeState"),
  ne = o((t, n, s = 40) => {
    const a = ee(s);
    return (
      (a.driveResponse = 0),
      (a.driveTarget = 0),
      (a.startX = t),
      (a.startY = n),
      (a.startVx = 0),
      (a.startVy = 0),
      (a.hoverMix = 0),
      (a.windPhase = et(0, Math.PI * 2)),
      (a.windSpeed = et(0.6, 0.95)),
      (a.windAmplitude = et(5, 13)),
      (a.baseWavePhase = et(0, Math.PI * 2)),
      (a.baseWaveCycles = et(1.8, 3.3)),
      (a.baseWaveAmplitude = et(10, 19)),
      (a.baseWaveDriftSpeed = et(0.16, 0.34)),
      a
    );
  }, "createWaveRope"),
  se = o((t, n, s = 0, a = 0) => {
    const { offsets: i, velocities: e } = t,
      r = i.length - 1,
      f = 640,
      d = 0.55,
      g = 0.72,
      E = 4.8,
      x = 6;
    i[0] += (s - i[0]) * a;
    for (let I = 1; I < r; I++) {
      const M = I / r,
        V = M > g ? (M - g) / (1 - g) : 0,
        L = d + E * V * V,
        z = f * (i[I - 1] + i[I + 1] - 2 * i[I]),
        u = -L * e[I];
      e[I] += (z + u) * n;
    }
    for (let I = 1; I < r; I++) i[I] += e[I] * n;
    const b = f * (i[r - 1] - i[r]),
      Y = -120 * i[r],
      W = -17.35 * e[r];
    return (
      (e[r] += (b + Y + W) * n),
      (i[r] += e[r] * n),
      Math.abs(i[r]) > x && ((i[r] = Math.sign(i[r]) * x), (e[r] *= 0.45)),
      (e[0] = 0),
      i
    );
  }, "stepRope"),
  oe = o((t, n = 0.94, s = 0.88) => {
    const { offsets: a, velocities: i } = t,
      e = a.length - 1;
    for (let r = 0; r <= e; r++) {
      a[r] *= n;
      i[r] *= s;
    }
    {
      a[e] *= 0.86;
      i[e] *= 0.78;
      i[0] = 0;
    }
  }, "settleRope"),
  pt = o((t, n, s, a, i, e = 0, r = 2, f = 0, d = !0) => {
    const g = s - t,
      E = a - n,
      x = Math.hypot(g, E),
      b = d ? 0 : 0.16;
    if (x === 0) return `M ${t} ${n}`;
    const Y = i || [],
      W = -E / x,
      I = g / x,
      M = (d && Y[0]) || 0,
      V = t + W * M,
      L = n + I * M,
      z = Math.max(2, (Y.length || 3) - 1),
      u = Math.PI * 2;
    let m = `M ${V} ${L}`;
    for (let R = 1; R <= z; R++) {
      const _ = R / z,
        P = t + g * _,
        A = n + E * _,
        c = Math.sin(Math.PI * _),
        G = Math.sin(_ * u * r + f),
        D = Math.sin(_ * u * (r * 0.52 + 0.35) + f * 1.41),
        X = c * e * (G + D * 0.28),
        h = (Y[R] || 0) + X,
        v = b ? Z(_ / b, 0, 1) : 1,
        T = v * v * (3 - 2 * v),
        l = h * T,
        w = P + W * l,
        p = A + I * l;
      m += ` L ${w} ${p}`;
    }
    return m;
  }, "makeWavePath"),
  ae = o((t, n, s = {}) => {
    if (!t || !n) return [];
    const a = Array.isArray(s.itemSizes) ? s.itemSizes : [],
      i = !!s.outerOnly,
      e = n.width / 2,
      r = n.height / 2,
      f = Math.min(e, r),
      d = Math.PI * 2,
      g = (Math.PI * 4) / 3,
      E = (Math.PI * 5) / 3,
      [x, b] = jt,
      Y = Math.PI / 45,
      W = g - Y,
      I = E + Y,
      M = x - Y,
      V = b + Y,
      L = [
        { start: 0, span: Math.max(0, W) },
        { start: I, span: Math.max(0, d - I) },
      ].filter((c) => c.span > 0),
      z = [
        { start: V, span: Math.max(0, W - V) },
        { start: I, span: Math.max(0, d - I) },
        { start: 0, span: Math.max(0, M) },
      ].filter((c) => c.span > 0),
      { innerCount: u, outerCount: m } = i
        ? { innerCount: 0, outerCount: t }
        : It(t),
      R = [];
    let _ = 0;
    const P = i ? _t[0] : _t[1],
      A = Ut;
    for (let c = 0; c < 2; c++) {
      const G = c === 0,
        D = G ? m : u;
      if (!D) continue;
      const X = G ? P : A,
        h = G ? z : L,
        v = f * X,
        T = G ? a.slice(_, _ + D) : [],
        l =
          G && i
            ? te({
                pointsInRing: D,
                topStart: W,
                topEnd: I,
                bottomStart: M,
                bottomEnd: V,
                tau: d,
              })
            : Rt({
                pointsInRing: D,
                ringSegments: h,
                ringRadius: v,
                itemSizes: T,
              });
      _ += D;
      for (let w = 0; w < D; w++) {
        const p = l[w] || 0,
          S = e + Math.cos(p) * f * X,
          C = r + Math.sin(p) * f * X;
        R.push({ x: Z(S, 0, n.width), y: Z(C, 0, n.height) });
      }
    }
    return R;
  }, "getPathStartPoints"),
  ie = 20,
  re = 0.7,
  ce = 3,
  le = 6,
  de = 0.64,
  ue = 0.44,
  he = o((t) => {
    const n = Math.sin((t + 1) * 12.9898) * 43758.5453;
    return ((n - Math.floor(n)) * 2 - 1) * ce;
  }, "getItemTilt"),
  fe = o((t, n) => {
    const { outerCount: s } = It(n),
      a = t >= s;
    return { isInner: a, scale: a ? re : 1 };
  }, "getRingItemMeta"),
  me = o((t, n) => {
    const s = Number(j.getProperty(t, "x")) || 0,
      a = Number(j.getProperty(t, "y")) || 0,
      i = he(n),
      e = o((r) => {
        t.style.scale = String(r);
      }, "applyScale");
    return (
      j.set(t, { force3D: !0, transformOrigin: "50% 50%", rotation: i }),
      e(1),
      {
        item: t,
        tx: s,
        ty: a,
        setX: j.quickSetter(t, "x", "px"),
        setY: j.quickSetter(t, "y", "px"),
        applyScale: e,
        baseTilt: i,
        baseCenterX: 0,
        baseCenterY: 0,
        halfW: 0,
        halfH: 0,
        anchorX: 0,
        anchorY: 0,
        scale: 1,
      }
    );
  }, "createPinnedItemState"),
  ge = o(
    ({
      photosList: t,
      setHoveredImageIndex: n,
      getHoveredImageIndex: s,
      markPinnedImageMetricsDirty: a,
      onResize: i,
    }) => {
      let e = [],
        r = null,
        f = null,
        d = [],
        g = [];
      const E = o(
          () =>
            Array.from(t.value.children).filter((u) =>
              u.classList.contains("item"),
            ),
          "getPinnedItems",
        ),
        x = o(() => {
          {
            e.forEach((u) => u());
            e = [];
          }
        }, "clearHoverListeners"),
        b = o((u) => {
          {
            x();
            u.forEach((m, R) => {
              const _ = o((A) => {
                  const c = g[R];
                  if (c) {
                    const G = m.getBoundingClientRect(),
                      D = G?.width && A.clientX < G.left + G.width / 2 ? -1 : 1,
                      X = c.baseTilt + D * le;
                    j.to(c.item, {
                      rotation: X,
                      duration: de,
                      ease: "power2.out",
                      overwrite: !0,
                    });
                  }
                  n(R);
                }, "onPointerEnter"),
                P = o(() => {
                  const A = g[R];
                  {
                    if (A) {
                      j.to(A.item, {
                        rotation: A.baseTilt,
                        duration: ue,
                        ease: "power3.out",
                        overwrite: !0,
                      });
                    }
                    if (s() === R) {
                      n(-1);
                    }
                  }
                }, "onPointerLeave");
              {
                m.addEventListener("pointerenter", _);
                m.addEventListener("pointerleave", P);
                e.push(() => {
                  {
                    m.removeEventListener("pointerenter", _);
                    m.removeEventListener("pointerleave", P);
                  }
                });
              }
            });
          }
        }, "bindHoverListeners"),
        Y = o(() => {
          for (let u = 0; u < g.length; u++) {
            const m = g[u];
            if (m) {
              j.killTweensOf(m.item);
              j.set(m.item, { rotation: m.baseTilt });
            }
          }
        }, "resetItemRotations"),
        W = o(() => {
          if (r) {
            r.disconnect();
          }
          const u = new WeakMap();
          {
            r = new ResizeObserver((m) => {
              let R = !1;
              for (const _ of m) {
                const P = _.contentRect,
                  A = u.get(_.target);
                if (
                  !A ||
                  Math.abs(P.width - A.width) > 0.5 ||
                  Math.abs(P.height - A.height) > 0.5
                ) {
                  u.set(_.target, { width: P.width, height: P.height });
                  if (A || P.width > 0 || P.height > 0) {
                    R = !0;
                  }
                }
              }
              if (!f) {
                f = requestAnimationFrame(() => {
                  {
                    f = null;
                    a();
                    if (R && i) {
                      i();
                    }
                  }
                });
              }
            });
            r.observe(t.value);
            d.forEach((m) => r.observe(m));
          }
        }, "setupMetricsObserver"),
        I = o((u) => {
          {
            d = u;
            g = u.map((m, R) => me(m, R));
            b(u);
            W();
            a();
          }
        }, "bind");
      return {
        sync: o((u) => {
          const m = E();
          return m.length !== u ||
            (d.length === m.length && d.every((_, P) => _ === m[P]))
            ? !1
            : (I(m), !0);
        }, "sync"),
        refreshMetrics: o((u = t.value.getBoundingClientRect()) => {
          if (!d.length || !g.length) return !1;
          const m = d.map((R) => R.getBoundingClientRect());
          for (let R = 0; R < d.length; R++) {
            const _ = g[R];
            if (!_) continue;
            const P = m[R],
              A = P.left - u.left + P.width / 2,
              c = P.top - u.top + P.height / 2;
            {
              _.baseCenterX = A - _.tx;
              _.baseCenterY = c - _.ty;
              _.halfW = P.width / 2;
              _.halfH = P.height / 2;
            }
          }
          return !0;
        }, "refreshMetrics"),
        pinToPoint: o((u, m, R, _, P, A) => {
          const c = g[u],
            { isInner: G, scale: D } = fe(u, g.length);
          if (!c || !A || !A.matrix || !A.listRect)
            return c
              ? ((c.anchorX = m),
                (c.anchorY = R),
                (c.scale = D),
                c.applyScale(D),
                c)
              : { anchorX: m, anchorY: R };
          const { matrix: X, inverseMatrix: h, listRect: v } = A,
            T = X.a * m + X.c * R + X.e,
            l = X.b * m + X.d * R + X.f,
            w = X.a * _ + X.c * P + X.e,
            p = X.b * _ + X.d * P + X.f,
            S = T - v.left,
            C = l - v.top,
            y = c.baseCenterX + c.tx,
            O = c.baseCenterY + c.ty,
            B = w - v.left,
            N = p - v.top,
            H = S,
            $ = C;
          let J = H,
            K = $;
          if (G) {
            c.tx += H - y;
            c.ty += $ - O;
          } else {
            const st = c.halfW * D,
              rt = c.halfH * D,
              ct = ie,
              Q = B - y,
              tt = N - O;
            let lt = y,
              ot = O;
            if (st > 0 && rt > 0 && (Q || tt)) {
              const dt = 1 / Math.max(Math.abs(Q) / st, Math.abs(tt) / rt),
                at = Math.hypot(Q, tt) || 1,
                Ct = Q / at,
                Dt = tt / at;
              {
                lt = y + Q * dt - Ct * ct;
                ot = O + tt * dt - Dt * ct;
              }
            }
            {
              c.tx += H - lt;
              c.ty += $ - ot;
            }
          }
          if (
            (c.setX(c.tx),
            c.setY(c.ty),
            (c.scale = D),
            c.applyScale(D),
            G && ((J = c.baseCenterX + c.tx), (K = c.baseCenterY + c.ty)),
            !h)
          )
            return ((c.anchorX = m), (c.anchorY = R), c);
          const U = v.left + J,
            k = v.top + K;
          return (
            (c.anchorX = h.a * U + h.c * k + h.e),
            (c.anchorY = h.b * U + h.d * k + h.f),
            c
          );
        }, "pinToPoint"),
        resetItemRotations: Y,
        clear: o(() => {
          {
            Y();
            x();
            if (f) {
              cancelAnimationFrame(f);
              f = null;
            }
            if (r) {
              r.disconnect();
            }
            r = null;
            d = [];
            g = [];
          }
        }, "clear"),
      };
    },
    "createPhotosGridPinning",
  ),
  ve = o(
    () => ({ x: 0, y: 0, dx: 0, dy: 0, active: !1 }),
    "createPointerState",
  ),
  pe = o(({ el: t, setHoveredImageIndex: n }) => {
    const s = ve(),
      a = o((d) => {
        {
          if (s.active) {
            s.dx += d.clientX - s.x;
            s.dy += d.clientY - s.y;
          }
          s.x = d.clientX;
          s.y = d.clientY;
          s.active = !0;
        }
      }, "onMouseMove"),
      i = o(() => {
        {
          s.active = !1;
          s.dx = 0;
          s.dy = 0;
          n(-1);
        }
      }, "onMouseLeave");
    return {
      mount: o(() => {
        {
          t.value.addEventListener("mousemove", a);
          t.value.addEventListener("mouseleave", i);
        }
      }, "mount"),
      destroy: o(() => {
        {
          t.value.removeEventListener("mousemove", a);
          t.value.removeEventListener("mouseleave", i);
          s.dx = 0;
          s.dy = 0;
          s.active = !1;
          n(-1);
        }
      }, "destroy"),
      getFrameInput: o(() => {
        const d = s.dx,
          g = s.dy,
          E = s.active;
        return (
          (s.dx = 0),
          (s.dy = 0),
          { pointerDx: d, pointerDy: g, pointerActive: E }
        );
      }, "getFrameInput"),
    };
  }, "createPhotosGridInteraction"),
  Re = "http://www.w3.org/2000/svg",
  Ie = 3.8,
  ht = 18,
  ft = 42,
  ye = 0.12,
  bt = 16,
  Pt = 6.5,
  St = 0.986,
  xe = 0.08,
  _e = 0.12,
  Me = 0.16,
  be = 220,
  Pe = 160,
  Se = o(
    () => ({
      hoveredImageIndex: -1,
      pathRafId: null,
      lastPathTime: 0,
      dynamicWavePaths: [],
      intersectionObserver: null,
      isInView: !1,
      shouldRefreshPinnedImageMetrics: !0,
      metricsRefreshTimeoutId: null,
      resizeRebuildTimeoutId: null,
      resizeRafId: null,
      cachedGeometry: {
        listRect: null,
        matrix: null,
        inverseMatrix: null,
        svgRect: null,
      },
    }),
    "createState",
  ),
  Ee = o((t) => {
    if (!t) return null;
    try {
      return t.inverse();
    } catch {
      return null;
    }
  }, "getInverseMatrix"),
  Te = o(
    ({
      rope: t,
      frame: n,
      isHovered: s,
      currentStartVx: a,
      currentStartVy: i,
    }) => {
      if (s && n.svgRect?.width && n.svgRect?.height) {
        const e = n.viewBox.width / n.svgRect.width,
          r = n.viewBox.height / n.svgRect.height,
          f = Ie * t.hoverMix,
          d = Z(n.pointerDx, -ht, ht),
          g = Z(n.pointerDy, -ht, ht);
        {
          t.startVx = a + d * e * f;
          t.startVy = i + g * r * f;
        }
      }
      {
        t.startVx = Z(t.startVx || a, -ft, ft);
        t.startVy = Z(t.startVy || i, -ft, ft);
      }
    },
    "applyInteractionImpulses",
  ),
  Ae = o(
    ({
      rope: t,
      x: n,
      y: s,
      currentStartX: a,
      currentStartY: i,
      frameDt: e,
      isHovered: r,
    }) => {
      const f = bt * (n - a) - Pt * t.startVx,
        d = bt * (s - i) - Pt * t.startVy;
      {
        t.startVx = (t.startVx + f * e) * St;
        t.startVy = (t.startVy + d * e) * St;
        t.startX = a + t.startVx * e;
        t.startY = i + t.startVy * e;
        if (
          !r &&
          Math.abs(t.startX - n) < 0.01 &&
          Math.abs(t.startY - s) < 0.01 &&
          Math.abs(t.startVx) < 0.005 &&
          Math.abs(t.startVy) < 0.005
        ) {
          t.startX = n;
          t.startY = s;
          t.startVx = 0;
          t.startVy = 0;
        }
      }
    },
    "applyAnchorSpring",
  ),
  Et = o((t, n, s, a) => {
    const i = s - t,
      e = a - n,
      r = Math.hypot(i, e) || 1;
    return { normalX: -e / r, normalY: i / r };
  }, "getRopeNormal"),
  we = o(
    ({
      rope: t,
      x: n,
      y: s,
      normalX: a,
      normalY: i,
      ambientWindDrive: e,
      windInfluence: r,
    }) => {
      const f = t.startX - n,
        d = t.startY - s,
        g = f * a + d * i + e * r,
        E = 0.08 + 0.24 * t.hoverMix,
        x = t.driveTarget || 0,
        b = t.driveResponse || 0;
      {
        t.driveTarget = x + (g - x) * (xe + _e * t.hoverMix);
        t.driveResponse = b + (E - b) * Me;
      }
    },
    "updateRopeDrive",
  ),
  Oe = o(
    (t, n, s, a) =>
      n
        ? !1
        : t.driveResponse < 0.004 &&
          Math.abs(t.driveTarget || 0) < 0.08 &&
          Math.abs((t.startX || s) - s) < 0.08 &&
          Math.abs((t.startY || a) - a) < 0.08,
    "shouldSettleRope",
  ),
  buildPhotoComposition = o(
    ({ el: t, svgEl: n, photosList: s, getList: a, isOuterOnly: i }) => {
      const e = Se(),
        r = o(() => a().length, "getExpectedItemCount"),
        f = o(() => {
          e.shouldRefreshPinnedImageMetrics = !0;
        }, "markPinnedImageMetricsDirty"),
        d = o(() => {
          const h = s.value?.getBoundingClientRect() || null,
            v = n.value?.getScreenCTM() || null,
            T = Ee(v),
            l = n.value?.getBoundingClientRect() || null;
          e.cachedGeometry = {
            listRect: h,
            matrix: v,
            inverseMatrix: T,
            svgRect: l,
          };
        }, "refreshCachedGeometry"),
        g = o(() => {
          d();
          const { listRect: h } = e.cachedGeometry;
          if (h && M.refreshMetrics(h)) {
            e.shouldRefreshPinnedImageMetrics = !1;
          }
        }, "refreshPinnedImageMetrics"),
        E = o(() => {
          if (e.metricsRefreshTimeoutId) {
            clearTimeout(e.metricsRefreshTimeoutId);
            e.metricsRefreshTimeoutId = null;
          }
        }, "cancelPinnedMetricsRefresh"),
        x = o(() => {
          {
            if (e.resizeRafId) {
              cancelAnimationFrame(e.resizeRafId);
              e.resizeRafId = null;
            }
            if (e.resizeRebuildTimeoutId) {
              clearTimeout(e.resizeRebuildTimeoutId);
              e.resizeRebuildTimeoutId = null;
            }
          }
        }, "cancelResizeRebuild"),
        b = o(
          () => !!(e.resizeRafId || e.resizeRebuildTimeoutId),
          "isResizeRebuildPending",
        ),
        Y = o(() => {
          {
            e.resizeRebuildTimeoutId = null;
            c();
            if (e.isInView) {
              m();
            }
          }
        }, "flushResizeRebuild"),
        W = o(() => {
          {
            R();
            f();
            if (!e.resizeRafId) {
              e.resizeRafId = requestAnimationFrame(() => {
                {
                  e.resizeRafId = null;
                  if (e.resizeRebuildTimeoutId) {
                    clearTimeout(e.resizeRebuildTimeoutId);
                  }
                  e.resizeRebuildTimeoutId = setTimeout(() => {
                    Y();
                  }, Pe);
                }
              });
            }
          }
        }, "scheduleResizeRebuild"),
        I = o(() => {
          {
            E();
            e.metricsRefreshTimeoutId = setTimeout(() => {
              {
                g();
                L();
                e.metricsRefreshTimeoutId = null;
              }
            }, be);
          }
        }, "schedulePinnedMetricsRefresh"),
        M = ge({
          photosList: s,
          setHoveredImageIndex: o((h) => {
            e.hoveredImageIndex = h;
          }, "setHoveredImageIndex"),
          getHoveredImageIndex: o(
            () => e.hoveredImageIndex,
            "getHoveredImageIndex",
          ),
          markPinnedImageMetricsDirty: f,
          onResize: o(() => {
            W();
          }, "onResize"),
        }),
        V = pe({
          el: t,
          setHoveredImageIndex: o((h) => {
            e.hoveredImageIndex = h;
          }, "setHoveredImageIndex"),
        }),
        L = o(() => {
          const h = n.value?.viewBox?.baseVal;
          if (!h || !e.dynamicWavePaths.length) return;
          d();
          const { matrix: v, inverseMatrix: T, listRect: l } = e.cachedGeometry;
          if (
            !v ||
            !l ||
            (M.sync(e.dynamicWavePaths.length), !M.refreshMetrics(l))
          )
            return;
          e.shouldRefreshPinnedImageMetrics = !1;
          const w = h.width / 2,
            p = h.height / 2,
            S = { matrix: v, inverseMatrix: T, listRect: l };
          for (let C = 0; C < e.dynamicWavePaths.length; C++) {
            const y = e.dynamicWavePaths[C],
              O = y.rope.startX ?? y.x,
              B = y.rope.startY ?? y.y,
              { normalX: N, normalY: H } = Et(O, B, w, p),
              $ = y.rope.offsets[0] || 0,
              J = O + N * $,
              K = B + H * $,
              U = M.pinToPoint(y.itemIndex, J, K, w, p, S);
            if (!y.path) continue;
            const k = pt(
              U.anchorX,
              U.anchorY,
              w,
              p,
              y.rope.offsets,
              y.rope.baseWaveAmplitude,
              y.rope.baseWaveCycles,
              y.rope.baseWavePhase,
              !1,
            );
            y.path.setAttribute("d", k);
          }
        }, "primeLayout"),
        z = o(({ path: h, x: v, y: T, rope: l, itemIndex: w }, p) => {
          const S = p.pointerActive && e.hoveredImageIndex === w,
            C = l.startX ?? v,
            y = l.startY ?? T,
            O = l.startVx || 0,
            B = l.startVy || 0,
            N = l.hoverMix || 0,
            H = S ? 1 : 0;
          l.hoverMix = N + (H - N) * ye;
          const $ = Math.sin(p.timeSeconds * l.windSpeed + l.windPhase),
            J = Math.sin(
              p.timeSeconds * l.windSpeed * 0.41 + l.windPhase * 1.7,
            ),
            K = ($ + J * 0.55) * l.windAmplitude,
            U = 1 - l.hoverMix;
          {
            Te({
              rope: l,
              frame: p,
              isHovered: S,
              currentStartVx: O,
              currentStartVy: B,
            });
            Ae({
              rope: l,
              x: v,
              y: T,
              currentStartX: C,
              currentStartY: y,
              frameDt: p.frameDt,
              isHovered: S,
            });
          }
          const { normalX: k, normalY: st } = Et(
            l.startX,
            l.startY,
            p.centerX,
            p.centerY,
          );
          we({
            rope: l,
            x: v,
            y: T,
            normalX: k,
            normalY: st,
            ambientWindDrive: K,
            windInfluence: U,
          });
          for (let at = 1; at <= p.subSteps; at++)
            se(l, p.dt, l.driveTarget, l.driveResponse);
          if (Oe(l, S, v, T)) {
            oe(l);
          }
          const rt = l.baseWavePhase + p.timeSeconds * l.baseWaveDriftSpeed,
            ct = l.baseWaveAmplitude * (1 + l.hoverMix * 0.08),
            Q = l.offsets[0] || 0,
            tt = l.startX + k * Q,
            lt = l.startY + st * Q,
            ot = M.pinToPoint(w, tt, lt, p.centerX, p.centerY, p.geometry),
            dt = pt(
              ot.anchorX,
              ot.anchorY,
              p.centerX,
              p.centerY,
              l.offsets,
              ct,
              l.baseWaveCycles,
              rt,
              !1,
            );
          if (h) {
            h.setAttribute("d", dt);
          }
        }, "updateWavePathItem"),
        u = o((h) => {
          const v = n.value?.viewBox?.baseVal,
            T = e.lastPathTime
              ? Math.min(1 / 15, Math.max(1 / 240, (h - e.lastPathTime) / 1e3))
              : 1 / 60,
            l = Math.max(1, Math.ceil(T / (1 / 120))),
            w = T / l,
            p = h * 0.001;
          if (r() !== e.dynamicWavePaths.length) {
            {
              c();
              if (e.isInView) {
                e.pathRafId = requestAnimationFrame(u);
              } else {
                e.pathRafId = null;
              }
            }
            return;
          }
          {
            if (M.sync(e.dynamicWavePaths.length)) {
              I();
            }
            if (e.shouldRefreshPinnedImageMetrics && !b()) {
              g();
            }
            if (!e.cachedGeometry.listRect || !e.cachedGeometry.matrix) {
              d();
            }
          }
          const {
              svgRect: C,
              matrix: y,
              listRect: O,
              inverseMatrix: B,
            } = e.cachedGeometry,
            {
              pointerDx: N,
              pointerDy: H,
              pointerActive: $,
            } = V.getFrameInput();
          if (((e.lastPathTime = h), v && e.dynamicWavePaths.length)) {
            const J = v.width / 2,
              K = v.height / 2,
              U = {
                viewBox: v,
                svgRect: C,
                frameDt: T,
                subSteps: l,
                dt: w,
                timeSeconds: p,
                centerX: J,
                centerY: K,
                pointerActive: $,
                pointerDx: N,
                pointerDy: H,
                geometry: { matrix: y, inverseMatrix: B, listRect: O },
              };
            for (let k = 0; k < e.dynamicWavePaths.length; k++)
              z(e.dynamicWavePaths[k], U);
          }
          if (e.isInView) {
            e.pathRafId = requestAnimationFrame(u);
          } else {
            e.pathRafId = null;
          }
        }, "updateWavePath"),
        m = o(() => {
          if (!(!e.isInView || e.pathRafId)) {
            e.lastPathTime = 0;
            e.pathRafId = requestAnimationFrame(u);
          }
        }, "startWaveRaf"),
        R = o(() => {
          {
            if (e.pathRafId) {
              cancelAnimationFrame(e.pathRafId);
              e.pathRafId = null;
            }
            e.lastPathTime = 0;
            M.resetItemRotations();
          }
        }, "stopWaveRaf"),
        _ = o(() => {
          {
            e.intersectionObserver = new IntersectionObserver(
              ([h]) => {
                {
                  e.isInView = !!h.isIntersecting;
                  if (e.isInView) {
                    if (r() !== e.dynamicWavePaths.length) {
                      c();
                    } else {
                      L();
                    }
                    m();
                  } else {
                    R();
                  }
                }
              },
              { root: null, threshold: 0, rootMargin: "180px 0px 180px 0px" },
            );
            e.intersectionObserver.observe(t.value);
          }
        }, "setupVisibilityObserver"),
        P = o((h, v, T, l = !0) => {
          const w = n.value?.viewBox?.baseVal;
          if (!w) return;
          const p = ne(h, v);
          let S = null;
          if (l) {
            const C = pt(
              h,
              v,
              w.width / 2,
              w.height / 2,
              p.offsets,
              p.baseWaveAmplitude,
              p.baseWaveCycles,
              p.baseWavePhase,
            );
            {
              S = document.createElementNS(Re, "path");
              S.setAttribute("d", C);
              S.setAttribute("fill", "none");
              S.setAttribute("opacity", 0.16);
              S.setAttribute("stroke", "#58c8ed");
              S.setAttribute("stroke-width", "1");
              S.setAttribute("stroke-linecap", "round");
              S.setAttribute("stroke-linejoin", "round");
              n.value.appendChild(S);
            }
          }
          e.dynamicWavePaths.push({
            path: S,
            x: h,
            y: v,
            rope: p,
            itemIndex: T,
          });
        }, "createPath"),
        A = o(() => {
          {
            e.dynamicWavePaths.forEach(({ path: h }) => h?.remove());
            e.dynamicWavePaths = [];
            e.lastPathTime = 0;
          }
        }, "clearDynamicPaths");
      function c() {
        const h = n.value?.viewBox?.baseVal;
        if (!h) return;
        {
          A();
          f();
        }
        const v = a().length,
          T = i();
        let l = [];
        if (!T) {
          const C = s.value.getBoundingClientRect(),
            y = Array.from(s.value.children).filter((O) =>
              O.classList.contains("item"),
            );
          if (C?.width && C?.height && y.length >= v) {
            const O = h.width / C.width,
              B = h.height / C.height;
            l = y.slice(0, v).map((N) => {
              const H = N.getBoundingClientRect();
              return Math.max(H.width * O, H.height * B);
            });
          }
        }
        const w = ae(v, h, { itemSizes: l, outerOnly: T }),
          { outerCount: p } = T ? { outerCount: v } : It(v),
          S = new Set();
        {
          w.map((y, O) => ({ index: O, y: y.y }))
            .filter(({ index: y }) => y >= p)
            .sort((y, O) => O.y - y.y)
            .slice(0, 2)
            .forEach(({ index: y }) => S.add(y));
          w.forEach(({ x: C, y }, O) => {
            const N = !(O >= p) || S.has(O);
            P(C, y, O, N);
          });
          L();
          I();
        }
      }
      o(c, "createPathsForImages");
      const G = o(() => {
          W();
        }, "onWindowResize"),
        D = o(() => {
          {
            R();
            E();
            x();
            V.destroy();
            e.intersectionObserver.disconnect();
            e.intersectionObserver = null;
            e.isInView = !1;
            M.clear();
            e.shouldRefreshPinnedImageMetrics = !0;
            e.hoveredImageIndex = -1;
            window.removeEventListener("resize", G);
          }
        }, "destroy");
      return {
        mount: o(() => {
          {
            c();
            window.addEventListener("resize", G);
            V.mount();
            _();
          }
        }, "mount"),
        destroy: D,
        kill: D,
      };
    },
    "createPhotoCompositionMotion",
  );
export { buildPhotoComposition as createPhotoCompositionMotion };
