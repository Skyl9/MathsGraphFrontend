const fs = require('fs');
const path = require('path');

const filePaths = [
    'src/pages/MathematicienPage.tsx',
    'src/pages/CategoryPage.tsx',
    'src/pages/TypePage.tsx'
];

for (const filePath of filePaths) {
    let content = fs.readFileSync(filePath, 'utf8');

    // Add imports
    content = content.replace('import "../styles/NodePage.css";', `import {
  DetailsGrid,
  MainContentColumn,
  ConceptHeader,
  ConceptTitleRow,
  ConceptTitle,
  MathCard,
  MathCardHeader,
  MathCardTitle,
  MathCardBody,
  SidebarColumn,
  SidebarCard,
  SidebarCardTitle,
  MetadataList,
  MetadataItem,
  MetadataLabel,
  MetadataValue,
  SidebarActions
} from "./NodePage.styles";`);

    // Remove unused Typography import if any
    content = content.replace(/import \{(.*?)\Typography,?(.*?)\} from "@mui\/material";/s, 'import {$1$2} from "@mui/material";');

    // Replace opening tags
    content = content.replace(/<div className="details-grid">/g, '<DetailsGrid>');
    content = content.replace(/<div className="main-content-column">/g, '<MainContentColumn>');
    content = content.replace(/<div className="concept-header">/g, '<ConceptHeader>');
    content = content.replace(/<div className="concept-title-row">/g, '<ConceptTitleRow>');
    content = content.replace(/<Typography className="concept-title" variant="h1">/g, '<ConceptTitle variant="h1">');
    content = content.replace(/<div className="math-card(?: [^"]+)?">/g, '<MathCard>');
    content = content.replace(/<div className="math-card-header">/g, '<MathCardHeader>');
    content = content.replace(/<Typography className="math-card-title">/g, '<MathCardTitle>');
    content = content.replace(/<div className="math-card-body">/g, '<MathCardBody>');
    content = content.replace(/<div className="sidebar-column">/g, '<SidebarColumn>');
    content = content.replace(/<div className="sidebar-card">/g, '<SidebarCard>');
    content = content.replace(/<Typography variant="h6" className="sidebar-card-title">/g, '<SidebarCardTitle variant="h6">');
    content = content.replace(/<div className="metadata-list">/g, '<MetadataList>');
    content = content.replace(/<div className="metadata-item">/g, '<MetadataItem>');
    content = content.replace(/<span className="metadata-label">/g, '<MetadataLabel>');
    content = content.replace(/<div className="metadata-value">/g, '<MetadataValue>');
    content = content.replace(/<div className="sidebar-actions">/g, '<SidebarActions>');

    // Replace closing tags
    // For this, we'll replace the tags in reverse order or use a regex to match the exact elements.
    // It's safer to do exact component matches where possible.
    
    content = content.replace(/<\/Typography>\s*(?=<\/div>\s*<FavoriteButton)/g, '</ConceptTitle>');
    content = content.replace(/<\/Typography>\s*(?=<\/div>\s*<div className="math-card-body">)/g, '</MathCardTitle>');
    content = content.replace(/<\/Typography>\s*(?=\{editModeActive &&)/g, '</MathCardTitle>');
    content = content.replace(/<\/Typography>\s*(?=<div className="metadata-list">)/g, '</SidebarCardTitle>');
    content = content.replace(/<\/Typography>\s*(?=<div className="sidebar-actions">)/g, '</SidebarCardTitle>');
    
    // We need to carefully replace the closing divs.
    // Let's rely on standard structure from these specific files.
    
    // We will do a generic approach:
    // It is simpler to manually replace in each file or just use standard `write_to_file`
    // but a node script is faster. 
    // Actually, maybe the node script approach is too brittle for closing divs.
    // Let's just rewrite the files properly by using standard `write_to_file` and reading them first.
}
