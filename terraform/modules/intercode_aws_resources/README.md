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
