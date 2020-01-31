---
title: Ansible and Storidge
description: Provision Storidge volumes with Ansible on Docker Swarm cluster
lang: en-US
---

# Provision Storidge volumes from Ansible

For current users of Ansible, playbooks represent a familiar tool for configuration management and multi-node deployments. Playbooks can declare configurations, and orchestrate the multiple steps of any ordered process. For Swarm clusters, Ansible provides a [docker_swarm_service module](https://docs.ansible.com/ansible/latest/modules/docker_swarm_service_module.html) that enables docker services to be managed through a manager node.

This guide uses a couple of examples to show how Storidge volumes can be easily provisioned for stateful applications using an Ansible playbook.

## Example

This [playbook](https://github.com/Storidge/cio-user-docs/blob/master/playbooks/alpine.yml) deploys a task using an alpine image, and creates volume myservice-data for the task named myservice. Since volume options are not defined, default settings will be used to create the volume.

The mount specification (mounts:) defines the volume with `source` parameter naming the volume, and the `target` parameter setting the path within the container. The `driver_config` parameter directs the volume create request to the Storidge cio volume plugin.

```
- name: Playbook
  hosts: sds
  become: yes
  become_user: root
  tasks:
    - name: Set a bind mount
      docker_swarm_service:
        name: myservice
        image: alpine
        command: sleep
        args:
          - "3600"
        mounts:
          - source: myservice-data
            target: /data
            type: volume
            readonly: no
            driver_config:
              name: cio
```

The playbook is set to run on the sds node (primary) of the Storidge cluster. This is often configured in the /etc/ansible/hosts file, e.g.:
```
[sds]
192.168.3.201
```

## Using template notation

You can create and mount a unique volume into each task of a service using [template notation](https://docs.docker.com/engine/reference/commandline/service_create/#create-services-using-templates). The playbook below deploys three MySQL tasks using the `.Task.Slot` template to assign volume N to task N. The template notation is passed through the Ansible `source` parameter which maps to the mount source, as in a `docker service create` command.

This [playbook](https://github.com/Storidge/cio-user-docs/blob/master/playbooks/mysql.yml) creates volumes for tasks mysql-replica with volume options set by a [profile](http://storidge.com/docs/profiles/) named MYSQL.
```
- name: Playbook
  hosts: sds
  become: yes
  become_user: root
  tasks:
    - name: Set a bind mount
      docker_swarm_service:
        name: mysql-replica
        state: present
        mode: replicated
        replicas: 3
        image: mysql
        env:
          MYSQL_ROOT_PASSWORD: "mysecret"
        mounts:
          - source: '{{ "{{.Service.Name}}-{{.Task.Slot}}" }}'
            target: /var/lib/mysql
            type: volume
            readonly: no
            driver_config:
              name: cio
              options:
                profile: MYSQL
        labels:
          mysql.backend: "cio"
```

Valid placeholders you can use with the template notation are:

| **Placeholder**            | **Description**             |
|----------------------------|-----------------------------|
| .Service.ID                | Service ID                  |
| .Service.Name              | Service name                |
| .Service.Labels            | Service labels              |
| .Node.ID                   | Node ID                     |
| .Node.Hostname             | Node Hostname               |
| .Task.ID                   | Task ID                     |
| .Task.Name                 | Task name                   |
| .Task.Slot                 | Task slot                   |


While the examples above uses a profile to set multiple volume options, volume options can also be individually set. Use comma separated key-value pairs to set multiple volume options.

The following options are supported by the CIO volume plugin:  

| **option** | **description**              | value               | example         |
| ---------- | ---------------------------- | ------------------- | --------------- |
| capacity   | Size in GB                   | 1 to 64000          | capacity=25     |
| directory  | Host path to bind mount      | /path/to/volume     | directory=/cio  |
| level      | Level of data redundancy     | 1, 2, 3             | level=2         |
| type       | Type of backend storage      | ssd, hdd            | type=ssd        |
| iops       | Performance in min/max IOPS  | 30 min, 1000000 max | iops=100,5000   |
| bandwidth  | Performance in min/max MB/s  | 1 min, 1000 max     | bandwidth=10,50 |
| provision  | Thick or thin provisioning   | thin, thick         | provision=thick |
| profile    | Template for volume creation | profile name        | profile=MYSQL   |
