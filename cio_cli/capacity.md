# cio capacity

<h3>Usage</h3>

`cio capacity COMMAND [options]`

Return capacity usage, consumption timeline and reports at cluster or volume level.

<h3>Child commands</h3>

| Command             | Description                                  |
|:--------------------|:---------------------------------------------|
| cio capacity info   | Cluster capacity usage information over time |
| cio capacity report | Report capacity usage for each volume        |

<h3>Options</h3>

| Name         | Valid Values      | Description                                    |
|:-------------|:------------------|:-----------------------------------------------|
| --period     | day, month, year  | Select reporting period                        |
| --month      | MONTH             | Report capacity usage for all volumes by month |
| --nounits    |                   | Display information using byte units           |

<h3>Examples</h3>

Display cluster capacity usage 

```
$ cio capacity info --period day
TIMESTAMP                    TOTAL_SSD           USED_SSD          TOTAL_HDD           USED_HDD
2019-05-18T22:55:12            0.297TB            0.024TB            0.000TB            0.000TB
2019-05-18T23:00:12            0.297TB            0.024TB            0.000TB            0.000TB
2019-05-18T23:05:12            0.297TB            0.024TB            0.000TB            0.000TB
```
