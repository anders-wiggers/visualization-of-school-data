# Data Gathering

One Paragraph of project description goes here

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

### Break down into end to end tests

Explain what these tests test and why

```
Give an example
```

### And coding style tests

Explain what these tests test and why

```
Give an example
```

## Deployment

Add additional notes about how to deploy this on a live system

## Contributing

Please read [CONTRIBUTING.md](https://gist.github.com/PurpleBooth/b24679402957c63ec426) for details on our code of conduct, and the process for submitting pull requests to us.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

