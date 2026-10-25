output "delivery_destination_arn" {
  description = "Pass this as access_log_delivery_destination_arn to each cloudfront_intercode module."
  value       = aws_cloudwatch_log_delivery_destination.access_logs.arn
}

output "log_group_name" {
  description = "Name of the CloudWatch log group holding the access logs."
  value       = aws_cloudwatch_log_group.access_logs.name
}
