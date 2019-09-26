---
title: cio event
description: cio event command usage 
lang: en-US
---

# cio event

<h3>Usage</h3>

`cio event [options]`

Display most recent cio events. Defaults to 500 events if `-n` option not specified.

<h3>Options</h3>

| Name                 | Description                              |
|:---------------------|:-----------------------------------------|
| -n NUMBER_OF_EVENTS  | Display most recent n number of events   |

<h3>Examples</h3>

Display the 5 most recent events.

```
$ cio event -n 5
04/14/2019-06:28:51 [info] [DFS] volume toRemove (vd3) removed on node 1862a9a1:1011
04/14/2019-06:34:24 [info] [DFS] volume help (vd3) created on node 1862a9a1:1009
04/14/2019-07:05:30 [info] [DFS] volume portainer (vd1) is expanded on node 99f8673e:1010
04/14/2019-07:12:41 [info] [DFS] volume help (vd3) created on node 4c7545a5:1009
04/14/2019-07:12:41 [info] [DFS] volume help (vd3) removed on node 1862a9a1:1011
```
