variable "api_key" {
  description = "forwardemail.net API key."
  type        = string
  sensitive   = true
}

variable "page_count" {
  description = "Number of domain list pages to fetch from the forwardemail API (100 domains per page). Increase if the account has more than 100 * page_count domains."
  type        = number
  default     = 2
}
