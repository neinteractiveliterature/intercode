# ses_email_receiving Terraform module

Sets up SES-based email receiving for Intercode: incoming mail is stored in S3
and an SNS notification is POSTed to the app's `/sns_notifications` endpoint.

The module attaches its own IAM group policy directly to the app's IAM group,
so no ARNs need to be threaded back into `intercode_aws_resources`.

> **Note:** `aws_ses_active_receipt_rule_set` is account-global — only one rule
> set can be active per AWS account at a time.

## Usage

```hcl
module "intercode_aws" {
  source = "path/to/modules/intercode_aws_resources"

  name           = "intercode_production"
  s3_bucket_name = "intercode2-production"
}

module "ses_email" {
  source = "path/to/modules/ses_email_receiving"

  name                      = "intercode_production"
  inbox_bucket_name         = "intercode-inbox"
  sns_notification_endpoint = "https://www.neilhosting.net/sns_notifications"
  iam_group_name            = module.intercode_aws.iam_group_name
}
```

## Inputs

| Name                        | Description                                       |
| --------------------------- | ------------------------------------------------- |
| `name`                      | Prefix for resource names                         |
| `inbox_bucket_name`         | S3 bucket name for received email                 |
| `sns_notification_endpoint` | HTTPS URL for delivery notifications              |
| `iam_group_name`            | IAM group to attach the email-receiving policy to |

## Outputs

| Name                             | Description                              |
| -------------------------------- | ---------------------------------------- |
| `inbox_bucket_name`              | SES inbox bucket name                    |
| `inbox_bucket_arn`               | SES inbox bucket ARN                     |
| `inbox_deliveries_sns_topic_arn` | SNS topic ARN for delivery notifications |
