variable "bucket_name" {
  description = "Name of the S3 bucket that holds the built assets. Also used to name the origin access control and the upload role."
  type        = string
}

variable "retention_days" {
  description = "How long to keep a file after the release that dropped it. Files in the current release never expire."
  type        = number
  default     = 30
}

variable "cloudfront_distribution_arns" {
  description = "ARNs of the CloudFront distributions allowed to read the bucket through the origin access control. No bucket policy is created while this is empty."
  type        = list(string)
  default     = []
}

variable "github_repository" {
  description = "GitHub repository (owner/name) whose release workflow uploads the assets. No upload role is created when null."
  type        = string
  default     = null
}

variable "github_oidc_subjects" {
  description = "Values of the OIDC token's sub claim allowed to assume the upload role (wildcards allowed). Defaults to any tag in github_repository, which is the ref a release workflow runs on."
  type        = list(string)
  default     = null
}

variable "create_github_oidc_provider" {
  description = "Whether to create the account's GitHub Actions OIDC provider. An account can only have one, so leave this false and pass github_oidc_provider_arn if it already exists."
  type        = bool
  default     = false
}

variable "github_oidc_provider_arn" {
  description = "ARN of the account's existing GitHub Actions OIDC provider. Required when github_repository is set and create_github_oidc_provider is false."
  type        = string
  default     = null
}
