import React from "react";
import { BsShieldFillCheck } from "react-icons/bs";
import { BiSearchAlt } from "react-icons/bi";
import { RiHeart2Fill } from "react-icons/ri";

const ServiceCard = ({ color, title, icon, subtitle }) => (
  <div className="bg-white/10 dark:bg-white/5 backdrop-blur-sm rounded-xl p-6 transition-all duration-300 hover:scale-105 hover:bg-white/20 dark:hover:bg-white/10 shadow-lg">
    <div className="flex items-start gap-4">
      <div className={`bg-opacity-20 dark:bg-opacity-30 p-3 rounded-full ${color}`}>
        <div className="text-[#346f8f] dark:text-white">
          {icon}
          </div>
        </div>
        <div>
        <h3 className="mb-2 text-lg font-semibold text-[#346f8f] dark:text-white">{title}</h3>
        <p className="text-[#346f8f]/70 dark:text-white/70 text-sm  leading-relaxed">{subtitle}</p>
      </div>
    </div>
  </div>
);

const Services = () => (
  <section  className="bg-[#d8dede] dark:bg-[#244f6b]  w-full pt-0 pb-16 md:pb-24 -mt-10 ">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
        <h2 className=" text-3xl md:text-4xl font-bold text-[#346f8f] dark:text-white mb-4">
          Services that we
          <span className="block">continue to improve</span>
          </h2>
        <p className="text-[#346f8f]/70 dark:text-white/70 text-lg mx-auto max-w-2xl">
          The best choice for buying and selling your crypto assets, with the
          various super friendly services we offer
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ServiceCard
          color="bg-[#2952E3]"
          title="Security gurantee"
          icon={<BsShieldFillCheck fontSize={21} className="" />}
          subtitle="Security is guranteed. We always maintain privacy and maintain the quality of our products"
        />
        <ServiceCard
          color="bg-[#8945F8]"
          title="Best exchange rates"
          icon={<BiSearchAlt fontSize={21} className="" />}
          subtitle="Security is guranteed. We always maintain privacy and maintain the quality of our products"
        />
        <ServiceCard
          color="bg-[#F84550]"
          title="Fastest transactions"
          icon={<RiHeart2Fill fontSize={21} className="" />}
          subtitle="Security is guranteed. We always maintain privacy and maintain the quality of our products"
        />
        </div>
      </div>
  </section>
);

export default Services;
