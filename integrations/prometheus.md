---
title: Prometheus
description: Instructions for population of Prometheus with Storidge metrics
lang: en-US
---

# Storidge integration with Prometheus

The stats for a Storidge cluster is easily integrated into [Prometheus](https://prometheus.io/docs/prometheus/latest/getting_started/) or similar applications such as the [Telegraf](https://www.influxdata.com/time-series-platform/telegraf/) agent shipped with InfluxDB.

Storidge provides a containerized exporter (storidge/cio-prom) that exposes stats at port 16995 on the /metrics endpoint. This exporter aggregates stats from nodes in the Storidge cluster, including auto-discovering new nodes as they join the cluster. Your monitoring application can poll http://<IP_ADDRESS>:16995/metrics to scrap the metrics.

This feature is supported from version v1.0.0-3080 onwards.

<h2>Setup Prometheus</h2>

Prometheus is the standard open-source monitoring solution for many clusters. As it does not come with a feature-rich dashboard, it is often paired with Grafana; Prometheus gathers time-series data, and Grafana visualizes it.

This guide assumes basic familiarity with Prometheus and Grafana. Follow the links to install Prometheus and Grafana.

[Prometheus Setup Docs](https://prometheus.io/docs/introduction/first_steps/)

[Grafana Setup Docs](https://grafana.com/docs/installation/)

<h2>Start exporter on Storidge cluster</h2>

Start the exporter as a service on a Storidge cluster.

```
docker service create \
--name cio_prom \
--publish 16995:16995 \
storidge/cio-prom:latest
```

The exporter automatically gathers data from all nodes in the cluster, including data from newly added nodes.

<h2>Configure exporter as target in Prometheus config file</h2>

Add the exporter as a target to the Prometheus configuration file (prometheus.yml). In the static_configs section below, we are pointing Prometheus at 192.168.3.51 port 16995. Any node IP address in the Storidge cluster can be used to pull the metrics.

```yaml
# my global config
global:
  scrape_interval:     10s
  evaluation_interval: 10s

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
    - targets: ['192.168.3.51:16995']
```

<h2>Monitor Storidge cluster metrics</h2>

Start Prometheus to watch the exporter (e.g. ./prometheus --config.file=prometheus.yml). Verify Prometheus is serving metrics by navigating to IP address of your server at port 9090.

![Prometheus Dashboard](https://i.imgur.com/r1C4GBI.png)

To establish a proper monitoring solution, we recommend using Grafana with Prometheus. [See our example Grafana dashboard.](https://grafana.com/grafana/dashboards/11359)

![Grafana Dashboard](https://i.imgur.com/94DZSg7.png)

## Exported metrics

The following cluster stats are available on each of the nodes. The Storidge API refreshes metrics every ten seconds.

| Exported Cluster Data | Description |
|---|---|
| cio_cluster_nodes_online | Number of nodes that are healthy|
| cio_cluster_nodes_maintenance | Number of nodes that are in maintenance mode |
| cio_cluster_nodes_cordoned | Number of nodes that are cordoned |
| cio_cluster_drives_online | Number of drives currently in use by CIO |
| cio_cluster_drives_available | Number of drives that can be used by CIO |
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

The /metrics endpoint dynamically exports the following data about drives and volumes in the Storidge cluster. Metrics are removed once volumes are deleted. The data is derived from `/proc/diskstats`.

The sample data below applies to drives as well; however, they will be marked as drive and their name will be generated from node ID and drive letter, e.g. `cio_drive_5927e513sdb_reads_merged`.

| Exported Volume Data | Description |
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

The API response data is also exported.

| Exported API Data | Description |
|---|---|
| cio_api_calls | The total number of API calls |
| cio_api_calls_ok | The total number of calls that returned 200 OK |
| cio_api_calls_bad_request |  The total number of calls that returned 400 BAD REQUEST |
| cio_api_calls_not_found | The total number of calls that returned 404 NOT FOUND |
| cio_api_calls_conflict | The total number of calls that returned 409 CONFLICT |
| cio_api_calls_internal_server_error | The total number of calls that returned 500 INTERNAL SERVER ERROR |
| cio_api_calls_errors_overall | The total number of calls that returned non-200 OK responses |
