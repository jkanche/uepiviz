# µEpiviz

The goal of this is to explore alternative approaches (as compared to d3) to render large datasets very quickly. 

The library uses 

- Web Workers - to render data in a background thread
- OffScreenCanvas - the only dom element that can be accessed from a web worker. 

Using the best of these two, once can imagine speeding up visualization or rendering by switching this process to web workers. 

## Install 

Nothing to install much (yet), everything is written to work straight off the box. 

## Run

a simple web server either through python or php should suffice

```
php -S localhot:8899

or 

python -m http.server 8899
```

and then navigate to the page with the port you use