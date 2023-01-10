
# What are traces?

* Trace (follow) one request as it flows through an application:
    * Where was the majority of the time spent when processing this request (service or function).
    * Which services were involved to answer this request.
* A trace is a collection of span, where each span belongs to a service and represents an operation.
* a span can star a new span