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
