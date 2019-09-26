---
title: Overview
description: cio command line interface
lang: en-US
---

# Overview

The cio command-line is used to manage logical resources, such as volumes, snapshots and profiles. This interface is generally used by developers to directly manage their own resourcs using the `cio` command. The `cio` command has many subcommands, such as `cio info`, `cio volume`, `cio snapshot`, etc.

Running `cio` by itself displays help showing all available subcommands. In addition, you can run any command with the `--help` flag to output help information. For example, try running `cio volume --help`. This outputs a one sentence usage info and lists all options the command accepts. Details on various cio commands are available in the left navigational section of this site.

To simplify the command-line for developers, the actions of subcommands have aliases, e.g. `list` and `ls` both list resources. `create` and `add` are aliases, `delete`, `remove` and `rm` all remove resources.
