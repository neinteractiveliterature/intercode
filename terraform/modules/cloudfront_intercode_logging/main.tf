terraform {
  required_providers {
    aws = {
      source                = "hashicorp/aws"
      version               = ">= 5.0"
      configuration_aliases = [aws.us_east_1]
    }
  }
}

# Standard logging v2 only delivers to a log group in us-east-1, and the metric
# and alarm below have to be in the same region as the log group.

resource "aws_cloudwatch_log_group" "access_logs" {
  provider = aws.us_east_1

  name              = "/cloudfront/${var.name}"
  retention_in_days = var.retention_in_days
}

resource "aws_cloudwatch_log_delivery_destination" "access_logs" {
  provider = aws.us_east_1

  name          = "${var.name}-access-logs"
  output_format = "json"

  delivery_destination_configuration {
    destination_resource_arn = aws_cloudwatch_log_group.access_logs.arn
  }
}

# Count 5xx responses from any distribution delivering to the log group. 4xx is
# deliberately left out: anonymous visitors' /oauth_session/refresh 401s are
# expected and would swamp it.
resource "aws_cloudwatch_log_metric_filter" "five_xx" {
  provider = aws.us_east_1

  name           = "${var.name}-5xx"
  log_group_name = aws_cloudwatch_log_group.access_logs.name
  pattern        = "{ $.sc-status = \"5*\" }"

  metric_transformation {
    name          = "CloudFront5xxResponses"
    namespace     = "Intercode/${var.name}"
    value         = "1"
    default_value = "0"
  }
}

resource "aws_cloudwatch_metric_alarm" "five_xx" {
  provider = aws.us_east_1

  alarm_name          = "${var.name} CloudFront 5xx responses"
  alarm_description   = "CloudFront returned at least ${var.five_xx_threshold} 5xx responses in ${var.five_xx_period / 60} minutes, on any distribution logging to ${aws_cloudwatch_log_group.access_logs.name}."
  namespace           = aws_cloudwatch_log_metric_filter.five_xx.metric_transformation[0].namespace
  metric_name         = aws_cloudwatch_log_metric_filter.five_xx.metric_transformation[0].name
  statistic           = "Sum"
  period              = var.five_xx_period
  evaluation_periods  = 1
  threshold           = var.five_xx_threshold
  comparison_operator = "GreaterThanOrEqualToThreshold"
  treat_missing_data  = "notBreaching"

  alarm_actions = var.alarm_actions
}
