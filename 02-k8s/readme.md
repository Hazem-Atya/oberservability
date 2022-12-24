# Creating a cluster

## Choice1 : Azure

## Choice2:

- Install `kind`
- create new cluster using `kind cluster create`

# Prometheus helm
## What is helm?
Helm helps you manage Kubernetes applications — Helm Charts help you define, install, and upgrade even the most complex Kubernetes application.
<br>
## Installing prometheus
[https://github.com/prometheus-community/helm-charts](https://github.com/prometheus-community/helm-charts) <br>

 ```bash
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm install prometheus-hazem prometheus-community/prometheus 
# prometheus-hazem is the name of the application  
```
`helm list` : list all apps installed via helm  <br>
## How does helm install work?

* <b> Render templates + values.yaml  -> Manifest </b>
*  Kubectl apply the resulting manifests

If we open [the prometheus chart](https://github.com/prometheus-community/helm-charts/tree/main/charts/prometheus#readme), we can notice that the templates folder contains many yaml k8s templates.
We can also see the file values.yaml which contains the default values (values tht will be used if we do nor specify otherwise)  

* If we just want to see the resulting manisfest we can use:
```
helm template prometheus-hazem prometheus-community/prometheus > manifests.yaml
```
We can overwrite some fields of the values.yaml file. We can create the file myvalues.yaml
```
helm template -f myvalues.yaml prometheus-hazem prometheus-community/prometheus > manifests.yaml
```
<b> `helm install ...` <=> `helm tamplate ... | kubectl apply ` 

## Building and pushing the docker image 
`sudo podman build -t docker.io/laykidi/factorial .`

## Constructing and installing a helm chart
```
chart
│   Chart.yaml
│   values.yaml    
│
└───templates
    │   deployment.yaml
    │   

```
* `helm install  "factorial-service" chart/`: "factorial-service" is the name of the release
* `helm uninstall  "factorial-service"`
* `helm install  "factorial-service" chart/ -f chart/custom-values.yaml `: Overwrite the default values of values.yaml by specifying a yaml vualues containing your custom values
* `helm tepmplate  "factorial-service" chart/` :  print the manifest 

## Loadbalancer


`kubectl get pods -o wide` :  shows pods with more details (pod IPs )
![image](https://user-images.githubusercontent.com/53778545/209442891-674349b3-96a1-4d68-b143-1c6a31983ae9.png)
