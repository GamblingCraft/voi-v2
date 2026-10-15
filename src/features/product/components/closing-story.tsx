import AppLink from "next/link";
export function ClosingStory() {
  return (
    <section id="closing-story">
      <div
        data-speed="1.2"
        id="closing-cup"
        data-scene-background="/media/product/textures/cup-cutout.png"
        style={{
          backgroundSize: "contain",
          backgroundRepeat: "no-repeat",
        }}
      ></div>
      <div
        data-speed="1.1"
        id="closing-zip"
        data-scene-background="/media/product/textures/zip-cutout.png"
        style={{
          backgroundSize: "contain",
          backgroundRepeat: "no-repeat",
        }}
      ></div>
      <h2 id="closing-heading">
        {"Холодный характер"}
        <br />
        {"Чистый вкус"}
        <br />
        {"Ваш ритм Ваш лёд"}
      </h2>
      <h2 className="section-heading">
        {"Холодный характер"}
        <br />
        {"Чистый вкус"}
        <br />
        {"Ваш ритм Ваш лёд"}
      </h2>
      <div id="closing-content">
        <p className="text">
          {
            "Закрывающийся пакет для нескольких подач, упаковка для большого расхода или готовый стакан со льдом — один продукт в разных ритмах жизни."
          }
        </p>
        <p className="text">
          {
            "В каталоге собраны формы и доступные фасовки. Для эффектной сервировки у ВОЙ есть и премиальные боксы: упаковка, которая становится частью подачи."
          }
        </p>
      </div>
      <AppLink
        data-ui-action
        aria-label="Каталог"
        className="voi-catalog-button"
        href="/catalog"
      >
        {"Каталог"}
      </AppLink>
    </section>
  );
}
