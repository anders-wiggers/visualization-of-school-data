import glob
import config
import os
import time
import sys
import json
from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.chrome.options import Options
from terminalOutput import Wait

sleepTime = config.SLEEPTIME


def waitForSiteLoad(xpath):
    done = False
    while done == False:
        try:
            expandData = browser.find_element_by_xpath(xpath)
            return expandData
        except:
            time.sleep(sleepTime)


def clickFromPivot(content):
    try:
        element = browser.find_element_by_xpath(
            "//label[contains(text(), '" + content + "')]")
        element.click()
        id = element.get_attribute("id").split("_")[2]
        browser.find_element_by_id("flcb_" + id).click()
    except:
        time.sleep(sleepTime)
        clickFromPivot(content)


def expandPivot(content):
    try:
        element = browser.find_element_by_xpath(
            "//*[contains(text(), '" + content + "')]")
        element.click()
    except:
        time.sleep(sleepTime)
        expandPivot(content)

def pivotTableMulti(content,listNumber):
    try:
        elements = browser.find_elements_by_xpath(
            "//*[contains(text(), '" + content + "')]")

        element = elements[listNumber - 1]
        id = element.get_attribute("id").split("_")[2]
        browser.find_element_by_id("flcb_" + id).click()
    except:
        time.sleep(sleepTime)
        expandPivot(content)



def switchToFrame(to):
    try:
        browser.switch_to.frame(to)
    except:
        time.sleep(sleepTime)
        switchToFrame(to)


def xpathClick(value):
    try:
        browser.find_element_by_xpath(value).click()
    except:
        time.sleep(sleepTime)
        xpathClick(value)


def classClick(value):
    try:
        browser.find_element_by_class_name(value).click()
    except:
        time.sleep(sleepTime)
        classClick(value)


def idClick(value):
    try:
        browser.find_element_by_id(value).click()
    except:
        time.sleep(sleepTime)
        idClick(value)

def progress(doing, pg, op):
    Wait.printProgressBar(pg, op,
                          prefix='Progress:', suffix=' ' * 50, length=50)
    Wait.printProgressBar(pg, op,
                          prefix='Progress:', suffix='Doing: ' + doing, length=50)

def sleep(sleepTime):
    try:
        time.sleep(sleepTime)
    except:
        browser.quit()

options = Options()

path = ''
paths = os.getcwd().split('/')
paths.remove('')
paths.remove('fetch')
for item in paths:
    path = path + "/" + item

prefs = {'download.default_directory':  path + "/excel"}
options.add_experimental_option('prefs', prefs)

options.set_headless(headless=config.HEAD)
browser = webdriver.Chrome(chrome_options=options,
                           executable_path=os.getcwd()+'/assets/chromedriver')

print("Starting Scraping From Web\n")


instructions = glob.glob(os.getcwd()+"/instructions/*.json")


for instruction in instructions:
    with open(instruction) as f:
        data = json.load(f)

    operations = len(data["instructions"])

    progression = 0
    Wait.printProgressBar(progression, operations,
                          prefix='Progress:', suffix='Complete', length=50)

    for command in data["instructions"]:

        if "get" in command:
            progress("get", progression, operations)
            browser.get(command["get"])
        if "wait" in command:
            progress("Waiting for " +
                     str(command["wait"]) + " sec", progression, operations)
            sleep(command["wait"])
        if "switch" in command:
            progress("switch", progression, operations)
            switchToFrame(command["switch"])
        if "click" in command:
            findType = command["click"]["find"]
            value = command["click"]["value"]


            if findType == "xpath":
                progress("Clicking: " + value[:20], progression, operations)
                xpathClick(value)
            if findType == "class":
                progress("Clicking: " + value[:20], progression, operations)
                classClick(value)
            if findType == "id":
                progress("Clicking: " + value[:20], progression, operations)
                idClick(value)
            if findType == "pivotTable":
                progress("Clicking: " + value[:20], progression, operations)
                clickFromPivot(value)
            if findType == "pivotTableExpand":
                progress("Expanding: " + value[:20], progression, operations)
                expandPivot(value)
            if findType == "pivotTableMulti":
                progress("Multi c: " + value[:20], progression, operations)
                numb = command["click"]["listNumber"]
                pivotTableMulti(value,numb)

        progression += 1
        Wait.printProgressBar(progression, operations,
                              prefix='Progress:', suffix=' '*50, length=50)
    print(os.path.basename(instruction) + " Completed")

browser.quit()

"""
browser.get(
    'https://excel.uddannelsesstatistik.dk/_layouts/15/WopiFrame.aspx?sourcedoc={e1597862-3fb5-4b08-a932-79ddb9816146}&action=view')


# Wait.WaitTerminal(5)
time.sleep(5)


browser.switch_to.frame("WebApplicationFrame")

selectFromLabelID('Elevtal Kommune')


# expandData = browser.find_element_by_xpath(
#    "//div[@ondblclick='_Ewa.Gim.tpd(event,false,6,0,0);']")
"""
