# intercode_aws_resources Terraform module

Provisions the AWS resources the Intercode app needs to run:

- **SQS queues** — `default`, `mailers`, `ahoy`, and a shared `dead_letter` queue (consumed by Shoryuken)
- **S3 bucket** — for uploaded CMS content and product images
- **IAM user + group + policy** — grants the app access to SQS, S3, SES, and optionally SNS/KMS
- **CloudWatch alarm** — fires when the oldest message in any non-DLQ queue exceeds 10 minutes

## Usage

```hcl
module "intercode_aws" {
  source = "path/to/modules/intercode_aws_resources"

  name           = "intercode_production"
  s3_bucket_name = "intercode2-production"

  alarm_email_destinations = [
    "ops@example.com",
  ]

  # Optional: grant access to the inbox bucket and SNS topic if used
  inbox_bucket_arn    = aws_s3_bucket.intercode_inbox.arn
  inbox_sns_topic_arn = aws_sns_topic.intercode_inbox_deliveries.arn

  # Optional: grant kms:Decrypt for SES decryption
  kms_key_arn = "arn:aws:kms:us-east-1:123456789:key/your-key-id"
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

| Name                       | Description                                                        | Default |
| -------------------------- | ------------------------------------------------------------------ | ------- |
| `name`                     | Prefix for SQS queues and IAM resources                            | —       |
| `s3_bucket_name`           | Uploads S3 bucket name                                             | —       |
| `alarm_email_destinations` | Emails for CloudWatch alarm notifications                          | `[]`    |
| `inbox_bucket_arn`         | Inbox bucket ARN (adds S3 object access to IAM policy)             | `null`  |
| `inbox_sns_topic_arn`      | Inbox SNS topic ARN (adds `sns:ConfirmSubscription` to IAM policy) | `null`  |
| `kms_key_arn`              | KMS key ARN (adds `kms:Decrypt` to IAM policy)                     | `null`  |

## Outputs

| Name                    | Description                           |
| ----------------------- | ------------------------------------- |
| `s3_bucket_name`        | Uploads bucket name                   |
| `s3_bucket_arn`         | Uploads bucket ARN                    |
| `sqs_queue_urls`        | Map of queue name → URL               |
| `sqs_queue_arns`        | Map of queue name → ARN               |
| `alarm_sns_topic_arn`   | CloudWatch alarms SNS topic ARN       |
| `iam_access_key_id`     | App IAM access key ID                 |
| `iam_access_key_secret` | App IAM secret access key (sensitive) |
