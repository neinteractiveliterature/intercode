variable "name" {
  description = "Prefix for all resource names created by this module."
  type        = string
}

variable "rails_origin_domain" {
  description = "Domain name of the Rails origin (e.g. www.neilhosting.net)."
  type        = string
}

variable "assets_origin_domain" {
  description = "Domain name of the assets server (e.g. assets.neilhosting.net)."
  type        = string
}

variable "aliases" {
  description = "Additional CNAMEs for the CloudFront distribution (convention domains)."
  type        = list(string)
  default     = []
}

variable "acm_certificate_arn" {
  description = "ARN of an ACM certificate in us-east-1 covering all aliases. Required when aliases is non-empty."
  type        = string
  default     = null
}

variable "price_class" {
  description = "CloudFront price class."
  type        = string
  default     = "PriceClass_100"
}

variable "static_shell_enabled" {
  description = "Serve the framework-mode shell from an S3 bucket instead of Rails. Needs static_shell_bucket_domain_name and static_shell_origin_access_control_id. A separate variable because those usually come from a bucket created in the same apply, and are then unknown at plan time."
  type        = bool
  default     = false
}

variable "static_shell_bucket_domain_name" {
  description = "Regional domain name of the S3 bucket holding the framework-mode build (index.html and assets/), from the assets_bucket_intercode module's bucket_regional_domain_name output. With static_shell_enabled, the default behavior serves index.html from the bucket, /assets/* comes from the bucket, and the router sends crawlers and Rails paths to the Rails origin. Needs static_shell_origin_access_control_id, and the distribution's ARN in the bucket's cloudfront_distribution_arns."
  type        = string
  default     = null
}

variable "static_shell_origin_access_control_id" {
  description = "ID of the origin access control for the static shell bucket (the assets_bucket_intercode module's origin_access_control_id output). Required with static_shell_enabled."
  type        = string
  default     = null
}

variable "static_shell_ttl" {
  description = "Cache TTL in seconds for the static shell (index.html) at the edge. The release upload gives index.html the same max-age."
  type        = number
  default     = 60
}

variable "og_shell_ttl" {
  description = "Cache TTL in seconds for /og-shell responses."
  type        = number
  default     = 3600
}

variable "cdn_spa_shell_ttl" {
  description = "Cache TTL in seconds for /cdn-spa-shell responses."
  type        = number
  default     = 86400
}

variable "access_logs_enabled" {
  description = "Whether to deliver access logs to access_log_delivery_destination_arn. This is a separate flag, rather than checking the ARN for null, because the ARN is unknown at plan time when the logging module is created in the same apply."
  type        = bool
  default     = false
}

variable "access_log_delivery_destination_arn" {
  description = "ARN of the CloudWatch Logs delivery destination to send access logs to (the delivery_destination_arn output of the cloudfront_intercode_logging module). Required when access_logs_enabled is true."
  type        = string
  default     = null
}
