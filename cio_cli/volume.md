# cio volume

<h3>Usage</h3>

**`cio volume COMMAND [options]`**

Create, get info, list, move, remove, and update volumes.

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

- **--bandwidthmin &lt;min bandwidth&gt;** : Set the minimum bandwidth in MiB/s.

- **--bandwidthmax &lt;max bandwidth&gt;** : Set the maximum bandwidth in MiB/s.

- **-c , --capacity &lt;size&gt;** : Set volume size in GB. Defaults to 20 GB.

- **-d , --dedupe** : Enable de-duplication.

- **-D , --directory &lt;directory&gt;** : Set bind mount directory for Docker. Defaults to `/cio/volumes`

- **-e , --encryption** : Enable encryption.

- **-f , --filesystem &lt;filesystem type&gt;** : Set a filesystem.

- **-h , --help** : Show usage information.

- **--iopsmin &lt;min IOPS&gt;** : Set minimum IOPS.

- **--iopsmax &lt;max IOPS&gt;** : Set maximum IOPS.

- **-I , --interface &lt;interface parameters...&gt;** : Set interface parameters.

- **--interval &lt;snapshot interval&gt;** : Set periodic snapshot interval in minutes.

- **--label &lt;key&gt;=&lt;value&gt;** : Add a label.

- **-l , --level &lt;2 | 3&gt;** : Set redundancy level to 2 or 3 copy.

- **-m , --compress** : Enable compression.

- **-n , --node &lt;nodename&gt;** : Create a volume on a specific node by name.

- **-N , --nodeid &lt;nodeid&gt;** : Create a volume on a specific node by id.

- **-o , --local** : create volume with the drives of the local node.

- **-p , --profile &lt;profile&gt;** : Create a volume configured with a profile.

- **-P , --provision &lt;thin | thick&gt;** : Set thin or thick volume provisioning.

- **-q , --quiet** : Display the assigned volume id.

- **-s , --snapshot** : Enable snapshots.

- **--snapshotMax &lt;max snapshots&gt;** : Set a maximum number of snapshots for the volume.

- **-t , --type &lt;SSD | HDD&gt;** : Set backend drive type.

- **-v , --volume &lt;volumename&gt;** : Set a volume name.

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

- **--clusterid** : Display cluster id.

- **-D , --directory** - Display mount directory.

- **-f , --filesystem** - Display filesystem details.

- **--label** - Display volume label(s).

- **-L , --long** - Display volume information in long format.

- **--nounits** - Display information in byte unit.

- **-u , --uuid &lt;uuid&gt;** : Display volume information selected by uuid.

- **-u , --uuid** - Display just volume uuid.

- **-v , --volume &lt;volumename&gt;** - Display volume information selected by volume name.

- **-v , --volume** : Display just volume name.

- **-V , --vdisk &lt;id&gt;** - Display volume information selected by vdisk ID.

- **-V , --vdisk** : Display just vdisk ID.

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

- **-a , --allocated** : Display the list of volumes with a column showing the percentage of allocated capacity.

- **-n , --node &lt;nodename&gt;** : List volumes on a specific node by name.

- **-N , --nodeid &lt;nodeid&gt;** : List volumes on a specific node by id.

- **--nounits** : Display volume information using byte units.

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

Move a volume to specified node. Do not move opened volumes mounted to an application.

<h3>Options</h3>

- **-v , --volume &lt;volumename&gt;** : Specify volume name of the volume to move.

- **-V , --vdisk &lt;id&gt;** : Specify volume id of the volume to move.

- **-n , --node &lt;dst nodename&gt;** : Identify destination node node name.

- **-N , --nodeid &lt;dst nodeid&gt;** : Identify destination node by node id.

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

- **--bandwidthmin &lt;min BW&gt;** : Set minimum bandwidth in MiB/s.

- **--bandwidthmax &lt;max BW&gt;** : Set maximum bandwidth in MiB/s.

- **-c , --capacity &lt;size in GB&gt;** : Set capacity in GB. Must be greater than current capacity.

- **--clusterid &lt;cluster id&gt;** : Set cluster id.

- **-D , --directory &lt;directory&gt;** : Set bind mount directory for Docker.

- **-g , --grow &lt;size in GB&gt;** : Grow volume by size in GB.

- **--iopsmin &lt;min IOPS&gt;** : Set minimum IOPS.

- **--iopsmax &lt;max IOPS&gt;** : Set maximum IOPS.

- **--label &lt;key>=<value&gt;** : Add a label to this volume.

- **-p , --profile &lt;profile&gt;** : Use profile to modify volume.

- **-S , --status &lt;status&gt;** : Set volume status.

- **-U , --userid &lt;user id&gt;** : Set user id.

- **-u , --uuid &lt;uuid&gt;** : Specify uuid of volume to modify.

- **-v , --volume &lt;volumename&gt;** : Specify volume name of volume to modify.

- **-V , --vdisk &lt;id&gt;** : Specify volume id of volume to modify.

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
