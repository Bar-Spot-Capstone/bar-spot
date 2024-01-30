import express from "express"

const app: express.Application = express();
const PORT: number = 3001;

app.listen(PORT, (): void => {
    console.log(`Server is running on port ${PORT}`)
});