#!/usr/bin/env python
import argparse

import dbus


class GnomeShellTestRunner:

    def __init__(self):
        bus = dbus.SessionBus()
        service = bus.get_object('org.gnome.Shell.TestHelper', "/org/gnome/Shell/TestHelper")
        self._execute = service.get_dbus_method('Execute', 'org.gnome.Shell.TestHelper')

    def run(self, tests, output_file):
        self._execute(tests, output_file)


if __name__ == '__main__':
    PARSER = argparse.ArgumentParser(description=
                                     'Run gnome-shell integration tests')
    PARSER.add_argument('--tests', help='Tests to run')
    PARSER.add_argument('--output_file', default='',
                        help='File path to store the results')
    ARGS = PARSER.parse_args()
    GnomeShellTestRunner().run(ARGS.tests, ARGS.output_file)

