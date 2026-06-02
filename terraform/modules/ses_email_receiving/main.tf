terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = ">= 5.0"
    }
  }
}

data "aws_region" "current" {}
data "aws_caller_identity" "current" {}

locals {
  region     = data.aws_region.current.region
  account_id = data.aws_caller_identity.current.account_id
}

# ---------------------------------------------------------------------------
# SES receiving infrastructure
# ---------------------------------------------------------------------------

# Inbox bucket — SES writes received emails here; lifecycle expires them after
# 14 days.
resource "aws_s3_bucket" "inbox" {
  bucket = var.inbox_bucket_name
}

resource "aws_s3_bucket_acl" "inbox" {
  bucket = aws_s3_bucket.inbox.bucket
  acl    = "private"
}

resource "aws_s3_bucket_policy" "inbox" {
  bucket = aws_s3_bucket.inbox.bucket
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "AllowSESPuts"
        Effect = "Allow"
        Principal = {
          Service = "ses.amazonaws.com"
        }
        Action   = "s3:PutObject"
        Resource = "${aws_s3_bucket.inbox.arn}/*"
        Condition = {
          StringEquals = {
            "aws:Referer" = local.account_id
          }
        }
      }
    ]
  })
}

resource "aws_s3_bucket_lifecycle_configuration" "inbox" {
  bucket = aws_s3_bucket.inbox.bucket

  rule {
    id     = "message_expiration"
    status = "Enabled"
    expiration {
      days = 14
    }
  }
}

# IAM roles for SNS delivery status logging.
resource "aws_iam_role" "sns_success_feedback" {
  name = "${var.name}-sns-success-feedback"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action    = "sts:AssumeRole"
      Effect    = "Allow"
      Principal = { Service = "sns.amazonaws.com" }
    }]
  })
}

resource "aws_iam_role_policy" "sns_success_feedback" {
  name = "${var.name}-sns-success-feedback"
  role = aws_iam_role.sns_success_feedback.name

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect = "Allow"
      Action = [
        "logs:CreateLogGroup",
        "logs:CreateLogStream",
        "logs:PutLogEvents",
        "logs:PutMetricFilter",
        "logs:PutRetentionPolicy",
      ]
      Resource = ["*"]
    }]
  })
}

resource "aws_iam_role" "sns_failure_feedback" {
  name = "${var.name}-sns-failure-feedback"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action    = "sts:AssumeRole"
      Effect    = "Allow"
      Principal = { Service = "sns.amazonaws.com" }
    }]
  })
}

resource "aws_iam_role_policy" "sns_failure_feedback" {
  name = "${var.name}-sns-failure-feedback"
  role = aws_iam_role.sns_failure_feedback.name

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect = "Allow"
      Action = [
        "logs:CreateLogGroup",
        "logs:CreateLogStream",
        "logs:PutLogEvents",
        "logs:PutMetricFilter",
        "logs:PutRetentionPolicy",
      ]
      Resource = ["*"]
    }]
  })
}

# SNS topic for inbox delivery notifications.
resource "aws_sns_topic" "inbox_deliveries" {
  name                           = "${var.name}-inbox-deliveries"
  http_success_feedback_role_arn = aws_iam_role.sns_success_feedback.arn
  http_failure_feedback_role_arn = aws_iam_role.sns_failure_feedback.arn
}

resource "aws_sns_topic_subscription" "inbox_deliveries_webhook" {
  topic_arn              = aws_sns_topic.inbox_deliveries.arn
  protocol               = "https"
  endpoint               = var.sns_notification_endpoint
  endpoint_auto_confirms = true

  delivery_policy = jsonencode({
    guaranteed = false
    healthyRetryPolicy = {
      backoffFunction    = "linear"
      maxDelayTarget     = 300
      minDelayTarget     = 20
      numMaxDelayRetries = 0
      numMinDelayRetries = 0
      numNoDelayRetries  = 0
      numRetries         = 3
    }
    sicklyRetryPolicy = null
    throttlePolicy    = null
  })
}

# SES receipt rules — store incoming mail in S3 and notify via SNS.
# Note: aws_ses_active_receipt_rule_set is account-global; only one rule set
# can be active at a time.
resource "aws_ses_receipt_rule_set" "inbox" {
  rule_set_name = "${var.name}-inbox"
}

resource "aws_ses_active_receipt_rule_set" "inbox" {
  rule_set_name = aws_ses_receipt_rule_set.inbox.rule_set_name
}

resource "aws_ses_receipt_rule" "store_and_notify" {
  name          = "store_and_notify"
  rule_set_name = aws_ses_receipt_rule_set.inbox.rule_set_name
  enabled       = true
  scan_enabled  = true

  s3_action {
    bucket_name = aws_s3_bucket.inbox.bucket
    position    = 1
    # Uses the AWS-managed SES KMS key; no custom key required.
    kms_key_arn = "arn:aws:kms:${local.region}:${local.account_id}:alias/aws/ses"
    topic_arn   = aws_sns_topic.inbox_deliveries.arn
  }
}

# SES configuration set with CloudWatch event tracking.
resource "aws_ses_configuration_set" "default" {
  name = var.configuration_set_name
}

resource "aws_ses_event_destination" "cloudwatch" {
  name                   = "ses-sends"
  configuration_set_name = aws_ses_configuration_set.default.name
  enabled                = true
  matching_types         = ["bounce", "complaint", "delivery", "reject", "send"]

  cloudwatch_destination {
    default_value  = aws_ses_configuration_set.default.name
    dimension_name = "ses:configuration-set"
    value_source   = "messageTag"
  }
}
