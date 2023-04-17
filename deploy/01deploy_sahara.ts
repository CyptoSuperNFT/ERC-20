import { ethers, upgrades } from "hardhat";
import { readAddressList, storeAddressList } from "./helper";


async function main() {
  const Sahara = await ethers.getContractFactory("Sahara");
  console.log("Deploying sahara...");

  // Deploy contract, execute 3 transactions: deploy proxy contract, logic contract, and proxyadmin contract
  const sahara = await upgrades.deployProxy(Sahara, [42], { initializer: "initialize" });

  await sahara.deployed();
  console.log(sahara.address, " sahara(proxy) address");

  const admin = await upgrades.getAdminAddress(sahara.address);
  console.log(admin, " AdminAddress");

  const implementation = await upgrades.getImplementationAddress(sahara.address);
  console.log(implementation, " ImplementationAddress");

  const addressList = readAddressList();
  addressList["proxy"] = sahara.address;
  addressList["admin"] = admin;
  addressList["implementation"] = implementation;
  storeAddressList(addressList);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
