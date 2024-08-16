# Benchmarks

This folder includes multiple setups to compare the **HTTP performance** against `tuono` and other frameworks.

The main goal is to make the comparison as fair as possible enhancing each framework specific 
performance improvements.

Any improvement to the benchmarks or implementation of a different framework is strongly appreciated.

Feel free also to try it with your hardware and open an issue in case you spot significant different results.

## Benchmark setup

In order to make each comparison as fair as possible each framework should contain a single server side
rendered page that requires data from the backend service.

The data returned by the backend service should be a JSON including a random number between 0 and 10.

```json
{
    "data": 0
}
```

Then the benchmark is triggered by running the production server and query the `/` endpoint with [wrk](https://github.com/wg/wrk) 
to mock an heavy network load over the application server.

## Results

```
// Tuono
> tuono build

> cargo run --release

> wrk -t12 -c400 -d30s http://localhost:3000/

Running 30s test @ http://localhost:3000/
  12 threads and 400 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency    69.13ms  149.25ms   1.81s    88.24%
    Req/Sec    11.52k    12.76k   36.27k    68.64%
  4112347 requests in 30.06s, 3.03GB read
Requests/sec: 136796.43
Transfer/sec:    103.09MB
```

```
// NextJs pages router
> pnpm build

> pnpm start

> wrk -t12 -c400 -d30s http://localhost:3000/

Running 30s test @ http://localhost:3000/
  12 threads and 400 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency   179.44ms   80.47ms   1.99s    86.03%
    Req/Sec   175.00    102.16     1.12k    76.97%
  48510 requests in 30.08s, 69.58MB read
  Socket errors: connect 0, read 0, write 0, timeout 298
Requests/sec:   1612.85
Transfer/sec:      2.31MB
```

```
// NextJs app router
> pnpm build

> pnpm start

> wrk -t12 -c400 -d30s http://localhost:3000/

Running 30s test @ http://localhost:3000/
  12 threads and 400 connections
  Thread Stats   Avg      Stdev     Max   +/- Stdev
    Latency   577.15ms  122.46ms   1.99s    81.42%
    Req/Sec    84.17     78.74   323.00     77.03%
  19285 requests in 30.09s, 86.61MB read
  Socket errors: connect 0, read 0, write 0, timeout 199
Requests/sec:    640.90
Transfer/sec:      2.88MB
```

