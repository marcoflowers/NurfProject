import json

ids = json.load(open('../public/js/data/ids.json', 'r'))

values = ids.values()
new={}
for id in values:
    for champ in ids:
        if(id == ids[champ]):
            new[int(id)] = champ
print new
with open('../public/js/data/champs.json', 'w') as outfile:
    json.dump(new, outfile)
