---
title: Release 1.0.0-3085
description: Release notes for Storidge CIO version 1.0.0-3085
lang: en-US
---

# Release 1.0.0-3085
This small update adds new kernel releases, support for Prometheus exporter, and minor bug fixes.

Storidge CIO adds support for a Prometheus exporter that exposes cluster stats on a new /metrics endpoint. Refer to [Prometheus](https://docs.storidge.com/integrations/prometheus.html) documentation under integrations to run the exporter on your cluster.

In addition to migrating docker names volumes to a Storidge cluster, the `cioctl migrate` command now allows any volume to be migrated by specifying the mountpoint as an input parameter. This allows moving files in any directory into a Storidge volume.

## New
- Add Prometheus exporter (storidge/cio-prom container) to aggregate metrics from all nodes
- Add cio remote command for NVMe-TCP support and generalized remote shell

## Improvements
- Add support Ubuntu 4.4.0-171, 4.15.0-73, AWS Ubuntu 4.4.0-1100, 4.15.0-1057 kernels
- Add support Centos 7 3.10.0-{1062.7.1, 1062.9.1}
- Convert /metrics endpoint on API to JSON output
- Add `cioctl migrate generic` subcommand to provide option for specifying mountpoint of source volume
- Add Hetzner Cloud to VM list

## Bug fixes
- Fix bug cio-api not running on Hetzner Cloud. Changed node discovery to utilize `cio nodeid`
