import config
import os
import time
from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.chrome.options import Options


print(config.HEAD)

options = Options()

prefs = {'download.default_directory':  os.getcwd() + '/'}
options.add_experimental_option('prefs', prefs)

options.set_headless(headless=config.HEAD)
browser = webdriver.Chrome(chrome_options=options,
                           executable_path=os.getcwd()+'/assets/chromedriver')


browser.get(
    'https://excel.uddannelsesstatistik.dk/_layouts/15/WopiFrame.aspx?sourcedoc={e3cf4ea5-929b-4772-b000-44ef289724fb}&action=view')


time.sleep(5)

browser.switch_to.frame("WebApplicationFrame")



extrendMenu = browser.find_element_by_id(
    "m_excelWebRenderer_ewaCtl_ExcelViewerHeroDockOverflowMenuLauncher-Small20")


extrendMenu.click()

download = browser.find_element_by_id(
    'm_excelWebRenderer_ewaCtl_Jewel.DownloadCopy-Menu20')

download.click()
