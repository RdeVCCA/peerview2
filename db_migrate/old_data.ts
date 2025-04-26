export interface IAccount {
  id: number // integer
  email: string
  username: string // may have encoding error
  /** @deprecated */
  pfpcolor: string // hex code, lowercase
  /** @deprecated */
  pfptextcolor: string // hex code, both lowercase and uppercase
  /** @deprecated */
  badsubjects: string | null // list of subjects stored as string separated by '@#'. either NULL or starts with '@#'
  /** @deprecated */
  goodsubjects: string | null // same as badsubjects, but value could also be string literal 'NULL'
  /** @deprecated */
  year: string | null // NULL, 'Year 1', 'Year 2', 'Year 3', 'Year 4', 'Y4', 'JC1', 'JC 1', 'JC2', 'JC 2' or 'Other'
  /** @deprecated */
  school: string | null // NULL or 'River Valley High School'
  /** @deprecated */
  class: string | null // NULL or arbitrary string with barely any structure.
  tag: string | null // NULL, 'Owner', 'Supporter' or 'Beta'
  /** @deprecated */
  notesno: number // integer, mostly 0
  /** @deprecated */
  avgrating: number // float, mostly 0
  /** @deprecated */
  popularity: number // int, mostly 0, could be negative
  notesvisited: number // int, mostly 0
  /** @deprecated */
  tries: number // int, mostly 0
  /** @deprecated */
  lockeduntil: string // literal string 'NULL'
  points: number // int, mostly 0, could be negative
  /** @deprecated */
  prevpointalloc: number // int, mostly 0
  file_name: string | null // NULL or string, mostly begins with 'https://lh3.googleusercontent.com/a/', some begin with 'pfpuploads/'
}

export interface IComment {
  noteid: number // int
  comment: string // could contain encoding error, or html elements (attempted XSS)
  userid: number // int, could be 0 (invalid user)
  time: number // int, UNIX timestamp
}

export interface IDeletedAccount {
  userid: number // int
  email: string
}

export interface IFavouritedNote {
  noteID: number // int
  userID: number // int
  dateFavourited: string // YYYY-mm-dd HH:MM:SS format
}

/**
  * @deprecated
  * It is very likely that this database has nothing to do with PeerView, but instead used
  * as part of a game that was hosted on peerview.x10.mx.
*/
export interface IGameLevels {
  id: number // int,
  userid: number // int
  data: string // JSON
  dimensions: string // JSON
  name: string // 'Testing'
  date: string // YYYY-mm-dd format (no time)
}

/**
  * @deprecated
  * Made as celebration for Ryan Koh's performance and likely has nothing to do with PeerView.
*/
export interface IKorkor {
  num: number // int
}

/**
  * @deprecated
  * Not clear what this database is used for.
*/
export interface IMeme {
  userID: number // int
  timeGamed: number // int
  lastActive: string // either a date in the format YYYY-mm-dd HH:MM:SS, or string literal 'NULL'
}

export interface INoteCreator {
  userID: number // int
  noteID: number // int
}

export interface INoteRating {
  noteid: number // int
  userid: number // int
  rating: number // float, always a multiple of 0.5, and in range 0.5 <= x <= 5.0
  dateRated: string // YYYY-mm-dd HH:MM:SS format
}

