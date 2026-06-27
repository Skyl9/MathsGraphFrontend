import { useQuery } from "@tanstack/react-query";
import { nodeApi } from "../services/api";
import { GenericEntityList } from "../components/EntityList/GenericEntityList";
import LayersIcon from "@mui/icons-material/Layers";
import { useTranslation } from "react-i18next";

const TypeList = () => {
  const {
    data: types = [],
    isLoading: loading,
    error,
  } = useQuery({
    queryKey: ["type"],
    queryFn: () => nodeApi.getAllTypeNames(),
  });
  const { t } = useTranslation();

  return (
    <GenericEntityList
      title={t("entities.types_title") || "Types"}
      seoTitle={t("entities.types_title") || "Types"}
      seoDescription="Découvrez les différents types de concepts mathématiques présents dans MathGraph."
      loading={loading}
      error={error as Error}
      errorMessage={t("entities.error_occurred")}
      items={types}
      emptyMessage={t("entities.no_type_found")}
      seoFallback={
        <ul>
          {types.map((tItem) => (
            <li key={`seo-${tItem.id}`}>
              <a href={`/type/${tItem.id}`}>{tItem.nom}</a>
            </li>
          ))}
        </ul>
      }
      renderCardProps={(typeItem) => ({
        title: typeItem.nom,
        icon: <LayersIcon />,
        actionTo: `/type/${typeItem.id}`,
        actionText: t("entities.view"),
        isSecondary: true,
      })}
    />
  );
};

export default TypeList;
