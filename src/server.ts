import app from "./app";

const PORT = process.env.PORT;

app.listen(PORT, () => console.log(`\n✔ Server started at http://localhost:${PORT}\n`));