---
title: cio license
description: cio license command; docker volumes for containers; persistent volumes for pods
lang: en-US
---

# cio license

<h3>Usage</h3>

`cio license COMMAND [options]`

Manage Storidge software license

<h3>Child commands</h3>

| Command              | Description                                 |
|:---------------------|:--------------------------------------------|
| cio license add      | Add license to expand cluster capabilities  |
| cio license info     | Get license info                            |
| cio license show     | Show license text                           |
| cio license remove   | Remove license to cancel subscription       |

## cio license add

<h3>Usage</h3>

`cio license create [options]`

`cio license add [options]`

Add license to expand cluster capabilities

<h3>Options</h3>

| Name                   | Description         |
|:-----------------------|:--------------------|
| --email, -e EMAIL      | Email address       |
| --token, -t TOKEN      | Token               |
| --license, -l LICENSE  | License             |

<h3>Examples</h3>

```
[root@c1 ~]# cio license add --token CIO-3329-3984-6537
Succeed: License has been added to cluster
```

## cio license info

<h3>Usage</h3>

`cio license info`

Get license info

<h3>Examples</h3>

```
[root@c1 ~]# cio license info
License type:  Workgroup
Expiration:    2021-05-01
Max nodes:     5
Platform:      Virtual Machine
Company:       Storidge, Inc.
```

## cio license show

<h3>Usage</h3>

`cio license show`

Show license text

<h3>Examples</h3>

```
[root@c1 ~]# cio license show
LP+HAwEBB0xpY2Vuc2UB/4gAAQMBBERhdGEBCgABAVIB/4QAAQFTAf+EAAAACv+DBQEC/4YAAAD+AYD/iAH+ARN7IkNyZWF0aW9uRGF0ZSI6IjIwMjAtMDQtMDNUMDI6NDc6MDQuODAwODIzMTgzWiIsIkV4cGlyYXRpb25EYXRlIjoiMDAwMS0wMS0wMVQwMDowMDowMFoiLCJMaWNlbnNlVHlwZSI6MSwiUGF5bWVudFR5cGUiOjAsIk9FTUlEIjowLCJPRU0iOiJTdG9yaWRnZSwgSW5jLiIsIk11bHRpQ2x1c3RlciI6ZmFsc2UsIlBsYXRmb3JtIjoyLCJOb25jZSI6ImY2NGY5NGFlYmRhN2ZjYTM3M2I5OThkM2FlYTE1NGEyIiwiRG9tYWluSUQiOiI4MzViMmNlMyIsIk1heE5vZGVzIjo1LCJSYXRlIjowfQExAnwsWcjuhUSDE0tekJm/ESYNid9/WSryuhCdg4MlfCfQt0lAxag/a1DwGNjLOs57bQExAuQ3sEBkzAT9DcWe375DUcE26JuxnZKuiBgRLwcAL/JorXRZ7s5F+i3Lyas97jtHswA=
```

## cio license remove

<h3>Usage</h3>

`cio license rm`

`cio license remove`

`cio license delete`

Remove license to cancel subscription

<h3>Examples</h3>

```
[root@c1 ~]# cio license remove
This command will deactivate the cluster and return a code that is redeemable for use on other clusters.Are you sure you want to deactivate this cluster? (Y/N):

```
