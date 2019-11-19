---
title: Prometheus
description: Monitoring Storidge cluster metrics with Prometheus and Grafana
lang: en-US
---

# Monitoring Storidge cluster metrics with Prometheus and Grafana

### Prometheus Metrics

Prometheus is a standard open-source monitoring solution for many clusters. As it does not come with a feature-rich dashboard, it is often paired with Grafana; Prometheus gathers time-series data, while Grafana visualizes it.

The Storidge cluster metrics for Prometheus are available at the /metrics endpoint of all nodes on port 8282. Your application can poll http://<NODE_IP_ADDRESS>:8282/metrics to get their runtime values.

### Install Prometheus and Grafana

[Install Prometheus](https://prometheus.io/docs/introduction/first_steps/)

[Install Grafana](https://grafana.com/docs/installation/)

### Configure Prometheus

This guide assumes basic familiarity with Prometheus.

Add the Storidge cluster nodes as a target in Prometheus configuration file. In the example below, we have four nodes at IP addresses 192.168.3.51 to 192.168.354.

```
# my global config
global:
  scrape_interval:     15s
  evaluation_interval: 15s

# Alertmanager configuration
alerting:
  alertmanagers:
  - static_configs:
    - targets:
      # - alertmanager:9093

# Load rules once and periodically evaluate them according to the global 'evaluation_interval'.
rule_files:
 - "prometheus.rules.yml"
  # - "second_rules.yml"

# A scrape configuration containing exactly one endpoint to scrape:
# Here it's Prometheus itself.
scrape_configs:
  # The job name is added as a label `job=<job_name>` to any timeseries scraped from this config.
  - job_name: 'prometheus'

    # metrics_path defaults to '/metrics'
    # scheme defaults to 'http'.

    static_configs:
    - targets: ['192.168.3.51:8282', '192.168.3.52:8282', '192.168.3.53:8282', '192.168.3.54:8282']
```

Verify that the Storidge CIO metrics are collected by Prometheus:

![Prometheus Dashboard](https://i.imgur.com/r1C4GBI.png)

### Configure Grafana

For monitoring, we recommend using Grafana with Prometheus. Use our [example Grafana dashboard](https://grafana.com/grafana/dashboards/11213) as a reference.

![Grafana Dashboard](https://i.imgur.com/94DZSg7.png)

### Exported metrics

The following stats are available on each node of the Storidge cluster. These metrics are updated every ten seconds.

| Cluster Stats | Description |
|---|---|
| cio_cluster_nodes_online | Number of nodes that are healthy|
| cio_cluster_nodes_maintenance | Number of nodes that are in maintenance mode |
| cio_cluster_nodes_cordoned | Number of nodes that are cordoned |
| cio_cluster_drives_online | Number of drives currently in use by CIO |
| cio_cluster_drives_failed | Number of drives are flagged as faulty, and should be replaced |
| cio_cluster_capacity_total | Total capacity currently available in CIO cluster |
| cio_cluster_capacity_used | Total capacity currently in use |
| cio_cluster_capacity_free | Total capacity that is available for use |
| cio_cluster_capacity_provisioned | Total capacity that is allocated for use by CIO volumes |
| cio_cluster_iops_total | Total IOPS currently available in CIO cluster |
| cio_cluster_iops_used | Total IOPS currently in use |
| cio_cluster_iops_free | Total IOPS that is available for use |
| cio_cluster_iops_provisioned | Total IOPS that is currently reserved for use by CIO volumes |
| cio_cluster_bw_total | Total bandwidth currently available in CIO cluster |
| cio_cluster_bw_used | Total bandwidth currently in use |
| cio_cluster_bw_free | Total bandwidth that is available for use |
| cio_cluster_bw_provisioned | Total bandwidth that is currently reserved for use by CIO volumes |

The Storidge API dynamically exports the following data on Storidge volumes. Metrics are automatically removed when volumes are deleted. The data is only available on the node the volume is attached to.

Metrics are tagged with the vdisk ID of the volume. A reserved vdisk (vd0) is used in the examples below.

| Volume Stats | Description |
|---|---|
| cio_volume_vd0_current_ios | Number of current IOs in progress |
| cio_volume_vd0_reads_completed | Number of reads that have been performed on the volume |
| cio_volume_vd0_reads_merged | Number of times that two or more similar reads have been merged for increased efficiency |
| cio_volume_vd0_sectors_read | Number of sectors that have been read |
| cio_volume_vd0_sectors_written | Number of sectors that have been written |
| cio_volume_vd0_time_doing_ios | Time doing IOs, in ms |
| cio_volume_vd0_time_reading | Time spent reading, in ms |
| cio_volume_vd0_writes_completed | Number of write operations that have been completed on the volume |
| cio_volume_vd0_time_writing | Time spent writing, in ms |
| cio_volume_vd0_writes_merged | Number of times that two or more write requests have been merged for increased efficiency |

API response data.

| API Stats | Description |
|---|---|
| cio_api_calls | The total number of API calls |
| cio_api_calls_ok | The total number of calls that returned 200 OK |
| cio_api_calls_bad_request |  The total number of calls that returned 400 BAD REQUEST |
| cio_api_calls_not_found | The total number of calls that returned 404 NOT FOUND |
| cio_api_calls_conflict | The total number of calls that returned 409 CONFLICT |
| cio_api_calls_internal_server_error | The total number of calls that returned 500 INTERNAL SERVER ERROR |
| cio_api_calls_errors_overall | The total number of calls that returned non-200 OK responses |
