#!/usr/bin/env python
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
    server = SECRETS["live"]["server"]
    API_KEY = SECRETS["live"]["API_KEY"]
    client = MongoClient(SECRETS["live"]["server"])


champs_to_ids = json.load(open('../public/js/data/ids.json', 'r'))
ids = champs_to_ids.values()
print ids
#setup mongo
db = client.nurf
times = db.times
matchIds = db.match_ids

onev = db.onev
shrooms = db.shrooms


champStats = db.champ_stats
teamComp = db.team_comp

def update_solo(champ_id):
    solo_kills = 0
    solo_deaths = 0
    wins = 0
    losses = 0
    for id in ids:
        #create double id
        if id == champ_id:
            return
        together = [int(champ_id),int(id)]
        together.sort()
        together = [str(together[0]),str(together[1])]
        db_id = "-".join(together)
        for item in (onev.find({"_id":db_id})):
            solo_kills += item[str(champ_id)]
            solo_deaths += item[id]
            if(item[str(champ_id)] > item[id]):
                wins +=1
            else:
                losses+=1
    print champ_id
    print solo_kills
    print solo_deaths
    print wins
    print losses
    solo_perc = round(float(wins)/(wins+losses),5)
    print float(wins)/(wins+losses)
    print solo_perc
    print ""
    champStats.find_and_modify(query = {"_id":champ_id},update={'$set':{"solo_kills":solo_kills,"solo_deaths":solo_deaths,"solo_wins":wins,"solo_losses":losses,"solo_perc":solo_perc}})
    print "updated"
for id in ids:
    update_solo(int(id))
