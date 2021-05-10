---
title: Backup to AWS
description: configure backup to AWS repo
lang: en-US
---

# Backup

The Storidge cluster includes a built-in backup and restore capability to cover critical data management and protection use cases. This capability balances the needs of developers and operators, making it simple to deploy, and manage data for containerized applications at scale.

You can apply the backup and restore capability for the following use cases:

- Application migration
- Backup and recovery
- Cluster cloning for dev and test
- Disaster recovery

::: tip
The backup capability requires a Workgroup or Enterprise Edition license to operate
:::

In this guide we will walk through how to configure backups for containerized apps running on a Docker Swarm cluster. The backup data will be pushed to a S3 bucket on AWS.  

This guide assumes a Docker Swarm and Storidge cluster is already deployed that you wish to setup backup services for. If not, you can follow the steps [here](https://docs.storidge.com/docker_volumes/install.html) to deploy a cluster.

The instructions in this guide are organized in three sections:
- Setup AWS S3 bucket and backup user 
- Setup credentials to access AWS S3 repo
- Create backup service for volumes and stateful services 

## 1. Setup AWS S3 bucket

Setting up a backup repo using AWS S3 consists of two major steps:

- Create an S3 bucket
- Create backup user with access to only this bucket

### Create S3 bucket 

From AWS dashboard, select `/Services/S3/Create bucket`. Assign a unique bucket name (e.g. backup-123), enable versioning if desired, and click [Create bucket] button.

Verify that the new bucket shows on the list of S3 buckets. 

### Create backup user for bucket

1.	From AWS dashboard, select `/Services/IAM/Users`. Click [Add user] button and assign name (e.g. backup-user1). Set Assess type to “Programmatic access”.

2.	Set permissions

Click [Next: Permissions] button. This backup user only needs access to the S3 bucket just created (e.g. backup-123). Select “Attach existing policies directly”, which brings a list of pre-defined policies.

3.	Create policy

Click [Create policy] button to create a custom policy. This opens a new browser tab or window with a Visual Editor and JSON editor. 

Select the JSON tab. We will use JSON to define the policy using the reference template below. This template sets policies to (a) create, read and delete objects inside the S3 bucket, (b) list bucket, and (c) get bucket location. 

```
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "VisualEditor0",
            "Effect": "Allow",
            "Action": [
                "s3:PutObject",
                "s3:GetObject",
                "s3:DeleteObject"
            ],
            "Resource": "arn:aws:s3:::backup-123/*"
        },
        {
            "Sid": "VisualEditor1",
            "Effect": "Allow",
            "Action": "s3:ListBucket",
            "Resource": "arn:aws:s3:::backup-123"
        },
        {
            "Sid": "VisualEditor2",
            "Effect": "Allow",
            "Action": "s3:GetBucketLocation",
            "Resource": "arn:aws:s3:::backup-123"
        }
    ]
}
```

Copy and paste the template into the JSON editor and edit the resource for the correct bucket (e.g. backup-123). 

Click [Next: tags] button to continue. 

Click [Next: review] button. Enter the name and description for this policy, (e.g. backup-123). 

Click [Create policy] button. 

4. Create user and attach policy

Return to the previous browser window used to start creating a user. Refresh the display and use the search function to to find the newly created policy. Click the left checkbox to select the policy (e.g. backup-123).

Click [Next: tags] button to continue. 

Click [Next: review] button. This presents an overview of the user account to be created along with the policy to attach. 

Click [Create user] to complete the bucket setup. 

5. Download credentials

After successful creation of the backup user, credentials for the user is available for download. Download and copy the backup user credentials to a safe place. This csv file contains the `access key id` and `secret access key` for the backup user.

The S3 bucket is now ready for use. Next the `access key id` and `secret access key` will be used with the `cio credential` command to connect the Storidge backup service to the S3 bucket.

## 2. Setup credentials to access AWS repo

On the cluster where backup services will be started, setup credentials to access the AWS S3 bucket. For an AWS repository, the following four credentials are needed. Example: 
```
cio credential create cio_aws_backup_repo s3:https://s3.amazonaws.com/backup-123
cio credential create cio_aws_access_key AKIAYHD688GGWU68G2P6
cio credential create cio_aws_secret_key GO38PN/0k7nbPrxETCaeElhAxdsn8trVNsjhwgIT
cio credential create cio_aws_backup_password password
```

`cio_aws_backup_repo` points to the URL for the AWS S3 bucket.

The `cio_aws_access_key` and `cio_aws_secret_key` values are the AWS credentials for the backup user used to access to the AWS S3 bucket. 

`cio_aws_backup_password` sets the password for the backup repo. Modify as appropriate for your environment. 

For details on `cio credential` command, follow [link](https://docs.storidge.com/cio_cli/credential.html).

## 3. Create backup service  

Create a volume test for the backup service. 
```
cio volume create test -D
```

Enable backup on the volume. The backup interval is every one hour with a maximum of four most recent backups retained. 
```
cio backup create test --backupinterval 1 --backupmax 4 --provider aws
```

Confirm that a backup service has been enabled for the volume. Run:
```
[root@c1 config]# cio backup ls
NODENAME             VDISK     VOLUMENAME
c4                   vd3       mysql-2
c5                   vd4       mysql-4
c2                   vd5       mysql-3
c3                   vd6       backup
c2                   vd7       test
```

Backups in the repository will be indexed with a backup identifier. You can list the backup identifiers with `cio backup info --backupid --provider aws`. Example: 
```
[root@c1 config]# cio backup info --backupid --provider aws
BACKUPID  TIME                 HOST          SOURCE                             PATH
0bf5b0bb  2021-05-09 20:42:28  574eafb9ac1f  478166ef:test            /data
6a80d9f4  2021-05-09 21:42:29  e226779264bf  478166ef:test            /data
00b8ae08  2021-05-09 22:42:28  744fb87801a4  478166ef:test            /data
e13b56bd  2021-05-09 23:42:26  2318516c8376  478166ef:test:profile    /data/.backup/profile
95836b8e  2021-05-09 23:42:28  2318516c8376  478166ef:test            /data
```

For details on `cio backup` command, follow [link](https://docs.storidge.com/cio_cli/backup.html).
