# CinemAngular

Sito cinema basato sulle API di [TMDB](https://www.themoviedb.org): film, serie TV, persone e ricerca.

## Credenziali TMDB

Il token sta in `src/environments/environment.ts`: è l'**API Read Access Token (v4)**,
che si ottiene su themoviedb.org in Impostazioni account → API.

Viene inviato come `Authorization: Bearer <token>` in ogni chiamata, come previsto dalla
specifica; ad aggiungerlo è `src/app/core/tmdb-auth-interceptor.ts`.

## Avvio

```bash
npm install
npm start
```

L'app è su `http://localhost:4200/`.

## Test

```bash
npm test
```

## Struttura

| Cartella | Contenuto |
| --- | --- |
| `services/tmdb.ts` | tutte le chiamate alle API TMDB |
| `core/tmdb-auth-interceptor.ts` | aggiunge `Authorization: Bearer <token>` e la lingua |
| `models/` | tipi delle risposte TMDB e forma normalizzata usata dalle card |
| `pipes/tmdb-image-pipe.ts` | compone gli URL delle immagini |
| `shared/` | card, griglia, barra di ricerca, spinner |
| `home/` `media-list/` `details/` `people/` `person/` `search/` | le pagine |

---

## Note Angular CLI

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 22.1.8.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
