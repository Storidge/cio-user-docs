# cio capacity

### **Usage**

**`cio capacity COMMAND [options]`**

Return capacity usage, consumption timeline and reports at cluster or volume level.

### **Commands**
- **info** : Cluster capacity usage information over time
- **report** : Report capacity usage for each volume

### **Options**
- **--period** : Select reporting period for day, month or year
- **--month** : Report capacity usage for all volumes by month
- **--nounits** : Display information using byte units

### **Examples**

Display cluster capacity usage 

```
$ cio capacity info --period day
TIMESTAMP                    TOTAL_SSD           USED_SSD          TOTAL_HDD           USED_HDD
2019-05-18T22:55:12            0.297TB            0.024TB            0.000TB            0.000TB
2019-05-18T23:00:12            0.297TB            0.024TB            0.000TB            0.000TB
2019-05-18T23:05:12            0.297TB            0.024TB            0.000TB            0.000TB
```
