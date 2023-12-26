import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { html } from "@elysiajs/html";
let url: string;
const PORT = process.env.PORT || 3000;
const app = new Elysia();
app.use(cors());
app.use(html());
app.onParse(({ request, contentType }) => {
  console.log("Request " + request);
  console.log("Content Type: " + contentType);
  if (contentType === "application/custom-type") return request.text();
});
app.post("/search", async (e) => {
  url = e.body.search;
  let respone = await fetch(e.body.search);
  let html = await respone.text();
  let results = html.replaceAll("https://", "http://localhost:3000/");
  if (respone.ok == true) return results;
  if (respone.ok == false) {
    console.log("Running A False statement");
    let url = "https:/" + e.path;
    console.log(url);
    respone = await fetch(url);
    let files = await respone.text();
    let results = files.replaceAll("https://", "http://localhost:3000/");
    return results;
  }
});
app.get("/*", async (e) => {
  let data = url + e.path;
  console.log(data);
  let respone = await fetch(data);
  console.log(respone.ok);
  let files = await respone.text();
  let results = files.replaceAll("https://", "http://localhost:3000/");
  if (respone.ok == true) return results;
  if (respone.ok == false) {
    console.log("Running A False statement");
    let url = "https:/" + e.path;
    console.log(url);
    respone = await fetch(url);
    let files = await respone.text();
    let results = files.replaceAll("https://", "http://localhost:3000/");
    return results;
  }
});
app.post("/*", async (e) => {
  let data = url + e.path;
  console.warn(`POST Request: ${data}`);
  let respone = await fetch(data, {
    method: "POST",
    body: e.body,
    header: { "Content-Type": "*/*" },
  });
  return 1;
});
Bun.serve({
  port: 8080,
  fetch(req) {
    return new Response("Port");
  },
  tls: {
    key: Bun.file("./key.pem"),
    cert: Bun.file("./cert.pem"),
  },
});
app.listen(PORT);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
