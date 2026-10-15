import type { ReactNode } from "react";
import { InquiryForm } from "@/features/inquiries/inquiry-form";
import styles from "./inquiry-section.module.css";

export function InquirySection({ title }: { title: ReactNode }) {
  return (
    <section
      id="inquiry"
      className={styles.inquirySection}
      data-header-theme="light"
    >
      <div>
        <h2>{title}</h2>
      </div>
      <InquiryForm />
    </section>
  );
}
