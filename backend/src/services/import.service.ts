import fs from 'fs';
import csvParser from 'csv-parser';
import prisma from '../config/database.js';

export const processCSV = async (filePath: string) => {
  const results: any[] = [];
  let headers: string[] = [];
  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csvParser({ separator: "\t", }))
      .on('headers', (headerList: string[]) => {
        headers = headerList;
      })
      .on('data', (data: any) => { results.push(data); })
      .on('end', async () => {
        try {
          const importResult = await importDataToDb(headers, results);
          resolve(importResult);
        } catch (error) {
          reject(error);
        }
      })
      .on('error', (error: any) => {
        console.error("Error processing CSV:", error);
        reject(error);
      });
  });
};

const importDataToDb = async (headers: string[], rows: any[]) => {
  // First 4 columns are standard: Category, Sub-category, Part No., Datasheet Link (PDF)
  // Everything else is a spec column
  const standardCols = ['Category', 'Sub-category', 'Part No.', 'Datasheet Link (PDF)'];
  const specColumnsStr = headers.filter(h => !standardCols.includes(h) && h.trim() !== '');

  let rowsProcessed = 0;
  let rowsFailed = 0;
  const errors: string[] = [];

  // 1. Warm up Spec Columns cache
  const existingSpecCols = await prisma.specColumn.findMany();
  const specColumnMap = new Map<string, number>();
  for (const col of existingSpecCols) {
    specColumnMap.set(col.name, col.id);
  }

  // Create any missing spec columns upfront
  for (const colName of specColumnsStr) {
    if (!specColumnMap.has(colName)) {
      try {
        const specCol = await prisma.specColumn.upsert({
          where: { name: colName },
          update: {},
          create: { name: colName },
        });
        specColumnMap.set(colName, specCol.id);
      } catch (err: any) {
        console.error(`Error warming spec column ${colName}:`, err.message);
      }
    }
  }

  // 2. Warm up Categories and Subcategories caches to minimize DB queries
  const existingCategories = await prisma.category.findMany();
  const categoryMap = new Map<string, number>();
  for (const cat of existingCategories) {
    categoryMap.set(cat.name, cat.id);
  }

  const existingSubCategories = await prisma.subCategory.findMany();
  const subCategoryMap = new Map<string, number>(); // key: `${categoryId}_${subcategoryName}`
  for (const sub of existingSubCategories) {
    subCategoryMap.set(`${sub.categoryId}_${sub.name}`, sub.id);
  }

  console.log(`Processing ${rows.length} rows...`);

  // Process rows sequentially without wrapping in a massive transaction.
  // This allows try/catch to correctly capture and handle individual row failures,
  // prevents transaction timeout errors, and is extremely fast due to our in-memory cache!
  let flag = 0
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];

    // Skip empty row indicators or whitespace placeholders
    if (!row['Category'] || row['Category'] == '' || (typeof row === 'string' && row.trim() === '')) {
      console.log("skiped")
      if (flag >= 5) break; // if there is continous blank space b/w the row or the datta then it will stop to propeces and only the
      flag++
      continue;
    }

    const categoryName = row['Category']?.trim();
    const subCategoryName = row['Sub-category']?.trim();
    const partNo = row['Part No.']?.trim();
    const datasheetUrl = row['Datasheet Link (PDF)']?.trim() || '';

    if (!categoryName || !subCategoryName || !partNo) {
      // Skip completely empty rows, or mark as failed if there's partial content
      const hasSomeContent = Object.values(row).some(v => typeof v === 'string' && v.trim() !== '');
      if (hasSomeContent) {
        rowsFailed++;
        errors.push(`Row ${i + 1}: Missing required Part No, Category, or Sub-Category.`);
      }
      continue;
    }

    try {
      // Get or Create Category if the category is not prevents then it will create new
      let categoryId = categoryMap.get(categoryName);
      if (!categoryId) {
        const category = await prisma.category.upsert({
          where: { name: categoryName },
          update: {},
          create: { name: categoryName },
        });
        categoryId = category.id;
        categoryMap.set(categoryName, categoryId);
      }

      // Get or Create SubCategory
      const subCatKey = `${categoryId}_${subCategoryName}`;
      let subCategoryId = subCategoryMap.get(subCatKey);
      if (!subCategoryId) {
        const subCategory = await prisma.subCategory.upsert({
          where: {
            categoryId_name: {
              categoryId: categoryId,
              name: subCategoryName,
            },
          },
          update: {},
          create: {
            name: subCategoryName,
            categoryId: categoryId,
          },
        });
        subCategoryId = subCategory.id;
        subCategoryMap.set(subCatKey, subCategoryId);
      }

      // Upsert Part
      const part = await prisma.part.upsert({
        where: { partNo },
        update: {
          datasheetUrl,
          subCategoryId,
        },
        create: {
          partNo,
          datasheetUrl,
          subCategoryId,
        },
      });

      // Prepare and Upsert PartSpecs
      for (const colName of specColumnsStr) {
        const rawValue = row[colName];
        if (rawValue === undefined || rawValue.trim() === '') {
          continue;
        }

        const associated = true;
        const value = rawValue.trim() === '-' ? null : rawValue.trim();
        const specColumnId = specColumnMap.get(colName);

        if (specColumnId === undefined) {
          continue;
        }

        await prisma.partSpec.upsert({
          where: {
            partId_specColumnId: {
              partId: part.id,
              specColumnId,
            },
          },
          update: {
            associated,
            value,
          },
          create: {
            partId: part.id,
            specColumnId,
            associated,
            value,
          },
        });
      }
      rowsProcessed++;
    } catch (err: any) {
      rowsFailed++;
      errors.push(`Row ${i + 1}: ${err.message}`);
    }
  }

  return { rowsProcessed, rowsFailed, errors };
};
