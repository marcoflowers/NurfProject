import requests
import time
import pymongo
from pymongo import MongoClient

#setup mongo
client = MongoClient('localhost', 27017)
db = client.test_database
times = db.times
matchIds = db.match_ids
matches = db.matches

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
        #r = requests.get('url'+t["_id"])
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
            sleep(5)
def getMatches():
    url = "https://na.api.pvp.net/api/lol/na/v2.2/match/"
    for t in matchIds.find({"found":0}):
        #r = requests.get('url'+t["_id"])
        r = requests.get('https://www.google.com')
        if(r.status_code == 200):
            #output = r.json()
            output["_id"] = t["_id"]
            matches.insert(output)



            print "Found Match for : "+str(t["_id"])
            matchIds.update({'_id': t["_id"]},{'$inc': {'found': 1}})
        elif(r.status_code == 429):
            sleep(5)

#step 1 update times
getTimes()

#step 2 find match ids at each time
getMatchIds()

#step 3 find match data for each id
getMatches()
