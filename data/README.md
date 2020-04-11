# Data Gathering

This readme describes the data gathering of our bachelor's project

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

The project uses pipenv to handle dependencies. Make sure pipenv is installed. 

```
pip install --user pipenv
```

### Installing

To install the dependencies run.  

```
pipenv install
```

After the installation, it might be useful to set the python version the editor is using to the same. This can be done by edition the file in `.vscide/settings.json` and adding: 
```
"python.pythonPath": "path-to-the-env"
```

### Installing new packages


To install a new package to the project use the pipenv install as so:

```
pipenv install "package-name"
```
This automatically adds the file dependencies to the `pipfile`

## Architecture

### Fetching 
The pipeline is built around the three steps needed to collect the needed data. The first step is to collect the data. The module is handled by the fetching.py script in the `fetch` folder. More info can be found in the readme.  
The script collected the data in excel files placed in the excel-folder. 
### Extracting 
A python script responsible for extracting the excel data can be found in `extrators` folder.

rest is unclear at the moment.

### Querying 
The structure of the database is based upon a composited key of both school name and year in the main table `INSTITUTIONS`.
```
Name             | Year | Grades | etc..
Ida Holsts Skole | 2017 |    291 | etc..
```
Each school has a list of foreign keys such as grades, which relates to an entry of the grades where the school grades are stored. 
The folder `sample_queries` holders some example queries to fetch basic information from the database. 

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

