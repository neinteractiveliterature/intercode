# ---------------------------------------------------------------------------
# Access logging (optional)
#
# Delivers this distribution's access logs to a shared CloudWatch Logs
# destination, created once per deployment by the cloudfront_intercode_logging
# module. Standard logging v2 resources must live in us-east-1.
# ---------------------------------------------------------------------------

resource "aws_cloudwatch_log_delivery_source" "access_logs" {
  count    = var.access_logs_enabled ? 1 : 0
  provider = aws.us_east_1

  name         = "${var.name}-access-logs"
  log_type     = "ACCESS_LOGS"
  resource_arn = aws_cloudfront_distribution.this.arn
}

resource "aws_cloudwatch_log_delivery" "access_logs" {
  count    = var.access_logs_enabled ? 1 : 0
  provider = aws.us_east_1

  delivery_source_name     = aws_cloudwatch_log_delivery_source.access_logs[0].name
  delivery_destination_arn = var.access_log_delivery_destination_arn
}
