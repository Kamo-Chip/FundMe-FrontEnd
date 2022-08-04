import { ethers } from "./ethers-5.6.esm.min.js";
import { abi, contractAddress } from "./constants.js";

const connectButton = document.querySelector("#connectButton");
const fundButton = document.querySelector("#fundButton");
const fundInput = document.querySelector("#ethAmount");
const balanceButton = document.querySelector("#balanceButton");
const withdrawButton = document.querySelector("#withdrawButton");

connectButton.onclick = connect;
fundButton.onclick = fund;
balanceButton.onclick = getBalance;
withdrawButton.onclick = withdraw;

async function connect() {
  if (typeof window.ethereum !== "undefined") {
    try {
      await window.ethereum.request({ method: "eth_requestAccounts" });
    } catch (err) {
      console.error(err);
    }
    connectButton.innerText = "Connected";
    const accounts = await ethereum.request({ method: "eth_accounts" });
    console.log(accounts);
  } else {
    connectButton.innerText = "Please install Metamask";
  }
}

async function fund() {
  const ethAmount = fundInput.value;
  console.log(`Funding with ${ethAmount}`);
  if (typeof window.ethereum !== "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, abi, signer);
    try {
      const transactionResponse = await contract.fund({
        value: ethers.utils.parseEther(ethAmount),
      });
      await listenForTransactionMine(transactionResponse, provider);
    } catch (err) {
      console.error(err);
    }
  }
}

function listenForTransactionMine(txResponse, provider) {
  console.log(`Mining ${txResponse.hash}`); //hash code of transaction

  return new Promise((resolve, reject) => {
    provider.once(txResponse.hash, (txReceipt) => {
      console.log(`Completed with ${txReceipt.confirmations} confirmations`);
      resolve();
    })
  });
}

async function getBalance(){
  if(typeof window.ethereum !== "undefined"){
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const balance = await provider.getBalance(contractAddress);
    console.log(ethers.utils.formatEther(balance));
  }
}

async function withdraw(){
  if(typeof window.ethereum !== "undefined") {
    console.log("Withdrawing...");
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, abi, signer);
    try {
      const txResponse = await contract.withdraw();
      await listenForTransactionMine(txResponse, provider);
    }catch(err){
      console.error(err);
    }
  }
}