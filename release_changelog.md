** Release 0.3.0 **
- Added dockerfile to create a docker image used to run the IEP node on
docker
- added git ignore file to exclude files from beeing commited
- changed the blockId for TESTNET in the source code to be the same as the
current installation (/testnet)
- Introduced no script which is used to initialize the testnet during
startup of docker container
- Added a template (custom.properties) containing placeholders which are
replaced
- Introducing docker-entrypoint.sh which is called during container
startup. Added APT package curl
- Corrected the blockId for the genesis blockt for testnet2
- Added wait script to wait for IEP to be started. Changed version of
dependency 1.5+ to 1.5.9 since the artifact can not be doanloaded from
jcenter
- Moved base directory to root
- Added ci/cd gitlab config
