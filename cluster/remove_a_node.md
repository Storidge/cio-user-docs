# **Remove a node**

You can remove resources from a cluster when they are no longer needed. Three nodes are the minimum requirement. However to allow room for a node failure, four is the recommended minimum number of nodes in a cluster.

1. Open a terminal, ssh into the node to be removed (node c44 in this example) and run the `cioctl remove` command. 

   ```
   # cioctl remove
   ```

   This starts a process to remove metadata of the node from the rest of the cluster. It also starts a rebuild process to ensure redundancy of data in the rest of the cluster, as storage resources on the removed node are deleted. 

2. Run the `cio nodes` command and observe that the removed node is 'leaving' the cluster. The removed node stays in 'leaving' status until it's metadata is completely erased.

   ```
   # cio nodes
   NODENAME             IP                NODE_ID    ROLE       STATUS
   c41                  192.168.1.41      a49d9ccc   sds        normal
   c42                  192.168.1.42      c236e059   backup1    normal
   c43                  192.168.1.43      06aa2eb7   backup2    normal
   c44                  192.168.1.44      0808d8c0   standard   leaving
   ```

3. After a removed node is erased, the rebuilding process may still be running in the cluster, 

   ```
   # cio nodes
   NODENAME             IP                NODE_ID    ROLE       STATUS
   c41                  192.168.1.41      a49d9ccc   sds        normal
   c42                  192.168.1.42      c236e059   backup1    normal
   c43                  192.168.1.43      06aa2eb7   backup2    normal
   ```

