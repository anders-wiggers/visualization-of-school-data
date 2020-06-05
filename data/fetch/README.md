# Web scraping tool for Uddannelsesstatistik.dk

Python Scraper for getting raw Excel files. 

## Getting Started

To run the script a few prerequisites must be fulfilled. The script uses selenium with chromebrowers. The python environment used to develop the script was [Pipenv](https://github.com/pypa/pipenv) which means pipenv is needed to install dependencies.

### Prerequisites

* Pipenv should be installed 
```
sudo apt install pipenv
```
* Google Chrome should be installed on the system 
* A [Chromedrive](https://chromedriver.chromium.org/) matching the Google Chrome installation should be put in the assets folder. 

## Deployment

The script runs through all instructions in the `instructions` folder. An instruction is a `json` file which contains a set of instructions for the script to execute. Each relevant excel sheet has been given a fetch instruction 

### Instructions

#### Get
The get command can be used to navigate to a specified URL. 

```
{
    "get": "https://sitename.com"
}
```

#### Wait
The Wait command can be used to stall the execution for a finite amount of time inputted 

```
{
    "wait": "10"
}
```

#### Switch
The switch command can be used to changes the focus of selenium to an alternative window, such as an iframe window

```
{
    "switch": "WebApplicationFrame"
}
```

#### Click
The click command can be used to perform a mouse click on DOM objects in the window frame. The click commands can detect the DOM element by
* id
The id option can be used when locating an element by the unique id identifier
```
{
    "click": {
        "find": "id",
        "value": "acceptButton"
    }
}
```
* class
The class option can be used when locating an element by the class identifier
```
{
    "click": {
        "find": "class",
        "value": "roundButton"
    }
}
```
* xpath
The xpath option can be used when trying to detect an element based on anything as it can be used to locate an element based on nodes in XHTML document, further detail about xpath can be read in selenium documentation [here](https://selenium-python.readthedocs.io/locating-elements.html#locating-by-xpath)
```
{
    "click": {
        "find": "xpath",
        "value": "//select[@id='flp_srt_combobox']/option[text()='Institution']"
    }
}
```
* dragAndDrop
The dragAndDrop option can be used when an element needs to be dragged to a certain position. The element is located via the text value of the DOM object. Furthermore, the dragAndDrop command has 2 additional option which is the X and Y coordinate to move the object to. 
```
{
    "click": {
        "find": "dragAndDrop",
        "value": "Schoolyear",
	"x": 150,
	"y":0
    }
}
```
* pivotTable 
The pivotTable option can be used to click on a pivot table item in the online excel sheet. 
```
{
    "click": {
        "find": "pivotTable",
        "value": "More Fields",
    }
}
```
* pivotTalbeExpand option can be used to expand a pivot table item in the online excel sheet. 
```
{
    "click": {
        "find": "pivotTableExpand",
        "value": "More Fields",
    }
}
```
* pivotTableMulti 
The pivotTableMulti can be used to click on a pivot table item in the online excel sheet where duplicate entries with no specific id are present.
```
{
    "click": {
        "find": "pivotTableMulti",
        "value": "institution",
	"listNumber": 2
    }
}
```



## Config

The script can be slightly configured with the `config.py` file 
* `HEAD` option determents wheater the browser runs in headless mode, false makes the browser run with head
* `SLEEPTIME` option determents the sleeptime between operations
* `TIMEOUT` determents the number of attempts before continuing to the fetch instruction. In seconds, the timeout time is `SLEEPTIME * TIMEOUT`

## Built With

* [Selenium](https://selenium-python.readthedocs.io/) - Framework for webscraping
* [Pipenv](https://github.com/pypa/pipenv) - Dependency Management
* [Python](https://www.python.org/) - Codeing language

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
