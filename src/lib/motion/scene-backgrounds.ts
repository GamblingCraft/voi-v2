import { sceneAsset } from "@/lib/three/scene-assets";

const preparedImages = new Map<string, Promise<string>>();

function prepareBackground(url: string, original: string) {
  let ready = preparedImages.get(url);
  if (!ready) {
    const image = new Image();
    image.decoding = "async";
    image.fetchPriority = "low";
    image.src = url;
    ready = image
      .decode()
      .then(() => url)
      .catch(async (error) => {
        if (url === original) throw error;
        image.src = original;
        await image.decode();
        return original;
      })
      .catch((error) => {
        preparedImages.delete(url);
        throw error;
      });
    preparedImages.set(url, ready);
  }
  return ready;
}

export function setupSceneBackgrounds(root: HTMLElement) {
  let disposed = false;
  const load = (element: HTMLElement) => {
    const url = sceneAsset(element.dataset.sceneBackground!);
    void prepareBackground(url, element.dataset.sceneBackground!)
      .then((preparedUrl) => {
        if (disposed) return;
        element.style.backgroundImage = `url('${preparedUrl}')`;
        element.dataset.backgroundReady = "true";
      })
      .catch((error) => {
        if (!disposed) console.error("scene-background-load", url, error);
      });
  };
  // Warm the three product surfaces before scrolling. Low fetch priority
  // leaves the first frame's model textures ahead of these larger images.
  // Decorative closing cutouts can still wait until they are near the viewport.
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const element = entry.target as HTMLElement;
        load(element);
        observer.unobserve(element);
      }
    },
    { rootMargin: "150% 0px" },
  );
  root
    .querySelectorAll<HTMLElement>("[data-scene-background]")
    .forEach((element) => {
      if (element.id.endsWith("-landscape-background")) load(element);
      else observer.observe(element);
    });
  return () => {
    disposed = true;
    observer.disconnect();
  };
}
