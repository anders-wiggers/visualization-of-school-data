# Visualization Tool

Visualization tool for displaying and interacting with school data

### Prerequisites

To install the software, the current system most have NodeJS installed

### Installing

To install dependencies simply run NPM install

```
npm install
```


## API endpoints

The API connecting the database to the visualization has a few endpoints 

#### Multi tool API

The multitool fetch API endpoint offers the ability to modify the query 

the base link is 
```js
/api/combine
```
This returns:

```json
...
  {
    "NAME": "10. klasse Gribskov og modtageklasser",
    "YEAR": 2011,
    "REGION": "Region Hovedstaden",
    "COMMUNE": "Gribskov"
  }
...
```
However the input can be modifyed via the query parameter `?`

##### Query Parameters

The query parameters can be combined as by adding a `&` between the parameters

* data

The data parameter determines which data to include in the fetch. This is the most powerful of the parameters.
```html
/API/combine?data=students
```

returns.

```json
...
  {
    "NAME": "10. klasse Gribskov og modtageklasser",
    "YEAR": 2013,
    "id": 1887,
    "total_students": 75
  },
...
```

However, it is now possible to drill deeper with the `>` command

```html
/api/combine?data=socioeconomic>Dansk_Mundtlig
```

returns.

```json
...
   {
    "NAME": "Ida Holsts Skole",
    "YEAR": 2019,
    "id": 4870,
    "Dansk": null,
    "Dansk_Læsning": 4869,
    "Dansk_Mundtlig": 4870,
    "Dansk_Retskrivning": 4871,
    "Dansk_Skriftlig": 4872,
    "Engelsk_Mundtlig": 4873,
    "Fysik_Kemi_Biologi_Geografi_Praktisk_mundtlig": 4874,
    "Gennemsnit_Gennemsnit": 4875,
    "Matematik_Uden_hjælpemidler": 4876,
    "grade_period": 9.2,
    "soc_period": 8.8,
    "dif_period": 0.4,
    "significant_period": 0,
    "grade_real": 8.5,
    "soc_real": 8.5,
    "dif_real": 0,
    "significant_real": 0
  }
...
```


Combining the data query can be done with the `:` command

```html
/api/combine?data=students:planned_hours
```

returns.

```json
...
 {
    "NAME": "Bakkeskolen",
    "YEAR": 2019,
    "id": 25866,
    "total_students": 581,
    "kinder_grade": 1200,
    "first_grade": 1200,
    "second_grade": 1200,
    "third_grade": 1200,
    "fouth_grade": 1320,
    "fifth_grade": 1320,
    "sixth_grade": 1320,
    "seventh_grade": 1400,
    "eighth_grade": 1400,
    "ninth_grade": 1400,
    "tenth_grade": null
  },
...
```

datapoints can always be looked up in the database under the table institution, but in the current iteration are as follows:

Name | Contains 
--- | --- 
**grades** | mean grades, for all male, and female 
**absence** | absence with mean plus ability to drill deeper 
**students** | total students on school 
**well_being** | mean well being on school plus ability to drill to each class 
**planned_hours** | planned hours for each class 
**socioeconomic** | ability to drill to more information on the soc spec

---
* year
```html
/api/combine?year=2012
```
---

* school
```html
/api/combine?school=Sundhøjskolen
```
---

* region
```html
/api/combine?region=Region Syddanmark
```

---


* commune
```html
/api/combine?commune=Aarhus
```


##### Combined Parameters

an example of the combined parameters

```html
/api/combine?school=Sundhøjskolen&year=2019
```





#### Schools

To fetch all schools the use the GET method on endpoint
```html
/api/school
```




## Built With

* [Next.js](https://nextjs.org/) - The web framework used
* [Node](https://nodejs.org/en/) - Dependency Management

## Contributing

Please read [CONTRIBUTING.md](https://gist.github.com/PurpleBooth/b24679402957c63ec426) for details on our code of conduct, and the process for submitting pull requests to us.



## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details