# JavaScript code allowing the control of a RPI based remote control cylinder

[![build status][travis-image]][travis-url]
[![Test coverage][codecov-image]][codecov-url]

**Note:** To obtain general information about the project, click [here](https://opatiny.github.io/rc2/).

## Cite this repository

Océane Patiny, Miguel Angel Asencio Hurtado, & Luc Patiny. (2020, October 3). opatiny/rpi-cylinder: Remote controlled cylinder final JS code (Version v1.0.0). Zenodo. http://doi.org/10.5281/zenodo.4064765

## Abstract

This repository contains the final code that allows the control of a robotic cylinder that rolls when its center of mass is displaced. To induce the movement, a mass is moved inside the cylinder using three high torque servo motors fixed on an equilateral triangle around the cylinder. The code is designed to work on a Raspberry Pi Nano W. This is an adaptation of the program, which was initially conceived to work on a C.H.I.P. Pro (click [here](https://github.com/opatiny/chip) to see the original code). The change had to be made, for C.H.I.P. got bankrupt and the code that we had at that time did not work properly anymore.

Also, note that this is a beginner's project, which implies that a lot of things are not coded optimally.

## Code documentation

To access a description of all the functions implemented in this project, click [here](https://opatiny.github.io/rpi-cylinder/docs/index.html).

## User interface

The goal was to make the user interface as easy as possible, so that even a child would be able to control the cylinder. So, these are the steps you need to follow to make the cylinder work with the final program:

- Turn the cylinder on by placing the batteries in the battery holder.
- Wait for about a minute.
- Connect the device that you want to control to the WiFi "CylinderControl" (password is "CylinderControl").
- Go to a web browser.
- Type `172.16.1.1` + Enter in the address bar.
- Control the cylinder using one of the three available features.

## Technologies used

To run the the scripts on the Raspberry Pi, `Node.js` has been used. Then, to make the debug easier, we passed arguments from the command line to the code. This system has been used during all the development phase. The final control of the cylinder is done through a web page. Since we needed a dynamic web page, we used `WebSockets`, which basically allows to keep an `HTTP` connection open. Finally, `pm2` allows to run scripts at boot. In the final code, the main program that is run using `pm2` is [`src/webControl/index.js`](https://github.com/opatiny/rpi-cylinder/blob/master/src/webControl/index.js).

[travis-image]: https://img.shields.io/travis/opatiny/chip/master.svg?style=flat-square
[travis-url]: https://travis-ci.org/opatiny/chip
[codecov-image]: https://img.shields.io/codecov/c/github/opatiny/chip.svg?style=flat-square
[codecov-url]: https://codecov.io/github/opatiny/chip
