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

locals {
  # Map of SSM parameter name → value. Empty when var.ssm_name is null (no SSM writes).
  # This map is sensitive (contains api_key); use nonsensitive(keys(...)) for for_each.
  _ssm_values = var.ssm_name != null ? {
    FORWARDEMAIL_API_KEY = var.api_key
  } : {}

  _ssm_types = var.ssm_name != null ? {
    FORWARDEMAIL_API_KEY = "SecureString"
  } : {}
}

resource "aws_ssm_parameter" "params" {
  for_each = toset(nonsensitive(keys(local._ssm_values)))

  name  = "/${var.ssm_name}/${each.key}"
  type  = local._ssm_types[each.key]
  value = local._ssm_values[each.key]
}

moved {
  from = aws_ssm_parameter.forwardemail_api_key[0]
  to   = aws_ssm_parameter.params["FORWARDEMAIL_API_KEY"]
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
