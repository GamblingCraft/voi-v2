export function createPhotoCompositionMotion(options: {
  el: { value: HTMLElement };
  svgEl: { value: SVGSVGElement };
  photosList: { value: HTMLUListElement };
  getList: () => unknown[];
  isOuterOnly: () => boolean;
}): { mount(): void; destroy(): void; kill(): void };
