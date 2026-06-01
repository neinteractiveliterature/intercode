# intercode_aws_resources Terraform module

Provisions the AWS resources the Intercode app needs to run:

- **SQS queues** — `default`, `mailers`, `ahoy`, and a shared `dead_letter` queue (consumed by Shoryuken)
- **S3 bucket** — for uploaded CMS content and product images
- **SES receiving** — inbox S3 bucket, receipt rule set, SNS topic + webhook subscription, CloudWatch event tracking
- **IAM user + group + policy** — grants the app access to SQS, S3, SES, SNS, and the AWS-managed SES KMS key
- **CloudWatch alarm** — fires when the oldest message in any non-DLQ queue exceeds 10 minutes

> **Note:** `aws_ses_active_receipt_rule_set` is account-global — only one rule set can be active per AWS account at a time.

## Usage

```hcl
module "intercode_aws" {
  source = "path/to/modules/intercode_aws_resources"

  name                      = "intercode_production"
  s3_bucket_name            = "intercode2-production"
  inbox_bucket_name         = "intercode-inbox"
  sns_notification_endpoint = "https://www.neilhosting.net/sns_notifications"

  alarm_email_destinations = [
    "ops@example.com",
  ]
}

# Pass credentials to the app
output "aws_access_key_id" {
  value = module.intercode_aws.iam_access_key_id
}

output "aws_secret_access_key" {
  value     = module.intercode_aws.iam_access_key_secret
  sensitive = true
}
```

## Inputs

| Name                        | Description                                          | Default |
| --------------------------- | ---------------------------------------------------- | ------- |
| `name`                      | Prefix for SQS queues, IAM resources, and SNS topics | —       |
| `s3_bucket_name`            | Uploads S3 bucket name                               | —       |
| `inbox_bucket_name`         | SES inbox S3 bucket name                             | —       |
| `sns_notification_endpoint` | HTTPS URL for SES delivery notifications             | —       |
| `alarm_email_destinations`  | Emails for CloudWatch alarm notifications            | `[]`    |

## Outputs

| Name                             | Description                                  |
| -------------------------------- | -------------------------------------------- |
| `s3_bucket_name`                 | Uploads bucket name                          |
| `s3_bucket_arn`                  | Uploads bucket ARN                           |
| `inbox_bucket_name`              | SES inbox bucket name                        |
| `inbox_bucket_arn`               | SES inbox bucket ARN                         |
| `inbox_deliveries_sns_topic_arn` | SNS topic ARN for SES delivery notifications |
| `sqs_queue_urls`                 | Map of queue name → URL                      |
| `sqs_queue_arns`                 | Map of queue name → ARN                      |
| `alarm_sns_topic_arn`            | CloudWatch alarms SNS topic ARN              |
| `iam_access_key_id`              | App IAM access key ID                        |
| `iam_access_key_secret`          | App IAM secret access key (sensitive)        |
