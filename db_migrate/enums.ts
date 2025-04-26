export enum Subject {
  SecCID                           = "SecCID",
  SecArt                           = "SecArt",
  SecAppreciationOfChineseCulture  = "SecAppreciationOfChineseCulture",
  SecMusic                         = "SecMusic",
  SecDigitalLiteracy               = "SecDigitalLiteracy",
  SecConversationalMalay           = "SecConversationalMalay",
  SecFoodAndConsumerEducation      = "SecFoodAndConsumerEducation",
  SecPhysicalEducation             = "SecPhysicalEducation",
  SecMathematics                   = "SecMathematics",
  SecBiology                       = "SecBiology",
  SecBiologyTalent                 = "SecBiologyTalent",
  SecChemistry                     = "SecChemistry",
  SecChemistryTalent               = "SecChemistryTalent",
  SecPhysics                       = "SecPhysics",
  SecPhysicsTalent                 = "SecPhysicsTalent",
  SecComputing                     = "SecComputing",
  SecEnglishLanguage               = "SecEnglishLanguage",
  SecEnglishLiterature             = "SecEnglishLiterature",
  SecHigherChineseLanguage         = "SecHigherChineseLanguage",
  SecChineseLiterature             = "SecChineseLiterature",
  SecGeography                     = "SecGeography",
  SecHistory                       = "SecHistory",
  SecSingaporeStudies              = "SecSingaporeStudies",
  SecBiculturalStudies             = "SecBiculturalStudies",
  JCChinaStudiesInChineseH2        = "JCChinaStudiesInChineseH2",
  JCChineseLanguageAndLiteratureH2 = "JCChineseLanguageAndLiteratureH2",
  JCEnglishLiteratureH1            = "JCEnglishLiteratureH1",
  JCEnglishLiteratureH2            = "JCEnglishLiteratureH2",
  JCEconomicsH1                    = "JCEconomicsH1",
  JCEconomicsH2                    = "JCEconomicsH2",
  JCGeographyH2                    = "JCGeographyH2",
  JCHistoryH2                      = "JCHistoryH2",
  JCTranslationH2                  = "JCTranslationH2",
  JCBiologyH2                      = "JCBiologyH2",
  JCComputingH2                    = "JCComputingH2",
  JCChemistryH1                    = "JCChemistryH1",
  JCChemistryH2                    = "JCChemistryH2",
  JCChemistryH3                    = "JCChemistryH3",
  JCFurtherMathematicsH2           = "JCFurtherMathematicsH2",
  JCPhysicsH2                      = "JCPhysicsH2",
  JCPhysicsH3                      = "JCPhysicsH3",
  JCMathematicsH1                  = "JCMathematicsH1",
  JCMathematicsH2                  = "JCMathematicsH2",
  JCMathematicsH3                  = "JCMathematicsH3",
  JCGeneralPaperH1                 = "JCGeneralPaperH1",
  JCMotherTongueH1                 = "JCMotherTongueH1",
  JCProjectWorkH1                  = "JCProjectWorkH1",
  OtherSubject                     = "OtherSubject",
  NonAcademic                      = "NonAcademic",
  Invalid                          = "Invalid",
}

export enum Year {
  Sec1 = 1, Sec2 = 2, Sec3 = 3, Sec4 = 4, JC1 = 5, JC2 = 6, Graduated = 7,
}

export enum Term {
  Term1 = 1, Term2 = 2, Term3 = 3, Term4 = 4,
}

export enum NoteCompletionStatus {
  Planned = 1, Ongoing = 2, Completed = 3,
}

export enum NoteType {
  GoogleDocument = "GoogleDocument",
  GoogleDriveFolder = "GoogleDriveFolder",
  GoogleSlides = "GoogleSlides",
  JupyterNotebook = "JupyterNotebook",
  Image = "Image",
  Video = "Video",
  Quizlet = "Quizlet",
  Notion = "Notion",
  Others = "Others",
}

export enum NoteReadStatus {
  Unread = 0, Reading = 1, Read = 2,
}

export enum ReadingListType {
  UserDefined = 0,
  Favorites = 1,
  Reading = 2,
  Read = 3,
}

export enum ThreadType {
  CollaborationRequest = "CollaborationRequest",
  Comment = "Comment",
}
