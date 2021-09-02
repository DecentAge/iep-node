# ⛓️ Infinity Economics Platform (IEP)
Infinity Economics is a new kind of cryptocurrency ecosystem equipped with total financial and economic features

## Table of Contents
- [Features](#features)
- [Getting Started](#getting-started)
- [Prerequisites](#prerequisites)
- [License](#license)
- [Credits](#credits)


## Features

## Getting Started
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

	https://github.com/gradle/gradle/blob/master/README.md
	https://gradle.org/
	https://gradle.org/install
	https://gradle.org/docs


#### Build

./gradle DistZip

### RUN



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