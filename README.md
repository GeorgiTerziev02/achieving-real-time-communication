# Achieving real time communication examples

Theory and demo code from an additional lecture led by me on the topic "Real time communication between server and client".

Note: The code is for demo purposes and there might be errors.
  
## Real time systems

System where you receive updates in real time. Usually, achieved with web sockets. For example, take a simple chat app with server and client.

### What we won't talk about
- WebRTC - technology for sharing real time video and voice (available in all browsers)
    - direct peer-to-peer communication (no server needed)
    - https://webrtc.org/
    - https://en.wikipedia.org/wiki/WebRTC
- CRDTs (Conflict-free replicated data structures) - having the same data replicated on several computers
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
  - handshake starts http requrest => upgrades to web socket (also known as handshake)
    - this is done because most of the servers/proxies/firewalls/load ballancers understand http
    - https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status/101

##  What type of servers do we have?
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
  - event loop - (this is front end queue but concept is the same) https://www.youtube.com/watch?v=8aGhZQkoFbQ&t=31s&ab_channel=JSConf
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

### Threaded
![image](https://github.com/user-attachments/assets/ee63eb60-9cf0-4f4f-8b98-f575572a3770)
### Event-based
![image](https://github.com/user-attachments/assets/dc41d3ce-0985-487f-8055-3477beb02f64)


## How can we achieve the real time communication
- Short polling - repeating checks every X seconds.
    - Useful when instant updates aren't critical
    - example: youtube live chat - https://www.reddit.com/r/csharp/comments/o0jffx/why_is_youtube_using_polling/
      - try searching - "Top 50 YouTube Live Sub Count" and view the dev tools tab of the browser
    - joke example: https://www.reddit.com/r/Jokes/comments/evrd45/a_bunny_walks_into_the_bakery/
    - pros:
      - "simple"
      - less simultaneous connections to the server
      - user is not tied to a single server 
    - cons:
      - load
      - latency
- Long polling
  - pros
    - "simple"
    - needs just http
    - not much latency
    - better for real time updates than short polling
  - cons
    - request timeout (browser stuff)
    - load
    - watch out with threaded server
- Server-sent events
  - https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events
  - one directional communication server to client
  - pros
    - "one sided" real time
    - built in reconnect
  - cons
    - supports only text data - UTF8
    - can be limitted by the browser if it not used over HTTP/2 - browser usually allows up to 6 (as far as I remember) connections per domain. You will suffer with multiple tabs.
- Web sockets
  - duplex
  - long living
  - pros
    - realtime
    - fast
    - duplex
    - long living
    - in most general cases - it is simple
  - cons
    - again there is load and should watch out with threaded servers
    - might be blocked by proxies/firewall/custom network
    - watch out with threaded server
    - complexity can grow with the project
      - example sending auth token
    - silent disconenct when one side loses connection
      - thats why you need ping pong mechanism

## Short polling
![image](https://github.com/user-attachments/assets/498f7903-fd30-4884-bf13-c84dd6b6b937)

## Long polling
![image](https://github.com/user-attachments/assets/4d519037-909f-4fc4-9cd6-1ee8d4b5808a)

## Server sent events
![image](https://github.com/user-attachments/assets/fc4a9c82-6612-4432-9f2b-9cf3a5fa0db1)

## Web socket
![image](https://github.com/user-attachments/assets/f934e8c5-8d5f-4884-8896-c505e63a8e8f)


## What is hidden in a real time communication library 

Usually such library has two implementations client and server. What is supported in such library:

#### General (both supported by the client and server implementation of the library):
- allowed transports and initial negotiation to decide the transport protocol between
  - on premise and cloud example
- every send message is wrapped inside an object that has two props event name and data
- ping pong pattern
  - to decide whether to keep the connection alive
  - keep alive ping and timeout interval
- message protocols
  - json
  - binary
  - custom
- operation logging
- every created connection can be customised for each of the properties above => use builder pattern 

#### Client:
- reconnect/retry connect mechanism
  - handle intentional and not intentional disconnects
- stateful reconnect

#### Server:
- connection grouping
- connection identifier (Guid)
- does not have a userId to connection id out of the box
  - this can be achieved simply with a map, but is a normal map enough?
- handle connection
- handle disconnection
- handle event data (name)
- registers the needed middleware on the connection layer of the server

### Example API

Client

```ts
export type EventMessage = {
  eventName: string;
  data: any
};

export type EventHandler = (data: any) => void;

export interface ITransport {
  connect(): Promise<void>;
  send(eventName: string, data: any): void;
  stop(): void;
  onReceiveHandler: EventHandler
  // in this case data is error
  onCloseHandler: EventHandler;
}

export class RealTimeConnection {
  start(): void;
  send(eventName: string, data: any);
  on(eventName: string, handler: any);
  off(eventName: string, handler: any);
  stop(); // intentional disconnect
}
```

Server
```ts

export interface ITransport {
    send(message: Message): void;
}

export class RealTimeConnection {
    private _id: string = uuidv4();

    public get id() {
        return this._id;
    }

    constructor(private transport: ITransport) { }

    public sendMessage(message: Message) {
        this.transport.send(message);
    }
}

// should be singleton
// should also support grouping of connections
export class ConnectionsRegistry {
    private static instance: ConnectionsRegistry | null = null;
    private connections: Map<string, RealTimeConnection>;

    private constructor() {
        this.connections = new Map();
    }

    //...
}
```

### Example libs
- js - https://socket.io/
- .net - https://dotnet.microsoft.com/en-us/apps/aspnet/signalr

## Implement Websocket communication
In the given code implement the WebSocket transport (both on client and on the server).

Docs of the js (client) web socket - https://developer.mozilla.org/en-US/docs/Web/API/WebSocket

Docs of the js (server) web socket - https://www.npmjs.com/package/ws


