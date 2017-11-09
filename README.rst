Gnome Shell Tests
######################

Automated integration tests for gnome-shell


Setup
===============================================================
Prerequisites: 
- nmp
- nodejs

Checkout the repository: https://github.com/heber013/gnome-shell-tests

$ cd gnome-shell-tests
$ npm install .
$ npm install -g mocha
$ node testHelperService.js

To run tests
============
$ python3 -m run_gnome_shell_tests --tests "/path/to/tests/*"
You can use any pattern supported by mocha: https://mochajs.org
It will store the results by default in: /tmp/tests_results

You can specify the output file path with:
$ python3 -m run_gnome_shell_tests --tests "/path/to/tests/*" --output_file "/path/to/results"

