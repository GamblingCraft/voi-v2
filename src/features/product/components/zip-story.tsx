export function ZipStory() {
  return (
    <section id="zip-story">
      <h2 className="section-heading">
        {"Чистый лёд"}
        <span data-speed="1.05" id="heading-ice"></span>
        {"для вашего бара"}
      </h2>
      <h3>
        <span aria-hidden="true" className="voi-decor-placeholder"></span>
        <div className="section-subheading">{"Форма имеет значение"}</div>
        <span aria-hidden="true" className="right voi-decor-placeholder"></span>
      </h3>
      <div id="zip-content">
        <div className="desktop-only zip-content-column">
          <p className="text">
            {
              "Куб поддерживает лаконичную подачу, сфера становится центром композиции, цилиндр повторяет линии высокого бокала. У каждой формы свой визуальный характер."
            }
          </p>
          <p className="text">
            {
              "Для рецепта важна не только форма, но и количество льда. Размер подбирают под посуду: внутри должно оставаться место для напитка и гарниша."
            }
          </p>
        </div>
        <div className="zip-content-column">
          <p className="text">
            {
              "ZIP-пакет удобно открывать по мере расхода и закрывать снова. Это формат для нескольких подач: дома, за барной стойкой или на небольшой встрече."
            }
          </p>
          <p className="text">
            {
              "Куб, сфера или цилиндр — выбирайте геометрию под ваш бокал. Лёд берут чистыми щипцами или совком, остаток хранят по условиям на упаковке."
            }
          </p>
        </div>
      </div>
    </section>
  );
}
