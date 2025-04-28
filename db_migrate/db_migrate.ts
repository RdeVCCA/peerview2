import { default as fs } from "node:fs/promises";
import { default as csv } from "csv-stringify/sync";

import * as enums from "./enums";
import * as utils from "./utils";
import * as loaders from "./loaders";
import * as oldData from "./old_data";

// every table has been migrated except for the irrelevant ones, `deletedaccounts` and `deletednotes`.
// they are not migrated over because they actually serve no functionality.

// marker interface
interface INewData {}

export class Account implements INewData {
  id: number
  email: string
  username: string
  tag: string
  points: number
  pfpLink: string
  notesVisited: number

  constructor(account: oldData.IAccount) {
    this.id = Number(account.id);
    this.email = account.email;
    this.username = account.username;
    this.tag = account.tag ?? "";
    this.points = account.points;
    this.pfpLink = account.file_name ?? "";
    this.notesVisited = account.notesvisited;
  }

  static async fromAll(): Promise<Account[]> {
    return loaders.getAccounts().then(a => a.map(x => new Account(x)));
  }
}

class Note implements INewData {
  id: number
  title: string
  description: string
  type: enums.NoteType
  link: string
  topics: string
  year: enums.Year
  term: enums.Term
  isFile: boolean
  status: enums.NoteCompletionStatus
  creationTime: string
  visits: number

  constructor(note: oldData.INote, noteTypes: utils.NoteTypesMap) {
    this.id = note.id;
    this.title = note.title;
    this.description = note.description ?? "";
    this.topics = note.topics ?? "";
    this.type = noteTypes.getNoteTypeFromId(note.typeID);
    this.creationTime = utils.toIsoDate(note.date);
    this.visits = note.visits;
    this.isFile = note.file_link === "F";
    this.link = note.link;

    switch (note.level) {
      case "Year 1": this.year = enums.Year.Sec1; break;
      case "Year 2": this.year = enums.Year.Sec2; break;
      case "Year 3": this.year = enums.Year.Sec3; break;
      case "Year 4": this.year = enums.Year.Sec4; break;
      case "JC 1"  : this.year = enums.Year.JC1; break;
      case "JC 2"  : this.year = enums.Year.JC2; break;
      default      : this.year = enums.Year.Graduated;
    }

    switch (note.term) {
      case "Term 1": this.term = enums.Term.Term1; break;
      case "Term 2": this.term = enums.Term.Term2; break;
      case "Term 3": this.term = enums.Term.Term3; break;
      case "Term 4": this.term = enums.Term.Term4; break;
      default      : this.term = enums.Term.Term1;
    }

    switch (note.status) {
      case "Planned"  : this.status = enums.NoteCompletionStatus.Planned; break;
      case "Ongoing"  : this.status = enums.NoteCompletionStatus.Ongoing; break;
      case "Completed": this.status = enums.NoteCompletionStatus.Completed; break;
      default         : this.status = enums.NoteCompletionStatus.Completed;
    }
  }

  static async fromAll(): Promise<Note[]> {
    const noteTypes = new utils.NoteTypesMap(await loaders.getNoteTypes());
    return loaders.getNotes().then(a => a.map(x => new Note(x, noteTypes)));
  }
}

/**
  * Table `usersubjects` holds info about strong and weak subjects of each user.
*/
export class UserSubject implements INewData {
  userId: number
  subject: enums.Subject
  isStrong: boolean

  constructor(userSubject: oldData.IUserSubject, subjects: utils.LegacySubjectsMap) {
    this.userId = userSubject.userID;
    this.subject = utils.subjectToEnum(
      subjects.getLegacySubjectFromId(userSubject.subjectID),
      userSubject.jcLevel === "NULL" ? null : userSubject.jcLevel
    )
    this.isStrong = userSubject.StrongWeak === 1;
  }

  static async fromAll(): Promise<UserSubject[]> {
    const subjects = new utils.LegacySubjectsMap(await loaders.getSubjects());
    return loaders.getUsersSubjects().then(a => a.map(x => new UserSubject(x, subjects)));
  }
}


class NoteSubjectJunction implements INewData {
  noteId: number
  subject: enums.Subject

  constructor(noteSubjectJunction: oldData.INotesSubjectJunction, subjects: utils.LegacySubjectsMap) {
    this.noteId = noteSubjectJunction.noteID;
    const subject = subjects.getLegacySubjectFromId(noteSubjectJunction.subjectID);
    this.subject = utils.subjectToEnum(subject, noteSubjectJunction.jcLevel === "NULL" ? null : noteSubjectJunction.jcLevel);
  }

