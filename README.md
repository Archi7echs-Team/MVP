# MVP

[![Mutation tested with PIT](https://img.shields.io/badge/-Mutation%20tested%20with%20PIT-blue.svg)](http://pitest.org/)

[![CI Pipeline](https://github.com/Archi7echs-Team/MVP/actions/workflows/ci.yml/badge.svg)](https://github.com/Archi7echs-Team/MVP/actions/workflows/ci.yml)


## Struttura del Progetto

- **backend/**: Contiene il codice del backend scritto in Java (Spring Boot).
- **app/**: Contiene il codice del frontend scritto in Svelte.
- **docker-compose.yml**: Configurazione di Docker per eseguire l'intero progetto in contenitori.

## Requisiti

Per il corretto funzionamento, è necessario avere installato:

- [Docker](https://www.docker.com/products/docker-desktop) (con Docker Compose)
- [Node.js](https://nodejs.org/) (per eseguire il frontend in locale, se desiderato)

## Setup

### 1. Clona il Repository

Clona il progetto sulla tua macchina locale:

```bash
git clone https://github.com/Archi7echs-Team/MVP.git
cd MVP 
```

## Configura Docker

Il progetto è configurato per essere eseguito tramite Docker Compose, che crea un ambiente di sviluppo completo con:
- PostgreSQL per il database.
- Backend (Spring Boot) per l'API.
- Frontend (Svelte) per l'interfaccia utente.

## Costruisci e Avvia i Contenitori

Nel terminale, esegui il seguente comando per costruire e avviare tutti i contenitori:

```bash
docker-compose down -v 
docker-compose up --build
```

## Accesso all'Applicazione
- Frontend: Dopo aver eseguito il comando precedente, puoi accedere al frontend all'indirizzo: http://localhost:5173.
- Backend: Il backend sarà accessibile su http://localhost:8080.