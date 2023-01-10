

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