  static async fromAll(): Promise<NoteSubjectJunction[]> {
    const subjects = new utils.LegacySubjectsMap(await loaders.getSubjects());
    return loaders.getNoteSubjectJunction().then(a => a.map(x => new NoteSubjectJunction(x, subjects)));
  }
}


class Comment implements INewData {
  noteId: number
  userId: number
  comment: string
  time: string

  constructor(comment: oldData.IComment) {
    this.noteId = comment.noteid;
    this.userId = comment.userid;
    this.comment = comment.comment;
    this.time = utils.unixTimestampToDate(comment.time);
  }

  static async fromAll(): Promise<Comment[]> {
    return loaders.getComments().then(a => a.map(x => new Comment(x)));
  }
}

/**
  * Favourite notes are merged into reading lists feature.
  * This class is to provide an intermediate data structure
  * to store data before full migration.
*/
class FavoritedNote implements INewData {
  noteId: number
  userId: number
  timeFavourited: string

  constructor(favoritedNotes:oldData.IFavouritedNote) {
    this.noteId = favoritedNotes.noteID;
    this.userId = favoritedNotes.userID;
    this.timeFavourited = favoritedNotes.dateFavourited;
  }

  static async fromAll(): Promise<FavoritedNote[]> {
    return loaders.getFavoritedNotes().then(a => a.map(x => new FavoritedNote(x)));
  }
}

class NoteCreator implements INewData {
  userId: number
  noteId: number

  constructor(noteCreator: oldData.INoteCreator) {
    this.userId = noteCreator.userID;
    this.noteId = noteCreator.noteID;
  }

  static async fromAll(): Promise<NoteCreator[]> {
    return loaders.getNoteCreators().then(a => a.map(x => new NoteCreator(x)));
  }
}

class NoteRating implements INewData {
  userId: number
  noteId: number
  rating: number

  constructor(noteRating: oldData.INoteRating) {
    this.userId = noteRating.userid;
    this.noteId = noteRating.noteid;
    this.rating = noteRating.rating;
  }

  static async fromAll(): Promise<NoteRating[]> {
    return loaders.getNoteRatings().then(a => a.map(x => new NoteRating(x)));
  }
}

/**
  * placecanvas renamed
*/
class CanvasPixel implements INewData {
  userId: number
  x: number
  y: number
  time: string
  color: string

  constructor(pixel: oldData.IPlaceCanvas, users: Account[]) {
    const id = users.find(u => u.username === pixel.Name)?.id;
    if (id === undefined) { throw new Error(`No user with username: ${pixel.Name}`); }
    this.userId = id;
    this.x = pixel.X;
    this.y = pixel.Y;
    this.time = utils.toIsoDate(pixel.Time);
    if (pixel.color.startsWith("rgb(")) {
      this.color = utils.rgbToHexCode(pixel.color);
    } else {
      this.color = pixel.color;
    }
  }

  static async fromAll(): Promise<CanvasPixel[]> {
    const accounts = await Account.fromAll();
    return loaders.getCanvasPixels().then(a => a.map(x => new CanvasPixel(x, accounts)));
  }
}

class ReadStatus implements INewData {
  userId: number
  noteId: number
  status: enums.NoteReadStatus

  constructor(status: oldData.IReadStatus) {
    this.userId = status.userID;
    this.noteId = status.noteID;
    switch (status.readStatus) {
      case 0 : this.status = enums.NoteReadStatus.Unread; break;
      case 1 : this.status = enums.NoteReadStatus.Reading; break;
      case 2 : this.status = enums.NoteReadStatus.Read; break;
      default: this.status = enums.NoteReadStatus.Reading;
    }
  }

  static async fromAll(): Promise<ReadStatus[]> {
    return loaders.getReadStatus().then(a => a.map(x => new ReadStatus(x)));
  }
}

class Report implements INewData {
  id: number
  userId: number
  noteId: number
  title: string
  description: string
  time: string

  constructor(report: oldData.IReport) {
    this.id = report.reportId;
    this.userId = report.userId;
    this.noteId = report.noteId;
    this.title = report.reason;
    this.description = report.details;
    this.time = utils.unixTimestampToDate(report.time);
  }

  static async fromAll(): Promise<Report[]> {
    return loaders.getReports().then(a => a.map(x => new Report(x)));
  }
}

class Thread implements INewData {
  id: number
  noteId: number
  title: string
  type: enums.ThreadType

  constructor(thread: oldData.INotificationThread) {
    this.id = thread.threadid;
    this.noteId = thread.noteid;
    this.title = thread.title;
    switch (thread.type) {
      case 0: this.type = enums.ThreadType.CollaborationRequest; break;
      case 1: this.type = enums.ThreadType.Comment; break;
      default: this.type = enums.ThreadType.CollaborationRequest;
    }
  }

  static async fromAll(): Promise<Thread[]> {
    return loaders.getNotificationThreads().then(a => a.map(x => new Thread(x)));
  }
}

