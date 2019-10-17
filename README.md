# Airtable Backup Boilerplate

This boilerplate allow you to configure Airtable backups and store it to AWS S3

<!-- toc -->

- [Getting started](#getting-started)
  * [Install](#install)
  * [Use](#use)
  * [Deploy](#deploy)
  * [Logs](#logs)
  * [Test](#test)
  * [Release](#release)
- [Features/defaults provided by this boilerplate](#featuresdefaults-provided-by-this-boilerplate)

<!-- tocstop -->

## Getting started

### Install

```bash
yarn install
```

### Configure your own Airtable settings
#### Local development
Use default environment:
`cp .env.example .env.development`

Then, fill the `AIRTABLE_TOKEN` with your own

Open data.json
```json
{
    "AIRTABLE_BASE": "XXX",
    "AIRTABLE_TABLES": "Table 1;Table 2;Table 3",
    "S3_DIRECTORY": "dev/"
}
```
Explanations :

* **AIRTABLE_BASE** is the base you want to use for the local developmnent
* **AIRTABLE_TABLES** are the tables name to backup, split by a `;`
* **S3_DIRECTORY** is the S3 bucket sub-directory to use

Fill free to change the S3 bucket's name in `serverless.yml`:
```yaml
custom:
  bucket: airtable-backups
```

#### Start project locally

```bash
yarn invoke:makeBackup
```

If the output of serverless is :
```json
{
    "statusCode": 200,
    "body": "Successfully created backup"
}
```

All is right ! You can now check your S3 bucket

#### Push to production
Setup in [serverless.yml](./serverless.yml) the schedule :
```yaml
makeBackup:
    handler: src/functions/makeBackup.handler
    events:
      - http:
          path: /backup
          method: post
      - schedule:
          description: "Name of the backup"
          rate: rate(1 day) # Set your own rate : https://docs.aws.amazon.com/AmazonCloudWatch/latest/events/ScheduledEvents.html
          enabled: true
          input:
            AIRTABLE_BASE: "XXX" # Set your own base production id
            AIRTABLE_TABLES: "Table 1;Table 2;Table 3" # Set your tables name
            "S3_DIRECTORY": "my-production-subdirectory/" # Set the s3 sub-directory
```
Of course, you're free to add as many schedule as you want !

### Deploy

```bash
yarn deploy # Deploy to production
```

### Error monitoring
We are using Epsagon in this boilerplate to monitor errors and lambda invoke. You can set up your own credientials [here](./serverless.yml) as:
```yaml
custom:
  epsagon:
    token: XXX # Set your own token
    appName: ${self:service}-${self:custom.environment} # The will look as backup-airtable-production
```

> If you don't want to use Epsagon to monitor your lambdas, don't care about this

### Logs

**MakeBackup**:
```bash
yarn logs:makeBackup
```

**Status**:
```bash
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