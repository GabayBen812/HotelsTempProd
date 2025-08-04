// import OnlineChatbot from "@/assets/animations/lottie/OnlineChatbot.json";
import AppNotifications from "@/assets/animations/lottie/AppNotifications.json";
import LottieAnimation from "@/components/miscellaneous/LottieAnimation";
import CoverImage from "@/assets/animations/lottie/coverimage.png";
import { useTranslation } from "react-i18next";
function VideoShowcaseSection() {
  const { t } = useTranslation();
  return (
    <section className="py-24 px-6">
      <div className="max-w-7xl mx-auto flex gap-4 flex-col">
        <div className="text-center mb-2">
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            {t("landing_page.videos_section.title")}
          </h1>
          <p className="text-lg lg:text-xl text-gray-600 leading-relaxed">
            {t("landing_page.videos_section.subtitle")}
          </p>
        </div>
        <div className="flex gap-4 md:flex-row flex-col">
          <div className="flex-grow bg-[#0A2C46] rounded-3xl shadow-lg shadow-black/20 border-t border-[#3d5963] md:w-1/2 w-full relative">
            <div className="h-[450px]  rounded-lg my-6">
              <img
                src={CoverImage}
                alt="Cover"
                className="rounded-lg shadow-lg  object-contain h-[100%] pr-1"
              />
            </div>
            {/* Strong dark blur transition */}
            <div className="absolute bottom-12 left-0 right-0 h-40 bg-gradient-to-t from-[#0A2C46] via-[#0A2C46]/95 via-[#0A2C46]/70 to-transparent pointer-events-none"></div>

            <div className="text-white py-8 px-6 relative z-10 flex flex-col gap-2">
              <h1 className="text-2xl">
                {t("landing_page.videos_section.site.title")}
              </h1>
              <p className="text-muted-foreground">
                {t("landing_page.videos_section.site.description")}
              </p>
            </div>
          </div>
          <div className="flex-grow bg-[#0A2C46] rounded-3xl border-t border-[#3d5963] md:w-1/2 w-full relative shadow-lg shadow-black/20 ">
            <LottieAnimation
              animationData={AppNotifications}
              height={450}
              loop
              autoplay
              className="my-6 rounded-lg"
            />
            {/* Strong dark blur transition */}
            <div className="absolute bottom-12 left-0 right-0 h-40 bg-gradient-to-t from-[#0A2C46] via-[#0A2C46]/95 via-[#0A2C46]/70 to-transparent pointer-events-none"></div>

            <div className="text-white py-8 px-6 relative z-10 flex flex-col gap-2">
              <h1 className="text-2xl">
                {t("landing_page.videos_section.chatbot.title")}
              </h1>
              <p className="text-muted-foreground">
                {t("landing_page.videos_section.chatbot.description")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default VideoShowcaseSection;
