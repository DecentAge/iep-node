import { Injectable } from "@angular/core";
import { HttpProviderService } from "../../services/http-provider.service";
import { NodeService } from "../../services/node.service";
import { AppConstants } from "../../config/constants";
import { OptionService } from "../../services/option.service";
import { CommonService } from "../../services/common.service";
import { SessionStorageService } from "../../services/session-storage.service";
import { TransactionService } from "../../services/transaction.service";

@Injectable()
export class AccountService {
  constructor(
    public http: HttpProviderService,
    public nodeService: NodeService,
    public optionsService: OptionService,
    public commonsService: CommonService,
    public sessionStorageService: SessionStorageService,
    public transactionService: TransactionService
  ) {}

  getAccountTransaction(account, firstIndex, lastIndex, type, subtype): any {
    let params = {
      requestType: "getBlockchainTransactions",
      account: account,
      firstIndex: firstIndex,
      lastIndex: lastIndex,
      type: type,
      subtype: subtype
    };
    return this.http.get(
      this.nodeService.getNodeUrl(
        this.optionsService.getOption("CONNECTION_MODE", ""),
        this.optionsService.getOption("RANDOMIZE_NODES", "")
      ),
      AppConstants.accountConfig.accountEndPoint,
      params
    );
  }

  getAccountUnconfirmedTransactions(account): any {
    let params = {
      requestType: "getUnconfirmedTransactions",
      account: account
    };

    return this.http.get(
      this.nodeService.getNodeUrl(
        this.optionsService.getOption("CONNECTION_MODE", ""),
        this.optionsService.getOption("RANDOMIZE_NODES", "")
      ),
      AppConstants.accountConfig.accountEndPoint,
      params
    );
  }

  getAccountDetails(accountRS) {
    let params = {
      requestType: "getAccount",
      includeAssets: "true",
      includeCurrencies: "false",
      includeEffectiveBalance: "true",
      includeLessors: "true",
      account: accountRS
    };

    return this.http.get(
      this.nodeService.getNodeUrl(
        this.optionsService.getOption("CONNECTION_MODE", ""),
        this.optionsService.getOption("RANDOMIZE_NODES", "")
      ),
      AppConstants.accountConfig.accountEndPoint,
      params
    );
  }

  getAccountLessors(accountRS) {
    let params = {
      requestType: "getAccount",
      includeLessors: "true",
      includeCurrentHeight: "true",
      includeEffectiveBalance: "true",
      account: accountRS
    };
    return this.http.get(
      this.nodeService.getNodeUrl(
        this.optionsService.getOption("CONNECTION_MODE", ""),
        this.optionsService.getOption("RANDOMIZE_NODES", "")
      ),
      AppConstants.accountConfig.accountEndPoint,
      params
    );
  }

  getAccountDetailsFromSession(keyName) {
    let accountDetails = this.sessionStorageService.getFromSession(
      AppConstants.loginConfig.SESSION_ACCOUNT_DETAILS_KEY
    );
    if (keyName) {
      return accountDetails[keyName];
    }
    return accountDetails;
  }

  createPhasedTransaction(params) {
    return this.transactionService.createTransaction(params, "", "");
  }

  createTransaction(
    senderPublicKey,
    recipientRS,
    amount,
    fee,
    data,
    nonce,
    recipientPublicKey
  ) {
    let params: any = {
      requestType: "sendToken",
      recipient: recipientRS,
      amountTQT: parseInt(amount, 10),
      publicKey: senderPublicKey,
      feeTQT: parseInt(
        (fee * AppConstants.baseConfig.TOKEN_QUANTS).toString(),
        10
      ),
      deadline: this.optionsService.getOption("DEADLINE", ""),
      broadcast: "false",
      messageToEncryptIsText: "true",
      compressMessageToEncrypt: "true",
      encryptedMessageData: data,
      encryptedMessageNonce: nonce,
      encryptedMessageIsPrunable: "false",
      recipientPublicKey: recipientPublicKey
    };

    return this.transactionService.createTransaction(params, "", "");
  }

  broadcastTransaction(transactionBytes): any {
    let params = {
      requestType: "broadcastTransaction",
      transactionBytes: transactionBytes
    };

    return this.http.post(
      this.nodeService.getNodeUrl(
        this.optionsService.getOption("CONNECTION_MODE", ""),
        this.optionsService.getOption("RANDOMIZE_NODES", "")
      ),
      AppConstants.accountConfig.accountEndPoint,
      params
    );
  }

