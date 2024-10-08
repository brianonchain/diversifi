import Link from "next/link";

export default function About() {
  return (
    <div className="flex-1 w-full flex justify-center">
      <div className="py-[40px] sectionSize max-w-[800px] w-full flex flex-col items-center space-y-[40px]">
        <div className="text-5xl leading-tight font-bold text-center">Transparent, hyper-diversified, stablecoin yields</div>
        <div className="text-lg">
          This mission of this protocol is to provide a means to earn 10-30% APR on stablecoins, while mitigating risk by diversifying across 10+ protocols in a single transaction.
        </div>
        <div className="space-y-[12px]">
          <div className="text-2xl font-bold">Why is transparency important?</div>
          <div className="text-lg space-y-[12px]">
            <p>
              After the debacle of FTX, Celsius, Gemini Earn, Hodlnaut, and 10+ similar platforms where &gt; $1 billion of customers' personal savings were lost, being aware of who
              offers <span className="font-bold">true transparency</span> and who offers only a veil of transprancy is of paramount importance. The aforementioned platforms simply
              used the charisma of its leadership, marketing tactics, and obfuscating documentation to project a facade of stability and transparency to attract deposits.
            </p>
            <p>
              Users need to be aware of these <span className="font-bold">red flags</span>. If you read a protocol's Docs and remain confused how yield is earned, then the protocol
              is likely trying to hide information from you. If the team is anonymous, this gives them the freedom to conduct an overt "rug pull", "soft rug", or insider hack at
              any time in the future.
            </p>
            <p>
              At DiversiFi, we want to provide you true transparency. To achieve transparency, we have worked very hard to provide{" "}
              <span className="font-bold">effective educational material</span> so our users can understand how yield is earned, which protocols are used, and how our platform
              operates. While other platforms focus on marketing, we focus on education. Furthermore, <span className="font-bold">our smart contracts are open-sourced</span> and{" "}
              <span className="font-bold">our founders are not anonymous</span>, which are the basics for any truly transparent platform.
            </p>
            <p>
              Using a transparent platform should be your primary strategy to mitigate risk when earning stablecoin yields. If you are earning 10-20% APR on a non-transparent
              platform, your risk exposure may not justify these potential earnings.
            </p>
          </div>
        </div>
        <div className="space-y-[12px]">
          <div className="text-2xl font-bold">Why is diversification important?</div>
          <div className="text-lg space-y-[12px]">
            <p>
              Compared to AAA bonds and money markets (2-6% APR), stablecoin yields in DeFi can be significantly higher (10-30% APR). While DeFi stablecoin yields have near-zero
              default risk from lenders (like AAA bonds), there are many external risks, which have been well documented by{" "}
              <Link href="https://rekt.news/" target="_blank" className="link">
                Rekt
              </Link>
              .
            </p>
            <p>
              Because of these risks, a diversified portfolio is essential. In DeFi, there are many highly rated protocols that allow you to earn 10%+ (some at 30%+). If you are
              earning yield on 10 protocols at an average of 15% APR and, within the year, 1 protocol is unexpectedly attacked, then your final APR is 10%, which still beats the
              performance of the S&P index. Diversification protects your portfolio from these low-probability, catastrophic events.
            </p>
            <p>
              Finally, diversification is meaningless without transparency, as Celsius and others have also claimed to have a diversified portfolio. By offering both transparency
              and diversification, Diversifi aims to provide a better alternative for DeFi users wishing to earn yield on their stablecoins.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
