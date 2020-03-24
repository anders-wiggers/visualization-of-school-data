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


def waitForSiteLoad(xpath):
    done = False
    while done == False:
        try:
            expandData = browser.find_element_by_xpath(xpath)
            return expandData
        except:
            time.sleep(0.5)


options = Options()

prefs = {'download.default_directory':  os.getcwd() + '/'}
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

    progress = 0
    Wait.printProgressBar(progress, operations,
                          prefix='Progress:', suffix='Complete', length=50)

    for command in data["instructions"]:
        if "get" in command:
            browser.get(command["get"])
        if "wait" in command:
            time.sleep(command["wait"])
        if "switch" in command:
            browser.switch_to.frame(command["switch"])
        if "click" in command:
            findType = command["click"]["find"]
            value = command["click"]["value"]

            if findType == "xpath":
                browser.find_element_by_xpath(value).click()
            if findType == "class":
                browser.find_element_by_class_name(value).click()
            if findType == "id":
                browser.find_element_by_id(value).click()

        progress += 1
        Wait.printProgressBar(progress, operations,
                              prefix='Progress:', suffix='Complete', length=50)
    print(os.path.basename(instruction) + " Completed")

"""
browser.get(
    'https://excel.uddannelsesstatistik.dk/_layouts/15/WopiFrame.aspx?sourcedoc={e3cf4ea5-929b-4772-b000-44ef289724fb}&action=view')


# Wait.WaitTerminal(5)
time.sleep(5)


browser.switch_to.frame("WebApplicationFrame")


# expandData = browser.find_element_by_xpath(
#    "//div[@ondblclick='_Ewa.Gim.tpd(event,false,6,0,0);']")

expandData = waitForSiteLoad(
    "//div[@ondblclick='_Ewa.Gim.tpd(event,false,6,0,0);']")

expandData.click()

magnify = browser.find_element_by_class_name("ewa-bix-launchButton")

magnify.click()

time.sleep(2)

institution = browser.find_element_by_id("bixflec_17")

institution.click()

browser.find_element_by_id("bixflec_19").click()

browser.find_element_by_id("bixflil_23").click()

browser.find_element_by_id("bix-drill-action-to").click()

time.sleep(1)

browser.find_element_by_xpath("//input[@name='afi.3.1']").click()

time.sleep(1)


browser.find_element_by_id("_ewanode2").click()

browser.find_element_by_xpath("//button[@type='submit']").click()


extrendMenu = browser.find_element_by_id(
    "m_excelWebRenderer_ewaCtl_ExcelViewerHeroDockOverflowMenuLauncher-Small20")


extrendMenu.click()

download = browser.find_element_by_id(
    'm_excelWebRenderer_ewaCtl_Jewel.DownloadCopy-Menu20')

# download.click()

browser.close()

"""
