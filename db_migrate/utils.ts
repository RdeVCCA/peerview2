// import { default as buffer, isUtf8 } from "node:buffer";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

dayjs.extend(timezone);
dayjs.extend(utc);

import * as enums from "./enums";
import * as oldData from "./old_data";

/**
  * Converts an object-level pair into an enum member of either SecondarySubject or JCSubject.
  * If no level ("H#" string) is specified, then SecondarySubject is returned.
  * If `forceJC` is true, then subjects returned will be H2, or H1 if H2 subject does not exist.
*/
export function subjectToEnum(subject: string, level: string | null, forceJC?: boolean): enums.Subject {
  if (subject === "Others" || subject === "others") { return enums.Subject.OtherSubject; }
  if (forceJC) {
    switch (subject) {
      case "Math"     : return enums.Subject.JCMathematicsH2;
      case "Computing": return enums.Subject.JCComputingH2;
      case "Physics"  : return enums.Subject.JCPhysicsH2;
      case "Chemistry": return enums.Subject.JCChemistryH2;
      case "Biology"  : return enums.Subject.JCBiologyH2;
      case "Geography": return enums.Subject.JCGeographyH2;
      case "History"  : return enums.Subject.JCHistoryH2;
      case "Elit"     : return enums.Subject.JCEnglishLiteratureH2;
      case "Clit"     : return enums.Subject.JCChineseLanguageAndLiteratureH2;
      case "GP"       : return enums.Subject.JCGeneralPaperH1;
      case "Econs"    : return enums.Subject.JCEconomicsH1;
      default: console.warn(`Could not find JC subject with subject: '${subject}', level: '${level}'`);
    }
  }

  if (level === null) {
    switch (subject) {
      // secondary subjects
      case "Math"              : return enums.Subject.SecMathematics;
      case "Computing"         : return enums.Subject.SecComputing;
      case "Physics"           : return enums.Subject.SecPhysics;
      case "Chemistry"         : return enums.Subject.SecChemistry;
      case "Biology"           : return enums.Subject.SecBiology;
      case "Geography"         : return enums.Subject.SecGeography;
      case "History"           : return enums.Subject.SecHistory;
      case "BSP"               : return enums.Subject.SecBiculturalStudies;
      case "Bicultural Studies": return enums.Subject.SecBiculturalStudies;
      case "Singapore Studies" : return enums.Subject.SecSingaporeStudies;
      case "English"           : return enums.Subject.SecEnglishLanguage;
      case "Chinese"           : return enums.Subject.SecHigherChineseLanguage;
      case "Elit"              : return enums.Subject.SecEnglishLiterature;
      case "Clit"              : return enums.Subject.SecChineseLiterature;
      // subjects only offered with 1 level
      case "GP"         : return enums.Subject.JCGeneralPaperH1;
      case "CSC"        : return enums.Subject.JCChinaStudiesInChineseH2;
      case "Clit"       : return enums.Subject.JCChineseLanguageAndLiteratureH2;
      case "Geography"  : return enums.Subject.JCGeographyH2;
      case "History"    : return enums.Subject.JCHistoryH2;
      case "Translation": return enums.Subject.JCTranslationH2;
      case "Biology"    : return enums.Subject.JCBiologyH2;
      case "Computing"  : return enums.Subject.JCComputingH2;
      case "F-math"     : return enums.Subject.JCFurtherMathematicsH2;
      case "Physics"    : return enums.Subject.JCPhysicsH2;
    }
  } else if (level === "H1") {
    switch (subject) {
      case "Math"     : return enums.Subject.JCMathematicsH1; 
      case "Chemistry": return enums.Subject.JCChemistryH1; 
      case "GP"       : return enums.Subject.JCGeneralPaperH1;
      case "Econs"    : return enums.Subject.JCEconomicsH1;
      case "Elit"     : return enums.Subject.JCEnglishLiteratureH1;
    }
  } else if (level === "H2") {
    switch (subject) {
      case "Math"       : return enums.Subject.JCMathematicsH2; 
      case "F-math"     : return enums.Subject.JCFurtherMathematicsH2;
      case "Computing"  : return enums.Subject.JCComputingH2;
      case "Physics"    : return enums.Subject.JCPhysicsH2;
      case "Chemistry"  : return enums.Subject.JCChemistryH2; 
      case "Biology"    : return enums.Subject.JCBiologyH2;
      case "Geography"  : return enums.Subject.JCGeographyH2;
      case "History"    : return enums.Subject.JCHistoryH2;
      case "Econs"      : return enums.Subject.JCEconomicsH2;
      case "Elit"       : return enums.Subject.JCEnglishLiteratureH2;
      case "Clit"       : return enums.Subject.JCChineseLanguageAndLiteratureH2;
      case "CSC"        : return enums.Subject.JCChinaStudiesInChineseH2;
      case "Translation": return enums.Subject.JCTranslationH2;
    }
  } else if (level === "H3") {
    switch (subject) {
      case "Math"     : return enums.Subject.JCMathematicsH3;
      case "Physics"  : return enums.Subject.JCPhysicsH3;
      case "Chemistry": return enums.Subject.JCChemistryH3; 
    }
  }

  console.warn(`Could not find subject with subject: '${subject}', level: '${level}'`);
  return enums.Subject.Invalid;
}

