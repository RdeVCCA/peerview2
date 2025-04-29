import { default as express } from "express";
import { default as nunjucks } from "nunjucks";
import { default as mariadb } from "mariadb";
import "dotenv/config"; // access env vars with process.env

const app = express();
const port = 3000;

const nunjucksEnv = nunjucks.configure("views", {
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

async function getAllNotes(): Promise<{title: string, description: string}[]> {
  return queryDatabase("SELECT `title`, `description` FROM notes ORDER BY `visits` DESC LIMIT 8");
}

async function getPixels(): Promise<{username: string, x: number, y: number, color: string}[]> {
  const query = `
    SELECT users.username, canvas_pixels.x, canvas_pixels.y, canvas_pixels.color, canvas_pixels.time
    FROM canvas_pixels
    LEFT JOIN users
    ON users.id = canvas_pixels.user_id;
  `;
  return queryDatabase(query);
}

function renderWithBase(res: express.Response, template: string, stylesheets: string[], options?: object): void {
  res.render("base.njk", { template, stylesheets, ...options });
}

app.use(express.static("public"));

app.get("/", async (req, res) => {
  renderWithBase(res, "index.njk", ["css/index.css"], { notes: await getAllNotes() });
});

app.get("/pixels", async (req, res) => {
  res.json(JSON.stringify(await getPixels()));
});

app.get("/canvas", async (req, res) => {
  renderWithBase(res, "canvas.njk", ["css/canvas.css"]);
});

app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
