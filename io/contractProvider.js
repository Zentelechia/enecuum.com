const Web3 = require(require.resolve('web3'));

class ManagerWorker {
  /**
   *
   * @param provider
   * @param abi
   * @param contractAddress
   */
  constructor({provider, abi, contractAddress}) {
    this.web3 = new Web3(provider);
    this.contract = new this.web3.eth.Contract(abi, contractAddress);
    this.managerAddress = this.contract.currentProvider.getAddress(0);
    this.USERCAP = process.env.ICO_USER_CAP;
  }

  /**
   *
   * @param usercap = Number
   */
  setCap(usercap) {
    this.USERCAP = usercap;
  }

  getCap() {
    return this.USERCAP;
  }

  /**
   *
   * @param wallet = String
   * @param gas = Int
   * @returns {Promise<any>} = data:Object
   */
  addToWhiteList(wallet, gas) {
    return new Promise(resolve => {
      this.contract.methods.managerAddAddressToWhitelist(wallet).send({
        from: this.managerAddress,
        gasPrice: gas
      }).then(res => {
        console.log('from whitelist: ', res);
        resolve({ok: true, status: res.status, data: res});
      }).catch(e => {
        resolve({ok: false, status: e.status, data: e});
      });
    })
  }

  /**
   *
   * @param wallets = Array
   * @returns {Promise<any>} = data:Object
   */
  addBulkToWhitelist(wallets) {
    return new Promise(resolve => {
      this.contract.methods.managerAddAddressesToWhitelist(wallets).send({from: this.managerAddress}).then(res => {
        resolve({ok: true, status: res.status, data: res});
      }).catch(e => {
        resolve({ok: false, status: e.status, data: e});
      });
    })
  }

  /**
   *
   * @param wallet = String
   * @param gas = Int
   * @returns {Promise<any>} = data:Object
   */
  setUserCap(wallet, gas) {
    console.log('usercap: ', this.USERCAP);
    return new Promise(resolve => {
      setTimeout(() => {
        this.contract.methods.managerSetUserCap(wallet, this.USERCAP).send({
          from: this.managerAddress,
          gasPrice: gas
        }).then((res) => {
          console.log('from cap: ', res);
          resolve({ok: true, status: res.status, data: res});
        }).catch(e => {
          resolve({ok: true, status: e.status, data: e});
        });
      }, 60 * 1000);
    });
  }

  /**
   *
   * @param wallets = Array
   * @returns {Promise<any>} = data:Object
   */
  setGroupCap(wallets) {
    return new Promise(resolve => {
      setTimeout(() => {
        this.contract.methods.managerSetUserCap(wallets, this.USERCAP).call().then((res) => {
          resolve({ok: true, status: res.status, data: res});
        }).catch(e => {
          resolve({ok: true, status: e.status, data: e});
        });
      }, 60 * 1000);
    });
  }

  /**
   *
   * @param wallet = String
   * @returns {Promise<any>} = data:Boolean
   */
  checkWhiteList(wallet) {
    return new Promise(resolve => {
      this.contract.methods.whitelist(wallet).call().then(res => {
        resolve({ok: true, data: res});
      }).catch(e => {
        resolve({ok: true, data: e});
      });
    })
  }

  /**
   *
   * @returns {Promise<any>}
   */
  getGasPrice() {
    return new Promise(resolve => {
      this.web3.eth.getGasPrice((err, res) => {
        if (!err) {
          resolve(parseInt(res * 1.2));
        } else {
          resolve(10000000000);
        }
      })
    })
  }
}

module.exports = {
  ManagerWorker
};
