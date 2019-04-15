# profile

**`cio profile COMMAND [<profile | volume>]`**

Create, get info about, list, or remove profiles from datastore. Show profile from an existing volume.

## **create**

**`cio profile create <profile>`**

Save a profile to the datastore from a yaml config file.

#### **Example**

Create a yaml config file. For example, this file `JNFS`:
```
capacity: 20
directory: /cio/JNFS
interface:
  type: nfs
  conf: someconf
  driver: macvlan
  network: some
iops:
  max: 2000
  min: 100
label: {}
level: 2
local: no
provision: thin
service:
  compression: no
  dedupe: no
  encryption:
    enabled: no
  replication:
    destination: none
    enabled: no
    interval: 120
    type: synchronous
  snapshot:
    enabled: no
    interval: 60
    max: 10
    start: 1440
type: ssd
```
Once the config file is ready save the profile to the datastore.
```
$ cio profile create JNFS
Succeed: Create profile: Profile JNFS saved
```

## **info**

**`cio profile info <profile>`**

Display profile info.

#### **Example**

```
$ cio profile info JNFS
capacity: 20
directory: /cio/JNFS
interface:
  type: nfs
  conf: someconf
  driver: macvlan
  network: some
iops:
  max: 2000
  min: 100
label: {}
level: 2
local: no
provision: thin
service:
  compression: no
  dedupe: no
  encryption:
    enabled: no
  replication:
    destination: none
    enabled: no
    interval: 120
    type: synchronous
  snapshot:
    enabled: no
    interval: 60
    max: 10
    start: 1440
type: ssd
```

## **list**

**`cio profile ls`**
**`cio profile list`**

List all the profiles saved to the datastore and the timestamps of their last updated.

#### **Example**

```
$ cio profile list
PROFILE                                  DATE
MEDIUM                                   Thu Apr  4 23:10:30 2019
BRONZE                                   Thu Apr  4 23:10:30 2019
SMALL                                    Thu Apr  4 23:10:30 2019
MYSQL                                    Thu Apr  4 23:10:30 2019
SILVER                                   Thu Apr  4 23:10:30 2019
LARGE                                    Thu Apr  4 23:10:30 2019
NGINX                                    Thu Apr  4 23:10:30 2019
MINIO                                    Thu Apr  4 23:10:30 2019
GOLD                                     Thu Apr  4 23:10:30 2019
INFS                                     Mon Apr  8 11:33:07 2019
JNFS                                     Sun Apr 14 02:15:20 2019
```

## **remove**

**`cio profile rm <profile>`**
**`cio profile remove <profile>`**

Remove a profile from the datastore.

#### **Example**

```
$ cio profile rm JNFS
Succeed: Remove profile: Profile JNFS removed
```

## **show**

**`cio profile show <volume>`**

Save a profile to the datastore from a yaml config file.

#### **Example**

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
