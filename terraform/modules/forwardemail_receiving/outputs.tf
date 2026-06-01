output "verification_records_by_domain" {
  description = "Map of domain name to forwardemail verification record. Pass individual values to a forwardemail_receiving_domain DNS module."
  value       = local.verification_records_by_domain
}
