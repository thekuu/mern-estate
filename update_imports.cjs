const fs = require('fs');
const path = require('path');

const files = [
  'client/src/pages/Home.jsx',
  'client/src/pages/Search.jsx',
  'client/src/pages/Profile.jsx',
  'client/src/pages/SignUp.jsx',
  'client/src/pages/UpdateListing.jsx',
  'client/src/pages/CreateListing.jsx',
  'client/src/pages/SignIn.jsx',
  'client/src/pages/Listing.jsx',
  'client/src/components/Contact.jsx',
  'client/src/components/OAuth.jsx'
];

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  let depth = file.split('/').length - 3; // client/src/pages/Home.jsx -> length 4, 4-3 = 1 -> '../'
  // actually client/src/pages/Home.jsx length is 4. depth=1 -> ../utils/apiFetch.
  // client/src/components/Contact.jsx length is 4. depth=1 -> ../utils/apiFetch.
  let importPath = depth === 1 ? '../utils/apiFetch' : '../../utils/apiFetch';
  if (!content.includes('import { apiFetch }')) {
    // add import at top
    content = `import { apiFetch } from '${importPath}';\n` + content;
    fs.writeFileSync(file, content);
  }
}
