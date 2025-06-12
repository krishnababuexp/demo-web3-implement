import ConnectMetamaskButton from "../components/ConnectMetamaskButton";
import ConnectPhantomButton from "../components/ConnectPhantomButton";
import ConnectPrivadoIdButton from "../components/ConnectPrivadoIdButton";
export default function Home () {
  return (
    <div className="flex items-center justify-center min-h-screen overflow-hidden">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-5xl px-4">
        {/* MetaMask */}
        <div className="dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-2xl shadow p-6 text-center flex flex-col gap-4 items-center">
          <img
            src="/assets/img/metamask.png"
            alt="MetaMask"
            width={48}
            height={48}
            className="w-20 h-20 object-contain"
          />
          <h2 className="text-xl font-semibold">Connect MetaMask</h2>
          <ConnectMetamaskButton />
        </div>

        {/* Phantom */}
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-2xl shadow p-6 text-center flex flex-col gap-4 items-center">
          <img
            src="/assets/img/phantom.svg"
            alt="Phantom"
            width={48}
            height={48}
            className="w-20 h-20 object-contain"
          />
          <h2 className="text-xl font-semibold">Connect Phantom</h2>
          <ConnectPhantomButton />
        </div>

        {/* Privado Wallet */}
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-2xl shadow p-6 text-center flex flex-col gap-4 items-center">
          <img
            src="/assets/img/privado_logo.svg"
            alt="Privado Wallet"
            width={48}
            height={48}
            className="w-20 h-20 object-contain"
          />
          <h2 className="text-xl font-semibold">Connect Privado</h2>
          <ConnectPrivadoIdButton />
        </div>
      </div>
    </div>
  );
};