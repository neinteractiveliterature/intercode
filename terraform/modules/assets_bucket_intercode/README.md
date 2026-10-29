# assets_bucket_intercode Terraform module

Creates an S3 bucket that keeps the built assets of previous releases available after each deploy, so that a tab
opened before a deploy (or a cached page that names last release's files) can still load its chunks. The bucket is
meant to be the origin of the assets CloudFront distribution, in place of the Rails app or the `intercode-assets`
container.

- **Private S3 bucket** with a lifecycle rule that expires files `retention_days` after the release that dropped them
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
  retention_days               = 30
  cloudfront_distribution_arns = [aws_cloudfront_distribution.assets.arn]

  github_repository        = "neinteractiveliterature/intercode"
  github_oidc_provider_arn = aws_iam_openid_connect_provider.github.arn
}

resource "aws_cloudfront_distribution" "assets" {
  # ...
  default_root_object = "index.html"

  origin {
    origin_id                = "assets-bucket"
    domain_name              = module.assets_bucket.bucket_regional_domain_name
    origin_access_control_id = module.assets_bucket.origin_access_control_id
  }
}
```

The distribution doesn't need a custom origin config for S3; keep whatever viewer response headers (such as a
security-headers Lambda@Edge) you already have on its behavior.

Set a `default_root_object` on the distribution (any key that doesn't exist, such as `index.html`). The bucket policy
lets CloudFront list the bucket, so that a missing file is a 404 rather than a 403, and without a root object a request
for `/` returns a listing of every key.

## How releases upload

The release workflow (`.github/workflows/release.yml`) has two jobs, `assets-bucket-release-hashed` and
`assets-bucket-release-publish`, that run `.github/workflows/upload-assets-to-bucket.yml` in two phases. The hashed
files go up alongside the Fly deploy, since nothing refers to them until the entry files do; the entry files (which make
the new frontend live) and the obsolete marking wait for `fly-release`, so the new frontend never goes live before the
new backend. The workflow copies the release's `public/packs` out of the `intercode-assets` image and uploads it, but
the release jobs only run when the repository variable `ASSETS_BUCKET` is set. Set these repository variables from the module's outputs:

| Variable                 | Value                          |
| ------------------------ | ------------------------------ |
| `ASSETS_BUCKET`          | `bucket_name`                  |
| `ASSETS_UPLOAD_ROLE_ARN` | `release_upload_role_arn`      |
| `AWS_REGION`             | The bucket's region (optional) |

Retention counts from the release that **dropped** a file, not from when it was uploaded, so files the current
release uses never expire, however long it is between releases. S3 lifecycle rules can only count from an object's last
modification, so `script/uploadReleaseAssets.sh` does it in three steps:

1. It uploads **all** of the release's files, not just new ones. Uploading replaces the object, which clears the
   `obsolete` tag from a file that has come back into a release.
2. The unhashed entry files listed in `config/nocache-files.json` (`application.js`, `application-styles.js`) are
   uploaded with `Cache-Control: no-cache`; everything else gets a long `Cache-Control` matching what the assets nginx
   sends.
3. Any file in the bucket that this release doesn't contain, and that isn't already tagged, is copied onto itself with
   the tag `obsolete=true`. The copy resets its age, and the bucket's lifecycle rule expires objects with that tag
   `retention_days` later. A file that is already tagged isn't copied again, so its countdown isn't restarted.

The upload role can only upload, read and tag objects in this bucket; it can't delete anything, which is left to the
lifecycle rule.

To upload an already-built commit without a release, run the "Upload assets to bucket" workflow by hand and give it
the commit's full SHA. The upload role only trusts the refs in `github_oidc_subjects` (any release tag by default), so
a manual run has to start from a ref the role trusts; add `repo:<owner>/<repo>:ref:refs/heads/main` to
`github_oidc_subjects` if you want to run it from `main`.

## Cutting over

1. Apply this module and run a release (or upload the current assets by hand) so the bucket is populated.
2. Check that the bucket serves what you expect through a test behavior or distribution before switching.
3. Change the assets distribution's origin to the bucket.

Uploading before switching means there is no window where assets are missing.

## Inputs

| Name                           | Description                                                                          | Default |
| ------------------------------ | ------------------------------------------------------------------------------------ | ------- |
| `bucket_name`                  | Name of the S3 bucket                                                                | —       |
| `retention_days`               | Days to keep a file after the release that dropped it                                | `30`    |
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
