const fs = require('fs');

function cleanFile(filePath, importsToRemove) {
  let content = fs.readFileSync(filePath, 'utf8');
  importsToRemove.forEach(imp => {
    // Basic regex to remove the named import
    let re = new RegExp(`\\b${imp}\\b,?`, 'g');
    content = content.replace(re, '');
  });
  
  // Clean empty import braces like import { } from '...'
  content = content.replace(/import\s*\{\s*\}\s*from\s*['"][^'"]+['"];?/g, '');
  // Clean empty lines
  content = content.replace(/\n{3,}/g, '\n\n');
  
  fs.writeFileSync(filePath, content);
  console.log(`Cleaned ${filePath}`);
}

cleanFile('src/pages/NodePage.tsx', [
  'CommentIcon', 'HistoryIcon', 'ArrowBackIcon', 'Button', 'Link', 'Switch', 'FormControlLabel', 'ReportIssueButton',
  'SidebarColumn', 'SidebarCard', 'SidebarCardTitle', 'MetadataList', 'MetadataItem', 'MetadataLabel', 'MetadataValue', 'SidebarActions'
]);

cleanFile('src/pages/SearchPage.tsx', [
  'Chip', 'TextField', 'Button', 'Stack', 'motion', 'SearchIcon', 'FilterListIcon', 'SearchOffIcon'
]);

cleanFile('src/pages/UserProfilePage.tsx', [
  'Avatar', 'Button', 'Chip', 'TextField', 'MenuItem', 'Stack', 'IconButton', 'i18n'
]);
