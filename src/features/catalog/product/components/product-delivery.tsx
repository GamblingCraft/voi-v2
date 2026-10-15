import { Truck } from "@deemlol/next-icons";
import deliveryStyles from "./product-delivery.module.css";
export function ProductDelivery() {
  return (
    <section
      className={deliveryStyles.purchaseDelivery}
      aria-labelledby="product-delivery"
    >
      <Truck size={24} aria-hidden="true" />
      <div>
        <h2 id="product-delivery">Доставка</h2>
        <p>
          Стоимость, доступность доставки и дату передачи заказа уточним по
          вашему адресу и объёму.
        </p>
      </div>
    </section>
  );
}
