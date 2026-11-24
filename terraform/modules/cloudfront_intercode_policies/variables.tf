variable "name" {
  description = "Prefix for the names of the policies."
  type        = string
}

variable "cdn_spa_shell_ttl" {
  description = "Cache TTL in seconds for /cdn-spa-shell responses and the default router behavior."
  type        = number
  default     = 86400
}

variable "og_shell_ttl" {
  description = "Cache TTL in seconds for /og-shell responses."
  type        = number
  default     = 3600
}

variable "static_shell_enabled" {
  description = "Whether to create the static shell policy (for distributions that serve index.html from a bucket)."
  type        = bool
  default     = true
}

variable "static_shell_ttl" {
  description = "Default cache TTL in seconds for the static shell (index.html) at the edge."
  type        = number
  default     = 60
}

variable "static_shell_max_ttl" {
  description = "Maximum TTL in seconds of the static shell policy. CloudFront caps both the cache time and the stale-while-revalidate window at this value, so raise it to give index.html a stale window longer than static_shell_ttl. Defaults to static_shell_ttl."
  type        = number
  default     = null
}
