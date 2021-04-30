---
title: cio credential
description: Manage credentials for cloud providers and backup services
lang: en-US
---

# cio credential

<h3>Usage</h3>

`cio credential COMMAND [<CREDENTIALNAME>] <OPTIONS>`

Manage credentials for cloud providers and backup servers

<h3>Child commands</h3>

| Command                  | Description                                      |
|:-------------------------|:-------------------------------------------------|
| cio credential create    | Create credential for provider or backup service |
| cio credential list      | List all credentials                             |
| cio credential remove    | Remove a credential                              |
| cio credential validate* | Validate a credential                            |

## cio credential create

<h3>Usage</h3>

`cio credential create [<CREDENTIALNAME>] [VALUE]`

`cio credential add [<CREDENTIALNAME>] [VALUE]`

Create credential for provider or backup service

A Storidge cluster must have the following four credentials configured before it can backup, list or restore it's own volumes. Currently an AWS S3 bucket is supported as the backend for the backup service. 

| Credential               | Description                              |
|:-------------------------|:-----------------------------------------|
| cio_aws_restic_repo      | URL for AWS S3 bucket                    |
| cio_aws_access_key       | AWS access key for backup user           |
| cio_aws_secret_key       | AWS secret key for backup user           |
| cio_aws_restic_password  | Password for backup repository           |


For disaster recovery purposes, it is sometimes necessary to restore from the backup of a previous cluster. The credentials of the previous cluster (alternate) must first be configured before staring the restore service. The following four credentials for the alternate backup repo are: 

| Credential                   | Description                              |
|:-----------------------------|:-----------------------------------------|
| cio_aws_alt_restic_repo      | URL for AWS S3 bucket                    |
| cio_aws_alt_access_key       | AWS access key for backup user           |
| cio_aws_alt_secret_key       | AWS secret key for backup user           |
| cio_aws_alt_restic_password  | Password for backup repository           |

<h3>Examples</h3>

Create set of credentials for an AWS S3 repository
```
cio credential create cio_aws_restic_repo s3:https://s3.amazonaws.com/restic-12345678
cio credential create cio_aws_access_key AKIAYHD623GGZX7VCEMJ
cio credential create cio_aws_secret_key 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
cio credential create cio_aws_restic_password password
```

## cio credential list

<h3>Usage</h3>

`cio credential ls`

`cio credential list`

List all credentials

<h3>Examples</h3>

```
$ cio credential list
```

## cio credential remove

<h3>Usage</h3>

`cio credential remove [CREDENTIALNAME]`

`cio credential delete [CREDENTIALNAME]`

Remove a credential

<h3>Examples</h3>

```
$ cio credential remove cio_aws_restic_repo
```
