# Release 1.0.0-2887
This release adds a new capability for shared volumes in a Swarm cluster without requiring NFS. 

Majority of changes focuses on bug fixes, stability and usability improvements. 

# New
- Add support for shared volumes in a Swarm cluster without NFS 

# Improvements
- Add support Ubuntu 4.4.0-155, AWS Ubuntu 4.4.0-1087
- Remove support for redacted kernel AWS Ubuntu 4.4.0-1086
- Remove support for redacted kernel Ubuntu 4.4.0-152, 153
- Update installer to check for existing docker version before installing. This avoids reverting docker engine to older versions.
- Improve cioctl to automatically add/remove cio nodes from docker swarm cluster
- Scale down docker services before cioctl reboot and restart after rebooting
- Update cioctl to prevent issuing more than one 'cioctl reboot' command
- Stop docker services before draining node to avoid unnecessary volume movements
- Ensure drives are attached before inserting modules for cluster reboot
- Add debug code to collect more info on auto expansion
- Add 'cioctl rebuild' command to restart cluster rebuild
- Remove need for fixed order of keys in profiles for compression service
- Add auto expansion usage info
- Add auto expansion fields to output of cio profile show command
- Update cio profile show command for compression fields
- Improve low capacity handling to avoid vdisk corruption and vd0 mounting issues after random reboot
- Allow volume rebuild for vd0 and vd1 when available capacity is low
- Send event if rebuild is stopped due to low available capacity
- Update volume plugin to support shared volumes in Swarm cluster

# Bug fixes
- Fix for bug where cluster reboot times out
- Fix bug where not all nodes rebooted during cioctl reboot operation
- Fix bug where the autoexpand count is not updated in cio volume info
- Fix bug where cio volume update reverts `--autoexpand` parameters back to default values
