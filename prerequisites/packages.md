---
title: Packages
description: Dependent packages for Storidge persistent storage for containers
lang: en-US
---

# Packages

To install Storidge and other enabling software, your storage node require internet access to download dependent packages. If your environment does not allow the storage node to access the internet, manually downloading packages is an alternative way.

## Keys

Whether you add repositories or download packages manually, you should download keys to verify the packages. If you do not get the keys, you may encounter security warnings.

## Download packages

Storidge requires additional third party libraries. When installing in an environment without internet access, retrieve the packages first before attempting an install.

**CENTOS 7 PACKAGES**

autoconf

bc

bind-utils

bison

cmake3

conntrack-tools

cryptsetup

docker

gcc

git

libaio

libyaml

libyaml-devel

lsof

lvm2

iscsi-initiator-utils

make

nfs-utils

subversion

wget

xfsprogs

Install the following dependencies at the tested release.

| Software        | Release        | Download                                                                                       |
| ----------------|:---------------|:-----------------------------------------------------------------------------------------------|
| fio             | 2.2.8          | http://rpm.pbone.net/info_idpl_34465559_distro_redhat_el_7_com_fio-2.2.8-2.el7.x86_64.rpm.html |
| mongo           | 3.6            | https://www.mongodb.com/download-center/community                                              |
| mongo-c-driver  | 1.14.0         | http://mongoc.org/libmongoc/1.15.0/installing.html                                             |
| scst            | 3.4.x-r8836    | http://scst.sourceforge.net/downloads.html                                                     |
| linux-header    | `uname -r`     |                                                                                                |
| linux-devel     | `uname -r`     |                                                                                                |


Use `docker pull` to download the latest images

| Container              | Tag          |
| -----------------------|:-------------|
| portainer/portainer-ce | latest       |
| portainer/agent        | latest       |
| storidge/cio           | latest       |
| storidge/nfs           | latest       |

**Storidge CIO tarball**

Contact Storidge or integration partner for access to the cio tarball
