# Everybody's Jim
An implementation of the role-playing game [Everybody's Jim](https://drive.google.com/file/d/10pV7-9lJQFRZTzzAW7kAqcoKpfg2OiMj/view?usp=drivesdk) written in TypeScript.  
Using Node.js for the backend, Express.js for file serving, and Socket.IO for real-time bi-directional WebSocket communication.

## Running the project
- Install [node.js](https://nodejs.org/)
- Clone this project, enter the cloned folder and install dependencies with `npm install`
- Run the project with `npm run build-and-start` and access it at `http://localhost:1234`

## Play
The game is deployed and available to play at https://everybodysjimapp.herokuapp.com

## How to play
### Preperation
The game resembles D&D or similar games in the sense that players can do whatever they decide, as long as it abides by the rules of the game's universe, with the caveat that all of them are playing as the same character - Jim.

To play the game, enter the app's main page and click the "Create a room" button.

<img src="https://user-images.githubusercontent.com/108592948/208256515-8d61a5b9-6276-406e-bfcd-cdc563c9e858.png" alt="create a room" width="200"/>

Now you're the *storyteller*.

As the storyteller, you determine the course of events in the story.
For the players to enter the game, click the "Share room link" button and share the link in whatever way is most convenient to you.

<img src="https://user-images.githubusercontent.com/108592948/208256740-f16ad6ce-c65d-41af-afc9-94b9a144ac44.png" alt="share room link" width="200"/>

Players can join the room either by clicking the link or opening the site and entering the room code given to them by the storyteller. After which they'll be greeted with an empty personality card for them to customize.
Each player has to come up with two abilities that they would be able to use in each turn, and two goals for them to aim to achieve throughout the story, preferably goals that can be achieved multiple times.
It's conventional for the storyteller to explain the setting of the story before the players decide on their abilities and goals so that they are better aligned with the story.

<img src="https://user-images.githubusercontent.com/108592948/208256863-802a45b5-92a9-4d01-a8e5-b782098b0f89.png" alt="create a room" width="200"/>

For the game to begin, the storyteller has to approve all the abilities and goals and score the goals of each player. Goals are scored by an estimation of how difficult they would be to achieve, this is the value that will be added to the total score once said the goal has been achieved. The player with the highest total score at the end of the game - wins!

Once the storyteller has approved and scored every ability and goal, they can press the "start game" button to begin the game.

<img src="https://user-images.githubusercontent.com/108592948/208258489-76c0f698-84c9-47c6-a3ad-8b7bf0df0898.jpg" alt="create a room" width="200"/>

### In game
After starting the game, the page would look like that:

<table>
<tr>
  <th>
    <p>for the storyteller</p>
    <img src="https://user-images.githubusercontent.com/108592948/208266029-6b4df3a5-4984-428a-99dc-89d9bf5524b6.png" alt="create a room" width="200"/>
  </th>
  <th>
    <p>for the personalities</p>
    <img src="https://user-images.githubusercontent.com/108592948/208266523-7ed46825-9a4e-4be5-ae38-32d26b2cf2c2.png" alt="create a room" width="200"/>
  </th>
</tr>
</table>

The storyteller starts by telling the beginning of the story until the main character, Jim, encounters a situation where he has to make a choice. Then the dominant personality (the current player) has to come up with what action they would like to make.

Based on how likely the storyteller evaluates the action to succeed, they will rank it a score from 0 to 9 (with 0 being effortless, to 9 being nearly impossible), by pressing the "Set wheel" button, setting the value, and pressing "continue".

<img src="https://user-images.githubusercontent.com/108592948/208267319-4fed470d-c4c2-434e-b7b5-a951efb80871.png" alt="create a room" width="200"/>

At this point, all personalities except the dominant one have to vote for or against the dominant personality's attempted action, by pressing either the thumb-up or thumb-down buttons, and by doing so, increase or decrease the action's chance for success.
After either everyone has voted, or a minute has passed (in which case every non-vote counts as a thumb-up), the dominant personality can spin the wheel by pressing the "Spin" button.
After the wheel has stopped, if the marker landed on a red surface, it means the attempted action failed, otherwise, means it succeeded. And the storyteller can press the "Continue" button to resume the game, and continue the story in a manner fitting with the outcome of the wheel.

<table>
<tr>
  <th>
    <p>for the storyteller</p>
    <img src="https://user-images.githubusercontent.com/108592948/208268019-ccdf8976-a36f-4afb-a9ac-291d7b5bd8c4.png" alt="create a room" width="200"/>
  </th>
  <th>
    <p>for the dominant personality</p>
    <img src="https://user-images.githubusercontent.com/108592948/208267985-eba6b372-d9f6-44bf-b304-386f77a4d476.png" alt="create a room" width="200"/>
  </th>
  <th>
    <p>for all other peronalities</p>
    <img src="https://user-images.githubusercontent.com/108592948/208267969-4409db61-e7f4-47d4-aa7b-a2a8ffcbfbc8.png" alt="create a room" width="200"/>
  </th>
</tr>
</table>

### Grants and requests
Once a player's goal has been achieved (regardless of whether it was that player's turn or not), the storyteller can grant him the points deserved by pressing the *score* button next to said goal in the player's card, adding an optional explanation and pressing "send". At this point, the player would see an updated total score and a red exclamation mark on his *total score* button. The player can press the *total score* button to see the history of every time a score was added or denied to them.

<table>
<tr>
  <th>
    <p>Score button</p>
    <img src="https://user-images.githubusercontent.com/108592948/208269763-a42e73d1-bceb-4fc1-8563-acfe455f2295.png" alt="create a room" width="200"/>
  </th>
  <th>
    <p>Total score button</p>
    <img src="https://user-images.githubusercontent.com/108592948/208269920-037b16c1-6c21-47c6-8e32-6a44fd83ef86.png" alt="create a room" width="200"/>
  </th>
  <th>
    <p>Records history</p>
    <img src="https://user-images.githubusercontent.com/108592948/208269852-16c014d9-7ea0-4aa7-8204-04f5ab792d6b.png" alt="create a room" width="200"/>
  </th>
</tr>
</table>

In case the storyteller missed a player achieving a goal (which might happens quite often when the game is played with numerous players), the player who achieved a goal may send a score request to the storyteller using the *score* button next to that goal, adding an explanation for how and when they achieved their goal and hitting "send". 
At this point, the storyteller would see a red exclamation mark on their *mail* button. Pressing the button will reveal a window with all the pending requests, which the storyteller can either accept or deny with an optional explanation.
After which the player who sent the request would get a red exclamation mark alerting a new record, and the response added to their record history.

<table>
<tr>
  <th>
    <p>Request window</p>
    <img src="https://user-images.githubusercontent.com/108592948/208270870-70ddfe9f-d4b2-4e53-b3e1-91656ccf09aa.png" alt="create a room" width="200"/>
  </th>
  <th>
    <p>Mail button</p>
    <img src="https://user-images.githubusercontent.com/108592948/208270932-c2646f62-3b86-4ebc-bcd4-a589a39ec94d.png" alt="create a room" width="200"/>
  </th>
  <th>
    <p>Pending requests</p>
    <img src="https://user-images.githubusercontent.com/108592948/208271009-2924d544-2c10-491c-bb70-3caee87633c1.png" alt="create a room" width="200"/>
  </th>
  <th>
    <p>Total score button</p>
    <img src="https://user-images.githubusercontent.com/108592948/208270772-f7ecd81f-11da-4313-af87-26d7954569a1.png" alt="create a room" width="200"/>
  </th>
  <th>
    <p>Records history</p>
    <img src="https://user-images.githubusercontent.com/108592948/208270793-a2f73254-206e-4074-9b4b-517727ac66d8.png" alt="create a room" width="200"/>
  </th>
</tr>
</table>

### Ending the game
The game ends either when the storyteller decides that the story has reached a natural conclusion, at which point they would press the "End game" button at the end of the page.
After that, all players will be presented with a screen showing the cards of every player, with the card of the winner presented on the top of the page in a separate container exclaiming them to be the winner.

<img src="https://user-images.githubusercontent.com/108592948/208271351-be019d52-4e74-4944-a412-6bcb5da782f0.jpg" alt="create a room" width="200"/>

To start a new game with the same players, the storyteller can press the "New game" button at the bottom of the page.
