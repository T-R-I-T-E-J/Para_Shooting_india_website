const fs = require('fs');
const files = [
  'apps/api/src/certificates/certificates.controller.ts',
  'apps/api/src/certificates/certificates.service.ts',
  'apps/api/src/results/services/certificate-pdf.service.ts'
];

for (const file of files) {
  let code = fs.readFileSync(file, 'utf8');
  // Replace string '\`' with '`'
  code = code.replace(/\\`/g, '`');
  // Replace string '\${' with '${'
  code = code.replace(/\\\$\{/g, '${');
  fs.writeFileSync(file, code);
  console.log(`Fixed ${file}`);
}
