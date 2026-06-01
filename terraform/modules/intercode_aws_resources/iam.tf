locals {
  region     = data.aws_region.current.region
  account_id = data.aws_caller_identity.current.account_id

  # Build the list of S3 resource ARNs the app needs object-level access to.
  s3_object_arns = compact([
    "${aws_s3_bucket.uploads.arn}/*",
    var.inbox_bucket_arn != null ? "${var.inbox_bucket_arn}/*" : null,
  ])
}

resource "aws_iam_group" "this" {
  name = var.name
}

resource "aws_iam_group_policy" "this" {
  name  = var.name
  group = aws_iam_group.this.name

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = concat(
      [
        {
          Sid    = "S3ObjectAccess"
          Effect = "Allow"
          Action = [
            "s3:GetObjectVersion",
            "s3:DeleteObjectVersion",
            "s3:DeleteObject",
            "s3:GetObject",
            "s3:GetObjectAcl",
            "s3:PutObject",
            "s3:PutObjectAcl",
            "s3:RestoreObject",
          ]
          Resource = local.s3_object_arns
        },
        {
          Sid      = "S3BucketAccess"
          Effect   = "Allow"
          Action   = ["s3:GetBucketLocation", "s3:ListAllMyBuckets", "s3:ListBucket"]
          Resource = "arn:aws:s3:::*"
        },
        {
          Sid    = "SqsAccess"
          Effect = "Allow"
          Action = [
            "sqs:ChangeMessageVisibility",
            "sqs:ChangeMessageVisibilityBatch",
            "sqs:DeleteMessage",
            "sqs:DeleteMessageBatch",
            "sqs:GetQueueAttributes",
            "sqs:GetQueueUrl",
            "sqs:ReceiveMessage",
            "sqs:SendMessage",
            "sqs:SendMessageBatch",
            "sqs:ListQueues",
          ]
          Resource = "arn:aws:sqs:${local.region}:${local.account_id}:${var.name}_*"
        },
        {
          Sid      = "SesAccess"
          Effect   = "Allow"
          Action   = ["ses:SendRawEmail", "ses:SendBounce"]
          Resource = "*"
        },
        {
          Sid    = "CloudwatchSchedulerProvisioning"
          Effect = "Allow"
          Action = [
            "sqs:CreateQueue",
            "sqs:GetQueueAttributes",
            "sqs:SetQueueAttributes",
          ]
          Resource = [
            "arn:aws:sqs:${local.region}:${local.account_id}:${var.name}_cloudwatch_scheduler",
            "arn:aws:sqs:${local.region}:${local.account_id}:${var.name}_cloudwatch_scheduler-failures",
          ]
        },
        {
          Sid      = "CloudwatchSchedulerAccess"
          Effect   = "Allow"
          Action   = ["events:PutRule", "events:PutTargets"]
          Resource = "*"
        },
      ],
      # Optional: SNS ConfirmSubscription for the inbox deliveries topic
      var.inbox_sns_topic_arn != null ? [{
        Sid      = "SnsInboxAccess"
        Effect   = "Allow"
        Action   = ["sns:ConfirmSubscription"]
        Resource = var.inbox_sns_topic_arn
      }] : [],
      # Optional: KMS Decrypt for SES
      var.kms_key_arn != null ? [{
        Sid      = "KmsAccess"
        Effect   = "Allow"
        Action   = "kms:Decrypt"
        Resource = var.kms_key_arn
      }] : [],
    )
  })
}

resource "aws_iam_user" "this" {
  name = var.name
}

resource "aws_iam_user_group_membership" "this" {
  user   = aws_iam_user.this.name
  groups = [aws_iam_group.this.name]
}

resource "aws_iam_access_key" "this" {
  user = aws_iam_user.this.name
}
