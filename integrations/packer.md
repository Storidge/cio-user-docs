---
title: Packer
description: Build machine image with Packer and Storidge for immutable deployments
lang: en-US
---

# Build an AWS AMI with Packer and Storidge

### Why Packer?

When working with hybrid or multi-cloud environments, you need identical machine images for multiple platforms from a single source configuration. This is where Packer comes into play. Packer automates the creation of versioned artifacts or images that bundle a base operating system, application runtime, scripts, agents, etc.

In this guide, we'll step through an example Packer template which we'll use to create an AMI that you can deploy on AWS. This AMI is built on top of Ubuntu and has the Storidge CIO software installed.

### Download and install Packer

To get started, find the appropriate package for your system and [download Packer](https://www.packer.io/downloads.html). As an example, for a 64-bit install on Linux:
```
wget https://releases.hashicorp.com/packer/1.4.5/packer_1.4.5_linux_amd64.zip
unzip packer_1.4.5_linux_amd64.zip
cp packer /usr/bin
```

You can install packer to any path. Set the path variable in ~/.bashrc as needed.
```
export PATH=$PATH:/path/to/packer
```

### Download example templates

Download example templates from the [GitHub repo](https://github.com/Storidge/packer-cio). This repo contains Packer templates for generating AWS AMIs and DigitalOcean snapshot images using the Community Edition of the Storidge CIO software.
```
git clone https://github.com/Storidge/packer-cio.git
cd packer-cio
```

### Update template variables

Packer configuration templates are written in JSON format. There are three main sections:

- **variables:** where you define custom variables. Custom variables can be overridden during runtime using the -var flag.
- **builders:** where you specify one or more builders depending on the target platforms (e.g. AWS, Azure, Digital Ocean, ...).
- **provisioners:** where you add a shell script or use configuration managements tools like Ansible, Chef, Puppet or Salt to provision the AMI and install software packages.

We'll use the [aws-u18.json template](https://github.com/Storidge/packer-cio/blob/master/aws-u18.json) as an example.

```
{
  "variables": {
    "aws_access_key": "",
    "aws_secret_key": "",
    "aws_region":  ""
  },
  "builders": [{
    "type": "amazon-ebs",
    "access_key": "{{user `aws_access_key`}}",
    "secret_key": "{{user `aws_secret_key`}}",
    "region": "{{user `aws_region`}}",
    "source_ami_filter": {
      "filters": {
      "virtualization-type": "hvm",
      "name": "ubuntu/images/*ubuntu-bionic-18.04-amd64-server-*",
      "root-device-type": "ebs"
      },
      "owners": ["099720109477"],
      "most_recent": true
    },
    "instance_type": "t2.micro",
    "ssh_username": "ubuntu",
    "ami_name": "cio-{{user `build`}}-u18"
  }
],
"provisioners": [{
    "type": "shell",
    "execute_command": "echo '{{user `ssh_pass`}}' | {{ .Vars }} sudo -E -S sh '{{ .Path }}'",
    "inline": [
      "sleep 30",
      "echo '%sudo    ALL=(ALL)  NOPASSWD:ALL' >> /etc/sudoers",

      "sudo wget ftp://download.storidge.com/pub/ce/u18/cio-{{user `build`}}-u18-ce.amd64.txz",
      "sudo tar xvf cio-{{user `build`}}-u18-ce.amd64.txz",
      "sudo -i",
      "cd /home/ubuntu/cio-{{user `build`}}-u18.amd64",
      "./install",
      "sed -ie '$d' /etc/sudoers"
    ]
  }]
}
```

1. Add your `AWS_ACCESS_ID` and `AWS_SECRET_KEY` to the variables.json file. If you are using Digital Ocean, add the `DO_API_KEY`.

2. The template defaults to `us-west-2` for the AWS region. Change to other region if desired.

3. Update the `build` variable to desired release of Storidge CIO software. As new software versions are released, the `build` variable will be updated to the latest.

The source_ami_filter attribute in the builders section pulls the latest AWS distribution of Ubuntu 18.04. The image created will have an AMI name of format `cio-BUILD-u18`.

The shell script in the provisioners section [installs the Community Edition](https://guide.storidge.com/getting_started/install.html) of the Storidge CIO software.

### Build image

Before building the image, validate changes to the template with:
```
packer validate -var-file variables.json aws-u16.json
```

Build the new AMI with:
```
packer build -var-file variables.json aws-u16.json
```

When the build is done, it outputs the ID of an AMI that you can deploy, e.g.:
```
==> Builds finished. The artifacts of successful builds are:
--> amazon-ebs: AMIs were created:
us-west-2: ami-09056fa5a2448eb22
```

### Next steps

With the image created, you can deploy a Storidge cluster. See the [Terraform repo](https://github.com/Storidge/terraform-aws-swarm-cio) for an example of how to deploy a Storidge cluster with this AMI.

Check our [guide](https://guide.storidge.com/) or [documentation](https://docs.storidge.com/) for more information, and connect with us on our [Slack channel](http://storidge.com/join-cio-slack/) for support.
