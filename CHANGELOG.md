# Release 0.3.1
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

---------------------------------------------------------------------------------------
xin-node-0.3.0:
---------------------------------------------------------------------------------------

---------------------------------------------------------------------------------------
xin-node-0.2.2:
---------------------------------------------------------------------------------------

Subscription
- Managing and scaling Subscriptions were complex. Until now. XIN offers decentralized 
  recurring payments that users can initiate and cancel at any time. Subscriptions can
  be timed from daily to yearly.
  The APIs for subscriptions are:
  - sendMoneySubscription
  - subscriptionCancel
  - getSubscription
  - getAccountSubscriptions
  - getSubscriptionsToAccount

Shuffling
- Coin shuffling can be used to perform mixing of XIN, MS currencies (unless
  created as non-shuffleable), or AE assets. Any account can create a new
  shuffling, specifying the holding to be shuffled, the shuffle amount, number
  of participants required, and registration deadline. This is done using the
  shufflingCreate API. The Shuffler is required to keep the user secret phrase 
  in memory, therefore it should be run on a trusted local machine only.
  This feature is based on the paper by Tim Ruffing. Since shuffling takes the 
  secret phrase, this feature is restricted to localhost in main net.
  The APIs for shuffling are: 
  - getAccountShufflings
  - getAllShufflings
  - getAssignedShufflings
  - getHoldingShufflings
  - shufflingCreate
  - shufflingRegister
  - shufflingProcess
  - shufflingVerify
  - startShuffler
  - shufflingCancel
  - stopShuffler
  - getShufflers
  - getShuffling
  - getShufflingParticipants

Escrow
- An escrow service allows safer payment by securely holding a buyer's coins in escrow 
  until the terms of the sale are met and as a result the buyer releases payment to the 
  seller. 
  The APIs for escrow are:
  - sendMoneyEscrow
  - escrowSign
  - getEscrowTransaction
  - getAccountEscrowTransaction

Automated Transactions (AT)
- An Automated Transaction is a "Turing complete" set of byte code instructions which will 
  be executed by a byte code interpreter. Code in an AT will be run by an AT byte code 
  interpreter (a virtual CPU) which will use a fixed amount of memory per program. Automated 
  Transactions (AT) is a technology created by CIYAM Developers and this version is a port 
  from C++. 
  The APIs for automated transactions (AT) are: 
  - createATProgram
  - getAT
  - getATDetails
  - getATLong
  - getATIds
  - getAccountATs
  - getAllATs

Crowdfunding 
- Crowdfunding is the practice of funding a project or venture by raising monetary 
  contributions from a large number of people. Crowdfunding is a form of crowdsourcing 
  and of alternative finance. Crowdfunding is based on currencies and adds additional
  API calls to handle this special currency type more efficient.
  The API for crowdfunding is:
  - getAllCrowdfundings

Locked
- This will enable to lock a certain account using the account public keys. The lock 
  will be active only after certain height for the account. The motivation to add this
  feature is to discourage hackers to even try to hack IEP since funds gained by hacks 
  can be fast and easily blocked (freezed) by the IEP community with majority descison.
  This 'just in case' feature also protects (at some level) exchanges from hacks because
  of fast response times thru the IEP community.

Funding monitor
- The Funding Monitor feature provides monitoring account balances, and their automated 
  replenishment from a funding account, based on account properties set by the funding 
  account to the monitored accounts. token, asset, or currency balances can be monitored. 
  If a balance falls below the configured threshold, a transaction will be submitted to 
  transfer units from the funding account to the monitored account. A transfer will remain 
  pending if the number of blocks since the previous transfer transaction is less than 
  the interval configured for the monitor. Since funding monitor takes the secret phrase
  for funding, this feature is restricted to localhost in main net.
  The APIs for the Funding Monitor feature are: 
   - StartFundingMonitor
   - GetFundingMonitor
   - StopFundingMonitor

Ledger view
- The account ledger feature provides a record of all recent changes to the 
  account balances and the event that caused each change. It is disabled by 
  default for all account, but can be set to track certain accounts only or 
  be enabled for all accounts (*), using the xin.ledgerAccounts property. 
  By default records are kept for the last 30,000 blocks, this can be changed 
  using the xin.ledgerTrimKeep property. The xin.ledgerLogUnconfirmed property 
  controls whether confirmed, unconfirmed, or both types of changes are tracked.
  The APIs for ledger view are: 
  - getAccountLedger
  - getAccountLedgerEntry

