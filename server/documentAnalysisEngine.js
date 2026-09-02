import fs from 'fs';
import path from 'path';
import XLSX from 'xlsx';
import pdfParse from 'pdf-parse/lib/pdf-parse.js';

/**
 * Universal AI Document Intelligence & Data Profiling Engine
 */

export async function analyzeDocument(filePath, originalFilename, mimeType) {
  const ext = path.extname(originalFilename).toLowerCase();
  const fileStats = fs.statSync(filePath);
  const fileSize = fileStats.size;

  if (ext === '.pdf' || (mimeType && mimeType.includes('pdf'))) {
    return await analyzePDFDocument(filePath, originalFilename, fileSize);
  } else if (ext === '.xlsx' || ext === '.xls' || ext === '.csv' || (mimeType && (mimeType.includes('spreadsheet') || mimeType.includes('csv')))) {
    return analyzeSpreadsheetDocument(filePath, originalFilename, fileSize, ext);
  } else {
    throw new Error(`Unsupported file type '${ext}'. Please upload PDF, XLSX, or CSV files.`);
  }
}

/**
 * PDF Document Quality & Structure Analysis
 */
async function analyzePDFDocument(filePath, fileName, fileSize) {
  const dataBuffer = fs.readFileSync(filePath);
  const pdfData = await pdfParse(dataBuffer);

  const numPages = pdfData.numpages || 1;
  const text = pdfData.text || '';
  const wordCount = text.split(/\s+/).filter(Boolean).length;
  const lineCount = text.split('\n').filter(l => l.trim().length > 0).length;

  // Structural & Quality Heuristics
  const headings = text.split('\n').filter(l => {
    const trimmed = l.trim();
    return trimmed.length > 3 && trimmed.length < 60 && (trimmed === trimmed.toUpperCase() || /^(Section|Chapter|Part|\d+\.)/i.test(trimmed));
  });

  const hasTables = /(\||	|\+{3,}|-{3,})/.test(text) || text.includes('Table ') || text.includes('Sr. No.');
  const hasExecutiveSummary = /executive summary|overview|abstract|introduction/i.test(text);
  const hasConclusion = /conclusion|summary|action plan|recommendations|references/i.test(text);

  // Missing elements detection
  const missingElements = [];
  if (!hasExecutiveSummary) missingElements.push("Executive Summary / Introduction section is missing or unlabelled.");
  if (!hasConclusion) missingElements.push("Conclusion or Actionable Recommendations section is absent.");
  if (headings.length < 2) missingElements.push("Clear hierarchical headings (H1/H2) are lacking.");
  if (wordCount < 100) missingElements.push("Document content is too sparse for detailed analysis (< 100 words).");

  // Scoring Metrics (0 to 100)
  const completeness = Math.min(100, Math.max(30, (wordCount > 300 ? 40 : 20) + (hasExecutiveSummary ? 30 : 0) + (hasConclusion ? 30 : 0)));
  const structure = Math.min(100, Math.max(20, (headings.length * 15) + (hasTables ? 25 : 10)));
  const clarity = Math.min(100, Math.max(40, wordCount > 0 ? 85 - Math.min(30, Math.floor(wordCount / 500)) : 30));
  const formatting = Math.min(100, Math.max(35, headings.length > 0 ? 85 : 50));
  const accuracy = 90; // Default high accuracy for parsed text
  const actionability = hasConclusion ? 85 : 45;

  const qualityScore = Math.round(
    (completeness * 0.25) + 
    (structure * 0.20) + 
    (clarity * 0.20) + 
    (formatting * 0.15) + 
    (actionability * 0.20)
  );

  const strengths = [];
  if (wordCount > 300) strengths.push(`Comprehensive text length (${wordCount} words across ${numPages} pages).`);
  if (hasTables) strengths.push("Contains structured tabular data formatting.");
  if (hasExecutiveSummary) strengths.push("Includes clear introductory / summary context.");
  if (headings.length > 2) strengths.push(`Well-segmented document with ${headings.length} distinct section headings.`);

  const problems = [];
  if (missingElements.length > 0) problems.push(...missingElements);
  if (!hasTables) problems.push("No data tables or structured statistical elements detected.");

  const priorityIssues = problems.slice(0, 3);

  const recommendations = [
    {
      area: "Document Structure & Hierarchy",
      currentInsight: `Found ${headings.length} headings across ${numPages} page(s).`,
      whyItMatters: "Proper document hierarchy improves readability, navigation, and executive scanability.",
      specificAction: "Add numbered section headings (e.g. 1.0 Executive Summary, 2.0 Methodology) and maintain consistent font sizing.",
      suggestedTimeframe: "Immediate Revision",
      expectedOutcome: "+15% increase in document clarity and navigation efficiency."
    },
    {
      area: "Executive Summarization",
      currentInsight: hasExecutiveSummary ? "Executive summary present." : "Executive summary section not explicitly tagged.",
      whyItMatters: "Decision-makers require quick access to core key takeaways.",
      specificAction: "Include a 3-bullet key findings box at the very top of page 1.",
      suggestedTimeframe: "Next Draft",
      expectedOutcome: "Immediate clarity for external stakeholders and evaluators."
    }
  ];

  return {
    analysisId: `DOC-${Math.floor(100000 + Math.random() * 900000)}`,
    fileName,
    fileType: 'PDF',
    fileSize,
    qualityScore,
    scoreBreakdown: {
      completeness,
      accuracy,
      structure,
      clarity,
      dataQuality: 85,
      formatting,
      actionability
    },
    summary: `Analyzed PDF document '${fileName}' (${numPages} pages, ${wordCount} words). Overall Document Quality Score: ${qualityScore}/100.`,
    strengths,
    problems,
    priorityIssues,
    recommendations,
    extractedMetadata: {
      numPages,
      wordCount,
      lineCount,
      headingsFound: headings.slice(0, 10),
      hasTables,
      hasExecutiveSummary,
      hasConclusion
    },
    tableStats: {
      tablesCount: hasTables ? 1 : 0,
      confidence: "High"
    }
  };
}

