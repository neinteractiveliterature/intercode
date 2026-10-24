# intercode_aws_resources Terraform module

Provisions the core AWS resources the Intercode app needs to run:

- **SQS queues** — `default`, `mailers`, `ahoy`, and a shared `dead_letter` queue (consumed by Shoryuken)
- **S3 bucket** — for uploaded CMS content and product images
- **IAM user + group + policy** — grants the app access to SQS, S3, SES, and optionally SNS/KMS
- **CloudWatch alarm** — fires when the oldest message in any non-DLQ queue exceeds 10 minutes

Email receiving is handled separately; wire in an email module's outputs via
the optional `inbox_bucket_arn`, `inbox_sns_topic_arn`, and `kms_key_arn`
variables. See `ses_email_receiving` for one such module.

## Usage

```hcl
module "ses_email" {
  source = "path/to/modules/ses_email_receiving"

  name                      = "intercode_production"
  inbox_bucket_name         = "intercode-inbox"
  sns_notification_endpoint = "https://www.neilhosting.net/sns_notifications"
}

module "intercode_aws" {
  source = "path/to/modules/intercode_aws_resources"

  name           = "intercode_production"
  s3_bucket_name = "intercode2-production"

  alarm_email_destinations = ["ops@example.com"]
}

# Email-receiving modules attach their own policies using iam_group_name.
module "ses_email" {
  source = "path/to/modules/ses_email_receiving"

  name                      = "intercode_production"
  inbox_bucket_name         = "intercode-inbox"
  sns_notification_endpoint = "https://www.neilhosting.net/sns_notifications"
  iam_group_name            = module.intercode_aws.iam_group_name
}
```

## Inputs

| Name                       | Description                               | Default |
| -------------------------- | ----------------------------------------- | ------- |
| `name`                     | Prefix for SQS queues and IAM resources   | —       |
| `s3_bucket_name`           | Uploads S3 bucket name                    | —       |
| `alarm_email_destinations` | Emails for CloudWatch alarm notifications | `[]`    |

## Configuring the app

This module (together with the `sentry` and `forwardemail_receiving` modules) is the public interface for configuring
Intercode: every environment variable the app reads from its environment is either set through one of them, or is
deliberately left elsewhere, as listed below. The modules write each setting to SSM Parameter Store under
`/{name}/{VARIABLE}`, and the app loads them at boot with Chamber. A setting that isn't given is not written, so the
app's own default applies.

To add a new setting to the app, add an optional (default `null`) variable here and write it in `ssm.tf`, so existing
deployments don't change.

### Variables

| Variable(s)                                                                                   | What it sets                                                           |
| --------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| `database_url`, `secret_key_base`, `openid_connect_signing_key`, `email_forwarders_api_token` | Core secrets (the last three are generated if not given)               |
| `devise_secret_key`                                                                           | `DEVISE_SECRET_KEY` (generated if not given)                           |
| `default_currency`, `intercode_host`, `assets_host`, `uploads_host`                           | Currency and hostnames                                                 |
| `stripe`, `turnstile`, `twilio`                                                               | Payment, bot protection and SMS credentials                            |
| `ses_configuration_set`                                                                       | `SES_CONFIGURATION_SET` for outgoing email                             |
| `session_days_trim_threshold`                                                                 | `SESSION_DAYS_TRIM_THRESHOLD`: days the nightly cleanup keeps sessions |
| `autoscale`, `fly_api_token`, `fly_metrics`                                                   | Autoscaling settings and the Fly tokens it uses                        |
| `cloudwatch_log_group`                                                                        | `CLOUDWATCH_LOG_GROUP`                                                 |
| `secrets`                                                                                     | Any other secret, as `{ ENV_VAR_NAME = value }`                        |
| `sentry` module                                                                               | `SENTRY_*`                                                             |
| `forwardemail_receiving` module                                                               | `FORWARDEMAIL_API_KEY`                                                 |

### Left out on purpose

- **Provided by the platform or the build:** `FLY_APP_NAME`, `FLY_PRIVATE_IP`, `FLY_PROCESS_GROUP`, `PORT`, `PUMA_BIND`,
  `PIDFILE`, `BUNDLE_GEMFILE`, `REVISION`, `RAILS_ENV`.
- **Process shape, set in `fly.toml` because it depends on the VM size:** `RAILS_MAX_THREADS`, `RAILS_MIN_THREADS`,
  `WEB_CONCURRENCY`, `RUBY_GC_AUTO_COMPACT`, `JSON_LOGGING`, `RAILS_LOG_TO_STDOUT`, `RAILS_SERVE_STATIC_FILES`.
- **Derived from other settings:** `AWS_S3_REGION` (the app defaults to `us-east-1`, where the uploads bucket is) and
  `AWS_EMAIL_RECEIVING_REGION` (defaults to `AWS_REGION`).
- **Debugging switches, only ever set by hand:** `FIND_VIRTUAL_HOST_DEBUG`, `GC_DEBUG`, `GRAPHQL_DEBUG`,
  `LOG_QUERY_SOURCE`, `RACK_MINI_PROFILER`.
- **Development and one-off tasks:** `DEVELOPMENT_DATABASE_URL`, `TEST_DATABASE_URL`, `ANNOTATERB_SKIP_ON_DB_TASKS`,
  `INPUT_FILE`, `ORGANIZATION_NAME`.
- **Not used in production any more:** `DYNO`, `MEMCACHEDCLOUD_*`, `REDIS_URL`, `ROLLBAR_*` and `RAILS_MASTER_KEY` are
  left over from Heroku or earlier setups, and aren't set in production.

## Outputs

| Name                    | Description                                                              |
| ----------------------- | ------------------------------------------------------------------------ |
| `iam_group_name`        | IAM group name — pass to email modules so they can attach their policies |
| `s3_bucket_name`        | Uploads bucket name                                                      |
| `s3_bucket_arn`         | Uploads bucket ARN                                                       |
| `sqs_queue_urls`        | Map of queue name → URL                                                  |
| `sqs_queue_arns`        | Map of queue name → ARN                                                  |
| `alarm_sns_topic_arn`   | CloudWatch alarms SNS topic ARN                                          |
| `iam_access_key_id`     | App IAM access key ID                                                    |
| `iam_access_key_secret` | App IAM secret access key (sensitive)                                    |
