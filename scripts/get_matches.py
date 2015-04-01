import requests
import time
import pymongo
from pymongo import MongoClient
import json


SECRETS = json.load(open('../secrets.json', 'r'))
if(SECRETS["config"] == "dev"):
    client = MongoClient(SECRETS["dev"]["server"])
    API_KEY = SECRETS["dev"]["API_KEY"]
else:
    client = MongoClient(SECRETS["live"]["server"])
    API_KEY = SECRETS["live"]["API_KEY"]


#setup mongo
db = client.nurf
times = db.times
matchIds = db.match_ids
matches = db.matches
champStats = db.champ_stats
teamComp = db.team_comp



def getTimes():
    new_times = []

    if times.count()==0:
        start_time = 1427778000
        #for loop skips over this one for future times
        new_times.append({"_id":start_time,"found":0})
    else:
        # find greatest time in db
        greatest_time = 0
        for t in times.find():
            if(t["_id"]>greatest_time):
                greatest_time = t["_id"]
        start_time = greatest_time
        print "Greatest time in DB : "+str(start_time)

    current_time = time.time()

    #5 minute increment
    increment = 5
    total_increments = int((current_time-start_time)/(60*increment))
    cur_increment = start_time

    for t in range(0,total_increments):
        cur_increment+=(60*increment)
        new_times.append({"_id":cur_increment,"found":0})
        print "Added new time      : "+str(cur_increment)
    if new_times != []:
        times.insert(new_times)

def getMatchIds():
    url = ""
    # find the times that have found 0
    for t in times.find({"found":0}):
        payload = {'api_key': API_KEY, 'region': 'na','time':t['_id'] }
        #r = requests.get(url, params=payload)
        r = requests.get('https://www.google.com')
        if(r.status_code == 200):
            #output = r.json()

            #for every id we get insert it into the database
            #for matchId in output:
            #    matchIds.insert({"_id":matchId,"found":0})

            #change found to 1
            print "Found MatchIds for : "+str(t["_id"])
            times.update({'_id': t["_id"]},{'$inc': {'found': 1}})
        elif(r.status_code == 429):
            time.sleep(5)
def getMatches():
    url = "https://na.api.pvp.net/api/lol/na/v2.2/match/"
    for t in matchIds.find({"found":0}):
        payload = {'api_key': API_KEY, 'includeTimeline': "true"}
        r = requests.get(url+"Match-Id-3244323", params = payload)
        if(r.status_code == 200):
            output = r.json()
            output["_id"] = t["_id"]

            #insert full match data
            matches.insert(output)

            #get team comps composed of championIds
            team1 = {"comp":[]}
            team2 = {"comp":[]}
            team1["time"] = output["matchDuration"]
            team2["time"] = output["matchDuration"]

            #iterate through particpants
            for participant in output["participants"]:
                if participant["teamId"] == 100:
                    team1["comp"].append(participant["championId"])
                elif participant["teamId"] == 200:
                    team2["comp"].append(participant["championId"])

                champ_id = participant["championId"]
                stats = participant["stats"]
                kills = stats["kills"]
                assists = stats["assists"]
                deaths = stats["deaths"]

                if(champStats.find_and_modify(query = {"_id":champ_id},update={"$inc":{"kills":kills,"assists":assists,"deaths":deaths}}) == None):
                    # if the champ stats is not ther update it
                    champStats.insert({"_id":champ_id,"kills":kills,"assists":assists,"deaths":deaths})
                #print {"_id":champ_id,"kills":kills,"assists":assists,"deaths":deaths}
            for team in output["teams"]:
                if(team["teamId"] == 100):
                    team1["winner"] = team["winner"]
                elif(team["teamId"] == 200):
                    team2["winner"] = team["winner"]

            #insert teamp comps and times
            teamComp.insert(team1)
            teamComp.insert(team2)


            print "Found Match for : "+str(t["_id"])
            matchIds.update({'_id': t["_id"]},{'$inc': {'found': 1}})
        elif(r.status_code == 429):
            time.sleep(5)

#step 1 update times
#getTimes()

#step 2 find match ids at each time
#getMatchIds()

#step 3 find match data for each id
#getMatches()
