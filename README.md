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
- WebSockets -> ws/wss

## How to achieve the real time updates
What we will discuss
- Short polling
    - less simultaneous connections to the server
    - user is not tied to a single server
    - example: youtube live chat - https://www.reddit.com/r/csharp/comments/o0jffx/why_is_youtube_using_polling/
- Long polling
- Server-sent events
- Web sockets

## Evoluciqta na kakavidata

- Shefa iska chat systema
- na lelq ti ginka i spira toka za 10 sekundi
    - reconnect
        - retry
    - a kak da razberem, 4e e disconnected
        - ping pong
        - zatwarq browser
        - spira i toka
- lelq ti ginka si izmislq nqkuw specialen protocol

## Implement full WebSocket connection
