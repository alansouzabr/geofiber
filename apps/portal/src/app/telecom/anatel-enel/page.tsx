import TaxonomyHub
  from "@/components/common/TaxonomyHub";

export default function AnatelEnelPage() {

  return (
    <TaxonomyHub
      title="Anatel / Enel"
      description="Documentação regulatória e acessos institucionais."
      items={[
        {
          title: "Anatel",
          href: "/arquivos/anatel",
          description:
            "Regulação e documentação Anatel."
        },
        {
          title: "Enel",
          href: "/arquivos/enel",
          description:
            "Documentação e relacionamento Enel."
        }
      ]}
    />
  );
}
