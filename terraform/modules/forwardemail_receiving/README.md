# forwardemail_receiving Terraform module

Fetches domain and verification record data from the forwardemail.net API and
exposes a `domain => verification_code` map. Use the output to wire individual
domains into a `forwardemail_receiving_domain` DNS module.

No AWS resources are created; no IAM policy attachment is required.

## Usage

```hcl
module "forwardemail" {
  source  = "path/to/modules/forwardemail_receiving"
  api_key = var.forwardemail_api_key
}

module "my_domain_forwardemail" {
  source = "github.com/neinteractiveliterature/neil-terraform-modules//forwardemail_receiving_domain?ref=v1.0.0"

  cloudflare_zone   = cloudflare_zone.my_domain
  name              = "my-domain.com"
  verification_code = module.forwardemail.verification_records_by_domain["my-domain.com"]
}
```

## Inputs

| Name         | Description                                    | Default |
| ------------ | ---------------------------------------------- | ------- |
| `api_key`    | forwardemail.net API key (sensitive)           | —       |
| `page_count` | Pages to fetch from the API (100 domains/page) | `2`     |

## Outputs

| Name                             | Description                              |
| -------------------------------- | ---------------------------------------- |
| `verification_records_by_domain` | Map of domain name → verification record |
