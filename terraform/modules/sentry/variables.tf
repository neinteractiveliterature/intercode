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
