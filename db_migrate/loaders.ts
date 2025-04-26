import { default as fs } from "node:fs/promises";

import * as oldData from "./old_data";

/**
  * This function will not check that the output is actually of type `Promise<T[]>`.
  * Specify the correct type `T` manually.
*/
async function getData<T>(filepath: string): Promise<T[]> {
  return fs.readFile(filepath).then(
    contents => JSON.parse(contents.toString())
  );
}

export async function getAccounts(): Promise<oldData.IAccount[]> {
  return getData("data_json/ylrdxapi_peerview_table_accounts.json");
}
export async function getUsersSubjects(): Promise<oldData.IUserSubject[]> {
  return getData("data_json/ylrdxapi_peerview_table_usersubjects.json");
}
export async function getNotes(): Promise<oldData.INote[]> {
  return getData("data_json/ylrdxapi_peerview_table_notes.json");
}
export async function getNoteSubjectJunction(): Promise<oldData.INotesSubjectJunction[]> {
  return getData("data_json/ylrdxapi_peerview_table_notesubjectjunction.json");
}
export async function getComments(): Promise<oldData.IComment[]> {
  return getData("data_json/ylrdxapi_peerview_table_comments.json");
}
export async function getFavoritedNotes(): Promise<oldData.IFavouritedNote[]> {
  return getData("data_json/ylrdxapi_peerview_table_favouritednotes.json");
}
export async function getNoteCreators(): Promise<oldData.INoteCreator[]> {
  return getData("data_json/ylrdxapi_peerview_table_notecreators.json");
}
export async function getNoteRatings(): Promise<oldData.INoteRating[]> {
  return getData("data_json/ylrdxapi_peerview_table_noteratings.json");
}
export async function getCanvasPixels(): Promise<oldData.IPlaceCanvas[]> {
  return getData("data_json/ylrdxapi_peerview_table_placecanvas.json");
}
export async function getReadStatus(): Promise<oldData.IReadStatus[]> {
  return getData("data_json/ylrdxapi_peerview_table_readstatus.json");
}
export async function getReports(): Promise<oldData.IReport[]> {
  return getData("data_json/ylrdxapi_peerview_table_reports.json");
}
export async function getLastUploadTimes(): Promise<oldData.IUploadTimeout[]> {
  return getData("data_json/ylrdxapi_peerview_table_uploadtimeout.json");
}
export async function getNotificationThreads(): Promise<oldData.INotificationThread[]> {
  return getData("data_json/ylrdxapi_peerview_table_notification_threads.json");
}
export async function getNotifications(): Promise<oldData.INotification[]> {
  return getData("data_json/ylrdxapi_peerview_table_notifications.json");
}
export async function getNoteTypes(): Promise<oldData.INoteType[]> {
  return getData("data_json/ylrdxapi_peerview_table_notetypes.json");
}
export async function getSubjects(): Promise<oldData.ISubject[]> {
  return getData("data_json/ylrdxapi_peerview_table_subjects.json");
}

