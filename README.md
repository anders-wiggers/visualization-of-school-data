# Data Visualisation with Python and JavaScript: Crafting a dataviz toolchain for the web

This repo contains the code to accompany the O'Reilly book [_Data Visualisation with Python and JavaScript_](http://shop.oreilly.com/product/0636920037057.do). It's currently being refined, prior to the book's release in early July 2016.

## Installing Dependencies

The instructions in Chapter 1 _Development Setup_ should provide you with a basic [Anaconda](https://www.continuum.io/downloads) setup, providing the main Python data analysis and visualisation tools. I recommend using a virtual environment, either using Anaconda's _conda_ command:

```sh
$ conda --create pyjsviz anaconda
```

or using [virtualenv](https://virtualenv.pypa.io/en/stable/):

```sh
$ virtualenv pyjsviz
```

With the virtual environment activated, any extra dependencies can be installed using the `requirements.txt` with pip:

```sh
$ pip install -r requirements.txt
```

You should now have all the Python libraries you need.

### Seeding the MonogoDB Nobel-prize database
In order to seed the database with the Nobel-prize winners dataset, use `run.py`:

```sh
$ python run.py seed_db
Seeded the database with 858 Nobel winners
```

You can drop the database like so:

```sh
$ python run.py drop_db
Dropped the nobel_prize database from MongoDB
```

## Using the Jupyter (IPython) Notebooks

There are notebooks to accompany chapters 9, 10 and 11. To use them just run Jupyter (or IPython for older versions) from the command-line in the root directory:

```sh
$ jupyter notebook
...
[I 20:50:56.397 NotebookApp] The IPython Notebook is running at: http://localhost:8888/
[I 20:50:56.397 NotebookApp] Use Control-C to stop this server and shut down all kernels (twice to skip confirmation).
```

You should now be able to select the notebooks from your default web-browser and use them to follow their respective chapters.

## *Note* - D3 version 4
Since the book was published D3 has shifted versions, necessitating some conversion work from existing v3 visualizations. One key change is a flattening of the namespace, e.g.:

- d3.scale.linear ↦ d3.scaleLinear
- d3.geo.path ↦ d3.geoPath

This is an easy adaption. A harder on is the change in the way the `enter` method works, which affects the existing examples of the all important update pattern.

A version 4 compliant Nobel Visualization can be found in the `nobel_viz_D3_v4` directory. The following code snippets from the Nobel barchart show the changes made to the update pattern and the use of the new `merge` method. Because the enter method no longer _magically_ updates its selector we need to merge back the original selection to the newly appended elements (created by data-joining) in order to change their attributes in one go.

D3 Version 3:
```
        var bars = svg.selectAll(".bar")
            .data(data, function(d) {
                return d.code;
            });

        bars.enter().append("rect")
            .attr("class", "bar")
            .attr("x", xPaddingLeft);

        bars
            .classed('active', function(d) {
                return d.key === nbviz.activeCountry;
            })
            .transition().duration(nbviz.TRANS_DURATION)
            .attr("x", function(d) { return xScale(d.code); })
            .attr("width", xScale.rangeBand())
            .attr("y", function(d) { return yScale(d.value); })
            .attr("height", function(d) { return height - yScale(d.value); });

        bars.exit().remove();
```
D3 Version 4:
```
        var bars = svg.selectAll(".bar")
            .data(data, function(d) {
                return d.code;
            });

        bars.enter().append("rect")
            .attr("class", "bar")
            .attr("x", xPaddingLeft)
        .merge(bars)
            .classed('active', function(d) {
                return d.key === nbviz.activeCountry;
            })
            .transition().duration(nbviz.TRANS_DURATION)
            .attr("x", function(d) { return xScale(d.code); })
            .attr("width", xScale.bandwidth())
            .attr("y", function(d) { return yScale(d.value); })
            .attr("height", function(d) { return height - yScale(d.value); });

        bars.exit().remove();
```

## The Nobel Visualization

The Python and JavaScript files for the Nobel Visualization are in the `nobel_viz` subdirectory. These include the config, login and test files demonstrated in the book's appendix:

```
nobel_viz
├── api <-- EVE RESTful API
│   ├── server_eve.py <-- EVE server
│   └── settings.py
├── config.py
├── index.html <-- entry index.html file for static Nobel-viz
├── __init__.py
├── nobel_viz.py <-- Nobel-viz server
├── nobel_viz.wsgi
├── SpecRunner.html
├── static
│   ├── css
│   ├── data
│   ├── images
│   ├── js
│   └── lib
├── templates
│   ├── index.html <-- template for entry html file for dynamic Nobel-viz
│   ├── login.html
│   └── testj2.html
├── test_nbviz.py
├── tests
│   ├── jasmine
│   └── NbvizSpec.js
├── tests.js
└── tests.pyc
```

### Running the Nobel-viz

You can run the Nobel-viz in two ways, one using static-files to emulate an API which can be run without MongoDB and the other using the EVE RESTful API with the Nobel winners dataset seeded by using `run.py`.

#### Running it statically
To run the Nobel-viz statically just run Python's `SimpleHTTPServer` server from the `nobel_viz` directory:

```sh
nobel_viz $ python -m SimpleHTTPServer
Serving HTTP on 0.0.0.0 port 8000 ...
```

If you go to the `http:localhost:8000` URL with your web-browser of choice, you should see the Noble-viz running.

#### Running it dynamically with the EVE-API
To run the Nobel-viz using the EVE RESTful API, first start the EVE server by running it from the `nobel_viz/api` subdirectory:

```sh
nobel_viz/api $ python server_eve.py
 * Running on http://127.0.0.1:5000/ (Press CTRL+C to quit)
...
```
With the API's server running on default port 5000, start the Nobel-viz's Flask server from the `nobel_viz` directory:

```sh
nobel_viz $ python nobel_viz.py
 * Running on http://127.0.0.1:8000/ (Press CTRL+C to quit)
...
```
If you go to the `http:localhost:8000` URL with your web-browser of choice, you should see the Noble-viz running.
