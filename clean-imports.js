const fs = require('fs');

const files = [
  'src/pages/CategoryList.tsx',
  'src/pages/ConceptList.tsx',
  'src/pages/RecentChangesPage.tsx',
  'src/pages/SearchPage.tsx',
  'src/pages/TypeList.tsx',
  'src/pages/UserProfilePage.tsx',
];

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/CircularProgress,?\s*/g, '');
  fs.writeFileSync(file, content);
  console.log(`Cleaned ${file}`);
});
