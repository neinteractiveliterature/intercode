# cloudfront_intercode_logging Terraform module

Shared access logging and a 5xx alarm for any number of
[`cloudfront_intercode`](../cloudfront_intercode) distributions. Create it once
per deployment, then pass its `delivery_destination_arn` to each distribution.

It creates:

- A CloudWatch log group (`/cloudfront/<name>`, 30-day retention by default)
- A CloudWatch Logs delivery destination pointing at that log group
- A metric filter counting responses with a `5xx` status
- An alarm that fires when the count reaches `five_xx_threshold` within
  `five_xx_period` seconds, across all distributions logging to the group

4xx responses are deliberately not alarmed on: anonymous visitors' expected
`401`s from `/oauth_session/refresh` would swamp it. The alarm counts responses
rather than computing a rate because these sites see only tens to hundreds of
requests a day, and a single failure would otherwise look like a high rate.

Standard logging v2 only delivers to us-east-1, so the log group, metric and
alarm all live there, and `alarm_actions` must be in us-east-1 too.

## Usage

```hcl
module "cloudfront_logging" {
  source = "path/to/modules/cloudfront_intercode_logging"

  providers = {
    aws.us_east_1 = aws.us_east_1
  }

  name          = "intercode-past-conventions"
  alarm_actions = [aws_sns_topic.alarms_us_east_1.arn]
}

module "cloudfront" {
  source = "path/to/modules/cloudfront_intercode"
  # ...

  access_log_delivery_destination_arn = module.cloudfront_logging.delivery_destination_arn
}
```

Each log line is JSON, so Logs Insights can break errors down by host and path,
for example:

```
filter `sc-status` like /^5/
| stats count(*) by `cs(Host)`, `cs-uri-stem`
```

## Inputs

| Name                | Description                                     | Default |
| ------------------- | ----------------------------------------------- | ------- |
| `name`              | Resource name prefix                            | —       |
| `retention_in_days` | Log retention                                   | `30`    |
| `alarm_actions`     | ARNs notified by the alarm (in us-east-1)       | `[]`    |
| `five_xx_threshold` | 5xx responses per period that trigger the alarm | `5`     |
| `five_xx_period`    | Seconds over which 5xx responses are counted    | `900`   |

## Outputs

| Name                       | Description                                                             |
| -------------------------- | ----------------------------------------------------------------------- |
| `delivery_destination_arn` | Pass as `access_log_delivery_destination_arn` to `cloudfront_intercode` |
| `log_group_name`           | Name of the access log group                                            |
