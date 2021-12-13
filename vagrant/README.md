## Snowledge project
Web application for showing snow information. The application is produced in Software Project course at Tampere University.

## Creating an environment for development of the application
1. Download and install Vagrant and Virtual Box, or some other virtualization program
2. Navigate to the vagrant folder under the cloned project folder and enter the command "vagrant up"
3. After the virtual machine has booted, log in with the command "vagrant ssh"
4. Navigate to the shared folder, which is the vagrant folder two folder levels above the entry
5. Navigate to the src folder under the vagrant folder on virtual machine
6. Install the packages with the command "npm install" on virtual machine

(RECOMMENDATION: Install following npm packages on your own machine by doing steps 7-8 on another console without connecting to a virtual machine. This may work better.) 

7. Navigate to the src/map-app path in project folder on local machine or to /vagrant/src/map-app inside virtual machine 
8. Run "npm install" and "npm run watch" 
9. Start the server with the command "sudo node app.js" in path /vagrant/src on virtual machine

If the screen shows "Listening to port 3000" and "Listening to port 443" you can connect to the server with a browser (http://localhost:3000/) 
