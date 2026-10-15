// Product families from the ВОЙ concept; individual SKUs require technical specifications.
export const iceFormats = [
  {
    id: "formed",
    name: "Формованный лёд",
    shortName: "Формованный",
    image: "/media/hero/opening/4.png",
    description:
      "Для коктейлей и авторской подачи. Куб, сфера и цилиндр — примеры форм этого направления.",
    href: "/catalog/formed",
  },
  {
    id: "loose",
    name: "Рассыпной лёд",
    shortName: "Рассыпной",
    image: "/media/products/loose-pack-cutout.png",
    description: "Лёд в пакете для охлаждения, работы кухни и бара.",
    href: "/catalog/loose",
  },
  {
    id: "block",
    name: "Блочный лёд",
    shortName: "Блочный",
    image: "/media/products/ice-blocks-cutout.png",
    description:
      "Для ледяной резьбы, оформления подачи и событийных инсталляций.",
    href: "/catalog/block",
  },
] as const;

export type IceCategoryId = (typeof iceFormats)[number]["id"];
export type IceFormat = (typeof iceFormats)[number];
