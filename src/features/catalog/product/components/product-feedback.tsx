import { Star } from "@deemlol/next-icons";
import type { ProductId } from "../../catalog-model";
import { getPublishedProductQuestions } from "../product-questions";
import { getPublishedProductReviews } from "../product-reviews";
import { FeedbackAuthor } from "./feedback-author";
import { ProductFeedbackForm } from "./product-feedback-form";
import feedbackStyles from "./product-feedback-list.module.css";

// Public content is server-rendered; submission state stays in the client form.
export function ProductFeedback({
  productId,
  mode,
  authenticatedUser = null,
}: {
  productId: ProductId;
  mode: "review" | "question";
  authenticatedUser?: { name: string } | null;
}) {
  const review = mode === "review";
  const questions = review ? [] : getPublishedProductQuestions(productId);
  const reviews = review ? getPublishedProductReviews(productId) : [];
  return (
    <section
      className={feedbackStyles.section}
      aria-labelledby={`feedback-${mode}`}
    >
      <h2 id={`feedback-${mode}`}>{review ? "Отзывы" : "Вопросы"}</h2>
      {reviews.length > 0 && (
        <div className={feedbackStyles.questions}>
          {reviews.map((item) => (
            <article
              key={item.id}
              className={feedbackStyles.question}
              aria-label={`Отзыв от ${item.author}`}
            >
              <div className={feedbackStyles.reviewHeader}>
                <FeedbackAuthor name={item.author} />
                <div
                  className={feedbackStyles.publicRating}
                  role="img"
                  aria-label={`Оценка ${item.rating} из 5`}
                >
                  {[1, 2, 3, 4, 5].map((value) => (
                    <Star
                      key={value}
                      size={17}
                      fill={value <= item.rating ? "currentColor" : "none"}
                      aria-hidden="true"
                    />
                  ))}
                </div>
              </div>
              <p>{item.text}</p>
              {item.answer && (
                <div className={feedbackStyles.answer}>
                  <FeedbackAuthor name="ВОЙ" admin />
                  <p>{item.answer}</p>
                </div>
              )}
            </article>
          ))}
        </div>
      )}
      {questions.length > 0 && (
        <div className={feedbackStyles.questions}>
          {questions.map((question) => (
            <article
              key={question.id}
              className={feedbackStyles.question}
              aria-label={`Вопрос от ${question.author}`}
            >
              <FeedbackAuthor name={question.author} />
              <p>{question.question}</p>
              <div className={feedbackStyles.answer}>
                <FeedbackAuthor name={question.answer.author} admin />
                <p>{question.answer.text}</p>
              </div>
            </article>
          ))}
        </div>
      )}

      <ProductFeedbackForm
        productId={productId}
        mode={mode}
        authenticatedUser={authenticatedUser}
      />
    </section>
  );
}
