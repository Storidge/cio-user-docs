---
title: Overview
description: cioctl command line interface
lang: en-US
---

# Overview

The cioctl command-line is used to manage cluster level resources, such as drives and nodes, which are part of the 'infrastructure'. This interface is generally used by operators unless a developer is managing their own cluster.

Like the cio command-line, the cioctl interface comes installed. The `cioctl` command-line has many subcommands, such as `cioctl create`, `cioctl init`, `cioctl reboot`, etc.

Running `cioctl` by itself displays help showing all available subcommands. In addition, you can run any command with the `--help` flag to output help information. For example, try running `cioctl drive --help`. This outputs a one sentence usage info and lists all options the command accepts. Details on various cio commands are available in the left navigational section of this site.

<h3>Commands</h3>

| Command            | Description                                                     |
|:-------------------|:----------------------------------------------------------------|
| cioctl add         | Add new node to cluster. Generated from join-token sub-command  |
| cioctl create      | Generate command strings for creating cio cluster               |
| cioctl drive       | List, inspect, add, remove, and rescan drive resources          |
| cioctl init        | Initialize cio cluster for operation                            |
| cioctl join        | Join node to new cluster. Generated from cioctl create command  |
| cioctl join-token  | Create token to add a new node                                  |
| cioctl load        | Restart cio operation. For single node cluster only             |
| cioctl node        | Cordon, uncordon, update or remove a node                       |
| cioctl reboot      | Stop services and reboot all nodes                              |
| cioctl report      | Collect logs and info from all nodes into a report              |
| cioctl shutdown    | Stop services and shutdown all nodes                            |
| cioctl unload      | Stop cio operation. For single node cluster only                |
