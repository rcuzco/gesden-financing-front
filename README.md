# **gesden-financing-front**

# Getting Started

## Dependencies
What you need to run this app:
* `node` and `npm` 
* Ensure you're running the latest versions Node `v6.9.0`+ and NPM `3.x.x`+

## Installing
* `npm install` to install all dependencies

### develop
```bash
# dev
npm run start

# dev with Hot Module Replacement
npm run start:hmr
```

### server
```bash

# production
# AOT
npm run server:prod
# JIT
npm run server:prod:jit
```

### test
```bash
# unit testing - test reports at 
npm run test
npm run test:coverage


# e2e testing
npm run e2e

```

### build
```bash
# build will be generated at /dist
npm run build:prod

```

### documentation
```bash
# documentation will be generated at /documentation/
npm run documentation

```

### linting
```bash
# tslint
npm run lint
# lint css
npm run lint:css

```

### Delivery 

http://ic.sanitas.dom/redmine/projects/arquitectura-front/wiki/DeliveryAngular

In this document, is explained how to configure project to deploy in the different environments (DES, PRE, PRO), create release, how to define config.json files, and process to do it

## File Structure

```
gesden-financing-front/
 ├──config/                    * our configuration
 ├──src/                       * our source files that will be compiled to javascript
 |   ├──main.ts                * our entry file for our browser environment
 |   ├──index.html             * Index.html: where we generate our index page
 |   ├──polyfills.ts           * our polyfills file
 |   ├──vendor.ts              * our vendor file
 │   ├──config.json            * Archivo de configuración con las url de api, etc     
 │   ├──app/                   * WebApp: folder
 │   │   ├──modules/           * Funtional Units separated in individual modules
 |   |   |   ├── +home         * Example Name Module
 |   |   |   |   ├── components    * module components, each component in different folder
 |   |   |   |   |   ├── specs     * Test of component
 |   |   |   |   ├── constants     * module constants
 |   |   |   |   ├── directives    * module directives,  each directive in different folder
 |   |   |   |   |   ├── specs     * Test of directive
 |   |   |   |   ├── models        * module models
 |   |   |   |   ├── services      * module Services,  shared service of module
 |   |   |   |   |   ├── specs     * Test of service
 │   │   ├──shared/            * our shared component, reusable in any module
 |   |   |   ├── components    * Shared components, each component in different folder
 |   |   |   |   ├── specs     * Test of component
 |   |   |   ├── constants     * Shared constants
 |   |   |   ├── directives    * Shared directives,  each directive in different folder
 |   |   |   |   ├── specs     * Test of directive
 |   |   |   ├── models        * Shared models
 |   |   |   ├── modules       * Shared modules, file structure like modules but this is shared module
 |   |   |   ├── services      * Shared Services,  each service in different folder
 |   |   |   |   ├── specs     * Test of service
 │   │   ├──shell/             * our bootstrap component, visual scaffold of our app
 │   │   │
 │   │   ├──app.e2e.ts         * Test e2e of app
 │   │   ├──app.module.ts      * App Module File
 │   │   ├──app.routes.ts      * App Routes File
 │   │   └──index.ts                
 │   │
 │   └──assets/                * static assets are served here
 │       ├──css/               * folder with common css
 │       ├──font/              * folder with fonts
 │       ├──i18n/              * folder of translations
 │       ├──img/               * folder with images
 │
 │
 ├──.stylelintrc               * css lint config 
 ├──angular.json               * angular configuration project
 ├──deliverable.json           * Deliverable configuration
 ├──package.json               * what npm uses to manage it's dependencies
 ├──sonar-project.properties   * configuration sonar project
 ├──tslint.json                * typescript lint config
 ├──tsconfig.json              * config that webpack uses for typescript


```

## Features included

* Build process with WebPack for development and production environment.  
    * JIT
    * AOT
* Unit Testing with Karma and Jasmine
* End-to-End testing with Protractor.
* Test reporting with HTML and file versions.
* Quality code test with TsLint and Codelyzer.
* Coverage threshold control, environnement configurable.      
