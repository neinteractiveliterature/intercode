# ses_email_receiving Terraform module

Sets up SES-based email receiving for Intercode: incoming mail is stored in S3
and an SNS notification is POSTed to the app's `/sns_notifications` endpoint.

> **Note:** `aws_ses_active_receipt_rule_set` is account-global — only one rule
> set can be active per AWS account at a time.

## Usage

```hcl
module "ses_email" {
  source = "path/to/modules/ses_email_receiving"

  name                      = "intercode_production"
  inbox_bucket_name         = "intercode-inbox"
  sns_notification_endpoint = "https://www.neilhosting.net/sns_notifications"
}

# Wire outputs into intercode_aws_resources so the IAM policy grants
# the app access to the inbox bucket, SNS topic, and KMS key.
module "intercode_aws" {
  source = "path/to/modules/intercode_aws_resources"

  # ...
  inbox_bucket_arn    = module.ses_email.inbox_bucket_arn
  inbox_sns_topic_arn = module.ses_email.inbox_deliveries_sns_topic_arn
  kms_key_arn         = module.ses_email.kms_key_arn
}
```

## Inputs

| Name                        | Description                          |
| --------------------------- | ------------------------------------ |
| `name`                      | Prefix for resource names            |
| `inbox_bucket_name`         | S3 bucket name for received email    |
| `sns_notification_endpoint` | HTTPS URL for delivery notifications |

## Outputs

| Name                             | Description                                         |
| -------------------------------- | --------------------------------------------------- |
| `inbox_bucket_name`              | SES inbox bucket name                               |
| `inbox_bucket_arn`               | SES inbox bucket ARN                                |
| `inbox_deliveries_sns_topic_arn` | SNS topic ARN for delivery notifications            |
| `kms_key_arn`                    | ARN of the AWS-managed SES KMS key (for IAM policy) |
