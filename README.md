# Achieving real time communication examples

  
## Real time systems

System where you receive updates in real time. Usually, achieved with web sockets. For example, take a simple chat app with server and client.

### What we won't talk about
- WebRTC - technology for sharing real time video and voice (available in all browsers)
    - direct peer-to-peer communication (no server needed)
    - https://webrtc.org/
    - https://en.wikipedia.org/wiki/WebRTC
- CRDTs (Conflict free data structures) - having the same data replicated on several computers
    - https://en.wikipedia.org/wiki/Conflict-free_replicated_data_type#Industry_use
    - https://jakelazaroff.com/words/an-interactive-intro-to-crdts/

## Internet Protocols

What is a protocol?

Some protocols:
- Http -> http/https
  - https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Overview
  - one directional - client => server
- WebSockets -> ws/wss
  - https://en.wikipedia.org/wiki/WebSocket
  - duplex
  - faster
  - 2008 first version, supported in chrome since 2009, standardized 2011
  - starts http requrest => upgrades to web socket (also known as handshake)
    - this is done because most of the servers/proxies/firewalls/load ballancers understand http
    - https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/101

## How to achieve the real time updates

### Firstly, what type of servers do we have?
Note: try to always compare threaded vs event driven servers

- Threaded server
  - thread per connection
  - java, c#
  - pros
    - **can run in parallel**
    - simpler "sync" like code - [example](https://github.com/GeorgiTerziev02/My-Social-Media-Api/blob/master/MySocialMedia.Server/Features/Identity/IdentityController.cs)
  - cons
    - more memory
    - context switching
    - think about thread safety
    - os limits for threads
    - idle threads
- Event based
  - one main thread - the code is always executed by it
    - plus some more behind responsible for OS stuff like new data arrived by a tcp connection
  - event loop
  - node.js, python
  - node.js uses [libuv](https://libuv.org/)
  - you can still offload work to worked threads
  - https://nodejs.org/en/learn/asynchronous-work/event-loop-timers-and-nexttick
  - pros
    - can handle more connections - scalable
    - low memory
  - cons
    - try not to block the main thread
    - more complex programming model


### How can we achieve the real time communication
- Short polling - repeating checks every X seconds.
    - Useful when instant updates aren't critical
    - example: youtube live chat - https://www.reddit.com/r/csharp/comments/o0jffx/why_is_youtube_using_polling/
      - try searching - "Top 50 YouTube Live Sub Count" and view the dev tools tab of the browser
    - joke example: https://www.reddit.com/r/Jokes/comments/evrd45/a_bunny_walks_into_the_bakery/
    - pros:
      - simple
      - less simultaneous connections to the server
      - user is not tied to a single server 
    - cons:
      - load
      - latency
- Long polling
- Server-sent events
- Web sockets

## What is hidden in a real time communication library

### Example libs
- js - https://socket.io/
- .net - https://dotnet.microsoft.com/en-us/apps/aspnet/signalr

## Implement Websocket communication
In the given code implement the WebSocket transport (both on client and on the server).

Docs of the js (client) web socket - https://developer.mozilla.org/en-US/docs/Web/API/WebSocket

Docs of the js (server) web socket - https://www.npmjs.com/package/ws


