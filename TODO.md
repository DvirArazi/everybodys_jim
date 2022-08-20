[V] add fonts
[V] add blue background
[V] style title
[V] style card
[V] make styled button
[V] make start game button only active when there are at least
    two personalities and both are have all attributes confirmed
[V] make Personalities box and start game button appear only
    when there are personalities on screen. leave a message of
    "share the link to invite players to join the game"
[V] make it so only personalities with a name are not invisible
[ ] use cookies to enable player to reconnect to room
[V] make description expand with the text
[V] make description not accept newlines
[ ] make it so a numberpad pops up instead of a keyboard for mobile
    in scorebox
[ ] set ordered list
[ ] enable start button by the ordered list
[V] figure out node + browser debugging
[ ] create the new routing system of
            client                                       server
    send path + entries ->
                                     --------- send relevant {id + roomcode + role}s
                                     V          if none - send new construction, if one - send construction                       
                         let user choose -------|-\
                                                | |
                                                | |
    construct              <--------------------/ \-> send construction
           /\-----------------------------------------------/
