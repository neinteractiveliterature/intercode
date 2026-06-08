terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = ">= 5.0"
    }
    http = {
      source  = "hashicorp/http"
      version = ">= 3.0"
    }
  }
}

resource "aws_ssm_parameter" "forwardemail_api_key" {
  count = var.ssm_name != null ? 1 : 0
  name  = "/${var.ssm_name}/FORWARDEMAIL_API_KEY"
  type  = "SecureString"
  value = var.api_key
}

data "http" "domains" {
  count = var.page_count

  url = "https://api.forwardemail.net/v1/domains?page=${count.index + 1}"

  request_headers = {
    Authorization = "Basic ${base64encode("${var.api_key}:")}"
  }
}

locals {
  pages = [for page in data.http.domains : jsondecode(page.response_body)]
  domains = toset(concat(local.pages...))

  # The API can occasionally return duplicate entries across pages; take the
  # first verification record for each domain.
  verification_records_with_dupes = {
    for domain in local.domains :
    domain["name"] => domain["verification_record"]...
  }

  verification_records_by_domain = {
    for domain, records in local.verification_records_with_dupes :
    domain => records[0]
  }
}
