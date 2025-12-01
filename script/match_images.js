import fs from 'fs';
import path from 'path';

const PRODUCTS_DIR = 'client/public/products/Parfumatica_Main_Photos';
const OUTPUT_FILE = 'client/src/lib/products.ts';

// Helper to clean strings for comparison
function cleanString(str) {
  return str.toLowerCase()
    .replace(/eau de parfum/g, '')
    .replace(/eau de toilette/g, '')
    .replace(/parfum/g, '')
    .replace(/tester/g, '')
    .replace(/ml/g, '')
    .replace(/[0-9]/g, '')
    .replace(/[^a-z\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

// Read all files from the products directory
let productFiles = [];
try {
  productFiles = fs.readdirSync(PRODUCTS_DIR);
} catch (error) {
  console.error(`Error reading directory ${PRODUCTS_DIR}:`, error);
  process.exit(1);
}

// Read the existing products.ts file
let productsContent = fs.readFileSync(OUTPUT_FILE, 'utf8');

// Extract the products array (basic regex approach)
// This assumes the file structure hasn't changed drastically
const productsRegex = /export const products: Product\[\] = \[([\s\S]*?)\];/;
const match = productsContent.match(productsRegex);

if (!match) {
  console.error("Could not find products array in products.ts");
  process.exit(1);
}

let productsArrayString = match[1];
let newProductsArrayString = productsArrayString;

// Function to find best matching image
function findBestImageMatch(productName) {
  const cleanName = cleanString(productName);
  
  // 1. Try exact match (cleaned)
  let bestMatch = productFiles.find(file => cleanString(file) === cleanName);
  
  // 2. Try partial match (file contains name)
  if (!bestMatch) {
    bestMatch = productFiles.find(file => cleanString(file).includes(cleanName));
  }
  
  // 3. Try reverse partial (name contains file parts) - simplified
  if (!bestMatch) {
      const nameParts = cleanName.split(' ');
      let maxMatches = 0;
      
      for (const file of productFiles) {
          const cleanFile = cleanString(file);
          const fileParts = cleanFile.split(' ');
          let matches = 0;
          for (const part of nameParts) {
              if (part.length > 2 && cleanFile.includes(part)) matches++;
          }
          
          if (matches > maxMatches && matches >= nameParts.length * 0.6) { // Threshold
              maxMatches = matches;
              bestMatch = file;
          }
      }
  }

  return bestMatch;
}

// Process each line/product in the string
// This is a bit hacky but avoids AST parsing for a simple script
const lines = productsArrayString.split('\n');
let updatedLines = lines.map(line => {
  if (!line.includes('{ id:')) return line;
  
  const nameMatch = line.match(/name: "(.*?)"/);
  if (!nameMatch) return line;
  
  const productName = nameMatch[1];
  const bestImage = findBestImageMatch(productName);
  
  if (bestImage) {
      // Replace image import with the direct path
      // We use a relative path from the public folder
      const imagePath = `/products/Parfumatica_Main_Photos/${bestImage}`;
      
      // Replace existing image property or add it if it's using a variable
      // This regex looks for 'image: something,'
      return line.replace(/image: .*?,/, `image: "${imagePath}",`);
  } else {
      console.log(`No image found for: ${productName}`);
      return line;
  }
});

// Reconstruct the file content
const newContent = productsContent.replace(match[1], updatedLines.join('\n'));

// Write back to file
fs.writeFileSync(OUTPUT_FILE, newContent);

console.log("Successfully updated product images!");
