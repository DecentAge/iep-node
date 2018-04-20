Welcome to Infinity Economics (XIN).

This is the core reference implementation of Infinity.

Using the software
------------------

Dependencies: Java 8 or later has to be installed first. Only the Oracle JVM
has been tested and supported.

There is no installation for core needed. Unpack the zip package to a directory 
of your choice and it will be populated with the core server directory.


Running the server
----------------

Execute the bin/core script if using Linux, or bin/core.bat if using Windows. 
This will start a java server process, which will begin logging its activities 
to the console. The initialization takes a few seconds. When it is ready, you 
should see the message "Node 0.1.0 started successfully". 


Customization
-------------

There are many configuration parameters that could be changed, but the defaults
are set so that normally you can run the program immediately after unpacking,
without any additional configuration. To see what options are there, open the
conf/custom.properties file. You do not need to delete the defaults in core.jar, 
the settings in conf/custom.properties override those properties. This way,
when upgrading the software, you can safely overwrite those in core.jar
with the updated file from the new package, while your customizations remain
safe in the conf/custom.properties file.


Technical details
-----------------
The Infinity core software is a client-server application. It consists of a 
java server process, the one started by the start script, and a client in
a separate build.

To run a node, forge, update the blockchain, interact with peers, only the 
java process needs to be running, so you could logout and close the wallet 
but keep the java process running. The java process communicates with peers 
on port 23456 tcp by default. If you are behind a router or a firewall and want 
to have your node accept incoming peer connections, you should setup port 
forwarding. The server will still work though even if only outgoing connections 
are allowed, so opening this port is optional. The user interface is available 
on port 23457. This port also accepts http API requests which other client 
applications could use.

The blockchain is stored on disk using the H2 embedded database, inside the
fim_db directory. When upgrading, you should not delete the old bin/db
directory, upgrades always include code that can upgrade old database files to
the new version whenever needed. But there is no harm if you do delete the
db folder, except that it will take some extra time to download the blockchain
from scratch.


Build from source
-----------------
See BUILD-INSTRUCTIONS.txt


General usage
-------------
See OPERATORS-GUIDE.txt


Updates
-------
See UPDATE.txt


