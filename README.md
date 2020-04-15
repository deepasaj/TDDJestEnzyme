# Proteus Web Client

Porteus ReactJS client.

## Prerequisites

- Node v12.16.0
- NPM v6.13.4

In case you have NVM installed, simply run `nvm use`.

## Configuration

- `API_URL`: URL for the Porteus server; by default: 'http://localhost:5000'

## Setup

```bash
npm i # install dependencies
```

## NPM Commands

```bash
npm run dev   # build and run the development distribution
              # recompile on change; dev server available on port 3010
npm run build # build the production distribution of the app
npm run lint  # run the ESLint linter
npm run lint:fix # run the ESLint linter and automatically fix errors whenever possible
```

## Install Helm Charts

The helm config is in the helm and configmap directories.

To install the chart in `proteus-dev`:

```bash
$  helm upgrade --install --force frontend-proteus-dev helm/frontend/ --namespace proteus-dev --wait --timeout 300 --values helm/frontend/values.yaml
```
