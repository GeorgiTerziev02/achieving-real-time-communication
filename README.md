# Achieving real time communication examples

## Content

- Why real time systems?
- Ways to achieve it
- Protocols
- WebSockets
- Evoluciqta na kakavidata
- Implement WebSocket Connection FE + BE

## Real time systems

Examples are everywhere.

## Ways to achieve it

Note: won't talk about WebRTC
- WebRTC - technology for sharing real time video and voice

What we will discuss
- Short polling
    - bih go polzval ako za da imam po-malko ednovremenni vruzki sus server-a
        - primer: youtube live chat na live stream polzva ss - kwo 6te6e da stane?
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
