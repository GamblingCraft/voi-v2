import { List, BookOpen } from "@deemlol/next-icons";
import type { Recipe } from "../blog.types";
import styles from "../article.module.css";

export function RecipeSummary({ recipe }: { recipe: Recipe }) {
  return (
    <div className={styles.recipeSummary}>
      <span>
        <BookOpen size={18} strokeWidth={1.5} aria-hidden="true" />
        {recipe.yield}
      </span>
      <a href="#ingredients">Ингредиенты</a>
      <a href="#method">
        <List size={18} strokeWidth={1.5} aria-hidden="true" />К шагам рецепта
      </a>
    </div>
  );
}
export function RecipeContent({
  recipe,
  part,
}: {
  recipe: Recipe;
  part: "ingredients" | "steps";
}) {
  if (part === "ingredients")
    return (
      <>
        <ul>
          {recipe.ingredients.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <h3>Инвентарь</h3>
        <p>{recipe.equipment.join(", ")}.</p>
      </>
    );
  return (
    <ol className={styles.steps}>
      {recipe.steps.map((step, index) => (
        <li id={step.id} key={step.id}>
          <span className={styles.stepNumber} aria-hidden="true">
            {index + 1}
          </span>
          <div>
            <h3>{step.title}</h3>
            <p>{step.text}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