export function noteTypeToEnum(noteType: string): enums.NoteType {
  switch (noteType) {
    case "Document": return enums.NoteType.GoogleDocument;
    case "Folder": return enums.NoteType.GoogleDriveFolder;
    case "Slides": return enums.NoteType.GoogleSlides;
    case "Jupyter Notebook": return enums.NoteType.JupyterNotebook;
    case "Image": return enums.NoteType.Image;
    case "Video": return enums.NoteType.Video;
    case "Flashcards": return enums.NoteType.Quizlet;
    case "Notion": return enums.NoteType.Notion;
    default: return enums.NoteType.Others;
  }
}

export class NoteTypesMap {
  pairs: { id: number, noteType: enums.NoteType }[]
  constructor(pairs: oldData.INoteType[]) {
    this.pairs = pairs.map(p => ({ id: p.typeID, noteType: noteTypeToEnum(p.type) }));
  }

  getNoteTypeFromId(id: number): enums.NoteType {
    const ret = this.pairs.find(x => x.id === id)?.noteType;
    if (ret === undefined) { throw new Error(`Invalid ID: ${id}`); }
    return ret;
  }
}


export class LegacySubjectsMap {
  pairs: { id: number, subject: string }[]
  constructor(pairs: oldData.ISubject[]) {
    this.pairs = pairs.map(p => ({ id: p.subjectID, subject: p.subjectName }));
  }

  getLegacySubjectFromId(id: number): string {
    const ret = this.pairs.find(x => x.id === id)?.subject;
    if (ret === undefined) { throw new Error(`Invalid ID: ${id}`); }
    return ret;
  }
}

export function unixTimestampToDate(unix: number): string {
  return dayjs.unix(unix).tz("Asia/Singapore").format();
}

export function toIsoDate(date: string): string {
  return dayjs(date).utc(true).tz("Asia/Singapore").format();
}

export function rgbToHexCode(rgb: string): string {
  const values = rgb.substring(4, rgb.length - 1).split(", ");
  let r = Number(values[0]).toString(16);
  if (r.length === 1) { r = `0${r}`; }
  let g = Number(values[1]).toString(16);
  if (g.length === 1) { g = `0${g}`; }
  let b = Number(values[2]).toString(16);
  if (b.length === 1) { b = `0${b}`; }
  return `#${r}${g}${b}`;
}

export function camelToSnake(str: string): string {
  return str.replace(/(([a-z])(?=[A-Z][a-zA-Z])|([A-Z])(?=[A-Z][a-z]))/g,'$1_').toLowerCase();
}

export function fixEncodingError(stringWithError: string): string {
  let conversionTable: Record<string, number> = {
    "€": 0x80, // U+20AC
    "‚": 0x82, // U+201A
    "ƒ": 0x83, // U+0192
    "„": 0x84, // U+201E
    "…": 0x85, // U+2026
    "†": 0x86, // U+2020
    "‡": 0x87, // U+2021
    "ˆ": 0x88, // U+02C6
    "‰": 0x89, // U+2030
    "Š": 0x8A, // U+0160
    "‹": 0x8B, // U+2039
    "Œ": 0x8C, // U+0152
    "Ž": 0x8E, // U+017D
    "‘": 0x91, // U+2018
    "’": 0x92, // U+2019
    "“": 0x93, // U+201C
    "”": 0x94, // U+201D
    "•": 0x95, // U+2022
    "–": 0x96, // U+2013
    "—": 0x97, // U+2014
    "˜": 0x98, // U+02DC
    "™": 0x99, // U+2122
    "š": 0x9A, // U+0161
    "›": 0x9B, // U+203A
    "œ": 0x9C, // U+0153
    "ž": 0x9E, // U+017E
    "Ÿ": 0x9F  // U+0178
  };

  for (let i = 0x00; i <= 0x7F; i++) {
    conversionTable[String.fromCharCode(i)] = i;
  }

  for (let i = 0x80; i <= 0x9F; i++) {
    if (!(conversionTable?.[String.fromCharCode(i)])) {
      conversionTable[String.fromCharCode(i)] = i;
    }
  }

  for (let i = 0xA0; i <= 0xFF; i++) {
    conversionTable[String.fromCharCode(i)] = i;
  }

  // the string is supposed to be interpreted as cp1252, not latin1.
  // the difference is that cp1252 fills up some reserved bytes in latin1
  // with usable symbols. node.js cannot handle cp1252, only the similar latin1.
  // thus we replace the symbols first.
  let buf = Buffer.from(stringWithError.split("").map(x => {
    if (Object.keys(conversionTable).find(k => k === x) !== undefined) {
      return conversionTable[x];
    } else {
      throw new Error(`Unable to map character ${x} in ${stringWithError} to a Windows-1252 character`);
    }
  }));
  return buf.toString("utf8");
}
