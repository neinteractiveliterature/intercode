data "archive_file" "og_router" {
  type        = "zip"
  output_path = "${path.module}/og_router.zip"

  source {
    content  = file("${path.module}/../../../lambda/cloudfront-og-router/index.mjs")
    filename = "index.mjs"
  }

  source {
    content  = file("${path.module}/../../../lambda/cloudfront-og-router/package.json")
    filename = "package.json"
  }
}

resource "aws_iam_role" "lambda_edge" {
  name = "${var.name}-lambda-edge"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          Service = [
            "lambda.amazonaws.com",
            "edgelambda.amazonaws.com",
          ]
        }
        Action = "sts:AssumeRole"
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "lambda_edge_basic" {
  role       = aws_iam_role.lambda_edge.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

# Lambda@Edge functions must be deployed in us-east-1.
resource "aws_lambda_function" "og_router" {
  provider = aws.us_east_1

  function_name    = "${var.name}-og-router"
  filename         = data.archive_file.og_router.output_path
  source_code_hash = data.archive_file.og_router.output_base64sha256
  role             = aws_iam_role.lambda_edge.arn
  handler          = "index.handler"
  runtime          = "nodejs22.x"

  # Lambda@Edge requires a numbered version — publish = true creates one on
  # every deployment.
  publish = true
}
