import { processCSV } from '../src/services/import.service.js';
import prisma from '../src/config/database.js';
import fs from 'fs';
import path from 'path';

const testCSVContent = `Category,Sub-category,Part No.,Datasheet Link (PDF),VDSS V,VGS V,VTH Min V,VTH Max V
Mosfet,SOT-723,PART483,https://example.com/SPN1012.pdf,4,5,,8
Mosfet,SOT-723,PART484,https://example.com/SPN1013.pdf,-,,-,10`;

const testCsvPath = path.join(process.cwd(), 'test-sample.csv');

async function runTest() {
  try {
    fs.writeFileSync(testCsvPath, testCSVContent);

    console.log('Running import...');
    const result = await processCSV(testCsvPath);
    console.log('Import result:', result);

    // Verify PART483
    const part483 = await prisma.part.findUnique({
      where: { partNo: 'PART483' },
      include: {
        PartSpec: {
          include: { SpecColumn: true }
        }
      }
    });

    console.log('\n--- PART483 SPECS ---');
    part483?.PartSpec.forEach(s => {
      console.log(`Column: ${s.SpecColumn.name} | Associated: ${s.associated} | Value: ${s.value}`);
    });
    // Expected: VDSS V=4, VGS V=5, VTH Max V=8. VTH Min V should NOT be present.

    // Verify PART484
    const part484 = await prisma.part.findUnique({
      where: { partNo: 'PART484' },
      include: {
        PartSpec: {
          include: { SpecColumn: true }
        }
      }
    });

    console.log('\n--- PART484 SPECS ---');
    part484?.PartSpec.forEach(s => {
      console.log(`Column: ${s.SpecColumn.name} | Associated: ${s.associated} | Value: ${s.value}`);
    });
    // Expected: VDSS V=null (-), VTH Min V=null (-), VTH Max V=10. VGS V should NOT be present.

  } catch (err) {
    console.error('Test failed:', err);
  } finally {
    if (fs.existsSync(testCsvPath)) fs.unlinkSync(testCsvPath);
    await prisma.$disconnect();
  }
}

runTest();
