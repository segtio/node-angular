# QUIZZ APP

[![Travis Build Status][build-badge]][build]
[![Coverage Status][coverage-badge]][coverage]
---

**RUNNING WITH** 

[![DOCKER][docker-badge]][docker]
---

## Requirements

* [Node.js][node] >= 10
* [Angular CLI][angular-cli] >= 8
* [MongoDB][mongo-db]
* [Yarn][yarn]
* [Docker][docker] (optional)
---

## Project Structure

```shell
quizz-app/                              # → Root Application
├── docker/                             # → DockerFile images
│   └── backend/                        # → backend DockerFile
├── e2e/                                # → End to End tests Folder
├── server/                             # → backend root folder
│   ├── src/                            # → Backend Source Folder
│   │   ├── api/                        # → Backend API Folder
|   │   │   ├── controllers/            # → Controllers
|   │   │   ├── middlewares/            # → Middlewares
|   │   │   ├── models/                 # → Mongo models folder
|   │   │   ├── routes/                 # → Routes folder
|   │   │   ├── services/               # → Service layer folder
|   │   │   └── validators/             # → Payload validators
│   │   ├── config/                     # → Configuration Folder
│   │   ├── data/                       # → Seeds and Database script location
│   │   ├── docs/                       # → documentation location
│   │   └── utils/                      # → Helpers Folder
│   └── test/                           # → Backend Unit Tests
├── src/                                # → Frontend root folder
│   ├── app/                            # → Frontend source folder
│   │   └── layout/                     # → layout folder
│   ├── assets/                        
│   ├── environments/                   # → Frontend environments variables
│   └── themes/                         
├── .babelrc                            # → Babel configuration file
├── .dockerignore                       # → Files to be ingnored on docker build
├── .editorconfig                       # → Files to be ingnored on docker build
├── .env.docker                         # → Docker env file exemple
├── .env.example                        # → exemple env file
├── .eslintrc                           # → Es linter configuration
├── jest.config.js                      # → node.js dependencies and scripts
├── package.json                        # → node.js dependencies and scripts
├── README.md                           # → ME :smile:
├── tsconfig.app.json                   
├── tsconfig.json                       
├── tsconfig.spec.json                 
├── tslint.json                         # → Typescript linter definition
└── yarn.lock                           
```
---

## Project setup

### Classic Mode

Create `.env` file in the root project from `.env.example` and edit default parameters

### Docker Mode

Edit parameters in  `.env.docker` 

## Development

### Setup

* Run `yarn` from the theme directory to install dependencies

### Build commands

* `yarn start` — Compile and optimize backend & frontend
* `yarn start:dev` — launch backend & frontend in dev mode
* `yarn lint` — Run linter on backend & frontend
* `yarn build` — Compile and optimize the  backend & frontend files concurrently

## Running unit tests

Run `yarn test` to execute the unit tests via [Jest](https://jestjs.io) & [Chai](https://www.chaijs.com).

## Running end-to-end tests

Run `yarn e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Production

`Comming Soon`

## Docker launching

`Comming Soon`

## Features

- [ ] List Quizz API
- [ ] Create Quizz API
- [ ] Submit Quizz API
- [ ] List Quizz Front
- [ ] Submit Quizz Front
- [ ] Authentication
- [ ] Registration
- [ ] Integrate [Keystone 5](https://www.keystonejs.com)
- [ ] Launch With Docker

[docker-badge]: https://c7.uihere.com/icons/424/905/308/docker-logo-media-social-icon-11643f08ed30aa3544e857cc6b477212.png
[docker]: https://www.docker.com
[build-badge]: https://travis-ci.org/segtio/node-angular.svg?branch=master
[build]: https://travis-ci.org/segtio/node-angular
[coverage-badge]: https://codecov.io/gh/segtio/node-angular/branch/master/graph/badge.svg
[coverage]: https://codecov.io/gh/segtio/node-angular
[node]: http://nodejs.org/
[angular-cli]: https://github.com/angular/angular-cli
[mongo-db]: https://www.mongodb.com/download-center
[yarn]: https://yarnpkg.com/en/docs/install
[docker]: https://docs.docker.com/install/
