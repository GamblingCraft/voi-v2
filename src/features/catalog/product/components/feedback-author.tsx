import authorStyles from "./feedback-author.module.css";
export function FeedbackAuthor({
  name,
  admin = false,
}: {
  name: string;
  admin?: boolean;
}) {
  return (
    <div className={authorStyles.authorRow}>
      <span
        className={`${authorStyles.avatar} ${admin ? authorStyles.adminAvatar : ""}`}
        aria-hidden="true"
      >
        {admin ? "ВОЙ" : name.slice(0, 1)}
      </span>
      <div>
        <div className={authorStyles.author}>{name}</div>
        {admin && (
          <span className={authorStyles.authorRole}>Ответ производителя</span>
        )}
      </div>
    </div>
  );
}
