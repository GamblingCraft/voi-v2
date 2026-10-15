// Build a detached, noninteractive copy of only the visible page. Styles and
// sticky positions are resolved once; video/canvas become frozen pixel frames.
// This does not hold a document ViewTransition, which blocks pointer hit testing.
export function captureMenuViewport(surface: HTMLElement) {
  // WebGL clears its drawing buffer after presentation; render synchronously
  // before copying the current frame into the existing menu snapshot.
  window.dispatchEvent(new Event("voi:capture-frame"));
  const viewport = {
    width: document.documentElement.clientWidth,
    height: innerHeight,
  };
  const stickyElements: { clone: HTMLElement; rect: DOMRect }[] = [];
  const copy = (source: Element): Element | null => {
    const rect = source.getBoundingClientRect();
    const style = getComputedStyle(source);
    if (style.display === "none") return null;
    // Hidden/faded sections still occupy layout space (notably the retired
    // product hero). Dropping their boxes pulls the captured page upward.
    const invisible = style.visibility === "hidden" || style.opacity === "0";
    const outsideViewport =
      source !== surface &&
      (rect.bottom <= 0 ||
        rect.top >= viewport.height ||
        rect.right <= 0 ||
        rect.left >= viewport.width);

    let clone: Element;
    if (
      source instanceof HTMLVideoElement ||
      source instanceof HTMLCanvasElement
    ) {
      const canvas = document.createElement("canvas");
      canvas.width =
        source instanceof HTMLVideoElement ? source.videoWidth : source.width;
      canvas.height =
        source instanceof HTMLVideoElement ? source.videoHeight : source.height;
      if (!canvas.width || !canvas.height) return null;
      const context = canvas.getContext("2d");
      if (!context) return null;
      try {
        context.drawImage(source, 0, 0);
      } catch {
        return null;
      }
      clone = canvas;
      clone.setAttribute("class", source.getAttribute("class") ?? "");
    } else {
      clone = source.cloneNode(false) as Element;
    }

    if (clone instanceof HTMLElement || clone instanceof SVGElement) {
      for (const property of Array.from(style))
        clone.style.setProperty(property, style.getPropertyValue(property));
      clone.style.setProperty("animation", "none", "important");
      clone.style.setProperty("transition", "none", "important");
      clone.style.setProperty("pointer-events", "none", "important");
      clone.style.setProperty("caret-color", "transparent");
      if (style.position === "sticky" && source instanceof HTMLElement) {
        // Keep the sticky element's space in flow. Absolute positioning removes
        // the footer video's full-screen box and pulls the panel above it.
        clone.style.position = "relative";
        clone.style.top = "0px";
        clone.style.left = "0px";
        clone.style.bottom = "auto";
        clone.style.right = "auto";
        stickyElements.push({ clone: clone as HTMLElement, rect });
      }
    }
    clone.removeAttribute("id");
    clone.removeAttribute("autofocus");
    // Runtime selectors must continue to find only the real page. Keep the
    // header's visual state: its ::before backdrop depends on this attribute.
    for (const attribute of Array.from(clone.attributes)) {
      if (
        attribute.name.startsWith("data-") &&
        attribute.name !== "data-on-hero"
      )
        clone.removeAttribute(attribute.name);
    }
    if (
      clone instanceof HTMLImageElement &&
      source instanceof HTMLImageElement
    ) {
      clone.removeAttribute("srcset");
      clone.removeAttribute("sizes");
      clone.src = source.currentSrc || source.src;
      clone.loading = "eager";
    }
    // Keep offscreen element boxes so preceding sections/flex items retain
    // their layout space. Their descendants and media need not be captured.
    if (
      invisible ||
      (outsideViewport && !source.hasAttribute("data-snapshot-traverse"))
    )
      return clone;
    if (
      !(source instanceof HTMLVideoElement) &&
      !(source instanceof HTMLCanvasElement)
    ) {
      for (const child of source.childNodes) {
        if (child instanceof Element) {
          const copied = copy(child);
          if (copied) clone.appendChild(copied);
        } else if (child.nodeType === Node.TEXT_NODE) {
          clone.appendChild(child.cloneNode());
        }
      }
    }
    return clone;
  };
  const clone = copy(surface) as HTMLElement | null;
  if (!clone) return null;
  clone.inert = true;
  clone.setAttribute("aria-hidden", "true");
  clone.style.margin = "0";
  clone.style.position = "relative";
  clone.style.top = `${surface.getBoundingClientRect().top}px`;
  clone.style.left = `${surface.getBoundingClientRect().left}px`;
  return {
    node: clone,
    ...viewport,
    freezeSticky() {
      // Measure after mounting, before the snapshot tilts. Relative offsets
      // preserve both the visible position and the surrounding document flow.
      for (const { clone: element, rect } of stickyElements) {
        const current = element.getBoundingClientRect();
        element.style.top = `${rect.top - current.top}px`;
        element.style.left = `${rect.left - current.left}px`;
      }
    },
  };
}
