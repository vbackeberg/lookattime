# What is Look at Time?
Look at time is an interactive timeline that allows you to learn about history in a visual way.

**Visit https://www.lookattime.com**

# Repository structure
This is a monorepo containing the Azure API and web application built on Vue 2.

# Installation
## Backend
1. Install Azure Functions Core Tools
2. `cd api && npm i`j
3. Add environment variables to `local.settings.json`
4. Initialize Azure database `db/initialize.mssql`.

## Frontend
1. `cd web && npm i`


# Development
## Backend
1. Launch "Attach to Azure Functions" or  
`cd api && npm run start`

## Frontend
1. Launch "Chrome debugging" or  
`cd web && npm run serve`