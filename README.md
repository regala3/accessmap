# Senior Design Project

Docker Instructions:<br>
(NOTE: Make sure you have docker desktop installed. I use wsl, so as long as docker desktop is open on my windows side I can use docker commands in my Ubuntu distro. Also make sure you have your node stuff installed so that npm will work.) After pulling all these changes, while in the directory with the Dockerfile, do the following:<br><br>

docker build -t node-application . <br>
docker run -it -p 9000:8080 node-application<br><br>

After these two commands, in your browser go to : localhost:9000  <br><br>

To stop the running container, open a new terminal and do:<br><br>

docker ps<br>
docker stop containerIDHere <br><br>


You can also run it using "npx @tailwindcss/cli -i ./src/input.css -o ./src/output.css --watch
" then "npm run start" commands, but I think the docker way standardizes it so no matter which machine we are on it will work.

To run Environment:

Open the backend and frontend folders in two different terminals.

Run "npm run dev" in both terminals
