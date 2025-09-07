import { default as mariadb } from "mariadb";

const dbPool = mariadb.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  trace: true,
});

class DBPool {
  private static readonly dbPool = dbPool;

  static async queryAll<T>(sql: string, values?: any[]): Promise<T[]> {
    const conn = await this.dbPool.getConnection();
    const result = await conn.query<T[]>({ sql, rowsAsArray: true, decimalAsNumber: true, bigIntAsNumber: true }, values);
    conn.release();
    return result;
  }

  static async queryOne<T>(sql: string, values?: any[]): Promise<T | null> {
    const conn = await this.dbPool.getConnection();
    const result = await conn.query<T[]>({ sql, rowsAsArray: true, decimalAsNumber: true, bigIntAsNumber: true }, values);
    conn.release();
    if (result.length === 0) {
      return null;
    }
    return result[0];
  }

  // for the next 2 functions:
  // rowsAsArray is true so that the query can return an array,
  // which is easier to unpack to feed into the constructor of a class.
  // the problem is that there is no guarantee that the query result is actually of type
  // ConstructorParameters<T>[], and if it isn't, then invalid objects would be created.
  static async queryAllIntoType<T extends new (...args: any[]) => any>(sql: string, values?: any[]): Promise<ConstructorParameters<T>[]> {
    const conn = await this.dbPool.getConnection();
    const result = await conn.query<ConstructorParameters<T>[]>({ sql, rowsAsArray: true, decimalAsNumber: true, bigIntAsNumber: true }, values);
    conn.release();
    return result;
  }

  static async queryOneIntoType<T extends new (...args: any[]) => any>(sql: string, values?: any[]): Promise<ConstructorParameters<T> | null> {
    const conn = await this.dbPool.getConnection();
    const result = await conn.query<ConstructorParameters<T>[]>({ sql, rowsAsArray: true, decimalAsNumber: true, bigIntAsNumber: true }, values);
    conn.release();
    if (result.length === 0) {
      return null;
    }
    return result[0];
  }
}

export class User {
  constructor(
    readonly id: number,
    readonly email: string,
    readonly username: string,
    readonly tag: string,
    readonly points: number,
    readonly pfpLink: string,
    readonly notesVisited: number,
  ) {}

  static async fromId(id: number): Promise<User | null> {
    const user = await DBPool.queryOneIntoType<typeof User>("SELECT * FROM users WHERE id = ?", [id]);
    if (user === null) { return null; }
    return new User(...user);
  }

  static async count(): Promise<number> {
    const count = await DBPool.queryOne<[number]>("SELECT COUNT(*) FROM users") as [number]; // cannot be null
    return count[0];
  }
}

export class Note {
  constructor(
    readonly id: number,
    readonly title: string,
    readonly description: string,
    readonly type: "GoogleDocument" | "GoogleDriveFolder" | "GoogleSlides" | "JupyterNoteook" | "Image" | "Video" | "Quizlet" | "Notion" | "Others",
    readonly link: string,
    readonly topics: string,
    readonly year: 1 | 2 | 3 | 4 | 5 | 6 | 7,
    readonly term: 1 | 2 | 3 | 4,
    readonly isFile: boolean,
    private readonly _status: 1 | 2 | 3,
    private readonly _creationDate: string,
    readonly visits: number,
  ) {}

  public get status() {
    switch (this._status) {
      case 1: return "Planned";
      case 2: return "Ongoing";
      case 3: return "Completed";
    }
  }

  public get creationDate() {
    return new Date(this._creationDate);
  }

  static async fromId(id: number): Promise<Note | null> {
    const note = await DBPool.queryOneIntoType<typeof Note>("SELECT * FROM notes WHERE id = ?", [id]);
    if (note === null) { return null; }
    return new Note(...note);
  }

  static async topNotes(limit: number): Promise<Note[]> {
    const notes = await DBPool.queryAllIntoType<typeof Note>("SELECT * FROM notes ORDER BY visits DESC LIMIT ?", [limit]);
    return notes.map(note => new Note(...note));
  }

  static async newestNotes(limit: number): Promise<Note[]> {
    const notes = await DBPool.queryAllIntoType<typeof Note>("SELECT * FROM notes ORDER BY creationTime DESC LIMIT ?", [limit]);
    return notes.map(note => new Note(...note));
  }

  static async count(): Promise<number> {
    const count = await DBPool.queryOne<[number]>("SELECT COUNT(*) FROM notes") as [number]; // cannot be null
    return count[0];
  }
}

export class CanvasPixel {
  constructor(
    readonly x: number,
    readonly y: number,
    readonly username: string,
    readonly color: string,
  ) {}

  static async all() {
    const query = `
      SELECT canvasPixels.x, canvasPixels.y, users.username, canvasPixels.color
      FROM canvasPixels
      LEFT JOIN users
      ON users.id = canvasPixels.userId
      ORDER BY canvasPixels.y, canvasPixels.x;
    `;

    //                                     x       y       username color
    const rawData = await DBPool.queryAll<[number, number, string,  string]>(query);

    let cur = 0;
    let ret: { username: string | null, color: string | null }[] = [];
    for (let y = 0; y < 50; y++) {
      for (let x = 0; x < 50; x++) {
        if (cur < rawData.length && rawData[cur][0] === x && rawData[cur][1] === y) {
          ret.push({ username: rawData[cur][2], color: rawData[cur][3] });
          cur += 1;
        } else {
          ret.push({ username: null, color: null });
        }
      }
    }
    return ret;
  }
}
