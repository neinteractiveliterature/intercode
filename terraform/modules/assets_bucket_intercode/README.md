# assets_bucket_intercode Terraform module

Creates an S3 bucket that keeps the built assets of previous releases available after each deploy, so that a tab
opened before a deploy (or a cached page that names last release's files) can still load its chunks. The bucket is
meant to be the origin of the assets CloudFront distribution, in place of the Rails app or the `intercode-assets`
container.

- **Private S3 bucket** with a lifecycle rule that expires objects `retention_days` after they were last uploaded
- **CORS configuration** allowing `GET`/`HEAD` from any origin, matching the headers Rails and the assets nginx send
  today (convention domains load module scripts cross-origin from the assets host)
- **CloudFront origin access control**, and a bucket policy that lets the distributions you list read the bucket
- **Optional GitHub Actions OIDC role** that the release workflow assumes to upload, with only `s3:PutObject` and
  `s3:ListBucket` on this bucket

This module doesn't create the CloudFront distribution. Point your existing assets distribution at the bucket (see
[Cutting over](#cutting-over)), or use it as an additional origin of a distribution you manage.

## Usage

```hcl
module "assets_bucket" {
  source = "path/to/modules/assets_bucket_intercode"

  bucket_name                  = "intercode-assets-production"
  retention_days               = 90
  cloudfront_distribution_arns = [aws_cloudfront_distribution.assets.arn]

  github_repository        = "neinteractiveliterature/intercode"
  github_oidc_provider_arn = aws_iam_openid_connect_provider.github.arn
}

resource "aws_cloudfront_distribution" "assets" {
  # ...

  origin {
    origin_id                = "assets-bucket"
    domain_name              = module.assets_bucket.bucket_regional_domain_name
    origin_access_control_id = module.assets_bucket.origin_access_control_id
  }
}
```

The distribution doesn't need a custom origin config for S3; keep whatever viewer response headers (such as a
security-headers Lambda@Edge) you already have on its behavior.

## How releases upload

The release workflow (`.github/workflows/release.yml`) has an `assets-bucket-release` job that copies the release's
`public/packs` out of the `intercode-assets` image and uploads it, but only when the repository variable
`ASSETS_BUCKET` is set. Set these repository variables from the module's outputs:

| Variable                 | Value                          |
| ------------------------ | ------------------------------ |
| `ASSETS_BUCKET`          | `bucket_name`                  |
| `ASSETS_UPLOAD_ROLE_ARN` | `release_upload_role_arn`      |
| `AWS_REGION`             | The bucket's region (optional) |

Every release uploads **all** of its files, not just the new ones. The file names are content hashes, so a file that
didn't change is uploaded to the same key with the same content, and the upload resets its age. That is what keeps
files the current release still uses from expiring. The unhashed entry files listed in `config/nocache-files.json`
(`application.js`, `application-styles.js`) are uploaded with `Cache-Control: no-cache` and replaced each release;
everything else gets a long `Cache-Control` matching what the assets nginx sends.

Because ages only reset on release, `retention_days` has to be longer than the longest gap you expect between
releases. If it isn't, the live site's assets expire.

## Cutting over

1. Apply this module and run a release (or upload the current assets by hand) so the bucket is populated.
2. Check that the bucket serves what you expect through a test behavior or distribution before switching.
3. Change the assets distribution's origin to the bucket.

Uploading before switching means there is no window where assets are missing.

## Inputs

| Name                           | Description                                                                          | Default |
| ------------------------------ | ------------------------------------------------------------------------------------ | ------- |
| `bucket_name`                  | Name of the S3 bucket                                                                | —       |
| `retention_days`               | Days to keep an object after it was last uploaded                                    | `90`    |
| `cloudfront_distribution_arns` | CloudFront distributions allowed to read the bucket; no bucket policy while empty    | `[]`    |
| `github_repository`            | `owner/name` of the repository that uploads; no upload role when `null`              | `null`  |
| `github_oidc_subjects`         | Allowed OIDC `sub` claims; defaults to any tag in `github_repository`                | `null`  |
| `create_github_oidc_provider`  | Create the account's GitHub OIDC provider (only one can exist per account)           | `false` |
| `github_oidc_provider_arn`     | Existing GitHub OIDC provider ARN; required with `github_repository` unless creating | `null`  |

## Outputs

| Name                          | Description                                          |
| ----------------------------- | ---------------------------------------------------- |
| `bucket_name`                 | Assets bucket name                                   |
| `bucket_arn`                  | Assets bucket ARN                                    |
| `bucket_regional_domain_name` | Use as the CloudFront origin's `domain_name`         |
| `origin_access_control_id`    | Attach to the CloudFront origin                      |
| `release_upload_role_arn`     | Role the release workflow assumes; `null` if no role |
