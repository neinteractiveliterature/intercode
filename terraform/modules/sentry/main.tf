terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = ">= 5.0"
    }
    sentry = {
      source  = "jianyuan/sentry"
      version = ">= 0.15.0-beta3"
    }
  }
}

data "sentry_all_keys" "this" {
  organization = var.organization
  project      = var.project
}

locals {
  ssm_path_prefix = "/${var.ssm_name}"
  dsn             = data.sentry_all_keys.this.keys[0].dsn["public"]

  # Map of SSM parameter name → value for all module-managed parameters.
  # This map is sensitive (contains secrets); use nonsensitive(keys(...)) for for_each.
  _ssm_values = merge(
    {
      SENTRY_DSN             = local.dsn
      SENTRY_FRONTEND_DSN    = local.dsn
      SENTRY_ORGANIZATION_ID = var.organization
      SENTRY_PROJECT_SLUGS   = var.project
      SENTRY_RELEASE_TOKEN   = var.release_token
    },
    var.traces_sample_rate != null ? { SENTRY_TRACES_SAMPLE_RATE = var.traces_sample_rate } : {},
    var.profiles_sample_rate != null ? { SENTRY_PROFILES_SAMPLE_RATE = var.profiles_sample_rate } : {},
  )

  _ssm_types = merge(
    {
      SENTRY_DSN             = "SecureString"
      SENTRY_FRONTEND_DSN    = "SecureString"
      SENTRY_ORGANIZATION_ID = "String"
      SENTRY_PROJECT_SLUGS   = "String"
      SENTRY_RELEASE_TOKEN   = "SecureString"
    },
    var.traces_sample_rate != null ? { SENTRY_TRACES_SAMPLE_RATE = "String" } : {},
    var.profiles_sample_rate != null ? { SENTRY_PROFILES_SAMPLE_RATE = "String" } : {},
  )
}

resource "aws_ssm_parameter" "params" {
  for_each = toset(nonsensitive(keys(local._ssm_values)))

  name  = "${local.ssm_path_prefix}/${each.key}"
  type  = local._ssm_types[each.key]
  value = local._ssm_values[each.key]
}

moved {
  from = aws_ssm_parameter.sentry_dsn
  to   = aws_ssm_parameter.params["SENTRY_DSN"]
}
moved {
  from = aws_ssm_parameter.sentry_frontend_dsn
  to   = aws_ssm_parameter.params["SENTRY_FRONTEND_DSN"]
}
moved {
  from = aws_ssm_parameter.sentry_organization_id
  to   = aws_ssm_parameter.params["SENTRY_ORGANIZATION_ID"]
}
moved {
  from = aws_ssm_parameter.sentry_project_slugs
  to   = aws_ssm_parameter.params["SENTRY_PROJECT_SLUGS"]
}
moved {
  from = aws_ssm_parameter.sentry_release_token
  to   = aws_ssm_parameter.params["SENTRY_RELEASE_TOKEN"]
}
moved {
  from = aws_ssm_parameter.sentry_traces_sample_rate[0]
  to   = aws_ssm_parameter.params["SENTRY_TRACES_SAMPLE_RATE"]
}
moved {
  from = aws_ssm_parameter.sentry_profiles_sample_rate[0]
  to   = aws_ssm_parameter.params["SENTRY_PROFILES_SAMPLE_RATE"]
}
