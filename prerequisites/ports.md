# Ports

The following table lists the ports that need to be open to and from nodes that are running in a Storidge cluster.

| Protocol    | Port     | Description                         |
| ------------|:---------|:------------------------------------|
| TCP         | 22       | SSH provisioning and configuration  |
| TCP         | 2506     | DFS internode communication         |
| TCP         | 3260     | ISCSI                               |
| TCP         | 8282     | REST API                            |
| TCP         | 8383     | Secure cluster configuration        |
| TCP         | 9997     | SDS CLI server                      |
| TCP         | 9998     | Controller nodes heartbeat          |
| TCP         | 9999     | DFS-CIO internode communication     |
