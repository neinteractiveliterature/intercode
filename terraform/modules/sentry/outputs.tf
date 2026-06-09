output "ssm_parameters_version" {
  description = "Opaque hash that changes whenever any SSM parameter managed by this module changes. Use as a trigger to restart services that load config at startup."
  value       = sha256(jsonencode({ for k, p in aws_ssm_parameter.params : k => p.version }))
}
