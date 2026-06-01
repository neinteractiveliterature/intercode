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

# ---------------------------------------------------------------------------
# SQS queues (consumed by Shoryuken for background job processing)
# ---------------------------------------------------------------------------

resource "aws_sqs_queue" "dead_letter" {
  name             = "${var.name}_dead_letter"
  max_message_size = 1048576
}

resource "aws_sqs_queue" "default" {
  name = "${var.name}_default"
  redrive_policy = jsonencode({
    deadLetterTargetArn = aws_sqs_queue.dead_letter.arn
    maxReceiveCount     = 1
  })
}

resource "aws_sqs_queue" "mailers" {
  name = "${var.name}_mailers"
  redrive_policy = jsonencode({
    deadLetterTargetArn = aws_sqs_queue.dead_letter.arn
    maxReceiveCount     = 1
  })
}

resource "aws_sqs_queue" "ahoy" {
  name = "${var.name}_ahoy"
  redrive_policy = jsonencode({
    deadLetterTargetArn = aws_sqs_queue.dead_letter.arn
    maxReceiveCount     = 1
  })
}

# ---------------------------------------------------------------------------
# CloudWatch alarm — fires when the oldest message in any queue is > 10 min
# ---------------------------------------------------------------------------

resource "aws_sns_topic" "alarms" {
  name = "${var.name}-alarms"
}

resource "aws_sns_topic_subscription" "alarms_email" {
  for_each = var.alarm_email_destinations

  topic_arn = aws_sns_topic.alarms.arn
  protocol  = "email"
  endpoint  = each.value
}

resource "aws_cloudwatch_metric_alarm" "queue_backup" {
  alarm_name          = "${var.name} queue backup"
  alarm_description   = "Oldest message in ${var.name} SQS queue is older than 10 minutes."
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 5
  datapoints_to_alarm = 5
  threshold           = 600

  alarm_actions = [aws_sns_topic.alarms.arn]

  metric_query {
    id          = "q1"
    label       = "Oldest message age in queue"
    period      = 300
    return_data = true
    expression  = <<-EOT
      SELECT MAX(ApproximateAgeOfOldestMessage)
      FROM SCHEMA("AWS/SQS", QueueName)
      WHERE QueueName != '${aws_sqs_queue.dead_letter.name}'
        AND QueueName != '${var.name}_cloudwatch_scheduler-failures'
    EOT
  }
}

# ---------------------------------------------------------------------------
# S3 bucket for uploaded CMS content and product images
# ---------------------------------------------------------------------------

resource "aws_s3_bucket" "uploads" {
  bucket = var.s3_bucket_name
}

resource "aws_s3_bucket_acl" "uploads" {
  bucket = aws_s3_bucket.uploads.bucket
  acl    = "private"
}

resource "aws_s3_bucket_cors_configuration" "uploads" {
  bucket = aws_s3_bucket.uploads.bucket

  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["GET", "PUT"]
    allowed_origins = ["*"]
    expose_headers = [
      "Origin",
      "Content-Type",
      "Content-MD5",
      "Content-Disposition",
    ]
    max_age_seconds = 3000
  }
}
