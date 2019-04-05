# Profiles
## Overview

Traditionally management of storage has always been manual and knowledge intensive. It is 
resistant to automation because legacy storage systems are built on layers of abstraction and 
protocols. This layering creates shared dependencies and complexity that must be thoughtfully managed 
by trained operators. 

As applications are decomposed into microservices running in containers, their mobility and scalability make it impossible to provision and manage storage manually. This is the 
reason we developed driverless storage technology that makes it simple to rapidly provision and scale 
persistent storage for applications. 

In eliminating the need to manage layers of storage infrastructure, we make it possible to express and manage an application's storage requirements 
through a Profile. A profile is a YAML formatted file used to specify an application's storage 
requirements in terms of resources (capacity, performance), data protection (redundancy, data 
services), access methods (file, block, object, interface protocols) and placement (media, tiering). 
It's a declarative approach made possible by the automation of storage expertise in Storidge's 
Container IO software. 

## Why Profiles 
Profiles can be used to consistently provision for applications, different classes of services, projects, unique customer requirements, etc. 

Profiles that have been optimized for specific use cases can be saved and reused, making it easier to deliver repeatable and 
consistent services. 

Profiles provide a compact way to pass volume options.  For example, instead of
```
    docker volume create --driver cio
    --name db-data \
    --opt capacity=50 \
    --opt directory=/cio/nfs
    --opt iops=1000,2000 \
    --opt level=2
    --opt provision=thick \
    --opt type=ssd \
    --opt encryption=on 
```
with a profile, do
```
    docker volume create --driver cio --name db-data --opt profile=DBDATA 
```
## Format
A profile is a YAML formatted file that describes your application's storage requirements. The profile structure has 
the following sections.
```
    ---
    capacity:
      number
      
    interface:
      set of mappings
    
    directory:
      string
    
    iops:
      set of mappings
    
    level:
      number
    
    local:
      string
    
    provision:
      string
    
    type:
      string
    
    service:
      set of mappings 
```
No logical ordering is required as values in one section do not reference values from previous sections. 

## List profiles 
List profiles in the system.
```
    $ cio profile ls
```
## Inspect profile 
Display the GOLD profile and save output to file TEST in your current working directory.
```
    $ cio profile info GOLD > TEST 
```
## Save profile 
Edit profile TEST with your editor and save it.
```
    $ cio profile add TEST 
```
## Create volumes 
You can create a volume with the TEST profile using the `--opt` flag in a `docker volume create` command.
```
    docker volume create --driver cio --name test --opt profile=TEST 
```
Use with `-v` or `--volume` flag in docker run command.
```
    docker run -it --mount source=test,target=/tmp,volume-driver=cio,volume-opt=profile=TEST \
    --name test alpine sh
```
Use with `--mount` flag in a `docker service create` command.
```
    docker service create \
    --mount source=test,target=/var/lib/mysql,volume-driver=cio,volume-opt=profile=TEST \
    --replicas 1 \
    --detach=false \
    -e MYSQL_ROOT_PASSWORD=mysecret \
    --name mysql \
    mysql 
```
To use a profile in a `cio volume create` command, simply reference it using the `-p` or `--profile` flag in a `cio volume create` command.
```
    cio volume create test --profile TEST 
```

## Remove profile
```
    $ cio profile rm TEST 
```

## Conventions
- Formatting – Configuration files must conform to YAML formatting requirements. Always use spaces to indent as YAML does not support tab characters. Do not use the same 
key twice in the same file. 
- Naming – No naming convention or file extension is used. 
- Location – Sample profiles are placed in /etc/convergeio/profiles. These are for reference only as actual working profiles are saved to a backend database. 