/**
 * XLSX/CSV Spreadsheet Quality & Data Profiling Analysis
 */
function analyzeSpreadsheetDocument(filePath, fileName, fileSize, ext) {
  const workbook = XLSX.readFile(filePath);
  const sheetNames = workbook.SheetNames;
  const firstSheetName = sheetNames[0];
  const worksheet = workbook.Sheets[firstSheetName];
  const rawData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

  if (!rawData || rawData.length === 0) {
    throw new Error("Spreadsheet file contains no readable data rows.");
  }

  const headerRow = rawData[0] || [];
  const rows = rawData.slice(1);
  const totalRows = rows.length;
  const totalCols = headerRow.length;

  let totalCells = totalRows * totalCols;
  let emptyCells = 0;
  let duplicateRowsCount = 0;
  const rowStrings = new Set();

  const columnAnalysis = headerRow.map((colName, colIdx) => {
    let colEmpty = 0;
    let colTypes = { number: 0, string: 0, boolean: 0, date: 0, null: 0 };
    const values = [];

    rows.forEach(r => {
      const val = r[colIdx];
      if (val === undefined || val === null || val === '') {
        colEmpty++;
        emptyCells++;
        colTypes.null++;
      } else {
        values.push(val);
        if (typeof val === 'number') colTypes.number++;
        else if (typeof val === 'boolean') colTypes.boolean++;
        else colTypes.string++;
      }
    });

    const rowStr = JSON.stringify(rows);
    if (rowStrings.has(rowStr)) {
      duplicateRowsCount++;
    } else {
      rowStrings.add(rowStr);
    }

    const missingPct = totalRows > 0 ? Math.round((colEmpty / totalRows) * 100) : 0;
    let dominantType = 'String';
    if (colTypes.number > colTypes.string) dominantType = 'Number';
    if (colTypes.boolean > colTypes.string && colTypes.boolean > colTypes.number) dominantType = 'Boolean';

    return {
      columnName: String(colName || `Column ${colIdx + 1}`),
      dominantType,
      totalCount: totalRows,
      emptyCount: colEmpty,
      missingPct,
      sampleValues: values.slice(0, 3)
    };
  });

  const completeness = Math.max(0, 100 - Math.round((emptyCells / Math.max(1, totalCells)) * 100));
  const accuracy = Math.max(0, 100 - (duplicateRowsCount * 5));
  const structure = totalCols > 1 ? 90 : 50;
  const clarity = headerRow.every(h => h && String(h).trim().length > 0) ? 95 : 60;
  const dataQuality = Math.round((completeness + accuracy) / 2);
  const formatting = 85;
  const actionability = dataQuality >= 75 ? 85 : 55;

  const qualityScore = Math.round(
    (completeness * 0.30) + 
    (accuracy * 0.25) + 
    (structure * 0.15) + 
    (clarity * 0.15) + 
    (actionability * 0.15)
  );

  const strengths = [
    `Contains ${sheetNames.length} sheet(s), ${totalRows} data rows and ${totalCols} columns.`,
    `Data header completeness rating: ${clarity}%.`,
  ];
  if (completeness >= 85) strengths.push(`High data completeness (${completeness}% populated cells).`);
  if (duplicateRowsCount === 0) strengths.push("Zero duplicate data records detected across rows.");

  const problems = [];
  if (emptyCells > 0) problems.push(`Detected ${emptyCells} missing/empty cells (${Math.round((emptyCells / totalCells)*100)}% of total grid).`);
  if (duplicateRowsCount > 0) problems.push(`Detected ${duplicateRowsCount} duplicate data rows.`);
  if (!headerRow.every(h => h)) problems.push("Some columns lack explicit header names.");

  const priorityIssues = problems.slice(0, 3);

  const recommendations = [
    {
      area: "Data Hygiene & Missing Value Handling",
      currentInsight: `Empty cells count: ${emptyCells} (${Math.round((emptyCells / Math.max(1, totalCells))*100)}%).`,
      whyItMatters: "Missing values distort statistical aggregation and automated chart rendering.",
      specificAction: "Impute default values or filter incomplete rows prior to financial/psychometric modeling.",
      suggestedTimeframe: "Before Reporting",
      expectedOutcome: "100% data integrity for analytical processing."
    },
    {
      area: "Schema Standardization",
      currentInsight: `Analyzed ${totalCols} columns across sheet '${firstSheetName}'.`,
      whyItMatters: "Explicit column headers prevent database mapping errors during automated intake.",
      specificAction: "Ensure all column headers use camelCase or snake_case without special symbols.",
      suggestedTimeframe: "Immediate",
      expectedOutcome: "Seamless database intake and zero parsing failures."
    }
  ];

  return {
    analysisId: `DOC-${Math.floor(100000 + Math.random() * 900000)}`,
    fileName,
    fileType: ext === '.csv' ? 'CSV' : 'XLSX',
    fileSize,
    qualityScore,
    scoreBreakdown: {
      completeness,
      accuracy,
      structure,
      clarity,
      dataQuality,
      formatting,
      actionability
    },
    summary: `Analyzed spreadsheet '${fileName}' (${sheetNames.length} sheets, ${totalRows} rows, ${totalCols} columns). Overall Data Quality Score: ${qualityScore}/100.`,
    strengths,
    problems,
    priorityIssues,
    recommendations,
    extractedMetadata: {
      sheetNames,
      totalRows,
      totalCols,
      totalCells,
      emptyCells,
      duplicateRowsCount,
    },
    columnAnalysis
  };
}
