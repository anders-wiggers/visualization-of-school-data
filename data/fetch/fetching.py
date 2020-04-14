import glob
import config
import os
import time
import sys
import json
from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.action_chains import ActionChains
from terminalOutput import Wait

sleepTime = config.SLEEPTIME
timeOutTime = config.TIMEOUT


# Timeout class respoisble for timeing out when elements are
# unreactable
class Timeout:
    def __init__(self, attemts):
        self.a = attemts
        self.t = 0

    def inc(self):
        self.t += 1
        print(self.t)
        if(self.t >= self.a):
            return True
        else:
            return False


def waitForSiteLoad(xpath):
    done = False
    while done == False:
        try:
            expandData = browser.find_element_by_xpath(xpath)
            return expandData
        except:
            time.sleep(sleepTime)


# Resposible for clicken on element in pivot table
def clickFromPivot(content, timeout):
    try:
        element = browser.find_element_by_xpath(
            "//label[contains(text(), '" + content + "')]")
        element.click()
        id = element.get_attribute("id").split("_")[2]
        browser.find_element_by_id("flcb_" + id).click()
        return False
    except:
        time.sleep(sleepTime)
        if timeout.inc():
            return True
        else:
            return clickFromPivot(content, timeout)


# Resposible for expanding expandables in the pivottable
def expandPivot(content, timeout):
    try:
        element = browser.find_element_by_xpath(
            "//label[contains(text(), '" + content + "')]")
        element.click()
        return False
    except:
        time.sleep(sleepTime)
        if timeout.inc():
            return True
        else:
            return expandPivot(content, timeout)


# Resposible for clicken on element in pivot table when
# Multiply elements are present
def pivotTableMulti(content, listNumber, timeout):
    try:
        elements = browser.find_elements_by_xpath(
            "//label[contains(text(), '" + content + "')]")
        element = elements[listNumber - 1]
        id = element.get_attribute("id").split("_")[2]
        browser.find_element_by_id("flcb_" + id).click()
        return False
    except:
        time.sleep(sleepTime)
        if timeout.inc():
            return True
        else:
            return pivotTableMulti(content, listNumber, timeout)


# Resposible switching webframes. eg to and <iframe>
def switchToFrame(to):
    try:
        browser.switch_to.frame(to)
    except:
        time.sleep(sleepTime)
        switchToFrame(to)


# Resposible for clicken on element via xpath
def xpathClick(value, timeout):
    try:
        browser.find_element_by_xpath(value).click()
        return False
    except:
        time.sleep(sleepTime)
        if timeout.inc():
            return True
        else:
            return xpathClick(value, timeout)


# Resposible for clicken on element via class name
def classClick(value, timeout):
    try:
        browser.find_element_by_class_name(value).click()
        return False
    except:
        time.sleep(sleepTime)
        if timeout.inc():
            return True
        else:
            return classClick(value, timeout)


# Resposible for clicken on element via element ID
def idClick(value, timeout):
    timeout = Timeout(10)
    try:
        browser.find_element_by_id(value).click()
    except:
        time.sleep(sleepTime)
        if timeout.inc():
            return True
        else:
            return idClick(value, timeout)


# Resposible for draggning element by xpath to
# new X and Y cordinate, X and Y 0,0 are current
# position
def dragAndDrop(value, x, y):
    try:
        element = browser.find_element_by_xpath(
            "//label[contains(text(), '" + value + "')]")
        id = element.get_attribute("id").split("_")[1]
        browser.find_element_by_id("flzlf_" + id)
        action = ActionChains(browser)
        action.drag_and_drop_by_offset(element, x, y).perform()
        return False
    except:
        time.sleep(sleepTime)
        return True


# Terminal progress bar method
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

# Finding base path of data
path = ''
paths = os.path.realpath(__file__).split('/')
paths.remove('')
paths.remove('fetch')
paths.remove('fetching.py')
for item in paths:
    path = path + "/" + item

# Setting download dir for selenium
prefs = {'download.default_directory':  path + "/excel"}
options.add_experimental_option('prefs', prefs)

options.set_headless(headless=config.HEAD)
browser = webdriver.Chrome(chrome_options=options,
                           executable_path=path + '/fetch/assets/chromedriver')

print("Starting Scraping From Web\n")

# Fetching instructions from /instructions
instructions = glob.glob(path + "/fetch/instructions/*.json")

# Running throug all instructions json and performing
# instrcutions in the files.
for instruction in instructions:
    timeOutError = False
    with open(instruction) as f:
        data = json.load(f)

    operations = len(data["instructions"])

    progression = 0
    Wait.printProgressBar(progression, operations,
                          prefix='Progress:', suffix='Complete', length=50)

    for command in data["instructions"]:
        if timeOutError:
            progress("TIMEOUT ERROR", progression, operations)
            break
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
                timeOutError = xpathClick(value, Timeout(timeOutTime))
            if findType == "class":
                progress("Clicking: " + value[:20], progression, operations)
                timeOutError = classClick(value, Timeout(timeOutTime))
            if findType == "id":
                progress("Clicking: " + value[:20], progression, operations)
                timeOutError = idClick(value, Timeout(timeOutTime))
            if findType == "pivotTable":
                progress("Clicking: " + value[:20], progression, operations)
                timeOutError = clickFromPivot(value, Timeout(timeOutTime))
            if findType == "pivotTableExpand":
                progress("Expanding: " + value[:20], progression, operations)
                timeOutError = expandPivot(value, Timeout(timeOutTime))
            if findType == "pivotTableMulti":
                progress("Multi c: " + value[:20], progression, operations)
                numb = command["click"]["listNumber"]
                timeOutError = pivotTableMulti(
                    value, numb, Timeout(timeOutTime))
            if findType == "dragAndDrop":
                progress("Dragging: " + value[:20], progression, operations)
                timeOutError = dragAndDrop(value, command["click"]
                                           ["x"], command["click"]["y"])

        progression += 1
        Wait.printProgressBar(progression, operations,
                              prefix='Progress:', suffix=' '*50, length=50)
    print(os.path.basename(instruction) + " Completed")

browser.quit()
