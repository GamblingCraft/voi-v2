import type { ReactNode } from "react";
export function PvdStory({ children }: { children?: ReactNode }) {
  return (
    <section id="pvd-story">
      <h2 className="section-heading">
        {"Больше гостей"}
        <br />
        {"Больше льда"}
      </h2>
      <p className="interactive">{"ПВД-упаковка"}</p>
      <span aria-hidden="true" className="numdos voi-decor-placeholder"></span>
      <h3 className="section-subheading hotspicy">
        {"Просто"}
        <br />
        {"Холодно"}
      </h3>
      <div id="pvd-content">
        <p className="text">
          {
            "Пакет для большого расхода: барной смены, выездного сервиса или вечеринки. Прозрачная упаковка открывает вид на содержимое, а фасовка помогает собрать нужный запас."
          }
        </p>
        <p className="text desktop-only">
          {
            "Лёд для бокалов и лёд для охлаждения бутылок расходуются по-разному. Их запас удобнее рассчитывать отдельно, особенно на мероприятиях с долгой подачей."
          }
        </p>
        <p className="text desktop-only">
          {
            "Упаковка отвечает за удобство работы, а вид льда — за задачу. Доступные варианты и вес указаны в карточках каталога."
          }
        </p>
      </div>
      {children}
    </section>
  );
}
