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

async function queryDB<RowType>(query: string, values?: any): Promise<RowType[]> {
  return dbPool.getConnection().then(conn => {
    const rows = conn.query(query, values);
    conn.release();
    return rows;
  });
}

async function getAllNotes(): Promise<{title: string, description: string}[]> {
  return queryDB<{title: string, description: string}>("SELECT `title`, `description` FROM test_notes");
}

function renderWithBase(res: express.Response, template: string, stylesheets: string[], options?: object): void {
  res.render("base.njk", { template, stylesheets, ...options });
}

app.use(express.static("public"));

app.get("/", async (req, res) => {
  renderWithBase(res, "index.njk", ["css/index.css"], { notes: await getAllNotes() });
});

app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
