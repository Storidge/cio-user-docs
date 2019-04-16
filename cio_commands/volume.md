# cio volume

**`cio volume COMMAND [options]`**

Create, get info, list, move, remove, and update volumes.

## **create**

**`cio volume create [options]`**

Create a volume.

#### **Options**

- **--bandwidthmin &lt;min bandwidth&gt;** : Set the minimum bandwidth in MiB/s.

- **--bandwidthmax &lt;max bandwidth&gt;** : Set the maximum bandwidth in MiB/s.

- **-c , --capacity &lt;size&gt;** : Set volume size in GB. Defaults to 20 GB.

- **-d , --dedupe** : Enable de-duplication.

- **-D , --directory &lt;directory&gt;** : Set bind mount directory for Docker. Defaults to `/cio`

- **-e , --encryption** : Enable encryption.

- **-f , --filesystem &lt;filesystem type&gt;** : Set a filesystem.

- **-h , --help** : Show usage information.

- **--iopsmin &lt;min IOPS&gt;** : Set minimum IOPS.

- **--iopsmax &lt;max IOPS&gt;** : Set maximum IOPS.

- **-I , --interface &lt;interface parameters...&gt;** : Set interface parameters.

- **--interval &lt;snapshot interval&gt;** : Set snapshot interval in minutes.

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

#### **Examples**

Create a volume.

```
$ cio volume create
Succeed: Add vd5: Type:2-copy, Size:20GB
```
Create a volume named 'Hello' with a capacity of 5 GB, a redundancy level of 3, and thick provisioning.
```
$ cio volume create -v Hello -c 5 -l 3 -P thick
Succeed: Add vd2: Type:3-copy, Size:5GB
```

## **help**

**`cio volume --help`**

Display `cio volume` commands with usage information.

#### **Example**

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

**`cio volume info [<volumename>] [options]`**

Display volume info by name or id.

#### **Options**

- **--attachstatus** : Display attach status.

- **--clusterid** : Display cluster id.

- **--container** : Display containers.

- **-D , --directory** - Display mount directory.

- **--datasetid** - Display dataset id.

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

#### **Examples**

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

**`cio volume ls [options]`**
**`cio volume list [options]`**

List all of the volumes on the cluster.

#### **Options**

- **-a , --allocated** : Display the list of volumes with a column showing the percentage of allocated capacity.

- **-n , --node &lt;nodename&gt;** : List volumes on a specific node by name.

- **-N , --nodeid &lt;nodeid&gt;** : List volumes on a specific node by id.

- **--nounits** : Display volume information using byte units.

#### **Examples**

List all the volumes on the cluster.

```
$ cio volume ls
NODENAME             VDISK     DRIVE TYPE                    SIZE  UUID      VOLUMENAME
n3                   vd1       SSD   2-copy                  20GB  44ddb75f  portainer         
n3                   vd2       SSD   2-copy                  20GB  bc31c6de  my-volume               
n3                   vd3       SSD   2-copy                  20GB  24448206  another-volume         
n3                   vd4       SSD   2-copy                  20GB  837d83b2                
n2                   vd5       SSD   2-copy                  20GB  18268962               
n1                   vd6       SSD   2-copy                  50GB  1ff59356  Hello
```

List all of the volumes on the node named 'n3' and display allocated capacity percentages.

```
$ cio volume ls -a -n n3
NODENAME             VDISK     DRIVE TYPE                    SIZE  UUID      VOLUMENAME             ALLOCATED
n3                   vd1       SSD   2-copy                  20GB  44ddb75f  portainer                   0.4%
n3                   vd2       SSD   2-copy                  20GB  bc31c6de  my-volume                   0.4%
n3                   vd3       SSD   2-copy                  20GB  24448206  another-volume              0.4%
n3                   vd4       SSD   2-copy                  20GB  837d83b2                              0.4%
```

## **move**

**`cio volume move [<volumename>] [options]`**

Move a volume between nodes. Open volumes cannot be moved.

#### **Options**

- **-v , --volume &lt;volumename&gt;** : Specify volume name of the volume to move.

- **-V , --vdisk &lt;id&gt;** : Specify volume id of the volume to move.

- **-n , --node &lt;dst nodename&gt;** : Identify destination node node name.

- **-N , --nodeid &lt;dst nodeid&gt;** : Identify destination node by node id.

#### **Examples**

Move open volume portainer from node n3 to node n1.
```
$ cio volume move portainer -n n1
Fail: Move vd1: vdisk is opened
```
Move closed volume Hello from node n3 to node n1.
```
$ cio volume move Hello -n n1
Succeed: Move vd2 from 99f8673e to f2385660
```

## **remove**

**`cio volume rm [<volumename>] [options]`**
**`cio volume remove [<volumename>] [options]`**

Remove a volume.  

#### **Options**

- **-v , --volume &lt;volumename&gt;** : Specify name of volume to delete.

- **-V , --vdisk &lt;id&gt;** : Specify id of volume to delete.

- **-y , --yes** : Do not prompt for removal confirmation.

#### **Examples**

Remove volume toRemove by name.
```
$ cio volume rm toRemove
This operation will remove the vdisk and delete all existing data! Please confirm you wish to proceed [Y/N]: Y
Succeed: Remove vd3
```
Remove volume toRemove by id without confirmation.
```
$ cio volume rm -y -V 3
Succeed: Remove vd3
```
## **update**

**`cio volume update [<volumename>] [options]`**

Update a volume's attributes.  

#### **Options**

- **--attachstatus &lt;attach status&gt;** : Set attachment status.

- **--add-container &lt;container id> &lt;container image> [container name]** : Add a container.

- **--bandwidthmin &lt;min BW&gt;** : Set minimum bandwidth in MiB/s.

- **--bandwidthmax &lt;max BW&gt;** : Set maximum bandwidth in MiB/s.

- **-c , --capacity &lt;size in GB&gt;** : Set capacity in GB. Must be greater than current capacity.

- **--clusterid &lt;cluster id&gt;** : Set cluster id.

- **-D , --directory &lt;directory&gt;** : Set bind mount directory for Docker.

- **--datasetid &lt;dataset id&gt;** : Set dataset id.

- **-g , --grow &lt;size in GB&gt;** : Grow volume by size in GB.

- **--iopsmin &lt;min IOPS&gt;** : Set minimum IOPS.

- **--iopsmax &lt;max IOPS&gt;** : Set maximum IOPS.

- **--label &lt;key>=<value&gt;** : Add a label to this volume.

- **-p , --profile &lt;profile&gt;** : Use profile to modify volume.

- **--remove-container &lt;id | all&gt;** : Remove one container or all containers.

- **-S , --status &lt;status&gt;** : Set volume status.

- **-U , --userid &lt;user id&gt;** : Set user id.

- **-u , --uuid &lt;uuid&gt;** : Specify uuid of volume to modify.

- **-v , --volume &lt;volumename&gt;** : Specify volume name of volume to modify.

- **-V , --vdisk &lt;id&gt;** : Specify volume id of volume to modify.

- **-y , --yes** : Automatically confirm volume deletion.


#### **Examples**

Update volume portainer capacity from 20 GB to 25 GB.
```
$ cio volume update portainer -c 25
Succeed: Update vd1 capacity: increased to 25GB
```
