# Add a node

You can scale the performance and capacity of a cluster by adding nodes. 

1. Open a terminal, ssh into the sds node and run the `cioctl join-token` command. This outputs a `cioctl join` command, a `token` and a `cioctl add` command. 

   ```
   # cioctl join-token
   Issue a join request to the primary node by running the following command on the new storage node:
       cioctl join 192.168.1.41 root c1ed56b7

   After the join request is received, add the new node to the cluster by entering the following command on the primary node:
       cioctl add c1ed56b7
   ```

   **Note:**  the `cioctl join-token` will only run on the sds node. Running the command on a non-sds node will return an error. 

2. Open a terminal, ssh into the storage node to be added. Run the `cioctl join` command produced by the `cioctl join-token` output to join the storage node (c44 in this example) to the cluster. 

   ```
   # cioctl join 192.168.1.41 root c1ed56b7
   There are multiple IP addresses on this system (192.168.1.44 on ens10f0, 10.10.1.44 on ens10f1, 192.168.122.1 on virbr0).
   Re-run the join command by specifying the IP address with the --ip flag, e.g.:
       cioctl join 192.168.1.41 root c1ed56b7 --ip 192.168.1.44
   ```

   On a multi-homed machine, i.e. connected to multiple networks, `cioctl join` suggests the first IP address found. You can use the suggested IP address or select a different network interface by changing the IP address after the `--ip` flag. 

   ```
   # cioctl join 192.168.1.41 root c1ed56b7 --ip 192.168.1.44
   Adding this node to cluster as a storage node
   ```

3. Return to the sds node and run the `cioctl add` command produced by the `cioctl join-token` output. 

   ```
   # cioctl add c1ed56b7
   <13>Feb 17 10:15:42 cluster: Copy auto-multiNode-c41.cfg to all nodes (NODE_NUMS:4)
   <13>Feb 17 10:15:45 cluster: Initialize target
   ...
   ...
   <13>Feb 17 10:16:47 node: Initializing metadata
   <13>Feb 17 10:16:52 cluster: Starting cio daemon
   <13>Feb 17 10:16:53 cluster: Starting API
   ```

4. Run the `cio nodes` command to see the new node (c44).

   ```
   # cio nodes
   NODENAME             IP                NODE_ID    ROLE       STATUS
   c41                  192.168.1.41      a49d9ccc   sds        normal
   c42                  192.168.1.42      c236e059   backup1    normal
   c43                  192.168.1.43      06aa2eb7   backup2    normal
   c44                  192.168.1.44      b19dacaf   standard   normal
   ```

