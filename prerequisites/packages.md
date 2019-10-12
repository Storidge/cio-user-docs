---
title: Packages
description: Dependent packages for Storidge persistent storage for containers
lang: en-US
---

# Packages

To install Storidge and other enabling software, your storage node require internet access to download dependent packages. If your environment does not allow the storage node to access the internet, manually downloading packages is an alternative way.

## keys

Whether you add repositories or download packages manually, you should download keys to verify the packages. If you do not get the keys, you may encounter security warnings.

## Download packages

Storidge requires additional third party libraries. When installing in an environment without internet access, retrieve the packages first before attempting an install.

**CENTOS7 PACKAGES**

autoconf

bc

bind-utils

bison

cryptsetup-luks

expect

gcc

git

libyaml

libyaml-devel

lsof

lsscsi

iscsi-initiator-utils

make

net-tools

pciutils

sg3_utils

subversion

wget

xfsprogs

| Software        | Release      |
| ----------------|:-------------|
| fio             | 2.16         |  
| mongo           | 4.2          |  
| mongo-c-driver  | 1.14.0       |  
| scst            | 3.4          |  
| linux-header    | `uname -r`   |
| linux-devel     | `uname -r`   |


Use `docker pull` to download the latest images

| Container           | Tag          |
| --------------------|:-------------|
| portainer/portainer | lastest      |  
| portainer/agent     | latest       |
| storidge/cio        | latest       |
| storidge/nfs        | latest       |

**Storidge cio tarball**

Contact Storidge or integration partner for access to the cio tarball
