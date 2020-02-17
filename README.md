<a href="https://unly.org"><img src="https://storage.googleapis.com/unly/images/ICON_UNLY.png" align="right" height="20" alt="Unly logo" title="Unly logo" /></a>
[![Maintainability](https://api.codeclimate.com/v1/badges/a6ff14f16df566d20013/maintainability)](https://codeclimate.com/github/UnlyEd/airtable-backups-boilerplate/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/a6ff14f16df566d20013/test_coverage)](https://codeclimate.com/github/UnlyEd/airtable-backups-boilerplate/test_coverage)
[![Known Vulnerabilities](https://snyk.io/test/github/UnlyEd/airtable-backups-boilerplate/badge.svg?targetFile=package.json)](https://snyk.io/test/github/UnlyEd/airtable-backups-boilerplate?targetFile=package.json)

# Airtable Backup Boilerplate

> This project is a boilerplate meant to perform backups of Airtable Bases, at a regular interval (scheduled backups, AKA crons).
> Those backups are performed by AWS Lambda, and stored in an AWS S3 bucket.
>
> This project is meant to be hosted on **your own AWS Account**, so you have complete ownership of the project and its configuration.
> The backups are yours and yours only
> 
> In order to get started, please fork this project and follow the ["getting started" guide](#getting-started).

A **demo of this tool** has been published on **[BuiltOnAir podcast](https://builtonair.com/builtonair-s04e07-ambroise-dhenain-cofounder-of-unly/)**, it's a great resource **to see how it works** beforehand. (*[Starts at 22:50](https://youtu.be/DR7zgsoJkTg?t=1371)*)

---

<!-- toc -->

- [Our recommended AWS configuration](#our-recommended-aws-configuration)
- [Getting started](#getting-started)
  * [Local install](#local-install)
  * [Configuring Airtable](#configuring-airtable)
    + [Setup Airtable credentials](#setup-airtable-credentials)
  * [Configuring AWS](#configuring-aws)
    + [Selecting AWS region](#selecting-aws-region)
    + [Configuring AWS S3](#configuring-aws-s3)
  * [Configuring a scheduled backup](#configuring-a-scheduled-backup)
    + [Testing project locally (mocked data)](#testing-project-locally-mocked-data)
- [Deploying on AWS](#deploying-on-aws)
- [Airtable - In depth](#airtable---in-depth)
  * [A word of caution about Airtable API Key](#a-word-of-caution-about-airtable-api-key)
  * [We leaked our own Airtable API Key!](#we-leaked-our-own-airtable-api-key)
- [Error monitoring with Epsagon](#error-monitoring-with-epsagon)
- [Logs](#logs)
- [Test](#test)
- [Release](#release)
- [FAQ](#faq)
  * [`Can't find Airtable table Video trackers with provided base`](#cant-find-airtable-table-video-trackers-with-provided-base)
  * [My deployment worked but no file is added to S3, AKA "I don't know what's happening on AWS"](#my-deployment-worked-but-no-file-is-added-to-s3-aka-i-dont-know-whats-happening-on-aws)
- [Vulnerability disclosure](#vulnerability-disclosure)
- [Contributors and maintainers](#contributors-and-maintainers)
- [**[ABOUT UNLY]**](#about-unly-)
<!-- tocstop -->

## Our recommended AWS configuration

> As best practice, this boilerplate comes built-in with different environments (an "environment" is similar to a "stage").
>
> Each env is completely independent. We recommend having one environment in one dedicated AWS Account as best practice, for complete separation of concerns.
> But, you can also use the same AWS account, it's entirely up to you.

Our environments are specified in `serverless.yml:custom.envs`.
We use the same "profile" for both staging and production envs in this boilerplate, for the sake of simplicity.

But you can use different AWS profile if you wish (that's what we do in our internal fork of this boilerplate).

If you're not familiar with AWS profiles and alike, [I recommend reading this](https://forum.serverless.com/t/restructuring-aws-proper-way-to-configure-aws-accounts-organisations-and-profiles-when-using-serverless/5009).

P.S: Because we use AWS profiles, we don't directly manipulate AWS SECRET/API keys, they're stored in our `~/.aws/` folder and we don't have to care about them.
You may prefer to manage your AWS credentials with environment variables.

---

## Getting started

> First, fork this project, or clone it.

### Local install

```bash
nvm use # Select the same node version as the one that'll be used by AWS (see .nvmrc) (optional)
yarn install # Install node modules
```

### Configuring Airtable

#### Setup Airtable credentials

> First, you need to find your Airtable API KEY, you can find it in your [Airtable account](https://airtable.com/account), or in the API documentation of your Airtable Base. 

Because your Airtable API Key must not be tracked by git, it's meant to be added in a non-tracked file, that depends on the environment you're deploying to:

- Staging environment: `./.env.staging`
- Production environment: `./.env.production`

Create both files and add your Airtable API key as `AIRTABLE_TOKEN` (see [.env.test](./.env.test) as example)

> See [Airtable - In depth](#airtable---in-depth) section to learn more about our Airtable's recommendations

### Configuring AWS

#### Selecting AWS region
> First, you need to know which region you want to use. This region will be used for storing your backups (S3) and that's also where your Lambda are gonna be running.

By default, the region is `Ireland`, but you can either change the default value in [serverless config](./serverless.yml), or customise the [`deploy` script](package.json) to match the region you want.
 
#### Configuring AWS S3

##### Creating AWS S3 Bucket
> You need to **manually** create a bucket [in AWS Console](https://console.aws.amazon.com/s3/home) _(PR welcome to automate this process!)_

The name of the bucket is [dynamic by default](./serverless.yml), `bucket: ${self:service}-${self:custom.environment}`, which will resolve to either `airtable-backups-demo-staging` or `airtable-backups-demo-production` in our case.

##### Selecting AWS S3 Storage Class (optional)

Selecting the right storage class is a bit complex and won't be covered in this short tutorial. We recommend reading the [official documentation](https://aws.amazon.com/en/s3/storage-classes/).

The storage class we recommend for storing backups is **`STANDARD_IA`** (AKA "Standard Infrequent Access"), because it's the best compromise in terms of cost, accessibility, backup redundancy (multi zones), etc. 

But, each business may have its own preferences. Also, you can optimize cost using automated lifecycle.

##### Configuring AWS S3 Bucket's lifecycle (optional)

You can configure a lifecycle for your S3 bucket. (you can still configure/change this later on if you change your mind).

- Here is a good tutorial on how to delete a backup after X days, [see this advanced tutorial](https://www.joe0.com/2017/05/24/amazon-s3-how-to-delete-files-older-than-x-days/)
- You could also optimise cost by automatically moving backups that are older than 30 days to another class storage, such as "Glacier", etc.
- Here is official documentation [here](https://docs.aws.amazon.com/AmazonS3/latest/user-guide/create-lifecycle.html)

> We personally use lifecycle to delete files older than 180 days, so that our usage of AWS S3 doesn't increase indefinitely.

### Configuring a scheduled backup

Finally, after going through all the previous steps, you can now finally configure a scheduled backup for an Airtable base!

The configuration is done in [serverless config](./serverless.yml), at `custom.airtableBackups.events`:

```yaml
  airtableBackups: # The same lambda is used to configure all backups (each backup is a distinct "scheduled event", AKA "cron")
    handler: src/functions/makeAirtableBackup.handler
    events:
      - schedule:
          description: "Airtable backups for the 'Airtable backups boilerplate' base (demo)"
          rate: rate(5 minutes) # TODO Set your own rate : https://docs.aws.amazon.com/AmazonCloudWatch/latest/events/ScheduledEvents.html
          enabled: true
          input:
            AIRTABLE_BASE: "app7nfLmoVHva1Vdv" # TODO Set your own base id
            AIRTABLE_TABLES: "Video tracker;Staff directory;Agencies;Agency contacts;Scenes;Shots;Locations;Props and equipment" # TODO Set your table names
            S3_DIRECTORY: "airtableBackupsBoilerplate/" # TODO Set the s3 sub-directory you want the backups to be stored in
            STORAGE_CLASS: 'STANDARD_IA' # Set the storage class to use within those values: "STANDARD"|"REDUCED_REDUNDANCY"|"STANDARD_IA"|"ONEZONE_IA"|"INTELLIGENT_TIERING"|"GLACIER"|"DEEP_ARCHIVE" - See https://aws.amazon.com/en/s3/storage-classes/
```

The same AWS Lambda (`airtableBackups`) is used to perform all backups. You can schedule several events if you wish, each with its own base, tables, S3 directory and storage class strategy.

#### Testing project locally (mocked data)

> We will store a backup in your AWS S3 bucket for real, but is triggered locally (not on AWS Lambda)

```bash
yarn invoke:airtableBackups
```

**Note that this script uses our [mocked data](mocks/test-event.json)**, and not the ones that have been defined in serverless.yml

The output should be something like this :
```
Backup "airtableBackupsBoilerplate/2020_01_11_17-47-04.json" successfully uploaded to bucket "airtable-backups-demo-staging" (using storage class: "STANDARD_IA")
{
    "statusCode": 200,
    "body": "Successfully created backup"
}
```

---

## Deploying on AWS

> Before deploying, search for all `TODO` in the code source and resolve them. (serverless.yml)
>
> They're mostly there to highlight changes that you should perform before deploying this project on AWS.

```bash
yarn deploy # Deploy on staging environment
NODE_ENV=production yarn deploy # Deploys to production
```

---

## Airtable - In depth

### A word of caution about Airtable API Key

> Airtable API Key security **sucks**, in our opinion.

They use the same API key for all bases, and you can only have one. 
Therefore, if you API Key leaks, you'll have to invalidate it in your [Airtable account](https://airtable.com/account), which will break all API integration for all bases at once.

A better way for them to secure API keys would have been to allow us to create more API keys (and name them), so we could have used one different API key per base and per environment.
This would have been better in case we need to invalidate one key, it'd have a much smaller damage radius. But unfortunately, that's not the case.

> Be extra cautious about not leaking your Airtable API Key anywhere (like on github, for instance)

### We leaked our own Airtable API Key!

Note that for the sake of simplicity, we leaked our own Airtable API Key in the `.env.test` and `mocks/test-event.json` files, but we created a separated Airtable Account unrelated to our business, meant to be used by this boilerplate only.

A more elegant solution would have been to not use environment variables to store the `AIRTABLE_TOKEN`, such as KMS or similar.

---

## Error monitoring with Epsagon

We use Epsagon in this boilerplate to monitor errors and lambda invoke. It's very handy for faster debugging.

You can set up your own credentials [in serverless.yml](./serverless.yml):
```yaml
custom:
  epsagon:
    token: '' # TODO Set your Epsagon token - Won't be applied if not provided
```

This is completely optional and opt-in. You're opt-out by default.

> If you decide to use it, make sure to configure Epasagon with Slack (or similar) to be notified about staging/production errors.

---

## Logs

- **airtableBackups** function:
```bash
yarn logs:airtableBackups
```

- **status** function:
```bash
yarn logs:status
```

Similar to reading the logs from the AWS Console

---

## Test

```
yarn test
yarn test:coverage
```

---

## Release

Will prompt version to release, run tests, commit/push commit + tag

```
yarn release
```


> Check the [./package.json](./package.json) file to see what other utility scripts are available

--

## FAQ

### `Can't find Airtable table Video trackers with provided base`

> Make sure all your `AIRTABLE_TOKEN`, `AIRTABLE_BASE` and `AIRTABLE_TABLES` are correct. 

If the base doesn't exist or if the table doesn't exist within that base then you'll get this error.

Same thing if the airtable token is incorrect. It makes it harder to debug a misconfiguration, but that's how Airtable's API works...

### My deployment worked but no file is added to S3, AKA "I don't know what's happening on AWS"

> Make sure to first test your backup configuration with a **fast rate**, like `rate: rate(2 minutes)`

[Watch quick video about how to debug using Epsagon](https://youtu.be/KYdIS82lwlI)

Always use a fast rate when testing things out, that way you have a fast feedback about what's working or not. 
Don't use `rate: rate(1 day)` before trying your configuration on AWS first, for instance.

**Also, when you deploy your scheduled backup, AWS Lambda won't be triggered immediately. It will actually wait before triggering for the first time.**

> i.e: `rate: rate(1 day)` will not be triggered before 24h after deploying

# Vulnerability disclosure

[See our policy](https://github.com/UnlyEd/Unly).

---

# Contributors and maintainers

This project is being maintained by:
- [Unly] Ambroise Dhenain ([Vadorequest](https://github.com/vadorequest)) **(active)**
- [Contributor] Hugo Martin ([Demmonius](https://github.com/Demmonius)) **(active)**

---

# **[ABOUT UNLY]** <a href="https://unly.org"><img src="https://storage.googleapis.com/unly/images/ICON_UNLY.png" height="40" align="right" alt="Unly logo" title="Unly logo" /></a>

> [Unly](https://unly.org) is a socially responsible company, fighting inequality and facilitating access to higher education. 
> Unly is committed to making education more inclusive, through responsible funding for students. 

We provide technological solutions to help students find the necessary funding for their studies. 

We proudly participate in many TechForGood initiatives. To support and learn more about our actions to make education accessible, visit : 
- https://twitter.com/UnlyEd
- https://www.facebook.com/UnlyEd/
- https://www.linkedin.com/company/unly
- [Interested to work with us?](https://jobs.zenploy.io/unly/about)

Tech tips and tricks from our CTO on our [Medium page](https://medium.com/unly-org/tech/home)!

#TECHFORGOOD #EDUCATIONFORALL
