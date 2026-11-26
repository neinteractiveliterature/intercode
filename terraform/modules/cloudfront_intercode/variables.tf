variable "name" {
  description = "Prefix for all resource names created by this module."
  type        = string
}

variable "rails_origin_domain" {
  description = "Domain name of the Rails origin (e.g. www.neilhosting.net)."
  type        = string
}

variable "rails_origin_keepalive_timeout" {
  description = "How many seconds CloudFront keeps an idle connection to the Rails origin open. Opening a new one adds a TCP and TLS handshake to a request."
  type        = number
  default     = 5
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

variable "static_shell_bucket_domain_name" {
  description = "Regional domain name of the S3 bucket holding the frontend build (index.html and assets/), from the assets_bucket_intercode module's bucket_regional_domain_name output. The distribution's ARN must be in the bucket's cloudfront_distribution_arns."
  type        = string
}

variable "static_shell_origin_access_control_id" {
  description = "ID of the origin access control for the static shell bucket (the assets_bucket_intercode module's origin_access_control_id output)."
  type        = string
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

variable "rails_response_headers_policy_id" {
  description = "ID of a response headers policy for the Rails pass-through behaviors (the rails_paths in routing.json), such as one that adds Server-Timing headers to see how long CloudFront takes to reach the origin."
  type        = string
  default     = null
}

variable "shared_policies" {
  description = "Cache and origin request policies to use, from the cloudfront_intercode_policies module's cache_policy_ids and origin_request_policy_ids outputs. An account can only hold a limited number of these, so give every distribution the same set. Without it, this distribution creates a set of its own."
  type = object({
    cache_policy_ids = object({
      no_cache     = string
      og_shell     = string
      static_shell = string
    })
    origin_request_policy_ids = object({
      forward_all = string
      og_shell    = string
    })
  })
  default = null
}
