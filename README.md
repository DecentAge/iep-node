# ⛓️ Infinity Economics Platform (IEP)
Infinity Economics is a new kind of cryptocurrency ecosystem equipped with total financial and economic features

## Table of Contents
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Operators Guide](#operators-guide)
- [Node Services](#node-services)
- [License](#license)
- [Credits](#credits)


## Features

### Prerequisites
#### Java 11 Oracle JVM.
```bash
	echo "deb http://ppa.launchpad.net/linuxuprising/java/ubuntu bionic main" | sudo tee /etc/apt/sources.list.d/linuxuprising-java.list
	sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys 73C3DB2A
	sudo apt update
	sudo apt install oracle-java11-set-default
```
#### Sync your clock

Infinity core uses your computer clock's time, and having the time off too much could cause you to 
reject legit blocks, or miss out on blocks you could have mined. On linux "sudo ntpd -gq", on windows 
go to change date/time, and go to internet time and tell it to sync with a time server.

On Ubuntu
	apt-get install ntp
	dpkg-reconfigure tzdata


#### Build system

Infinity uses https://gradle.org/ as its main build tool.

Gradle is an open source build automation system that builds upon the concepts of 
Apache Ant and Apache Maven and introduces a Groovy-based domain-specific language 
(DSL) instead of the XML form used by Apache Maven of declaring the project 
configuration.

Installing and configuring Gradle
```bash
	https://github.com/gradle/gradle/blob/master/README.md
	https://gradle.org/
	https://gradle.org/install
	https://gradle.org/docs
```

#### Build

./gradle DistZip

### RUN
./gradlew run

## Node Services
### Ubuntu

	File: core.conf

		start on filesystem and started networking
		respawn
		chdir /root/core/bin
		exec ./core

	Location: /etc/init

	Manage Service:

		service core start/stop/restart

### Debian 

	File: core.service

		[Unit]
		Description=Core v0.3.0
		After=network.target

		[Service]
		Restart=always
		WorkingDirectory=/root/core/bin
		ExecStart=/root/core/bin/core

		[Install]
		WantedBy=default.target

	Location: /etc/systemd/system
	
###	Manage Service:

		systemctl enable core.service
		systemctl start core.service
		systemctl status core.service
		
## Operators Guide

### How to prepare my computer to run the core?

The core needs Java 11 Oracle JVM to run. Please download and install java first.
https://www.java.com/en/download/help/download_options.xml


### How to verify the core?

It is **highly** recommended to verify the SHA256 signature every time you download 
new version.
  

### How to configure the core?

There are many configuration parameters that could be changed, but the defaults
are set so that normally you can run the program immediately after unpacking,
without any additional configuration. To see what options are there, open the
conf/custom.properties file. You do not need to delete the defaults packaged in 
core.jar, the settings in conf/custom.properties override those properties. 
This way, when upgrading the software, you can safely overwrite those in core.jar
with the updated file from the new package, while your customizations remain
safe in the conf/custom.properties file.


### How to make the core API public accessible?
To make your node public accessible and allow client connections you have to
uncomment these three lines (just remove #) and change the admin password in
your conf/custom.properties file.

 - xin.allowedBotHosts=*; 127.0.0.1; localhost; [0:0:0:0:0:0:0:1];
 - xin.apiServerHost=0.0.0.0
 - xin.adminPassword=***yourOwnRandomPassword***

In default mode you can connect your wallet to your local node anytime on the fly 
by changing the API node in 'options/nodes and connection' to LOCAL_HOST. Some 
features like block generation and shuffling asking for a local node due to 
security reasons.

NOTE: Don't forget to set a new admin password and don't use any secret phrase
from your wallet/account!


### How long does it take to sync the chain?
This depends on your computer, internet connection and block height. At current 
block height 600000 it takes around 60 min. in average to get in sync with chain.


### How to update the core?
Just unpack a new version over the existing installation directory then run
the new core. The core will upgrade the database if necessary. Check the custom
properties file (/core/bin/conf) and adjust as needed.


### How to allow forging?
Open custom.properties in /core/bin/conf and set: 

 xin.allowedToForge=SPECIFIC ACCOUNT or * for all
 xin.maxNumberOfForgers=100

Restart the node.


### How to allow ledger view?
Open custom.properties in /core/bin/conf and set: 

 xin.ledgerAccounts=SPECIFIC ACCOUNT or * for all
 xin.ledgerTrimKeep=30000

Restart the node.


### How to allow shuffling view?
Open custom.properties an set the properties: 

 xin.maxNumberOfShufflers=30

Restart the node.


### How to allow funding monitor?
Open custom.properties in /core/bin/conf and set: 

xin.maxNumberOfMonitors=30

Restart the node.

## License
Copyright � 2016-2017 Infinity Community.

This program is free software; you can redistribute it and/or
modify it under the terms of the GNU General Public License version 2,
as published by the Free Software Foundation.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU General Public License version 2 for more details.

You should have received a copy of the GNU General Public License version 2
along with this program in the file COPYING.txt. If not, see
<https://www.gnu.org/licenses/old-licenses/gpl-2.0.txt>.

This software also incorporates work under the MIT license.


Copyright � 2013-2015 The Nxt Core Developers.


This program is free software; you can redistribute it and/or
modify it under the terms of the GNU General Public License version 2,
as published by the Free Software Foundation.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU General Public License version 2 for more details.

You should have received a copy of the GNU General Public License version 2
along with this program in the file COPYING.txt. If not, see
<https://www.gnu.org/licenses/old-licenses/gpl-2.0.txt>.


The Nxt core development team will consider granting exceptions to allow use of
this software under a different license on a case by case basis. Please see the
DEVELOPER-AGREEMENT.txt file describing the developer agreement on copyright
and licensing policies, and the AUTHORS.txt file for individual copyright holder
information.

The client UI component of this software, located under /html/ui, is distributed
under the MIT license, a copy of which is available under /html/ui/LICENSE.txt.

This software uses third party libraries, distributed under licenses described
in 3RD-PARTY-LICENSES.txt.

This software also incorporates work previously released with the NRS v1.4.18
(and earlier) stable versions under the MIT license. To comply with the
requirements of that license, the following permission notice, applicable to
those parts of the code only, is included below:


   Copyright � 2013-2015 The Nxt Core Developers.

   Permission is hereby granted, free of charge, to any person obtaining a copy
   of this software and associated documentation files (the "Software"), to deal
   in the Software without restriction, including without limitation the rights
   to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
   copies of the Software, and to permit persons to whom the Software is
   furnished to do so, subject to the following conditions:

   The above copyright notice and this permission notice shall be included in
   all copies or substantial portions of the Software.

   THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
   IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
   FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
   AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
   LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
   OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
   THE SOFTWARE.


## Credits
We use alot of open source software at Infiity. We would like to send a big thank you to the 
following projects and the thousands of conributors that help make open source great!

This application uses Open Source components. You can find the source code of their open source 
projects along with license information/link below. We acknowledge and are grateful to these 
developers for their contributions to open source.

NXT 1.8.3
https://bitbucket.org/JeanLucPicard/nxt/src

BURST 1.0.0
https://github.com/BurstProject/burstcoin

TenderMint Core
https://github.com/tendermint/tendermint

Tendermint Socket Protocol (TMSP)
https://github.com/tendermint/tmsp

IPFS - The Permanent Web
https://github.com/ipfs/ipfs

ZeroNet - Decentralized Websites 
https://github.com/HelloZeroNet/ZeroNet

## Thanks