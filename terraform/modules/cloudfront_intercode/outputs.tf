output "distribution_id" {
  description = "CloudFront distribution ID."
  value       = aws_cloudfront_distribution.this.id
}

output "distribution_domain_name" {
  description = "CloudFront distribution domain name (e.g. d1234.cloudfront.net). Use this as the CNAME target for convention domains."
  value       = aws_cloudfront_distribution.this.domain_name
}

output "distribution_hosted_zone_id" {
  description = "CloudFront hosted zone ID. Use this for Route 53 alias records."
  value       = aws_cloudfront_distribution.this.hosted_zone_id
}
