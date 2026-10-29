#!/usr/bin/env python3
"""Marks the files in the assets bucket (see terraform/modules/assets_bucket_intercode) that earlier releases left
behind, and that this release no longer contains, as obsolete. That starts the bucket's lifecycle rule counting down
to their expiry.

Usage: script/mark_obsolete_assets.py <bucket> <prefix> < current-keys

<prefix> limits it to one part of the bucket (for example packs/ or assets/), and the bucket keys of this release's
files come in on standard input, one per line. Files outside the prefix are never touched.
"""
import os
import sys
from concurrent.futures import ThreadPoolExecutor

import boto3


def list_keys(s3, bucket, prefix):
    keys = set()
    for page in s3.get_paginator("list_objects_v2").paginate(Bucket=bucket, Prefix=prefix):
        keys.update(obj["Key"] for obj in page.get("Contents", []))
    return keys


# Copying an object onto itself with a new tag resets its age, so the lifecycle rule's days count from now. S3 only
# allows a copy onto itself if it changes the metadata, so replace the metadata with the same Cache-Control and
# Content-Type. Skip files that are already tagged, or their countdown would restart on every release.
def mark_obsolete(s3, bucket, key):
    tags = s3.get_object_tagging(Bucket=bucket, Key=key)["TagSet"]
    if any(tag["Key"] == "obsolete" for tag in tags):
        return
    print(f"Marking s3://{bucket}/{key} obsolete", flush=True)
    head = s3.head_object(Bucket=bucket, Key=key)
    same_metadata = {name: head[name] for name in ("CacheControl", "ContentType") if head.get(name)}
    s3.copy_object(
        Bucket=bucket,
        Key=key,
        CopySource={"Bucket": bucket, "Key": key},
        MetadataDirective="REPLACE",
        TaggingDirective="REPLACE",
        Tagging="obsolete=true",
        **same_metadata,
    )


def main(bucket, prefix):
    current_keys = {line.strip() for line in sys.stdin if line.strip()}
    s3 = boto3.client("s3")
    dropped = sorted(list_keys(s3, bucket, prefix) - current_keys)

    # Each file takes three API calls, and a release that renames most of its chunks leaves hundreds of files to mark,
    # so run several at once. Consuming the results re-raises the first failure, which fails the script.
    workers = int(os.environ.get("MARK_OBSOLETE_PARALLELISM", "16"))
    with ThreadPoolExecutor(max_workers=workers) as pool:
        list(pool.map(lambda key: mark_obsolete(s3, bucket, key), dropped))


if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2])
