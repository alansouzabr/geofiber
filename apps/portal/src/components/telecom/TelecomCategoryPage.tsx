import DocumentsManager
  from "@/components/admin/documents/DocumentsManager";


type TelecomCategoryPageProps = {

  title: string;

  description: string;

  category: string;

};


export default function TelecomCategoryPage({

  title,

  description,

  category

}: TelecomCategoryPageProps) {

  return (

    <div className="space-y-8">

      <header>

        <h1
          className="
            text-3xl
            font-bold
            text-white
          "
        >
          {title}
        </h1>

        <p
          className="
            mt-2
            text-sm
            text-slate-400
          "
        >
          {description}
        </p>

      </header>


      <DocumentsManager
        key={category}
        mode="ged"
        defaultCategory={category}
        canonicalRouting
        embedded
        showFilters={false}
      />

    </div>

  );

}
