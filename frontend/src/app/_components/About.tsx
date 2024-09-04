import Link from "next/link";

const About = () => {
  return (
    <div className="w-full min-h-[400px] flex flex-col items-center px-2 lg:px-0 py-6 xs:py-12 bg-blue1">
      <div className="lg:w-[700px]">
        <div className="flex-col items-center text-4xl xs:text-[45px] leading-tight font-bold text-center">
          Transparent, hyper-diversified, stablecoin yields
        </div>
        <div className="mt-4 text-xl">
          Earn 10-30% APR on stablecoins, while mitigating risk by diversifying across 10+ protocols in a single transaction
        </div>
        <div className="mt-4 text-xl font-bold">Why is transparency important?</div>
        <div className="mt-2 space-y-2 text-base lg:text-sm">
          <p>
            After the fall of Celsius, Gemini Earn, Hodlnaut, and 10+ platforms (where hundreds of millions of customer funds were lost),
            being aware of who offers <span className="font-bold">true transparency</span> and who offers only a veil of transprancy is of
            paramount importance. The aforementioned platforms simply used marketing tactics and obfuscating documentation to project a
            facade of stability and transparency to attract deposits.
          </p>
          <p>
            Users need to be aware of these <span className="font-bold">red flags</span>. If you read a protocol's Docs and remain confused
            how yield is earned, then the protocol is likely trying to hide information from you. If the team is anonymous, this gives them
            the freedom to conduct an overt "rug pull", "soft rug", or insider hack at any time in the future.
          </p>
          <p>
            At Diversifi, we want to provide you true transparency. To achieve transparency, we have worked very hard to provide{" "}
            <span className="font-bold">effective educational material</span> so our users can understand how yield is earned, which
            protocols are used, and how our platform operates. While other platforms focus on marketing, we focus on education. Furthermore,{" "}
            <span className="font-bold">our smart contracts are open-sourced</span> and{" "}
            <span className="font-bold">our founders are not anonymous</span>, which are the basics for any truly transparent platform.
          </p>
          <p>
            Using a transparent platform should be your primary strategy to mitigate risk when earning stablecoin yields. If you are earning
            10-20% APR on a non-transparent platform, your risks may far outweigh your gains. Next, we discuss diversification, which is an
            equally important strategy for risk mitigation.
          </p>
        </div>
        <div className="mt-4 text-xl font-bold">Why is diversification important?</div>
        <div className="mt-2 space-y-2 text-sm">
          <p>
            Compared to AAA bonds and money markets (2-6% APR), stablecoin yields in DeFi can be significantly higher (10-30% APR). While
            DeFi stablecoin yields have near-zero default risk from lenders (like AAA bonds), there are many external risks, which have been
            well documented by{" "}
            <Link href="https://rekt.news/" target="_blank" className="link">
              Rekt
            </Link>
            .
          </p>
          <p>
            Because of these risks, a diversified portfolio is essential. In DeFi, there are many highly rated protocols that allow you to
            earn 10%+ (some at 30%+). If you are earning yield on 10 protocols at an average of 15% APR and, within the year, 1 protocol is
            unexpectedly attacked, then your final APR is 10%, which still beats the performance of the S&P index. Diversification protects
            your portfolio from these low-probability, catastrophic events.
          </p>
          <p>
            Finally, diversification is meaningless without transparency, as Celsius and others have also claimed to have a diversified
            portfolio. By offering both transparency and diversification, Diversifi aims to provide a better alternative for DeFi users
            wishing to earn yield on their stablecoins.
          </p>
        </div>
        <div className="mt-6 text-3xl font-bold">The Team</div>
      </div>
    </div>
  );
};

export default About;