Asset deletes with all validations
- Delete assets if no share transactions where made. This feature is available only
  in testnet and needs more testing.
  The APIs for asset deletes are: 
  - getAssetDeletes
  - deleteAsset
  - deleteAssetShares

Admin password check 
- Prevents starting the node if admin password isn't set properly. Since
  various debug features are protected by admin password the proper
  setting is mandatory now. 

Subscription and escrow bug
- While making escrow and subscription transactions the fee to the forger is not 
  added to the forger balance. This was observed in testnet and is adjusted accordingly.

Checksum blocks
- Added checksum blocks at height 500000 and 600000.

Upgraded jetty to current stable
- Upgraded to jetty 9.4.6.v20170531 from 9.3.9.v20160517.

Trim limits to support huge div payments
- A trim after divi payment is causing the core to freeze for certain time until 
  the trim is done. So now we have added the batchcommit size to commit the trim 
  after xin.batchCommitSize records are processed. This will make the node responsive 
  and will only block the write operations on node.

Controlling forgers on node
- Now only the allowed forgers can forge on particular node. This property can be 
  configured using the variable xin.allowedToForge. allowed values empty, * and 
  semicolon separated list of account ids.

Connection pool bug and getAllAts API
- Fix for exausting db connection pool and getAllAts adjustments.

Ledger entries for new transaction types (subscription, at and escrow)
- Now account ledger will support new type of transactions, subscription, escrow
  and auomated transactions.

Support for shifting between different nets
- Enabling to switch between multiple nets easily. Right now supported nets 
  are mainnet, devnet and testnet.

Refactoring genesis class
- This was refactored to use the new ConstantsConfigHelper.java thus enabling 
  to switch between multiple nets easily. Right now supported nets are mainnet, 
  devnet and testnet.

Added getAccountBalances api
- This will retrieve the top balances and the distritbuion of balances in real
  time.

Added getActivationHeights API
- This will give the activation heights of various features used by the wallet
  to 'auto-activate' features on given block heights.
  The APIs to get the current activation heights is: 
   - getActivationHeights

Adjusted escrow signing to support phasing accounts
- Earlier for signing an escrow user has to make a tx with fee 1 XIN. 
  But to support phased transactions it was adjusted to make a tx with 
  min fee of 1 XIN.

Enabling prunable encrypted messages
- Prunable encrypted messages were enabled in wallet and therefore activated
  in core. The maximum size for each such attachment is 42 kb., but when 
  coexisting in the same transaction the sum of the two is still being limited 
  by the maximum payload size of 44880 bytes.
  The APIs for prunable encrypted messages are: 
   - verifyPrunableMessage 
   - getAllPrunableMessages 
   - getPrunableMessage 
   - getPrunableMessages 
   - downloadPrunableMessage 

Increased divi payment fee
- Divi payment fee has been increased from 1 XIN to 10 XIN for each dividend payment.

Added new call to convert unsignedJSON to bytes 
- The API for this conversion is: 
  - unsignedJSONtoBytes

Blocked plain and plain prunable messages
- Now API won't accept plain messages. Also validation will fail for this transaction
  type. We have an option to enable this later if needed.

Fixed AT zero account bug
- AT has stopped the core from generating blocks as user has created an AT with 
  recipient address 0. So now ATs will be marked as stopped if anything goes wrong 
  with it and chain will continue to forge/sync.

Devtools and Devshell
- Utility tools for creating checksums and other admin tasks.

Configuration and properties
- New property settings, allowedToForge restrict to specific, none or all accounts.
  env defines the net on which the core is running, lockedAccounts takes a public key 
  to prevent an account from transact and batchCommitSize defines the chunks for trim.
  - xin.env
  - xin.batchCommitSize
  - xin.lockedAccounts
  - xin.allowedToForge

Compiling core
- Added compile.sh on root to compile the core from sources without the need for
  complex build systems. Needs javac to run.

Blockheights feature release
- Block 655.230 ~ 07 April  / Crowdfunding, Single Dividend, Locked Block, Dividend Fee
- Block 665.400 ~ 14 April  / Shuffling
- Block 675.480 ~ 21 April  / Subsscription
- Block 685.560 ~ 28 April  / Escrow
- Block 695.640 ~ 05 May    / AT

---------------------------------------------------------------------------------------
xin-node-0.1.1:
---------------------------------------------------------------------------------------
Checksum at block 100000, block  200000, block  300000 and block 400000 added.
Minor cleanup and improvements for the forthcoming mandatory 0.2.1 update.
It is a recommended update for all nodes.
---------------------------------------------------------------------------------------