  setAccountInfo(publicKey, name, description, fee) {
    let params = {
      requestType: "setAccountInfo",
      publicKey: publicKey,
      name: name,
      description: description,
      feeTQT: parseInt(
        (fee * AppConstants.baseConfig.TOKEN_QUANTS).toString(),
        10
      ),
      deadline: this.optionsService.getOption("DEADLINE", ""),
      broadcast: "false"
    };
    return this.transactionService.createTransaction(params, "", "");
  }

  searchAccounts(query) {
    let params = {
      requestType: "searchAccounts",
      query: query
    };

    return this.http.get(
      this.nodeService.getNodeUrl(
        this.optionsService.getOption("CONNECTION_MODE", ""),
        this.optionsService.getOption("RANDOMIZE_NODES", "")
      ),
      AppConstants.accountConfig.accountEndPoint,
      params
    );
  }

  setBalanceLeasing(
    senderPublicKey,
    recipientRS,
    period,
    fee,
    data,
    nonce,
    recipientPublicKey
  ) {
    let params = {
      requestType: "leaseBalance",
      recipient: recipientRS,
      period: parseInt(period, 10),
      publicKey: senderPublicKey,
      feeTQT: parseInt(
        (fee * AppConstants.baseConfig.TOKEN_QUANTS).toString(),
        10
      ),
      deadline: this.optionsService.getOption("DEADLINE", ""),
      broadcast: "false",
      messageToEncryptIsText: "true",
      compressMessageToEncrypt: "true",
      encryptedMessageData: data,
      encryptedMessageNonce: nonce,
      encryptedMessageIsPrunable: "false",
      recipientPublicKey: recipientPublicKey
    };

    return this.transactionService.createTransaction(params, "", "");
  }

  blockGeneration(mode, secret, node) {
    let baseUrl = "";
    if (node !== "LOCAL_HOST") {
      baseUrl = this.nodeService.getNodeUrl(
        this.optionsService.getOption("CONNECTION_MODE", ""),
        this.optionsService.getOption("RANDOMIZE_NODES", "")
      );
    } else {
      baseUrl = this.nodeService.getLocalNodeUrl();
    }

    let command = "getForging";
    switch (mode) {
      case 0:
        command = "getForging";
        break;
      case 1:
        command = "startForging";
        break;
      case 2:
        command = "stopForging";
        break;
    }

    let params = {
      requestType: command,
      secretPhrase: secret
    };
    return this.http.post(
      baseUrl,
      AppConstants.accountConfig.accountEndPoint,
      params
    );
  }

  searchAlias(query) {
    let params = {
      requestType: "getAliasesLike",
      aliasPrefix: query
    };
    return this.http.get(
      this.nodeService.getNodeUrl(
        this.optionsService.getOption("CONNECTION_MODE", ""),
        this.optionsService.getOption("RANDOMIZE_NODES", "")
      ),
      AppConstants.accountConfig.accountEndPoint,
      params
    );
  }

  getVoterPhasedTransactions(account, firstIndex, lastIndex): any {
    let params = {
      requestType: "getVoterPhasedTransactions",
      account: account,
      firstIndex: firstIndex,
      lastIndex: lastIndex
    };

    return this.http.get(
      this.nodeService.getNodeUrl(
        this.optionsService.getOption("CONNECTION_MODE", ""),
        this.optionsService.getOption("RANDOMIZE_NODES", "")
      ),
      AppConstants.accountConfig.accountEndPoint,
      params
    );
  }

  approveTransactions(
    accountPublicKey,
    transactionFullHash,
    fee,
    revealedSecret?
  ) {
    let params = {
      requestType: "approveTransaction",
      transactionFullHash: transactionFullHash,
      revealedSecret: revealedSecret,
      revealedSecretIsText: true,
      publicKey: accountPublicKey,
      feeTQT: parseInt(
        (fee * AppConstants.baseConfig.TOKEN_QUANTS).toString(),
        10
      ),
      deadline: this.optionsService.getOption("DEADLINE", ""),
      broadcast: "false"
    };

    return this.http.post(
      this.nodeService.getNodeUrl(
        this.optionsService.getOption("CONNECTION_MODE", ""),
        this.optionsService.getOption("RANDOMIZE_NODES", "")
      ),
      AppConstants.accountConfig.accountEndPoint,
      params
    );
  }

