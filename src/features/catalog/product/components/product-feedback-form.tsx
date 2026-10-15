"use client";
import { useState } from "react";
import { Star } from "@deemlol/next-icons";
import type { ProductId } from "../../catalog-model";
import formStyles from "./product-feedback-form.module.css";

export function ProductFeedbackForm({
  productId,
  mode,
  authenticatedUser,
}: {
  productId: ProductId;
  mode: "review" | "question";
  authenticatedUser: { name: string } | null;
}) {
  const review = mode === "review";
  const [rating, setRating] = useState(0);
  const [sent, setSent] = useState(false);
  // No client-generated session: the parent must pass a server-verified user.
  const requiresSignIn = authenticatedUser === null;
  return (
    <>
      {requiresSignIn ? (
        <div className={formStyles.authNotice}>
          {review
            ? "Чтобы оставить отзыв и поставить оценку, авторизуйтесь."
            : "Чтобы задать вопрос, авторизуйтесь."}
        </div>
      ) : sent ? (
        <p role="status" className={formStyles.note}>
          {review ? "Отзыв успешно отправлен." : "Вопрос успешно отправлен."}
        </p>
      ) : (
        <form
          className={formStyles.form}
          onSubmit={(event) => {
            event.preventDefault();
            if (requiresSignIn) return;
            // Prototype success state only; no network request until the backend is connected.
            setSent(true);
          }}
        >
          <input type="hidden" name="productId" value={productId} />
          <h3>{review ? "Оставить отзыв" : "Задать вопрос"}</h3>
          <fieldset className={formStyles.fields} disabled={requiresSignIn}>
            {review && (
              <fieldset className={formStyles.rating}>
                <legend>Ваша оценка</legend>
                <div>
                  {[1, 2, 3, 4, 5].map((value) => (
                    <label key={value}>
                      <input
                        type="radio"
                        name="rating"
                        value={value}
                        checked={rating === value}
                        onChange={() => setRating(value)}
                        required
                        aria-label={`${value} из 5`}
                      />
                      <Star
                        size={26}
                        fill={value <= rating ? "currentColor" : "none"}
                        aria-hidden="true"
                      />
                    </label>
                  ))}
                </div>
              </fieldset>
            )}
            <label>
              Ваше имя
              <input
                name="name"
                required
                maxLength={80}
                autoComplete="name"
                defaultValue={authenticatedUser?.name}
              />
            </label>
            <label>
              {review ? "Ваш отзыв" : "Ваш вопрос"}
              <textarea
                name="message"
                required
                minLength={5}
                maxLength={3000}
                rows={4}
              />
            </label>
          </fieldset>
          <div className={formStyles.actions}>
            <button data-ui-action type="submit" disabled={requiresSignIn}>
              Отправить
            </button>
          </div>
        </form>
      )}
    </>
  );
}
