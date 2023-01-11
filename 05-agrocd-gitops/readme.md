
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
* cluster URL and namespace