  getPhasingOnlyControl(account): any {
    let params = {
      requestType: "getPhasingOnlyControl",
      account: account
    };

    return this.http.get(
      this.nodeService.getNodeUrl(
        this.optionsService.getOption("CONNECTION_MODE", ""),
        this.optionsService.getOption("RANDOMIZE_NODES", "")
      ),
      AppConstants.accountConfig.accountEndPoint,
      params
    );
  }

  setAccountControl(publicKey, quorum, accounts, fee): any {
    let params = {
      requestType: "setPhasingOnlyControl",
      controlQuorum: quorum,
      controlWhitelisted: accounts,
      publicKey: publicKey,
      feeTQT: parseInt(
        (fee * AppConstants.baseConfig.TOKEN_QUANTS).toString(),
        10
      ),
      deadline: this.optionsService.getOption("DEADLINE", ""),
      broadcast: "false",
      controlVotingModel: "0"
    };

    return this.http.post(
      this.nodeService.getNodeUrl(
        this.optionsService.getOption("CONNECTION_MODE", ""),
        this.optionsService.getOption("RANDOMIZE_NODES", "")
      ),
      AppConstants.accountConfig.accountEndPoint,
      params
    );
  }

  removeAccountControl(publicKey, fee) {
    let params = {
      requestType: "setPhasingOnlyControl",
      publicKey: publicKey,
      feeTQT: parseInt(
        (fee * AppConstants.baseConfig.TOKEN_QUANTS).toString(),
        10
      ),
      deadline: this.optionsService.getOption("DEADLINE", ""),
      broadcast: "false",
      controlVotingModel: "-1"
    };
    return this.transactionService.createTransaction(params, "", "");
  }

  setPhasingOnlyControl(json) {
    let params = {
      requestType: "setPhasingOnlyControl",
      controlVotingModel: json.controlVotingModel,
      controlQuorum: json.controlQuorum,
      controlMinBalance: json.controlMinBalance,
      controlMinBalanceModel: json.controlMinBalanceModel,
      controlHolding: json.controlHolding,
      controlWhitelisted: json.account,
      controlMaxFees: json.controlMaxFees,
      controlMinDuration: json.controlMinDuration,
      controlMaxDuration: json.controlMaxDuration,
      publicKey: json.publicKey,
      // commented due to fee not passed in function
      // TODO: with instructions to be done like investigage fee param / main functionallity explanation something like that
      // 'feeTQT': parseInt((fee * AppConstants.baseConfig.TOKEN_QUANTS).toString(), 10),
      deadline: this.optionsService.getOption("DEADLINE", ""),
      broadcast: "false"
    };

    return this.http.post(
      this.nodeService.getNodeUrl(
        this.optionsService.getOption("CONNECTION_MODE", ""),
        this.optionsService.getOption("RANDOMIZE_NODES", "")
      ),
      AppConstants.accountConfig.accountEndPoint,
      params
    );
  }

  getAccountProperties(recipient, setter, property, firstIndex, lastIndex) {
    let params = {
      requestType: "getAccountProperties",
      recipient: recipient,
      setter: setter,
      property: property,
      firstIndex: firstIndex,
      lastIndex: lastIndex
    };
    return this.http.get(
      this.nodeService.getNodeUrl(
        this.optionsService.getOption("CONNECTION_MODE", ""),
        this.optionsService.getOption("RANDOMIZE_NODES", "")
      ),
      AppConstants.accountConfig.accountEndPoint,
      params
    );
  }

  setAccountProperty(recipient, property, value, senderPublicKey, fee) {
    let params = {
      requestType: "setAccountProperty",
      publicKey: senderPublicKey,
      feeTQT: parseInt(
        (fee * AppConstants.baseConfig.TOKEN_QUANTS).toString(),
        10
      ),
      deadline: this.optionsService.getOption("DEADLINE", ""),
      broadcast: "false",
      recipient: recipient,
      property: property,
      value: value
    };

    return this.http.post(
      this.nodeService.getNodeUrl(
        this.optionsService.getOption("CONNECTION_MODE", ""),
        this.optionsService.getOption("RANDOMIZE_NODES", "")
      ),
      AppConstants.accountConfig.accountEndPoint,
      params
    );
  }

