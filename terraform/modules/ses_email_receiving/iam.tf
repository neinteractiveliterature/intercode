resource "aws_iam_group_policy" "email_receiving" {
  name  = "${var.name}-email-receiving"
  group = var.iam_group_name

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "S3InboxAccess"
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
        Resource = "${aws_s3_bucket.inbox.arn}/*"
      },
      {
        Sid      = "SnsInboxAccess"
        Effect   = "Allow"
        Action   = ["sns:ConfirmSubscription"]
        Resource = aws_sns_topic.inbox_deliveries.arn
      },
      {
        Sid      = "KmsAccess"
        Effect   = "Allow"
        Action   = "kms:Decrypt"
        Resource = "arn:aws:kms:${local.region}:${local.account_id}:alias/aws/ses"
      },
    ]
  })
}
