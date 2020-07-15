# How New Zealanders Commute

This project is a visualisation of the commuter data from the 2018 New Zealand
Census.

## The Project

One of the problems I see with map-based visualisations is they look too dense
in high population areas. In this visualisation, I aimed to represent the
geography a little more loosely by using a cartogram approach. Each statistical
area is represented by one point, and I used a custom algorithm to place them on
the map near to their actual location. This means each hexagon represents a
similar size population, helping to reduce this density problem.

Clicking on one of the locations shows a heat map of the number of people who
commute from that location out to other locations. Clicking again reverses the
flow, and a heat map of the number commuters into that location is shown. A
table shows more detailed information. The heat map allows you to click through
the darker spots on the map, giving the sense of the commuting chain/network
which takes place each day in New Zealand.

This visualisation is custom built in the 'd3' graphing framework, with the UI
built in React. I used a hexagonal grid because I think it feels more connected.
Each hexagon was placed on the map in a location such that the total squared
difference of each hexagon to its correct geographic location (statistical area
centroid) is minimised (an example of the Assignment Problem).

The only dataset used is the NZ Census 2018 Commuter View Data, which includes
the locations of each statistical area.

This project was completed by Alex Kennedy (alexk.nz) for the "There and Back
Again" data visualisation competition by Stats NZ.