#  sudo apt-get install python-dev libusb-1.0-0-dev libudev-dev
#  sudo pip install --upgrade setuptools
#  sudo pip install hidapi


# based on https://blog.thea.codes/talking-to-gamepads-without-pygame/
# depends on https://github.com/trezor/cython-hidapi

import hid
import threading
import time
from stalkerconstants import *
from math import floor

'''
HID-compliant controller interface code.

This code has been tested with the following controllers:
Xbox One Controller (MUST be in Wireless Mode for HID)

The returned controls can be changed based on the mission

There are 3 different types of inputs:
Button: Represented by a boolean value
Analog stick: Represented by X and Y flaoting points. Can use arctan to convert to circular coordiantes.
Trigger Button: Represented by a floating point.

The floating point values are normalized between -1 and 1 or 0 and 1. See monitor_controller.

This code is partially based on
https://blog.thea.codes/talking-to-gamepads-without-pygame/
'''


class XboxControllerHID(object):
    MAX_TRIG_VAL = 256  # 2^8
    MAX_JOY_VAL = 256  # 2^8

    last_command = {}

    connected = False
    gamepad = None

    def __init__(self):
        pass
        # self.initalize_values()
        # self._monitor_thread = threading.Thread(target=self.monitor_controller, args=())
        # self._monitor_thread.daemon = True
        # self._monitor_thread.start()

    # def initalize_values(self):
    #     self.LeftJoystickY = 0
    #     self.LeftJoystickX = 0
    #     self.RightJoystickY = 0
    #     self.RightJoystickX = 0
    #     self.LeftTrigger = 0
    #     self.RightTrigger = 0
    #     self.LeftBumper = 0
    #     self.RightBumper = 0
    #     self.A = 0
    #     self.X = 0
    #     self.Y = 0
    #     self.B = 0
    #     self.LeftThumb = 0
    #     self.RightThumb = 0
    #     self.Back = 0
    #     self.Start = 0
    #     self.LeftDPad = 0
    #     self.RightDPad = 0
    #     self.UpDPad = 0
    #     self.DownDPad = 0

    def list_all_controllers(self):
        for device in hid.enumerate():
            print(
                f"0x{device['vendor_id']:04x}:0x{device['product_id']:04x} {device['product_string']}")

    def find_xbox_controller(self):
        for device in hid.enumerate():
            if "xbox" in device['product_string'].lower():
                return device
        return None

    def setup_connection(self):
        controller = self.find_xbox_controller()
        if controller is not None:
            print("Found controller: {}".format(controller['product_string']))
            self.gamepad = hid.device()
            self.gamepad.open(
                controller['vendor_id'], controller['product_id'])
            self.gamepad.set_nonblocking(True)

    # Returns the buttons/triggers that are required for the specificed control type (mission)
    # Returns a tuple. First item, whether there is a new command. Second item, command.
    def read(self, mission):
        report = self.get_report()

        command = {}
        if mission == Mission.USC_2022_TASK_1.value:
            if (report is None):
                command = {'LeftJoystickX': 0, 'LeftJoystickY': 0, 'RightJoystickX': 0,
                           'RightJoystickY': 0, 'LeftThumb': 0, 'RightThumb': 0, 'A': 0, 'B': 0, 'X': 0, 'Y': 0}
            else:
                command = {"A": report["A"], "B": report["B"], "X": report["X"], "Y": report["Y"],
                           "LeftJoystickX": report["LeftJoystickX"], "LeftJoystickY": report["LeftJoystickY"], "LeftThumb": report["LeftThumb"],
                           "RightJoystickX": report["RightJoystickX"], "RightJoystickY": report["RightJoystickY"], "RightThumb": report["RightThumb"]}
        elif mission == Mission.USC_2022_TASK_2.value:
            if (report is None):
                command = {'JoystickX': 0, 'JoystickY': 0}
            else:
                command = {
                    "JoystickX": report["LeftJoystickX"], "JoystickY": report["LeftJoystickY"]}

        if command == self.last_command:
            return (False, command)
        else:
            self.last_command = command
            return(True, command)

    def get_report(self):
        if(self.gamepad is None):
            self.setup_connection()
        try:
            report = self.gamepad.read(64)
            if report and report[0] == 1:
                report = [
                    report[0],
                    2*report[1]/self.MAX_JOY_VAL-1,
                    # left joystick X, left -> right, 0 -> 1
                    2*float("{:.1f}".format(report[2]/self.MAX_JOY_VAL))-1,
                    2*float("{:.1f}".format(report[3]/self.MAX_JOY_VAL))-1,
                    # left joystick Y, up -> down, 0 -> 1
                    2*float("{:.1f}".format(report[4]/self.MAX_JOY_VAL))-1,
                    2*float("{:.1f}".format(report[5]/self.MAX_JOY_VAL))-1,
                    # right joystick X, left -> right, 0 -> 1
                    2*float("{:.1f}".format(report[6]/self.MAX_JOY_VAL))-1,
                    2*float("{:.1f}".format(report[7]/self.MAX_JOY_VAL))-1,
                    # right joystick Y, up -> down, 0 -> 1
                    2*float("{:.1f}".format(report[8]/self.MAX_JOY_VAL))-1,
                    2*float("{:.1f}".format(report[9]/self.MAX_JOY_VAL))-1,
                    # left trigger 0 -> 1 increasing by steps of 1/3
                    report[10]/3,
                    2*float("{:.1f}".format(report[11]/self.MAX_JOY_VAL))-1,
                    # right trigger 0 -> 1 increasing by steps of 1/3
                    report[12]/3,
                    report[13],  # direction arrow buttons
                    # binary map of ABXY + bumpers
                    [int(i) for i in list('{0:0b}'.format(report[14]))],
                    # binary map of thumbstick buttons
                    [int(i) for i in list('{0:0b}'.format(report[15]))]
                ]

                # Used for converting report's dpad state to up/down/left/right with binary map
                DPadMap = {
                    0: [0, 0, 0, 0],
                    1: [1, 0, 0, 0],
                    2: [1, 0, 0, 1],
                    3: [0, 0, 0, 1],
                    4: [0, 1, 0, 1],
                    5: [0, 1, 0, 0],
                    6: [0, 1, 1, 0],
                    7: [0, 0, 1, 0],
                    8: [1, 0, 1, 0],
                }

                DPadState = DPadMap[report[13]]

                # pad 14 and 15 for fixed-size binary maps
                while len(report[14]) < 8:
                    report[14].insert(0, 0)

                while len(report[15]) < 7:
                    report[15].insert(0, 0)

                # print raw report for debugging purposes
                # print(report)

                return {
                    "LeftJoystickX": round(report[2], 2),
                    "LeftJoystickY": round(report[4], 2),
                    "RightJoystickX": round(report[6], 2),
                    "RightJoystickY": round(report[8], 2),
                    "LeftTrigger": round(report[10], 2),
                    "RightTrigger": round(report[12], 2),
                    "UpDPad": DPadState[0],
                    "DownDPad": DPadState[1],
                    "LeftDPad": DPadState[2],
                    "RightDPad": DPadState[3],
                    "RightBumper": report[14][0],
                    "LeftBumper": report[14][1],
                    "Y": report[14][3],
                    "X": report[14][4],
                    "B": report[14][6],
                    "A": report[14][7],
                    "RightThumb": report[15][0],
                    "LeftThumb": report[15][1]
                }

        except Exception as e:
            self.connected = False
            print(e)


if __name__ == "__main__":
    controller = XboxControllerHID()
    while True:
        a = controller.read(Mission.USC_2022_TASK_1.value)
        if a[0]:
            print(a[1])
