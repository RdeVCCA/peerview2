import { default as express } from "express";
import { default as nunjucks } from "nunjucks";

const app = express();
const port = 3000;

function getRandomMessage(): string {
  const messages = [
    "This is PeerView server!",
    "Hello world",
    "Please visit rdev.x10.mx!",
    "I'm thinking, hmm...",
    "我从山中来，带着兰花草，种在小园中，希望花开早。一日看三回，看得花时过，兰花却依然，苞也无一个。",
  ];
  return messages[Math.floor(Math.random() * messages.length)];
}

let env = nunjucks.configure("views", {
  autoescape: true,
  express: app,
  noCache: true,
});

app.get("/", (req, res) => {
  res.render("index.njk", { message: getRandomMessage() });
});

app.listen(port, () => {
  console.log(`Test app running on port ${port}`);
});
