import { default as express } from "express";
import { default as nunjucks } from "nunjucks";
// import { default as mariadb } from "mariadb";
import "dotenv/config"; // access env vars with process.env

import * as db from "./backend/database/database";

const app = express();
const port = 3000;

const nunjucksEnv = nunjucks.configure("views", {
  autoescape: true,
  express: app,
  noCache: true,
});

app.use(express.static("public"));

app.get("/", async (req, res) => {
  res.render("index.njk", {
    topNotes: await db.Note.topNotes(5),
    newestNotes: await db.Note.newestNotes(5),
    users: Math.floor(await db.User.count() / 100) * 100,
    notes: Math.floor(await db.Note.count() / 100) * 100,
  });
});

app.get("/pixels", async (req, res) => {
  res.json(await db.CanvasPixel.all());
});

app.get("/canvas", async (req, res) => {
  res.render("canvas.njk", { pixels: await db.CanvasPixel.all() });
});

app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
