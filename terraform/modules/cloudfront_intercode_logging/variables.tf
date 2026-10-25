variable "name" {
  description = "Prefix for all resource names created by this module."
  type        = string
}

variable "retention_in_days" {
  description = "How long to keep access logs in CloudWatch Logs."
  type        = number
  default     = 30
}

variable "alarm_actions" {
  description = "ARNs to notify when the 5xx alarm fires, e.g. an SNS topic. The topic must be in us-east-1."
  type        = list(string)
  default     = []
}

variable "five_xx_threshold" {
  description = "Number of 5xx responses, across all distributions delivering to this module's log group, within one evaluation period that triggers the alarm."
  type        = number
  default     = 5
}

variable "five_xx_period" {
  description = "Length in seconds of the window over which 5xx responses are counted."
  type        = number
  default     = 900
}
