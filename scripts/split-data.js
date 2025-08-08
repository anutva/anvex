import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const tableDataPath = path.join(__dirname, '../src/data/tableData.json');
const outputDir = path.join(__dirname, '../src/data');

const rawData = fs.readFileSync(tableDataPath);
const tableData = JSON.parse(rawData);

Object.keys(tableData).forEach(classKey => {
  const classData = tableData[classKey];
  
  if (Array.isArray(classData)) {
    const outputPath = path.join(outputDir, `${classKey}.json`);
    fs.writeFileSync(outputPath, JSON.stringify(classData, null, 2));
  } else {
    const classDir = path.join(outputDir, classKey);
    if (!fs.existsSync(classDir)) {
      fs.mkdirSync(classDir);
    }
    Object.keys(classData).forEach(sectionKey => {
      const sectionData = classData[sectionKey];
      const outputPath = path.join(classDir, `${sectionKey}.json`);
      fs.writeFileSync(outputPath, JSON.stringify(sectionData, null, 2));
    });
  }
});

console.log('Data splitting complete.');