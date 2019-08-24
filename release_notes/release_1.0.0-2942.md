# Release 1.0.0-2942
This release focuses on bug fixes, stability and usability improvements. It includes important stability fixes for AWS deployments.

# New
- Add `cioctl node clean` command to clean state a node

# Improvements
- Add support Ubuntu 4.4.0-160 kernel
- Remove retracted Ubuntu 4.4.0-158 kernel
- Update golang to 1.12.9
- Use gpg keyservers from Docker and MongoDB in install script
- Add snapshot usage for info, list and remove
- Update `cioctl node update` command to be cluster aware
- Add event message for adding node to cluster
- Add cio version information to `cio node ls` command

# Bug fixes
- Fix bug where cio-api not running on all nodes after initialization on Ubuntu
- Fix bug where "Capacity reaches 100%" message shows when a new node joins the cluster
- Fix bug where cio daemon hangs during AWS node reboot due to volume move operation
- Fix for bug where `cio volume move` fails due to propagated mounts not correctly removed
