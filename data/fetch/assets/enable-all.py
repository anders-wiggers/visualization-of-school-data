import os 

for filename in os.listdir("../instructions"):
    splitted = filename.split(".")
    if (splitted[len(splitted)-1] == "disabled"):
        dst = splitted[0] + ".json"
        src ='instructions/'+ filename 
        dst ='instructions/'+ dst 
        print(src)
        print(dst)
        os.rename(src, dst)
        print(filename)