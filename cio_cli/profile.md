# cio profile

<h3>Usage</h3>

`cio profile COMMAND [<PROFILE | VOLUMENAME>]`

Create, display, list or remove profiles. Get profile from an existing volume.

<h3>Child commands</h3>

| Command            | Description                      |
|:-------------------|:---------------------------------|
| cio profile create | Save profile to datastore        |
| cio profile info   | Display a profile from datastore |
| cio profile list   | List profiles in datastore       |
| cio profile remove | Remove profile from datastore    |
| cio profile show   | Get profile from a volume        |

## cio profile create

<h3>Usage</h3>

`cio profile create <PROFILE>`

`cio profile add <PROFILE>`

Save a profile to the datastore from a yaml config file.

<h3>Parameters</h3>

| Key                | Valid Values      | Description                                 |
|:-------------------|:------------------|:--------------------------------------------|
| capacity           | NUMBER_IN_GB      | capacity in gigabytes                       |
| directory          | PATH_ON_HOST      | bind mount directory on the host            |
| filesystem         | btrfs, ext4, xfs  | file system to format and mount             |
| iops min           | 30 to 1,000,000   | minimum iops guaranteed                     |
| iops max           | 30 to 1,000,000   | maximum iops allowed                        |
| level              | 2, 3              | number of synchronous replicas              |
| provision          | thin, thick       | specify thin or thick provisioning          |
| type               | ssd, hdd          | select media type                           |
| **Auto Expansion** |                   |                                             |
| enabled            | yes, no           | enable auto expansion service               |
| increment          | PERCENTAGE_NUMBER | percentage of volume capacity to increment  |
| limit              | NUMBER            | maximum number of times to increment        |
| threshold          | PERCENTAGE_NUMBER | percentage of capacity to trigger expansion |
| **Compression**    |                   |                                             |
| enabled            | yes, no           | enable compression service                  |
| algorithm          | lzo, zlib, zstd   | compression method to use                   |
| **Snapshot**       |                   |                                             |
| enabled            | yes, no           | enable snapshot service                     |
| interval           | NUMBER_IN_MINUTES | interval for periodic snapshots in minutes  |
| max                | MAX_NUMBER        | maximum number of snapshots                 |

<h3>Examples</h3>

Create a yaml config file. For example, this file `TEST`:
```
capacity: 20
directory: /cio/volumes
iops:
  min: 1000
  max: 2000
level: 2
local: no
provision: thin
type: ssd
service:
  autoexpand:
    enabled: no
    threshold: 70
    increment: 25
    limit: 2
  compression:
    enabled: no
    algorithm: lzo
  dedupe: no
  encryption:
    enabled: no
  snapshot:
    enabled: no
    interval: 60
    max: 10
```

Save profile TEST to the datastore.
```
$ cio profile create TEST
Succeed: Create profile: Profile TEST saved
```

## cio profile info

<h3>Usage</h3>

`cio profile info <PROFILE>`

`cio profile inspect <PROFILE>`

Display profile info from datastore. 

<h3>Examples</h3>

```
$ cio profile info TEST
capacity: 20
directory: /cio/volumes
iops:
  min: 1000
  max: 2000
level: 2
local: no
provision: thin
type: ssd
service:
  compression: no
  dedupe: no
  encryption:
    enabled: no
  snapshot:
    enabled: no
    interval: 60
    max: 10
```

## cio profile list

<h3>Usage</h3>

`cio profile ls`

`cio profile list`

List profiles in the datastore.

<h3>Examples</h3>

```
$ cio profile list
PROFILE                                  DATE
MYSQL                                    Sat Apr 20 07:23:07 2019
MINIO                                    Sat Apr 20 07:23:07 2019
NGINX                                    Sat Apr 20 07:23:07 2019
INFS                                     Sat Apr 20 07:23:07 2019
LARGE                                    Sat Apr 20 07:23:07 2019
BRONZE                                   Sat Apr 20 07:23:07 2019
MEDIUM                                   Sat Apr 20 07:23:07 2019
GOLD                                     Sat Apr 20 07:23:07 2019
SMALL                                    Sat Apr 20 07:23:07 2019
SILVER                                   Sat Apr 20 07:23:07 2019
TEST                                     Sun Apr 21 13:58:23 2019
```

## cio profile remove

<h3>Usage</h3>

`cio profile rm <PROFILE>`

`cio profile remove <PROFILE>`

`cio profile delete <PROFILE>`

Remove a profile from the datastore.

<h3>Examples</h3>

```
$ cio profile rm TEST
Succeed: Remove profile: Profile TEST removed
```

## cio profile show

<h3>Usage</h3>

`cio profile show [<VOLUMENAME>]`

Get profile from a volume. Useful for redirecting to named profile and saving to datastore.

<h3>Examples</h3>

Display the profile of the portainer volume.
```
$ cio profile show portainer
---
capacity: 25
directory: /cio/portainer
iops:
  min: 10
  max: 10000000
level: 2
local: no
provision: thin
type: ssd
service:
  compression: no
  dedupe: no
  encryption:
    enabled: no
  replication:
    enabled: no
    destination: none
    interval: 120
    type: synchronous
  snapshot:
    enabled: no
    interval: 0
    max: 0

--- # vim:syntax=yaml:ts=8:sw=2:expandtab:softtabstop=2
```

Get profile from volume and save to a file.
```
$ cio profile show portainer > NEW

$ cat NEW
---
capacity: 20
directory: /cio/portainer
iops:
  min: 10
  max: 10000000
level: 2
local: no
provision: thin
type: ssd
service:
  compression: no
  dedupe: no
  encryption:
    enabled: no
  replication:
    enabled: no
    destination: none
    interval: 120
    type: synchronous
  snapshot:
    enabled: no
    interval: 0
    max: 0

--- # vim:syntax=yaml:ts=8:sw=2:expandtab:softtabstop=2
```
