# Release 1.0.0-2825
This is the 1.0 Community Edition release of Storidge's CIO software. This release delivers distributed storage that is intuitive, powerful and fast. With full API integration with our partners at Portainer.io, anyone can easily manage and scale stateful containerized applications.

The Community Edition is expanded to maximum of five nodes to support minimum configuration of Docker EE. The cluster capacity is increased to maximum 10TB of virtual volumes

# New
- Add support Ubuntu 4.4.0-150, AWS Ubuntu 4.4.0-1084
- Add event messages for node uncordon, drive add and drive remove 
- Add auto expansion as a service in profiles
- Full integration of Storidge CIO API (1.0) with Portainer 

# Improvements
- Update cio-ce package to maximum 5 nodes and maximum 10TB of virtual volume capacity
- Reject `cioctl reboot` when one node already in maintenance mode 
- Cordon node before executing `reboot` command on node 
- Switch Portainer from PR2711 image to latest 

# Bug fixes
- Fix parsing errors with `cio profile` command 
- Fix bug where volume cannot be created on empty node after node or cluster reset 
- Fix bug where node cannot uncordon due to 'node still cordoned' error message
- Fix bug where module was not displaying for some events in the Storidge Details view 
