terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = ">= 5.0"
    }
    sentry = {
      source  = "jianyuan/sentry"
      version = ">= 0.15.0"
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
}

resource "aws_ssm_parameter" "sentry_dsn" {
  name  = "${local.ssm_path_prefix}/SENTRY_DSN"
  type  = "SecureString"
  value = local.dsn
}

resource "aws_ssm_parameter" "sentry_frontend_dsn" {
  name  = "${local.ssm_path_prefix}/SENTRY_FRONTEND_DSN"
  type  = "SecureString"
  value = local.dsn
}

resource "aws_ssm_parameter" "sentry_organization_id" {
  name  = "${local.ssm_path_prefix}/SENTRY_ORGANIZATION_ID"
  type  = "String"
  value = var.organization
}

resource "aws_ssm_parameter" "sentry_project_slugs" {
  name  = "${local.ssm_path_prefix}/SENTRY_PROJECT_SLUGS"
  type  = "String"
  value = var.project
}

resource "aws_ssm_parameter" "sentry_release_token" {
  name  = "${local.ssm_path_prefix}/SENTRY_RELEASE_TOKEN"
  type  = "SecureString"
  value = var.release_token
}