  deleteAccountProperty(recipient, property, setter, senderPublicKey, fee) {
    let params = {
      requestType: "deleteAccountProperty",
      publicKey: senderPublicKey,
      feeTQT: parseInt(
        (fee * AppConstants.baseConfig.TOKEN_QUANTS).toString(),
        10
      ),
      deadline: this.optionsService.getOption("DEADLINE", ""),
      broadcast: "false",
      property: property,
      recipient: recipient,
      setter: setter
    };

    return this.http.post(
      this.nodeService.getNodeUrl(
        this.optionsService.getOption("CONNECTION_MODE", ""),
        this.optionsService.getOption("RANDOMIZE_NODES", "")
      ),
      AppConstants.accountConfig.accountEndPoint,
      params
    );
  }

  getAccountLedger(account, firstIndex, lastIndex) {
    let params = {
      requestType: "getAccountLedger",
      account: account,
      firstIndex: firstIndex,
      lastIndex: lastIndex
    };

    return this.http.get(
      this.nodeService.getNodeUrl(
        this.optionsService.getOption("CONNECTION_MODE", ""),
        this.optionsService.getOption("RANDOMIZE_NODES", "")
      ),
      AppConstants.accountConfig.accountEndPoint,
      params
    );
  }

  startFundingMonitor(
    property,
    amount,
    threshold,
    interval,
    holding,
    holdingType,
    secretPhrase,
    adminPassword
  ) {
    let params = {
      requestType: "startFundingMonitor",
      property: property,
      amount: amount,
      threshold: threshold,
      interval: interval,
      holding: holding,
      holdingType: holdingType,
      secretPhrase: secretPhrase,
      adminPassword: adminPassword
    };

    return this.http.post(
      this.nodeService.getNodeUrl(
        this.optionsService.getOption("CONNECTION_MODE", ""),
        this.optionsService.getOption("RANDOMIZE_NODES", "")
      ),
      AppConstants.accountConfig.accountEndPoint,
      params
    );
  }

  stopFundingMonitor(
    property,
    holding,
    holdingType,
    account,
    secretPhrase,
    adminPassword
  ) {
    let params = {
      requestType: "stopFundingMonitor",
      property: property,
      holding: holding,
      holdingType: holdingType,
      secretPhrase: secretPhrase,
      account: account,
      adminPassword: adminPassword
    };

    return this.http.post(
      this.nodeService.getNodeUrl(
        this.optionsService.getOption("CONNECTION_MODE", ""),
        this.optionsService.getOption("RANDOMIZE_NODES", "")
      ),
      AppConstants.accountConfig.accountEndPoint,
      params
    );
  }

  getActivationHeights(names) {
    let params = {
      requestType: "getActivationHeights",
      name: this.commonsService.convertToArray(names)
    };

    return this.http.get(
      this.nodeService.getNodeUrl(
        this.optionsService.getOption("CONNECTION_MODE", ""),
        this.optionsService.getOption("RANDOMIZE_NODES", "")
      ),
      AppConstants.accountConfig.accountEndPoint,
      params
    );
  }

  getFundingMonitors(
    property,
    holding,
    holdingType,
    account,
    secretPhrase,
    adminPassword
  ) {
    let params = {
      requestType: "getFundingMonitor",
      property: property,
      holding: holding,
      holdingType: holdingType,
      secretPhrase: secretPhrase,
      adminPassword: adminPassword,
      includeMonitoredAccounts: true
    };

    return this.http.get(
      this.nodeService.getNodeUrl(
        this.optionsService.getOption("CONNECTION_MODE", ""),
        this.optionsService.getOption("RANDOMIZE_NODES", "")
      ),
      AppConstants.accountConfig.accountEndPoint,
      params
    );
  }
  getApprovalAccountList(transactionID) {
    let params = {
      requestType: "getPhasingPollVotes",
      transaction: transactionID
    };
    return this.http.get(
      this.nodeService.getNodeUrl(
        this.optionsService.getOption("CONNECTION_MODE", ""),
        this.optionsService.getOption("RANDOMIZE_NODES", "")
      ),
      AppConstants.accountConfig.accountEndPoint,
      params
    );
  }
}
