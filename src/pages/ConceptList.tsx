import { Box } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { nodeApi } from "../services/api";
import { motion } from "framer-motion";
import { getStaggerContainer, fadeInUp } from "../utils/animations";
import FunctionsIcon from "@mui/icons-material/Functions";
import { FixedSizeList as List } from "react-window";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { EntityListLayout } from "../components/EntityList/EntityListLayout";
import { EntityGlassCard } from "../components/EntityList/EntityGlassCard";

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

  const containerVariants = getStaggerContainer(0.05);
  const itemVariants = fadeInUp;

  return (
    <EntityListLayout
      title={t("entities.concepts_title") || "Concepts"}
      seoTitle={t("entities.concepts_title") || "Concepts"}
      seoDescription="Explorez tous les concepts mathématiques, théorèmes et définitions de MathGraph."
      loading={loading}
      error={error as Error}
      errorMessage={t("entities.error_occurred")}
      isEmpty={concepts.length === 0}
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
    >
      <motion.div variants={containerVariants} initial="hidden" animate="show">
        <Box sx={{ height: "65vh", width: "100%", bgcolor: "transparent" }}>
          <List
            height={window.innerHeight * 0.65}
            itemCount={concepts.length}
            itemSize={90}
            width={"100%"}
          >
            {({ index, style }) => {
              const concept = concepts[index];
              return (
                <div style={{ ...style, paddingBottom: "16px" }}>
                  <motion.div
                    variants={itemVariants}
                    style={{ height: "100%" }}
                  >
                    <EntityGlassCard
                      title={concept.nom}
                      icon={<FunctionsIcon />}
                      actionTo={`/concept/${concept.id}`}
                      actionText={t("entities.view")}
                      isSecondary={false}
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

export default ConceptList;