export interface INote {
  id: number // int
  title: string // may contain encoding error
  link: string // either a website link or a file path
  description: string | null // may contain encoding error
  subject: string // comma-separated values of 'Biology', 'Chemistry', 'Chinese', 'Clit', 'Computing', 'Elit', 'English', 'Geography', 'History', 'Math', 'Phyiscs', 'Singapore Studies', 'Others'. can also be 'others' or string literal 'NULL'
  term: string // either 'Term 1', 'Term 2', 'Term 3' or 'Term 4'
  /** @deprecated */
  type: string | null // either 'Document', 'Google Document', 'Google Drive Folder', 'Google Slides', 'Jupyter Notebook', 'Others', 'Photos', 'Quizlet' or NULL
  typeID: number // int, 1 = google document, 2 = google drive folder, 3 = google slides, 4 = jupyter notebook, 5 = photos, 6 = video, 7 = others, 8 = quizlet, 9 = notion. defined in table `notetypes`
  topics: string | null // user defined, no structure, may have encoding error
  /** @deprecated */
  creator: string | null // comma separated list of usernames, leading and trailing spaces around commas are inconsistent, may have encoding error
  status: string // one of 'Planned', 'Ongoing' or 'Completed'
  /** @deprecated */
  email: string // may not be a valid email
  date: string // YYYY-mm-dd format (no time)
  level: string // one of 'Year 1', 'Year 2', 'Year 3', 'Year 4', 'JC 1' or 'JC 2'
  visits: number // int, may be negative
  /** @deprecated */
  total_rating: number // float, always a multiple of 0.5
  /** @deprecated */
  people_rated: number // int
  /** @deprecated */
  comments: string | null // either NULL or a string beginning with and separated by '@#!%!@@%@#!%!@%@'
  /** @deprecated */
  multiplier: number // float
  /** @deprecated */
  image: string | null // could be NULL, 'null', 'undefined' or an actual link
  file_link: string // either 'F' or 'L'
}

/**
  * @deprecated
  * Hundreds of tables have the name notes{n} where {n} is some number.
  * These tables are already deprecated.
*/
export interface INoteN {
  id: number // int
  type: string // either 'Favourites', 'My Notes', 'Ratings' or 'Reading'
  rating: string // either string literal 'NULL' or can be parsed into a float (a multiple of 0.5 and 0.5 <= x <= 5.0)
}

/**
  * @deprecated
  * Some tables have the name notes{n}notif where {n} is some number.
  * These tables are (probably) already deprecated.
  * There is also the table notesnotif.
  * None of these tables have any values.
*/
export interface INotesNotif {
  sendrecv: any
  fromto: any
  email: any
  message: any
  status: any
  desc: any
  date: any
}

export interface INotesSubjectJunction {
  noteID: number // int
  jcLevel: string // 'H1' (presumably), 'H2', 'H3' or string literal 'NULL'
  subjectID: number // int
}

export interface INoteType {
  typeID: number // int
  type: string
}

export interface INotificationThread {
  threadid: number // int
  title: string // string, seems to be user-generated
  noteid: number // int, could be 0 (invalid)
  type: number // int, either 0 or 1
}

export interface INotification {
  notifid: number // int
  sendid: number // int
  recvid: number // int
  message: string // many contain encoding errors
  status: number // int, either 0 or 1
  date: string // YYYY-mm-dd HH:MM:SS format
  threadid: number // int
}

export interface IPlaceCanvas {
  Name: string
  X: number // int
  Y: number // int
  Time: string // YYYY-mm-dd HH:MM:SS format
  color: string // either hex code (lowercase) or 'rgb({r}, {g}, {b})' where {r}, {g}, {b} are integers from 0 <= x <= 255
}

/**
  * @deprecated
  * It is very likely that this database has nothing to do with PeerView, but instead used
  * as part of a game that was hosted on peerview.x10.mx.
*/
export interface IPublishedLevel {
  id: number // int
  levelid: number // int
  userid: number // int
  data: string // JSON
  dimensions: string // JSON
  date: string // YYYY-mm-dd format (no time)
  name: string // 'Testing'
  solution: string // JSON
}

export interface IReadStatus {
  userID: number // int
  noteID: number // int
  readStatus: number // int, 0, 1, or 2
}

export interface IReport {
  reportId: number // int
  noteId: number // int
  userId: number // int
  reason: string
  details: string // user-generated
  time: number // UNIX timestamp
}

export interface ISubject {
  subjectID: number // int
  subjectName: string
}

export interface IToken {
  tokenid: number // int
  token: string
  userid: number // int
}

export interface IUploadTimeout {
  userid: number // int
  lastupload: number // UNIX timestamp
}

export interface IUserSubject {
  userID: number // int
  subjectID: number // int
  jcLevel: string // either 'H1', 'H2', 'H3' or string literal 'NULL'
  StrongWeak: number // int, either 0 or 1
}
