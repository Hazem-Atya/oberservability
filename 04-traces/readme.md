
# What are traces?

* Trace (follow) one request as it flows through an application:
    * Where was the majority of the time spent when processing this request (service or function).
    * Which services were involved to answer this request.
* A trace is a collection of span, where each span belongs to a service and represents an <b>operation</b>.
* a span can star a new span. <br> <br>
A, B, D and D are spans. Redis is a sub span.<br> 
![image](https://user-images.githubusercontent.com/53778545/211626701-cddd7d8b-9f0e-4d27-973e-ec9ad375ae05.png)
<br><br>

![image](https://user-images.githubusercontent.com/53778545/211647167-4fab96c1-15c6-4251-8ae9-f46f26d80101.png)


To collect traces, instrumentation code needs to be added to the application(or re-use libraries that do so). <br>
Once collected traces should be sent to platforms for visualization (Tempo, Datadog, Jaeger, etc..). <br>
A trace is request scoped (we can't find a trace that does not belong to a request). There is a one to one mapping between one trace and one request. <br>

In high load environment not all request are traced, generally a sampling algorithm is used to only trace a small subset (for example tracing 10% of the requests).<br>

2 major framework allows adding traces to your application: <br>
* OpenTracing
* OpenCensus <br> 

=> Both are merging to form OpenTelemetry (otel). <br>
Usage of any of those, allows an application developer to add instrumentation regardless what technology will be used to visualize them.

```
function foo():
    span = startSpan()
    … // do work
    span.Finish()
```
### How do we get traces from our app?
![image](https://user-images.githubusercontent.com/53778545/211652011-c98afcdf-9a18-4b73-9dc0-9e791a13e992.png) <br> <br>
It's recommended to collect metrics from the app. However, when it comes to traces, it's recommended that the app sends the traces. In fact, the size of the metrics is not bug and causes no problem if we store it in the RAM. On the other side, the size of the traces is very important since every request has a trace.
Another reason is the 'sampling control', it's the app that decides what traces to send. Hence, in practice, the app saves the traces in a local buffer and when that buffer reaches a certain size it send the traces to agent and empties the buffer. <br>
The datadog agent contains an exporter. If we're using opentelemetry, this exporter is the `open telemetry exporter`. <br>
We have to give the address of the exporter when we use the opentelemetry SDK in order to know where to send the traces. (where datadog is working). <br>
In our case datadog works as a daemonSet (A DaemonSet ensures that all (or some) Nodes run a copy of a Pod. As nodes are added to the cluster, Pods are added to them.). Hence we will configure our app in so that each pod, sends the traces to the datadog agent in the same <b>Node</b>. (using the node IP). <br>

# Tracing our factorial app

* Installing the needed nodejs dependencies.
* add this bloc to datadog-values.yaml
```yaml
  otlp:
    receiver:
      protocols:
        grpc:     # grpc is a protocol (like tcp, udp,..)
          enabled: true
```
* add the exporter ip and port to the containers env variable (inside deployment.yaml):
```yaml
          env:
           # The first env  variable gets the host ip (the node ip). 
           # this env variable is not static, it's known in the run time.
            - name: HOST_IP
                  valueFrom:
                    fieldRef:
                      fieldPath: status.hostIP
           # the second env variable uses the previous variable.
            - name: OTEL_EXPORTER_OTLP_ENDPOINT  
              value: "http://$(HOST_IP):55680"
            - name: OTEL_SERVICE_NAME
              value: "fact-service"
```
* Adding traces to the app code.


