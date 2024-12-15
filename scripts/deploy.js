const hre = require("hardhat");

async function main() {
  console.log("Deploying CertificateOfLien contract...");

  const CertificateOfLien = await hre.ethers.getContractFactory("CertificateOfLien");
  const certificateOfLien = await CertificateOfLien.deploy();

  await certificateOfLien.waitForDeployment();

  console.log("CertificateOfLien deployed to:", await certificateOfLien.getAddress());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });