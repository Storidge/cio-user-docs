# cio volume

<h3>Usage</h3>

**`cio volume COMMAND [options]`**

Create, get info, list, move, remove, or update volume.

<h3>Commands</h3>

- **create** : Create a volume
- **info** : Display volume information by name or id
- **list** : List volumes in cluster or on a node
- **move** : Move volume to specified node
- **remove** : Remove a volume
- **update** : Update volume attributes

## **create**

<h3>Usage</h3>

**`cio volume create [options]`**
**`cio volume add [options]`**

Create a volume.

<h3>Options</h3>

- **--autoexpand** : Enable auto capacity expansion feature

- **--bandwidthmin &lt;min bandwidth&gt;** : Minimum bandwidth in MiB/s

- **--bandwidthmax &lt;max bandwidth&gt;** : Maximum bandwidth in MiB/s

- **-c , --capacity &lt;size&gt;** : Volume size in GiB

- **-d , --dedupe** : Enable de-duplication feature

- **-D , --directory &lt;directory&gt;** : Bind mount directory. Defaults to `/cio/volumes`

- **-e , --encryption** : Enable encryption feature

- **-f , --filesystem &lt;filesystem type&gt;** : Set filesystem to btrfs, ext4 or xfs

- **-h , --help** : Show usage information

- **--increment** : Set percentage of capacity to auto expand each time

- **--iopsmin &lt;min IOPS&gt;** : Guaranteed minimum IOPS

- **--iopsmax &lt;max IOPS&gt;** : Maximum IOPS allowed

- **-I , --interface &lt;interface parameters...&gt;** : Set interface parameters

- **--interval &lt;snapshot interval&gt;** : Snapshot interval in minutes

- **--label &lt;key&gt;=&lt;value&gt;** : Add label to volume

- **-l , --level &lt;2 | 3&gt;** : Set redundancy level to 1, 2 or 3 copy

- **--limit** : Set maximum number of times capacity can automatically increase

- **-m , --compress** : Enable compression feature

- **-n , --node &lt;nodename&gt;** : Create volume on named node

- **-N , --nodeid &lt;nodeid&gt;** : Create volume on node with node id

- **-o , --local** : Create volume on local drives only 

- **-p , --profile &lt;profile&gt;** : Use profile to create volume

- **-P , --provision &lt;thin | thick&gt;** : Select thin or thick provisioning

- **-q , --quiet** : Return assigned vdisk id

- **-s , --snapshot** : Enable snapshot feature

- **--snapshotMax &lt;max snapshots&gt;** : Set maximum number of snapshots

- **--threshold** : Set percentage capacity when expansion is triggered

- **-t , --type &lt;SSD | HDD&gt;** : Select backend drive type

- **-v , --volume &lt;volumename&gt;** : Set volume name

<h3>Examples</h3>

Create volume named 'foo' with default parameters

```
$ cio volume create foo
Succeed: Add vd5: Type:2-copy, Size:20GB
```
Create a volume named 'Hello' with a capacity of 5 GB, three copy redundancy, and thick provisioning.
```
$ cio volume create Hello -c 5 -l 3 -P thick
Succeed: Add vd2: Type:3-copy, Size:5GB
```

Create volume with auto expansion enabled and expansion threshold of 70%. Increase capacity 25% each time, and limit number of expansions to three. 
```
$ cio volume create auto --capacity 2 --autoexpand yes --threshold 70 --increment 25 --limit 3
Succeed: Add vd2: Type:2-copy, Size:2GB
```

Create volume named 'nginx' with profile NGINX
```
$ cio volume create nginx -p NGINX
Succeed: Add vd5: Type:2-copy, Size:25GB
```
Create volume 'manual' with manual snapshots, bind mount /cio/snap and max 10 snapshots
```
$ cio volume create manual -s -D /cio/snap --snapshotMax 10
Succeed: Add vd2: Type:2-copy, Size:20GB
```

Create volume 'rotate' with periodic snapshots every 60 minutes and max 24 snapshots
```
$ cio volume create rotate -s -D /cio/snap --interval 60 --snapshotMax 24
Succeed: Add vd3: Type:2-copy, Size:20GB
```

## **help**

<h3>Usage</h3>

**`cio volume --help`**

Display `cio volume` commands with usage information.

<h3>Examples</h3>

```
$ cio volume --help
Usage: cio volume COMMAND [<volumename>] [options]

Create, get info, list all, move, remove or update volumes

Commands:
    create    Create a volume
    help      Show command usage information
    info      Display volume information by name or id
    list      List volumes in cluster or on a node
    move      Move volume to specified node
    remove    Remove a volume
    update    Update volume attributes
```

## **info**

<h3>Usage</h3>

**`cio volume info [<volumename>] [options]`**
**`cio volume inspect [<volumename>] [options]`**

Display volume info by name or id.

<h3>Options</h3>

- **--clusterid** : Display cluster id

- **-D , --directory** : Display mount directory

- **-f , --filesystem** : Display filesystem

- **--label** : Display volume label(s)

- **-L , --long** : Display volume information in long format

- **--nounits** : Display information in byte unit

- **-u , --uuid &lt;uuid&gt;** : Display volume information by uuid

- **-u , --uuid** : Display volume uuid

- **-v , --volume &lt;volumename&gt;** : Display volume information by volume name

- **-v , --volume** : Display volume name

- **-V , --vdisk &lt;id&gt;** : Display volume information by vdisk id

- **-V , --vdisk** : Display vdisk id

<h3>Examples</h3>

Display info by volume name for a volume named portainer.

```
$ cio volume info portainer
vdisk                          1
uuid                           44ddb75f
node                           n3
ipaddr                         192.168.1.138
nodeid                         99f8673e
name                           portainer
capacity                       20GB
redundancy                     2
drive type                     SSD
local drive only               no
provisioning                   thin
minimum iops                   10
maximum iops                   10000000
directory                      /cio/portainer/vd1
encryption                     disabled
snapshot                       disabled
snapshot interval              0
maximum snapshots              0
filesystem                     xfs
labels                         
allocated                      0.4%
```
Display info by volume id for vd1.
```
$ cio volume info -V 1
vdisk                          1
uuid                           44ddb75f
node                           n3
ipaddr                         192.168.1.138
nodeid                         99f8673e
name                           portainer
capacity                       20GB
redundancy                     2
drive type                     SSD
local drive only               no
provisioning                   thin
minimum iops                   10
maximum iops                   10000000
directory                      /cio/portainer/vd1
encryption                     disabled
snapshot                       disabled
snapshot interval              0
maximum snapshots              0
filesystem                     xfs
labels                         
allocated                      0.4%
```
Display mount directory for portainer volume.
```
$ cio volume info portainer -D
/cio/portainer/vd1
```

## **list**

<h3>Usage</h3>

**`cio volume ls [options]`**
**`cio volume list [options]`**

List all volumes in a cluster or on a node

<h3>Options</h3>

- **-a , --allocated** : List volumes with percentage of allocated capacity

- **-n , --node &lt;nodename&gt;** : List volumes on node with node name

- **-N , --nodeid &lt;nodeid&gt;** : List volumes on node with node id

- **--nounits** : Display volume information using byte units

<h3>Examples</h3>

List all the volumes on the cluster.
```
$ cio volume ls

root@v4:/etc/storidge/profiles# cio volume ls
NODENAME             VDISK     DRIVE TYPE                    SIZE  UUID      VOLUMENAME
v2                   vd9       SSD   2-copy                  20GB  8f0db895  portainer
v4                   vd3       SSD   2-copy                  20GB  08ba8120  foo
v4                   vd4       SSD   2-copy                  20GB  ce34c0e2  manual
v1                   vd5       SSD   2-copy                  20GB  a79d2ebe  rotate
v2                   vd6       SSD   2-copy                  25GB  c678c49e  nginx
```

