variable "ssm_name" {
  description = "SSM path prefix (e.g. 'intercode_production'). Parameters are written at /{ssm_name}/SENTRY_*."
  type        = string
}

variable "organization" {
  description = "Sentry organization slug."
  type        = string
}

variable "project" {
  description = "Sentry project slug."
  type        = string
}

variable "release_token" {
  description = "Sentry auth token used for creating releases (e.g. via sentry-cli)."
  type        = string
  sensitive   = true
}

variable "traces_sample_rate" {
  description = "Sentry performance traces sample rate (0.0–1.0). If null, no SSM parameter is written."
  type        = string
  default     = null
}

variable "profiles_sample_rate" {
  description = "Sentry profiling sample rate (0.0–1.0). If null, no SSM parameter is written."
  type        = string
  default     = null
}
