---
title: Monitoring
description: Monitoring a Storidge cluster with Prometheus  
lang: en-US
---

# Monitoring Storidge Cluster

## Integrating metrics

Storidge provides a containerized exporter (storidge/cio-prom) that exposes stats at port 16995 on the /metrics endpoint. Your monitoring application can poll http://<CLUSTER_NODE_IP>:16995/metrics to scrap the metrics.

This exporter aggregates stats from all nodes in the Storidge cluster. The exporter auto-discovers new nodes and includes their stats as they join the cluster.

Metrics for the Storidge cluster are exported in Prometheus text format, so Prometheus or similar collectors are easily integrated. See the [Prometheus integrations](https://docs.storidge.com/integrations/prometheus.html) for a monitoring example.

## Visualizing metrics

The many metrics exposed by the Prometheus exporter may be difficult to interpret. To aid the visualisation of metrics a Grafana dashboard can be used. See the [Grafana integrations](https://docs.storidge.com/integrations/grafana.html) for an example dashboard.
