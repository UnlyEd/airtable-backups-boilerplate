# Backup Airtable

This project was generated using https://github.com/UnlyEd/boilerplate-generator/tree/master/templates/node-v10.x-aws-serverless-with-serverless-bundle

> This project is similar to node-v10.x-aws-serverless, but uses https://github.com/AnomalyInnovations/serverless-bundle to simplify the babel/webpack configuration.
> Use this for a quick POC/test project. Beware that you won't be able to customise webpack/babel configurations using serverless-bundle (simplicity over flexibility).
> For instance, it's not possible to customise webpack in order to configure Sentry. The Sentry integration has therefore been removed from this boilerplate. 

<!-- toc -->

- [TODO (after generating a project from this boilerplate)](#todo-after-generating-a-project-from-this-boilerplate)
- [Getting started](#getting-started)
  * [Install](#install)
  * [Use](#use)
  * [Deploy](#deploy)
  * [Logs](#logs)
  * [Test](#test)
  * [Release](#release)
- [Features/defaults provided by this boilerplate](#featuresdefaults-provided-by-this-boilerplate)

<!-- tocstop -->

## TODO (after generating a project from this boilerplate)

- Rename occurrences of `backup-airtable`
- Look for `TODO`
  - Use your own AWS profile instead of `sandbox`
- Enable [sentry](https://sentry.io/organizations/unly/projects/), if needed (or delete)
  - `serverless.yml`
  - `.sentryclirc`
- Delete this

## Features/defaults provided by this boilerplate

- Usage of https://github.com/AnomalyInnovations/serverless-bundle in order to simplify the webpack/babel setup, at the cost of flexibility
- SLS handles stages/environments and settings per environment (memorySize, AWS profile, etc.)
  - "staging" and "production" environments built-in
- SLS scripts (helpers)
- Environment variables built-in by default (both from .env* files and serverless.yml), using `dotenv` and `@unly/serverless-env-copy-plugin`
- Jest for testing
  - Jest extended https://github.com/jest-community/jest-extended included
  - Support for ENV variables built-in
- Use YARN for packaging
- 30s timeout on lambda (max allowed)
- 128Mo RAM on lambda (min allowed)
- 60 days logs retention (avoid infinite logs and lambda price increase)
- Enable API GW logs by default

## Getting started

### Install

```
yarn install
```

### Use

```
yarn start
```

### Deploy

```
yarn deploy # Deploy to staging env
NODE_ENV=production yarn deploy # Deploy to production env
```

### Logs

```
yarn logs:status
```

Similar to reading the logs from the AWS Console

### Test

```
yarn test
yarn test:coverage
```

### Release
Will prompt version to release, run tests, commit/push commit + tag

```
yarn release
```


> Check the [./package.json](./package.json) file to see what other utility scripts are available
# backup-airtable
