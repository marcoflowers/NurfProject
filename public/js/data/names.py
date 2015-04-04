import json

with open('champion.json', 'r') as infile:
    data = json.load(infile)
with open('champions.json', 'w') as outfile:
    json.dump(data['data'].keys(), outfile)
