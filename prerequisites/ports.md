---
title: Ports
description: Ports list used by Storidge CIO software; docker volumes for containers; persistent volumes for pods
lang: en-US
---

# Ports

The following table lists the ports that need to be open to and from nodes that are running in a Storidge cluster.

| Protocol    | Port    | Description                         |
| ------------|:--------|:------------------------------------|
| TCP         | 22      | SSH provisioning and configuration  |
| TCP         | 3260    | ISCSI                               |
| TCP         | 8282    | REST API                            |
| TCP         | 8383    | Secure cluster configuration        |
| TCP         | 16996   | DFS internode communication         |
| TCP         | 16997   | SDS CLI server                      |
| TCP         | 16998   | Controller nodes heartbeat          |
| TCP         | 16999   | DFS-CIO internode communication     |


Port numbers used in prior software versions 1.0.0-3007 and below.

| Protocol    | Port    | Description                         |
| ------------|:--------|:------------------------------------|
| TCP         | 22      | SSH provisioning and configuration  |
| TCP         | 2506    | DFS internode communication         |
| TCP         | 3260    | ISCSI                               |
| TCP         | 8282    | REST API                            |
| TCP         | 8383    | Secure cluster configuration        |
| TCP         | 9997    | SDS CLI server                      |
| TCP         | 9998    | Controller nodes heartbeat          |
| TCP         | 9999    | DFS-CIO internode communication     |
