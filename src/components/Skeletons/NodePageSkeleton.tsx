import { Skeleton } from "@mui/material";
import {
  DetailsGrid,
  MainContentColumn,
  ConceptHeader,
  ConceptTitleRow,
  MathCard,
  MathCardHeader,
  MathCardBody,
  SidebarColumn,
  SidebarCard,
  SidebarCardTitle,
  MetadataList,
  MetadataItem,
  MetadataLabel,
  MetadataValue,
  SidebarActions,
} from "../../pages/NodePage.styles";

export const NodePageSkeleton = () => {
  return (
    <DetailsGrid>
      {/* Colonne Principale (Gauche) */}
      <MainContentColumn>
        <ConceptHeader>
          <ConceptTitleRow>
            <Skeleton variant="text" width="60%" height={80} />
            <Skeleton variant="circular" width={40} height={40} />
          </ConceptTitleRow>
        </ConceptHeader>

        {/* Card Enoncé / Bio */}
        <MathCard>
          <MathCardHeader>
            <Skeleton variant="text" width="30%" height={32} />
          </MathCardHeader>
          <MathCardBody>
            <Skeleton variant="text" width="100%" height={24} />
            <Skeleton variant="text" width="100%" height={24} />
            <Skeleton variant="text" width="80%" height={24} />
          </MathCardBody>
        </MathCard>

        {/* Card Démo / Info */}
        <MathCard>
          <MathCardHeader>
            <Skeleton variant="text" width="40%" height={32} />
          </MathCardHeader>
          <MathCardBody>
            <Skeleton variant="text" width="100%" height={24} />
            <Skeleton variant="text" width="90%" height={24} />
            <Skeleton variant="text" width="95%" height={24} />
            <Skeleton variant="text" width="60%" height={24} />
          </MathCardBody>
        </MathCard>
      </MainContentColumn>

      {/* Colonne Latérale (Droite) */}
      <SidebarColumn>
        {/* Switch Mode Édition (Simulé) */}
        <SidebarCard>
          <Skeleton
            variant="rectangular"
            width="100%"
            height={38}
            sx={{ borderRadius: 1 }}
          />
        </SidebarCard>

        {/* Carte Métadonnées */}
        <SidebarCard>
          <SidebarCardTitle variant="h6">
            <Skeleton variant="text" width="50%" height={32} />
          </SidebarCardTitle>
          <MetadataList>
            {[1, 2, 3, 4, 5].map((item) => (
              <MetadataItem key={item}>
                <MetadataLabel>
                  <Skeleton variant="text" width="40%" height={20} />
                </MetadataLabel>
                <MetadataValue>
                  <Skeleton variant="text" width="70%" height={24} />
                </MetadataValue>
              </MetadataItem>
            ))}
          </MetadataList>
        </SidebarCard>

        {/* Carte Actions */}
        <SidebarCard>
          <SidebarCardTitle variant="h6">
            <Skeleton variant="text" width="40%" height={32} />
          </SidebarCardTitle>
          <SidebarActions>
            <Skeleton
              variant="rectangular"
              width="100%"
              height={40}
              sx={{ borderRadius: 2 }}
            />
            <Skeleton
              variant="rectangular"
              width="100%"
              height={40}
              sx={{ borderRadius: 2 }}
            />
            <Skeleton
              variant="rectangular"
              width="100%"
              height={40}
              sx={{ borderRadius: 2 }}
            />
          </SidebarActions>
        </SidebarCard>
      </SidebarColumn>
    </DetailsGrid>
  );
};
