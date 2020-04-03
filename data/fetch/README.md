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

The Script runs through all instructions in the `instructions` folder. An instruction is a `json` file which contains a set of instructions for the script to execute. Each relevant excel sheet has been given a fetch instruction 

### Instructions

#### Get
The get command navigates to a website

```
{
    "get": "https://sitename.com"
}
```

#### Wait
The wait command waits for x amount of time

```
{
    "wait": "10"
}
```

#### Switch
The switch command changes focus to an iframe window

```
{
    "switch": "WebApplicationFrame"
}
```

#### Click
The click command clicks on an element in the window frame. The click commands can determine the element by
* id
* class
* xpath
* pivotTalbe (special case)
* pivotTalbeExpand (special case)
* pivotTalbeMulti (special case)

```
{
    "click": {
        "find": "xpath",
        "value": "//select[@id='flp_srt_combobox']/option[text()='Institution']"
    }
}
```

## Built With

* [Selenium](https://selenium-python.readthedocs.io/) - Framework for webscraping
* [Pipenv](https://github.com/pypa/pipenv) - Dependency Management
* [Python](https://www.python.org/) - Codeing language

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details