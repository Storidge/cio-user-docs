# cio profile

<h3>Usage</h3>

**`cio profile COMMAND [<profile | volume>]`**

Create, display, list or remove profiles from datastore. Get profile from an existing volume.

<h3>Commands</h3>

- **create** : Save profile to datastore
- **info** : Display a profile in datastore
- **list** : List profiles in datastore
- **remove** : Remove profile from datastore
- **show** : Display profile of volume in yaml format

## **create**

<h3>Usage</h3>

**`cio profile create <profile>`**
**`cio profile add <profile>`**

Save a profile to the datastore from a yaml config file.

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
    interval: 60
    max: 10
```

Save profile TEST to the datastore.
```
$ cio profile create TEST
Succeed: Create profile: Profile TEST saved
```

## **info**

<h3>Usage</h3>

**`cio profile info <profile>`**
**`cio profile inspect <profile>`**

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
  replication:
    enabled: no
    destination: none
    interval: 120
    type: synchronous
  snapshot:
    enabled: no
    interval: 60
    max: 10
```

## **list**

<h3>Usage</h3>

**`cio profile ls`**
**`cio profile list`**

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

## **remove**

<h3>Usage</h3>

**`cio profile rm <profile>`**
**`cio profile remove <profile>`**
**`cio profile delete <profile>`**

Remove a profile from the datastore.

<h3>Examples</h3>

```
$ cio profile rm TEST
Succeed: Remove profile: Profile TEST removed
```

## **show**

<h3>Usage</h3>

**`cio profile show <volume>`**

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
