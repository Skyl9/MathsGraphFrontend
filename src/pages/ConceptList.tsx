import { useQuery } from "@tanstack/react-query";
import { nodeApi } from "../services/api";
import { GenericEntityList } from "../components/EntityList/GenericEntityList";
import FunctionsIcon from "@mui/icons-material/Functions";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const ConceptList = () => {
  const {
    data: concepts = [],
    isLoading: loading,
    error,
  } = useQuery({
    queryKey: ["concept"],
    queryFn: () => nodeApi.getAllConceptNames(),
  });
  const { t } = useTranslation();

  return (
    <GenericEntityList
      title={t("entities.concepts_title") || "Concepts"}
      seoTitle={t("entities.concepts_title") || "Concepts"}
      seoDescription="Explorez tous les concepts mathématiques, théorèmes et définitions de MathGraph."
      loading={loading}
      error={error as Error}
      errorMessage={t("entities.error_occurred")}
      items={concepts}
      emptyMessage={t("entities.no_concept_found")}
      seoFallback={
        <ul>
          {concepts.map((c) => (
            <li key={`seo-${c.id}`}>
              <Link to={`/concept/${c.id}`}>{c.nom}</Link>
            </li>
          ))}
        </ul>
      }
      renderCardProps={(concept) => ({
        title: concept.nom,
        icon: <FunctionsIcon />,
        actionTo: `/concept/${concept.id}`,
        actionText: t("entities.view"),
        isSecondary: false,
      })}
    />
  );
};

export default ConceptList;
