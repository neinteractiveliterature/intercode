output "bucket_name" {
  description = "Assets bucket name. Set it as the ASSETS_BUCKET variable on the GitHub repository."
  value       = aws_s3_bucket.assets.id
}

output "bucket_arn" {
  description = "Assets bucket ARN."
  value       = aws_s3_bucket.assets.arn
}

output "bucket_regional_domain_name" {
  description = "Bucket domain name to use as the CloudFront origin's domain_name."
  value       = aws_s3_bucket.assets.bucket_regional_domain_name
}

output "origin_access_control_id" {
  description = "ID of the origin access control to attach to the CloudFront origin."
  value       = aws_cloudfront_origin_access_control.assets.id
}

output "release_upload_role_arn" {
  description = "ARN of the role the release workflow assumes to upload assets. Set it as the ASSETS_UPLOAD_ROLE_ARN variable on the GitHub repository. Null when github_repository is not set."
  value       = one(aws_iam_role.release_upload[*].arn)
}
