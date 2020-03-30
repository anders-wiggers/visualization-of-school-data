import os 

for filename in os.listdir("../instructions"):
    splitted = filename.split(".")
    if (splitted[len(splitted)-1] == "json"):
        dst = splitted[0] + ".disabled"
        src = "../instructions/" + filename 
        dst = "../instructions/" + dst 
        os.rename(src, dst)
        print("Disabled: " + filename)