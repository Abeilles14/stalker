# Stalker

`Stalker` **is our dynamic object tracking algorithm**

Works in conjunction with GCOM and NGINX to fix gimbal on a target object.
Tracks target object's global position through image metadata.

****Connections****

```
                              |--------------------------------------------------------------------------|
                              |                                                                          |
[Camera]---->[SkyPasta]----[NGINX]----<http/s><websocket>----[Image Retriever]                           |
                              |                                     |                                    |
[Payload]----[ACOM]----<http/s><websocket>                 <http/s><websocket>                  <http/s><websocket>
                              |                                     |                                    |
                        [Stalker backend]                      [Stalker UI]----<http/s><websocket>----[GCOM-X]
```

****Important note****
This repository uses a submodule. Intialize and update it before building with `git submodule init` and `git submodule update`

****Building & running the Docker image****
1. Build the image: `docker-compose build`
2. Run the image: `docker-compose up`

****Building & running SkyStalker****
1. Go to SkyStalker: `cd SkyStalker`
2. Install dependencies: `sudo pip install -r requirements.txt` (need to install opencv seperately for Linux)
3. Update submodule: `git submodule update --init`
4. Run SkyStalker: `sudo python3 skystalker.py`

****Running backend OpenCV tests****
1. Go to backend/autotracking/opencv-tests
2. Add images into media folder as jpg images under media/foldername/input/[images].jpg
3. Add any media paths to be excluded from tests into exclusion.txt
4. Run `python run-tests.py` in the Docker interactive terminal
5. Ouput images which were tracked will be added to media/foldername/output folder

### Endpoints
The backend has several endpoints for interfacing. Here they are:

`GET /images/`

- Called by GCOM-X, 
