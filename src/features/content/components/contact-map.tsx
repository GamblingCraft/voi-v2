import { company } from "@/lib/company";
import styles from "./contact-map.module.css";

export function ContactMap() {
  return (
    <section className={styles.location} aria-labelledby="location-heading">
      <div className={styles.heading}>
        <div>
          <h2 id="location-heading">Иркутск</h2>
        </div>
        {(company.streetAddress || company.openingHours) && (
          <div>
            {company.streetAddress && <p>{company.streetAddress}</p>}
            {company.openingHours && <p>{company.openingHours}</p>}
          </div>
        )}
      </div>
      <div className={styles.map}>
        <iframe
          title="Яндекс Карта Иркутска — без отметки адреса производства"
          src="https://yandex.ru/map-widget/v1/?ll=104.2806%2C52.2864&z=12"
          loading="lazy"
          referrerPolicy="no-referrer"
        />
      </div>
    </section>
  );
}
