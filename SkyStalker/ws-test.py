import socketio
sio = socketio.Client()

# Called when connected to the server
@sio.event
def connect():
    print('Connected')

# Called when disconnected from the server
@sio.event
def disconnect():
    print('Disconnected')

# Called when a controller event is caught
@sio.event
def controller_event(ss, data):
    print("controller_event:", data)
    # sio.emit('controller_event', data=(ss, data))

sio.connect('http://localhost:6923')
sio.wait()