class Message implements INewData {
  id: number
  threadId: number
  senderId: number
  receiverId: number
  message: string
  read: boolean
  date: string

  constructor(message: oldData.INotification) {
    this.id = message.notifid;
    this.threadId = message.threadid;
    this.senderId = message.sendid;
    this.receiverId = message.recvid;
    this.message = message.message;
    this.read = message.status === 1;
    this.date = utils.toIsoDate(message.date);
  }

  static async fromAll(): Promise<Message[]> {
    return loaders.getNotifications().then(a => a.map(x => new Message(x)));
  }
}

/**
  * Renamed from uploadtimeout
*/
class LastUploadTime implements INewData {
  userId: number
  time: string

  constructor(timeout: oldData.IUploadTimeout) {
    this.userId = timeout.userid;
    this.time = utils.unixTimestampToDate(timeout.lastupload);
  }

  static async fromAll(): Promise<LastUploadTime[]> {
    return loaders.getLastUploadTimes().then(a => a.map(x => new LastUploadTime(x)));
  }
}

interface INoteList {
  id: number
  noteId: number
  listId: number
}

interface IReadingList {
  id: number
  userId: number
  name: string
  listType: enums.ReadingListType
}

function mergeFavoritesAndReadStatus( favorites: FavoritedNote[], readStatuses: ReadStatus[], accounts: Account[] ): [INoteList[], IReadingList[]] {
  let readingLists = [];
  let notesLists = [];

  for (const a of accounts) {
    readingLists.push({ id: readingLists.length + 1, userId: a.id, name: "Favourites", listType: enums.ReadingListType.Favorites });
    readingLists.push({ id: readingLists.length + 1, userId: a.id, name: "Reading", listType: enums.ReadingListType.Reading });
    readingLists.push({ id: readingLists.length + 1, userId: a.id, name: "Read", listType: enums.ReadingListType.Read });
    for (const f of favorites) {
      if (f.userId === a.id) {
        notesLists.push({ id: notesLists.length + 1, noteId: f.noteId, listId: readingLists.length - 2 });
      }
    }
    for (const r of readStatuses) {
      if (r.userId === a.id) {
        if (r.status === enums.NoteReadStatus.Reading) {
          notesLists.push({ id:notesLists.length + 1, noteId: r.noteId, listId: readingLists.length - 1 });
        } else if (r.status === enums.NoteReadStatus.Read) {
          notesLists.push({ id:notesLists.length + 1, noteId: r.noteId, listId: readingLists.length });
        }
      }
    }
  }

  
  return [notesLists, readingLists];
}

function toMySQLFile(data: INewData[]): string {
  return csv.stringify([
    Object.keys(data[0]).map(k => utils.camelToSnake(k)),
    ...data.map(row => Object.values(row).map(
      datum => typeof datum === "string" ? utils.fixEncodingError(datum) : datum)
    )
  ]);
}

Account.fromAll().then(x => { fs.writeFile("data_new/users.csv", toMySQLFile(x)); });
Note.fromAll().then(x => { fs.writeFile("data_new/notes.csv", toMySQLFile(x)); });
Comment.fromAll().then(x => { fs.writeFile("data_new/comments.csv", toMySQLFile(x)); });
NoteSubjectJunction.fromAll().then(x => { fs.writeFile("data_new/notes_subjects.csv", toMySQLFile(x)); });
NoteCreator.fromAll().then(x => { fs.writeFile("data_new/notes_creators.csv", toMySQLFile(x)); });
NoteRating.fromAll().then(x => { fs.writeFile("data_new/notes_ratings.csv", toMySQLFile(x)); })
CanvasPixel.fromAll().then(x => { fs.writeFile("data_new/canvas_pixels.csv", toMySQLFile(x)) });
FavoritedNote.fromAll().then(favorites => {
  ReadStatus.fromAll().then(readStatuses => {
    Account.fromAll().then(accounts => {
      let [notesLists, readingLists] = mergeFavoritesAndReadStatus(favorites, readStatuses, accounts);
      fs.writeFile("data_new/notes_lists.csv", toMySQLFile(notesLists));
      fs.writeFile("data_new/reading_lists.csv", toMySQLFile(readingLists));
    });
  });
});
Report.fromAll().then(x => { fs.writeFile("data_new/reports.csv", toMySQLFile(x)); });
LastUploadTime.fromAll().then(x => { fs.writeFile("data_new/last_upload_times.csv", toMySQLFile(x)); });
Thread.fromAll().then(x => { fs.writeFile("data_new/threads.csv", toMySQLFile(x)); });
Message.fromAll().then(x => { fs.writeFile("data_new/messages.csv", toMySQLFile(x)); });
