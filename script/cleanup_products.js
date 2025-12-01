import fs from 'fs';

const FILE_PATH = 'client/src/lib/products.ts';

try {
  let content = fs.readFileSync(FILE_PATH, 'utf8');

  // Split into lines
  const lines = content.split('\n');
  const newLines = [];
  let insideProductsArray = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.trim().startsWith('export const products: Product[] = [')) {
      insideProductsArray = true;
      newLines.push(line);
      continue;
    }

    if (!insideProductsArray) {
      newLines.push(line);
      continue;
    }

    if (line.trim() === '];') {
      insideProductsArray = false;
      newLines.push(line);
      continue;
    }

    // inside products array
    if (line.trim().startsWith('//') || line.trim() === '') {
      newLines.push(line);
      continue;
    }

    // Check if it's a product line
    if (line.includes('{ id:')) {
      // Check if it uses a variable image (to be removed)
      if (line.includes('womenPerfumeImg') || line.includes('menPerfumeImg') || line.includes('unisexPerfumeImg')) {
        console.log(`Removing product line: ${line.trim()}`);
        continue;
      }

      // Check if it has the broken syntax (missing closing brace)
      if (line.trim().endsWith('.jpg",') || line.trim().endsWith('.png",') || line.trim().endsWith('.jpeg",')) {
        // Add the closing brace
        const fixedLine = line.replace(/",$/, '", },');
        newLines.push(fixedLine);
      } else {
        // It might be correct or have other issues, just push it
        // But wait, the previous script might have messed up lines even if they were correct if I'm not careful
        // Let's assume lines ending in `},` are fine.
        newLines.push(line);
      }
    } else {
      newLines.push(line);
    }
  }

  fs.writeFileSync(FILE_PATH, newLines.join('\n'));
  console.log('Successfully cleaned up products.ts');

} catch (error) {
  console.error('Error processing file:', error);
  process.exit(1);
}
