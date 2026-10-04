import type { Metadata } from "next";
import { ButtonLink } from "@/components/atoms/Button";
import { FaqList } from "@/components/molecules/FaqList";
import { PageHeader } from "@/components/templates/PageHeader";
import { storeFaqs } from "@/demo/fixtures/content";

export const metadata: Metadata = { title: "Preguntas frecuentes" };

export default function FaqPage() {
  return (
    <div className="max-w-3xl">
      <PageHeader title="Preguntas frecuentes">Lo que más nos preguntan antes de comprar.</PageHeader>
      <FaqList faqs={storeFaqs} />
      <div className="mt-8 flex flex-wrap gap-3">
        <ButtonLink href="/crear/">Crear mi producto</ButtonLink>
        <ButtonLink href="/arrepentimiento/" variant="secondary">Botón de arrepentimiento</ButtonLink>
      </div>
    </div>
  );
}
