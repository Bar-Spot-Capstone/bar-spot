# Bar Spot

[![Test Server Endpoints](https://github.com/Bar-Spot-Capstone/bar-spot/actions/workflows/server-test.yml/badge.svg)](https://github.com/Bar-Spot-Capstone/bar-spot/actions/workflows/server-test.yml)

## Table of Contents

1. [What is Bar Spot ?](#what-is-bar-spot)
2. [Installation](#installation)
3. [Tests](#tests)
4. [Env variables](#env-variables)

## <a name="what-is-bar-spot"> What is Bar Spot ?</a>
Bar spot is..


## <a name="installation">Installation</a>

To install this project, you will need to have the following on your machine :

![NPM](https://img.shields.io/badge/-npm-black?style=for-the-badge&logoColor=white&logo=npm&color=CE0201)
![Node](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)

Then, run the following commands :

```bash
# Install dependencies for client-side
./front-end
npm install

# Install dependencies for back-end
./server
npm install

# Start client-side 
cd ./front-end
npm run start

# Run server-side
cd ./server
npm run start
```

The above command will start the app and watch for changes on local.

### <a name="tests"> Test </a>

To run the tests available in this project, run the following commands in each respected environment

```bash
# Run test command
./front-end
npm run test

# Run test command
./server
npm run test

```
## <a name="env-variables">Env variables</a>

You can create a `.env` file in the `./server` directory to override the default values when starting the app locally with `npm run start` command.

Environment variables are :

|        Name         |               Description               | Required | Default value |                   Limitations                    |
|:-------------------:|:---------------------------------------:|:--------:|:-------------:|:------------------------------------------------:|
|       `DB_HOST`        | Database Host |    ✅     |  ❌  |          Can't be empty string           |
|       `PORT`        | Database port |    ✅     |    ❌     | Must be a number  |
|   `DB_USERNAME`   |  Database username  |    ✅     |       ❌       |  Can't be empty string   |
|   `DB_PASSWORD`   |        Database password        |    ✅     |       ❌       |              Can't be empty string               |
|   `DB_NAME`   |           Database name          |    ✅     |  ❌  | Can't be empty string |
