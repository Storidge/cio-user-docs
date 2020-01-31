---
title: Automate Deployments
description: Deploy Storidge cluster with Ansible and Terraform   
lang: en-US
---

# Automating deployments of Storidge clusters

For repeated deployments, it is desirable to automate creation of infrastructure. Storidge is architected to integrate easily into application stacks, and operate transparently as the underlying infrastructure delivering storage-as-a-service.

Two repos are provided as references for automating deployment of Storidge clusters. Packer is used to create AMIs and images, and Terraform plus Ansible is used for provisioning virtual servers from the images to create a cluster. The repos provide references for AWS and Digital Ocean but can be easily adapted to other cloud providers.

## 1. Create Packer image

Refer to the [packer-cio repo](https://github.com/Storidge/packer-cio) for Packer templates to generate AWS AMIs and Digital Ocean snapshot images. The machine images are created with the community edition of the Storidge software.

The `provisioners` portion of the Packer template can be easily updated to include components of your software stack.  

## 2. Deploy with Terraform

Refer to the [terraform-aws-swarm-cio](https://github.com/Storidge/terraform-aws-swarm-cio) or [terraform-do-swarm-cio](https://github.com/Storidge/terraform-do-swarm-cio) repo for examples of configuration files which Terraform executes to deploy a Storidge cluster.

Update the .tf files to fit your requirements and run `terraform apply` to deploy. The configuration files look for an image to launch the cloud instances. You can also update Ansible to download and install the community edition Storidge software as part of the deployment, instead of generating a Packer image first.
