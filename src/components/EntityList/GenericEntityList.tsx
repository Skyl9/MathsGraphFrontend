import { Box } from "@mui/material";
import { motion } from "framer-motion";
import { getStaggerContainer, fadeInUp } from "../../utils/animations";
import { FixedSizeList as List } from "react-window";
import { EntityListLayout, EntityListLayoutProps } from "./EntityListLayout";
import { EntityGlassCard, EntityGlassCardProps } from "./EntityGlassCard";
import { ReactNode } from "react";

export interface GenericEntityListProps<T> extends Omit<
  EntityListLayoutProps,
  "children" | "isEmpty"
> {
  items: T[];
  itemSize?: number;
  listHeight?: string | number;
  renderCardProps: (
    item: T,
    index: number,
  ) => EntityGlassCardProps & { children?: ReactNode };
}

export function GenericEntityList<T>({
  items,
  itemSize = 90,
  listHeight = "65vh",
  renderCardProps,
  ...layoutProps
}: GenericEntityListProps<T>) {
  const containerVariants = getStaggerContainer(0.05);
  const itemVariants = fadeInUp;

  // Ensure listHeight calculation for react-window
  const numericalHeight =
    typeof listHeight === "string" && listHeight.endsWith("vh")
      ? (window.innerHeight * parseInt(listHeight)) / 100
      : typeof listHeight === "number"
        ? listHeight
        : window.innerHeight * 0.65;

  return (
    <EntityListLayout isEmpty={items.length === 0} {...layoutProps}>
      <motion.div variants={containerVariants} initial="hidden" animate="show">
        <Box sx={{ height: listHeight, width: "100%", bgcolor: "transparent" }}>
          <List
            height={numericalHeight}
            itemCount={items.length}
            itemSize={itemSize}
            width="100%"
          >
            {({ index, style }) => {
              const item = items[index];
              const cardProps = renderCardProps(item, index);
              return (
                <div style={{ ...style, paddingBottom: "16px" }}>
                  <motion.div
                    variants={itemVariants}
                    style={{ height: "100%" }}
                  >
                    <EntityGlassCard {...cardProps}>
                      {cardProps.children}
                    </EntityGlassCard>
                  </motion.div>
                </div>
              );
            }}
          </List>
        </Box>
      </motion.div>
    </EntityListLayout>
  );
}
