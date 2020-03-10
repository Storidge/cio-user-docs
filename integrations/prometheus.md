---
title: Prometheus on Swarm
description: Instructions for population of Prometheus with Storidge metrics
lang: en-US
---

# Storidge integration with Prometheus

The stats for a Storidge cluster is easily integrated into [Prometheus](https://prometheus.io/docs/prometheus/latest/getting_started/) or similar applications such as the [Telegraf](https://www.influxdata.com/time-series-platform/telegraf/) agent shipped with InfluxDB.

Storidge provides a containerized exporter (storidge/cio-prom) that exposes stats at port 16995 on the /metrics endpoint. This exporter aggregates stats from nodes in the Storidge cluster, including auto-discovering new nodes as they join the cluster. Your monitoring application can poll http://<IP_ADDRESS>:16995/metrics to scrap the metrics.

This feature is supported from version v1.0.0-3085 onwards.

<h2>Setup Prometheus</h2>

Prometheus is the standard open-source monitoring solution for many clusters. As it does not come with a feature-rich dashboard, it is often paired with Grafana; Prometheus gathers time-series data, and Grafana visualizes it.

This guide assumes basic familiarity with Prometheus. Follow the link to install Prometheus.

[Prometheus Setup Docs](https://prometheus.io/docs/introduction/first_steps/)

<h2>Start exporter on Storidge cluster</h2>

Start the exporter as a service on a Storidge cluster.

```
docker service create \
--name cio_prom \
--publish 16995:16995 \
storidge/cio-prom:latest
```

The exporter automatically gathers data from all nodes in the cluster, including data from newly added nodes.

<h2>Add exporter as target to external Prometheus monitor</h2>

If running the Prometheus monitor on an external server, add the exporter as a target to the Prometheus configuration file (prometheus.yml). In the static_configs section below, we are pointing the Prometheus monitor to 192.168.3.65 port 16995 on the Storidge cluster. Any node IP address in the Storidge cluster can be used to pull the metrics.

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
    - targets: ['192.168.3.65:16995']
```

<h2>Running Prometheus monitor on Storidge cluster</h2>

Edit Prometheus configuration file with localhost target on port 16995, if the Prometheus monitor is on the Storidge cluster, e.g.:

```
static_configs:
- targets: ['localhost:16995']
```

Start the Prometheus monitor, e.g.:
```
docker run --rm -d -p 9090:9090 \
-v /home/prometheus/prometheus.yml:/etc/prometheus/prometheus.yml \
--net=host \
--name prom-monitor \
prom/prometheus
```

Replace the host network setting with your overlay network name as needed.

<h2>Monitor Storidge cluster metrics</h2>

Start Prometheus to watch the exporter (e.g. ./prometheus --config.file=prometheus.yml). Verify Prometheus is serving metrics by navigating to IP address of your server at port 9090.

![Prometheus Dashboard](https://i.imgur.com/r1C4GBI.png)

::: tip
If you do not see metrics being served, verify the IP address and port number. Also confirm time setting between the Storidge cluster and the Prometheus server is correct.
:::

To visualize the metrics with Grafana, follow the steps in [Grafana with Storidge](https://docs.storidge.com/integrations/grafana.html).

<h2>Exported metrics</h2>

The following cluster stats are available on each of the nodes.

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

<h2>Configuring Metrics To Export</h2>

Environment variables can be passed to configure the amount of metrics exported. The default settings are API_LEVEL=2, DRIVE_LEVEL=1, and SYSTEM_LEVEL=1.

The following environment variables and values are supported:

| Environment Variable  | Description |
|---|---|
| API_LEVEL=2	|	All API stats are exported |
| API_LEVEL=1	|	Only Total OK and Total Errors are exported |
| API_LEVEL=0	|	No API stats exported |
| DRIVE_LEVEL=1	|	All drive stats exported |
| DRIVE_LEVEL=0	|	No drive stats exported |
| SYSTEM_LEVEL=1 | All cluster stats from `cio info` are exported |
| SYSTEM_LEVEL=0| No cluster stats from `cio info` exported |

Example:
```
docker service create --name cio_prom --publish 16995:16995 -e API_LEVEL=1 -e SYSTEM_LEVEL=0 -e DRIVE_LEVEL=1 storidge/cio-prom:latest
```
