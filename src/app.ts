import { default as express } from "express";
import { default as nunjucks } from "nunjucks";
import { default as mariadb } from "mariadb";
import "dotenv/config"; // access env vars with process.env

const app = express();
const port = 3000;

const nunjucksEnv = nunjucks.configure("src/views", {
  autoescape: true,
  express: app,
  noCache: true,
});

const dbPool = mariadb.createPool({
  host:process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  trace: true,
});

async function queryDatabase<RowType>(query: string, values?: any): Promise<RowType[]> {
  return dbPool.getConnection().then(conn => {
    const rows = conn.query(query, values);
    conn.release();
    return rows;
  });
}

async function getTopNotes(): Promise<{title: string, description: string, visits: string}[]> {
  return queryDatabase("SELECT `title`, `description`, `visits` FROM notes ORDER BY `visits` DESC LIMIT 5");
}

async function getNewestNotes(): Promise<{title: string, description: string, creation_time: string}[]> {
  return queryDatabase("SELECT `title`, `description`, `creation_time` FROM notes ORDER BY `creation_time` DESC LIMIT 5");
}

async function getNoteCount(): Promise<number> {
  return queryDatabase<{count: BigInt}>("SELECT COUNT(*) AS count FROM notes").then(
    x => Math.floor(Number(x[0].count) / 100) * 100
  );
}

async function getUserCount(): Promise<number> {
  return queryDatabase<{count: BigInt}>("SELECT COUNT(*) AS count FROM users").then(
    x => Math.floor(Number(x[0].count) / 100) * 100
  );
}

async function getPixels(): Promise<{username: string | null, color: string | null}[]> {
  const query = `
    SELECT users.username, canvas_pixels.x, canvas_pixels.y, canvas_pixels.color
    FROM canvas_pixels
    LEFT JOIN users
    ON users.id = canvas_pixels.user_id
    ORDER BY canvas_pixels.y, canvas_pixels.x;
  `;
  const rawData = await queryDatabase<{x: number, y: number, username: string, color: string}>(query);

  let cur = 0;
  let ret = [];
  for (let y = 0; y < 50; y++) {
    for (let x = 0; x < 50; x++) {
      if (cur < rawData.length && rawData[cur].x === x && rawData[cur].y === y) {
        ret.push({ username: rawData[cur].username, color: rawData[cur].color });
        cur += 1;
      } else {
        ret.push({ username: null, color: null });
      }
    }
  }
  return ret;
}

function renderWithBase(res: express.Response, template: string, stylesheets: string[], options?: object): void {
  res.render("base.njk", { template, stylesheets, ...options });
}

app.use(express.static("public"));

app.get("/", async (req, res) => {
  renderWithBase(res, "index.njk", ["css/index.css"], {
    topNotes: await getTopNotes(),
    newestNotes: await getNewestNotes(),
    users: await getUserCount(),
    notes: await getNoteCount(),
  });
});

app.get("/pixels", async (req, res) => {
  res.json(JSON.stringify(await getPixels()));
});

app.get("/canvas", async (req, res) => {
  renderWithBase(res, "canvas.njk", ["css/canvas.css"], { pixels: await getPixels() });
});

app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
