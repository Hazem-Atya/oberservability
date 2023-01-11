
# GitOps and ArgoCD?
* GitOps is a way of implementing Continuous Deployment for cloud native applications. 
* Argo CD is a declarative, GitOps continuous delivery tool for Kubernetes.

<br>

![image](https://user-images.githubusercontent.com/53778545/211683880-c73599ac-a57e-482f-aba3-739a1b7abb45.png)

The <b>synchronize</b> can be:
  * automatic (with every git push)
  * manual (from the gitops interface) <br>
  
Advantages of gitops:
* Simpler deployment.
* Revert to a previous deployment in case of an error. <br>

GitOps engine: There are a lot of engines, the two most known are:
*  Flux CD
* Argo CD <br>

Since the GitOps engine is a seperated app, it needs to be hosted. We have two choices:
* Hosting the GitOps engine in a seperated server
* Hosting the GitOps engine inside the infra. The cons of this approach: if we have a serious problem in the infra, the gitops engine can be affected
and we no longer can use it to revert to a previous state. <br>

The majority of the gitops engines are stateless (they don't hold a state, they just read from the git repo and try to apply the changes).

# Working with argo CD:
* [Installing argo CD](https://argo-cd.readthedocs.io/en/stable/getting_started/)
* ![image](https://user-images.githubusercontent.com/53778545/211684722-a20628d3-1bb6-4ae1-90d2-49622b73654d.png)
*  Port forward to the argo CD server `kubectl port-forward -n argocd svc/argocd-server 8080:80`
<br>When we open `http://localhost:8080` we'll get a security warning. Argo CD uses SSL but the used certificate is not real. In production we need to generate a valid SSL certificate.
* Argo CD creates a passpord and stores it as a secret in the cluster. [Getting the password](https://argo-cd.readthedocs.io/en/stable/getting_started/#4-login-using-the-cli).
* Login using `admin` for the username and the password.
* Create an application inside argo CD. Two possible approches: 
  * Imperative approch (from the UI).
  * Declarative approach (using a yaml file containing the application definition).

Fields of the application creation form:
* Project name: A project englobes many different apps. We can create a new project from argoCD settings. We can limit the repositories, namespaces, the clusters,... We can also deny the creation of certain k8s resources through `CLUSTER RESOURCE DENY LIST`.  In this case, we'll use the default project
* Sync policy: manual or automatic.
* Git repo and path (path to the chart)
* cluster URL and namespace.

After selecting the path to the chart, we can specify the values files, the last file more a higher priority, argo CD passed to the previous file only if the value is not specified.:
![image](https://user-images.githubusercontent.com/53778545/211690998-4cbd81fc-c1e2-4b14-a762-ce5f73f09547.png)
<br> We can also change specify the values manually (the values specified manually have more priority)
* We then create our application and proceed to sync. <br>
 If the namespace specified in the app details does not exists we(ll get an error. We either create the namespace manually or we edit the app details and tick `Auto-Create Namespace`.
 ![image](https://user-images.githubusercontent.com/53778545/211691784-7b71d207-3d76-4bae-b13b-e64c7e8196d0.png)
<br>

If we update our chart the current sync state becomes: `OutOfSync`. <br>
We can see the difference between the current state and the desired state through `APP DIFF`: <br>
![image](https://user-images.githubusercontent.com/53778545/211692596-3fb93009-ec54-40e0-8921-ae96e3ec1004.png) <br> <br>
We can rollback to a previous state through `HISTORY AND ROLLBACK`

* We can get argo cd applications through the command: `kubectl get applications.argoproj.io -n argocd`
* `kubectl delete  applications.argoproj.io -n argocd fact-service` : delete the application.
# Declatrative setup  ([argo cd docs](https://argo-cd.readthedocs.io/en/stable/operator-manual/declarative-setup/#applications)).
We can use the spec of the app we created manually (app details -> manifest).
* `kubectl apply -n argocd -f 05-agrocd-gitops/argo-app.yaml `
* `kubectl get applications.argoproj.io -n argocd`
 
# Auto sync
* Edit the sync policy in argo-app.yaml file:
```yaml
  syncPolicy:
    automated: {}
```
* `kubectl apply -n argocd -f 05-agrocd-gitops/argo-app.yaml ` <br>
=> CHnagements will be applied automatically after a push.

