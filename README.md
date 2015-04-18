## URFwin

This is an entry into [Riot Games' API Challenge](https://developer.riotgames.com/discussion/riot-games-api/show/bX8Z86bm)

URFwin provides summoners with 1v1 champion rankings for URF mode. Using a random
sampling of URF matches provided by the Riot Games API, we give predictions of
which champion will win based on history of kills without any assisting champions.

Data was periodically gathered from buckets of match Ids in the special API URF 
endpoint. We then extracted the kills that had no assistingParticipants and
stored it, rather than storing the whole games data. We also kept track of 
teemo shrooms.


Libraries/Frameworks/Software Used:
JQuery
JQuery-UI
Node.js
Nginx
MongoDB
Python
