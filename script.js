let account;

// Check if ethereum is available
if (typeof ethereum !== 'undefined') {
    document.getElementById('connectButton').addEventListener('click', event => {
        let button = event.target;

        // Request accounts
        ethereum.request({ method: 'eth_requestAccounts' }).then(accounts => {
            account = accounts[0];
            console.log(account);
            button.textContent = account;

            // Fetch balance
            ethereum.request({ method: 'eth_getBalance', params: [account, 'latest'] }).then(result => {
                console.log(result);
                let wei = parseInt(result, 16);
                let balance = wei / (10 ** 18);
                console.log(balance + " ETH");
            });
        }).catch(err => {
            console.error("Error connecting to wallet:", err);
        });
    });

    // Check if user is on the correct network (e.g., Network ID 10)
    ethereum.request({ method: 'eth_chainId' }).then(chainId => {
        if (chainId === '0xa') { // 0xa is the network ID for network 10 (Optimistic Ethereum)
            document.getElementById('send-button').addEventListener('click', () => {
                let transactionParam = {
                    to: '0x45B6b39e1Cf8A6b4Ff2720f6BA0089d4574126E5',
                    from: account,
                    value: '0x38D7EA4C68000' // Equivalent to 0.1 ETH in Wei
                };

                ethereum.request({ method: 'eth_sendTransaction', params: [transactionParam] }).then(txhash => {
                    console.log(txhash);
                    checkTransactionConfirmation(txhash).then(r => alert(r));
                }).catch(err => {
                    console.error("Transaction error:", err);
                });
            });
        } else {
            alert("Please switch to the correct network.");
        }
    });
} else {
    console.log("Ethereum is not available. Please install MetaMask.");
}

function checkTransactionConfirmation(txhash) {
    let checkTransactionLoop = () => {
        return ethereum.request({ method: 'eth_getTransactionReceipt', params: [txhash] }).then(r => {
            if (r != null) return 'confirmed';
            else return checkTransactionLoop();
        });
    };

    return checkTransactionLoop();
}
