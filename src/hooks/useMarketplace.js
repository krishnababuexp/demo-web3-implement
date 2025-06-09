import { NFT_ADDRESS, nftAbi } from "@/constants/constants";

export function useMintNFT() {
  // const { address } = useAccount();

  // const { config } = usePrepareContractWrite({
  //   address: NFT_ADDRESS,
  //   abi: nftAbi,
  //   functionName: "mint",
  //   args: [], // passed in at call time
  // });

  // const { writeAsync } = useContractWrite(config);

  async function mint(uri) {
    // if (!writeAsync) return;
    // const tx = await writeAsync({ args: [uri] });
    // await tx.wait();
    console.log("Minting NFT");
  }

  return { mint };
}
