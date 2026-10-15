export function FooterBackdrop() {
  return (
    <div className="voi-footer-prelude">
      <video
        className="voi-footer-background"
        src="/footer/footer.mp4"
        poster="/media/baikal/bcksecondtest.png"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-hidden="true"
      />
      <div className="voi-footer-caption">
        <small>СОТВОРЁН БАЙКАЛОМ</small>
        <h2 className="voi-display">
          <em>Вода</em> Байкала
          <br />
          Характер ВОЙ
        </h2>
      </div>
    </div>
  );
}
