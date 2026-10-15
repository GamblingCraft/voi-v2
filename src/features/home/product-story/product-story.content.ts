import "server-only";

const heading = ["Lorem", "ipsum"];
const paragraph =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";
const media = "Lorem ipsum";

// Placeholder text for the Russian prototype; CMS content will replace it later.
export const productStoryContent = {
  ariaLabel: "Lorem ipsum",
  origin: {
    title: ["Сотворён Байкалом"],
    note: "Воплощён в гастрономическое искусство.",
    quote: {
      text: "Байкал — это не просто озеро, а настоящее море. Оно поражает своей красотой, величием и таинственностью",
      author: "Антон Павлович Чехов",
    },
    waterMedia: media,
  },
  production: {
    eyebrow: "Lorem ipsum",
    steps: [
      {
        id: "water",
        title: heading,
        description: paragraph,
        media: "Видео: вода для производства льда",
      },
      {
        id: "freezing",
        title: heading,
        description: paragraph,
        media: "Видео: заморозка льда",
      },
      {
        id: "shaping",
        title: heading,
        description: paragraph,
        media: "Видео: упаковка готового льда",
      },
    ],
  },
  ritual: { title: "Lorem ipsum", media },
  text: {
    title: "Lorem ipsum",
    paragraphs: [
      paragraph,
      "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
    ],
  },
  journey: {
    ariaLabel: "Путь льда ВОЙ — от воды до подачи",
    chapters: [
      {
        id: "water",
        title: ["В основе", "Байкал"],
        description: paragraph,
        image: "/media/cooperation/2.webp",
        alt: "Прозрачные кубы льда крупным планом",
      },
      {
        id: "production",
        title: ["Характер", "рождается здесь"],
        description: paragraph,
        image: "/media/production/sections/33.webp",
        alt: "Формование льда на производственной линии",
      },
      {
        id: "form",
        title: ["У каждой формы", "своя роль"],
        description: paragraph,
        image: "/media/products/ice-blocks-cutout.png",
        alt: "Прозрачные ледяные блоки разного размера",
      },
      {
        id: "serving",
        title: ["Лёд становится", "частью подачи"],
        description: paragraph,
        image: "/media/product/hero/1.webp",
        alt: "Сфера льда в бокале с напитком на барной стойке",
      },
    ],
  },
  finale: { title: heading, media, note: paragraph },
  faq: {
    title: "Lorem ipsum",
    description: paragraph,
    items: [
      {
        id: "first",
        question: "Lorem ipsum dolor sit amet?",
        answer: paragraph,
      },
      {
        id: "second",
        question: "Consectetur adipiscing elit?",
        answer:
          "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
      },
      {
        id: "third",
        question: "Sed do eiusmod tempor incididunt?",
        answer:
          "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
      },
      {
        id: "fourth",
        question: "Ut labore et dolore magna aliqua?",
        answer: paragraph,
      },
      {
        id: "fifth",
        question: "Quis nostrud exercitation ullamco?",
        answer:
          "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
      },
      {
        id: "sixth",
        question: "Duis aute irure dolor in reprehenderit?",
        answer:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
      },
    ],
  },
};
