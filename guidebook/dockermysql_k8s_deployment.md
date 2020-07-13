---
title: Wordpress with Storidge on Kubernetes
description: Deploying Wordpress and MySQL for Storidge on Kubernetes
lang: en-US
---

# Deploying Wordpress and MySQL on Storidge Volume with Kubernetes

## **Prerequisites**

- Storidge CIO software installed on your machine. Install [here](https://docs.storidge.com/kubernetes_storage/install.html#install-storidge).

- Kubernetes installed across your node cluster.

- Storidge CSI driver installed on your master node. Install [here](https://docs.storidge.com/kubernetes_storage/initialize_cluster.html#_4-install-csi-driver).

- Familiarity with Kubernetes.

## **Setup**

Once both CIO and Kubernetes clusters are up and the CSI driver is installed, you will need to create a secret generator in `kustomization.yaml` to store your Wordpress login credentials.

```
cat <<EOF >./kustomization.yaml
secretGenerator:
- name: mysql-pass
  literals:
  - password=YOUR_PASSWORD
EOF
```

Change `YOUR_PASSWORD` to your desired password. However, if you are deploying for testing purposes, there is no need to change it.

Next get the service files for the MySQL and Wordpress deployments and add them to the `kustomization.yaml` file. Save the following files to the current working directory.

wordpress-deployment.yaml:

```
apiVersion: v1
kind: Service
metadata:
  name: wordpress
  labels:
    app: wordpress
spec:
  ports:
    - port: 80
  selector:
    app: wordpress
    tier: frontend
  type: LoadBalancer
---
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: wp-pv-claim
  labels:
    app: wordpress
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 20Gi
---
apiVersion: apps/v1 # for versions before 1.9.0 use apps/v1beta2
kind: Deployment
metadata:
  name: wordpress
  labels:
    app: wordpress
spec:
  selector:
    matchLabels:
      app: wordpress
      tier: frontend
  strategy:
    type: Recreate
  template:
    metadata:
      labels:
        app: wordpress
        tier: frontend
    spec:
      containers:
      - image: wordpress:4.8-apache
        name: wordpress
        env:
        - name: WORDPRESS_DB_HOST
          value: wordpress-mysql
        - name: WORDPRESS_DB_PASSWORD
          valueFrom:
            secretKeyRef:
              name: mysql-pass
              key: password
        ports:
        - containerPort: 80
          name: wordpress
        volumeMounts:
        - name: wordpress-persistent-storage
          mountPath: /var/www/html
      volumes:
      - name: wordpress-persistent-storage
        persistentVolumeClaim:
          claimName: wp-pv-claim
```

mysql-deployment.yaml:

```
apiVersion: v1
kind: Service
metadata:
  name: wordpress-mysql
  labels:
    app: wordpress
spec:
  ports:
    - port: 3306
  selector:
    app: wordpress
    tier: mysql
  clusterIP: None
---
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: mysql-pv-claim
  labels:
    app: wordpress
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 20Gi
---
apiVersion: apps/v1 # for versions before 1.9.0 use apps/v1beta2
kind: Deployment
metadata:
  name: wordpress-mysql
  labels:
    app: wordpress
spec:
  selector:
    matchLabels:
      app: wordpress
      tier: mysql
  strategy:
    type: Recreate
  template:
    metadata:
      labels:
        app: wordpress
        tier: mysql
    spec:
      containers:
      - image: mysql:5.6
        name: mysql
        env:
        - name: MYSQL_ROOT_PASSWORD
          valueFrom:
            secretKeyRef:
              name: mysql-pass
              key: password
        ports:
        - containerPort: 3306
          name: mysql
        volumeMounts:
        - name: mysql-persistent-storage
          mountPath: /var/lib/mysql
      volumes:
      - name: mysql-persistent-storage
        persistentVolumeClaim:
          claimName: mysql-pv-claim
```

Add them to `kustomization.yaml`:

```
cat <<EOF >>./kustomization.yaml
resources:
  - mysql-deployment.yaml
  - wordpress-deployment.yaml
EOF
```

## **Apply Services**

With the deployment ready in `kustomization.yaml`, we can apply the directory by running `kubectl apply -k ./`, which will apply every service, secret, and persistent volume in the file.

Check to see that a `mysql-pass` secret exists with `kubectl get secrets`. Persistent volume creation can be checked with `kubectl get pvc`, both `mysql-pv-claim` and `wp-pv-claim` will be shown as `Bound`. If running in a virtual machine, PVC creation may take a few minutes or more.

Verify `wordpress-mysql` pod creation with `kubectl get pods` and check if the service is running with `kubectl get services wordpress`.

## **Running Wordpress**

Under `kubectl get services wordpress`, take a look at the `PORT(S)` column.

```
NAME        TYPE            CLUSTER-IP   EXTERNAL-IP   PORT(S)        AGE
wordpress   LoadBalancer    10.0.0.89    <pending>     80:32406/TCP   4m
```

The port 32406 is the one that we use to access Wordpress on the node we ran the deployment on. In a web browser, enter `http://1.2.3.4:32406` in the browser, where `1.2.3.4` is the IP of the deployment node. From there on, Wordpress will come up in your browser.

## **Teardown**

To delete the created secret, deployments, services, and persistent volumes, run `kubectl delete -k ./`.