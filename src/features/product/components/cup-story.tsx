export function CupStory() {
  return (
    <section id="cup-story">
      <h2 className="section-heading" id="cup-heading">
        {"Холод всегда"}
        <br />
        {"рядом"}
      </h2>
      <p className="pvd-stage numtres"></p>
      <p className="numtres"></p>
      <div className="cool">
        <div className="cooltext">
          <p className="text">
            {
              "Стакан со льдом: прозрачный корпус, ледяное наполнение и фирменная крышка «ВОЙ». Компактный формат, который можно взять с собой."
            }
          </p>
          <p className="text">
            {
              "Откройте крышку, добавьте любимый напиток и наслаждайтесь моментом. Ваш лёд уже в стакане."
            }
          </p>
        </div>
      </div>
      <span
        aria-hidden="true"
        className="voi-decor-placeholder"
        id="cup-description"
      ></span>
    </section>
  );
}
