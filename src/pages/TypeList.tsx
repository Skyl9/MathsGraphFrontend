import { Box } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { nodeApi } from "../services/api";
import { motion } from "framer-motion";
import { getStaggerContainer, fadeInUp } from "../utils/animations";
import LayersIcon from "@mui/icons-material/Layers";
import { FixedSizeList as List } from "react-window";
import { useTranslation } from "react-i18next";
import { EntityListLayout } from "../components/EntityList/EntityListLayout";
import { EntityGlassCard } from "../components/EntityList/EntityGlassCard";

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

  const containerVariants = getStaggerContainer(0.05);
  const itemVariants = fadeInUp;

  return (
    <EntityListLayout
      title={t("entities.types_title") || "Types"}
      seoTitle={t("entities.types_title") || "Types"}
      seoDescription="Découvrez les différents types de concepts mathématiques présents dans MathGraph."
      loading={loading}
      error={error as Error}
      errorMessage={t("entities.error_occurred")}
      isEmpty={types.length === 0}
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
    >
      <motion.div variants={containerVariants} initial="hidden" animate="show">
        <Box sx={{ height: "65vh", width: "100%", bgcolor: "transparent" }}>
          <List
            height={window.innerHeight * 0.65}
            itemCount={types.length}
            itemSize={90}
            width={"100%"}
          >
            {({ index, style }) => {
              const typeItem = types[index];
              return (
                <div style={{ ...style, paddingBottom: "16px" }}>
                  <motion.div
                    variants={itemVariants}
                    style={{ height: "100%" }}
                  >
                    <EntityGlassCard
                      title={typeItem.nom}
                      icon={<LayersIcon />}
                      actionTo={`/type/${typeItem.id}`}
                      actionText={t("entities.view")}
                      isSecondary={true}
                    />
                  </motion.div>
                </div>
              );
            }}
          </List>
        </Box>
      </motion.div>
    </EntityListLayout>
  );
};

export default TypeList;
