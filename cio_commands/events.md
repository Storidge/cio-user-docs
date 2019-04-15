# events

**`cio events [options]`**

Display most recent 10 cio events.

### **Options**

- **-n &lt;number&gt;** : Display the last number cio events.

- **-f** : Display real time cio events continuously.

### **Example**

Display the 5 latest cluster events.

```
$ cio events -n 5
04/14/2019-06:28:51 [info] [DFS] volume toRemove (vd3) removed on node 1862a9a1:1011
04/14/2019-06:34:24 [info] [DFS] volume help (vd3) created on node 1862a9a1:1009
04/14/2019-07:05:30 [info] [DFS] volume portainer (vd1) is expanded on node 99f8673e:1010
04/14/2019-07:12:41 [info] [DFS] volume help (vd3) created on node 4c7545a5:1009
04/14/2019-07:12:41 [info] [DFS] volume help (vd3) removed on node 1862a9a1:1011
```