List all volumes on node named 'v2' with allocated capacity percentage.
```
$ cio volume ls -a -n v2
NODENAME             VDISK     DRIVE TYPE                    SIZE  UUID      VOLUMENAME             ALLOCATED
v2                   vd9       SSD   2-copy                  20GB  8f0db895  portainer                   0.4%
v2                   vd1       SSD   2-copy                  20GB  7a4d0803  bw                          0.4%
v2                   vd2       SSD   2-copy                  20GB  f5de8225  bwtest                      0.4%
v2                   vd6       SSD   2-copy                  25GB  c678c49e  nginx                       0.3%
```

## **move**

<h3>Usage</h3>

**`cio volume move [<volumename>] [options]`**

Move a volume to specified node. Do not move volumes opened by an application.

<h3>Options</h3>

- **-v , --volume &lt;volumename&gt;** : Volume name to move

- **-V , --vdisk &lt;id&gt;** : Vdisk id to move

- **-n , --node &lt;dst nodename&gt;** : Specify destination node by node name

- **-N , --nodeid &lt;dst nodeid&gt;** : Specify destination node by node id

<h3>Examples</h3>

Move volume foo to node v2.
```
$ cio volume move foo -n v2
Succeed: Move vd2 from 99f8673e to f2385660
```
Open volumes cannot be moved! 
```
$ cio volume move portainer -n v2
Fail: Move vd1: vdisk is opened
```

## **remove**

<h3>Usage</h3>

**`cio volume rm [<volumename>] [options]`**
**`cio volume remove [<volumename>] [options]`**

**`cio volume delete [<volumename>] [options]`**

Remove a volume.  

<h3>Options</h3>

- **-v , --volume &lt;volumename&gt;** : Specify name of volume to delete.

- **-V , --vdisk &lt;id&gt;** : Specify id of volume to delete.

- **-y , --yes** : Do not prompt for removal confirmation.

<h3>Examples</h3>

Remove volume foo by name.
```
$ cio volume rm foo
This operation will remove the vdisk and delete all existing data! Please confirm you wish to proceed [Y/N]: Y
Succeed: Remove vd3
```
Remove volume foo by volume id without confirmation.
```
$ cio volume rm -y -V 3
Succeed: Remove vd3
```
## **update**

<h3>Usage</h3>

**`cio volume update [<volumename>] [options]`**

Update a volume's attributes.  

<h3>Options</h3>

- **--autoexpand** : Re-enable auto expansion for volume

- **--bandwidthmin &lt;min BW&gt;** : Minimum bandwidth in MiB/s

- **--bandwidthmax &lt;max BW&gt;** : Maximum bandwidth in MiB/s

- **-c , --capacity &lt;size in GB&gt;** : Desired capacity in GiB. Must be greater than current capacity

- **-D , --directory &lt;directory&gt;** : Bind mount directory

- **-g , --grow &lt;size in GB&gt;** : Size in GiB to grow

- **--iopsmin &lt;min IOPS&gt;** : Guaranteed minimum IOPS

- **--iopsmax &lt;max IOPS&gt;** : Maximum IOPS allowed

- **--label &lt;key>=<value&gt;** : Update label on volume

- **-p , --profile &lt;profile&gt;** : Use profile to update volume

- **-S , --status &lt;status&gt;** : Set volume status

- **-U , --userid &lt;user id&gt;** : Set user id

- **-u , --uuid &lt;uuid&gt;** : Specify uuid of volume to modify

- **-v , --volume &lt;volumename&gt;** : Specify volume name to modify

- **-V , --vdisk &lt;id&gt;** : Specify vdisk id of volume to modify

<h3>Examples</h3>

Change volume portainer capacity from 20 GB to 25 GB.
```
$ cio volume update portainer -c 25
Succeed: Update vd9 capacity: increased to 25GB
```
Change IOPS limits on volume portainer.
```
$ cio volume update portainer --iopsmin 1000 --iopsmax 8500
Succeed: Update vd9 iops: iops_min:1000 iops_max:8500
```
